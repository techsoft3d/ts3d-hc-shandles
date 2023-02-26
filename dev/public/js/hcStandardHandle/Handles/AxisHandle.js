import { StandardHandle, handleType } from './StandardHandle.js';
import * as utility from '../utility.js';


export class AxisHandle extends StandardHandle {
    constructor(group,axis,rot, color) {
        super(group);
        this._type = handleType.axis;
        this._axis = axis;
        this._rotation = rot;
        this._color = color;
    }

    async show() {
        let viewer = this._group.getViewer();

        let offaxismatrix = new Communicator.Matrix();
        if (axis) {
            Communicator.Util.computeOffaxisRotation(this._axis, this._rotation, offaxismatrix);
        }
        this._nodeid = viewer.model.createNode(this._group._topNode, "");
        myMeshInstanceData = new Communicator.MeshInstanceData(this._group.getManager()._arcmesh);
        await viewer.model.createMeshInstance(myMeshInstanceData, this._nodeid);
        if (axis) {
            viewer.model.setNodeMatrix(this._nodeid, offaxismatrix);
        }
        viewer.model.setNodesFaceColor([this._nodeid], color);

        super.show();
        this.orientToCamera(camera);
    }

    cameraUpdate(camera) {
        this.orientToCamera(camera);
    }

    update(camera) {
      this.orientToCamera(camera);
    }    

    async orientToCamera(camera) {
        let viewer = this._group.getViewer();
        let camPos = camera.getPosition();
        let matx = viewer.model.getNodeMatrix(this._nodeid);
        let mat = viewer.model.getNodeNetMatrix(this._nodeid);
        let matinverse = Communicator.Matrix.inverse(mat);
        let camPos2 = matinverse.transform(camPos);
        let plane = Communicator.Plane.createFromPointAndNormal(new Communicator.Point3(0, 0, 0), new Communicator.Point3(0, 0, 1));
        let res = utility.closestPointOnPlane(plane, camPos2);
        res.normalize();
        let angle = utility.signedAngle(new Communicator.Point3(-1, 0, 0), res, new Communicator.Point3(0, 0, 1));
        let offaxismatrix = new Communicator.Matrix();
        Communicator.Util.computeOffaxisRotation(new Communicator.Point3(0, 0, 1), angle, offaxismatrix);

        let resmatrix = Communicator.Matrix.multiply(offaxismatrix, matx);
        await viewer.model.setNodeMatrix(this._axis[i], resmatrix);
    }    
}
