type Level = 'info' | 'warn' | 'error'
type Meta = Record<string, unknown>

function log(level: Level, msg: string, meta?: Meta) {
  const entry = JSON.stringify({
    time: new Date().toISOString(),
    level,
    msg,
    ...meta,
  })
  if (level === 'error') console.error(entry)
  else if (level === 'warn') console.warn(entry)
  else console.log(entry)
}

export const logger = {
  info:  (msg: string, meta?: Meta) => log('info',  msg, meta),
  warn:  (msg: string, meta?: Meta) => log('warn',  msg, meta),
  error: (msg: string, meta?: Meta) => log('error', msg, meta),
}
