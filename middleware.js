export function MiddlewareLogger(req, res, next) {
  let now = new Date()
  console.log(`${now.toLocaleTimeString("en-US")}: ${req.method} ${req.url}`)
  next()
}
