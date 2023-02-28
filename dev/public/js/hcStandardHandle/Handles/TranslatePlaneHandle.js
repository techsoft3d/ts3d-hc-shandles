import { StandardHandle, handleType } from './StandardHandle.js';
import * as utility from '../utility.js';

export class TranslatePlaneHandle extends StandardHandle {
    
    constructor(group,axis, angle,color) {
        super(group);
        this._type = handleType.translatePlane;
        this._axis = axis;
        this._rotation = angle;
        this._color = color;
    }

    async generateBaseGeometry() {
        let viewer = this._group.getViewer();

        this._group.getManager()._planeMesh = await utility.createPlaneMesh(viewer,0.05,-0.05,0.025);      
    }

    async show() {
        let viewer = this._group.getViewer();

        let offaxismatrix = new Communicator.Matrix();
        if (this._axis) {
            Communicator.Util.computeOffaxisRotation(this._axis, this._rotation, offaxismatrix);
        }
        this._nodeid = viewer.model.createNode(this._group._topNode, "");


        if (!this._group.getManager()._planeMesh) {
            await this.generateBaseGeometry();
        }
        
        let myMeshInstanceData = new Communicator.MeshInstanceData(this._group.getManager()._planeMesh);
        await viewer.model.createMeshInstance(myMeshInstanceData, this._nodeid);
        if (this._axis) {
            viewer.model.setNodeMatrix(this._nodeid, offaxismatrix);
        }
        viewer.model.setNodesFaceColor([this._nodeid], this._color);

        await super.show();
    }

    async handeMouseMove(event) {
        let viewer = this._group.getViewer();
        let newpos = new Communicator.Point3(0,0,0);
        let newnormal = new Communicator.Point3(0,0,1);
        utility.rotatePointAndNormal(this._startmatrix, newpos, newnormal);



        let rplane = Communicator.Plane.createFromPointAndNormal(newpos, newnormal);
      
        let ray = viewer.view.raycastFromPoint(event.getPosition());                
        let planeIntersection = new Communicator.Point3();
        rplane.intersectsRay(ray, planeIntersection);
    

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