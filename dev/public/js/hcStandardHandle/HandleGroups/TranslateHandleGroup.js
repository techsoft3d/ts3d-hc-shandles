import { StandardHandleGroup } from './StandardHandleGroup.js';
import { TranslateHandle } from '../Handles/TranslateHandle.js';
import { TranslatePlaneHandle } from '../Handles/TranslatePlaneHandle.js';
import { TranslateViewplaneHandle } from '../Handles/TranslateViewplaneHandle.js';


export class TranslateHandleGroup extends StandardHandleGroup {
    constructor(viewer, manager) {
        super(viewer, manager);
    }
  
    async show(nodeids, center = null, rotation = null) {

        await super.show(nodeids, center, rotation)

        this._handles.push(new TranslateHandle(this,null,0,new Communicator.Color(255,0,0)));
        this._handles.push(new TranslateHandle(this,new Communicator.Point3(1,0,0),90,new Communicator.Color(0,200,0)));
        this._handles.push(new TranslateHandle(this,new Communicator.Point3(0,0,1),-90,new Communicator.Color(0,0,255)));

        this._handles.push(new TranslatePlaneHandle(this,new Communicator.Point3(1,0,0),-180,new Communicator.Color(255,0,0)));
        this._handles.push(new TranslatePlaneHandle(this,new Communicator.Point3(1,0,0),-180,new Communicator.Color(0,200,0),
            new Communicator.Point3(0,1,0),-90));
        this._handles.push(new TranslatePlaneHandle(this,new Communicator.Point3(1,0,0),-90,new Communicator.Color(0,0,255)));

        this._handles.push(new TranslateViewplaneHandle(this,new Communicator.Color(255,255,255)));

        for (let i = 0; i < this._handles.length; i++) {
            await this._handles[i].show();
        }
   
    }   
}
