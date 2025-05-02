import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  build: {
    // ... puedes agregar otras configuraciones aquí
  },
  // Fallback para SPA en producción
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  // Configuración para Render o cualquier hosting estático
  // Esto asegura que cualquier ruta no encontrada sirva index.html
  preview: {
    // ... otras configuraciones
  },
  // Para Vite 4+, usa este middleware para fallback
  // Si usas un servidor personalizado, puedes agregar esto
  // Si no, Render debe tener una regla de rewrite en el dashboard
});