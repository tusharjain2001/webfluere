import { createRef, Suspense, useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useReducedMotion } from 'framer-motion'
import { BrowserWindow, Handheld, Laptop, preloadScreen, RingPanel } from '@/components/three/devices'
import { clamp01 } from '@/lib/motion'
import { chapterEnter, chapterExit, chapterProgress } from '@/lib/scroll-chapters'
import { concepts } from '@/lib/site'
import { cn } from '@/lib/utils'

// Every device shows a different concept, so the stage never repeats one site across its screens.
// Laptop: Marrow (sketch, design, build). Tablet: Aurel. Phones: Tidewell, Luma, Kiln & Crumb. Browser: Fieldnote.
const TEX = {
  sketch: '/work/tex/marrow-sketch.webp',
  design: '/work/plate/marrow.webp',
  build: '/work/tex/marrow.webp',
  tablet: '/work/tex/aurel-tablet.webp',
  phoneKiln: '/work/tex/kiln-phone.webp',
  tidewell: '/work/tex/tidewell.webp',
  luma: '/work/tex/luma.webp',
  fieldnote: '/work/tex/fieldnote.webp',
}
const RING = concepts.map((c) => ({ url: `/work/tex/${c.slug}.webp`, phone: c.phone }))
// Everything starts downloading as soon as this chunk loads, but only the hero's screens hold up the first frame (see Stage).
;[...Object.values(TEX), ...RING.map((r) => r.url)].forEach(preloadScreen)

type V3 = [number, number, number]
type DevicePose = { p: V3; r: V3; s: number; glow: number }
const DEVICE_IDS = ['laptop', 'browser', 'phoneA', 'phoneB', 'tablet', 'phoneK'] as const
type DeviceId = (typeof DEVICE_IDS)[number]
type ScenePose = {
  d: Record<DeviceId, DevicePose>
  /** Laptop lid angle in radians; negative leans back. */
  lid: number
  /** Opacity of the laptop's sketch, design and build screen layers. */
  layers: V3
  layerGlow: V3
  /** Exploded-view separation of the screen layers, 0 to 1. */
  spread: number
  cam: V3
  look: V3
  ring: { y: number; turn: number; on: number }
}
type Frame = { aspect: number; wide: boolean; lightX: number }

const FOV_SCALE = 2 * Math.tan((15 * Math.PI) / 180) // camera fov is 30 degrees
const viewWidth = (distance: number, aspect: number) => FOV_SCALE * distance * aspect
const viewHeight = (distance: number) => FOV_SCALE * distance

const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const lerp3 = (a: V3, b: V3, t: number): V3 => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)]
const smooth = (t: number) => t * t * (3 - 2 * t)
const seg = (v: number, a: number, b: number) => smooth(clamp01((v - a) / (b - a)))
const within = (v: number, a: number, b: number, edge = 0.06) => seg(v, a, a + edge) * (1 - seg(v, b - edge, b))

const dev = (p: V3, r: V3, s: number, glow = 0): DevicePose => ({ p, r, s, glow })
const off = (p: V3): DevicePose => ({ p, r: [0, 0, 0], s: 0, glow: 0 })
const HOME_CAM: V3 = [0, 0, 9]
const ORIGIN: V3 = [0, 0, 0]
const RING_HIDDEN = { y: -7, turn: 0, on: 0 }
const ringRadius = (wide: boolean) => (wide ? 6.5 : 4)
/** Angle between neighbouring concept plates: a coverflow arc, so both neighbours stay in view. */
const RING_STEP = 0.52

