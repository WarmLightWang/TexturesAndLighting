/*jshint esversion: 6 */

import * as T from "../libs/CS559-THREE/build/three.module.js";
import { GrWorld } from "../libs/CS559-Framework/GrWorld.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import * as InputHelpers from "../libs/CS559-Libs/inputHelpers.js";
import * as Helpers from "../libs/CS559-Libs/helpers.js";
import * as AutoUI  from "../libs/CS559-Framework/AutoUI.js";

/**
 * Thsi progra does a SkyBox - put some objects onto the ground plane and a sphere around the world .
 */

class Skybox extends GrObject {
  constructor(params = {}) {
      let geometry = new T.SphereBufferGeometry(10000, 100, 100);
      let loader  = new T.TextureLoader();
      let texture = loader.load("../images/E3.jpg");
      let material = new T.MeshPhongMaterial({map: texture, side:T.BackSide, flatShading:true});
      let mesh = new T.Mesh(geometry, material);
      super("Skybox", mesh);
  }
}

class Rock extends GrObject {
  constructor(params = {}) {
      let geometry = new T.SphereBufferGeometry(1, 100, 100);
      let loader  = new T.TextureLoader();
      let texture = loader.load("../images/E3-04.png");
      let normal = loader.load("../images/E3-06.jpg");
      let height = loader.load("../images/E3-05.jpg");
      let ambient = loader.load("../images/E3-07.jpg");
      let rough = loader.load("../images/E3-08.jpg");
      let material = new T.MeshStandardMaterial({map: texture, side:T.DoubleSide, normalMap: normal, displacementMap: height, aoMap: ambient, roughnessMap: rough});
      let mesh = new T.Mesh(geometry, material);
      let size = params.size || 1;
      mesh.scale.set(size, size, size);
      super("Rock", mesh);
  }
}

function test() {
  let parentOfCanvas = document.getElementById("div1");
  let world = new GrWorld({ where: parentOfCanvas, groundplane:false, lookfrom:new T.Vector3(0, 0, -100),  far:20000 });
  
  world.orbit_controls.maxDistance = 50;

    let box1 = new Skybox();
    world.add(box1);

    let rock1 = new Rock({size:5});
    world.add(rock1);

  world.go();
}
Helpers.onWindowOnload(test);
