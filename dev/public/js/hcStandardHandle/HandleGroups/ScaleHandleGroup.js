import { StandardHandleGroup } from './StandardHandleGroup.js';
import { ScaleHandle } from '../Handles/ScaleHandle.js';


export class ScaleHandleGroup extends StandardHandleGroup {
    constructor(viewer, manager) {
        super(viewer, manager);
    }
  
    async show(nodeids, center = null, rotation = null) {

        await super.show(nodeids, center, rotation)

        this._handles.push(new ScaleHandle(this,null,0,new Communicator.Color(255,0,0)));
        this._handles.push(new ScaleHandle(this,new Communicator.Point3(0,1,0),90,new Communicator.Color(0,255,0)));
        this._handles.push(new ScaleHandle(this,new Communicator.Point3(1,0,0),-90,new Communicator.Color(0,0,255)));

        for (let i = 0; i < this._handles.length; i++) {
            await this._handles[i].show();
        }
   
    }   
}
