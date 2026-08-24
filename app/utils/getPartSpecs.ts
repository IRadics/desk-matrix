export const getPartSpecs = (part? : Part) =>{

    if(!part) return {
        type: ''
    };

    if(part.partType === 'clamp') {
        return {
            type: capitalizeFirstLetter(part.partType),
            icon: 'i-custom-clamp'
        }
    }
    if(part.partType === 'board') {
        return {
            type: capitalizeFirstLetter(part.partType),
            specs: `${part.width} x ${part.height}`,
            icon: 'i-custom-board'
        }
    }
    if(part.partType === 'beam') {
        return {
            type: `${capitalizeFirstLetter(part.partType)} - ${part.beamType}`,
            specs: `Length: ${part.length}x - Snap: ${part.snapType}`,
            icon: `i-custom-beam-${part.beamType}-${part.snapType}`
        }
    }
    if(part.partType === '2-way-corner' || part.partType === '3-way-corner' || part.partType === '4-way-corner') {
        return {
            type: capitalizeFirstLetter(part.partType),
            specs: `Snap: ${part.snapType}`,
            icon: `i-custom-${part.partType}-${part.snapType}`
        }
    }
}