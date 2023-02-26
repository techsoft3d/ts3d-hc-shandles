import { StandardHandleManager } from '../StandardHandleManager.js';

export const handleType = {
    axis: 0,
    axisViewplane: 1,
    axisTrackball: 2
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
        }
    }


    update() {
      
    }    


    cameraUpdate(camera) {

    }
}
