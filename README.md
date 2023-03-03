# SHandles - Alternative Handles for HOOPS Communicator (BETA)


## Overview

 SHandles is a set of classes that provides alternative handles for HOOPS Communicator based applications that work similar to handles found in Blender/Unity/etc. In addition the library provides a few other features not found in the standard HOOPS Communicator handles. See the list of features below for more details. 


* Functionality similar to handles found in Blender/Unity/etc.
* Trackball Rotate and Scale handles
* Out-of-the-box support for relative transformations
* Support for attaching handles to a face/edge
* Support for Snapping
* Support for Undo/Redo


For questions/feedback please post in our [forum](https://forum.techsoft3d.com/) or send an email to guido@techsoft3d.com. To learn more about the HOOPS Web Platform and for a 60 day trial go to https://www.techsoft3d.com/products/hoops/web-platform.


## Limitations and Future Work

* Snapping is currently not supported for trackball rotate and scale handles. This should be adressed in a future update
* Right now the handle functionality is not easily extendable (e.g. to change look & feel and add new handle types). More extensive support for customization will be supported in a future update.
* No touch support


## GitHub Project

The public github project can be found here:  
https://github.com/techsoft3d/ts3d-hc-shandles


## Install

* Clone above GitHub project (libraries can be found in the ./dist folder)
* Add library to your application with a script tag or use module version
```
<script src="./js/hcSHandles.min.js"></script>
```
If you are planning to fork the project and make changes to the core library make sure to run `npm install` in the root folder to install required dependencies.



## Demo

For a live 3D Sandbox demo of the this library please see [here](todo). There is also a demo available as part of this project you can run directly from the dev/public folder (http://127.0.0.1:5500/dev/public/viewer.html?scs=models/microengine.scs). 



## Usage
ToDO



## Acknowledgments
### Library:
* [quaternion.js](https://www.npmjs.com/package/quaternion)


### Demo:
* [GoldenLayout](https://golden-layout.com/)




## Disclaimer
**This library is not an officially supported part of HOOPS Communicator and provided as-is.**


