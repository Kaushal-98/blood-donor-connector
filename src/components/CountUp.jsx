import { useEffect, useState, useRef } from 'react'
import { useInView } from 'framer-motion'

function CountUp({ end, suffix = '', duration = 1500 }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return
    let start = 0
    const stepTime = Math.max(Math.floor(duration / end), 10)
    const timer = setInterval(() => {
      start += 1
      setCount(start)
      if (start >= end) clearInterval(timer)
    }, stepTime)
    return () => clearInterval(timer)
  }, [isInView, end, duration])

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  )
}

export default CountUp