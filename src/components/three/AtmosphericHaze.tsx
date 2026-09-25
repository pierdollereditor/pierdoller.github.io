"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT_DESKTOP = 70;
const PARTICLE_COUNT_MOBILE = 28;

const MIST_VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const MIST_FRAGMENT_SHADER = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColor;
  uniform vec3 uAccent;
  uniform float uOpacity;
  varying vec2 vUv;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
    for (int i = 0; i < 3; ++i) {
      v += a * noise(p);
      p = rot * p * 2.05 + vec2(17.2, 34.5);
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    vec2 d = uv - vec2(0.5);
    float dist = length(d * vec2(1.0, 1.55));
    float mask = smoothstep(0.5, 0.06, dist);

    vec2 p1 = uv * 3.4 + vec2(uTime * 0.024, -uTime * 0.012);
    vec2 p2 = uv * 5.2 - vec2(uTime * 0.018, uTime * 0.021);

    float n1 = fbm(p1);
    float n2 = fbm(p2);
    float smoke = smoothstep(0.18, 0.74, n1 * 0.62 + n2 * 0.38);

    float alpha = smoke * mask * uOpacity;
    vec3 col = mix(uColor, uAccent, n2 * 0.42 + 0.12);

    gl_FragColor = vec4(col, alpha);
  }
`;

function createSoftParticleTexture() {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.25, "rgba(255, 255, 255, 0.65)");
    gradient.addColorStop(0.65, "rgba(255, 255, 255, 0.18)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export default function AtmosphericHaze({
  fogColor,
  accentColor,
  isMobile = false,
}: {
  fogColor: string;
  accentColor: string;
  isMobile?: boolean;
}) {
  const floorMatRef = useRef<THREE.ShaderMaterial>(null);
  const backMatRef = useRef<THREE.ShaderMaterial>(null);
  const particlesRef = useRef<THREE.Points>(null);

  const particleTexture = useMemo(() => createSoftParticleTexture(), []);

  useEffect(() => {
    return () => {
      particleTexture?.dispose();
    };
  }, [particleTexture]);

  const particleCount = isMobile ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT_DESKTOP;

  const [particlePositions, particleVelocities] = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 58;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 22;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 64 + 6;

      velocities[i * 3 + 0] = (Math.random() - 0.5) * 0.28;
      velocities[i * 3 + 1] = Math.random() * 0.42 + 0.14;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.22;
    }
    return [positions, velocities];
  }, [particleCount]);

  const particleGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    return geo;
  }, [particlePositions]);

  useEffect(() => {
    return () => {
      particleGeometry.dispose();
    };
  }, [particleGeometry]);

  const floorUniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor: { value: new THREE.Color(fogColor) },
    uAccent: { value: new THREE.Color(accentColor) },
    uOpacity: { value: isMobile ? 0.35 : 0.52 },
  }), [accentColor, fogColor, isMobile]);

  const backUniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor: { value: new THREE.Color(fogColor) },
    uAccent: { value: new THREE.Color(accentColor) },
    uOpacity: { value: isMobile ? 0.28 : 0.46 },
  }), [accentColor, fogColor, isMobile]);

  useFrame((_, delta) => {
    const clampedDelta = Math.min(delta, 0.05);

    if (floorMatRef.current) {
      floorMatRef.current.uniforms.uTime.value += clampedDelta;
      floorMatRef.current.uniforms.uColor.value.set(fogColor);
      floorMatRef.current.uniforms.uAccent.value.set(accentColor);
    }
    if (backMatRef.current) {
      backMatRef.current.uniforms.uTime.value += clampedDelta * 0.8;
      backMatRef.current.uniforms.uColor.value.set(fogColor);
      backMatRef.current.uniforms.uAccent.value.set(accentColor);
    }

    if (particlesRef.current) {
      const posAttr = particlesRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const array = posAttr.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        array[i * 3 + 1] += particleVelocities[i * 3 + 1] * clampedDelta;
        array[i * 3 + 0] += Math.sin(array[i * 3 + 1] * 0.35 + i) * clampedDelta * 0.4;

        if (array[i * 3 + 1] > 11) {
          array[i * 3 + 1] = -11;
          array[i * 3 + 0] = (Math.random() - 0.5) * 58;
          array[i * 3 + 2] = (Math.random() - 0.5) * 64 + 6;
        }
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Floor / Ground mist plane */}
      <mesh position={[0, -5.2, 6]} rotation={[-Math.PI * 0.44, 0, 0]} scale={[64, 42, 1]}>
        <planeGeometry args={[1, 1, 16, 16]} />
        <shaderMaterial
          ref={floorMatRef}
          vertexShader={MIST_VERTEX_SHADER}
          fragmentShader={MIST_FRAGMENT_SHADER}
          uniforms={floorUniforms}
          transparent
          depthWrite={false}
          blending={THREE.NormalBlending}
          toneMapped={false}
        />
      </mesh>

      {/* Backdrop mist plane */}
      <mesh position={[0, -0.5, -16]} rotation={[0, 0, 0]} scale={[82, 54, 1]}>
        <planeGeometry args={[1, 1, 16, 16]} />
        <shaderMaterial
          ref={backMatRef}
          vertexShader={MIST_VERTEX_SHADER}
          fragmentShader={MIST_FRAGMENT_SHADER}
          uniforms={backUniforms}
          transparent
          depthWrite={false}
          blending={THREE.NormalBlending}
          toneMapped={false}
        />
      </mesh>

      {/* Atmospheric floating dust / haze particles */}
      {particleTexture && (
        <points ref={particlesRef} geometry={particleGeometry}>
          <pointsMaterial
            size={isMobile ? 0.9 : 1.3}
            map={particleTexture}
            transparent
            opacity={isMobile ? 0.28 : 0.42}
            color={new THREE.Color(accentColor).lerp(new THREE.Color("#ffffff"), 0.55)}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>
      )}
    </group>
  );
}
