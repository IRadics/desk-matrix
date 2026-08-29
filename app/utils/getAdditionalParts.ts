const smallScrew: AdditionalPart = {
  partName: 'Small thread bolt 9mm',
  description:
    'For securing the beams to each other. Flat t-bolt is recommended, but any 9mm long small bolt works.',
  quantity: 1,
  url: 'https://than.gs/m/973894',
}

const largeScrew: AdditionalPart = {
  partName: 'Big thread bolt 20mm - with small thread on end',
  description:
    'For securing the clamp to the desk. The small hole at the end is important for the desk protector plate.',
  quantity: 1,
  url: 'https://than.gs/m/974395',
}

const bottomProtector: AdditionalPart = {
  partName: 'Bottom desk protector',
  description:
    'For protecting the bottom of the desk by distributing the weight and clamping force',
  quantity: 1,
}

const topProtector: AdditionalPart = {
  partName: 'Top desk protector',
  description:
    'For protecting the top of the desk by distributing the weight and clamping force',
  quantity: 1,
}

const tpuPad: AdditionalPart = {
  partName: 'Bottom protector TPU pad (OPTIONAL)',
  description: 'For better clamping force distribution and anti-slip use',
  quantity: 1,
}

const addPart = (
  parts: AdditionalPart[],
  part: AdditionalPart,
  quantity: number = 1,
) => {
  const existing = parts.find(p => p.partName === part.partName)
  if (existing) {
    existing.quantity += quantity
  } else {
    parts.push({ ...part, quantity: quantity })
  }
}

export const getAdditionalparts = (
  parts: Part[],
): {
  bolts: AdditionalPart[]
  other: AdditionalPart[]
} => {
  const bolts: AdditionalPart[] = []
  const other: AdditionalPart[] = []
  parts.forEach(part => {
    switch (part.partType) {
      case 'beam': {
        if (
          part.beamType === 'female-male' ||
          part.beamType === 'male-female'
        ) {
          addPart(bolts, smallScrew, 1)
        } else if (part.beamType === 'male-male') {
          addPart(bolts, smallScrew, 2)
        }
        break
      }
      case '2-way-corner': {
        addPart(bolts, smallScrew, 2)
        break
      }
      case '3-way-corner': {
        addPart(bolts, smallScrew, 3)
        break
      }
      case '4-way-corner': {
        addPart(bolts, smallScrew, 3)
        break
      }
      case 'clamp': {
        addPart(bolts, largeScrew, 1)
        addPart(other, topProtector, 1)
        addPart(other, bottomProtector, 1)
        addPart(other, tpuPad, 1)
        break
      }

      default:
        break
    }
  })

  return {
    bolts,
    other,
  }
}
