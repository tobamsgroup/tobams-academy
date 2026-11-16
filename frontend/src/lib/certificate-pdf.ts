import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { PDFDocument, rgb, type PDFFont, type PDFPage } from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit'

const BRANDING = resolve(process.cwd(), 'content', 'branding')

const NAVY = rgb(0x30 / 255, 0x38 / 255, 0x69 / 255)
const MAGENTA = rgb(0xb7 / 255, 0x2f / 255, 0x91 / 255)
const INK = rgb(0x11 / 255, 0x18 / 255, 0x27 / 255)
const MUTED = rgb(0x6c / 255, 0x68 / 255, 0x6c / 255)
const PAPER = rgb(0xfd / 255, 0xfc / 255, 0xfa / 255)

export type CertificateData = {
  learnerName: string
  courseTitle: string
  certificateNumber: string
  issuedAt: Date
  verifyUrl: string
}

type Assets = { sans: Buffer; sansBold: Buffer; serifBold: Buffer; logo: Buffer }
let assets: Promise<Assets> | null = null

function loadAssets(): Promise<Assets> {
  assets ??= Promise.all([
    readFile(resolve(BRANDING, 'fonts', 'NotoSans-Regular.ttf')),
    readFile(resolve(BRANDING, 'fonts', 'NotoSans-Bold.ttf')),
    readFile(resolve(BRANDING, 'fonts', 'NotoSerif-Bold.ttf')),
    readFile(resolve(BRANDING, 'certificate-logo.png')),
  ]).then(([sans, sansBold, serifBold, logo]) => ({ sans, sansBold, serifBold, logo }))
  assets.catch(() => {
    assets = null // retry next time rather than caching a failure
  })
  return assets
}

/** Largest size ≤ `max` at which `text` fits in `width`. */
function fitSize(font: PDFFont, text: string, max: number, width: number, min = 12) {
  let size = max
  while (size > min && font.widthOfTextAtSize(text, size) > width) size -= 1
  return size
}

function centered(page: PDFPage, text: string, y: number, font: PDFFont, size: number, color = INK) {
  const x = (page.getWidth() - font.widthOfTextAtSize(text, size)) / 2
  page.drawText(text, { x, y, size, font, color })
}

/** Centered text with extra space between letters (pdf-lib has no letter-spacing option). */
function spaced(page: PDFPage, text: string, y: number, font: PDFFont, size: number, tracking: number, color = NAVY) {
  const chars = [...text]
  const width = chars.reduce((w, c) => w + font.widthOfTextAtSize(c, size), 0) + tracking * (chars.length - 1)
  let x = (page.getWidth() - width) / 2
  for (const c of chars) {
    page.drawText(c, { x, y, size, font, color })
    x += font.widthOfTextAtSize(c, size) + tracking
  }
}

/** Renders the certificate as a one-page landscape A4 PDF. */
export async function renderCertificatePdf(data: CertificateData): Promise<Uint8Array> {
  const { sans, sansBold, serifBold, logo } = await loadAssets()
  const doc = await PDFDocument.create()
  doc.registerFontkit(fontkit)
  doc.setTitle(`Certificate of Completion: ${data.courseTitle}`)
  doc.setAuthor('Tobams Group Academy')
  doc.setSubject(`${data.learnerName} · ${data.certificateNumber}`)
  doc.setCreator('Tobams Academy')

  // Subset so only the glyphs used are embedded (keeps the file small).
  const [regular, bold, serif] = await Promise.all([
    doc.embedFont(sans, { subset: true }),
    doc.embedFont(sansBold, { subset: true }),
    doc.embedFont(serifBold, { subset: true }),
  ])
  const logoImage = await doc.embedPng(logo)

  const page = doc.addPage([841.89, 595.28]) // A4 landscape
  const W = page.getWidth()
  const H = page.getHeight()

  // Paper, frame and corner accents.
  page.drawRectangle({ x: 0, y: 0, width: W, height: H, color: PAPER })
  page.drawRectangle({ x: 18, y: 18, width: W - 36, height: H - 36, borderColor: NAVY, borderWidth: 6 })
  page.drawRectangle({ x: 32, y: 32, width: W - 64, height: H - 64, borderColor: MAGENTA, borderWidth: 1 })
  for (const [x, y] of [[32, H - 32], [W - 32, H - 32], [32, 32], [W - 32, 32]] as const) {
    page.drawCircle({ x, y, size: 5, color: MAGENTA })
  }

  const logoSize = 92
  page.drawImage(logoImage, { x: (W - logoSize) / 2, y: H - 58 - logoSize, width: logoSize, height: logoSize })

  spaced(page, 'CERTIFICATE OF COMPLETION', H - 190, bold, 24, 4)
  centered(page, 'This is to certify that', H - 228, regular, 13, MUTED)

  const nameSize = fitSize(serif, data.learnerName, 42, W - 200, 20)
  centered(page, data.learnerName, H - 284, serif, nameSize, MAGENTA)
  page.drawLine({
    start: { x: W / 2 - 220, y: H - 300 },
    end: { x: W / 2 + 220, y: H - 300 },
    thickness: 0.75,
    color: NAVY,
  })

  centered(page, 'has successfully completed', H - 330, regular, 13, MUTED)
  const titleSize = fitSize(bold, data.courseTitle, 24, W - 200, 14)
  centered(page, data.courseTitle, H - 366, bold, titleSize, NAVY)
  centered(page, 'delivered by Tobams Group Academy', H - 390, regular, 11, MUTED)

  // Footer: date (left), signature line (centre), certificate number (right).
  const issued = data.issuedAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  const footerY = 118
  const col = (x: number, label: string, value: string, valueFont = bold) => {
    page.drawLine({ start: { x: x - 95, y: footerY + 22 }, end: { x: x + 95, y: footerY + 22 }, thickness: 0.5, color: MUTED })
    page.drawText(value, { x: x - valueFont.widthOfTextAtSize(value, 12) / 2, y: footerY + 30, size: 12, font: valueFont, color: INK })
    page.drawText(label, { x: x - regular.widthOfTextAtSize(label, 9) / 2, y: footerY + 8, size: 9, font: regular, color: MUTED })
  }
  col(W / 2 - 250, 'DATE OF ISSUE', issued)
  col(W / 2, 'TOBAMS GROUP ACADEMY', 'Academy Director', regular)
  col(W / 2 + 250, 'CERTIFICATE NO.', data.certificateNumber)

  centered(page, `Verify this certificate at ${data.verifyUrl}`, 62, regular, 8.5, MUTED)

  return doc.save()
}
