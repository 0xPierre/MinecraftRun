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
    Obstacles,
    grassFloor,
    stoneWall,
    grassWall,
    FlowerPot,
    Cobble,
} from './structures'


let camera: THREE.PerspectiveCamera,
    world: THREE.Group, scene: THREE.Scene,
    renderer: THREE.WebGLRenderer,
    controls: typeof firstPersonControls,
    rows: THREE.Group[] = [],
    obstacles: any[] = [],
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

    let obstacle: any

    if (random > 0.75) {
        obstacle = Obstacles.simpleLine(0, 1, z, 5, 1)
    } else if (random > 0.50) {
        obstacle = Obstacles.wallLeft(z)
        obstacle.name = 'wall'
    } else if (random > 0.25) {
        obstacle = Obstacles.wallRight(z)
        obstacle.name = 'wall'
    } else {
        obstacle = Obstacles.wallEnterMiddle(z)
        obstacle.name = 'wall'
    }


    obstacles.push(obstacle)

    return obstacle
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


    for (let i = z; i > z - deep; i--) {
        if (Math.random() > 0.40) {
            if (Math.random() > 0.70) {
                group.add(Stone(-3, 1, i))
            } else {
                group.add(Cobble(-3, 1, i))
            }

            if (Math.random() > 0.60) {
                if (Math.random() > 0.70) {
                    group.add(Stone(-3, 2, i))
                } else {
                    group.add(Cobble(-3, 2, i))
                }
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
            if (Math.random() > 0.70) {
                group.add(Stone(3, 1, i))
            } else {
                group.add(Cobble(3, 1, i))
            }

            if (Math.random() > 0.60) {
                if (Math.random() > 0.70) {
                    group.add(Stone(3, 2, i))
                } else {
                    group.add(Cobble(3, 2, i))
                }
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

    if (useObstacle || true) {
        const obstaclesToGenerate = Math.floor(Math.random() * 3 + 1)
        const obstaclesThreshold = deep / obstaclesToGenerate
        let lastXObstacle = 0


        for (let i = 0; i < obstaclesToGenerate; i++) {
            lastXObstacle += obstaclesThreshold

            const obstacle = constructObstacle(z - lastXObstacle)
            group.add(obstacle)
        }
    }

    rows.push(group)

    return group
}

function initSky() {
    sky = new Sky()
    sky.scale.setScalar(450000)
    scene.add(sky)

    sun = new THREE.Vector3()

    const effectController = {
        turbidity: 10,
        rayleigh: 3,
        mieCoefficient: 0.001,
        mieDirectionalG: 0.7,
        elevation: 2,
        azimuth: 180,
        exposure: renderer.toneMappingExposure
    }

    function guiChanged() {
        const uniforms = sky.material.uniforms
        uniforms['turbidity'].value = effectController.turbidity
        uniforms['rayleigh'].value = effectController.rayleigh
        uniforms['mieCoefficient'].value = effectController.mieCoefficient
        uniforms['mieDirectionalG'].value = effectController.mieDirectionalG

        const phi = THREE.MathUtils.degToRad(90 - effectController.elevation)
        const theta = THREE.MathUtils.degToRad(effectController.azimuth)

        sun.setFromSphericalCoords(1, phi, theta)

        uniforms['sunPosition'].value.copy(sun)

        renderer.toneMappingExposure = effectController.exposure
        renderer.render(scene, camera)
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
        backgroundMusic.setBuffer(buffer)
        backgroundMusic.setLoop(true)
        backgroundMusic.setVolume(1)
    })

    world = new THREE.Group()

    scene = new THREE.Scene()

    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)
    renderer.outputEncoding = THREE.sRGBEncoding

    window.addEventListener('resize', onWindowResize, false)

    // @ts-ignore
    controls = new firstPersonControls(camera)
    // @ts-ignore
    scene.add(controls.getObject())

    raycaster = new THREE.Raycaster(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, - 1, 0), 0, 5)

    const row = constructRows(-2, 0, 5, 20, false)
    world.add(row)

    let color = 0xFFFFFF
    let intensity = .65
    const light2 = new THREE.AmbientLight(color, intensity)
    scene.add(light2)

    color = 0xFFFFFF
    intensity = .2
    const light = new THREE.DirectionalLight(color, intensity)
    light.position.set(0, 2, 5)
    light.target.position.set(0, 2, -5)
    scene.add(light)
    scene.add(light.target)

    scene.add(world)
}


const updateCounter = setInterval(() => {
    // @ts-ignore
    if (!controls.enabled) return false
    const counter = document.querySelector('#score-counter')
    if (counter) {
        // @ts-ignore
        const count = parseInt(counter.textContent || 0) + 1
        // @ts-ignore
        counter.textContent = count
        if (count % 100 === 0) {
            // @ts-ignore
            controls.speed += 0.5
            backgroundMusic.setPlaybackRate(backgroundMusic.playbackRate + 0.02)
        }
    }
}, 100)


const GENERATION_DEEP = 20
const GENERATION_THRESHOLD = GENERATION_DEEP * 10
let lastGenerated = 20
let lastDestroyed = 20

const stats = Stats()
// Pour afficher les FPS
// document.body.appendChild(stats.dom)

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
        // world.remove(rows[0])
        // rows.shift()
        lastDestroyed += GENERATION_DEEP
    }

    // @ts-ignore
    if (controls.enabled === true) {
        // @ts-ignore
        raycaster.ray.origin.copy(controls.getObject().position)

        const intersections = raycaster.intersectObjects(obstacles, true)
        let minY = 0
        if (intersections.length > 0) {
            const object = intersections[0]
            let maxDistance = 0.5

            if (object.object.parent?.name === 'wall') {
                maxDistance = 1.5
            }
            // @ts-ignore
            if (controls.getObject().position.z < -2) {
                if (object.distance <= maxDistance) {
                    gameOver()
                    clearInterval(updateCounter)
                } else {
                    minY = object.object.position.y
                }
            }
        }

        // @ts-ignore
        controls.update(minY = minY)
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
const gameOverElement = document.querySelector('#game-over')
const havePointerLock = 'pointerLockElement' in document
const element = document.body

const playGame = () => {
    // @ts-ignore
    instructions.style.display = 'none'
    backgroundMusic.play()

    // @ts-ignore
    controls.prevTime = performance.now()
    // @ts-ignore
    controls.enabled = true
}

const pauseGame = () => {
    // @ts-ignore
    controls.enabled = false
    // @ts-ignore
    instructions.style.display = ''
    backgroundMusic.stop()
}

let isOver = false
const gameOver = () => {
    isOver = true
    // @ts-ignore
    controls.enabled = false
    // @ts-ignore
    gameOverElement.style.display = 'flex'
    document.exitPointerLock()
    backgroundMusic.stop()
}


if (instructions && havePointerLock) {
    const onPointerLockChange = (event: Event) => {
        if (!isOver) {
            if (document.pointerLockElement === element) {
                playGame()
            } else {
                pauseGame()
            }
        }
    }

    document.addEventListener('pointerlockchange', onPointerLockChange, false)

    instructions.addEventListener('click', (event: Event) => {
        // @ts-ignore
        element.requestPointerLock()
    })
}
