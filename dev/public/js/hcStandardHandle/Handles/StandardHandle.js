import { StandardHandleManager } from '../StandardHandleManager.js';

export const handleType = {
    axis: 0,
    axisViewplane: 1,
    axisTrackball: 2,
    translate: 3,
    translatePlane: 4,
    translateViewplane: 5,
    scale: 6
};


export class StandardHandle {
    constructor(group) {
        this._group = group;
        this._nodeid = null;
    }

    getType() {
        return this._type;
    }


    async show() {

        let viewer = this._group.getViewer();

        if (this._nodeid) {
            viewer.overlayManager.addNodes(StandardHandleManager.overlayIndex, [this._nodeid]);
            viewer.model.setInstanceModifier(Communicator.InstanceModifier.SuppressCameraScale, [this._nodeid], true);  
            viewer.model.setInstanceModifier(Communicator.InstanceModifier.DoNotLight, [this._nodeid], true); 
            viewer.model.setInstanceModifier(Communicator.InstanceModifier.ExcludeBounding, [this._nodeid], true); 
        }
    }

    update() {
      
    }    

    cameraUpdate(camera) {

    }

    async handeMouseDown(event, selection) {
        let viewer = this._group.getViewer();
        this._startmatrix = await viewer.model.getNodeNetMatrix(this._nodeid);
        this._startTargetMatrices = [];
        for (let j = 0; j < this._group._targetNodes.length; j++) {
            this._startTargetMatrices.push(viewer.model.getNodeMatrix(this._group._targetNodes[j]));
        }

        this._startPosition = selection.getPosition();
        this._startPosition2D = event.getPosition();
    }

    async handeMouseMove(event) {

    }

}