function mixPose(a: ScenePose, b: ScenePose, t: number): ScenePose {
  if (t <= 0) return a
  if (t >= 1) return b
  const d = {} as Record<DeviceId, DevicePose>
  for (const id of DEVICE_IDS) {
    const x = a.d[id]
    const y = b.d[id]
    d[id] = { p: lerp3(x.p, y.p, t), r: lerp3(x.r, y.r, t), s: lerp(x.s, y.s, t), glow: lerp(x.glow, y.glow, t) }
  }
  return {
    d,
    lid: lerp(a.lid, b.lid, t),
    layers: lerp3(a.layers, b.layers, t),
    layerGlow: lerp3(a.layerGlow, b.layerGlow, t),
    spread: lerp(a.spread, b.spread, t),
    cam: lerp3(a.cam, b.cam, t),
    look: lerp3(a.look, b.look, t),
    ring: { y: lerp(a.ring.y, b.ring.y, t), turn: lerp(a.ring.turn, b.ring.turn, t), on: lerp(a.ring.on, b.ring.on, t) },
  }
}

/** First viewport: the device cluster beside the headline, each screen surfacing as the raking light passes. */
function heroPose({ aspect, wide, lightX }: Frame): ScenePose {
  const s = wide ? Math.min(0.8, viewWidth(9, aspect) / 9.6) : viewWidth(9, aspect) / 5.2
  const cx = wide ? Math.min(1.75, viewWidth(9, aspect) * 0.23) : 0
  const cy = wide ? -0.15 : viewHeight(9) * 0.25
  const ry = wide ? -0.5 : -0.3
  const cos = Math.cos(ry)
  const sin = Math.sin(ry)
  const place = (lp: V3, r: V3): DevicePose => {
    const x = cx + (lp[0] * cos + lp[2] * sin) * s
    const z = (-lp[0] * sin + lp[2] * cos) * s
    const glow = 0.05 + 0.62 * Math.exp(-((x - lightX) ** 2) / 1.2)
    return dev([x, cy + lp[1] * s, z], [0.14 + r[0], ry + r[1], r[2]], s, glow)
  }
  return {
    d: {
      laptop: place([0, -0.95, 0], [0, 0, 0]),
      browser: place([-0.7, 1.35, -1.6], [0.05, 0.18, 0]),
      phoneA: place([1.7, -0.35, 0.9], [0, -0.28, 0.06]),
      phoneB: place([-1.9, -0.55, 0.7], [0, 0.38, -0.05]),
      tablet: off([6, -1, -2]),
      phoneK: off([6, -2, 1]),
    },
    lid: -0.26,
    layers: [0, 0, 1],
    layerGlow: [1, 1, 1],
    spread: 0,
    cam: HOME_CAM,
    look: ORIGIN,
    ring: RING_HIDDEN,
  }
}

/** Story chapter, t from 0 to 3: fly into the laptop, pull the screen apart into sketch, design and build, then ship. */
function storyPose(frame: Frame, hero: ScenePose, t: number): ScenePose {
  const { aspect, wide } = frame
  const fly = seg(t, 0.1, 1.1)
  const zoom = seg(t, 0.45, 1.35)
  const explode = seg(t, 1.5, 1.85)
  const collapse = seg(t, 2.36, 2.64)

  // The laptop screen fills about 55% of the width beside the copy on wide screens, 88% above it on narrow ones.
  const distance = Math.max(4.5, 3.04 / ((wide ? 0.5 : 0.88) * FOV_SCALE * aspect))
  const sx = wide ? viewWidth(distance, aspect) * 0.17 : 0
  const sy = wide ? 0 : viewHeight(distance) * 0.16
  // Place the laptop so its screen centre stays at (sx, sy, 0) whatever its yaw.
  const laptopAt = (ry: number, glow: number): DevicePose => {
    const ox = -1.061 * Math.sin(ry)
    const oz = -1.061 * Math.cos(ry)
    return dev([sx - ox, sy - 1.15, -oz], [0, ry, 0], 1, glow)
  }

  const zoomed: ScenePose = {
    d: {
      laptop: laptopAt(0, 0.62),
      browser: off([sx - 4.5, sy + 4, -5]),
      phoneA: dev([sx + 8, sy - 5, 3], [0.4, -1.2, 0.5], 0),
      phoneB: dev([sx - 9, sy - 6, 2], [0.3, 1.1, -0.4], 0),
      tablet: hero.d.tablet,
      phoneK: hero.d.phoneK,
    },
    lid: 0,
    layers: [0, 1, 0],
    layerGlow: [1, 1, 1],
    spread: 0,
    cam: [0, 0, distance],
    look: ORIGIN,
    ring: RING_HIDDEN,
  }
  let pose = mixPose(hero, zoomed, fly)
  pose = { ...pose, cam: lerp3(hero.cam, zoomed.cam, zoom), look: lerp3(hero.look, zoomed.look, zoom) }

  const exploded: ScenePose = {
    ...zoomed,
    d: { ...zoomed.d, laptop: laptopAt(wide ? -0.62 : -0.5, 0.7) },
    layers: [1, 1, 1],
    layerGlow: [
      0.35 + 0.65 * within(t, 1.6, 1.84),
      0.35 + 0.65 * within(t, 1.84, 2.08),
      0.35 + 0.65 * within(t, 2.08, 2.34),
    ],
    spread: 1,
    cam: [0, 0.25, distance * (wide ? 1.22 : 1.3)],
    // Keep the look target at the zoomed framing's height so, on phones, the layers stay above the copy.
    look: [wide ? sx * 0.35 : 0, 0, 0.5],
  }
  pose = mixPose(pose, exploded, explode)

  const shipped: ScenePose = {
    ...zoomed,
    d: { ...zoomed.d, laptop: laptopAt(wide ? -0.16 : -0.1, 0.72) },
    layers: [0, 0, 1],
  }
  return mixPose(pose, shipped, collapse)
}

