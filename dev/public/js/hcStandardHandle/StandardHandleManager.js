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
        this._defineBaseGeometry();
    }

    async _defineBaseGeometry() {

        let outpoints = [];
        Communicator.Util.generatePointsOnCircle(outpoints, new Communicator.Point3(0, 0, 0), 0.15, 64, new Communicator.Point3(0, 0, 1));

        let meshData = utility.calculateTubeMesh(outpoints.splice(0,outpoints.length/2),0.0045,10);
      
        this._arcmesh = await this._viewer.model.createMesh(meshData);

        this._sphereMesh  = await utility.createSphereMesh(this._viewer);

        let outpoints2 = [];
        Communicator.Util.generatePointsOnCircle(outpoints2, new Communicator.Point3(0, 0, 0), 0.15, 64, new Communicator.Point3(0, 0, 1));

        let meshData2 = utility.calculateTubeMesh(outpoints2,0.0045,10);
        this._circleMesh = await this._viewer.model.createMesh(meshData2);
    }

    async create(nodeid, center = null, rotation = null) {
        let handle = new StandardHandle(this._viewer, this);
        await handle.show(nodeid, center, rotation);
        this._handles.push(handle);

    }

    async add(handleGroup, nodeid, center = null, rotation = null) {
        await handleGroup.show(nodeid, center, rotation);
        this._handles.push(handleGroup);

    }

    remove() {
        this._viewer.model.deleteNode(this._handlenode);
        this._handlenode = this._viewer.model.createNode(this._viewer.model.getRootNode(), "advancedHandles");
        this._handles = [];
    }

}


       
StandardHandleManager.overlayIndex = 7;

