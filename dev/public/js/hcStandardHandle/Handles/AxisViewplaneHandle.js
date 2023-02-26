import { StandardHandle, handleType } from './StandardHandle.js';


export class AxisViewplaneHandle extends StandardHandle {
    constructor(group,color) {
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
        scalematrix.setScaleComponent(1.2,1.2,1.2);
        viewer.model.setNodeMatrix(this._nodeid, scalematrix);
        viewer.model.setNodesFaceColor([this._nodeid], this._color);
        await super.show();
        viewer.model.setInstanceModifier(Communicator.InstanceModifier.ScreenOriented, [this._nodeid], true);  
    }  
}
