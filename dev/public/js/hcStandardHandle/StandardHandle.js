import { StandardHandleManager } from './StandardHandleManager.js';
import * as utility from './utility.js';


export class StandardHandle {
    constructor(viewer, manager) {
        this._viewer = viewer;
        this._manager = manager;
        this._axis = [];
        this._targetNodes = null;
        this._relative = true;
    }

    remove() {
        this._viewer.model.deleteNode(this._handlenode);
    }

    setRelative(relative) {
        this._relative = relative;
        this.updateHandle();
    }

    getRelative() {
        return this._relative;
    }

    updateHandle() {
        let startRot = this._calculateStartMatrix();
        let center2 = this._targetCenter;
        let tmatrix2 = new Communicator.Matrix();
        tmatrix2.setTranslationComponent(center2.x, center2.y, center2.z);
        let b = Communicator.Matrix.multiply(startRot, tmatrix2);
        hwv.model.setNodeMatrix(this._topNode, b);
        this.orientToCamera(this._viewer.view.getCamera());
    }

    async show(nodeids, center = null, rotation = null) {
        this._targetNodes = nodeids;

        if (!center) {
            let bounds = await this._viewer.model.getNodesBounding(nodeids);
            this._targetCenter = bounds.center();
        }
        else {
            this._targetCenter  = center.copy();
        }
        this._extraRotation = rotation;
        await this.defineAxisRotGeometry(this._targetCenter);
        await this.orientToCamera(this._viewer.view.getCamera());
    }

    _calculateStartMatrix() {

        let normalizedMatrix = new Communicator.Matrix();
        if (this._relative) {
            let matrix = this._viewer.model.getNodeNetMatrix(this._targetNodes[0]).copy();
            let row1 = new Communicator.Point3(matrix.m[0], matrix.m[1], matrix.m[2]).normalize();
            let row2 = new Communicator.Point3(matrix.m[4], matrix.m[5], matrix.m[6]).normalize();
            let row3 = new Communicator.Point3(matrix.m[8], matrix.m[9], matrix.m[10]).normalize();


            normalizedMatrix.m[0] = row1.x;
            normalizedMatrix.m[1] = row1.y;
            normalizedMatrix.m[2] = row1.z;

            normalizedMatrix.m[4] = row2.x;
            normalizedMatrix.m[5] = row2.y;
            normalizedMatrix.m[6] = row2.z;

            normalizedMatrix.m[8] = row3.x;
            normalizedMatrix.m[9] = row3.y;
            normalizedMatrix.m[10] = row3.z;          
        }

        if (this._extraRotation) {
            normalizedMatrix = Communicator.Matrix.multiply(this._extraRotation,normalizedMatrix);
        }
       
        return normalizedMatrix;
    }

    async orientToCamera(camera) {

        let camPos = camera.getPosition();
        for (let i = 0; i < 3; i++) {
            let matx = this._viewer.model.getNodeMatrix(this._axis[i]);
            let mat = this._viewer.model.getNodeNetMatrix(this._axis[i]);
            let matinverse = Communicator.Matrix.inverse(mat);
            let camPos2 = matinverse.transform(camPos);
            let plane = Communicator.Plane.createFromPointAndNormal(new Communicator.Point3(0, 0, 0), new Communicator.Point3(0, 0, 1));
            let res = utility.closestPointOnPlane(plane, camPos2);
            res.normalize();
            let angle = utility.signedAngle(new Communicator.Point3(-1, 0, 0), res, new Communicator.Point3(0, 0, 1));
            let offaxismatrix = new Communicator.Matrix();
            Communicator.Util.computeOffaxisRotation(new Communicator.Point3(0, 0, 1), angle, offaxismatrix);

            let resmatrix = Communicator.Matrix.multiply(offaxismatrix, matx);
            await this._viewer.model.setNodeMatrix(this._axis[i], resmatrix);
        }

    }

