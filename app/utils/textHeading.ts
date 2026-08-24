export const textHeading = (text: string, width = 50): string => {
  const content = ` ${text} `
  const remaining = Math.max(0, width - content.length)

  const left = Math.floor(remaining / 2)
  const right = remaining - left

  return `${'='.repeat(left)}${content}${'='.repeat(right)}`
}