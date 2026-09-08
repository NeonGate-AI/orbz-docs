import { GitHubIcon } from 'nextra/icons'

import { siteConfig } from '../site.config'

export function GitHubStar() {
  return (
    <a
      aria-label="Star Orbz on GitHub (opens in a new tab)"
      className="neongate-github-star"
      href={siteConfig.products.orbz.github}
      rel="noopener noreferrer"
      target="_blank"
    >
      <GitHubIcon aria-hidden="true" height="16" />
      <span></span>
      <span aria-hidden="true" className="neongate-github-star__icon">
        ☆
      </span>
    </a>
  )
}
