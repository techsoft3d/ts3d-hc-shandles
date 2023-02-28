import { StandardHandle, handleType } from './StandardHandle.js';
import * as utility from '../utility.js';


export class ScaleHandle extends StandardHandle {
    
    constructor(group,axis,rot, color) {
        super(group);
        this._type = handleType.axis;
        this._axis = axis;
        this._rotation = rot;
        this._color = color;
    }

    async generateBaseGeometry() {
    
        let viewer = this._group.getViewer();
        this._group.getManager()._cubeMesh = await utility.createCubeMesh(viewer,new Communicator.Point3(0,0,0.15),0.025);

        let outpoints = [];
        outpoints.push(new Communicator.Point3(0, 0, 0));
        outpoints.push(new Communicator.Point3(0, 0, 0.15));

        let meshData = utility.calculateTubeMesh(outpoints,0.0045,10);      
        this._group.getManager()._cubeMesh2 = await this._group.getViewer().model.createMesh(meshData);

    }


    async show() {
        let viewer = this._group.getViewer();

        let offaxismatrix = new Communicator.Matrix();
        if (this._axis) {
            Communicator.Util.computeOffaxisRotation(this._axis, this._rotation, offaxismatrix);
        }
        this._nodeid = viewer.model.createNode(this._group._topNode, "");


        if (!this._group.getManager()._cubeMesh) {
            await this.generateBaseGeometry();
        }
        
        let myMeshInstanceData = new Communicator.MeshInstanceData(this._group.getManager()._cubeMesh);
        await viewer.model.createMeshInstance(myMeshInstanceData, this._nodeid);

        myMeshInstanceData = new Communicator.MeshInstanceData(this._group.getManager()._cubeMesh2);
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

        let cameraplane = utility.getCameraPlane(viewer,this._startPosition);
      
        let ray = viewer.view.raycastFromPoint(event.getPosition());                
        let planeIntersection = new Communicator.Point3();
        cameraplane.intersectsRay(ray, planeIntersection);


        let rplane = Communicator.Plane.createFromPointAndNormal(newpos, newnormal);
        let adist = Math.abs(Communicator.Util.computeAngleBetweenVector(newnormal, cameraplane.normal));

        let out = new Communicator.Point3();
        if (adist > 80 && adist < 100) {
            out = utility.closestPointOnPlane(rplane, planeIntersection);
        }
        else {

            let ray = viewer.view.raycastFromPoint(event.getPosition());
            let cameraplane = Communicator.Plane.createFromPointAndNormal(newpos, newnormal);
            cameraplane.intersectsRay(ray, out);
        }

        let angle = utility.signedAngleFromPoint(this._startPosition, out,newnormal,newpos);
      
        for (let i = 0; i < this._startTargetMatrices.length; i++) {

            let newnormal2 = utility.rotateNormal(Communicator.Matrix.inverse(viewer.model.getNodeNetMatrix(hwv.model.getNodeParent(this._group._targetNodes[i]))),newnormal);
          
            let offaxismatrix = new Communicator.Matrix();
            Communicator.Util.computeOffaxisRotation(newnormal2, angle, offaxismatrix);    
            let center = Communicator.Matrix.inverse(viewer.model.getNodeNetMatrix(hwv.model.getNodeParent(this._group._targetNodes[i]))).transform(this._group._targetCenter);    

            viewer.model.setNodeMatrix(this._group._targetNodes[i], utility.performSubnodeRotation(center,this._startTargetMatrices[i],offaxismatrix));
        }

        this._group.updateHandle();

    }

}
