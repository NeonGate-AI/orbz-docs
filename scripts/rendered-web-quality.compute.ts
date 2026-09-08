interface Element {
  tag: string
  attributes: Record<string, string>
  text: string
  hidden: boolean
}

const entities: Record<string, string> = {
  amp: '&',
  apos: "'",
  gt: '>',
  lt: '<',
  nbsp: ' ',
  quot: '"'
}

function decode(value: string) {
  return value.replace(/&(#x[\da-f]+|#\d+|\w+);/gi, (match, entity: string) => {
    if (!entity.startsWith('#')) return entities[entity] ?? match
    const point =
      entity[1].toLowerCase() === 'x'
        ? Number.parseInt(entity.slice(2), 16)
        : Number.parseInt(entity.slice(1), 10)
    return point <= 0x10ffff ? String.fromCodePoint(point) : match
  })
}

// This scanner reads deterministic Next HTML, not arbitrary browser markup.
// RSC payloads, executable scripts, styles and comments cannot supply metadata.
function elementsFrom(html: string) {
  const source = html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, '')
  const elements: Element[] = []
  const stack: Element[] = []
  const tokens = source.matchAll(/<(?:(?:"[^"]*"|'[^']*'|[^'">])*)>|[^<]+/g)
  for (const [token] of tokens) {
    if (!token.startsWith('<')) {
      for (const element of stack) element.text += decode(token)
      continue
    }
    const closing = token.match(/^<\/([\w-]+)/)?.[1]?.toLowerCase()
    if (closing) {
      const index = stack.map((element) => element.tag).lastIndexOf(closing)
      if (index >= 0) stack.splice(index)
      continue
    }
    const match = token.match(/^<([\w-]+)([\s\S]*)\/?\s*>$/)
    if (!match) continue
    const tag = match[1].toLowerCase()
    const attributes: Record<string, string> = {}
    for (const attribute of match[2].matchAll(
      /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g
    )) {
      attributes[attribute[1].toLowerCase()] = decode(
        attribute[2] ?? attribute[3] ?? attribute[4] ?? ''
      )
    }
    const element: Element = {
      tag,
      attributes,
      text: '',
      hidden:
        Boolean(stack.at(-1)?.hidden) ||
        'hidden' in attributes ||
        attributes['aria-hidden'] === 'true' ||
        /(?:display\s*:\s*none|visibility\s*:\s*hidden)/i.test(
          attributes.style ?? ''
        ) ||
        /(?:^|\s)(?:sr-only|visually-hidden)(?:\s|$)/.test(
          attributes.class ?? ''
        )
    }
    elements.push(element)
    if (
      !/^(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)$/.test(
        tag
      ) &&
      !token.endsWith('/>')
    )
      stack.push(element)
  }
  return elements
}

function absoluteUrl(value: string, origin: string) {
  try {
    return new URL(value, origin).href
  } catch {
    return ''
  }
}

export function inspectRenderedPage(
  html: string,
  route: string,
  origin: string
) {
  const elements = elementsFrom(html)
  const failures: string[] = []
  function singleValue(name: string, values: string[]) {
    if (values.length !== 1 || !values[0].trim()) {
      failures.push(`expected one nonempty ${name}`)
    }
    return values[0]?.trim() ?? ''
  }
  function meta(name: string) {
    return singleValue(
      name,
      elements
        .filter(
          (element) =>
            element.tag === 'meta' &&
            (element.attributes.name === name ||
              element.attributes.property === name)
        )
        .map((element) => element.attributes.content ?? '')
    )
  }
  const title = singleValue(
    'title',
    elements
      .filter((element) => element.tag === 'title')
      .map((element) => element.text)
  )
  const description = meta('description')
  if (
    (route === '/' || route === '/orbz') &&
    title !== 'Orbz — AI Voice Web Component'
  ) {
    failures.push('homepage title must be Orbz — AI Voice Web Component')
  }
  if ([...title.matchAll(/\borbz\s+docs\b/gi)].length > 1)
    failures.push('title has repeated Docs brand')
  for (const name of ['og:title', 'twitter:title']) {
    if (meta(name) !== title)
      failures.push(`${name} must match the document title`)
  }
  for (const name of ['og:description', 'twitter:description']) {
    if (meta(name) !== description)
      failures.push(`${name} must match the page description`)
  }
  const canonical = singleValue(
    'canonical',
    elements
      .filter(
        (element) =>
          element.tag === 'link' && element.attributes.rel === 'canonical'
      )
      .map((element) => element.attributes.href ?? '')
  )
  const expected = new URL(route === '/orbz' ? '/' : route, origin).href
  if (!canonical || absoluteUrl(canonical, origin) !== expected)
    failures.push(`canonical must resolve to ${expected}`)
  const socialUrl = meta('og:url')
  if (!socialUrl || absoluteUrl(socialUrl, origin) !== expected)
    failures.push('og:url must match the expected canonical')
  for (const [rel, path] of [
    ['icon', '/favicon.ico'],
    ['icon', '/icon.png'],
    ['apple-touch-icon', '/apple-icon.png']
  ]) {
    const found = elements.some((element) => {
      if (
        element.tag !== 'link' ||
        !element.attributes.rel?.split(/\s+/).includes(rel)
      )
        return false
      const url = absoluteUrl(element.attributes.href ?? '', origin)
      return (
        url !== '' &&
        new URL(url).origin === new URL(origin).origin &&
        new URL(url).pathname === path
      )
    })
    if (!found) failures.push(`missing same-origin ${rel} link for ${path}`)
  }
  const labels = elements.filter((element) => element.tag === 'label')
  function references(element: Element, attribute: string) {
    return (element.attributes[attribute] ?? '')
      .split(/\s+/)
      .filter(Boolean)
      .map((id) => elements.find((candidate) => candidate.attributes.id === id))
      .filter((candidate): candidate is Element => Boolean(candidate))
  }
  const searches = elements.filter(
    (element) =>
      element.tag === 'input' &&
      element.attributes.role === 'combobox' &&
      element.attributes.type === 'search'
  )
  if (searches.length !== 2)
    failures.push('expected desktop and mobile search comboboxes')
  for (const search of searches) {
    const named =
      Boolean(search.attributes['aria-label']?.trim()) ||
      references(search, 'aria-labelledby').some((element) =>
        element.text.trim()
      ) ||
      labels.some(
        (label) =>
          search.attributes.id &&
          label.attributes.for === search.attributes.id &&
          label.text.trim()
      )
    if (!named)
      failures.push('search combobox must have an explicit accessible name')
  }
  if (route === '/' || route === '/orbz') {
    const speech = elements.filter(
      (element) =>
        element.tag === 'input' && element.attributes.name === 'speech'
    )
    if (speech.length !== 1) failures.push('expected one homepage speech input')
    for (const input of speech) {
      if (
        !labels.some(
          (label) =>
            input.attributes.id &&
            label.attributes.for === input.attributes.id &&
            label.text.trim() &&
            !label.hidden
        )
      )
        failures.push('speech input needs a visible associated label')
      if (
        !references(input, 'aria-describedby').some(
          (element) =>
            ['polite', 'assertive'].includes(element.attributes['aria-live']) ||
            element.attributes.role === 'status'
        )
      )
        failures.push('speech input needs an associated live status')
    }
  }
  return failures
}