/** Services chapter, t from 0 to 5: one staged arrangement per service, blended in the last part of each step. */
function servicesPose({ aspect, wide }: Frame, t: number): ScenePose {
  const s = wide ? Math.min(0.85, viewWidth(9, aspect) / 9) : viewWidth(9, aspect) / 5.2
  const ax = wide ? viewWidth(9, aspect) * 0.19 : 0
  const ay = wide ? -0.1 : viewHeight(9) * 0.24
  const at = (dx: number, dy: number, z: number, r: V3, scale: number, glow: number) =>
    dev([ax + dx * s, ay + dy * s, z * s], r, s * scale, glow)
  const hidden = {
    tablet: off([ax + 6, ay, -2]),
    phoneK: off([ax + 6, ay - 1, 1]),
    phoneA: off([ax + 2, ay - 6, 1]),
    phoneB: off([ax - 2, ay - 6, 0]),
    browser: off([ax - 6, ay + 5, -5]),
  }
  const base = {
    lid: -0.2,
    layers: [0, 0, 1] as V3,
    layerGlow: [1, 1, 1] as V3,
    spread: 0,
    cam: HOME_CAM,
    look: ORIGIN,
    ring: RING_HIDDEN,
  }

  const steps: ((f: number) => ScenePose)[] = [
    // Websites: the laptop alone.
    (f) => ({ ...base, d: { ...hidden, laptop: at(0, -0.8, 0, [0.18, -0.45 + f * 0.2, 0], 1.05, 0.55) } }),
    // Responsive design: laptop, tablet and phone side by side.
    (f) => ({
      ...base,
      d: {
        ...hidden,
        laptop: at(-1.45, -0.85, -0.3, [0.15, -0.25, 0], 0.8, 0.45),
        tablet: at(0.8, -0.1, 0.35, [0.05, -0.35 + f * 0.1, 0], 0.78, 0.48),
        phoneK: at(1.8, -0.35, 1, [0.05, -0.45 + f * 0.1, 0], 0.8, 0.52),
      },
    }),
    // Apps: the phone comes forward and turns.
    (f) => ({
      ...base,
      d: {
        ...hidden,
        laptop: at(-1.3, -0.6, -3.2, [0.15, -0.2, 0], 0.7, 0.04),
        tablet: at(1.3, 0, -3.2, [0.05, -0.3, 0], 0.7, 0.04),
        phoneA: at(0, -0.05, 1.2, [0.05, -0.4 + f * 0.8, 0.03], 1.35, 0.62),
        phoneB: at(1.35, -0.2, -0.5, [0, -0.55, 0], 1.05, 0.18),
      },
    }),
    // SEO foundations: the page's structure, shown as the sketch layer.
    (f) => ({ ...base, layers: [1, 0, 0], d: { ...hidden, laptop: at(0, -0.8, 0, [0.2, 0.35 - f * 0.2, 0], 1.05, 0.55) } }),
    // Smooth UX: every device together, turning slowly.
    (f) => {
      const o = (f - 0.5) * 0.3
      return {
        ...base,
        d: {
          browser: hidden.browser,
          laptop: at(0, -0.9, -0.6, [0.15, -0.2 + o, 0], 0.85, 0.42),
          tablet: at(-1.75, -0.1, -1.2, [0.05, 0.35 + o, 0], 0.7, 0.26),
          phoneK: at(-0.95, -0.5, 1.1, [0.05, 0.3 + o, -0.03], 0.8, 0.46),
          phoneA: at(1.35, -0.25, 0.9, [0.05, -0.4 + o, 0.04], 0.85, 0.52),
          phoneB: at(2.1, -0.1, -0.6, [0, -0.5 + o, 0], 0.75, 0.22),
        },
      }
    },
  ]
  const step = Math.min(steps.length - 1, Math.max(0, Math.floor(t)))
  const f = clamp01(t - step)
  const current = steps[step](f)
  if (step === steps.length - 1) return current
  return mixPose(current, steps[step + 1](0), seg(f, 0.62, 1))
}

