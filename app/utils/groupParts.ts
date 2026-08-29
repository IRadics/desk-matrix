function getPartGroupKey(part: AddPartData): string {
  switch (part.partType) {
    case 'beam':
      return ['beam', part.length, part.snapType, part.beamType].join('|')

    case '2-way-corner':
    case '3-way-corner':
    case '4-way-corner':
      return [part.partType, part.snapType].join('|')

    case 'clamp':
      return 'clamp'

    case 'board':
      return ['board', part.width, part.height].join('|')
  }
}

export function groupParts(parts: Part[], typeFilter?: Part['partType'][]) {
  const groups = new Map<string, Part[]>()

  if (typeFilter) {
    parts = parts.filter(p => typeFilter.includes(p.partType))
  }

  for (const part of parts) {
    const key = getPartGroupKey(part)

    const group = groups.get(key)

    if (group) {
      group.push(part)
    } else {
      groups.set(key, [part])
    }
  }

  return [...groups.values()]
}
