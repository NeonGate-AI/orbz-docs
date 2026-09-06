# Deployment Verification

Use the existing Vercel project and repository configuration. Confirm scope and
user authorization before integration or publication. Preparing a preview does
not authorize changing repository visibility.

1. Run `pnpm check` and the registry advisory audit.
2. Inspect preview status and the requested UI/content behavior in a browser.
3. Record keyboard, theme, mobile and security/SEO checks applicable to the spec.
4. Merge only when already authorized and the required review/checks are green.
5. After an authorized production deployment, verify the public URL and record
   the deployed commit. A failure keeps acceptance open until fixed or reverted.

No package version is published from this documentation repository.
