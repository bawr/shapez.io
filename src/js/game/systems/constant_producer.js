import { globalConfig } from "../../core/config";
import { DrawParameters } from "../../core/draw_parameters";
import { Vector } from "../../core/vector";
import { ConstantSignalComponent } from "../components/constant_signal";
import { ItemProducerComponent } from "../components/item_producer";
import { GameSystemWithFilter } from "../game_system_with_filter";
import { Entity } from "../entity";
import { MapChunk } from "../map_chunk";
import { GameRoot } from "../root";

export class ConstantProducerSystem extends GameSystemWithFilter {
    /** @param {GameRoot} root */
    constructor(root) {
        super(root, [ConstantSignalComponent, ItemProducerComponent]);
    }

    update() {
        for (let i = 0; i < this.allEntities.length; ++i) {
            const entity = this.allEntities[i];
            const signalComp = entity.components.ConstantSignal;
            const ejectorComp = entity.components.ItemEjector;
            if (!ejectorComp) {
                continue;
            }
            ejectorComp.tryEject(0, signalComp.signal);
        }
    }

    /**
     * Draws a given entity
     * @param {DrawParameters} parameters
     * @param {MapChunk} chunk
     * @param {Entity} entity
     */
    drawChunkEntity(parameters, chunk, entity) {
        const producerComp = entity.components.ItemProducer;
        const signalComp = entity.components.ConstantSignal;

        if (!producerComp || !signalComp) {
            return;
        }

        const staticComp = entity.components.StaticMapEntity;
        const item = signalComp.signal;

        if (!item) {
            return;
        }

        const center = staticComp.getTileSpaceBounds().getCenter().toWorldSpace();

        const localOffset = new Vector(0, 1).rotateFastMultipleOf90(staticComp.rotation);
        item.drawItemCenteredClipped(
            center.x + localOffset.x,
            center.y + localOffset.y,
            parameters,
            globalConfig.tileSize * 0.65
        );
    }
}
