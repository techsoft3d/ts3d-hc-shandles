import Quaternion from './quaternion.min.js';
import * as utility from './utility.js';


export class StandardHandleOperator {
    constructor(viewer, manager) {
        this._viewer = viewer;
        this._manager = manager;
        this._startmatrix = null;
        this._selectedHandle = null;
        this._isClick = false;

    }

    async onMouseDown(event) {
        this._selectedHandle = null;
        this._isClick = true;

        let config = new Communicator.PickConfig(Communicator.SelectionMask.Line);
        config.restrictToOverlays = true;
        const selection = await this._viewer.view.pickFromPoint(
            event.getPosition(),
            config,
        );
        if (selection.getPosition()) {            

//            ViewerUtility.createDebugCube(this._viewer,selection.getPosition(),1,undefined);
            let nodeid = this._viewer.model.getNodeParent(selection.getNodeId());
            let topnode = this._viewer.model.getNodeParent(nodeid);
            for (let i=0;i<this._manager._handles.length;i++) {
                if (this._manager._handles[i]._topNode == topnode || this._manager._handles[i]._topNode2 == topnode) {
                    this._selectedHandle = this._manager._handles[i];
                    this._selectedNode = nodeid;
                    this._startmatrix = await this._viewer.model.getNodeNetMatrix(nodeid);

                    this._startTargetMatrices = [];
                    for (let j=0;j<this._selectedHandle._targetNodes.length;j++) {
                        this._startTargetMatrices.push(this._viewer.model.getNodeMatrix( this._selectedHandle._targetNodes[j]));
                    }
                    this._startPosition = selection.getPosition();
                    this._startPosition2D = event.getPosition();
                    event.setHandled(true);        
                    this._doQuaternion = false;
                    this._viewplaneRotate = false;
                    this.oldColor = await this._viewer.model.getNodesFaceColor([nodeid]);
                    this._viewer.model.setNodesFaceColor([nodeid], new Communicator.Color(255, 255, 0));

                    if (this._manager._handles[i]._topNode2 == topnode) {
                        this._viewplaneRotate = true;
                    }

                    if (this._selectedHandle._axis[3] == nodeid) {                    
                        this._doQuaternion = true;
                    }
                    break;
                }
            }
            
        }
    }
   
