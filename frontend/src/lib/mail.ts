import { Client } from 'node-mailjet'
import nodemailer, { Transporter } from 'nodemailer'

/**
 * Mail provider is selected with MAIL_PROVIDER: "smtp" (default), "mailjet", or "log" (testing:
 * records sends without emailing; refused in production unless ALLOW_MAIL_LOG_IN_PRODUCTION=true).
 *
 * SMTP mirrors Tobams-Group-BE (src/utils/emailSystem.utils.ts):
 *  - Gmail OAuth2 when EMAIL_CLIENT_ID / EMAIL_CLIENT_SECRET / EMAIL_REFRESH_TOKEN are set
 *    (sender = SEND_MAIL). Nodemailer refreshes the access token itself.
 *  - Otherwise plain SMTP auth with SMTP_USER / SMTP_PASSWORD (defaults to SEND_MAIL as user).
 * Host/port come from SMTP_SERVER / SMTP_PORT (port 465 => implicit TLS).
 */
const mailProvider = () => (process.env.MAIL_PROVIDER ?? 'smtp').toLowerCase()
const clientUrl = () => process.env.CLIENT_URL ?? 'http://localhost:3000'

/** Escape user-provided text (names, titles) before putting it into email HTML. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// ---------------------------------------------------------------------------
// SMTP (nodemailer)
// ---------------------------------------------------------------------------

let smtpTransporter: Transporter | null = null

function getSmtpTransporter(): Transporter {
  if (smtpTransporter) return smtpTransporter

  const host = process.env.SMTP_SERVER ?? 'smtp.gmail.com'
  const port = Number(process.env.SMTP_PORT ?? 465)
  const user = process.env.SMTP_USER ?? process.env.SEND_MAIL ?? ''
  const { EMAIL_CLIENT_ID, EMAIL_CLIENT_SECRET, EMAIL_REFRESH_TOKEN, SMTP_PASSWORD } = process.env

  const auth =
    EMAIL_CLIENT_ID && EMAIL_CLIENT_SECRET && EMAIL_REFRESH_TOKEN
      ? {
          type: 'OAuth2' as const,
          user,
          clientId: EMAIL_CLIENT_ID,
          clientSecret: EMAIL_CLIENT_SECRET,
          refreshToken: EMAIL_REFRESH_TOKEN,
        }
      : { user, pass: SMTP_PASSWORD ?? '' }

  smtpTransporter = nodemailer.createTransport({ host, port, secure: port === 465, auth })
  return smtpTransporter
}

async function sendViaSmtp(to: string, toName: string, subject: string, html: string) {
  const fromEmail = process.env.SEND_MAIL ?? process.env.SMTP_USER ?? ''
  const fromName = process.env.MAIL_FROM_NAME ?? 'Tobams Academy'
  await getSmtpTransporter().sendMail({
    from: { name: fromName, address: fromEmail },
    to: { name: toName, address: to },
    subject,
    html,
  })
}

// ---------------------------------------------------------------------------
// Mailjet (kept for fallback; enable with MAIL_PROVIDER=mailjet)
// ---------------------------------------------------------------------------

function getClient() {
  return new Client({
    apiKey: process.env.MAILJET_API_KEY ?? '',
    apiSecret: process.env.MAILJET_API_SECRET ?? '',
  })
}

const fromEmail = () => process.env.MAILJET_FROM_EMAIL ?? ''
const fromName = () => process.env.MAILJET_FROM_NAME ?? ''

async function sendViaMailjet(to: string, toName: string, subject: string, html: string) {
  await getClient()
    .post('send', { version: 'v3.1' })
    .request({
      Messages: [
        {
          From: { Email: fromEmail(), Name: fromName() },
          To: [{ Email: to, Name: toName }],
          Subject: subject,
          HTMLPart: html,
        },
      ],
    })
}

// ---------------------------------------------------------------------------

async function send(to: string, toName: string, subject: string, html: string) {
  // MAIL_PROVIDER=log: record the send without emailing (local testing only). The body is not
  // logged because it can contain temporary passwords and sign-in codes.
  const logAllowed =
    process.env.NODE_ENV !== 'production' || process.env.ALLOW_MAIL_LOG_IN_PRODUCTION === 'true'
  if (mailProvider() === 'log' && logAllowed) {
    console.info(`[mail:log] would send "${subject}" to ${to} (${html.length} chars)`)
    return
  }
  try {
    if (mailProvider() === 'mailjet') await sendViaMailjet(to, toName, subject, html)
    else await sendViaSmtp(to, toName, subject, html)
  } catch (error) {
    console.error(`[mail:${mailProvider()}] Failed to send email to`, to, error instanceof Error ? error.message : error)
  }
}

export async function sendVerificationEmail(to: string, name: string, token: string) {
  const link = `${clientUrl()}/verify-email?token=${token}`
  const html = `
    <h2>Welcome to Tobams Academy, ${escapeHtml(name)}!</h2>
    <p>Please verify your email address by clicking the link below:</p>
    <a href="${link}" style="background:#571244;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;">
      Verify Email
    </a>
    <p>This link expires in 24 hours.</p>
  `
  await send(to, name, 'Verify your Tobams Academy email', html)
}

export async function sendTwoFactorOtpEmail(to: string, name: string, otp: string) {
  const html = `
    <h2>Your Tobams Academy login code</h2>
    <p>Hi ${escapeHtml(name)}, use the code below to complete your sign-in.</p>
    <div style="margin:24px 0;font-size:36px;font-weight:bold;letter-spacing:8px;color:#1e2d5a;">${otp}</div>
    <p>This code expires in <strong>10 minutes</strong>. Do not share it with anyone.</p>
    <p>If you did not attempt to log in, please secure your account immediately.</p>
  `
  await send(to, name, 'Your Tobams Academy login verification code', html)
}

export async function sendAccountDeactivationEmail(to: string, name: string) {
  const html = `
    <h2>Your Tobams Academy account has been deactivated</h2>
    <p>Hi ${escapeHtml(name)}, your account has been deactivated as requested.</p>
    <p>You can reactivate it at any time by simply logging in again with your existing credentials.</p>
    <p>If you did not request this, please contact our support team immediately.</p>
  `
  await send(to, name, 'Your Tobams Academy account has been deactivated', html)
}

export async function sendPasswordResetEmail(to: string, name: string, token: string) {
  const link = `${clientUrl()}/reset-password?token=${token}`
  const html = `
    <h2>Password Reset Request</h2>
    <p>Hi ${escapeHtml(name)}, we received a request to reset your Tobams Academy password.</p>
    <a href="${link}" style="background:#EF4353;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;">
      Reset Password
    </a>
    <p>This link expires in 1 hour. If you did not request a reset, ignore this email.</p>
  `
  await send(to, name, 'Reset your Tobams Academy password', html)
}

export async function sendCourseEnrollmentEmail(params: {
  to: string
  name: string
  courseTitle: string
  courseSlug: string
  expiresAt: Date
  /** Set only for accounts created for this enrollment. */
  temporaryPassword?: string
}) {
  const { to, name, courseTitle, courseSlug, expiresAt, temporaryPassword } = params
  const loginLink = `${clientUrl()}/login?callbackUrl=${encodeURIComponent(`/dashboard/courses/${courseSlug}`)}`
  const until = expiresAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  const credentials = temporaryPassword
    ? `
    <p>We've created an account for you. Sign in with:</p>
    <table style="margin:12px 0;border-collapse:collapse;">
      <tr><td style="padding:4px 12px 4px 0;color:#6C686C;">Email</td><td style="padding:4px 0;font-weight:bold;">${escapeHtml(to)}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#6C686C;">Temporary password</td><td style="padding:4px 0;font-weight:bold;font-family:monospace;font-size:16px;">${escapeHtml(temporaryPassword)}</td></tr>
    </table>
    <p>For your security, we recommend changing it after you sign in: go to <strong>Settings → Security → Change Password</strong>.</p>`
    : `<p>Sign in with your existing Tobams Academy account to start.</p>`
  const html = `
    <h2>You're enrolled in ${escapeHtml(courseTitle)}</h2>
    <p>Hi ${escapeHtml(name)}, you've been enrolled in <strong>${escapeHtml(courseTitle)}</strong> on Tobams Academy.</p>
    ${credentials}
    <a href="${loginLink}" style="background:#571244;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;margin:12px 0;">
      Start learning
    </a>
    <p>Your access runs until <strong>${until}</strong>.</p>
  `
  await send(to, name, `You're enrolled in ${courseTitle}`, html)
}
