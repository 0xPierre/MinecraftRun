import * as THREE from 'three'
// @ts-ignore
import { GLTFLoader } from './jsm/loaders/GLTFLoader.js'
const gltfLoader = new GLTFLoader()
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


const woodLine = (x: number, y: number, z:number, width: number, height: number) => {
    const geometry = new THREE.BoxGeometry(width, height, 1)

    const texture = loader.load(require('./assets/blocks/wood.png').default)

    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set( width, height )

    const material = new THREE.MeshPhongMaterial({
        map: texture
    })
    const line = new THREE.Mesh(geometry, material)
    line.position.x = x
    line.position.y = y
    line.position.z = z

    return line
}


const grassFloor = (z: number, width: number = 7, depth: number = 20) => {
    const texture = loader.load(require('./assets/blocks/grass.jpg').default)

    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set( width, depth )

    const geometry = new THREE.BoxGeometry(width, 1 ,depth)

    const material = new THREE.MeshPhongMaterial({
        map: texture,
    })
    const floor = new THREE.Mesh(geometry, material)

    floor.position.x = 0
    floor.position.y = 0
    floor.position.z = (z - depth / 2) + 0.5

    return floor
}

const stoneWall = (x: number, y: number, z: number,width: number = 1, height: number = 2, depth: number = 20) => {
    const texture = loader.load(require('./assets/blocks/stone.jpg').default)

    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set( depth, height )

    const geometry = new THREE.BoxGeometry(width, height ,depth)

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
    texture.repeat.set( depth, height )

    const geometry = new THREE.BoxGeometry(width, height ,depth)

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



const Fox = async (x: number, y: number, z: number, group: THREE.Group) => {
    const url = '/dist/models/fox/scene.gltf'
    const fox = await gltfLoader.load(url, (gltf: any) => {
        group.add(gltf.scene)
        
        

        gltf.scene.position.x = x
        gltf.scene.position.y = y
        gltf.scene.position.z = z

        console.log(gltf)

        // const mixer = new THREE.AnimationMixer( gltf.scene );
        // gltf.animations.forEach( ( clip: any ) => {
        //     console.log(clip, mixer)
        //     mixer.clipAction( clip ).play();
          
        // } )
    })

    // return mi
}


export {
    Grass,
    Dirt,
    Stone,
    Wood,
    woodLine,
    grassFloor,
    stoneWall,
    grassWall,
    FlowerPot,
    Fox,
}
