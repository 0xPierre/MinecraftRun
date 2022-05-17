import * as THREE from 'three'
// @ts-ignore
import Stats from 'three/examples/jsm/libs/stats.module'
import firstPersonControls from './firstPersonControls'
// @ts-ignore
import { Sky } from './jsm/objects/sky'

import {
    Grass,
    Dirt,
    Stone,
    Wood,
    woodLine,
    grassFloor,
    stoneWall,
    grassWall,
    Fox,
    FlowerPot,
} from './structures'


let camera: THREE.PerspectiveCamera,
world: THREE.Group, scene: THREE.Scene,
renderer: THREE.WebGLRenderer,
controls: typeof firstPersonControls,
rows: THREE.Group[] = [],
obstacles: THREE.Mesh[] = [],
raycaster: THREE.Raycaster,
sky: Sky,
sun: THREE.Vector3

const musicListener = new THREE.AudioListener
const backgroundMusic = new THREE.Audio(musicListener)

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)
}

const constructObstacle = (z: number) => {
    const random = Math.random()

    const group = new THREE.Group()

    // const wallGeometry = new THREE.BoxGeometry(
    //     2,
    //     1,
    //     1
    // )
    // woodTexture.wrapS = THREE.RepeatWrapping;
    // woodTexture.wrapT = THREE.RepeatWrapping;
    // woodTexture.repeat.set( 2, 1 )
    // const wallMaterial = new THREE.MeshPhongMaterial({
    //     map: woodTexture,
    // })

    // const wall = new THREE.Mesh(wallGeometry, wallMaterial)
    // wall.position.x = 0
    // wall.position.y = 1
    // wall.position.z = z
    const woodline = woodLine(0, 1, z, 5, 1)
    group.add(woodline)

    
    obstacles.push(woodline)

    // if (random > 0.8) {
        // const wood = Wood(-2, 1, z)
        // obstacles.push(wood)
        // group.add(wood)
    // }
    return group
}


function constructRows(x: number, z: number, width: number, deep: number, useObstacle: boolean = true) {
    z = -z
    const group = new THREE.Group()

    // Sol en herbe
    const floor = grassFloor(z)
    group.add(floor)

    // On gère la partie gauche
    const wallLeft = stoneWall(-4, 1, z)
    group.add(wallLeft)
    const grassLineTopLeft = grassWall(-5, 3, z, 1, 1)
    group.add(grassLineTopLeft)

    
    // On gère la partie droite
    const wallRight = stoneWall(4, 1, z)
    group.add(wallRight)
    const grassLineTopRight = grassWall(5, 3, z, 1, 1)
    group.add(grassLineTopRight)
    
    
    for (let i =z; i > z - deep; i--) {
        if (Math.random() > 0.40) {
            group.add(Stone(-3, 1, i))

            if (Math.random() > 0.60) {
                group.add(Stone(-3, 2, i))
            }
        } else if (Math.random() > 0.70) {
            group.add(Dirt(-3, 1, i))
            if (Math.random() > 0.60) {
                FlowerPot(-3, 1.5, i, group)
            }
        }

        if (Math.random() > 0.7) {
            group.add(Grass(4, 3, i))
        }

        if (Math.random() > 0.40) {
            group.add(Stone(3, 1, i))

            if (Math.random() > 0.60) {
                group.add(Stone(3, 2, i))
            }
        } else if (Math.random() > 0.70) {
            group.add(Dirt(3, 1, i))
            if (Math.random() > 0.60) {
                FlowerPot(3, 1.5, i, group)
            }
        }

        if (Math.random() > 0.7) {
            group.add(Grass(4, 3, i))
        }
        if (Math.random() > 0.75) {
            group.add(Grass(-4, 3, i))
        }
    }

    const obstaclesToGenerate = Math.floor(Math.random() * 3) + 1
    const obstaclesThreshold = deep / obstaclesToGenerate
    let lastXObstacle = 0

    for (let i=0; i < obstaclesToGenerate; i++) {
        lastXObstacle += obstaclesThreshold
        
        const obstacle = constructObstacle(0)
        group.add(obstacle)

        lastXObstacle = 0
    }

    // let obstaclesLastPosition = 0

    

    // if (useObstacle) {
    //     obstaclesLastPosition += 1

    //     if (obstaclesLastPosition >= obstaclesThreshold) {
    //         obstaclesLastPosition = 0
    //         // const wood = Wood(XWall+2, 1, i)
    //         // obstacles.push(wood)
    //         // group.add(wood)
    //         const obstacle = constructObstacle(0)
    //         group.add(obstacle)
    //     }
    // }

    rows.push(group)

    return group
}
function initSky() {

    // Add Sky
    sky = new Sky();
    sky.scale.setScalar( 450000 );
    scene.add( sky );

    sun = new THREE.Vector3();

    /// GUI

    const effectController = {
        turbidity: 10,
        rayleigh: 3,
        mieCoefficient: 0.001,
        mieDirectionalG: 0.7,
        elevation: 2,
        azimuth: 180,
        exposure: renderer.toneMappingExposure
    };

    function guiChanged() {

        const uniforms = sky.material.uniforms;
        uniforms[ 'turbidity' ].value = effectController.turbidity;
        uniforms[ 'rayleigh' ].value = effectController.rayleigh;
        uniforms[ 'mieCoefficient' ].value = effectController.mieCoefficient;
        uniforms[ 'mieDirectionalG' ].value = effectController.mieDirectionalG;

        const phi = THREE.MathUtils.degToRad( 90 - effectController.elevation );
        const theta = THREE.MathUtils.degToRad( effectController.azimuth );

        sun.setFromSphericalCoords( 1, phi, theta );

        uniforms[ 'sunPosition' ].value.copy( sun );

        renderer.toneMappingExposure = effectController.exposure;
        renderer.render( scene, camera );

    }

    guiChanged()
}


