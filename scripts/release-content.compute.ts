export interface PublishedContract {
  version: string
  defaultPreset: string
  presetNames: readonly string[]
}

export interface ReleaseContent {
  dependencyVersion: string
  changelog: string
  cdn: string
  snapshot: string
}

export function inspectReleaseContent(
  content: ReleaseContent,
  installed: PublishedContract
) {
  const failures: string[] = []
  const version = content.dependencyVersion
  if (!/^\d+\.\d+\.\d+$/.test(version) || version !== installed.version)
    failures.push('dependency must pin the exact installed Orbz version')
  const latest = content.changelog.match(/^##\s+(\S+)/m)?.[1]
  if (latest !== version)
    failures.push('newest changelog entry must match the Orbz dependency')
  const pins = [...content.cdn.matchAll(/@neongate-ai\/orbz@([^\s/`"'<>]+)/g)]
  if (!pins.length || pins.some((pin) => pin[1] !== installed.version))
    failures.push('CDN package pins must match the installed Orbz version')
  const urls = [
    ...content.cdn.matchAll(
      /https?:\/\/(?:cdn\.jsdelivr\.net\/npm|unpkg\.com)\/@neongate-ai\/orbz(?=[@/\s`"'<>])[^\s`"'<>]*/g
    )
  ]
  if (
    !urls.length ||
    urls.some(([url]) => url.match(/\/orbz@([^/]+)\//)?.[1] !== version)
  )
    failures.push('CDN URLs must contain an exact current Orbz version')
  const introduction = content.cdn.split(/^##\s/m)[0]
  const proseVersions = [
    ...introduction.matchAll(/\b\d+\.\d+\.\d+(?:[-+][\w.-]+)*/g)
  ]
  if (
    !proseVersions.length ||
    proseVersions.some((match) => match[0] !== version)
  )
    failures.push('CDN introduction must name the current Orbz version')

  const snapshotIntro = content.snapshot.split(/^##\s/m)[0]
  const snapshotVersions = [
    ...snapshotIntro.matchAll(/`@neongate-ai\/orbz@([^`]+)`/g)
  ]
  if (
    snapshotVersions.length !== 1 ||
    snapshotVersions[0][1] !== installed.version
  )
    failures.push('contract snapshot version must match installed Orbz')
  const defaults = [
    ...content.snapshot.matchAll(
      /^\|[ \t]*Default preset[ \t]*\|[ \t]*`([^`]+)`[ \t]*\|/gm
    )
  ]
  if (defaults.length !== 1 || defaults[0][1] !== installed.defaultPreset)
    failures.push('contract snapshot default preset must match installed Orbz')
  const list = content.snapshot.match(
    /`ORBZ_PRESET_NAMES`[\s\S]*?\n((?:[ \t]*-[ \t]+`[^`\n]+`[ \t]*(?:\n|$))+)/
  )?.[1]
  const names = [...(list ?? '').matchAll(/`([^`]+)`/g)].map(
    (match) => match[1]
  )
  if (
    names.length !== installed.presetNames.length ||
    new Set(names).size !== names.length ||
    names.some((name) => !installed.presetNames.includes(name))
  )
    failures.push(
      'contract snapshot canonical presets must match installed Orbz'
    )
  return failures
}
