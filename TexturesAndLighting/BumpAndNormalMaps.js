/*jshint esversion: 6 */

import * as T from "../libs/CS559-THREE/build/three.module.js";
import { GrWorld } from "../libs/CS559-Framework/GrWorld.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import * as InputHelpers from "../libs/CS559-Libs/inputHelpers.js";
import * as Helpers from "../libs/CS559-Libs/helpers.js";
import * as SimpleObjects from "../libs/CS559-Framework/SimpleObjects.js";

/**
 * This program does using Bump and Normal Maps
 */

let check = new T.TextureLoader().load("../images/textures5.jpg");
let bumps = new T.TextureLoader().load("../images/textures8.jpg");
let normalMap = new T.TextureLoader().load("../images/painting.png");
bumps.wrapS = T.MirroredRepeatWrapping;
bumps.wrapT = T.MirroredRepeatWrapping;
let spinYspeed = 0.3;

/**
 * speed is a global variable...
 * 
 * @param {GrObject} obj 
 */
function spinY(obj) {
    obj.tick = function (delta, timeOfDay) {
        obj.objects.forEach(obj => obj.rotateY(spinYspeed * delta / 1000 * Math.PI));
    };
    return obj;
}

function setYrot(obj, theta) {
    obj.objects.forEach(obj => obj.rotation.y = (theta * Math.PI / 180));
}

function test() {

    let parentOfCanvas = document.getElementById("div1");
    let box = InputHelpers.makeBoxDiv({ width: (parentOfCanvas ? 640 : 820) }, parentOfCanvas);

    if (!parentOfCanvas) {
        InputHelpers.makeBreak();   // sticks a break after the box
    }
    InputHelpers.makeHead("Normal Map & Bump Map Test", box);

    let world = new GrWorld({
        width: (parentOfCanvas ? 600 : 800), where: box,
        lightColoring: "xtreme"
    });

    // normal map
    let normalMat = new T.MeshStandardMaterial({ color: "white", normalMap: normalMap, side: T.DoubleSide });
    let nor = spinY(new SimpleObjects.GrSphere({ x: -2, y: 1, material: normalMat }));
    world.add(nor);

    // bump map
    let bumpMat = new T.MeshStandardMaterial({ color: "white", bumpMap: check, side: T.DoubleSide });
    let sqh = spinY(new SimpleObjects.GrSquareSign({ x: 2, y: 1, size: 1, material: bumpMat }));
    world.add(sqh);

    function camButton(obj) {
        InputHelpers.makeButton(obj.name).onclick = function () {
            let x = obj.objects[0].position.x;
            let y = obj.objects[0].position.y;

            world.active_camera.position.x = x;
            world.active_camera.position.y = y;
            world.active_camera.position.z = 4.5;
            world.orbit_controls.target = new T.Vector3(x, y, 0);
        };
    }
    camButton(nor);// button for normal map
    camButton(sqh);

    InputHelpers.makeButton("World Camera").onclick = function () {
        world.active_camera.position.set(2.5, 5, 10);
        world.orbit_controls.target = new T.Vector3(0, 0, 0);
    };

    let cb = InputHelpers.makeCheckbox("Spin");
    cb.checked = true;
    cb.onchange = function () {
        spinYspeed = cb.checked ? 0.3 : 0;
    };

    let cb2 = InputHelpers.makeCheckbox("Bumps");
    cb2.onchange = function () {
        bumpMat.bumpMap = cb2.checked ? bumps : check;
        bumpMat.needsUpdate = true;
    };

    let sl = new InputHelpers.LabelSlider("rotateY", { min: 0, max: 180, step: 5, where: undefined });
    sl.oninput = function () {
        setYrot(nor, sl.value());
        setYrot(sqh, sl.value());
    };

    let s2 = new InputHelpers.LabelSlider("bumprepeat", { min: 1, max: 5, step: 0.1, where: undefined });
    s2.oninput = function () {
        bumps.repeat.set(s2.value(), s2.value());
    };

    world.go();
}
Helpers.onWindowOnload(test);
