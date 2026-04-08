import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      devOptions: { enabled: true, type: 'module' },
      navigateFallback: 'index.html',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mock_event1.png'],
      manifest: {
        name: 'Austral Collector',
        short_name: 'AustralColl',
        description: 'Plataforma para coleccionistas Austral Collector.',
        theme_color: '#1e4d5a',
        background_color: '#f0e4cc',
        display: 'standalone',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      },
      workbox: {
        // Caching strategy for API requests
        runtimeCaching: [
          {
            // ============================================
            // ENTORNO DE DESARROLLO LOCAL
            // ============================================
            urlPattern: /^http:\/\/192\.168\.18\.194\/Austral%20Collector\/api\/.*/i,
            
            // ============================================
            // ENTORNO DE PRODUCCIÓN (LANZAMIENTO WEB)
            // Comentar el patrón de arriba y usar el de abajo
            // ============================================
            // urlPattern: /^https:\/\/www\.australcollector\.com\/api\/.*/i,
            
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 7 // Keep cache for 7 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          // Caching image uploads served statically
          {
            // ============================================
            // ENTORNO DE DESARROLLO LOCAL
            // ============================================
            urlPattern: /^http:\/\/192\.168\.18\.194\/Austral%20Collector\/api\/uploads\/.*/i,
            
            // ============================================
            // ENTORNO DE PRODUCCIÓN (LANZAMIENTO WEB)
            // Comentar el patrón de arriba y usar el de abajo
            // ============================================
            // urlPattern: /^https:\/\/www\.australcollector\.com\/api\/uploads\/.*/i,
            
            handler: 'CacheFirst',
            options: {
              cacheName: 'image-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30 // Keep images for 30 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ],
})
