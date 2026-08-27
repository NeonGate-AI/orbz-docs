const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://orbz.site'

export const siteConfig = Object.freeze({
  companyUrl: 'https://neongate.com.br',
  description:
    'Technical documentation for the @neongate-ai/orbz web component.',
  github: 'https://github.com/NeonGate-AI/docs',
  name: 'Orbz Docs',
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
      version: '0.3.1'
    })
  })
})
