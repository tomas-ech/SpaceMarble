import useGameData from './stores/useGameData.js'
import { Physics } from '@react-three/rapier'
import { Player } from './Player.jsx'
import { Level } from './Level.jsx'
import Lights from './Lights.jsx'
import { Sparkles } from '@react-three/drei'

export default function Experience() {

    const blockCount = useGameData((state) => state.blocksCount)
    const blockSeed = useGameData((state) => state.blocksSeed)

    return <>
        <color args={['black']} attach={"background"} />
        <Physics>
            <Lights />
            <Player />
            <Level count={blockCount} seed={blockSeed} />
        </Physics>
    </>
}