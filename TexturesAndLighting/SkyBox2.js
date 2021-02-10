/*jshint esversion: 6 */

import * as T from "../libs/CS559-THREE/build/three.module.js";
import { GrWorld } from "../libs/CS559-Framework/GrWorld.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import * as InputHelpers from "../libs/CS559-Libs/inputHelpers.js";
import * as Helpers from "../libs/CS559-Libs/helpers.js";
import { GrSphere, GrCube } from "../libs/CS559-Framework/SimpleObjects.js";

/**
 * This program does the reflective object in the scene that shows the skybox
 */

// set a constant to pick which texture to use
// this is the path to the set of 6 images, missing the "_Front.png" part
const envTextureBase = "../images/hdrE4";

/**
 * Read in a set of textures from HDRI Heaven, as converted by 
 * https://www.360toolkit.co/convert-spherical-equirectangular-to-cubemap
 * 
 * this uses a specific naming convention, and seems to (usually) swap bottom and front,
 * so I provide to undo this
 * 
 * @param {string} name 
 * @param {string} [png="png"]
 * @param {boolean} [swapBottomFront=true]
 */
function cubeTextureHelp(name, png = "png", swapBottomFront = true) {
  return new T.CubeTextureLoader().load([
    name + "_Right." + png,
    name + "_Left." + png,
    name + "_Top." + png,
    name + (swapBottomFront ? "_Front." : "_Bottom.") + png,
    name + "_Back." + png,
    name + (swapBottomFront ? "_Bottom." : "_Front.") + png
  ]);
}

function test() {
  let parentOfCanvas = document.getElementById("div1");
  let world = new GrWorld({ where: parentOfCanvas, groundplane: false, lookfrom: new T.Vector3(0, 0, -100), far: 20000 });

  let cubeTexture = cubeTextureHelp(envTextureBase);
  world.scene.background = cubeTexture;

  let mat = new T.MeshBasicMaterial({ envMap: cubeTexture });

  let sphere = new GrSphere({ x: -20, size: 20, material: mat });
  world.add(sphere);

  let cube = new GrCube({ size: 20, x: 20, material: mat });
  world.add(cube);

  world.go();
}
Helpers.onWindowOnload(test);
