# Subfolder Deployment Checklist

If this site is deployed under a subfolder (for example `/site/`) instead of domain root:

1. Set `RewriteBase` in `.htaccess` (for example `RewriteBase /site/`).
2. Keep root-absolute links only if web root is mapped to that subfolder.
3. If not mapped, convert absolute links to include subfolder prefix.
4. Verify 301 redirects for legacy `.html` URLs in that subfolder context.
5. Re-test `/tr/...` and `/en/...` language alternates and article silo URLs.
6. Confirm `sitemap.xml` and `robots.txt` reflect the final public base URL.
