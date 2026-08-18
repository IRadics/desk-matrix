import type { Vector2d } from "konva/lib/types";

export const screenToStagePosition = (stage: Stage, screenPos: Vector2d) => {
    const transform = stage.getAbsoluteTransform().copy();
    transform.invert();

    const stageCenter = transform.point(screenPos);

    return stageCenter
}

export const screenCenterToStagePosition = (stage: Stage) => {
    const rect = stage.container().getBoundingClientRect();

    const screenCenter = {
        x: window.innerWidth / 2 - rect.left,
        y: window.innerHeight / 2 - rect.top,
    };

    return screenToStagePosition(stage, screenCenter)
}

