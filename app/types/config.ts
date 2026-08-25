const getVar = (variable: string) => {
    return window.getComputedStyle(document.documentElement).getPropertyValue(variable);
}


export const BEAMWIDTH = 29;
export const SNAPRADIUS = 11;
export const CON_HL_COLOR = getVar('--ui-primary');
export const SNAPCOLOR = getVar('--snap-color')

export const STROKECOLOR = getVar('--stroke-color')
export const STROKEWIDTH = 1
export const STROKESELECTEDCOLOR = 'blue'
export const STROKESELECTEDWIDTH = 3


export const BEAM = {
    color: getVar('--beam-color')
}

export const BOARD = {
    color: getVar('--board-color')
}

export const CLAMP = {
    color: getVar('--clamp-color'),
    colorDark: getVar('--clamp-color-dark')
}