import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'
import { PickHelper } from './objects/PickHelper'

const origin = new THREE.Vector3(0, 0, 0)

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.x = 10
camera.position.y = 8
camera.position.z = 8
camera.lookAt(origin)

const renderer = new THREE.WebGLRenderer()
const canvas = renderer.domElement
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.maxPolarAngle = Math.PI *.49

const loader_texture = new THREE.TextureLoader()
const material_wood =  new THREE.MeshStandardMaterial({
    map:loader_texture.load('https://threejsfundamentals.org/threejs/lessons/resources/images/compressed-but-large-wood-texture.jpg')
 });
 material_wood.color.convertSRGBToLinear();

const material_wood_color = new THREE.MeshPhongMaterial({
    color: 0xD77e42,
})


var temple_mesh;
const loader_stl = new STLLoader()
loader_stl.load(
    './src/three/stl_models/GaiasSongTempleFinal.stl',
    function (geometry) {
        temple_mesh = new THREE.Mesh(geometry, material_wood_color)
        temple_mesh.rotation.x = -Math.PI/2
        scene.add(temple_mesh)
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log(error)
    }
)

{
    const light = new THREE.DirectionalLight(0xfff9e8, 0.75);
    light.position.set(-2, 3, 5);
    light.lookAt(origin)
    scene.add(light);
    // camera.add(light)
}

const skyColor = 0xFFFFFF//0xB1E1FF;  // light blue
const groundColor = 0xEDC9AF//0xB97A20;  // brownish orange
const light = new THREE.AmbientLight(skyColor, 0.5);
// const light = new THREE.HemisphereLight(skyColor, groundColor, 0.3);
scene.add(light);

{
    const planeSize = 80
    // const loader = new THREE.TextureLoader();
    // const texture = loader.load('resources/images/checker.png');
    // texture.wrapS = THREE.RepeatWrapping;
    // texture.wrapT = THREE.RepeatWrapping;
    // texture.magFilter = THREE.NearestFilter;
    // const repeats = planeSize / 2;
    // texture.repeat.set(repeats, repeats);

    const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
    const planeMat = new THREE.MeshPhongMaterial({
        color: 0x983836A /*0xEDC9AF*/,
        // map: texture,
        // side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.rotation.x = Math.PI * -.5;
    scene.add(mesh);
}

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

const pickPosition = new THREE.Vector2(-1000000, -1000000);
 
function getCanvasRelativePosition(event:MouseEvent) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left) * canvas.width  / rect.width,
    y: (event.clientY - rect.top ) * canvas.height / rect.height,
  };
}
 
function setPickPosition(event:MouseEvent) {
    const pos = getCanvasRelativePosition(event);
    pickPosition.x = (pos.x / canvas.width ) *  2 - 1;
    pickPosition.y = (pos.y / canvas.height) * -2 + 1;  // note we flip Y
}

function clearPickPosition() {
    // unlike the mouse which always has a position
    // if the user stops touching the screen we want
    // to stop picking. For now we just pick a value
    // unlikely to pick something
    pickPosition.x = -100000;
    pickPosition.y = -100000;
  }
 
// window.addEventListener('pointermove', setPickPosition);
window.addEventListener('mousedown', setPickPosition);
const pickHelper = new PickHelper();

function addLED(position: THREE.Vector3) {
    const geometry = new THREE.CylinderGeometry( 0.005, 0.005, 0.005, 32 );
    const material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
    const cylinder = new THREE.Mesh( geometry, material );
    cylinder.position.set(position.x, position.y, position.z);
    cylinder.lookAt(origin);
    scene.add( cylinder );
    let light = new THREE.SpotLight(0x00f0ff, 0.5, 2.5, Math.PI/2.2, 0.1);
    light.position.set(position.x, position.y, position.z);
    light.lookAt(origin)
    scene.add(light);
}

function animate() {
    requestAnimationFrame(animate)

    controls.update()

    render()
}

function render() {
    renderer.render(scene, camera)
    if(pickPosition.x != pickPosition.y && pickPosition.y != -100000){
        let position = pickHelper.pick(pickPosition, [temple_mesh], camera)
        if (position) {
            console.log(position)
            addLED(position);

        }
        clearPickPosition()
    }
}
animate()