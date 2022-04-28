import * as THREE from 'three'
import { LineBasicMaterial } from 'three'
const loader = new THREE.TextureLoader()

const grassTexture = loader.load(require('./assets/blocks/grass.jpg').default)
const dirtTexture = loader.load(require('./assets/blocks/dirt.jpg').default)
const stoneTexture = loader.load(require('./assets/blocks/stone.jpg').default)
const woodTexture = loader.load(require('./assets/blocks/wood.png').default)


const Grass = (x: number = 1, y: number = 1, z: number = 1) => {
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshPhongMaterial({
        map: grassTexture,
    })
    const cube = new THREE.Mesh(geometry, material)
    cube.position.x = x
    cube.position.z = z
    cube.position.y = y

    return cube
}


const Dirt = (x: number = 1, y: number = 1, z: number = 1) => {
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshPhongMaterial({
        map: dirtTexture,
    })
    const cube = new THREE.Mesh(geometry, material)
    cube.position.x = x
    cube.position.z = z
    cube.position.y = y

    return cube
}

const Stone = (x: number = 1, y: number = 1, z: number = 1) => {
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshPhongMaterial({
        map: stoneTexture,
    })
    const cube = new THREE.Mesh(geometry, material)
    cube.position.x = x
    cube.position.z = z
    cube.position.y = y

    return cube
}

const Wood = (x: number = 1, y: number = 1, z: number = 1) => {
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshPhongMaterial({
        map: woodTexture,
    })
    const cube = new THREE.Mesh(geometry, material)
    cube.position.x = x
    cube.position.z = z
    cube.position.y = y

    return cube
}


const woodLine = (x: number, y: number, z:number, width: number, depth: number, height: number) => {
    const geometry = new THREE.BoxGeometry(width, height, depth)

    woodTexture.wrapS = THREE.RepeatWrapping;
    woodTexture.wrapT = THREE.RepeatWrapping;
    woodTexture.repeat.set( width, 1 )

    const material = new THREE.MeshPhongMaterial({
        map: woodTexture
    })
    const line = new THREE.Mesh(geometry, material)
    line.position.x = x
    line.position.y = y
    line.position.z = z

    return line
}


export {
    Grass,
    grassTexture,
    Dirt,
    dirtTexture,
    Stone,
    stoneTexture,
    Wood,
    woodTexture,
    woodLine,
}
