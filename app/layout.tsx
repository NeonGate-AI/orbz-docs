import type { Metadata, Viewport } from 'next'
import { Head, Search } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import { Layout, Navbar } from 'nextra-theme-docs'
import 'nextra-theme-docs/style.css'
import type { ReactNode } from 'react'

import { siteConfig } from '../site.config'

import { OrbzMark } from './orbz-mark.client'
import { RegisterElement } from './register-element.client'
import { ThemeToggle } from './theme-toggle.client'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: 'Orbz Docs | Neongate AI',
    template: '%s | Neongate AI Docs'
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  alternates: { canonical: '/' },
  openGraph: {
    description: siteConfig.description,
    siteName: siteConfig.name,
    title: 'Orbz Docs | Neongate AI',
    type: 'website',
    url: siteConfig.url
  },
  twitter: {
    card: 'summary_large_image',
    description: siteConfig.description,
    title: 'Orbz Docs | Neongate AI'
  }
}

export const viewport: Viewport = {
  colorScheme: 'dark light',
  themeColor: [
    { color: '#f6f7ff', media: '(prefers-color-scheme: light)' },
    { color: '#070810', media: '(prefers-color-scheme: dark)' }
  ]
}

function NeongateBrand() {
  return (
    <span className="neongate-brand">
      <OrbzMark size="1.45rem" />
      <span className="neongate-brand__wordmark">Neongate AI</span>
    </span>
  )
}

const navbar = (
  <Navbar
    key="neongate-navbar"
    logo={<NeongateBrand />}
    logoLink={siteConfig.companyUrl}
  >
    <a className="neongate-navbar-link" href="/" key="docs-link">
      Docs
    </a>
    <ThemeToggle key="theme-toggle" />
    <div className="neongate-navbar-search" key="docs-search">
      <Search placeholder="Search docs…" />
    </div>
  </Navbar>
)

const footer = (
  <footer className="neongate-footer" key="neongate-footer">
    <div className="neongate-footer__glow" key="footer-glow" />
    <div className="neongate-footer__inner" key="footer-inner">
      <a
        className="neongate-footer__brand"
        href={siteConfig.companyUrl}
        key="footer-brand"
      >
        <OrbzMark
          elevated
          preset="magenta"
          size="2.4rem"
          speed={0.78}
          states={['listening', 'thinking', 'idle']}
        />
        <span>
          <strong>Neongate AI</strong>
          <small>Voice interfaces with presence.</small>
        </span>
      </a>
      <div className="neongate-footer__meta" key="footer-meta">
        <span>© {new Date().getFullYear()}</span>
        <span aria-hidden="true">•</span>
        <a href={`${siteConfig.products.orbz.github}/blob/main/LICENSE`}>
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
          search={null}
          sidebar={{ defaultMenuCollapseLevel: 1 }}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
