export type PartType = 'beam' | '2-way-corner' | '3-way-corner' | '4-way-corner' |  'clamp' | 'board'
import type { ShallowUnwrapRef } from 'vue'

export type RefLike<T> = Ref<T> | ComputedRef<T>

export type SnapPoint = {
    id: string,
    orientation? : 'horizontal' | 'vertical',
    x: number,
    y: number,
    type: 'female' | 'male' | 'snap' | 'snapHole'
    direction?: number,
    node: Shape<ShapeConfig>
    offsetToParent: { x: number, y: number }
}

export type Part = {
    id: string,
    partType: PartType
    length?: number
    width?: number
    height?: number
    snapType?: 'regular' | 'quad' | 'none'
    beamType?: 'male-female' | 'female-male' | 'male-male' | 'female-female'
    group?: string | null
    initialPosition?: {x: number, y:number}
}

export type SnapPointConnection = {
    partRef: PartInstance, 
    snapPoint: SnapPoint
}

export type ExposePartInstance = {
    id: string
    getSnapPoints: () => SnapPoint[]
    highlightSnapPoint: (id: string | null) => void
    isDragging: RefLike<boolean>,
    node: RefLike<Group>
    rotate?: () => void
    partType: PartType
}

export type PartInstance = ShallowUnwrapRef<ExposePartInstance>

export type GroupData = {
     part: Part, node: Group 
}[];