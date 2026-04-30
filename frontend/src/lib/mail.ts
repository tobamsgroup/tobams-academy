import { Client } from 'node-mailjet'

function getClient() {
  return new Client({
    apiKey: process.env.MAILJET_API_KEY ?? '',
    apiSecret: process.env.MAILJET_API_SECRET ?? '',
  })
}

const fromEmail = () => process.env.MAILJET_FROM_EMAIL ?? ''
const fromName = () => process.env.MAILJET_FROM_NAME ?? ''
const clientUrl = () => process.env.CLIENT_URL ?? 'http://localhost:3000'

async function send(to: string, toName: string, subject: string, html: string) {
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

export async function sendVerificationEmail(to: string, name: string, token: string) {
  const link = `${clientUrl()}/verify-email?token=${token}`
  const html = `
    <h2>Welcome to Tobams Academy, ${name}!</h2>
    <p>Please verify your email address by clicking the link below:</p>
    <a href="${link}" style="background:#571244;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;">
      Verify Email
    </a>
    <p>This link expires in 24 hours.</p>
  `
  await send(to, name, 'Verify your Tobams Academy email', html)
}

export async function sendPasswordResetEmail(to: string, name: string, token: string) {
  const link = `${clientUrl()}/reset-password?token=${token}`
  const html = `
    <h2>Password Reset Request</h2>
    <p>Hi ${name}, we received a request to reset your Tobams Academy password.</p>
    <a href="${link}" style="background:#EF4353;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;">
      Reset Password
    </a>
    <p>This link expires in 1 hour. If you did not request a reset, ignore this email.</p>
  `
  await send(to, name, 'Reset your Tobams Academy password', html)
}
