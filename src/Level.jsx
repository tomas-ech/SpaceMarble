import { BoxGeometry, Euler, MeshStandardMaterial, Quaternion } from 'three'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { Float, Sparkles, Text, useGLTF } from '@react-three/drei'
import React, { useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import useGameData from './stores/useGameData'

const boxGeometry = new BoxGeometry(1, 1, 1)

const floorMaterial = new MeshStandardMaterial({ color: '#00ffe1' })
const floorMaterial2 = new MeshStandardMaterial({ color: '#4e33ff' })
const obstacleMaerial = new MeshStandardMaterial({ color: '#ed4a5a' })
const wallMaterial = new MeshStandardMaterial({ color: '#2200ff' })

export function BlockStart({ position = [0, 0, 0] }) {
    const phase = useGameData((state) => state.phase)
    return <group position={position}>
        {
            phase === 'ready' && (
                <Float speed={3}>
                    <Text
                        // color={'#3a3a3a '}
                        font='./bebas-neue-v9-latin-regular.woff'
                        scale={0.6}
                        maxWidth={0.25}
                        lineHeight={0.75}
                        textAlign='left'
                        position={[-1.4, 0.8, -1.5]}
                        rotation-y={1}
                    >
                        Space Marble
                        <meshBasicMaterial toneMapped={false} />
                    </Text>
                </Float>
            )
        }
        <mesh
            geometry={boxGeometry}
            material={floorMaterial}
            position={[0, -0.1, 0]}
            scale={[4, 0.2, 4]}
            receiveShadow
        />
    </group >
}

export function BlockSpinner({ position = [0, 0, 0] }) {
    const spinner = useRef()
    const [speed] = useState(() => (Math.random() + 0.2) * (Math.random() < 0.5 ? -1 : 1))

    useFrame((state) => {
        const time = state.clock.getElapsedTime()

        const rotation = new Quaternion()
        rotation.setFromEuler(new Euler(0, time * speed, 0))
        spinner.current.setRotation(rotation)
    })

    return <group position={position}>
        <mesh
            geometry={boxGeometry} material={floorMaterial2}
            position={[0, -0.1, 0]} scale={[4, 0.2, 4]}
            receiveShadow
        />
        <RigidBody ref={spinner} type='kinematicPosition' restitution={0.2} friction={0} position={[0, 0.3, 0]}>
            <mesh
                geometry={boxGeometry} material={obstacleMaerial}
                scale={[3.5, 0.3, 0.3]}
                receiveShadow castShadow
            />
        </RigidBody>
    </group>
}

export function BlockLimbo({ position = [0, 0, 0] }) {
    const spinner = useRef()
    const [tiemOffSet] = useState(() => Math.random() * Math.PI * 2)

    useFrame((state) => {
        const time = state.clock.getElapsedTime()
        const yMove = Math.sin(time + tiemOffSet) + 1.15

        spinner.current.setNextKinematicTranslation({ x: 0, y: yMove, z: position[2] })
    })

    return <group position={position}>
        <mesh
            geometry={boxGeometry} material={floorMaterial2}
            position={[0, -0.1, 0]} scale={[4, 0.2, 4]}
            receiveShadow
        />
        <RigidBody ref={spinner} type='kinematicPosition' restitution={0.2} friction={0} position={[0, 0.3, 0]}>
            <mesh
                geometry={boxGeometry} material={obstacleMaerial}
                scale={[3.5, 0.3, 0.3]}
                receiveShadow castShadow
            />
        </RigidBody>
    </group>
}

export function BlockAxe({ position = [0, 0, 0] }) {
    const spinner = useRef()
    const [tiemOffSet] = useState(() => Math.random() * Math.PI * 2)

    useFrame((state) => {
        const time = state.clock.getElapsedTime()
        const xMove = Math.cos(time + tiemOffSet)

        spinner.current.setNextKinematicTranslation({ x: xMove, y: position[1] + 1, z: position[2] })
    })

    return <group position={position}>
        <mesh
            geometry={boxGeometry} material={floorMaterial2}
            position={[0, -0.1, 0]} scale={[4, 0.2, 4]}
            receiveShadow
        />
        <RigidBody ref={spinner} type='kinematicPosition' restitution={0.2} friction={0} position={[0, 0.3, 0]}>
            <mesh
                geometry={boxGeometry} material={obstacleMaerial}
                scale={[1.5, 1.5, 0.2]}
                receiveShadow castShadow
            />
        </RigidBody>
    </group>
}

export function BlockEnd({ position = [0, 0, 0] }) {
    const phase = useGameData((state) => state.phase)
    const hamburger = useGLTF('/hamburger.glb')

    hamburger.scene.children.forEach((mesh) => { mesh.castShadow = true })

    return <group position={position}>
        {
            phase !== 'ended' &&
            <Float speed={2}>
                <Text
                    font='./bebas-neue-v9-latin-regular.woff'
                    scale={1}
                    position={[0, 2, 0]}
                >
                    Finish!
                    <meshBasicMaterial toneMapped={false} />
                </Text>
            </Float>
        }
        <mesh
            geometry={boxGeometry}
            material={floorMaterial}
            position={[0, -0.1, 0]}
            scale={[4, 0.2, 4]}
            receiveShadow
        />
        <RigidBody type='fixed' colliders='hull' position={[0, 0.25, 0]} restitution={0.2} friction={0} >
            <Float speed={5}>
                <primitive object={hamburger.scene} scale={0.2} />
            </Float>
        </RigidBody>
    </group>
}

function Bounds({ length = 1, position = [0, 0, 0], scale = [0.3, 1.5, 4 * length] }) {

    return <>
        <RigidBody type='fixed' restitution={0.2} friction={0}>
            <mesh
                position={position}
                geometry={boxGeometry}
                material={wallMaterial}
                scale={scale}
                castShadow
            />
            <CuboidCollider args={[2, 0.1, 2 * length]}
                position={[0, -0.1, -(length * 2) + 2]} />
        </RigidBody>

    </>

}

export const Level = ({ count = 5, types = [BlockSpinner, BlockAxe, BlockLimbo], seed = 0 }) => {

    const blocks = useMemo(() => {
        const blocks = []

        for (let index = 0; index < count; index++) {
            const type = types[Math.floor(Math.random() * types.length)]
            blocks.push(type)
        }

        return blocks
    }, [count, types, seed])

    const length = count + 2

    return (
        <>
            <Sparkles count={10000} scale={length * 10} size={20} />
            <BlockStart position={[0, 0, 0]} />

            {
                blocks.map((Block, index) => <Block key={index} position={[0, 0, -(index + 1) * 4]} />)
            }

            <BlockEnd position={[0, 0, -(count + 1) * 4]} />

            <Bounds length={length} position={[2.15, 0.75, -length * 2 + 2]} />
            <Bounds length={length} position={[-2.15, 0.75, -length * 2 + 2]} />
            <Bounds length={1} position={[0, 0.75, - (length * 4) + 2]} scale={[4, 1.5, 0.3]} />
        </>
    )
}
