import './game-timer.css';
import React, { useState, useEffect, useRef } from 'react';

function GameTimer ({duration, handleTimeUp} : {duration: number, handleTimeUp: () => void}) {

    const [progressStart, setprogressStart] = useState<boolean>(false)
    const [counter, setCounter] = useState<number>(0.0)
    const [progressLoaded, setProgressLoaded] = useState<number>(0.0)
    const intervalRef: React.RefObject<NodeJS.Timeout | undefined> = useRef(undefined)

    useEffect(() => {
      setprogressStart(false)
      intervalRef.current = setInterval(() => {
        setCounter((cur) => (cur + 0.1))
      }, 100)

      setTimeout(() => {
        setprogressStart(true)
      }, 50)

      return () => clearInterval(intervalRef.current)
    }, [])

    useEffect(() => {
      setProgressLoaded(100.0 * ((Math.min(counter + 1, duration) / duration)))

      if (counter >= duration) {
        clearInterval(intervalRef.current)
        handleTimeUp()
      }
    }, [counter])

    return (
      <div className="w-full h-3">
        <div style={{
          width: `${(progressStart) ? progressLoaded : 0}%`,
          backgroundColor: `${
            (progressLoaded < 50) ? "lightgreen"
            : (progressLoaded < 75) ? "orange"
            : "red"
          }`
        }} 
        className={`h-3 progress`}></div>
      </div>
    )
}

export default GameTimer