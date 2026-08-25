import type { ContextMenuItem, RadioGroupItem } from "@nuxt/ui"

export enum Visibility  {
    'normal' = 'normal',
    'dimmed' = 'dimmed',
    'hidden' = 'hidden'
}
const boardVisibility = ref<Visibility>(Visibility.normal)
const boardSettings = computed(()=>{
    return {
        opacity: boardVisibility.value === Visibility.dimmed? 0.5 : 1,
        visible: boardVisibility.value !== Visibility.hidden
    }
})

const beamVisibility = ref<Visibility>(Visibility.normal)
const beamSettings = computed(()=>{
    return {
        opacity: beamVisibility.value === Visibility.dimmed? 0.5 : 1,
        visible: beamVisibility.value !== Visibility.hidden
    }
})

const visibilityItems : RadioGroupItem[] =
[
    {
        label: Visibility.normal,
        value: Visibility.normal,
    },
    {
        label: Visibility.dimmed,
        value: Visibility.dimmed
    },
    {
        label: Visibility.hidden,
        value: Visibility.hidden
    }
]


export const useItemSettings = () =>{

    const setBoardVisibility=(value: Visibility)=>{
        boardVisibility.value = value
    }

    const setBeamVisibility=(value: Visibility)=>{
        beamVisibility.value = value
    }

    return {
        visibilityItems,
        setBoardVisibility,
        boardVisibility,
        boardSettings,
        setBeamVisibility,
        beamVisibility,
        beamSettings
    }
}