/** Work chapter, p from 0 to 1: the six concepts on a ring that turns one plate to the front at a time. */
function workPose({ wide }: Frame, p: number): ScenePose {
  const R = ringRadius(wide)
  return {
    d: {
      laptop: off([0, -7, 0]),
      browser: off([-5, 5, -5]),
      phoneA: off([3, -7, 1]),
      phoneB: off([-3, -7, 0]),
      tablet: off([5, -6, -2]),
      phoneK: off([-5, -6, 1]),
    },
    lid: -0.2,
    layers: [0, 0, 1],
    layerGlow: [1, 1, 1],
    spread: 0,
    cam: wide ? [0, 0.3, R + 5.6] : [0, 0.3, R + 9.5],
    look: wide ? [-0.6, 0.35, R * 0.55] : [0, 0, R * 0.55],
    ring: { y: 0, turn: -p * (RING.length - 1) * RING_STEP, on: 1 },
  }
}

function Stage({ staticHero, reduce }: { staticHero: boolean; reduce: boolean }) {
  const light = useRef<THREE.PointLight>(null)
  const rim = useRef<THREE.PointLight>(null)
  const laptop = useRef<THREE.Group>(null)
  const lid = useRef<THREE.Group>(null)
  const browser = useRef<THREE.Group>(null)
  const phoneA = useRef<THREE.Group>(null)
  const phoneB = useRef<THREE.Group>(null)
  const tablet = useRef<THREE.Group>(null)
  const phoneK = useRef<THREE.Group>(null)
  const ring = useRef<THREE.Group>(null)
  const browserMat = useRef<THREE.MeshStandardMaterial>(null)
  const phoneAMat = useRef<THREE.MeshStandardMaterial>(null)
  const phoneBMat = useRef<THREE.MeshStandardMaterial>(null)
  const tabletMat = useRef<THREE.MeshStandardMaterial>(null)
  const phoneKMat = useRef<THREE.MeshStandardMaterial>(null)
  const layerGroups = useMemo(() => [0, 1, 2].map(() => createRef<THREE.Group>()), [])
  const layerMats = useMemo(() => [0, 1, 2].map(() => createRef<THREE.MeshStandardMaterial>()), [])
  const ringItems = useMemo(() => RING.map(() => createRef<THREE.Group>()), [])
  const ringMats = useMemo(() => RING.map(() => createRef<THREE.MeshStandardMaterial>()), [])
  const pointer = useRef({ x: 0, active: false })
  const lookTarget = useMemo(() => new THREE.Vector3(), [])
  const gl = useThree((state) => state.gl)

  // Reveal the canvas only once the hero's devices can draw, so it fades in with them instead of empty.
  useEffect(() => {
    gl.domElement.style.opacity = '1'
  }, [gl])

  useEffect(() => {
    if (reduce) return
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      pointer.current = { x: (e.clientX / window.innerWidth) * 2 - 1, active: true }
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [reduce])

  useFrame((state) => {
    const { size, camera, clock } = state
    const time = clock.elapsedTime
    const aspect = size.width / Math.max(1, size.height)
    const wide = aspect > 1.1
    const sweep = reduce ? 0.4 : Math.sin(time * 0.32)
    const heroLightX = pointer.current.active
      ? pointer.current.x * viewWidth(9, aspect) * 0.5
      : (wide ? 1.4 : 0) + sweep * (wide ? 2.6 : 1.4)
    const frame: Frame = { aspect, wide, lightX: heroLightX }

    const hero = heroPose(frame)
    let pose = hero
    let heroWeight = 1
    if (!staticHero) {
      const tStory = chapterEnter('story') + chapterProgress('story') * 2
      heroWeight = 1 - seg(tStory, 0, 0.8)
      pose = storyPose(frame, hero, tStory)
      const servicesIn = chapterEnter('services')
      if (servicesIn > 0) pose = mixPose(pose, servicesPose(frame, chapterProgress('services') * 5), seg(servicesIn, 0.05, 0.95))
      const workIn = chapterEnter('work')
      if (workIn > 0) {
        const work = workPose(frame, chapterProgress('work'))
        pose = mixPose(pose, work, seg(workIn, 0.05, 0.95))
        const workOut = chapterExit('work')
        if (workOut > 0) pose = mixPose(pose, { ...work, ring: { ...work.ring, y: work.ring.y + 6, on: 0 } }, seg(workOut, 0, 0.9))
      }
    }

    camera.position.set(...pose.cam)
    lookTarget.set(...pose.look)
    camera.lookAt(lookTarget)

    const drift = reduce ? 0 : 0.35 + 0.65 * heroWeight
    const apply = (id: DeviceId, group: THREE.Group | null, material: THREE.MeshStandardMaterial | null, i: number) => {
      if (!group) return
      const dp = pose.d[id]
      group.visible = dp.s > 0.002
      if (!group.visible) return
      group.position.set(dp.p[0], dp.p[1] + Math.sin(time * 0.7 + i * 1.7) * 0.035 * drift * dp.s, dp.p[2])
      group.rotation.set(dp.r[0], dp.r[1] + Math.sin(time * 0.45 + i) * 0.02 * drift, dp.r[2])
      group.scale.setScalar(dp.s)
      if (material) material.emissiveIntensity = dp.glow
    }
    apply('laptop', laptop.current, null, 0)
    apply('browser', browser.current, browserMat.current, 1)
    apply('phoneA', phoneA.current, phoneAMat.current, 2)
    apply('phoneB', phoneB.current, phoneBMat.current, 3)
    apply('tablet', tablet.current, tabletMat.current, 4)
    apply('phoneK', phoneK.current, phoneKMat.current, 5)

    if (lid.current) lid.current.rotation.x = pose.lid
    layerGroups.forEach((ref, i) => {
      const group = ref.current
      const material = layerMats[i].current
      if (!group || !material) return
      group.visible = pose.layers[i] > 0.01
      // Exploded view: back layers step left and up so the sketch and design layers stay visible behind the build.
      group.position.set((i - 2) * 0.5 * pose.spread, 1.1 + (2 - i) * 0.12 * pose.spread, 0.04 + i * 0.004 + pose.spread * i * 0.55)
      material.opacity = pose.layers[i]
      material.emissiveIntensity = pose.d.laptop.glow * pose.layerGlow[i]
    })

    const ringGroup = ring.current
    if (ringGroup) {
      ringGroup.visible = pose.ring.on > 0.01
      ringGroup.position.set(0, pose.ring.y, 0)
      const R = ringRadius(wide)
      const panelScale = wide ? 1 : 0.95
      ringItems.forEach((ref, i) => {
        const group = ref.current
        const material = ringMats[i].current
        if (!group || !material) return
        const theta = i * RING_STEP + pose.ring.turn
        const facing = Math.cos(theta)
        group.visible = Math.abs(theta) < 1.6
        group.position.set(Math.sin(theta) * R, 0, Math.cos(theta) * R)
        group.rotation.set(0, theta, 0)
        group.scale.setScalar(panelScale * (0.88 + 0.14 * clamp01(facing)))
        // Only the plate facing the camera is burnished; its neighbours fall back into the dark.
        material.emissiveIntensity = pose.ring.on * (0.03 + 0.62 * seg(facing, 0.93, 1))
      })
    }

    // One raking light, the only light in the scene: it follows the mouse in the hero, then sweeps each chapter.
    if (rim.current) {
      rim.current.position.set(pose.look[0] - sweep * 3, pose.look[1] - 2.4, pose.look[2] - 4)
    }
    if (light.current) {
      light.current.position.set(
        lerp(pose.look[0] + sweep * 3, heroLightX, heroWeight),
        lerp(pose.look[1] + 2.3, 2.2, heroWeight),
        lerp(pose.look[2] + 3.6, 4.2, heroWeight),
      )
    }
  })

  return (
    <>
      <pointLight ref={light} color="#eef3ff" intensity={55} decay={2} distance={0} />
      {/* Logo-blue rim light from behind and below, so every device edge carries the brand colour. */}
      <pointLight ref={rim} color="#3b8bff" intensity={40} decay={2} distance={0} />
      <group ref={laptop}>
        <Laptop screens={[TEX.sketch, TEX.design, TEX.build]} lidRef={lid} layerRefs={layerGroups} layerMaterialRefs={layerMats} />
      </group>
      <group ref={browser}>
        <BrowserWindow url={TEX.fieldnote} materialRef={browserMat} />
      </group>
      <group ref={phoneA}>
        <Handheld kind="phone" url={TEX.tidewell} materialRef={phoneAMat} />
      </group>
      <group ref={phoneB}>
        <Handheld kind="phone" url={TEX.luma} materialRef={phoneBMat} />
      </group>
      <group ref={tablet}>
        <Handheld kind="tablet" url={TEX.tablet} materialRef={tabletMat} />
      </group>
      <group ref={phoneK}>
        <Handheld kind="phone" url={TEX.phoneKiln} materialRef={phoneKMat} />
      </group>
      {/* The concept ring is far down the page, so its screens load behind their own boundary and never delay the hero. */}
      <Suspense fallback={null}>
        <group ref={ring}>
          {RING.map((item, i) => (
            <group key={item.url} ref={ringItems[i]}>
              <RingPanel
                url={item.url}
                width={item.phone ? 0.95 : 2.6}
                height={item.phone ? 2.05 : 1.625}
                materialRef={ringMats[i]}
              />
            </group>
          ))}
        </group>
      </Suspense>
    </>
  )
}

/**
 * The page's one 3D stage. `fixed` pins it behind the whole page and drives it from the scroll
 * chapters; `hero` keeps it inside the first viewport only (used under prefers-reduced-motion).
 */
export function StoryCanvas({ mode = 'fixed' }: { mode?: 'fixed' | 'hero' }) {
  const reduce = !!useReducedMotion()
  return (
    <div aria-hidden className={cn('pointer-events-none inset-0', mode === 'fixed' ? 'fixed z-0' : 'absolute -z-10')}>
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 9], fov: 30 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        frameloop={reduce ? 'demand' : 'always'}
        onCreated={({ gl }) => {
          const canvas = gl.domElement
          // Shader compile status is only checked in development; in production the GPU compiles without blocking the page.
          gl.debug.checkShaderErrors = import.meta.env.DEV
          canvas.style.opacity = '0'
          canvas.style.transition = 'opacity 0.8s ease'
        }}
      >
        <Suspense fallback={null}>
          <Stage staticHero={mode === 'hero' || reduce} reduce={reduce} />
        </Suspense>
      </Canvas>
    </div>
  )
}
