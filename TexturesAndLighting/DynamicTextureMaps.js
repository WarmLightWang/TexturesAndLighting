/*jshint esversion: 6 */

import * as T from "../libs/CS559-THREE/build/three.module.js";
import { GrWorld } from "../libs/CS559-Framework/GrWorld.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import * as InputHelpers from "../libs/CS559-Libs/inputHelpers.js";
import * as Helpers from "../libs/CS559-Libs/helpers.js";
import { GrSphere, GrCube, GrCylinder } from "../libs/CS559-Framework/SimpleObjects.js";
import { Texture, Mesh } from "../libs/CS559-THREE/build/three.module.js";

/**
 * This program does using Dynamic Texture Maps 
 * The objects reflecting the environment show the scene, and can see the moving objects in the reflection
 */


// set a constant to pick which texture to use
// this is the path to the set of 6 images, missing the "_Front.png" part
const envTextureBase = "../images/hdrE7";

/**
 * Read in a set of textures from HDRI Heaven, as converted by 
 * https://www.360toolkit.co/convert-spherical-equirectangular-to-cubemap
 * 
 * this uses a specific naming convention, and seems to (usually) swap bottom and front,
 * so I provide to undo this
 * 
 * @param {string} name 
 * @param {string} [ext="png"]
 * @param {boolean} [swapBottomFront=true]
 */
function cubeTextureHelp(name, ext = "png", swapBottomFront = true) {
    return new T.CubeTextureLoader().load([
        name + "_Right." + ext,
        name + "_Left." + ext,
        name + "_Top." + ext,
        name + (swapBottomFront ? "_Front." : "_Bottom.") + ext,
        name + "_Back." + ext,
        name + (swapBottomFront ? "_Bottom." : "_Front.") + ext
    ]);
}

export class ShinySculpture extends GrObject {
    /**
     * 
     * @param {GrWorld} world 
     */
    constructor(world, radius = 1.5) {
        let group = new T.Group();
        super("ShinySculpture", group);

        this.world = world;
        // note that we set the near distance of the camera just a little bit outside
        // of the sphere as a way to avoid feedback
        this.cubecam = new T.CubeCamera(radius * 0.1, 1000, 128);
        this.sculptureGeom = new T.SphereBufferGeometry(radius, 20, 10);
        this.sculptureMaterial = new T.MeshStandardMaterial(
            {
                color: "white",
                roughness: 0.2,
                metalness: 0.8,
                // @ts-ignore   // envMap has the wrong type
                envMap: this.cubecam.renderTarget.texture
            });
        this.sculpture = new T.Mesh(this.sculptureGeom, this.sculptureMaterial);
        group.add(this.cubecam);
        group.add(this.sculpture);
        group.translateY(1.5);

        this.oldTick = undefined;
    }

    tick(delta, timeOfDay) {
        this.cubecam.update(this.world.renderer, this.world.scene);
    }
}

function test() {
    let parentOfCanvas = document.getElementById("div1");
    let world = new GrWorld({ where: parentOfCanvas });

    let cubeTexture = cubeTextureHelp(envTextureBase);
    world.scene.background = cubeTexture;

    let mat = new T.MeshStandardMaterial({ envMap: cubeTexture, metalness: 0.8, roughness: 0.1 });

    let s1 = new ShinySculpture(world);
    world.add(s1);

    let s2 = new ShinySculpture(world, 0.5);
    world.add(s2);
    s2.setPos(2, 0.5, 0);
    let s2t = 0;

    // when we over-write tick to make this object move, make sure we still call the old
    // tick function that updates the map
    s2.oldTick = s2.tick;
    s2.tick = function (delta) {
        s2t += delta;
        s2.setPos(3 * Math.cos(s2t / 1000), 2.5, 3 * Math.sin(s2t / 1000));
        s2.oldTick(delta);
    };

    // a moving thing
    let image = new T.TextureLoader().load("../images/cat.jpg");
    let matB = new T.MeshStandardMaterial({ map: image });
    let cube2 = new GrCube({ x: 0, y: 0.5, z: 3, size: 1, material: matB });
    world.add(cube2);

    //load a texture, set wrap mode to repeat
    let texture = new T.TextureLoader().load("../images/cat.jpg");
    texture.wrapS = T.RepeatWrapping;
    texture.wrapT = T.RepeatWrapping;
    texture.repeat.set(3, 3);

    let images = [
        new T.MeshStandardMaterial({ map: texture }),
        new T.MeshBasicMaterial({ map: texture }),
        new T.MeshBasicMaterial({ map: texture }),
    ];


    let cube3 = new GrCube({ x: 2, y: 2, z: -4, material: images[0] });
    world.add(cube3);
    let cube4 = new GrCube({ x: -4, y: 2, z: 0, material: images[1] });
    world.add(cube4);
    let cube5 = new GrCube({ x: 4, y: 2, z: 2, material: images[2] });
    world.add(cube5);

    // set the movement
    let cb2t = 0;
    cube2.tick = function (delta) { cb2t += delta; cube2.objects[0].position.x = 3 * Math.sin(cb2t / 1000); };

    cube3.tick = function (delta) {
        cb2t += delta; cube3.objects[0].rotation.x = 2 * Math.sin(cb2t / 5000);
        cube3.objects[0].rotation.y = 2 * Math.cos(cb2t / 5000);
    };

    cube4.tick = function (delta) {
        cb2t += delta; cube4.objects[0].rotation.x = 2 * Math.sin(cb2t / 5000);
        cube4.objects[0].rotation.y = 2 * Math.cos(cb2t / 5000);
    };

    cube5.tick = function (delta) {
        cb2t += delta; cube5.objects[0].rotation.x = 2 * Math.sin(cb2t / 5000);
        cube5.objects[0].rotation.y = 2 * Math.cos(cb2t / 5000);
    };

    world.go();
}
Helpers.onWindowOnload(test);
