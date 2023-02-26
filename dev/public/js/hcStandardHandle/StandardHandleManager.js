import { StandardHandle } from './Handles/StandardHandle.js';
import * as utility from './utility.js';

export class StandardHandleManager {

  
    constructor(viewer) {
        this._viewer = viewer;
        this._handles = [];
        this._handlenode = this._viewer.model.createNode(this._viewer.model.getRootNode(), "advancedHandles");
        var _this = this;

        this._viewer.overlayManager.setCamera(
            StandardHandleManager.overlayIndex,
            this._viewer.view.getCamera());


        this._viewer.setCallbacks({
            camera: function (type, nodeids, mat1, mat2) {
                _this._viewer.overlayManager.setCamera(
                    StandardHandleManager.overlayIndex,
                    _this._viewer.view.getCamera(),
                );

                for (let i = 0; i < _this._handles.length; i++) {
                    _this._handles[i].cameraUpdate(_this._viewer.view.getCamera());

                }
           
            },
        });

        this._viewer.overlayManager.setViewport(
            StandardHandleManager.overlayIndex, Communicator.OverlayAnchor.UpperLeftCorner, 0, Communicator.OverlayUnit.ProportionOfCanvas, 0, Communicator.OverlayUnit.ProportionOfCanvas,
            1, Communicator.OverlayUnit.ProportionOfCanvas, 1, Communicator.OverlayUnit.ProportionOfCanvas);
    }



    async create(nodeid, center = null, rotation = null) {
        let handle = new StandardHandle(this._viewer, this);
        await handle.show(nodeid, center, rotation);
        this._handles.push(handle);

    }

    async add(handleGroup, nodeid, center = null, rotation = null) {
        this._handles.push(handleGroup);
        await handleGroup.show(nodeid, center, rotation);

    }

    remove() {
        this._viewer.model.deleteNode(this._handlenode);
        this._handlenode = this._viewer.model.createNode(this._viewer.model.getRootNode(), "advancedHandles");
        this._handles = [];
    }

    getHandleGroup(nodeid) {
        for (let i = 0; i < this._handles.length; i++) {
            if (this._handles[i]._topNode == nodeid || this._handles[i]._topNode2 == nodeid) {
                return this._handles[i];
            }
        }

    }

    refreshAll(activeHandle) {
        for (let i = 0; i < this._handles.length; i++) {
            if (this._handles[i] != activeHandle) {
                this._handles[i]._targetCenter = this._viewer.model.getNodeNetMatrix(this._handles[i]._targetNodes[0]).transform(this._handles[i]._targetCenterLocal);        
                this._handles[i].updateHandle();
            }

        }
    }
}


       
StandardHandleManager.overlayIndex = 7;

