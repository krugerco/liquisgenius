# Cloudflare Contact Form Setup

The website includes a Cloudflare Pages Function at:

`/api/contact`

Form submissions are emailed to:

`lane@krugercoproductions.com`

## Required Cloudflare Environment Variables

Add these in Cloudflare:

Workers & Pages -> Liquid Genius project -> Settings -> Environment variables

### `RESEND_API_KEY`

Your Resend API key.

### `CONTACT_FROM`

The verified sender email used by Resend.

Example:

`Liquid Genius <hello@liquidgenius.ai>`

The `CONTACT_FROM` domain must be verified in Resend.

## Notes

- The recipient address is hardcoded in `functions/api/contact.js`.
- The frontend submits to `/api/contact`.
- The form includes a hidden honeypot field named `website` to reduce bot submissions.
- No API keys are stored in the repository.
