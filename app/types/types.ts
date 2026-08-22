export type PartType = 'beam' | '2-way-corner' | '3-way-corner' | '4-way-corner' |  'clamp' | 'board'
import type { Node } from 'konva/lib/Node'
import type { Vector2d } from 'konva/lib/types'
import type { ShallowUnwrapRef } from 'vue'

export type RefLike<T> = Ref<T> | ComputedRef<T>
export type Rotation = 0 | 90 | 180 | 270

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

export type AddPartData = {
    partType: PartType
    length?: number
    width?: number
    height?: number
    snapType?: 'regular' | 'quad' | 'none'
    beamType?: 'male-female' | 'female-male' | 'male-male' | 'female-female'
    initialPosition?: {x: number, y:number}
    initialRotation?: 0 | 90 | 180 | 270
}

export type Part = {
    id: string,
    group?: string | null
} & AddPartData



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
    rotation?: RefLike<Rotation>
    partType: PartType
    setConnectorLayer?: () => void
    unSetConnectorLayer?: () => void
    updateConnectorPositions?: ()=>void
}

export type PartInstance = ShallowUnwrapRef<ExposePartInstance>

export type GroupData = {
     part: Part, 
     node: Group,
     componentRef: PartInstance
}[];

export type ConnectorData = {
    node: Node,
    offsetPosition: Vector2d,
    originalParent: Node
}

export type AdditionalPart = {
    partName: string,
    description: string,
    quantity: number
    url?: string
}