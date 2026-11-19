// Empty means the customer will pay after placing the order.
export function referenceError(method: string, reference: string): string {
  const value = reference.trim()
  if (!value) return ''
  if (method === 'gcash') {
    return /^\d{13}$/.test(value) ? '' : 'Enter the full 13-digit GCash reference from your receipt.'
  }
  const compact = value.replace(/[ -]/g, '')
  if (value.length > 40 || compact.length < 6 || !/^[a-z0-9]+$/i.test(compact) || !/\d/.test(compact)) {
    return 'Copy your full bank reference from the receipt. Enter at least 6 letters or digits, including a number. Spaces and hyphens are allowed.'
  }
  return ''
}
