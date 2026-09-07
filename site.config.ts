import packageJson from './package.json'

function normalizeSiteUrl(value: string) {
  const url = new URL(value)

  if (url.protocol !== 'https:' && url.hostname !== 'localhost') {
    throw new Error('NEXT_PUBLIC_SITE_URL must use HTTPS outside localhost')
  }

  if (url.pathname !== '/' || url.search || url.hash) {
    throw new Error(
      'NEXT_PUBLIC_SITE_URL must be an origin without path/query/hash'
    )
  }

  return url.origin
}

const siteUrl = normalizeSiteUrl(
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://orbz.site'
)
const orbzVersion = packageJson.dependencies['@neongate-ai/orbz']
const searchIndexable =
  process.env.NODE_ENV === 'production' && process.env.VERCEL_ENV !== 'preview'

export const siteConfig = Object.freeze({
  companyUrl: 'https://neongate.com.br',
  description:
    'Technical documentation for the @neongate-ai/orbz web component.',
  github: 'https://github.com/NeonGate-AI/docs',
  name: 'OrbZ Docs',
  publisher: 'NeonGate AI',
  searchIndexable,
  socialImage: '/og/orbz-docs.png',
  url: siteUrl,
  products: Object.freeze({
    orbz: Object.freeze({
      examples: Object.freeze({
        angular: 'https://www.angular.orbz.site',
        next: 'https://www.next.orbz.site',
        react: 'https://www.react.orbz.site',
        svelte: 'https://www.svelte.orbz.site',
        vanilla: 'https://www.vanilla.orbz.site',
        vue: 'https://www.vue.orbz.site'
      }),
      github: 'https://github.com/gojhonny/orbz',
      npm: 'https://www.npmjs.com/package/@neongate-ai/orbz',
      path: '/orbz',
      version: orbzVersion
    })
  })
})
