const CACHE_NAME = 'asran-v1.0.0';
const urlsToCache = [
  '/',
  '/categories',
  '/products',
  '/blog',
  '/about',
  '/reviews',
  '/support',
  '/manifest.json',
  // Static assets will be cached automatically by the browser
];

// API endpoints to cache
const API_CACHE_NAME = 'asran-api-v1.0.0';
const apiUrlsToCache = [
  '/api/products',
  '/api/recipes',
  '/api/faq',
];

// Install event - cache core resources
self.addEventListener('install', (event) => {
  console.log('[SW] Install event');
  
  event.waitUntil(
    Promise.all([
      // Cache static resources
      caches.open(CACHE_NAME).then((cache) => {
        console.log('[SW] Caching static resources');
        return cache.addAll(urlsToCache);
      }),
      // Cache API endpoints
      caches.open(API_CACHE_NAME).then((cache) => {
        console.log('[SW] Caching API endpoints');
        return Promise.all(
          apiUrlsToCache.map(url => 
            fetch(url)
              .then(response => response.ok ? cache.put(url, response) : null)
              .catch(err => console.log(`[SW] Failed to cache ${url}:`, err))
          )
        );
      })
    ]).then(() => {
      // Force the waiting service worker to become the active service worker
      self.skipWaiting();
    })
  );
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activate event');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete old caches
          if (cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Take control of all clients
      return self.clients.claim();
    })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  event.respondWith(
    handleFetch(request)
  );
});

async function handleFetch(request) {
  const url = new URL(request.url);
  
  try {
    // API requests - Network First strategy
    if (url.pathname.startsWith('/api/')) {
      return await networkFirstStrategy(request, API_CACHE_NAME);
    }
    
    // Static assets and pages - Cache First strategy
    if (
      url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|woff|woff2)$/) ||
      urlsToCache.includes(url.pathname)
    ) {
      return await cacheFirstStrategy(request, CACHE_NAME);
    }
    
    // HTML pages - Network First with fallback
    return await networkFirstWithFallback(request);
    
  } catch (error) {
    console.log('[SW] Fetch error:', error);
    
    // Return offline page for navigation requests
    if (request.destination === 'document') {
      return await getOfflinePage();
    }
    
    // For other requests, try cache or return error
    const cachedResponse = await caches.match(request);
    return cachedResponse || new Response('Network error', { status: 408 });
  }
}

// Cache First strategy - for static assets
async function cacheFirstStrategy(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    // Update cache in background
    fetch(request).then(response => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
    }).catch(() => {
      // Ignore network errors when updating cache
    });
    
    return cachedResponse;
  }
  
  // Not in cache, fetch from network
  const response = await fetch(request);
  if (response.ok) {
    cache.put(request, response.clone());
  }
  return response;
}

// Network First strategy - for API calls
async function networkFirstStrategy(request, cacheName) {
  const cache = await caches.open(cacheName);
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.log('[SW] Network request failed, trying cache:', request.url);
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Network First with fallback - for HTML pages
async function networkFirstWithFallback(request) {
  try {
    const response = await fetch(request);
    
    // Cache successful HTML responses
    if (response.ok && response.headers.get('content-type')?.includes('text/html')) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    // Try cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // For navigation requests, return offline page
    if (request.destination === 'document') {
      return await getOfflinePage();
    }
    
    throw error;
  }
}

// Get offline page
async function getOfflinePage() {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match('/');
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Fallback offline page
  return new Response(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>오프라인 - ASRAN</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          margin: 0;
          padding: 20px;
          background-color: #F9FAFB;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          text-align: center;
        }
        .container {
          max-width: 400px;
          background: white;
          padding: 40px;
          border-radius: 16px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .logo {
          font-size: 32px;
          font-weight: bold;
          color: #1F2937;
          margin-bottom: 8px;
        }
        .subtitle {
          color: #F59E0B;
          margin-bottom: 24px;
        }
        h1 {
          color: #1F2937;
          margin-bottom: 16px;
        }
        p {
          color: #6B7280;
          line-height: 1.6;
        }
        .retry-btn {
          background: #F59E0B;
          color: #1F2937;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          margin-top: 20px;
        }
        .retry-btn:hover {
          background: #D97706;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">ASRAN</div>
        <div class="subtitle">독일 기술력</div>
        <h1>오프라인 상태</h1>
        <p>인터넷 연결을 확인하고 다시 시도해주세요.</p>
        <p>캐시된 페이지는 계속 이용하실 수 있습니다.</p>
        <button class="retry-btn" onclick="window.location.reload()">다시 시도</button>
      </div>
    </body>
    </html>
  `, {
    headers: { 'Content-Type': 'text/html' }
  });
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(handleBackgroundSync());
  }
});

async function handleBackgroundSync() {
  // Handle any offline actions that need to be synced
  console.log('[SW] Performing background sync');
}

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('[SW] Push message received');
  
  const options = {
    body: event.data ? event.data.text() : 'ASRAN에서 새로운 소식이 있습니다!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    tag: 'asran-notification',
    requireInteraction: false,
    actions: [
      {
        action: 'view',
        title: '보기',
        icon: '/icons/action-view.png'
      },
      {
        action: 'dismiss',
        title: '닫기',
        icon: '/icons/action-dismiss.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('ASRAN', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification click:', event.action);
  
  event.notification.close();
  
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Message handling for communication with main thread
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

// Periodic background sync (if supported)
self.addEventListener('periodicsync', (event) => {
  console.log('[SW] Periodic sync:', event.tag);
  
  if (event.tag === 'content-sync') {
    event.waitUntil(syncContent());
  }
});

async function syncContent() {
  // Sync fresh content when app is not in use
  console.log('[SW] Syncing fresh content');
  
  try {
    const cache = await caches.open(API_CACHE_NAME);
    
    // Update API cache with fresh data
    for (const url of apiUrlsToCache) {
      try {
        const response = await fetch(url);
        if (response.ok) {
          await cache.put(url, response);
        }
      } catch (error) {
        console.log(`[SW] Failed to sync ${url}:`, error);
      }
    }
  } catch (error) {
    console.log('[SW] Content sync failed:', error);
  }
}
