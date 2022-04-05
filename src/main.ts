import * as THREE from 'three'
import * as CANNON from 'cannon-es'

import firstPersonControls from './firstPersonControls'

import {
    Grass,
    Dirt,
    Stone,
} from './blocks'

const loader = new THREE.TextureLoader()

let camera: THREE.PerspectiveCamera,
    world: THREE.Group, scene: THREE.Scene,
    renderer: THREE.WebGLRenderer,
    controls: typeof firstPersonControls


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



    scene.add(world)

}

const GENERATION_DEEP = 20
const GENERATION_THRESHOLD = GENERATION_DEEP * 2
let lastGenerated = 0

function animate() {


    // @ts-ignore
    if (-controls.getObject().position.z > lastGenerated - GENERATION_THRESHOLD) {
        const row = constructRows(-2, lastGenerated, 5, GENERATION_DEEP)
        lastGenerated += GENERATION_DEEP
        world.add(row)
    }

    requestAnimationFrame(animate)

    // @ts-ignore
    if (controls.enabled === true) {
        // @ts-ignore
        controls.update()


        // 
        // Génération du monde
        // 


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
    // document.addEventListener('keyup', (event: KeyboardEvent) => {
    //     console.log(event)
    //     if (event.code === 'Space') {
    //         element.requestPointerLock()
    //     }
    // })
}
