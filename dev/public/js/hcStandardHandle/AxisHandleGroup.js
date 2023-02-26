import { StandardHandleManager } from './StandardHandleManager.js';
import { StandardHandleGroup } from './StandardHandleGroup.js';
import { AxisHandle } from 'Handles/AxisHandle.js';

import * as utility from './utility.js';


export class AxisHandleGroup extends StandardHandleGroup {
    constructor(viewer, manager) {
        super(viewer, manager);
    }

  
    async show(nodeids, center = null, rotation = null) {

        super.show(nodeids, center, rotation)

        this._handles.push(new AxisHandle(this._viewer,this,null,0,new Communicator.Color(255,0,0)));
        this._handles.push(new AxisHandle(this._viewer,this,new Communicator.Point(0,1,0),90,new Communicator.Color(0,255,0)));
        this._handles.push(new AxisHandle(this._viewer,this,new Communicator.Point(1,0,0),90,new Communicator.Color(0,0,255)));
        this._handles.push(new AxisTrackballHandle(this._viewer,this,new Communicator.Color(0,255,0)));
        this._handles.push(new AxisViewplaneHandle(this._viewer,this,new Communicator.Color(222, 222, 222)));
   
    }

   
}
