import type { Metadata, Viewport } from 'next'
import Link from 'next/link'
import { Head, Search } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import { Layout, Navbar } from 'nextra-theme-docs'
import type { ReactNode } from 'react'

import { siteConfig } from '../site.config'
import { GitHubStar } from './github-star'
import { RegisterElement } from './register-element.client'
import { ThemeToggle } from './theme-toggle.client'

import 'nextra-theme-docs/style.css'
import './globals.css'

const socialImage = {
  alt: 'OrbZ documentation',
  height: 630,
  url: siteConfig.socialImage,
  width: 1200
}

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: 'OrbZ Docs | NeonGate AI',
    template: '%s | OrbZ Docs'
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.publisher, url: siteConfig.companyUrl }],
  creator: siteConfig.publisher,
  publisher: siteConfig.publisher,
  category: 'technology',
  robots: {
    follow: siteConfig.searchIndexable,
    index: siteConfig.searchIndexable,
    googleBot: {
      follow: siteConfig.searchIndexable,
      index: siteConfig.searchIndexable,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1
    }
  },
  openGraph: {
    description: siteConfig.description,
    images: [socialImage],
    locale: 'en_US',
    siteName: siteConfig.name,
    title: 'OrbZ Docs | NeonGate AI',
    type: 'website',
    url: siteConfig.url
  },
  twitter: {
    card: 'summary_large_image',
    description: siteConfig.description,
    images: [socialImage],
    title: 'OrbZ Docs | NeonGate AI'
  }
}

export const viewport: Viewport = {
  colorScheme: 'dark light',
  themeColor: [
    { color: '#f6f7ff', media: '(prefers-color-scheme: light)' },
    { color: '#070810', media: '(prefers-color-scheme: dark)' }
  ]
}

function OrbzBrand() {
  return (
    <span className="neongate-brand">
      <orb-z
        aria-hidden="true"
        tabIndex={-1}
        reduced-motion="always"
        size="1.45rem"
        speed={0.78}
        state="thinking"
      />
      <span className="neongate-brand__wordmark">OrbZ</span>
      <span className="neongate-brand__version">
        v{siteConfig.products.orbz.version}
      </span>
    </span>
  )
}

const navbar = (
  <Navbar key="neongate-navbar" logo={<OrbzBrand />} logoLink="/">
    <GitHubStar />
    <Link className="neongate-navbar-link" href="/orbz/getting-started">
      Docs
    </Link>
    <span className="neongate-desktop-theme">
      <ThemeToggle key="theme-toggle" />
    </span>
  </Navbar>
)

const footer = (
  <footer className="neongate-footer" key="neongate-footer">
    <div className="neongate-footer__glow" key="footer-glow" />
    <div className="neongate-footer__inner" key="footer-inner">
      <Link className="neongate-footer__brand" href="/" key="footer-brand">
        <orb-z
          aria-hidden="true"
          tabIndex={-1}
          elevated
          preset="magenta"
          reduced-motion="always"
          size="2.4rem"
          speed={0.78}
          state="idle"
        />
        <span>
          <strong>Neongate AI</strong>
          <small>Voice interfaces with presence.</small>
        </span>
      </Link>
      <div className="neongate-footer__meta" key="footer-meta">
        <span>© {new Date().getFullYear()}</span>
        <span aria-hidden="true">•</span>
        <a href="https://github.com/NeonGate-AI/docs/blob/main/LICENSE">
          MIT License
        </a>
        <span aria-hidden="true">•</span>
        <span>Orbz documentation</span>
      </div>
    </div>
  </footer>
)

export default async function RootLayout(
  props: Readonly<{ children: ReactNode }>
) {
  const { children } = props

  return (
    <html dir="ltr" lang="en" suppressHydrationWarning>
      <Head
        backgroundColor={{ dark: '#070810', light: '#f6f7ff' }}
        color={{
          hue: 246,
          lightness: { dark: 72, light: 50 },
          saturation: 100
        }}
        faviconGlyph="◉"
      />
      <body>
        <RegisterElement />
        <Layout
          docsRepositoryBase="https://github.com/NeonGate-AI/docs/tree/main/content"
          editLink="Edit this page on GitHub"
          feedback={{
            content: 'Suggest a documentation improvement',
            labels: 'documentation'
          }}
          footer={footer}
          navbar={navbar}
          nextThemes={{
            defaultTheme: 'dark',
            storageKey: 'neongate-docs-theme'
          }}
          pageMap={await getPageMap()}
          search={<Search placeholder="Search docs…" />}
          sidebar={{ defaultMenuCollapseLevel: 1 }}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
