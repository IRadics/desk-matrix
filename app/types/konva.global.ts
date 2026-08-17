declare global {
  type RectConfig = import('konva/lib/shapes/Rect').RectConfig
  type CircleConfig = import('konva/lib/shapes/Circle').CircleConfig
  type TextConfig = import('konva/lib/shapes/Text').TextConfig
  type GroupConfig = import('konva/lib/Group').GroupConfig
  type ShapeConfig = import('konva/lib/Shape').ShapeConfig
  type RegularPolygonConfig = import('konva/lib/shapes/RegularPolygon').RegularPolygonConfig
  type LayerConfig = import('konva/lib/Layer').LayerConfig
  type StageConfig = import('konva/lib/Stage').StageConfig

  type Rect = import('konva/lib/shapes/Rect').Rect
  type Circle = import('konva/lib/shapes/Circle').Circle
  type TextKonva = import('konva/lib/shapes/Text').Text
  type Group = import('konva/lib/Group').Group
  type Shape<T extends ShapeConfig> = import('konva/lib/Shape').Shape<T>
  type RegularPolygon =  import('konva/lib/shapes/RegularPolygon').RegularPolygon
  type Layer = import('konva/lib/Layer').Layer
  type Stage = import('konva/lib/Stage').Stage
}

export {}