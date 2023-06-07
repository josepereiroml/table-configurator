import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as lil from 'lil-gui'

/**
 * GUI
 */

const gui = new lil.GUI()
const parameter = {
    color: "brown",
    width: 2.5,
    height: 0.4,
    depth: 2,
    color_legs: "gray",
    legType: "square",
    loadFileTable: function () {
        document.getElementById('tableInput').click();
    },
    loadFileLegs: function () {
        document.getElementById('legsInput').click();

    },
    snapshot: () => {
        console.log("spin")
    },
    newTable: () => {
        console.log("new table")
    },
    saveJSON: () => {
        function saveLikeJSON() {
            var dataJSON = { scene: scene.children }
            var dataJson = JSON.stringify(dataJSON); // // I try  JSON.stringify(scene) but it is wrong solution too
            downloadTextFile(dataJson, "p")

        }

        function downloadTextFile(text, name) {
            const a = document.createElement('a');
            const type = name.split(".").pop();
            a.href = URL.createObjectURL(new Blob([text], { type: `text/${type === "txt" ? "plain" : type}` }));
            a.download = name;
            a.click();
        }
    }

};




/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Object
 */

var grid = new THREE.GridHelper(10, 50);
grid.position.y += 0.2
scene.add(grid);

const geometry = new THREE.BoxGeometry(2.5, 0.4, 2)
const material = new THREE.MeshBasicMaterial({ color: parameter.color })
const mesh = new THREE.Mesh(geometry, material)
mesh.position.y = 1.4



const geometry_leg_1 = new THREE.BoxGeometry(0.4, 1, 0.4)
const material_leg = new THREE.MeshBasicMaterial({ color: parameter.color_legs })
const mesh_leg_1 = new THREE.Mesh(geometry_leg_1, material_leg)
mesh_leg_1.position.set(0.8, 0.7, 0.7)



const mesh_leg_2 = new THREE.Mesh(geometry_leg_1, material_leg)
mesh_leg_2.position.set(0.8, 0.7, -0.7)


const mesh_leg_3 = new THREE.Mesh(geometry_leg_1, material_leg)
mesh_leg_3.position.set(-0.8, 0.7, -0.7)


const mesh_leg_4 = new THREE.Mesh(geometry_leg_1, material_leg)
mesh_leg_4.position.set(-0.8, 0.7, 0.7)


const group = new THREE.Group();
group.add(mesh)
group.add(mesh_leg_1)
group.add(mesh_leg_2)
group.add(mesh_leg_3)
group.add(mesh_leg_4)

scene.add(group)
gui.add(parameter, "width").onFinishChange(function (value) {

    mesh.scale.x = value

});
gui.add(parameter, "height").onFinishChange(function (value) {

    mesh.scale.y = value
});
gui.add(parameter, "depth").onFinishChange(function (value) {
    mesh.scale.z = value
});
gui
    .addColor(parameter, 'color')
    .onChange(() => {
        material.color.set(parameter.color)
    })

gui
    .add(parameter, 'loadFileTable').name('Load table texture file');


gui
    .addColor(parameter, 'color_legs')
    .onChange(() => {
        material_leg.color.set(parameter.color_legs)
    })

gui.add(parameter, 'legType', { square: 'A', round: 'B' });


gui
    .add(parameter, 'loadFileLegs').name('Load legs texture file');



gui.add(parameter, 'snapshot').name('Snapshot')
gui.add(parameter, 'newTable').name('New Table')
gui
    .add(parameter, 'saveJSON').name('Save')
    .onChange(() => {
        function saveLikeJSON() {
            var dataJSON = { scene: scene.children }
            var dataJson = JSON.stringify(dataJSON); // // I try  JSON.stringify(scene) but it is wrong solution too
            downloadTextFile(dataJson, "p")

        }

        function downloadTextFile(text, name) {
            const a = document.createElement('a');
            const type = name.split(".").pop();
            a.href = URL.createObjectURL(new Blob([text], { type: `text/${type === "txt" ? "plain" : type}` }));
            a.download = name;
            a.click();
        }
    })

console.log(document.getElementById('tableInput'))
const loader = new THREE.TextureLoader();
const texture = loader.load()
/**
 * 
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()