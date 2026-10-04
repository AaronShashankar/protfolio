import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const K = [
  { x: 0.42, y: 0.02, z: 0, s: 1.15, str: 0.38, hue: 0, spin: 0.12 },
  { x: 0, y: 0.55, z: -2.2, s: 0.8, str: 0.6, hue: 0.3, spin: 0.25 },
  { x: 0.5, y: 0, z: 0, s: 1.05, str: 0.95, hue: 0.55, spin: 0.3 },
  { x: 0, y: 0, z: -0.5, s: 0.55, str: 0.25, hue: 0.8, spin: 0.5 },
  { x: 0, y: -0.05, z: 0.5, s: 1.35, str: 0.18, hue: 1, spin: 0.1 }
];

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (t) => t * t * (3 - 2 * t);

const VERT = `
  uniform float uTime;
  uniform float uStrength;
  uniform float uPulse;
  varying vec3 vView;
  varying vec3 vPos;
  void main(){
    vec3 p = position;
    float t = uTime;
    float d = sin(p.x * 2.1 + t * 1.1) * sin(p.y * 2.4 + t * 0.9) * sin(p.z * 2.7 + t * 1.3);
    d += 0.5 * sin(p.x * 5.0 - t * 1.7 + p.y * 3.0) * sin(p.z * 4.0 + t);
    p += normal * d * (uStrength + uPulse * 0.7);
    vPos = p;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vView = mv.xyz;
    gl_Position = projectionMatrix * mv;
  }
`;

const FRAG = `
  uniform vec3 uBase;
  uniform vec3 uA;
  uniform vec3 uB;
  uniform vec3 uC;
  uniform float uHue;
  uniform float uTime;
  varying vec3 vView;
  varying vec3 vPos;
  void main(){
    vec3 n = normalize(cross(dFdx(vView), dFdy(vView)));
    vec3 v = normalize(-vView);
    float facing = abs(dot(n, v));
    float rim = pow(1.0 - facing, 2.2);
    float lit = dot(n, normalize(vec3(0.4, 0.7, 0.6))) * 0.5 + 0.5;
    float m = sin(vPos.y * 1.8 + vPos.x * 1.2 + uHue * 6.2831 + uTime * 0.4) * 0.5 + 0.5;
    vec3 col = mix(uBase, mix(uA, uB, m), lit * 0.75 + 0.1);
    col += uC * rim * 1.1;
    col = mix(col, uC, smoothstep(0.85, 1.0, lit) * 0.25);
    gl_FragColor = vec4(col, 1.0);
  }
`;

const WIRE_FRAG = `
  uniform vec3 uInk;
  void main(){
    gl_FragColor = vec4(uInk, 0.22);
  }
`;

