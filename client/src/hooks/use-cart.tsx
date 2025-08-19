import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CartItem, InsertCartItem, Product } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

interface CartContextType {
  items: (CartItem & { product?: Product })[];
  isLoading: boolean;
  addItem: (item: Omit<InsertCartItem, "sessionId">) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  totalPrice: number;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [sessionId] = useState(() => {
    if (typeof window !== 'undefined') {
      let id = sessionStorage.getItem('sessionId');
      if (!id) {
        id = crypto.randomUUID();
        sessionStorage.setItem('sessionId', id);
      }
      return id;
    }
    return crypto.randomUUID();
  });
  
  const queryClient = useQueryClient();

  // Fetch cart items
  const { data: cartItems = [], isLoading } = useQuery({
    queryKey: ["/api/cart", sessionId],
    queryFn: async () => {
      const response = await fetch(`/api/cart?sessionId=${sessionId}`);
      const items = await response.json();
      
      // Fetch product details for each cart item
      const itemsWithProducts = await Promise.all(
        items.map(async (item: CartItem) => {
          const productResponse = await fetch(`/api/products?id=${item.productId}`);
          const products = await productResponse.json();
          const product = products.find((p: Product) => p.id === item.productId);
          return { ...item, product };
        })
      );
      
      return itemsWithProducts;
    },
  });

  // Add item to cart
  const addItemMutation = useMutation({
    mutationFn: async (item: Omit<InsertCartItem, "sessionId">) => {
      const response = await apiRequest("POST", "/api/cart", {
        ...item,
        sessionId,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", sessionId] });
    },
  });

  // Update item quantity
  const updateQuantityMutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      const response = await apiRequest("PATCH", `/api/cart/${id}`, { quantity });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", sessionId] });
    },
  });

  // Remove item from cart
  const removeItemMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/cart/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", sessionId] });
    },
  });

  // Clear cart
  const clearCartMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("DELETE", `/api/cart?sessionId=${sessionId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", sessionId] });
    },
  });

  // Calculate totals
  const totalPrice = cartItems.reduce((total, item) => {
    return total + (item.product?.price || 0) * item.quantity;
  }, 0);

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  const contextValue: CartContextType = {
    items: cartItems,
    isLoading,
    addItem: (item) => addItemMutation.mutate(item),
    updateQuantity: (id, quantity) => updateQuantityMutation.mutate({ id, quantity }),
    removeItem: (id) => removeItemMutation.mutate(id),
    clearCart: () => clearCartMutation.mutate(),
    totalPrice,
    totalItems,
  };

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
