import * as THREE from 'three';
import { PLYLoader } from 'plyloader';
import { OrbitControls } from 'orbitcontrols';


var urlParams = new URLSearchParams(window.location.search);
var model1url = atob(urlParams.get('model1url'));
var model2url = atob(urlParams.get('model2url'));

model1url = decodeURIComponent(escape(model1url));
model2url = decodeURIComponent(escape(model2url));



const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1.0, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff);

document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.update(); 

var light_color = 0xe0d3d1;

// AMBIENT LIGHT
const ambientLight = new THREE.AmbientLight(light_color);
scene.add(ambientLight);

// RECT LIGHT 1
const rect_width_1 = 400;
const rect_height_1 = 400;
const rect_intensity_1 = 0.5;
const rect_light_1 = new THREE.RectAreaLight(
  light_color,
  rect_intensity_1,
  rect_width_1,
  rect_height_1
);
rect_light_1.position.set(0, 0, 100);
rect_light_1.lookAt(0, 0, 0);
scene.add(rect_light_1);

// RECT LIGHT 2
const rect_width_2 = 400;
const rect_height_2 = 400;
const rect_intensity_2 = 1;
const rect_light_2 = new THREE.RectAreaLight(
  light_color,
  rect_intensity_2,
  rect_width_2,
  rect_height_2
);
rect_light_2.position.set(0, 0, -100);
rect_light_2.lookAt(0, 0, 0);
scene.add(rect_light_2);

// RECT LIGHT 3
const rect_width_3 = 400;
const rect_height_3 = 400;
const rect_intensity_3 = 0.8;
const rect_light_3 = new THREE.RectAreaLight(
  light_color,
  rect_intensity_3,
  rect_width_3,
  rect_height_3
);
rect_light_3.position.set(100, 0, 0);
rect_light_3.lookAt(0, 0, 0);
scene.add(rect_light_3);

// RECT LIGHT 4
const rect_width_4 = 400;
const rect_height_4 = 400;
const rect_intensity_4 = 0.8;
const rect_light_4 = new THREE.RectAreaLight(
  light_color,
  rect_intensity_4,
  rect_width_4,
  rect_height_4
);
rect_light_4.position.set(-100, 0, 0);
rect_light_4.lookAt(0, 0, 0);
scene.add(rect_light_4);

var center = new THREE.Vector3(0, 0, 0);

const loader = new PLYLoader();
loader.load(
  model1url,
  function (geometry) {
    geometry.computeVertexNormals();
    const material = new THREE.MeshStandardMaterial({
      vertexColors: THREE.VertexColors,
      side: THREE.DoubleSide,
    });
    const plyMesh = new THREE.Mesh(geometry, material);

    geometry.computeBoundingBox();
    center = geometry.boundingBox.getCenter(center);
    geometry.boundingBox.getCenter(plyMesh.position).multiplyScalar(-1);

    scene.add(plyMesh);
    camera.position.z = 100;
    controls.update();
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  function (error) {
    console.error("An error happened", error);
  }
);

const loader2 = new PLYLoader();
loader2.load(
  model2url,
  function (geometry) {
    geometry.computeVertexNormals();
    const material = new THREE.MeshStandardMaterial({
      vertexColors: THREE.VertexColors,
      side: THREE.DoubleSide,
    });
    const plyMesh = new THREE.Mesh(geometry, material);

    geometry.computeBoundingBox();
    plyMesh.position.set(-center.x, -center.y, -center.z);

    scene.add(plyMesh);
    camera.position.z = 100;
    controls.update();
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  function (error) {
    console.error("An error happened", error);
  }
);



document.getElementById('downloadModel1').addEventListener('click', function() {
    var link = document.createElement('a');
    link.href = model1url;
    link.download = 'mandible.ply';
    link.click();
});

document.getElementById('downloadModel2').addEventListener('click', function() {
    var link = document.createElement('a');
    link.href = model2url;
    link.download = 'maxilla.ply';
    link.click();

});



function animate() {
    requestAnimationFrame(animate);
    controls.update(); 
    renderer.render(scene, camera);
}

animate();