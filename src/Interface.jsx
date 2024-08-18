import { useKeyboardControls } from '@react-three/drei'
import useGameData from './stores/useGameData'
import { addEffect } from '@react-three/fiber'
import React, { useEffect, useRef } from 'react'

export const Interface = () => {

  const forward = useKeyboardControls((state) => state.forward) // Es lo mismo que decir (state) => { return state.forward }
  const backward = useKeyboardControls((state) => state.backward)
  const leftward = useKeyboardControls((state) => state.leftward)
  const rightward = useKeyboardControls((state) => state.rightward)
  const jump = useKeyboardControls((state) => state.jump)

  const restart = useGameData((state) => state.restart)
  const phase = useGameData((state) => state.phase)

  const time = useRef();

  useEffect(() => {
    const unsusbscribeEffect = addEffect(() => {
      const state = useGameData.getState()
      
      let elapseTime = 0;

      if (state.phase === 'playing') {
        elapseTime = Date.now() - state.startTime;
      }
      else if (state.phase === 'ended') {
        elapseTime = state.endTime - state.startTime;
      }

      elapseTime /= 1000;
      elapseTime = elapseTime.toFixed(2)

      if (time.current) {
        time.current.textContent = elapseTime
      }
    })

    return () => {
      unsusbscribeEffect();
    }
  }, [])

  return (
    <div className='interface'>

      <div className="time">Tiempo:
        <span className='timer' ref={time}> 0.00 </span>
      </div>

      {
        phase === 'ended' && (
          <div className="restart" onClick={restart}>¿ Reiniciar ?</div>
        )
      }


      <div className="controls">
        <div className="raw">
          <div className={`key ${forward ? 'active' : ''}`}></div>
        </div>
        <div className="raw">
          <div className={`key ${leftward ? 'active' : ''}`}></div>
          <div className={`key ${backward ? 'active' : ''}`}></div>
          <div className={`key ${rightward ? 'active' : ''}`}></div>
        </div>
        <div className="raw">
          <div className={`key large ${jump ? 'active' : ''}`}></div>
        </div>
      </div>

    </div>
  )
}