export default function Background3D({ pointerRef, scrollRef, theme }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer, scene, camera;
    let pivot, obj, points, partMat, ringA, ringB;
    let spinY = 0;
    let animationFrameId;

    const getCSSColor = (prop) => {
      const val = getComputedStyle(document.documentElement).getPropertyValue(prop).trim();
      return val || '#EEEAFF';
    };

    const U = {
      uTime: { value: 0 },
      uStrength: { value: 0.38 },
      uHue: { value: 0 },
      uPulse: { value: 0 },
      uBase: { value: new THREE.Color(getCSSColor('--bg2')) },
      uA: { value: new THREE.Color(getCSSColor('--pink')) },
      uB: { value: new THREE.Color(getCSSColor('--cyan')) },
      uC: { value: new THREE.Color(getCSSColor('--violet')) },
      uInk: { value: new THREE.Color(getCSSColor('--ink')) }
    };

    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
      camera.position.z = 6;

      const geo = new THREE.IcosahedronGeometry(1.5, 8);
      const solid = new THREE.Mesh(
        geo,
        new THREE.ShaderMaterial({
          uniforms: U,
          vertexShader: VERT,
          fragmentShader: FRAG,
          extensions: { derivatives: true },
          polygonOffset: true,
          polygonOffsetFactor: 1,
          polygonOffsetUnits: 1
        })
      );
      const wire = new THREE.Mesh(
        geo,
        new THREE.ShaderMaterial({
          uniforms: U,
          vertexShader: VERT,
          fragmentShader: WIRE_FRAG,
          wireframe: true,
          transparent: true,
          depthWrite: false
        })
      );

      obj = new THREE.Group();
      obj.add(solid, wire);

      ringA = new THREE.Mesh(
        new THREE.TorusGeometry(2.35, 0.012, 8, 220),
        new THREE.MeshBasicMaterial({ color: new THREE.Color(getCSSColor('--pink')), transparent: true, opacity: 0.8 })
      );
      ringB = new THREE.Mesh(
        new THREE.TorusGeometry(2.8, 0.008, 8, 220),
        new THREE.MeshBasicMaterial({ color: new THREE.Color(getCSSColor('--cyan')), transparent: true, opacity: 0.55 })
      );
      ringA.rotation.x = Math.PI / 2.4;
      ringB.rotation.set(Math.PI / 2.1, 0.5, 0);

      pivot = new THREE.Group();
      pivot.add(obj, ringA, ringB);
      scene.add(pivot);

      // Starfield / ambient particle field
      const N = 1400;
      const pos = new Float32Array(N * 3);
      for (let i = 0; i < N; i++) {
        const r = 3.2 + Math.random() * 8;
        const th = Math.random() * 6.2832;
        const ph = Math.acos(2 * Math.random() - 1);
        pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
        pos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
        pos[i * 3 + 2] = r * Math.cos(ph) - 2;
      }
      const pg = new THREE.BufferGeometry();
      pg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      partMat = new THREE.PointsMaterial({
        color: new THREE.Color(getCSSColor('--ink')),
        size: 0.03,
        transparent: true,
        opacity: 0.75,
        depthWrite: false
      });
      points = new THREE.Points(pg, partMat);
      scene.add(points);

      const applyThemeColors = () => {
        U.uBase.value.set(getCSSColor('--bg2'));
        U.uA.value.set(getCSSColor('--pink'));
        U.uB.value.set(getCSSColor('--cyan'));
        U.uC.value.set(getCSSColor('--violet'));
        U.uInk.value.set(getCSSColor('--ink'));
        if (partMat) partMat.color.set(getCSSColor('--ink'));
        if (ringA) ringA.material.color.set(getCSSColor('--pink'));
        if (ringB) ringB.material.color.set(getCSSColor('--cyan'));
      };

      applyThemeColors();

      const observer = new MutationObserver(applyThemeColors);
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] });

      const handleResize = () => {
        if (!renderer || !camera) return;
        renderer.setSize(window.innerWidth, window.innerHeight, false);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
      };
      handleResize();
      window.addEventListener('resize', handleResize);

      const handlePointerDown = () => {
        U.uPulse.value = 1.0;
      };
      window.addEventListener('pointerdown', handlePointerDown);

      let lastTime = performance.now();
      let T = 0;

      const sampleKeyframe = (sy) => {
        const vh = window.innerHeight;
        const sections = document.querySelectorAll('[data-sec]');
        const tops = Array.from(sections).map((s) => s.getBoundingClientRect().top + window.scrollY);
        const out = Object.assign({}, K[0]);

        for (let i = 1; i < K.length; i++) {
          const top = tops[i] || i * vh;
          const w = smooth(clamp((sy - (top - vh)) / vh, 0, 1));
          for (const k in out) {
            out[k] = lerp(out[k], K[i][k], w);
          }
        }
        return out;
      };

      const animate = (now) => {
        animationFrameId = requestAnimationFrame(animate);

        const dt = Math.min(0.05, (now - lastTime) / 1000);
        lastTime = now;
        T += dt;

        const smoothY = scrollRef?.current?.smoothY ?? window.scrollY;
        const mxs = pointerRef?.current?.mxs ?? 0;
        const mys = pointerRef?.current?.mys ?? 0;

        const cs = sampleKeyframe(smoothY);
        const aspect = window.innerWidth / window.innerHeight;
        const mobile = aspect < 0.85;
        const halfH = Math.tan((22.5 * Math.PI) / 180) * camera.position.z;
        const halfW = halfH * aspect;
        const tx = cs.x * halfW * (mobile ? 0.2 : 1);
        const ty = cs.y * halfH + (mobile ? halfH * 0.28 * (1 - clamp(smoothY / window.innerHeight, 0, 1)) : 0);
        const sc = cs.s * (mobile ? 0.78 : 1);

        pivot.position.set(tx, ty, cs.z);
        pivot.scale.setScalar(sc);
        pivot.rotation.y = mxs * 0.35;
        pivot.rotation.x = mys * 0.25;

        spinY += dt * cs.spin;
        obj.rotation.y = spinY;
        obj.rotation.x = Math.sin(T * 0.3) * 0.25 + smoothY * 0.0004;
        ringA.rotation.z = T * 0.2;
        ringB.rotation.z = -T * 0.14;

        U.uTime.value = T;
        U.uStrength.value = lerp(U.uStrength.value, cs.str, 0.08);
        U.uHue.value = cs.hue;
        U.uPulse.value *= 0.94;

        points.rotation.y = T * 0.02 + smoothY * 0.0003;
        points.rotation.x = smoothY * 0.0002;
        camera.position.x = mxs * 0.4;
        camera.position.y = -mys * 0.25;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
      };

      animationFrameId = requestAnimationFrame(animate);

      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('pointerdown', handlePointerDown);
        observer.disconnect();
        cancelAnimationFrame(animationFrameId);
        renderer.dispose();
      };
    } catch (e) {
      console.error('WebGL error:', e);
    }
  }, [pointerRef, scrollRef, theme]);

  return (
    <canvas
      ref={canvasRef}
      id="gl"
      aria-hidden="true"
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}
