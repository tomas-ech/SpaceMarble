import { useFrame } from "@react-three/fiber"
import { useRef } from "react"

export default function Lights() {

    const ligth = useRef()

    useFrame((state) => {
        ligth.current.position.z = state.camera.position.z + 1
        ligth.current.target.position.z = state.camera.position.z
        ligth.current.target.updateMatrixWorld()
    })

    return <>
        <directionalLight
            ref={ligth}
            castShadow
            position={[4, 4, 1]}
            intensity={4.5}
            shadow-mapSize={[1024, 1024]}
            shadow-camera-near={1}
            shadow-camera-far={10}
            shadow-camera-top={10}
            shadow-camera-right={10}
            shadow-camera-bottom={- 10}
            shadow-camera-left={- 10}
        />
        <ambientLight intensity={1.5} />
    </>
}