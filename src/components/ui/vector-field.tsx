import { useEffect, useRef } from "react"

/**
 * VectorField
 *
 * A full-bleed canvas background: hundreds of particles flowing along a
 * smoothly-varying vector field driven by value noise. Looks like wind
 * currents on water. Zero dependencies — just the Canvas 2D API.
 */

export type VectorFieldProps = {
  /** RGB triplet (space-separated) for the particle color. Default white. */
  color?: string
  /** Particle count. Higher = denser but heavier. Default 250. */
  particleCount?: number
  /** Field flow speed multiplier. Default 1. */
  speed?: number
  /** Trail length (0–1). Higher = longer fading streaks. Default 0.06. */
  trail?: number
  /** Allow transparent background so underlying images show through. */
  transparentBg?: boolean
  className?: string
}

// Cheap 2D value noise — smooth, deterministic, no deps.
function makeNoise(seed = 1) {
  const hash = (x: number, y: number) => {
    let h = Math.sin(x * 127.1 + y * 311.7 + seed * 53.3) * 43758.5453
    return h - Math.floor(h)
  }
  const smooth = (t: number) => t * t * (3 - 2 * t)
  return (x: number, y: number) => {
    const x0 = Math.floor(x)
    const y0 = Math.floor(y)
    const fx = smooth(x - x0)
    const fy = smooth(y - y0)
    const v00 = hash(x0, y0)
    const v10 = hash(x0 + 1, y0)
    const v01 = hash(x0, y0 + 1)
    const v11 = hash(x0 + 1, y0 + 1)
    const vx0 = v00 + (v10 - v00) * fx
    const vx1 = v01 + (v11 - v01) * fx
    return vx0 + (vx1 - vx0) * fy
  }
}

type Particle = { x: number; y: number; vx: number; vy: number; life: number }

export function VectorField({
  color = "220 225 255",
  particleCount = 240,
  speed = 1.0,
  trail = 0.08,
  transparentBg = false,
  className,
}: VectorFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const noise = makeNoise(Math.random() * 1000)
    let width = 0
    let height = 0
    let particles: Particle[] = []
    let raf = 0
    let running = true

    const initParticle = (p: Particle) => {
      p.x = Math.random() * width
      p.y = Math.random() * height
      p.vx = 0
      p.vy = 0
      p.life = Math.random() * 200
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (particles.length !== particleCount) {
        particles = Array.from({ length: particleCount }, () => ({
          x: 0,
          y: 0,
          vx: 0,
          vy: 0,
          life: 0,
        }))
      }
      particles.forEach(initParticle)
      if (!transparentBg) {
        ctx.fillStyle = "#000000"
        ctx.fillRect(0, 0, width, height)
      } else {
        ctx.clearRect(0, 0, width, height)
      }
    }

    const SCALE = 0.0025

    const step = () => {
      if (!running) return
      if (transparentBg) {
        ctx.fillStyle = `rgba(10, 10, 18, ${trail * 1.5})`
        ctx.fillRect(0, 0, width, height)
      } else {
        ctx.fillStyle = `rgba(0, 0, 0, ${trail})`
        ctx.fillRect(0, 0, width, height)
      }

      ctx.strokeStyle = `rgb(${color})`
      ctx.lineWidth = 1.2
      ctx.globalAlpha = 0.85

      for (const p of particles) {
        const angle = noise(p.x * SCALE, p.y * SCALE) * Math.PI * 4
        const tvx = Math.cos(angle) * speed
        const tvy = Math.sin(angle) * speed
        p.vx += (tvx - p.vx) * 0.1
        p.vy += (tvy - p.vy) * 0.1

        const px = p.x
        const py = p.y
        p.x += p.vx
        p.y += p.vy
        p.life++

        ctx.beginPath()
        ctx.moveTo(px, py)
        ctx.lineTo(p.x, p.y)
        ctx.stroke()

        if (
          p.x < 0 || p.x > width ||
          p.y < 0 || p.y > height ||
          p.life > 300
        ) {
          initParticle(p)
        }
      }

      ctx.globalAlpha = 1
      raf = requestAnimationFrame(step)
    }

    resize()
    step()
    window.addEventListener("resize", resize)

    const io = new IntersectionObserver(
      ([entry]) => {
        running = entry.isIntersecting
        if (running && raf === 0) raf = requestAnimationFrame(step)
      },
      { threshold: 0 },
    )
    io.observe(canvas)

    return () => {
      running = false
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener("resize", resize)
      io.disconnect()
    }
  }, [color, particleCount, speed, trail, transparentBg])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block", width: "100%", height: "100%" }}
      aria-hidden="true"
    />
  )
}