function init() {
    camera = new THREE.PerspectiveCamera(75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    )
    // Musique
    const audioLoader = new THREE.AudioLoader()
    audioLoader.load(require('./assets/kirky-theme.mp3').default, buffer => {
        backgroundMusic.setBuffer( buffer );
        backgroundMusic.setLoop( true );
        backgroundMusic.setVolume( 1 );
    })

    world = new THREE.Group()

    scene = new THREE.Scene()
    const axesHelper = new THREE.AxesHelper(10)
    scene.add(axesHelper)

    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    // renderer.shadowMap.enabled = true
    // renderer.shadowMap.type = THREE.PCFSoftShadowMap
    document.body.appendChild(renderer.domElement)
    renderer.outputEncoding = THREE.sRGBEncoding

    window.addEventListener('resize', onWindowResize, false)

    // @ts-ignore
    controls = new firstPersonControls(camera)
    // @ts-ignore
    scene.add(controls.getObject())

    raycaster = new THREE.Raycaster(new THREE.Vector3(0, 0, 0), new THREE.Vector3( 0, - 1, 0 ), 0, 5 )

    const row = constructRows(-2, 0, 5, 20, false)
    world.add(row)

    let color = 0xFFFFFF;
    let intensity = .65;
    const light2 = new THREE.AmbientLight(color, intensity);
    scene.add(light2);

    color = 0xFFFFFF;
    intensity = .2;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(0, 2, 5);
    light.target.position.set(0, 2, -5);
    scene.add(light);
    scene.add(light.target)

    // const flower = flowerPot(1, 1, 1, world)
    // console.log(flower)
    const fox = Fox(1, 1, 1, world)

    scene.add(world)

}


const updateCounter = setInterval(() => {
    const counter = document.querySelector('#score-counter')
    if (counter) {
        // @ts-ignore
        counter.textContent = parseInt(counter.textContent || 0) + 1
    }
}, 1000)


const GENERATION_DEEP = 20
const GENERATION_THRESHOLD = GENERATION_DEEP * 20
let lastGenerated = 20
let lastDestroyed = 20

const stats = Stats()
document.body.appendChild(stats.dom)

const timeStep = 1 / 60
function animate() {
    stats.begin()

    /**
     * On gère la génération de nouvelles lignes
     */
    // @ts-ignore
    if (-controls.getObject().position.z > lastGenerated - GENERATION_THRESHOLD) {
        const row = constructRows(-2, lastGenerated, 5, GENERATION_DEEP)
        lastGenerated += GENERATION_DEEP
        world.add(row)
    }
    
    /**
     * Suppression des ligne de blocks
     */
    if (lastDestroyed < lastGenerated - GENERATION_THRESHOLD) {
        world.remove(rows[0])
        rows.shift()
        lastDestroyed += GENERATION_DEEP
    }

    // @ts-ignore
    if (controls.enabled === true) {
        // @ts-ignore
        raycaster.ray.origin.copy( controls.getObject().position )

        const intersections = raycaster.intersectObjects(obstacles, true)
        
        let minY = 0
        if (intersections.length > 0) {
            const object = intersections[0]
            // @ts-ignore
            if (object.distance === 0.5) {
                // @ts-ignore
                // controls.enabled = false
                console.log('Perdu')
                clearInterval(updateCounter)
            } else {
                console.log(object)
                minY = object.object.position.y
            }
        }

        // @ts-ignore
        controls.update(minY=minY)
    }
    stats.end()

    requestAnimationFrame(animate)

    renderer.render(scene, camera)
    stats.update()
}




init()
initSky()
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
            backgroundMusic.play()
        } else {
            // @ts-ignore
            controls.enabled = false
            // @ts-ignore
            instructions.style.display = ''
            backgroundMusic.stop()
        }
    }

    document.addEventListener('pointerlockchange', onPointerLockChange, false)

    instructions.addEventListener('click', (event: Event) => {
        // @ts-ignore
        element.requestPointerLock()
    })
}
