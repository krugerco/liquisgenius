# Liquid Genius

Static website for Liquid Genius, an AI consulting company focused on helping businesses adopt AI in a human-first, practical way.

## Brand Positioning

Liquid Genius turns AI into a practical tool that makes teams better, not replaceable.

## Tagline

Pouring AI confidence into human solutions

## Files

- `index.html` - main website page
- `styles.css` - brand-aligned styling
- `script.js` - scroll reveal interactions
- `functions/api/contact.js` - Cloudflare Pages Function for contact form submissions
- `docs/cloudflare-contact-form.md` - Cloudflare and Resend setup notes

## Contact Form

The contact form posts to `/api/contact` and emails submissions to `lane@krugercoproductions.com`.

Cloudflare needs these environment variables:

- `RESEND_API_KEY`
- `CONTACT_FROM`

See `docs/cloudflare-contact-form.md` for setup details.
