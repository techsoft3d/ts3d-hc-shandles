import { StandardHandle } from './StandardHandle.js';
import * as utility from './utility.js';

export class StandardHandleManager {

    calculateTubeMesh(allPoints, thickness, tess) {

        let faces = [];
        let normals = [];
        let meshData = new Communicator.MeshData();

        let lastPoints = null;
        for (let i = 0; i < allPoints.length; i++) {
            let outpoints = [];
            let delta;
            if (i < allPoints.length - 1) {
                delta = Communicator.Point3.subtract(allPoints[i + 1], allPoints[i]).normalize();
            }
            else {
                delta = Communicator.Point3.subtract(allPoints[i], allPoints[i - 1]).normalize();

            }
            Communicator.Util.generatePointsOnCircle(outpoints, allPoints[i], thickness, tess, delta);

            if (i > 0) {

                let p = outpoints[0];
                let dist = 100000000000;
                let offset = 0;
                for (let k = 0; k < lastPoints.length; k++) {
                    if (Communicator.Point3.distance(p, lastPoints[k]) < dist) {
                        dist = Communicator.Point3.distance(p, lastPoints[k]);
                        offset = k;
                    }
                }

                let o1 = offset;
                let oplus;

                if (o1 == lastPoints.length - 1) {
                    oplus = 0;
                }
                else {
                    oplus = o1 + 1;
                }

                let k = 0;
                for (let j = 0; j < tess; j++) {
                    let o1 = k + offset;
                    let o2 = k + offset + 1;
                    if (o1 > lastPoints.length - 1) {
                        o1 = o1 - lastPoints.length + 1;
                    }
                    if (o2 > lastPoints.length - 1) {
                        o2 = o2 - lastPoints.length + 1;
                    }


                    k++;
                    if (o1 < 0) {
                        o1 = lastPoints.length - 1 + o1;
                    }
                    if (o2 < 0) {
                        o2 = lastPoints.length - 1 + o2;
                    }

                    let j2 = j + 1;

                    if (j2 > tess - 1) {
                        j2 = 0;
                    }
                    faces.push(lastPoints[o1].x, lastPoints[o1].y, lastPoints[o1].z);
                    faces.push(outpoints[j].x, outpoints[j].y, outpoints[j].z);
                    faces.push(outpoints[j2].x, outpoints[j2].y, outpoints[j2].z);

                    faces.push(outpoints[j2].x, outpoints[j2].y, outpoints[j2].z);
                    faces.push(lastPoints[o2].x, lastPoints[o2].y, lastPoints[o2].z);
                    faces.push(lastPoints[o1].x, lastPoints[o1].y, lastPoints[o1].z);

                    let plane = Communicator.Plane.createFromPoints(lastPoints[o1], outpoints[j], outpoints[j2]);

                    for (let k = 0; k < 6; k++) {
                        normals.push(plane.normal.x, plane.normal.y, plane.normal.z);
                    }
                }
            }
            lastPoints = outpoints;
        }

        if (this._smoothShading) {
            normals = this._averageNormals(faces);
        }

        meshData.addFaces(faces, normals);
        return meshData;

    }

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
                    _this._handles[i].orientToCamera(_this._viewer.view.getCamera());

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

        let meshData = this.calculateTubeMesh(outpoints.splice(0,outpoints.length/2),0.0045,10);
      
        this._arcmesh = await this._viewer.model.createMesh(meshData);

        this._sphereMesh  = await utility.createSphereMesh(this._viewer);

        let outpoints2 = [];
        Communicator.Util.generatePointsOnCircle(outpoints2, new Communicator.Point3(0, 0, 0), 0.15, 64, new Communicator.Point3(0, 0, 1));

        let meshData2 = this.calculateTubeMesh(outpoints2,0.0045,10);
        this._circleMesh = await this._viewer.model.createMesh(meshData2);
    }

    async create(nodeid, center = null, rotation = null) {
        let handle = new StandardHandle(this._viewer, this);
        await handle.show(nodeid, center, rotation);
        this._handles.push(handle);

    }

    remove() {
        this._viewer.model.deleteNode(this._handlenode);
        this._handlenode = this._viewer.model.createNode(this._viewer.model.getRootNode(), "advancedHandles");
        this._handles = [];
    }

}


       
StandardHandleManager.overlayIndex = 7;

