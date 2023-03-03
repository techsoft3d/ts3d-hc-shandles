import { StandardHandleGroup } from './StandardHandleGroup.js';
import { AxisHandle } from '../Handles/AxisHandle.js';
import { AxisTrackballHandle } from '../Handles/AxisTrackballHandle.js';
import { AxisViewplaneHandle } from '../Handles/AxisViewplaneHandle.js';


export class AxisHandleGroup extends StandardHandleGroup {
    constructor(viewer, manager) {
        super(viewer, manager);
    }

  
    async show(nodeids, center = null, rotation = null) {

        await super.show(nodeids, center, rotation)

        this._handles.push(new AxisHandle(this,null,0,new Communicator.Color(255,0,0)));
        this._handles.push(new AxisHandle(this,new Communicator.Point3(0,1,0),90,new Communicator.Color(0,200,0)));
        this._handles.push(new AxisHandle(this,new Communicator.Point3(1,0,0),90,new Communicator.Color(0,0,255)));
        this._handles.push(new AxisTrackballHandle(this,new Communicator.Color(200,200,200),0.3));
        this._handles.push(new AxisViewplaneHandle(this,new Communicator.Color(222, 222, 222)));

        for (let i = 0; i < this._handles.length; i++) {
            await this._handles[i].show();
        }
   
    }   
}
