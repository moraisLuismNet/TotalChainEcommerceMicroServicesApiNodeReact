import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: 'localhost',
    port: 5173,
    open: '/list-products',
    proxy: {
      '/api/auth': { target: 'http://localhost:5001', changeOrigin: true },
      '/api/users': { target: 'http://localhost:5001', changeOrigin: true },
      '/api/categories': { target: 'http://localhost:5002', changeOrigin: true },
      '/api/subcategories': { target: 'http://localhost:5002', changeOrigin: true },
      '/api/references': { target: 'http://localhost:5002', changeOrigin: true },
      '/api/products': { target: 'http://localhost:5002', changeOrigin: true },
      '/api/stocks': { target: 'http://localhost:5002', changeOrigin: true },
      '/api/carts': { target: 'http://localhost:5003', changeOrigin: true },
      '/api/cart-details': { target: 'http://localhost:5003', changeOrigin: true },
      '/api/orders': { target: 'http://localhost:5003', changeOrigin: true },
      '/api/payments': { target: 'http://localhost:5004', changeOrigin: true },
      '/api/shipments': { target: 'http://localhost:5005', changeOrigin: true },
      '/api/kardex': { target: 'http://localhost:5006', changeOrigin: true },
      '/api/audit-logs': { target: 'http://localhost:5007', changeOrigin: true },
      '/api/mails': { target: 'http://localhost:5008', changeOrigin: true },
      '/api/messages': { target: 'http://localhost:5009', changeOrigin: true },
    }
  },
  build: {
    outDir: 'dist'
  }
})
