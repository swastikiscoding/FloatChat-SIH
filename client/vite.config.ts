import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
<<<<<<< HEAD

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
=======
// https://vite.dev/config/
export default defineConfig({
  plugins: [ tailwindcss(),
    react()],
>>>>>>> 36f3dcca0e93d1dad1b8924513faec58443ae05d
})
