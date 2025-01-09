import React from "react"
import { useSpring, SpringValue } from "react-spring"
import { usePrefersReducedMotion } from "@sanity/ui"

interface BoopConfig {
  x?: number
  y?: number
  rotation?: number
  scale?: number
  timing?: number
  springConfig?: {
    tension: number
    friction: number
  }
}

type BoopStyle = {
  transform: SpringValue<string>
}

function useBoop({
  x = 0,
  y = 0,
  rotation = 0,
  scale = 1,
  timing = 150,
  springConfig = {
    tension: 300,
    friction: 10,
  },
}: BoopConfig): [BoopStyle | {}, () => void] {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [isBooped, setIsBooped] = React.useState(false)

  const style = useSpring({
    transform: isBooped
      ? `translate(${x}px, ${y}px)
         rotate(${rotation}deg)
         scale(${scale})`
      : `translate(0px, 0px)
         rotate(0deg)
         scale(1)`,
    config: springConfig,
  })

  React.useEffect(() => {
    if (!isBooped) {
      return
    }
    const timeoutId = window.setTimeout(() => {
      setIsBooped(false)
    }, timing)
    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [isBooped, timing])

  const trigger = React.useCallback(() => {
    setIsBooped(true)
  }, [])

  const appliedStyle = prefersReducedMotion ? {} : style

  return [appliedStyle, trigger]
}

export default useBoop
