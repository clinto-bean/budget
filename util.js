export function validateIDs(...ids) {
  return ids.every((id) => {
    const num = Number(id)
    return Number.isInteger(num) && num > 0
  })
}
