# SHandles - Alternative Geometry Handles for HOOPS Communicator (BETA)


## Overview

 SHandles is a set of classes that provides alternative handles for HOOPS Communicator based applications that work similar to handles found in Blender/Unity/etc. In addition the library provides a few other features not found in the standard HOOPS Communicator handles. See the list below for more details. 

* Functionality similar to handles found in Blender/Unity/etc.
* Trackball Rotate and Scale handles
* Rotate around view axis
* Out-of-the-box support for relative transformations
* Support for attaching handles to a face/edge
* Support for Snapping
* Support for Undo/Redo

The project is work-in-progress so expect more features to be added in the future.

For questions/feedback please post in our [forum](https://forum.techsoft3d.com/) or send an email to guido@techsoft3d.com. To learn more about the HOOPS Web Platform and for a 60 day trial go to https://www.techsoft3d.com/products/hoops/web-platform.


## Limitations and Future Work

* Snapping is currently not supported for trackball rotate and scale handles. This should be adressed in a future update
* Right now the handle functionality is not easily extendable (e.g. to change look & feel, add new handle types or handle groups, etc.). More extensive support for customization will be added in a future update.
* Touch support will be added in a future update.
* Improved Documentation

## GitHub Project

The public github project can be found here:  
https://github.com/techsoft3d/ts3d-hc-shandles

If you are planning to fork the project and make changes make sure to run `npm install` in the root folder to install required dependencies.

## Demo

For an online demo leveraging the HOOPS Communicator 3D Sandbox please see [here](https://3dsandbox.techsoft3d.com/?snippet=2KahUOzbZNj1RAcXB3MXHF). There is also a local demo available as part of this project you can run directly from the `dev/public` folder (e.g via Live Server): http://127.0.0.1:5500/dev/public/viewer.html?scs=models/microengine.scs. 


## Install & Initialization

* Clone above GitHub project (libraries can be found in the ./dist folder)
* Add library to your application with a script tag or use module version
```
<script src="./js/hcSHandles.min.js"></script>
```

Create a new SHandleManager Object **after** the modelStructureReady event has fired:
```
var mySHandleManager = new shandles.SHandleManager(hwv);
```

## Usage
### Adding Handles
To add handles to a model, simply create one of the three handle groups (translate, rotate, scale) and add them to the SHandleManager with a list of nodeids the handles should be attached to:
```
await mySHandleManager.remove();  //remove existing handles
let handleGroup = new shandles.RotateHandleGroup(mySHandleManager);
//let handleGroup = new shandles.ScaleHandleGroup(mySHandleManager);
//let handleGroup = new shandles.TranslateHandleGroup(mySHandleManager);
mySHandleManager.add(handleGroup, [nodeid1,nodeid2,...]);
```

For advanced usage please refer to the demo code, in particular the code found in `dev/public/js/app/startup.js` which demonstrates how to activate the various handle options, how to attach handles to a face/edge and how to use the undo/redo functionality.

## Acknowledgments
### Library:
* [quaternion.js](https://www.npmjs.com/package/quaternion)


### Demo:
* [GoldenLayout](https://golden-layout.com/)

## Disclaimer
**This library is not an officially supported part of HOOPS Communicator and provided as-is.**


