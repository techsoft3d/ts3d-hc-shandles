import { StandardHandle, handleType } from './StandardHandle.js';
import * as utility from '../utility.js';


export class AxisViewplaneHandle extends StandardHandle {
    constructor(group, color) {
        super(group);
        this._type = handleType.axisViewplane;
        this._color = color;
    }

    async show() {
        let viewer = this._group.getViewer();


        this._nodeid = viewer.model.createNode(this._group._topNode2, "");
        let myMeshInstanceData = new Communicator.MeshInstanceData(this._group.getManager()._circleMesh);
        await viewer.model.createMeshInstance(myMeshInstanceData, this._nodeid);

        let scalematrix = new Communicator.Matrix();
        scalematrix.setScaleComponent(1.2, 1.2, 1.2);
        viewer.model.setNodeMatrix(this._nodeid, scalematrix);
        viewer.model.setNodesFaceColor([this._nodeid], this._color);
        await super.show();
        viewer.model.setInstanceModifier(Communicator.InstanceModifier.ScreenOriented, [this._nodeid], true);
    }


    async handeMouseMove(event) {
        let viewer = this._group.getViewer();
        let cameraplane = utility.getCameraPlane(viewer,this._startPosition);

        let ray = viewer.view.raycastFromPoint(event.getPosition());
        let intersectionPoint1 = new Communicator.Point3();
        cameraplane.intersectsRay(ray, intersectionPoint1);

        let ray2 = viewer.view.raycastFromPoint(this._startPosition2D);
        let intersectionPoint2 = new Communicator.Point3();
        cameraplane.intersectsRay(ray2, intersectionPoint2);
  
        let angle = utility.signedAngleFromPoint(intersectionPoint2, intersectionPoint1, cameraplane.normal,this._group._targetCenter);
      
        for (let i = 0; i < this._startTargetMatrices.length; i++) {

            let vec2 = utility.rotateNormal(Communicator.Matrix.inverse(viewer.model.getNodeNetMatrix(hwv.model.getNodeParent(this._group._targetNodes[i]))),cameraplane.normal);

            let offaxismatrix = new Communicator.Matrix();
            Communicator.Util.computeOffaxisRotation(vec2, angle, offaxismatrix);    

            let center = Communicator.Matrix.inverse(viewer.model.getNodeNetMatrix(hwv.model.getNodeParent(this._group._targetNodes[i]))).transform(this._group._targetCenter);    
         
            viewer.model.setNodeMatrix(this._group._targetNodes[i], utility.performSubnodeRotation(center,this._startTargetMatrices[i],offaxismatrix));
        }

        this._group.updateHandle();           
    }

}