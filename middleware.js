export function MiddlewareLogger(req, next) {
  let now = new Date()
  console.log(`${now.toLocaleTimeString("en-US")}: ${req.method} ${req.url}`)
  next()
}
