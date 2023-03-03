var mySHandleManager = null;
var relative = true;
var useSelectionPosition = false;

async function msready() {
    mySHandleManager = new shandles.SHandleManager(hwv);
    let mySHandleOperator = new shandles.SHandleOperator(hwv, mySHandleManager);
    let SHandleOperatorHandle = hwv.operatorManager.registerCustomOperator(mySHandleOperator);
    hwv.operatorManager.push(SHandleOperatorHandle);

    hwv.selectionManager.setSelectionFilter(function (nodeid) {
        return nodeid;
    });

}

function startup() {
    createUILayout();
}

function createUILayout() {

    let config = {
        settings: {
            showPopoutIcon: false,
            showMaximiseIcon: true,
            showCloseIcon: false
        },
        content: [
            {
                type: 'row',
                content: [
                    {
                        type: 'column',
                        content: [{
                            type: 'component',
                            componentName: 'Viewer',
                            isClosable: false,
                            width: 83,
                            componentState: { label: 'A' }
                        }],
                    },
                    {
                        type: 'column',
                        width: 17,
                        height: 35,
                        content: [
                            {
                                type: 'component',
                                componentName: 'Settings',
                                isClosable: true,
                                height: 15,
                                componentState: { label: 'C' }
                            }
                        ]
                    },
                ],
            }]
    };

    let myLayout = new GoldenLayout(config);
    myLayout.registerComponent('Viewer', function (container, componentState) {
        $(container.getElement()).append($("#content"));
    });

    myLayout.registerComponent('Settings', function (container, componentState) {
        $(container.getElement()).append($("#settingsdiv"));
    });



    myLayout.on('stateChanged', function () {
        if (hwv != null) {
            hwv.resizeCanvas();

        }
    });
    myLayout.init();

}

function gatherSelection() {
    let nodeids = [];
    let sels = hwv.selectionManager.getResults();

    for (let i = 0; i < sels.length; i++) {
        nodeids.push(sels[i].getNodeId());
    }
    return nodeids;
}


async function showAxisHandlesFromSelection() {
    let offaxismatrix = new Communicator.Matrix();
    Communicator.Util.computeOffaxisRotation(new Communicator.Point3(0, 0, 1), 45, offaxismatrix);
    let handleGroup = new shandles.AxisHandleGroup(hwv, mySHandleManager);
    addHandles(handleGroup);
}


async function showTranslateHandlesFromSelection() {
    let handleGroup = new shandles.TranslateHandleGroup(hwv, mySHandleManager);
    addHandles(handleGroup);
}

async function showScaleHandlesFromSelection() {
    let handleGroup = new shandles.ScaleHandleGroup(hwv, mySHandleManager);
    addHandles(handleGroup);
}

async function addHandles(handleGroup) {
    await mySHandleManager.remove();
    handleGroup.setRelative(relative);
    if (useSelectionPosition) {
        let sel = hwv.selectionManager.getFirst();
        let result = await mySHandleManager.positionFromSelection(sel);
        if (result) {
            mySHandleManager.add(handleGroup, gatherSelection(), result.position, result.rotation);
        }
        else {
            mySHandleManager.add(handleGroup, gatherSelection());
        }
    }
    else {
        mySHandleManager.add(handleGroup, gatherSelection());
    }

}

async function toggleRelative() {

    relative = document.getElementById('relativecheck').checked;
    await mySHandleManager.setRelative(relative);
}

function refreshHandles() {
    mySHandleManager.refreshAll();
}


function toggleUseSelectionPosition() {
    useSelectionPosition = document.getElementById('useselectionpositioncheck').checked;

}

function undo() {
    mySHandleManager.undo();
}


function redo() {
    mySHandleManager.redo();
}
function toggleEnableTranslateSnapping() {
    if (document.getElementById('translatesnapcheck').checked) {
        mySHandleManager.setTranslateSnapping(parseInt($("#translateSnappingEdit").val()));
    }
    else {
        mySHandleManager.setTranslateSnapping(0);
    }
}


function toggleEnableRotateSnapping() {
    if (document.getElementById('rotatesnapcheck').checked) {
        mySHandleManager.setRotateSnapping(parseInt($("#rotateSnappingEdit").val()));
    }
    else {
        mySHandleManager.setRotateSnapping(0);
    }
}