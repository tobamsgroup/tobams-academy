import { NextResponse } from 'next/server'

type ApiShape<T> = {
  data?: T
  message: string
  meta?: Record<string, unknown>
  error?: string
}

export function ok<T>(data?: T, message = 'Success', meta?: Record<string, unknown>) {
  const body: ApiShape<T> = { message }
  if (data !== undefined) body.data = data
  if (meta !== undefined) body.meta = meta
  return NextResponse.json(body, { status: 200 })
}

export function created<T>(data?: T, message = 'Created') {
  const body: ApiShape<T> = { message }
  if (data !== undefined) body.data = data
  return NextResponse.json(body, { status: 201 })
}

export function err(message: string, status = 400) {
  const body: ApiShape<never> = { message, error: message }
  return NextResponse.json(body, { status })
}
