import { StandardHandle, handleType } from './StandardHandle.js';


export class AxisTrackballHandle extends StandardHandle {
    constructor(group,color,opacity) {
        super(group);
        this._type = handleType.axisTrackball;
        this._color = color;
        this._opacity = opacity;
    }

    async show() {
        let viewer = this._group.getViewer();
        this._nodeid = viewer.model.createNode(this._group._topNode, "");
        let myMeshInstanceData = new Communicator.MeshInstanceData(this._group.getManager()._sphereMesh);
        await viewer.model.createMeshInstance(myMeshInstanceData,  this._nodeid);

        let scalematrix = new Communicator.Matrix();
        scalematrix.setScaleComponent(0.15, 0.15, 0.15);
        viewer.model.setNodeMatrix(this._nodeid, scalematrix);
        viewer.model.setNodesFaceColor([ this._nodeid], this._color);
        viewer.model.setNodesOpacity([ this._nodeid],this._opacity);

        await super.show();


    }

  
}
