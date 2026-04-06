import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg', 'logo2.jpg'],
      manifest: {
        name: 'BrotherHood Barbershop',
        short_name: 'BrotherHood',
        description: 'BrotherHood Barbershop - Pereira, Barrio Villa del Prado',
        theme_color: '#000000',
        background_color: '#000000',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/logo2.jpg',
            sizes: '192x192',
            type: 'image/jpeg',
            purpose: 'any'
          },
          {
            src: '/logo2.jpg',
            sizes: '512x512',
            type: 'image/jpeg',
            purpose: 'any'
          },
          {
            src: '/logo2.jpg',
            sizes: '512x512',
            type: 'image/jpeg',
            purpose: 'maskable'
          }
        ]
      }
    })
  ],
})
