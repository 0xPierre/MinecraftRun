import * as THREE from 'three'
// @ts-ignore
import { GLTFLoader } from './jsm/loaders/GLTFLoader.js'
const gltfLoader = new GLTFLoader()
const loader = new THREE.TextureLoader()


const grassTexture = loader.load(require('./assets/blocks/grass.jpg').default)
const dirtTexture = loader.load(require('./assets/blocks/dirt.jpg').default)
const stoneTexture = loader.load(require('./assets/blocks/stone.jpg').default)
const woodTexture = loader.load(require('./assets/blocks/wood.png').default)
const cobbleTexture = loader.load(require('./assets/blocks/cobble.png').default)
const logTexture = loader.load(require('./assets/blocks/log.jpg').default)


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


const Cobble = (x: number, y: number, z: number) => {
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshPhongMaterial({
        map: cobbleTexture,
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

const Log = (x: number = 1, y: number = 1, z: number = 1) => {
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshPhongMaterial({
        map: logTexture,
    })
    const cube = new THREE.Mesh(geometry, material)
    cube.position.x = x
    cube.position.z = z
    cube.position.y = y

    return cube
}



const grassFloor = (z: number, width: number = 7, depth: number = 20) => {
    const texture = loader.load(require('./assets/blocks/grass.jpg').default)

    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(width, depth)

    const geometry = new THREE.BoxGeometry(width, 1, depth)

    const material = new THREE.MeshPhongMaterial({
        map: texture,
    })
    const floor = new THREE.Mesh(geometry, material)

    floor.position.x = 0
    floor.position.y = 0
    floor.position.z = (z - depth / 2) + 0.5

    return floor
}

const stoneWall = (x: number, y: number, z: number, width: number = 1, height: number = 2, depth: number = 20) => {
    const texture = loader.load(require('./assets/blocks/stone.jpg').default)

    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(depth, height)

    const geometry = new THREE.BoxGeometry(width, height, depth)

    const material = new THREE.MeshPhongMaterial({
        map: texture,
    })
    const floor = new THREE.Mesh(geometry, material)

    floor.position.x = x
    floor.position.y = y + 0.5
    floor.position.z = (z - depth / 2) + 0.5

    return floor
}

const grassWall = (x: number, y: number, z: number, width: number = 1, height: number = 2, depth: number = 20) => {
    const texture = loader.load(require('./assets/blocks/grass.jpg').default)

    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(depth, height)

    const geometry = new THREE.BoxGeometry(width, height, depth)

    const material = new THREE.MeshPhongMaterial({
        map: texture,
    })
    const floor = new THREE.Mesh(geometry, material)

    floor.position.x = x
    floor.position.y = y
    floor.position.z = (z - depth / 2) + 0.5

    return floor
}


const FlowerPot = async (x: number, y: number, z: number, group: THREE.Group) => {
    const url = '/dist/models/flowerPot/scene.gltf'
    const pot = await gltfLoader.load(url, (pot: any) => {
        group.add(pot.scene)

        pot.scene.position.x = x
        pot.scene.position.y = y
        pot.scene.position.z = z
    })

}

/**
 * Obstacles
 */
const Obstacles = {
    /**
     * Simple ligne
     */
    simpleLine(x: number, y: number, z: number, width: number, height: number) {
        const geometry = new THREE.BoxGeometry(width, height, 1)

        let texture: THREE.Texture
        if (Math.random() > 0.55) {
            texture = loader.load(require('./assets/blocks/cobble.png').default)
        } else {
            texture = loader.load(require('./assets/blocks/wood.png').default)
        }

        texture.wrapS = THREE.RepeatWrapping
        texture.wrapT = THREE.RepeatWrapping
        texture.repeat.set(width, height)

        const material = new THREE.MeshPhongMaterial({
            map: texture,
        })
        const line = new THREE.Mesh(geometry, material)
        line.position.x = x
        line.position.y = y
        line.position.z = z

        return line
    },
    wallRight(z: number) {
        const group = new THREE.Group()

        let length = 0
        if (Math.random() > 0.5) {
            length = 3
        } else {
            length = 4
        }

        const log1 = Log(2, 2, z)
        const log2 = Log(2, 1, z)
        const log3 = Log(2 - (length - 1), 2, z)
        const log4 = Log(2 - (length - 1), 1, z)

        const insideWall: THREE.Mesh[] = []
        for (let i = 0; i < length - 2; i++) {
            insideWall.push(Cobble(2 - 1 - i, 1, z))
            insideWall.push(Cobble(2 - 1 - i, 2, z))
        }

        group.add(log1, log2, log3, log4, ...insideWall)

        return group
    },

    wallLeft(z: number) {
        const group = new THREE.Group()

        let length = 0
        if (Math.random() > 0.66) {
            length = 3
        } else {
            length = 4
        }

        const log1 = Log(-2, 2, z)
        const log2 = Log(-2, 1, z)
        const log3 = Log(-2 + (length - 1), 2, z)
        const log4 = Log(-2 + (length - 1), 1, z)

        const insideWall: THREE.Mesh[] = []
        for (let i = 0; i < length - 2; i++) {
            insideWall.push(Cobble(-2 + 1 + i, 1, z))
            insideWall.push(Cobble(-2 + 1 + i, 2, z))
        }

        group.add(log1, log2, log3, log4, ...insideWall)

        return group
    },

    wallEnterMiddle(z: number) {
        const group = new THREE.Group()

        let length = 0
        if (Math.random() > 0.66) {
            length = 2
        } else {
            length = 1
        }

        const wood1 = Wood(-2, 1, z)
        const wood2 = Wood(-2, 2, z)
        const log1 = Log(-1, 1, z)
        const log2 = Log(-1, 2, z)

        const wood3 = Wood(2, 1, z)
        const wood4 = Wood(2, 2, z)
        const log3 = Log(1, 1, z)
        const log4 = Log(1, 2, z)

        group.add(wood1, wood2, wood3, wood4, log1, log2, log3, log4)

        return group
    }
}

export {
    Grass,
    Dirt,
    Stone,
    Wood,
    Cobble,
    grassFloor,
    stoneWall,
    grassWall,
    FlowerPot,
    // Fox,
    Obstacles,
}