    async onMouseMove(event) {
        this._isClick = false;

        if (this._selectedHandle) {

            if (this._viewplaneRotate) {

                let cameraplane = utility.getCameraPlane(this._viewer,this._startPosition);

                let ray = this._viewer.view.raycastFromPoint(event.getPosition());
                let intersectionPoint1 = new Communicator.Point3();
                cameraplane.intersectsRay(ray, intersectionPoint1);

                let ray2 = this._viewer.view.raycastFromPoint(this._startPosition2D);
                let intersectionPoint2 = new Communicator.Point3();
                cameraplane.intersectsRay(ray2, intersectionPoint2);
          
                let angle = utility.signedAngleFromPoint(intersectionPoint2, intersectionPoint1, cameraplane.normal,this._selectedHandle._targetCenter);
              
                for (let i = 0; i < this._startTargetMatrices.length; i++) {

                    let vec2 = utility.rotateNormal(Communicator.Matrix.inverse(this._viewer.model.getNodeNetMatrix(hwv.model.getNodeParent(this._selectedHandle._targetNodes[i]))),cameraplane.normal);

                    let offaxismatrix = new Communicator.Matrix();
                    Communicator.Util.computeOffaxisRotation(vec2, angle, offaxismatrix);    

                    let center = Communicator.Matrix.inverse(this._viewer.model.getNodeNetMatrix(hwv.model.getNodeParent(this._selectedHandle._targetNodes[i]))).transform(this._selectedHandle._targetCenter);    
                 
                    this._viewer.model.setNodeMatrix(this._selectedHandle._targetNodes[i], utility.performSubnodeRotation(center,this._startTargetMatrices[i],offaxismatrix));
                }

                this._selectedHandle.updateHandle();           

            }
            else if (this._doQuaternion) {

                let config = new Communicator.PickConfig(Communicator.SelectionMask.Line);
                config.restrictToOverlays = true;
                const selection = await this._viewer.view.pickFromPoint(
                    event.getPosition(),
                    config,
                );
                if (selection.getPosition()) {            
                    let pos = selection.getPosition();
                    let d1 = Communicator.Point3.subtract(this._startPosition,this._selectedHandle._targetCenter);
                    d1.normalize();
                    let d2 = Communicator.Point3.subtract(pos,this._selectedHandle._targetCenter);
                    d2.normalize();

                    for (let i = 0; i < this._startTargetMatrices.length; i++) {
                        let d1n = utility.rotateNormal(Communicator.Matrix.inverse(this._viewer.model.getNodeNetMatrix(hwv.model.getNodeParent(this._selectedHandle._targetNodes[i]))),d1);
                        let d2n = utility.rotateNormal(Communicator.Matrix.inverse(this._viewer.model.getNodeNetMatrix(hwv.model.getNodeParent(this._selectedHandle._targetNodes[i]))),d2);

                        let cq = Quaternion.fromBetweenVectors([d1n.x,d1n.y,d1n.z ], [d2n.x,d2n.y,d2n.z]);
                        let cquat = new Communicator.Quaternion(cq.x,cq.y,cq.z,cq.w);        
                        let qmat2 = Communicator.Quaternion.toMatrix(cquat);
    
                        let center = Communicator.Matrix.inverse(this._viewer.model.getNodeNetMatrix(hwv.model.getNodeParent(this._selectedHandle._targetNodes[i]))).transform(this._selectedHandle._targetCenter);    
                     
                        this._viewer.model.setNodeMatrix(this._selectedHandle._targetNodes[i], utility.performSubnodeRotation(center,this._startTargetMatrices[i],qmat2));
                    }

                    this._selectedHandle.updateHandle();
                }
            }
            else {

                let newpos = new Communicator.Point3(0,0,0);
                let newnormal = new Communicator.Point3(0,0,1);
                utility.rotatePointAndNormal(this._startmatrix, newpos, newnormal);

                let cameraplane = utility.getCameraPlane(this._viewer,this._startPosition);
              
                let ray = this._viewer.view.raycastFromPoint(event.getPosition());                
                let planeIntersection = new Communicator.Point3();
                cameraplane.intersectsRay(ray, planeIntersection);


                let rplane = Communicator.Plane.createFromPointAndNormal(newpos, newnormal);
                let adist = Math.abs(Communicator.Util.computeAngleBetweenVector(newnormal, cameraplane.normal));

                let out = new Communicator.Point3();
                if (adist > 80 && adist < 100) {
                    out = utility.closestPointOnPlane(rplane, planeIntersection);
                }
                else {

                    let ray = this._viewer.view.raycastFromPoint(event.getPosition());
                    let cameraplane = Communicator.Plane.createFromPointAndNormal(newpos, newnormal);
                    cameraplane.intersectsRay(ray, out);
                }
    
                let angle = utility.signedAngleFromPoint(this._startPosition, out,newnormal,newpos);
              
                for (let i = 0; i < this._startTargetMatrices.length; i++) {

                    let newnormal2 = utility.rotateNormal(Communicator.Matrix.inverse(this._viewer.model.getNodeNetMatrix(hwv.model.getNodeParent(this._selectedHandle._targetNodes[i]))),newnormal);
                  
                    let offaxismatrix = new Communicator.Matrix();
                    Communicator.Util.computeOffaxisRotation(newnormal2, angle, offaxismatrix);    
                    let center = Communicator.Matrix.inverse(this._viewer.model.getNodeNetMatrix(hwv.model.getNodeParent(this._selectedHandle._targetNodes[i]))).transform(this._selectedHandle._targetCenter);    

                    this._viewer.model.setNodeMatrix(this._selectedHandle._targetNodes[i], utility.performSubnodeRotation(center,this._startTargetMatrices[i],offaxismatrix));
                }

                this._selectedHandle.updateHandle();
            }
            event.setHandled(true);
        }
    }

    async onMouseUp(event) {

        if (this._selectedHandle) {
            this._viewer.model.setNodesFaceColor([this._selectedNode], this.oldColor[0]);
            this._selectedHandle = null;
        }

        if (this._isClick) {
            this._manager.remove();
        }

    }
}
