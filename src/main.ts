import * as THREE from 'three'
import * as CANNON from 'cannon-es'
// @ts-ignore
import Stats from 'three/examples/jsm/libs/stats.module'
import firstPersonControls from './firstPersonControls'

import {
    Grass,
    Dirt,
    Stone,
} from './blocks'

const loader = new THREE.TextureLoader()

const dirtTexture = loader.load(require('./assets/blocks/dirt.jpg').default)

let camera: THREE.PerspectiveCamera,
    world: THREE.Group, scene: THREE.Scene,
    renderer: THREE.WebGLRenderer,
    controls: typeof firstPersonControls,
    cannonWorld: CANNON.World,
    groundMesh: THREE.Mesh,
    cubeTest: THREE.Mesh,
    cubeTest2: THREE.Mesh


function constructRows(x: number, z: number, width: number, deep: number) {
    const group = new THREE.Group()

    for (let i = z; i < z + deep; i++) {
        for (let j = x - 1; j < x + width + 1; j++) {
            const g = Grass(j, 0, -i)
            group.add(g)
        }

        // 
        // On gère la droite
        // 
        let XWall = x + width
        let hasFirstOnRight = false
        if (Math.random() > 0.4) {
            hasFirstOnRight = true
            group.add(Stone(XWall, 1, -i))
        } else {
            group.add(Stone(XWall + 1, 1, -i))
            if (Math.random() > 0.8) {
                group.add(Dirt(XWall, 1, -i))
            }
        }

        let hasSecondOnFirstOnRight = false
        if (hasFirstOnRight) {
            if (Math.random() > 0.6) {
                group.add(Stone(XWall, 2, -i))
                hasSecondOnFirstOnRight = true
            } else {
                group.add(Stone(XWall + 1, 2, -i))
            }
        } else {
            group.add(Stone(XWall + 1, 2, -i))
        }

        if (hasSecondOnFirstOnRight) {
            group.add(Grass(XWall + 1, 3, -i))
        } else if (Math.random() > 0.8) {
            group.add(Grass(XWall + 1, 3, -i))
        } else {
            group.add(Grass(XWall + 2, 3, -i))
        }

        // 
        // On gère la gauche
        // 
        XWall = x - 1
        let hasFirstOnLeft = false
        if (Math.random() > 0.4) {
            hasFirstOnLeft = true
            group.add(Stone(XWall, 1, -i))
        } else {
            group.add(Stone(XWall - 1, 1, -i))
            if (Math.random() > 0.8) {
                group.add(Dirt(XWall, 1, -i))
            }
        }

        let hasSecondOnFirstOnLeft = false
        if (hasFirstOnLeft) {
            if (Math.random() > 0.6) {
                group.add(Stone(XWall, 2, -i))
                hasSecondOnFirstOnLeft = true
            } else {
                group.add(Stone(XWall - 1, 2, -i))
            }
        } else {
            group.add(Stone(XWall - 1, 2, -i))
        }

        if (hasSecondOnFirstOnLeft) {
            group.add(Grass(XWall - 1, 3, -i))
        } else if (Math.random() > 0.8) {
            group.add(Grass(XWall - 1, 3, -i))
        } else {
            group.add(Grass(XWall - 2, 3, -i))
        }
    }

    return group
}

