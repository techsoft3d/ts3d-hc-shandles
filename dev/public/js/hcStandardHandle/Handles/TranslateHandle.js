import { StandardHandle, handleType } from './StandardHandle.js';
import * as utility from '../utility.js';


export class TranslateHandle extends StandardHandle {
    
    constructor(group,axis, angle,color) {
        super(group);
        this._type = handleType.translate;
        this._axis = axis;
        this._rotation = angle;
        this._color = color;
    }

    async generateBaseGeometry() {
        let outpoints = [];
        outpoints.push(new Communicator.Point3(0, 0, 0));
        outpoints.push(new Communicator.Point3(0, 0, 0.15));

        let meshData = utility.calculateTubeMesh(outpoints,0.0045,10);      
        this._group.getManager()._arrowMesh = await this._group.getViewer().model.createMesh(meshData);
    }

    async show() {
        let viewer = this._group.getViewer();

        let offaxismatrix = new Communicator.Matrix();
        if (this._axis) {
            Communicator.Util.computeOffaxisRotation(this._axis, this._rotation, offaxismatrix);
        }
        this._nodeid = viewer.model.createNode(this._group._topNode, "");


        if (!this._group.getManager()._arcmesh) {
            await this.generateBaseGeometry();
        }
        
        let myMeshInstanceData = new Communicator.MeshInstanceData(this._group.getManager()._arrowMesh);
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
        let newnormal = new Communicator.Point3(0,1,0);
        utility.rotatePointAndNormal(this._startmatrix, newpos, newnormal);

        let rplane = Communicator.Plane.createFromPointAndNormal(newpos, newnormal);
      
        let ray = viewer.view.raycastFromPoint(event.getPosition());                
        let planeIntersection = new Communicator.Point3();
        rplane.intersectsRay(ray, planeIntersection);

        let newpos2 = new Communicator.Point3(0,0,0);
        let newnormal2 = new Communicator.Point3(0,0,1);
        utility.rotatePointAndNormal(this._startmatrix, newpos2, newnormal2);
        let pointonline = utility.nearestPointOnLine(newpos2,newnormal2,planeIntersection);

      
        pointonline = utility.getClosestPoint(viewer,newpos2, newnormal2, event.getPosition());

        let delta = Communicator.Point3.subtract(pointonline,this._startPosition);
        ViewerUtility.createDebugCube(viewer,pointonline,1,undefined,true);
//        ViewerUtility.createDebugCube(viewer,planeIntersection,1,undefined,true);


        for (let i = 0; i < this._startTargetMatrices.length; i++) {

          
            let transmatrix = new Communicator.Matrix();
            transmatrix.setTranslationComponent(delta.x,delta.y,delta.z);
            viewer.model.setNodeMatrix(this._group._targetNodes[i], Communicator.Matrix.multiply(this._startTargetMatrices[i],transmatrix));
        }
        this._group._targetCenter = viewer.model.getNodeNetMatrix(this._group._targetNodes[0]).transform(this._group._targetCenterLocal);        

        this._group.updateHandle();


        return;

        // let rplane = Communicator.Plane.createFromPointAndNormal(newpos, newnormal);
        // let adist = Math.abs(Communicator.Util.computeAngleBetweenVector(newnormal, cameraplane.normal));

        // let out = new Communicator.Point3();
        // if (adist > 80 && adist < 100) {
        //     out = utility.closestPointOnPlane(rplane, planeIntersection);
        // }
        // else {

        //     let ray = viewer.view.raycastFromPoint(event.getPosition());
        //     let cameraplane = Communicator.Plane.createFromPointAndNormal(newpos, newnormal);
        //     cameraplane.intersectsRay(ray, out);
        // }

        // let angle = utility.signedAngleFromPoint(this._startPosition, out,newnormal,newpos);
      
        // for (let i = 0; i < this._startTargetMatrices.length; i++) {

        //     let newnormal2 = utility.rotateNormal(Communicator.Matrix.inverse(viewer.model.getNodeNetMatrix(hwv.model.getNodeParent(this._group._targetNodes[i]))),newnormal);
          
        //     let offaxismatrix = new Communicator.Matrix();
        //     Communicator.Util.computeOffaxisRotation(newnormal2, angle, offaxismatrix);    
        //     let center = Communicator.Matrix.inverse(viewer.model.getNodeNetMatrix(hwv.model.getNodeParent(this._group._targetNodes[i]))).transform(this._group._targetCenter);    

        //     viewer.model.setNodeMatrix(this._group._targetNodes[i], utility.performSubnodeRotation(center,this._startTargetMatrices[i],offaxismatrix));
        // }

        this._group.updateHandle();

    }

}
