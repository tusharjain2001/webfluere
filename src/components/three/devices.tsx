import { useEffect, useMemo, type Ref } from 'react'
import * as THREE from 'three'
import { useLoader, useThree, type ThreeElements } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'

type GroupProps = ThreeElements['group']
type MaterialRef = Ref<THREE.MeshStandardMaterial>

// Shells carry no light of their own: with no ambient or environment fill they read only where the raking light catches them.
const SHELL = { color: '#121826', metalness: 0.85, roughness: 0.42 } as const
const BEZEL = { color: '#04060b', metalness: 0.3, roughness: 0.25 } as const

export function roundedShape(w: number, h: number, r: number) {
  const x = -w / 2
  const y = -h / 2
  const s = new THREE.Shape()
  s.moveTo(x + r, y)
  s.lineTo(x + w - r, y)
  s.quadraticCurveTo(x + w, y, x + w, y + r)
  s.lineTo(x + w, y + h - r)
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  s.lineTo(x + r, y + h)
  s.quadraticCurveTo(x, y + h, x, y + h - r)
  s.lineTo(x, y + r)
  s.quadraticCurveTo(x, y, x + r, y)
  return s
}

/** Flat rounded rectangle with 0-1 UVs across its bounds, so a screenshot maps edge to edge. */
export function roundedPlane(w: number, h: number, r: number) {
  const geometry = new THREE.ShapeGeometry(roundedShape(w, h, r), 12)
  const pos = geometry.attributes.position
  const uv = geometry.attributes.uv
  for (let i = 0; i < uv.count; i++) uv.setXY(i, pos.getX(i) / w + 0.5, pos.getY(i) / h + 0.5)
  return geometry
}

// Screens load as ImageBitmaps: the browser decodes them off the main thread, so uploading them to the GPU
// doesn't freeze the page the way decoding a plain <img> during upload does.
/** Starts downloading and decoding a screen image before any component asks for it. */
export const preloadScreen = (url: string) => useLoader.preload(THREE.ImageBitmapLoader, url)

const screenTextures = new WeakMap<ImageBitmap, THREE.Texture>()

function useScreenTexture(url: string) {
  const bitmap = useLoader(THREE.ImageBitmapLoader, url)
  const gl = useThree((state) => state.gl)
  // One texture per image, so a screenshot used by two devices is only uploaded once.
  let texture = screenTextures.get(bitmap)
  if (!texture) {
    texture = new THREE.Texture(bitmap)
    // Bitmaps ignore WebGL's flip-on-upload, so the flip happens in the UV transform instead (works in every browser).
    texture.flipY = false
    texture.repeat.set(1, -1)
    texture.offset.set(0, 1)
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy())
    texture.needsUpdate = true
    screenTextures.set(bitmap, texture)
  }
  useEffect(() => {
    // Upload while the browser is idle, so screens that first appear mid-scroll don't stutter.
    const idle = window.requestIdleCallback ?? ((fn: () => void) => window.setTimeout(fn, 200))
    idle(() => gl.initTexture(texture))
  }, [texture, gl])
  return texture
}

/** A screen surface. Its emissive intensity is the burnish: the scene raises it to surface a screen from the dark. */
function ScreenPlane({
  url,
  width,
  height,
  radius,
  materialRef,
  layered = false,
}: {
  url: string
  width: number
  height: number
  radius: number
  materialRef: MaterialRef
  layered?: boolean
}) {
  const texture = useScreenTexture(url)
  const geometry = useMemo(() => roundedPlane(width, height, radius), [width, height, radius])
  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial
        ref={materialRef}
        map={texture}
        emissiveMap={texture}
        emissive="#ffffff"
        emissiveIntensity={0}
        roughness={0.62}
        metalness={0}
        transparent={layered}
        depthWrite={!layered}
      />
    </mesh>
  )
}

