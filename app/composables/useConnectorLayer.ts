const _layer = ref<Layer>()

export const useConnectorLayer = (partGroupNode?: RefLike<Group>, rotation?: RefLike<number>) => {


    const connectors = ref<ConnectorData[]>([])
    const connectorLayer = computed(() => _layer.value)

    const setLayer = (layer: Layer) => {
        _layer.value = layer
    }


    const updateConnectorPositions = () => {
        if(!partGroupNode) return;
        connectors.value.forEach((con) => {
            const offset = con.offsetPosition

            con.node.setAbsolutePosition({
                x: partGroupNode.value.getAbsolutePosition().x + offset.x,
                y: partGroupNode.value.getAbsolutePosition().y + offset.y
            })
        })
    }

    const resetConnectorPositions = () => {
        if(!partGroupNode) return;
        connectors.value.forEach((con) => {
            con.node.rotate(-(rotation?.value ?? 0))
            con.node.setAbsolutePosition({
                x: con.offsetPosition.x + partGroupNode.value.getAbsolutePosition().x,
                y: con.offsetPosition.y + partGroupNode.value.getAbsolutePosition().y
            })
        })
    }


    const setConnectorLayer = () => {
        if (!partGroupNode) return;

        const connectorNodes = partGroupNode.value.find('.connector')
        connectorNodes.forEach((conNode) => {
            conNode.rotate((rotation?.value ?? 0))
            connectors.value.push({
                node: conNode,
                originalParent: conNode.parent!,
                offsetPosition: {
                    x: conNode.getAbsolutePosition().x - partGroupNode.value.getAbsolutePosition().x,
                    y: conNode.getAbsolutePosition().y - partGroupNode.value.getAbsolutePosition().y
                }
            })


        })
        connectors.value.forEach((con) => {
            con.node.moveTo(connectorLayer.value)
        })
        updateConnectorPositions()
    }

    const unSetConnectorLayer = () => {
        if (!partGroupNode) return;
        connectors.value.forEach((con) => {
            con.node.moveTo(con.originalParent)
        })
        resetConnectorPositions()
        connectors.value = []
    }

    return {
        connectorLayer,
        updateConnectorPositions,
        setConnectorLayer,
        unSetConnectorLayer,
        setLayer
    }
}