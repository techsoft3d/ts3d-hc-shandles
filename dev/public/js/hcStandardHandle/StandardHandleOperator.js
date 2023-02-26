import Quaternion from './quaternion.min.js';
import * as utility from './utility.js';
import { handleType } from './Handles/StandardHandle.js';

export class StandardHandleOperator {
    constructor(viewer, manager) {
        this._viewer = viewer;
        this._manager = manager;
        this._startmatrix = null;
        this._selectedHandleGroup = null;
        this._isClick = false;

    }

    async onMouseDown(event) {
        this._selectedHandleGroup = null;
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

            let handleGroup = this._manager.getHandleGroup(topnode);

            if (handleGroup) {

                this._selectedHandleGroup = handleGroup;
                this._selectedHandle = handleGroup.getHandle(nodeid);

                this._selectedHandle.handeMouseDown(event, selection);
                this.oldColor = await this._viewer.model.getNodesFaceColor([nodeid]);
                this._viewer.model.setNodesFaceColor([nodeid], new Communicator.Color(255, 255, 0));
                event.setHandled(true);
            }                    
        }
    }
   
    async onMouseMove(event) {
        this._isClick = false;

        if (this._selectedHandleGroup) {

            await this._selectedHandle.handeMouseMove(event);
            this._manager.refreshAll(this._selectedHandleGroup);
            event.setHandled(true);
        }
    }

    async onMouseUp(event) {

        if (this._selectedHandleGroup) {
            this._viewer.model.setNodesFaceColor([this._selectedHandle._nodeid], this.oldColor[0]);
            this._selectedHandleGroup = null;
        }

        if (this._isClick) {
            this._manager.remove();
        }

    }
}
