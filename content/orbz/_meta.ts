import type { MetaRecord } from 'nextra'

const meta: MetaRecord = {
  index: {
    title: 'Overview',
    type: 'page',
    theme: {
      breadcrumb: false,
      copyPage: false,
      footer: true,
      layout: 'full',
      navbar: true,
      pagination: false,
      sidebar: false,
      timestamp: false,
      toc: false
    }
  },
  'getting-started': 'Getting started',
  concepts: 'Core concepts',
  guides: 'Guides',
  examples: 'Sandbox',
  api: 'API reference',
  // biome-ignore lint/nursery/noSecrets: Public navigation label.
  troubleshooting: 'Troubleshooting',
  changelog: 'Changelog'
}

export default meta
