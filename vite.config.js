import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost/Austral_Collector',
        changeOrigin: true,
      }
    }
  },
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
        // Al activarse el nuevo SW, toma control inmediato de todos los clientes
        // y elimina los cachés obsoletos automáticamente (sin que el usuario haga nada).
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,

        // Caching strategy for API requests
        runtimeCaching: [
          {
            // ============================================
            // RUTAS EXCLUIDAS DEL CACHÉ: /api/admin/* y /api/auth/*
            // Estas rutas son sensibles: siempre deben ir a la red.
            // Si se cachean, un 401 guardado puede cerrar la sesión del admin.
            // ============================================
            urlPattern: /\/api\/(admin|auth)\/.*/i,
            method: 'GET',
            handler: 'NetworkOnly',
            options: {}
          },
          {
            // Lo mismo para POST/PUT/DELETE en admin y auth
            urlPattern: /\/api\/(admin|auth)\/.*/i,
            method: 'POST',
            handler: 'NetworkOnly',
            options: {}
          },
          {
            // ============================================
            // PATRÓN PARA CACHÉ DE API PÚBLICA (Independiente del host local/prod)
            // Solo cachea rutas públicas: excluye admin, auth y uploads
            // El sufijo -v2 invalida el caché viejo ('api-cache') en todos los navegadores.
            // ============================================
            urlPattern: /\/api\/(?!admin\/|auth\/|uploads\/).*/i,
            method: 'GET',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache-v2',
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
            // CACHÉ DE IMÁGENES GLOBAL (Independiente del host local/prod)
            // ============================================
            urlPattern: /\/uploads\/.*/i,
            method: 'GET',
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
