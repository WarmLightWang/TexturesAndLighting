/*jshint esversion: 6 */

import * as T from "../libs/CS559-THREE/build/three.module.js";
import { GrWorld } from "../libs/CS559-Framework/GrWorld.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import * as InputHelpers from "../libs/CS559-Libs/inputHelpers.js";
import * as Helpers from "../libs/CS559-Libs/helpers.js";

/**
 * This program does using Material Property Maps
 */
const s2 = Math.sqrt(2) / 2;
let check = new T.TextureLoader().load("../images/textures1.jpg");
let checkbw = new T.TextureLoader().load("../images/textures2.jpg");
class MySphere extends GrObject {
    constructor(params) {
        let geom = new T.SphereBufferGeometry(1);
        let matprops = {};

        if (params.color)
            matprops.color = params.color;
        if (params.map)
            matprops.map = check;
        if (params.rough) {
            matprops.roughnessMap = checkbw;
            matprops.roughness = 1;
            matprops.metalness = 0.5;
        }
        if (params.metal) {
            matprops.metalness = 1;
            matprops.metalnessMap = checkbw;
            matprops.roughness = 0.5;
        }

        let mat = new T.MeshStandardMaterial(matprops);
        let mesh = new T.Mesh(geom, mat);
        mesh.translateX(params.x || 0.0);
        mesh.translateY(params.y || 0.8);
        mesh.translateZ(params.z || 0.0);
        super("Sphere", mesh);
    }
}


function test() {

    let parentOfCanvas = document.getElementById("div1");

    let box = InputHelpers.makeBoxDiv({ width: (parentOfCanvas ? 640 : 820) }, parentOfCanvas);
    if (!parentOfCanvas) {
        InputHelpers.makeBreak();   // sticks a break after the box
    }
    InputHelpers.makeHead("Texture Test", box);

    let world = new GrWorld({ width: (parentOfCanvas ? 600 : 800), lightColoring: "white", where: box });

    let objs = [];

    objs.push(new MySphere({ x: 0, y: 2, rough: true, color: "#FF8040" }));
    objs[0].setScale(0.6);
    objs.push(new MySphere({ x: 0, metal: true, color: "#FF8060" }));


    objs.forEach(e => world.add(e));

    let div = InputHelpers.makeBoxDiv({}, box);

    let sl = new InputHelpers.LabelSlider("ry", { min: -2, max: 2, where: div });

    sl.oninput = function (evt) {
        let v = sl.value();
        objs.forEach(element => {
            element.objects[0].rotation.y = v;
        });
    };

    world.ambient.intensity = 0.8;
    world.go();
}
Helpers.onWindowOnload(test);
