/*jshint esversion: 6 */
// @ts-check

import * as T from "../libs/CS559-THREE/build/three.module.js";
import { GrWorld } from "../libs/CS559-Framework/GrWorld.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import * as InputHelpers from "../libs/CS559-Libs/inputHelpers.js";
import * as Helpers from "../libs/CS559-Libs/helpers.js";
import * as Simple from "../libs/CS559-Framework/SimpleObjects.js";

/**
 * This project does using Shadow Maps with objects and light
 */

/**
 *
 * @param {GrObject} obj
 * @param {number} [speed=1] - rotations per second
 */
function spinY(obj, speed = 1) {
  obj.tick = function (delta, timeOfDay) {
    obj.objects.forEach(obj => obj.rotateY(((speed * delta) / 1000) * Math.PI));
  };
  return obj;
}

function test() {

  let renderer = new T.WebGLRenderer();
  renderer.shadowMap.enabled = true;
  renderer.setSize(600, 400);
  renderer.shadowMap.type = T.PCFSoftShadowMap; // default THREE.PCFShadowMap

  let parentOfCanvas = document.getElementById("div1");
  let world = new GrWorld({ where: parentOfCanvas, renderer: renderer });

  /**
   * Some Stuff in the world to cast and receive shadows
   */
  // a high object to cast shadows on lower objects
  let gr = new T.Group();
  let mat = new T.MeshStandardMaterial({ color: "blue" });
  let geom = new T.TorusBufferGeometry();
  let tmesh = new T.Mesh(geom, mat);
  tmesh.rotateX(Math.PI / 2);
  tmesh.scale.set(0.5, 0.5, 0.25);
  tmesh.translateX(-2);
  gr.add(tmesh);
  gr.translateY(3);
  let highobj = new GrObject("high obj", gr);
  spinY(highobj);
  world.add(highobj);

  // some low objects to be shadowed - although these
  // should cast shadows on the ground plane
  let cube = new Simple.GrCube({ x: -3, y: 1 });
  world.add(spinY(cube));

  let torus = new Simple.GrTorusKnot({ x: 3, y: 1, size: 0.5 });
  world.add(spinY(torus));

  /**
   * Turn on Shadows
   * Remember to:
   * - make a spotlight and turn on its shadows
   * - have objects (including the ground plane) cast / receive shadows
   * - turn on shadows in the renderer
   *
   * it's about 15 lines (with a recursive "loop" to enable shadows for all objects)
   */

  //Create a SpotLight and turn on shadows for the light
  let light = new T.SpotLight("white");
  light.position.set(0, 10, 0);
  light.castShadow = true;            // default false
  let aa = new GrObject("light", light);
  world.add(aa);


  //objects that cast shadows 
  tmesh.castShadow = true; //default is false
  tmesh.receiveShadow = true; //default
  gr.add(tmesh);

  cube.objects[0].castShadow = true;
  cube.objects[0].receiveShadow = true;

  torus.objects[0].castShadow = true;
  torus.objects[0].receiveShadow = true;


  // receive shadow
  world.groundplane.objects[0].receiveShadow = true;

  world.go();
}
Helpers.onWindowOnload(test);
