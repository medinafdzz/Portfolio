import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const cspDev = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self' http: https: ws:",
  "object-src 'none'",
  "base-uri 'self'"
].join('; ')

const cspPreview = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self' https:",
  "object-src 'none'",
  "base-uri 'self'",
  "upgrade-insecure-requests"
].join('; ')

const common = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block'
}

export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      'Content-Security-Policy': cspDev,
      ...common
    }
  },
  preview: {
    headers: {
      // HSTS solo tiene efecto en HTTPS
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
      'Content-Security-Policy': cspPreview,
      ...common
    }
  }
})