/** Laptop whose screen is a stack of layers (sketch, design, build) that the scene can pull apart. */
export function Laptop({
  screens,
  lidRef,
  layerRefs,
  layerMaterialRefs,
  ...props
}: GroupProps & {
  screens: readonly string[]
  lidRef: Ref<THREE.Group>
  layerRefs: readonly Ref<THREE.Group>[]
  layerMaterialRefs: readonly MaterialRef[]
}) {
  return (
    <group {...props}>
      <RoundedBox args={[3.3, 0.11, 2.25]} radius={0.05} smoothness={4}>
        <meshStandardMaterial {...SHELL} />
      </RoundedBox>
      <mesh position={[0, 0.057, -0.2]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[2.9, 1.15]} />
        <meshStandardMaterial color="#0a0e18" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.057, 0.72]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[1.15, 0.55]} />
        <meshStandardMaterial color="#161d2c" metalness={0.5} roughness={0.45} />
      </mesh>
      <group ref={lidRef} position={[0, 0.05, -1.1]} rotation-x={-0.26}>
        <RoundedBox args={[3.3, 2.15, 0.07]} radius={0.03} smoothness={4} position={[0, 1.075, 0]}>
          <meshStandardMaterial {...SHELL} />
        </RoundedBox>
        <mesh position={[0, 1.075, 0.037]}>
          <planeGeometry args={[3.2, 2.05]} />
          <meshStandardMaterial {...BEZEL} />
        </mesh>
        {screens.map((url, i) => (
          <group key={url} ref={layerRefs[i]} position={[0, 1.1, 0.04 + i * 0.004]}>
            <ScreenPlane url={url} width={3.04} height={1.9} radius={0.02} materialRef={layerMaterialRefs[i]} layered />
          </group>
        ))}
      </group>
    </group>
  )
}

const HANDHELD = {
  phone: { body: [0.88, 1.88, 0.15], screen: [0.8, 1.73, 0.11] },
  tablet: { body: [1.52, 2.14, 0.1], screen: [1.4, 2.015, 0.05] },
} as const

export function Handheld({
  kind,
  url,
  materialRef,
  ...props
}: GroupProps & { kind: keyof typeof HANDHELD; url: string; materialRef: MaterialRef }) {
  const spec = HANDHELD[kind]
  const body = useMemo(() => {
    const geometry = new THREE.ExtrudeGeometry(roundedShape(spec.body[0], spec.body[1], spec.body[2]), {
      depth: 0.05,
      bevelEnabled: true,
      bevelThickness: 0.025,
      bevelSize: 0.025,
      bevelSegments: 5,
      curveSegments: 20,
    })
    geometry.center()
    return geometry
  }, [spec])
  const bezel = useMemo(() => roundedPlane(spec.body[0] - 0.01, spec.body[1] - 0.01, spec.body[2] - 0.01), [spec])

  return (
    <group {...props}>
      <mesh geometry={body}>
        <meshStandardMaterial {...SHELL} />
      </mesh>
      <mesh geometry={bezel} position-z={0.051}>
        <meshStandardMaterial {...BEZEL} />
      </mesh>
      <group position-z={0.053}>
        <ScreenPlane url={url} width={spec.screen[0]} height={spec.screen[1]} radius={spec.screen[2]} materialRef={materialRef} />
      </group>
    </group>
  )
}

export function BrowserWindow({ url, materialRef, ...props }: GroupProps & { url: string; materialRef: MaterialRef }) {
  const body = useMemo(() => roundedPlane(2.6, 1.86, 0.06), [])
  return (
    <group {...props}>
      <mesh geometry={body}>
        <meshStandardMaterial color="#0f1422" metalness={0.6} roughness={0.4} />
      </mesh>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[-1.14 + i * 0.09, 0.84, 0.002]}>
          <circleGeometry args={[0.022, 16]} />
          <meshStandardMaterial color="#2b3650" roughness={0.6} />
        </mesh>
      ))}
      <group position={[0, -0.08, 0.003]}>
        <ScreenPlane url={url} width={2.48} height={1.55} radius={0.03} materialRef={materialRef} />
      </group>
    </group>
  )
}

/** A framed plate for the concept ring. */
export function RingPanel({
  url,
  width,
  height,
  materialRef,
  ...props
}: GroupProps & { url: string; width: number; height: number; materialRef: MaterialRef }) {
  const frame = useMemo(() => roundedPlane(width + 0.1, height + 0.1, 0.05), [width, height])
  return (
    <group {...props}>
      <mesh geometry={frame}>
        <meshStandardMaterial color="#0e1424" metalness={0.6} roughness={0.4} />
      </mesh>
      <group position-z={0.004}>
        <ScreenPlane url={url} width={width} height={height} radius={0.03} materialRef={materialRef} />
      </group>
    </group>
  )
}
