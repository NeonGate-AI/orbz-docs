import nextra from 'nextra'

const isDevelopment = process.env.NODE_ENV === 'development'
const isPreview = process.env.VERCEL_ENV === 'preview'

const scriptSources = [
  "'self'",
  "'unsafe-inline'",
  "'wasm-unsafe-eval'",
  ...(isDevelopment ? ["'unsafe-eval'"] : [])
].join(' ')

const connectSources = [
  "'self'",
  ...(isDevelopment ? ['ws:', 'wss:'] : [])
].join(' ')

const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src ${scriptSources}`,
  "script-src-attr 'none'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  `connect-src ${connectSources}`,
  "media-src 'self' data: blob:",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-src 'none'",
  "frame-ancestors 'none'",
  ...(isDevelopment ? [] : ['upgrade-insecure-requests'])
].join('; ')

const responseHeaders = [
  ...(isPreview
    ? [
        {
          key: 'X-Robots-Tag',
          value: 'noindex, nofollow, noarchive'
        }
      ]
    : []),
  {
    key: 'Content-Security-Policy',
    value: contentSecurityPolicy
  },
  {
    key: 'Cross-Origin-Opener-Policy',
    value: 'same-origin'
  },
  {
    key: 'Cross-Origin-Resource-Policy',
    value: 'same-origin'
  },
  {
    key: 'Origin-Agent-Cluster',
    value: '?1'
  },
  {
    key: 'Permissions-Policy',
    value: [
      'accelerometer=()',
      'autoplay=()',
      'camera=()',
      'geolocation=()',
      'gyroscope=()',
      'magnetometer=()',
      // biome-ignore lint/nursery/noSecrets: Public Permissions-Policy directive denying microphone access.
      'microphone=()',
      'payment=()',
      'usb=()',
      'browsing-topics=()'
    ].join(', ')
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    key: 'Strict-Transport-Security',
    // biome-ignore lint/nursery/noSecrets: Public HSTS response-header value.
    value: 'max-age=63072000; includeSubDomains'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Permitted-Cross-Domain-Policies',
    value: 'none'
  },
  {
    key: 'X-XSS-Protection',
    value: '0'
  }
]

const withNextra = nextra({
  search: {
    codeblocks: false
  }
})

export default withNextra({
  agentRules: false,
  async headers() {
    return [
      {
        headers: responseHeaders,
        source: '/(.*)'
      }
    ]
  },
  poweredByHeader: false,
  reactStrictMode: true
})