function init() {
    camera = new THREE.PerspectiveCamera(75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    )
    // https://github.com/pmndrs/cannon-es
    // https://pmndrs.github.io/cannon-es/docs/
    world = new THREE.Group()

    scene = new THREE.Scene()
    const axesHelper = new THREE.AxesHelper(10)
    scene.add(axesHelper)

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

    let rowZ = 0
    const deep = 20
    const row = constructRows(-2, rowZ, 5, deep)
    world.add(row)

    let color = 0xFFFFFF;
    let intensity = 1;
    const light2 = new THREE.AmbientLight(color, intensity);
    scene.add(light2);

    color = 0xFFFFFF;
    intensity = .5;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(0, 2, 5);
    light.target.position.set(0, 2, -5);
    scene.add(light);
    scene.add(light.target)

    const groundGeometry = new THREE.PlaneBufferGeometry(10, 10)
    groundMesh = new THREE.Mesh(
        groundGeometry,
        new THREE.MeshPhongMaterial({ color: 'red', specular: 0x050505, side: THREE.DoubleSide })
    )
    world.add(groundMesh)


    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshPhongMaterial({
        map: dirtTexture,
    })
    cubeTest = new THREE.Mesh(geometry, material)
    cubeTest.position.x = 1
    cubeTest.position.z = 1
    cubeTest.position.y = 1
    world.add(cubeTest)

    cubeTest2 = new THREE.Mesh(geometry, material)
    // cubeTest2.position.x = 2
    // cubeTest2.position.z = 2
    // cubeTest2.position.y = 2
    world.add(cubeTest2)

    // https://www.youtube.com/watch?v=TPKWohwHrbo
    scene.add(world)
}


let sphereBody: CANNON.Body
let sphereShape: CANNON.Shape
let physicsMaterial: CANNON.Material
let groundBody: CANNON.Body
let boxBody: CANNON.Body
let boxBody2: CANNON.Body

function initCannon() {
    cannonWorld = new CANNON.World({
        gravity: new CANNON.Vec3(0, -9.81, 0)
    })


    physicsMaterial = new CANNON.Material('physics')
    const physics_physics = new CANNON.ContactMaterial(physicsMaterial, physicsMaterial, {
        friction: 0.0,
        restitution: 0.3,
    })
    cannonWorld.addContactMaterial(physics_physics)

    // const radius = 1.3
    // sphereShape = new CANNON.Sphere(radius)
    // sphereBody = new CANNON.Body({ mass: 5, material: physicsMaterial })
    // sphereBody.addShape(sphereShape)
    // sphereBody.position.set(0, 0, 0)
    // sphereBody.linearDamping = 0.9
    // cannonWorld.addBody(sphereBody)

    groundBody = new CANNON.Body({
        shape: new CANNON.Box(new CANNON.Vec3(10, 10, 0.1)),
        type: CANNON.Body.STATIC,
    })
    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0)
    cannonWorld.addBody(groundBody)

    boxBody = new CANNON.Body({
        mass: 1,
        shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
        position: new CANNON.Vec3(1, 10, 2)
    })
    boxBody2 = new CANNON.Body({
        mass: 1,
        shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
        position: new CANNON.Vec3(1, 20, 2)
    })

    cannonWorld.addBody(boxBody)
    cannonWorld.addBody(boxBody2)
}



const GENERATION_DEEP = 20
const GENERATION_THRESHOLD = GENERATION_DEEP * 2
let lastGenerated = 0

const stats = Stats()
document.body.appendChild(stats.dom)

const timeStep = 1 / 60
function animate() {
    stats.begin()

    // @ts-ignore
    if (-controls.getObject().position.z > lastGenerated - GENERATION_THRESHOLD) {
        const row = constructRows(-2, lastGenerated, 5, GENERATION_DEEP)
        lastGenerated += GENERATION_DEEP
        world.add(row)
    }
    // @ts-ignore
    groundMesh.position.copy(groundBody.position)
    // @ts-ignore
    groundMesh.quaternion.copy(groundBody.quaternion)
    // @ts-ignore
    cubeTest.position.copy(boxBody.position)
    // @ts-ignore
    cubeTest.quaternion.copy(boxBody.quaternion)
    // @ts-ignore
    cubeTest2.position.copy(boxBody2.position)
    // @ts-ignore
    cubeTest2.quaternion.copy(boxBody2.quaternion)

    // @ts-ignore
    if (controls.enabled === true) {
        // @ts-ignore
        controls.update()
    }

    cannonWorld.step(timeStep)

    stats.end()

    requestAnimationFrame(animate)


    renderer.render(scene, camera)
    stats.update()
}


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)
}


init()
initCannon()
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
    // document.addEventListener('keyup', (event: KeyboardEvent) => {
    //     console.log(event)
    //     if (event.code === 'Space') {
    //         element.requestPointerLock()
    //     }
    // })
}
