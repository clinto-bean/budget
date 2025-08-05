export function validateIDs(...ids) {
  return ids.every((id) => {
    const num = Number(id)
    return Number.isInteger(num) && num > 0
  })
}

export function logHandler(handler) {
  return function wrappedHandler(req, res, next) {
    console.log(
      `${new Date().toLocaleTimeString("en-US")}: Executing handler ${
        handler.name || "anonymous"
      }`
    )
    return handler(req, res, next)
  }
}
