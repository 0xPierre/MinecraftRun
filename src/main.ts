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
    // scene.fog = new THREE.Fog(0xffffff, 0, 2000)

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


    const floorGeometry = new THREE.PlaneBufferGeometry(4, 4, 4, 4)

    const texture = loader.load(require(`./assets/blocks/grass.jpg`).default)
    texture.magFilter = THREE.NearestFilter
    texture.minFilter = THREE.LinearMipMapLinearFilter
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(4, 4)
    const floorMaterial = new THREE.MeshBasicMaterial({
        map: texture,
    })

    var floor = new THREE.Mesh(floorGeometry, floorMaterial)
    floor.rotation.x = - Math.PI / 2
    floor.receiveShadow = true
    world.add(floor)



    const dirt = loader.load(require('./assets/blocks/dirt.jpg').default)

    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshBasicMaterial({
        map: dirt,
    })
    const cube = new THREE.Mesh(geometry, material)
    cube.position.z = -1
    cube.position.y = 1
    scene.add(cube)


    scene.add(world)

}

function animate() {

    requestAnimationFrame(animate)

    // @ts-ignore
    if (controls.enabled === true) {
        // @ts-ignore
        controls.update()
    }

    renderer.render(scene, camera)

}


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)
}


init()
// @ts-ignore
// controls.enabled = true
animate()


const instructions = document.querySelector('#instructions')
const havePointerLock = 'pointerLockElement' in document

if (instructions && havePointerLock) {
    const element = document.body

    const onPointerLockChange = (event: Event) => {
        if (document.pointerLockElement === element) {
            // @ts-ignore
            controls.enabled = true
            // @ts-ignore
            instructions.style.display = 'none'
        } else {
            // @ts-ignore
            controls.enabled = false
            // @ts-ignore
            instructions.style.display = ''
        }
    }

    document.addEventListener('pointerlockchange', onPointerLockChange, false)

    instructions.addEventListener('click', (event: Event) => {
        // @ts-ignore
        element.requestPointerLock()
    })
}
