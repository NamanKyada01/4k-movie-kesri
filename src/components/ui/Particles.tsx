"use client";

import { useEffect, useRef } from 'react';
import { Renderer, Camera, Geometry, Program, Mesh } from 'ogl';

interface ParticlesProps {
  particleColors?: string[];
  particleCount?: number;
  particleSpread?: number;
  speed?: number;
  particleBaseSize?: number;
  moveParticlesOnHover?: boolean;
  alphaParticles?: boolean;
  disableRotation?: boolean;
  pixelRatio?: number;
}

const defaultColors = ['#E8550A', '#FFB800', '#ffffff'];

const vertex = /* glsl */ `
  attribute vec3 position;
  attribute vec4 random;

  uniform mat4 modelMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 projectionMatrix;
  uniform float uTime;
  uniform float uSpread;
  uniform float uBaseSize;
  uniform float uPixelRatio;

  varying vec4 vRandom;

  void main() {
    vRandom = random;
    
    vec3 pos = position;
    pos.x += sin(uTime * random.z) * uSpread;
    pos.y += cos(uTime * random.w) * uSpread;
    pos.z += sin(uTime * random.x) * uSpread;

    vec4 mvPosition = viewMatrix * modelMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = (uBaseSize * random.y * uPixelRatio) / length(mvPosition.xyz);
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  varying vec4 vRandom;

  void main() {
    vec2 circle = gl_PointCoord * 2.0 - 1.0;
    if (dot(circle, circle) > 1.0) discard;
    gl_FragColor = vec4(vRandom.rgb, 1.0);
  }
`;

export const Particles = ({
  particleColors = defaultColors,
  particleCount = 60,
  particleSpread = 10,
  speed = 0.05,
  particleBaseSize = 100,
  pixelRatio = 1,
}: ParticlesProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({ dpr: pixelRatio, alpha: true });
    const gl = renderer.gl;
    container.appendChild(gl.canvas);

    const camera = new Camera(gl, { fov: 35 });
    camera.position.z = 15;

    function resize() {
      if (!container) return;
      renderer.setSize(container.offsetWidth, container.offsetHeight);
      camera.perspective({ aspect: gl.canvas.width / gl.canvas.height });
    }
    window.addEventListener('resize', resize);
    resize();

    const position = new Float32Array(particleCount * 3);
    const random = new Float32Array(particleCount * 4);

    for (let i = 0; i < particleCount; i++) {
      position.set([Math.random() * 10 - 5, Math.random() * 10 - 5, Math.random() * 10 - 5], i * 3);
      const color = particleColors[Math.floor(Math.random() * particleColors.length)];
      const c = color.startsWith('#') ? hexToRgb(color) : [1, 1, 1];
      random.set([c[0], c[1], c[2], Math.random()], i * 4);
    }

    const geometry = new Geometry(gl, {
      position: { size: 3, data: position },
      random: { size: 4, data: random },
    });

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uSpread: { value: particleSpread },
        uBaseSize: { value: particleBaseSize },
        uPixelRatio: { value: pixelRatio },
      },
      transparent: true,
      depthTest: false,
    });

    const mesh = new Mesh(gl, { mode: gl.POINTS, geometry, program });

    let request: number;
    function update(t: number) {
      request = requestAnimationFrame(update);
      program.uniforms.uTime.value = t * 0.001 * speed;
      renderer.render({ scene: mesh, camera });
    }
    request = requestAnimationFrame(update);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(request);
      gl.canvas.remove();
    };
  }, [particleColors, particleCount, particleSpread, speed, particleBaseSize, pixelRatio]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
};

function hexToRgb(hex: string) {
  const bigint = parseInt(hex.slice(1), 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255].map((x) => x / 255);
}

export default Particles;
