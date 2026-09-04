import type { MetadataRoute } from 'next'

import { siteConfig } from '../site.config'

export default function robots(): MetadataRoute.Robots {
  if (!siteConfig.searchIndexable) {
    return {
      rules: {
        disallow: '/',
        userAgent: '*'
      }
    }
  }

  return {
    rules: {
      allow: '/',
      userAgent: '*'
    },
    sitemap: `${siteConfig.url}/sitemap.xml`
  }
}
