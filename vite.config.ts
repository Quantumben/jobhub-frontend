import { defineConfig } from 'vite' //We use it to configure Vite.
import react from '@vitejs/plugin-react' //This brings React support into Vite.
import tailwindcss from '@tailwindcss/vite' //This imports Tailwind's Vite plugin.

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})