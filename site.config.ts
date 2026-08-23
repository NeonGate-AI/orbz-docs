const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://docs.neongate.com.br'

export const siteConfig = Object.freeze({
  companyUrl: 'https://neongate.com.br',
  description: 'Technical documentation for Neongate AI products and engineering.',
  github: 'https://github.com/NeonGate-AI/docs',
  name: 'Neongate AI Docs',
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
      github: 'https://github.com/NeonGate-AI/orbz',
      npm: 'https://www.npmjs.com/package/@neongate-ai/orbz',
      path: '/orbz',
      version: '0.3.0'
    })
  })
})
