const CONTACT_TO = "lane@krugercoproductions.com";

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });

const clean = (value, maxLength = 1000) =>
  String(value || "")
    .replace(/\r?\n/g, "\n")
    .trim()
    .slice(0, maxLength);

const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export async function onRequestPost({ request, env }) {
  let payload;

  try {
    payload = await request.json();
  } catch {
    return json({ error: "Please submit the form again." }, 400);
  }

  const name = clean(payload.name, 120);
  const email = clean(payload.email, 180);
  const company = clean(payload.company, 160);
  const message = clean(payload.message, 4000);
  const website = clean(payload.website, 180);

  if (website) {
    return json({ ok: true });
  }

  if (!name || !isEmail(email) || !message) {
    return json({ error: "Please add your name, a valid email, and a short message." }, 400);
  }

  if (!env.RESEND_API_KEY) {
    return json({ error: "Email is not configured yet. Please add RESEND_API_KEY in Cloudflare." }, 500);
  }

  const from = env.CONTACT_FROM || "Liquid Genius <hello@liquidgenius.ai>";
  const subject = `New Liquid Genius inquiry from ${name}`;
  const submittedAt = new Date().toISOString();

  const text = [
    "New Liquid Genius website inquiry",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    company ? `Company: ${company}` : null,
    `Submitted: ${submittedAt}`,
    "",
    "Message:",
    message,
  ]
    .filter(Boolean)
    .join("\n");

  const html = `
    <div style="font-family:Inter,Arial,sans-serif;line-height:1.55;color:#1F2937">
      <h2 style="margin:0 0 12px;color:#1F2937">New Liquid Genius inquiry</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
      ${company ? `<p><strong>Company:</strong> ${escapeHtml(company)}</p>` : ""}
      <p><strong>Submitted:</strong> ${escapeHtml(submittedAt)}</p>
      <hr style="border:none;border-top:1px solid #E5E7EB;margin:20px 0">
      <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
    </div>
  `;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${env.RESEND_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: CONTACT_TO,
      reply_to: email,
      subject,
      text,
      html,
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    console.error("Resend email failed", details);
    return json({ error: "The message could not be sent. Please try again soon." }, 502);
  }

  return json({ ok: true });
}

export function onRequestGet() {
  return json({ ok: true, endpoint: "Liquid Genius contact form" });
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
