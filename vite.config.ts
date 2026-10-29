import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.png',
        'icons/apple-touch-icon.png',
        'icons.svg',
      ],
      manifest: {
        name: 'Lexie Woordjes',
        short_name: 'Lexie',
        description:
          'Een speels Nederlandstalig letterspel voor kleuters. Help Lexie met opdrachten en maak korte woordjes.',
        lang: 'nl',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'any',
        background_color: '#e8f4fc',
        theme_color: '#5B9FD4',
        categories: ['education', 'games', 'kids'],
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpeg,jpg,webp,woff2}'],
        navigateFallback: '/index.html',
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
})
