// @ts-nocheck
import * as THREE from 'three'


export default function (camera: THREE.Camera, MouseMoveSensitivity = 0.002, xSpeed = 7.0, zSpeed = 6, jumpHeight = 12.0, height = 2.0) {
    let scope = this

    scope.MouseMoveSensitivity = MouseMoveSensitivity
    scope.speed = xSpeed
    scope.height = height
    scope.jumpHeight = jumpHeight
    scope.click = false
    scope.autoForward = true
    scope.mouseDirection = false
    scope.prevTime = performance.now()

    let moveForward = false
    let moveBackward = false
    let moveLeft = false
    let moveRight = false
    let canJump = false
    let run = false

    let velocity = new THREE.Vector3()
    let direction = new THREE.Vector3()


    camera.rotation.set(0, 0, 0)

    let pitchObject = new THREE.Object3D()
    pitchObject.add(camera)

    let yawObject = new THREE.Object3D()
    // yawObject.position.y = 10
    yawObject.add(pitchObject)

    let PI_2 = Math.PI / 2

    let onMouseMove = function (event: MouseEvent) {
        if (scope.enabled === false) return
        if (!scope.mouseDirection) return

        let movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0
        let movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0

        yawObject.rotation.y -= movementX * scope.MouseMoveSensitivity
        pitchObject.rotation.x -= movementY * scope.MouseMoveSensitivity

        pitchObject.rotation.x = Math.max(- PI_2, Math.min(PI_2, pitchObject.rotation.x))

    }

    let onKeyDown = (function (event: KeyboardEvent) {

        if (scope.enabled === false) return

        switch (event.keyCode) {
            case 38: // up
            case 90: // z
                moveForward = true
                break

            case 37: // left
            case 81: // q
                moveLeft = true
                break

            case 40: // down
            case 83: // s
                moveBackward = true
                break

            case 39: // right
            case 68: // d
                moveRight = true
                break

            case 32: // space
                if (canJump === true) velocity.y += run === false ? scope.jumpHeight : scope.jumpHeight + 50
                canJump = false
                break

            case 16: // shift
                run = true
                break

        }

    }).bind(this)

    let onKeyUp = (function (event: KeyboardEvent) {

        if (scope.enabled === false) return

        switch (event.keyCode) {
            case 38: // up
            case 90: // z
                moveForward = false
                break

            case 37: // left
            case 81: // q
                moveLeft = false
                break

            case 40: // down
            case 83: // s
                moveBackward = false
                break

            case 39: // right
            case 68: // d
                moveRight = false
                break

            case 16: // shift
                run = false
                break

        }

    }).bind(this)

    let onMouseDownClick = (function (event: MouseEvent) {
        if (scope.enabled === false) return
        scope.click = true
    }).bind(this)

    let onMouseUpClick = (function (event: MouseEvent) {
        if (scope.enabled === false) return
        scope.click = false
    }).bind(this)


    scope.dispose = function () {
        document.removeEventListener('mousemove', onMouseMove, false)
        document.removeEventListener('keydown', onKeyDown, false)
        document.removeEventListener('keyup', onKeyUp, false)
        document.removeEventListener('mousedown', onMouseDownClick, false)
        document.removeEventListener('mouseup', onMouseUpClick, false)
    }

    document.addEventListener('mousemove', onMouseMove, false)
    document.addEventListener('keydown', onKeyDown, false)
    document.addEventListener('keyup', onKeyUp, false)
    document.addEventListener('mousedown', onMouseDownClick, false)
    document.addEventListener('mouseup', onMouseUpClick, false)

    scope.enabled = false

    scope.getObject = function () {

        return yawObject

    }

    yawObject.position.y = 2

    scope.update = function (minY: int = 0) {

        let time = performance.now()
        let delta = (time - scope.prevTime) / 1000

        velocity.y -= 9.8 * 4 * delta
        velocity.x -= velocity.x * 10.0 * delta
        direction.x = Number(moveRight) - Number(moveLeft)

        velocity.z -= velocity.z * 10.0 * delta
        direction.z = Number(moveForward) - Number(moveBackward)
        direction.normalize()

        let currentSpeed = scope.speed
        if (run && (moveForward || scope.autoForward || moveBackward || moveLeft || moveRight)) currentSpeed = currentSpeed + (currentSpeed * 1.1)

        if (moveLeft && yawObject.position.x > -2) {
            yawObject.translateX(-currentSpeed * delta)
        }
        if (moveRight && yawObject.position.x < 2) {
            yawObject.translateX(currentSpeed * delta)
        }
        if (moveForward || scope.autoForward) {
            yawObject.translateZ(-currentSpeed * delta)
        }
        if (moveBackward && !scope.autoForward) {
            yawObject.translateZ(currentSpeed * delta)
        }

        if (scope.getObject().position.y - height >= minY) {
            scope.getObject().position.y += (velocity.y * delta)
        }

        if (scope.getObject().position.y < scope.height) {
            velocity.y = 0
            scope.getObject().position.y = scope.height

            canJump = true
        } else if (minY != 0 && scope.getObject().position.y < scope.height + minY) {
            velocity.y = minY
            scope.getObject().position.y = scope.height + minY

            canJump = true
        }

        scope.prevTime = time
    }
}
