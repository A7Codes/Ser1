import * as THREE from "https://unpkg.com/three@0.126.1/build/three.module.js";
import {OrbitControls} from "https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js"
import * as dat from "https://unpkg.com/dat.gui@0.7.7/build/dat.gui.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/GLTFLoader.js";

//Basics
const renderer = new THREE.WebGLRenderer;
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const scene = new THREE.Scene();
const orbit = new OrbitControls(camera, renderer.domElement);
var model = null;
//model
const assetLoader = new GLTFLoader();
const modelUrl = new URL("./torch.gltf", import.meta.url);

//Setup
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("can1").appendChild(renderer.domElement);
camera.position.set(1, 1, 10);
orbit.update();

//make box
const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00});
const box = new THREE.Mesh(boxGeometry, boxMaterial);
box.position.x = 10;
box.position.y = 3;
scene.add(box);


//make plane
const planeGeometry = new THREE.PlaneGeometry(30, 30);
const planeMaterial = new THREE.MeshBasicMaterial({color: 0x4f4f4f, side: THREE.DoubleSide});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);
plane.rotation.x = -0.5 * Math.PI;

//make box
const sphereGeometry = new THREE.SphereGeometry(30, 70, 70);
const sphereMaterial = new THREE.MeshBasicMaterial({color: 0x0000ff, wireframe: true});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);

//Light
const ambientLight = new THREE.AmbientLight(0xff0000);
scene.add(ambientLight);

//GUI
const gui = new dat.GUI();
const options = {
    sphereColor: "#0000ff",
    wireframe: true
};

gui.addColor(options, "sphereColor").onChange(function(e){
    sphere.material.color.set(e);
})

gui.add(options, "wireframe").onChange(function(e){
    sphere.material.wireframe = e;
})

//import model

assetLoader.load(modelUrl.href, function(gltf){
    gltf.scene.scale.set(10,10,10);
    model = gltf.scene;
    scene.add(model);

    model.traverse((o) => {
        if (o.isMesh) o.material = modelMaterial;
      });

}, undefined, function(error){console.log(error)})

const modelMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});

//Generate Stars
function addStars(){
    const starGeometry = new THREE.SphereGeometry(0.25, 24, 24);
    const starMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
    const star = new THREE.Mesh(starGeometry, starMaterial);

    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(500));

    star.position.set(x, y, z);

    scene.add(star);
}

for(let i = 0; i < 1000; i++){
    addStars();
}

//Animate
function animate(time){

    if(model != null){
    model.rotation.y += 0.01;
    }


    //Time in Milliseconds

    if(time <= 5000){
        console.log(time);
        Animation1(time);
    } 

    renderer.render(scene, camera);
}

function Animation1(time){
    const nZ = 10 + (time/100);
    camera.position.set(0, 3, nZ);
}

renderer.setAnimationLoop(animate);