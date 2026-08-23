import type { MetadataRoute } from 'next'

import { siteConfig } from '../site.config'

const paths = [
  '',
  '/orbz',
  '/orbz/getting-started',
  '/orbz/getting-started/native',
  '/orbz/getting-started/react-next',
  '/orbz/getting-started/cdn',
  '/orbz/concepts/philosophy',
  '/orbz/concepts/states',
  '/orbz/concepts/appearance',
  '/orbz/concepts/motion-accessibility',
  '/orbz/guides/frameworks',
  '/orbz/guides/microfrontends',
  '/orbz/guides/voice-assistant',
  '/orbz/guides/ssr',
  '/orbz/examples',
  '/orbz/api',
  '/orbz/api/exports',
  '/orbz/troubleshooting',
  '/orbz/changelog'
] as const

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.map((path) => ({
    changeFrequency: path.endsWith('/changelog') ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : 0.7,
    url: `${siteConfig.url}${path}`
  }))
}
