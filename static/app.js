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

const ambientLight = new THREE.AmbientLight(0xffffff); 
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(0, 0, 1e8);
scene.add(directionalLight);

var center = new THREE.Vector3(0, 0, 0);

const loader = new PLYLoader();
loader.load(
    model1url,
    function (geometry) {
        geometry.computeVertexNormals();
        const material = new THREE.MeshStandardMaterial({ vertexColors: THREE.VertexColors , side: THREE.DoubleSide});
        const plyMesh = new THREE.Mesh(geometry, material);

        geometry.computeBoundingBox();
        center = geometry.boundingBox.getCenter(center);
        geometry.boundingBox.getCenter(plyMesh.position).multiplyScalar(-1);
        
        scene.add(plyMesh);
        camera.position.z = 100;
        controls.update(); 
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
        console.error('An error happened', error);
    }
);

const loader2 = new PLYLoader();
loader2.load(
    model2url,
    function (geometry) {
        geometry.computeVertexNormals();
        const material = new THREE.MeshStandardMaterial({ vertexColors: THREE.VertexColors, side: THREE.DoubleSide });
        const plyMesh = new THREE.Mesh(geometry, material);

        geometry.computeBoundingBox();
        plyMesh.position.set(-center.x, -center.y, -center.z);


        
        scene.add(plyMesh);
        camera.position.z = 100;
        controls.update(); 
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
        console.error('An error happened', error);
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