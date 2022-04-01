import * as THREE from 'three'

import firstPersonControls from './firstPersonControls'


const loader = new THREE.TextureLoader()

let camera: THREE.PerspectiveCamera,
world: THREE.Group, scene: THREE.Scene,
renderer: THREE.WebGLRenderer,
controls: typeof firstPersonControls


function init() {
    camera = new THREE.PerspectiveCamera(75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    )

    world = new THREE.Group()

    scene = new THREE.Scene()
    scene.background = new THREE.Color(0xffffff)
    scene.fog = new THREE.Fog(0xffffff, 0, 2000)

    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    document.body.appendChild(renderer.domElement)
    renderer.outputEncoding = THREE.sRGBEncoding

    window.addEventListener('resize', onWindowResize, false)
    
    // @ts-ignore
    controls = new firstPersonControls(camera)
    // @ts-ignore
    scene.add(controls.getObject())


    const floorGeometry = new THREE.PlaneBufferGeometry(2000, 2000, 100, 100);

    const texture = loader.load(require(`./assets/blocks/grass.jpg`).default)
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.LinearMipMapLinearFilter
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(100, 100)
    const floorMaterial = new THREE.MeshBasicMaterial({
        map: texture,
    })

    var floor = new THREE.Mesh(floorGeometry, floorMaterial)
    floor.rotation.x = - Math.PI / 2
    floor.receiveShadow = true
    world.add(floor)

    scene.add(world)

    // https://github.com/mrdoob/three.js/blob/master/examples/misc_controls_pointerlock.html
    // https://threejs.org/examples/#misc_controls_pointerlock
}

function animate() {

    requestAnimationFrame(animate);

    // @ts-ignore
    if (controls.enabled === true) {
        // @ts-ignore
        controls.update();
    }

    renderer.render(scene, camera);

}


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)
}


init()
// @ts-ignore
controls.enabled = true
animate()