    async defineAxisRotGeometry(center) {

        this._topNode = this._viewer.model.createNode(this._manager._handlenode, "");
        this._topNode2 = this._viewer.model.createNode(this._manager._handlenode, "");


        let startRot = this._calculateStartMatrix();

        let tmatrix2 = new Communicator.Matrix();
        tmatrix2.setTranslationComponent(center.x, center.y, center.z);
        let b = Communicator.Matrix.multiply(startRot, tmatrix2);

        hwv.model.setNodeMatrix(this._topNode, b);
        hwv.model.setNodeMatrix(this._topNode2, tmatrix2);


        let nodeid = this._viewer.model.createNode(this._topNode, "");
        let myMeshInstanceData = new Communicator.MeshInstanceData(this._manager._arcmesh);
        await this._viewer.model.createMeshInstance(myMeshInstanceData, nodeid);
        this._viewer.model.setNodesFaceColor([nodeid], new Communicator.Color(255, 0, 0));
        this._axis.push(nodeid);



        let offaxismatrix = new Communicator.Matrix();
        Communicator.Util.computeOffaxisRotation(new Communicator.Point3(0, 1, 0), 90, offaxismatrix);

        nodeid = this._viewer.model.createNode(this._topNode, "");
        myMeshInstanceData = new Communicator.MeshInstanceData(this._manager._arcmesh);
        await this._viewer.model.createMeshInstance(myMeshInstanceData, nodeid);
        this._viewer.model.setNodeMatrix(nodeid, offaxismatrix);
        this._viewer.model.setNodesFaceColor([nodeid], new Communicator.Color(0, 255, 0));
        this._axis.push(nodeid);


        offaxismatrix = new Communicator.Matrix();
        Communicator.Util.computeOffaxisRotation(new Communicator.Point3(1, 0, 0), 90, offaxismatrix);

        nodeid = this._viewer.model.createNode( this._topNode, "");
        myMeshInstanceData = new Communicator.MeshInstanceData(this._manager._arcmesh);
        await this._viewer.model.createMeshInstance(myMeshInstanceData, nodeid);
        this._viewer.model.setNodesFaceColor([nodeid], new Communicator.Color(0, 0, 255));
        this._viewer.model.setNodeMatrix(nodeid, offaxismatrix);

        this._axis.push(nodeid);


        nodeid = this._viewer.model.createNode(this._topNode, "");
        myMeshInstanceData = new Communicator.MeshInstanceData(this._manager._sphereMesh);
        await this._viewer.model.createMeshInstance(myMeshInstanceData, nodeid);

        let scalematrix = new Communicator.Matrix();
        scalematrix.setScaleComponent(0.15, 0.15, 0.15);
        this._viewer.model.setNodeMatrix(nodeid, scalematrix);
        this._viewer.model.setNodesFaceColor([nodeid], new Communicator.Color(0, 255, 0));
        this._viewer.model.setNodesOpacity([nodeid], 0.3);

        this._axis.push(nodeid);

        nodeid = this._viewer.model.createNode(this._topNode2, "");
        myMeshInstanceData = new Communicator.MeshInstanceData(this._manager._circleMesh);
        await this._viewer.model.createMeshInstance(myMeshInstanceData, nodeid);

        scalematrix = new Communicator.Matrix();
        scalematrix.setScaleComponent(1.2,1.2,1.2);
        this._viewer.model.setNodeMatrix(nodeid, scalematrix);
        this._viewer.model.setNodesFaceColor([nodeid], new Communicator.Color(222, 222, 222));

        this._axis.push(nodeid);


        for (let i=0;i<5;i++) {
            this._viewer.overlayManager.addNodes(StandardHandleManager.overlayIndex, [this._axis[i]]);
            this._viewer.model.setInstanceModifier(Communicator.InstanceModifier.SuppressCameraScale, [this._axis[i]], true);  
            this._viewer.model.setInstanceModifier(Communicator.InstanceModifier.DoNotLight, [this._axis[i]], true); 
             if (i==4) {
                 this._viewer.model.setInstanceModifier(Communicator.InstanceModifier.ScreenOriented, [this._axis[i]], true);  

             } 
        }       
    }
}
