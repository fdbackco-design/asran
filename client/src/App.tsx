import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/hooks/use-cart";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Home from "@/pages/home";
import Categories from "@/pages/categories";
import Products from "@/pages/products";
import ProductDetail from "@/pages/product-detail";
import About from "@/pages/about";
import Reviews from "@/pages/reviews";
import Support from "@/pages/support";
import Blog from "@/pages/blog";
import Cart from "@/pages/cart";
import Checkout from "@/pages/checkout";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/categories" component={Categories} />
          <Route path="/products" component={Products} />
          <Route path="/products/:slug" component={ProductDetail} />
          <Route path="/about" component={About} />
          <Route path="/reviews" component={Reviews} />
          <Route path="/support" component={Support} />
          <Route path="/blog" component={Blog} />
          <Route path="/cart" component={Cart} />
          <Route path="/checkout" component={Checkout} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;
