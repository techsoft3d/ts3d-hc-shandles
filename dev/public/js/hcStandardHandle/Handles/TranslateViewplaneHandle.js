import { StandardHandle, handleType } from './StandardHandle.js';
import * as utility from '../utility.js';

export class TranslateViewplaneHandle extends StandardHandle {
    
    constructor(group,color) {
        super(group);
        this._type = handleType.translateViewplane;
        this._color = color;
    }
   
    async show() {
        let viewer = this._group.getViewer();
        this._nodeid = viewer.model.createNode(this._group._topNode, "");

        if (!this._group.getManager()._sphereMesh) {
            this._group.getManager()._sphereMesh  = await utility.createSphereMesh(viewer);   
        }

        let myMeshInstanceData = new Communicator.MeshInstanceData(this._group.getManager()._sphereMesh);
        await viewer.model.createMeshInstance(myMeshInstanceData,  this._nodeid);

        let scalematrix = new Communicator.Matrix();
        scalematrix.setScaleComponent(0.015, 0.015, 0.015);
        viewer.model.setNodeMatrix(this._nodeid, scalematrix);
        viewer.model.setNodesFaceColor([ this._nodeid], this._color);        
        await super.show();
    }

    async handeMouseMove(event) {
        let viewer = this._group.getViewer();

        let cameraplane = utility.getCameraPlane(viewer,this._startPosition);              
        let ray = viewer.view.raycastFromPoint(event.getPosition());                
        let planeIntersection = new Communicator.Point3();
        cameraplane.intersectsRay(ray, planeIntersection);
    

        for (let i = 0; i < this._startTargetMatrices.length; i++) {

            let p1 = Communicator.Matrix.inverse(viewer.model.getNodeNetMatrix(hwv.model.getNodeParent(this._group._targetNodes[i]))).transform(this._startPosition);
            let p2 = Communicator.Matrix.inverse(viewer.model.getNodeNetMatrix(hwv.model.getNodeParent(this._group._targetNodes[i]))).transform(planeIntersection);
            let delta2 = Communicator.Point3.subtract(p2,p1);
          
            let transmatrix = new Communicator.Matrix();
            transmatrix.setTranslationComponent(delta2.x,delta2.y,delta2.z);
            viewer.model.setNodeMatrix(this._group._targetNodes[i], Communicator.Matrix.multiply(this._startTargetMatrices[i],transmatrix));
        }
        this._group._targetCenter = viewer.model.getNodeNetMatrix(this._group._targetNodes[0]).transform(this._group._targetCenterLocal);        

        this._group.updateHandle();

    }

}
