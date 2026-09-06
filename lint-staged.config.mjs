export default {
  '*.{js,mjs,cjs,ts,tsx,json,jsonc}': [
    'biome check --write --no-errors-on-unmatched'
  ],
  '*.{md,mdx}': 'sh scripts/lint-markdown.sh'
}
