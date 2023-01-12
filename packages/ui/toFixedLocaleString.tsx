export const toFixedLocaleString = (n?: number) => {
  if (n == null) {
    return "-"
  }

  const a = n?.toFixed(0)
  const b = Number(a)
  return b.toLocaleString()
}
