var myStandardHandleManager = null;
var relative = true;
var useSelectionPosition = false;

async function msready() {
    myStandardHandleManager = new shandle.StandardHandleManager(hwv);
    let myStandardHandleOperator = new shandle.StandardHandleOperator(hwv, myStandardHandleManager);
    let StandardHandleOperatorHandle = hwv.operatorManager.registerCustomOperator(myStandardHandleOperator);
    hwv.operatorManager.push(StandardHandleOperatorHandle);

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
    let handleGroup = new shandle.AxisHandleGroup(hwv, myStandardHandleManager);
    addHandles(handleGroup);
}


async function showTranslateHandlesFromSelection() {
    let handleGroup = new shandle.TranslateHandleGroup(hwv, myStandardHandleManager);
    addHandles(handleGroup);
}

async function showScaleHandlesFromSelection() {
    let handleGroup = new shandle.ScaleHandleGroup(hwv, myStandardHandleManager);
    addHandles(handleGroup);
}

async function addHandles(handleGroup) {
    await myStandardHandleManager.remove();
    handleGroup.setRelative(relative);
    if (useSelectionPosition) {
        let sel = hwv.selectionManager.getFirst();
        let result = await myStandardHandleManager.positionFromSelection(sel);
        if (result) {
            myStandardHandleManager.add(handleGroup, gatherSelection(), result.position, result.rotation);
        }
        else {
            myStandardHandleManager.add(handleGroup, gatherSelection());
        }
    }
    else {
        myStandardHandleManager.add(handleGroup, gatherSelection());
    }

}

async function toggleRelative() {

    relative = document.getElementById('relativecheck').checked;
    await myStandardHandleManager.setRelative(relative);
}

function refreshHandles() {
    myStandardHandleManager.refreshAll();
}


function toggleUseSelectionPosition() {
    useSelectionPosition = document.getElementById('useselectionpositioncheck').checked;

}

function undo() {
    myStandardHandleManager.undo();
}


function redo() {
    myStandardHandleManager.redo();
}
function toggleEnableTranslateSnapping() {
    $("#translateSnappingEdit").val();
    if (document.getElementById('translatesnapcheck').checked) {
        myStandardHandleManager.setTranslateSnapping(parseInt($("#translateSnappingEdit").val()));
    }
    else {
        myStandardHandleManager.setTranslateSnapping(0);
    }
}