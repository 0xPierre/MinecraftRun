import * as THREE from 'three'
const loader = new THREE.TextureLoader()

const grassTexture = loader.load(require('./assets/blocks/grass.jpg').default)
const dirtTexture = loader.load(require('./assets/blocks/dirt.jpg').default)
const stoneTexture = loader.load(require('./assets/blocks/stone.jpg').default)

const Grass = (x: number = 1, y: number = 1, z: number = 1) => {
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshBasicMaterial({
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
    const material = new THREE.MeshBasicMaterial({
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
    const material = new THREE.MeshBasicMaterial({
        map: stoneTexture,
    })
    const cube = new THREE.Mesh(geometry, material)
    cube.position.x = x
    cube.position.z = z
    cube.position.y = y

    return cube
}


export {
    Grass,
    Dirt,
    Stone,
}