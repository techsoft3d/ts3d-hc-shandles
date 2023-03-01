import { UndoManager,RotateUndo  } from './UndoManager.js';

import * as utility from './utility.js';

export class StandardHandleManager {

  
    constructor(viewer) {
        this._viewer = viewer;
        this._undoManager = new UndoManager(viewer);
        this._handles = [];
        this._undoManager = new UndoManager(viewer);
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


    async add(handleGroup, nodeid, center = null, rotation = null) {
        this._handles.push(handleGroup);
        await handleGroup.show(nodeid, center, rotation);

    }

    async remove() {
        await this._viewer.model.deleteNode(this._handlenode);
        this._handlenode = await this._viewer.model.createNode(this._viewer.model.getRootNode(), "advancedHandles");
        this._handles = [];
    }

    getHandleGroup(nodeid) {
        for (let i = 0; i < this._handles.length; i++) {
            if (this._handles[i]._topNode == nodeid || this._handles[i]._topNode2 == nodeid) {
                return this._handles[i];
            }
        }

    }

    refreshAll(activeHandle = null) {
        this._viewer.overlayManager.setCamera(
            StandardHandleManager.overlayIndex,
            this._viewer.view.getCamera()
        );
        for (let i = 0; i < this._handles.length; i++) {
            if (this._handles[i] != activeHandle) {
                this._handles[i]._targetCenter = this._viewer.model.getNodeNetMatrix(this._handles[i]._targetNodes[0]).transform(this._handles[i]._targetCenterLocal);        
                this._handles[i].updateHandle();
            }

        }
    }

    setRelative(relative) {
        for (let i = 0; i < this._handles.length; i++) {
            this._handles[i].setRelative(relative);           
        }
    }


    async _getArcCenter(selectionItem) {
        let nodeId = selectionItem.getNodeId();
        let lineEntity = selectionItem.getLineEntity();

        if (nodeId !== null && lineEntity !== null) {
            let model = this._viewer.model;

            let subentityProperty = await model.getEdgeProperty(nodeId, lineEntity.getLineId());
             if (subentityProperty instanceof Communicator.SubentityProperties.CircleElement) {
                    const center = subentityProperty.origin;
                    const matrix = model.getNodeNetMatrix(nodeId);
                    matrix.transform(center, center);
                    return { center: center, normal: subentityProperty.normal };
             }
            return null;        
        }        
    }


    async positionFromSelection(selectionItem) {

        let nodeId = selectionItem.getNodeId();
        let faceEntity = selectionItem.getFaceEntity();
        let lineEntity = selectionItem.getLineEntity();
        let position = null;
        let axis = null;

        if (lineEntity !== null || faceEntity !== null) {
            if (lineEntity != null) {

                let pt = await this._getArcCenter(selectionItem);
                if (pt) {
                    if (pt.normal) {
                        let mat = this._viewer.model.getNodeNetMatrix(nodeId);
                        let p1 = mat.transform(new Communicator.Point3(0, 0, 0));
                        let p2 = mat.transform(pt.normal);
                        let cross = Communicator.Point3.cross(new Communicator.Point3(1, 0, 0), pt.normal);
                        if (cross.length() < 0.00001)
                            cross = Communicator.Point3.cross(new Communicator.Point3(0, 1, 0), pt.normal);

                        axis = Communicator.Point3.subtract(p2, p1);
                    }
                    position = pt.center;
                }
                else {
                    let points = lineEntity.getPoints();
                        axis = Communicator.Point3.subtract(points[1], points[0]);

                        let length_1 = axis.length();
                        position = points[0].copy().add(axis.normalize().scale(length_1 / 2));
                }
            }
            else {
                axis = faceEntity.getNormal();
                position = faceEntity.getBounding().center().copy();
            }
            let rotation = utility.ComputeVectorToVectorRotationMatrix(new Communicator.Point3(1, 0, 0), axis);
            return { position: position, rotation: rotation };
        }
    }

    setUndoPoint(nodeids) {
        let undoPoint = new RotateUndo();
        undoPoint.gather(this._viewer, nodeids);
        this._undoManager.setUndoPoint([undoPoint]);
    }

    undo() {
        this._undoManager.undo();
        this.refreshAll();
    }
    redo() {
        this._undoManager.redo();
        this.refreshAll();
    }
    
}

StandardHandleManager.overlayIndex = 7;

