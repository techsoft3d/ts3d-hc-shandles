var myLayout;

var myPartialExplode;
var mySpriteManager;
var myHeatMap;
var myClippingBox;
var myScaleHandles;
var myDrawingManipulator;
var myMoveOnFloorOperator;
var myFloorGrid;
var mySelectionBasket;
var myMaterialTool;
var myPartArranger;
var handlePlacementOperator;
var navcube;

var myCurveSequence;

var contextMenu;
var myStandardHandleManager = null;

async function msready() {
    myStandardHandleManager = new shandle.StandardHandleManager(hwv);
    let myStandardHandleOperator = new shandle.StandardHandleOperator(hwv,myStandardHandleManager);
    let  StandardHandleOperatorHandle = hwv.operatorManager.registerCustomOperator(myStandardHandleOperator);
     hwv.operatorManager.push(StandardHandleOperatorHandle);

}

function continousCheck() {
    hcCurveToolkit.CurveManager.continousControlPoints =  document.getElementById('continuouscheck').checked;
}

function startup()
{
    createUILayout();
} 

function createUILayout() {

    var config = {
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



    myLayout = new GoldenLayout(config);
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

function showHandlesFromSelection() {
    let nodeids = [];
    let sels = hwv.selectionManager.getResults();
                
    for (let i = 0; i < sels.length; i++) {
        nodeids.push(sels[i].getNodeId());                            
    }
    let offaxismatrix = new Communicator.Matrix();
    Communicator.Util.computeOffaxisRotation(new Communicator.Point3(0, 0, 1), 45, offaxismatrix);
    myStandardHandleManager.create(nodeids);
}


