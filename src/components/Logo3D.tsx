import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';



// --- CUSTOM SHADER FOR PIXEL-PERFECT LOGO SECTIONS REVEAL ---
const vertexShaderCode = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShaderCode = `
  uniform sampler2D uLogoTex;
  uniform sampler2D uMask1;
  uniform sampler2D uMask2;
  uniform float uScroll;
  uniform float uTime;

  varying vec2 vUv;

  void main() {
    vec4 logoColor = texture2D(uLogoTex, vUv);
    vec4 m1 = texture2D(uMask1, vUv);
    vec4 m2 = texture2D(uMask2, vUv);

    // Center of UV space
    vec2 dir = vUv - vec2(0.5, 0.5);
    
    // Calculate angle for Outer Ring drawing (0.0 to 2.0*PI)
    float angleVal = atan(dir.y, dir.x);
    if (angleVal < 0.0) {
      angleVal += 6.2831853;
    }

    // Outer Ring (Phase 1: scroll 0 -> 1)
    float ringDrawProgress = clamp(uScroll, 0.0, 1.0);
    // Outer ring goes from 0.45 rad to 5.83 rad
    float startRad = 0.45;
    float endRad = 5.83;
    float currentRad = startRad + ringDrawProgress * (endRad - startRad);
    
    float ringMask = 0.0;
    if (m1.r > 0.1) {
      if (angleVal >= startRad && angleVal <= currentRad) {
        ringMask = m1.r;
      }
    }

    // Phase 2 (scroll 1 -> 2): Human Icon (m1.g)
    float humanVisible = clamp(uScroll - 1.0, 0.0, 1.0);
    float humanMask = m1.g * humanVisible;

    // Phase 3 (scroll 2 -> 3): Number 2 (m1.b)
    float twoVisible = clamp(uScroll - 2.0, 0.0, 1.0);
    float twoMask = m1.b * twoVisible;

    // Phase 4 (scroll 3 -> 4): F Shape (m2.r)
    float fVisible = clamp(uScroll - 3.0, 0.0, 1.0);
    float fMask = m2.r * fVisible;

    // Phase 5 (scroll 4 -> 5): Pixel Blocks (m2.g)
    float pixelsVisible = clamp(uScroll - 4.0, 0.0, 1.0);
    float pixelsMask = m2.g * pixelsVisible;

    // Phase 6 (scroll 5 -> 6): Circuit Lines (m2.b)
    float circuitsVisible = clamp(uScroll - 5.0, 0.0, 1.0);
    float circuitsMask = m2.b * circuitsVisible;

    // Sum of masks
    float totalMask = clamp(ringMask + humanMask + twoMask + fMask + pixelsMask + circuitsMask, 0.0, 1.0);

    // Glowing Sunrise energy sweep overlay during formation
    float pulse = sin(uTime * 4.0) * 0.15 + 0.85;
    vec3 glowColor = vec3(1.0, 0.55, 0.15) * pulse; // Warm sunrise glow

    // Combine
    vec3 finalRGB = logoColor.rgb;
    // Add a slight sunrise glow to elements that are actively forming
    if (uScroll < 6.0 && totalMask > 0.05) {
      finalRGB = mix(finalRGB, finalRGB + glowColor * 0.18, 0.4);
    }

    gl_FragColor = vec4(finalRGB, logoColor.a * totalMask);
  }
`;



interface SceneProps {
  scroll: number; // 0 to 9.5 representing sections
  mouse: React.MutableRefObject<{ x: number; y: number }>;
}

const LogoModel: React.FC<SceneProps> = ({ scroll, mouse }) => {
  const groupRef = useRef<THREE.Group>(null);
  const frontMaterialRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const sparkRef = useRef<THREE.Mesh>(null);
  const spotLightRef = useRef<THREE.SpotLight>(null);
  const backlightRef = useRef<THREE.Mesh>(null);

  const [isLoaded, setIsLoaded] = useState(false);
  const [logoTexture, setLogoTexture] = useState<THREE.Texture | null>(null);
  const [maskTexture1, setMaskTexture1] = useState<THREE.Texture | null>(null);
  const [maskTexture2, setMaskTexture2] = useState<THREE.Texture | null>(null);

  const particleTargetsRef = useRef<THREE.Vector3[]>([]);

  // Uniforms for custom fragment shader
  const uniformsRef = useRef({
    uLogoTex: { value: null as THREE.Texture | null },
    uMask1: { value: null as THREE.Texture | null },
    uMask2: { value: null as THREE.Texture | null },
    uScroll: { value: 0 },
    uTime: { value: 0 }
  });

  // Load logo.jpg and generate masks dynamically on mount
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // request CORS access if served from CDN or proxy
    img.src = '/images/logo.jpg';
    img.onerror = (err) => {
      console.error("Failed to load logo image /images/logo.jpg:", err);
    };
    img.onload = () => {
      try {
        const size = 512;

        // 1. Logo Canvas with clean alpha circular clip
        const logoCanvas = document.createElement('canvas');
        logoCanvas.width = size;
        logoCanvas.height = size;
        const logoCtx = logoCanvas.getContext('2d', { willReadFrequently: true })!;
        logoCtx.drawImage(img, 0, 0, size, size);
        
        const imgData = logoCtx.getImageData(0, 0, size, size);
        const logoPixels = imgData.data;

        // Apply circular clip to logoCtx for the actual medallion rendering
        logoCtx.globalCompositeOperation = 'destination-in';
        logoCtx.beginPath();
        logoCtx.arc(256, 256, 235, 0, 2 * Math.PI);
        logoCtx.fill();
        logoCtx.globalCompositeOperation = 'source-over';

        // 2. Canvas 1: R=Outer Ring, G=Human Icon, B=Number 2
        const canvas1 = document.createElement('canvas');
        canvas1.width = size;
        canvas1.height = size;
        const ctx1 = canvas1.getContext('2d', { willReadFrequently: true })!;
        const imgData1 = ctx1.createImageData(size, size);
        const data1 = imgData1.data;

        // 3. Canvas 2: R=F Shape, G=Pixel Blocks, B=Circuit Lines
        const canvas2 = document.createElement('canvas');
        canvas2.width = size;
        canvas2.height = size;
        const ctx2 = canvas2.getContext('2d', { willReadFrequently: true })!;
        const imgData2 = ctx2.createImageData(size, size);
        const data2 = imgData2.data;

        for (let y = 0; y < size; y++) {
          for (let x = 0; x < size; x++) {
            const idx = (y * size + x) * 4;
            const r = logoPixels[idx];
            const g = logoPixels[idx + 1];
            const b = logoPixels[idx + 2];
            
            // Calculate distance from center for circular clipping
            const dx = x - 256;
            const dy = y - 256;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            // Skip pixels outside the 235px circular boundary of the medallion
            if (dist > 235) {
              continue;
            }

            // Compute luminance to distinguish foreground elements from the textured dark background
            const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
            if (luminance < 75) {
              continue;
            }

            // Gap in the outer ring is on the right side where the circuit board is
            const isRingGap = (x > 256) && (Math.abs(Math.atan2(dy, dx)) < 0.40);

            if (dist >= 204 && dist <= 238 && !isRingGap) {
              // Phase 1: Outer Ring (Canvas 1 - Red)
              data1[idx] = 255;
              data1[idx + 3] = 255;
            } else if (x >= 185 && x <= 265 && y >= 70 && y <= 160) {
              // Phase 3: Exponent 2 (Canvas 1 - Blue)
              data1[idx + 2] = 255;
              data1[idx + 3] = 255;
            } else if (x >= 125 && x <= 185 && y >= 125 && y <= 180) {
              // Phase 2: Human Head (Canvas 1 - Green)
              data1[idx + 1] = 255;
              data1[idx + 3] = 255;
            } else if (x >= 70 && x <= 200 && y >= 180 && y <= 380) {
              // Phase 2: Human Body (Canvas 1 - Green)
              data1[idx + 1] = 255;
              data1[idx + 3] = 255;
            } else if (x >= 305 && x <= 375 && y >= 220 && y <= 350) {
              // Phase 5: Pixel Blocks (Canvas 2 - Green)
              data2[idx + 1] = 255;
              data2[idx + 3] = 255;
            } else if (x >= 375 && x <= 495 && y >= 210 && y <= 355) {
              // Phase 6: Circuit Lines (Canvas 2 - Blue)
              data2[idx + 2] = 255;
              data2[idx + 3] = 255;
            } else {
              // Phase 4: F Shape & Wavy Base (Canvas 2 - Red)
              data2[idx] = 255;
              data2[idx + 3] = 255;
            }
          }
        }

        ctx1.putImageData(imgData1, 0, 0);
        ctx2.putImageData(imgData2, 0, 0);

        // Convert Canvases to Textures
        const texLogo = new THREE.CanvasTexture(logoCanvas);
        texLogo.colorSpace = THREE.SRGBColorSpace;
        texLogo.minFilter = THREE.LinearMipmapLinearFilter;
        texLogo.generateMipmaps = true;

        const texMask1 = new THREE.CanvasTexture(canvas1);
        texMask1.minFilter = THREE.LinearFilter;
        texMask1.magFilter = THREE.LinearFilter;

        const texMask2 = new THREE.CanvasTexture(canvas2);
        texMask2.minFilter = THREE.LinearFilter;
        texMask2.magFilter = THREE.LinearFilter;

        // Sample particle target positions from canvas masks for 100% boundary accuracy
        const sampleMask = (ctx: CanvasRenderingContext2D, colorCheck: (r: number, g: number, b: number) => boolean, count: number) => {
          const imgData = ctx.getImageData(0, 0, size, size);
          const data = imgData.data;
          const pts: THREE.Vector3[] = [];
          const candidates: { x: number; y: number }[] = [];
          
          for (let y = 0; y < size; y += 4) {
            for (let x = 0; x < size; x += 4) {
              const idx = (y * size + x) * 4;
              if (colorCheck(data[idx], data[idx + 1], data[idx + 2])) {
                candidates.push({ x, y });
              }
            }
          }

          for (let i = 0; i < count; i++) {
            if (candidates.length === 0) {
              pts.push(new THREE.Vector3((Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, 0));
              continue;
            }
            const rIdx = Math.floor(Math.random() * candidates.length);
            const pt = candidates[rIdx];
            const tx = ((pt.x / size) * 1.8) - 0.9;
            const ty = 0.9 - ((pt.y / size) * 1.8);
            pts.push(new THREE.Vector3(tx, ty, 0));
          }
          return pts;
        };

        const targets: THREE.Vector3[] = [];
        targets.push(...sampleMask(ctx1, (r) => r > 100, 300)); // Phase 1: Ring (300)
        targets.push(...sampleMask(ctx1, (_, g) => g > 100, 300)); // Phase 2: Human (300)
        targets.push(...sampleMask(ctx1, (_, __, b) => b > 100, 200)); // Phase 3: Exponent 2 (200)
        targets.push(...sampleMask(ctx2, (r) => r > 100, 400)); // Phase 4: F shape (400)
        targets.push(...sampleMask(ctx2, (_, g) => g > 100, 200)); // Phase 5: Pixel blocks (200)
        targets.push(...sampleMask(ctx2, (_, __, b) => b > 100, 200)); // Phase 6: Circuits (200)

        particleTargetsRef.current = targets;

        // Assign uniforms
        uniformsRef.current.uLogoTex.value = texLogo;
        uniformsRef.current.uMask1.value = texMask1;
        uniformsRef.current.uMask2.value = texMask2;

        setLogoTexture(texLogo);
        setMaskTexture1(texMask1);
        setMaskTexture2(texMask2);
        setIsLoaded(true);
        console.log("Logo masks successfully initialized!");
      } catch (err) {
        console.error("Error generating logo masks:", err);
      }
    };
  }, []);

  // Set up particle starting offsets
  const particleCount = 1600;
  const particleData = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const pInfo = [];

    for (let i = 0; i < particleCount; i++) {
      const rx = (Math.random() - 0.5) * 6;
      const ry = (Math.random() - 0.5) * 6;
      const rz = (Math.random() - 0.5) * 4;

      positions[i * 3] = rx;
      positions[i * 3 + 1] = ry;
      positions[i * 3 + 2] = rz;

      // Map segments to reveal scroll triggers
      let startScroll = 0;
      let endScroll = 0;

      if (i < 300) {
        startScroll = 0.0;
        endScroll = 1.0;
      } else if (i < 600) {
        startScroll = 1.0;
        endScroll = 2.0;
      } else if (i < 800) {
        startScroll = 2.0;
        endScroll = 3.0;
      } else if (i < 1200) {
        startScroll = 3.0;
        endScroll = 4.0;
      } else if (i < 1400) {
        startScroll = 4.0;
        endScroll = 5.0;
      } else {
        startScroll = 5.0;
        endScroll = 6.0;
      }

      pInfo.push({
        randomX: rx,
        randomY: ry,
        randomZ: rz,
        startScroll,
        endScroll
      });
    }

    return { positions, pInfo };
  }, []);

  const lastLogTimeRef = useRef(0);

  useFrame((state) => {
    if (!isLoaded) return;
    const time = state.clock.getElapsedTime();
    const group = groupRef.current;
    const particles = particlesRef.current;
    const spark = sparkRef.current;
    const spot = spotLightRef.current;
    const backlight = backlightRef.current;
    const frontMat = frontMaterialRef.current;

    if (!group || !particles) return;

    if (time - lastLogTimeRef.current > 1.0) {
      console.log("LogoModel scroll:", scroll);
      lastLogTimeRef.current = time;
    }

    // Update uniforms
    uniformsRef.current.uScroll.value = scroll;
    uniformsRef.current.uTime.value = time;

    // Metallic shine sweep in Phase 8 (scroll 7 to 8)
    if (spot) {
      let targetSpotX = -4;
      if (scroll >= 7 && scroll < 8) {
        const t = scroll - 7;
        targetSpotX = -4 + t * 8;
      } else if (scroll >= 8) {
        targetSpotX = 0;
      }
      spot.position.x = THREE.MathUtils.lerp(spot.position.x, targetSpotX, 0.08);
    }

    // Scroll positioning and scaling matrix
    let targetPos = new THREE.Vector3(0, 0, 0);
    let targetScale = new THREE.Vector3(1.7, 1.7, 1.7);
    let targetRotY = Math.sin(time * 0.3) * 0.02;
    let targetRotX = Math.cos(time * 0.3) * 0.02;

    let particleOpacity = 0.0;
    let solidOpacity = 0.0;
    let backlightOpacity = 0.05;

    if (scroll < 1.0) {
      // Phase 1: Draw outer ring
      targetPos.set(0, 0, 0);
      particleOpacity = scroll * 0.8;
      solidOpacity = 0.0;
      
      // Welder spark tracking ring drawing sweep
      if (spark) {
        spark.visible = true;
        const startRad = 0.45;
        const endRad = 5.83;
        const currentRad = startRad + scroll * (endRad - startRad);
        const r = 0.76;
        spark.position.set(r * Math.cos(currentRad), r * Math.sin(currentRad), 0.02);
      }
    } else if (scroll < 6.0) {
      // Phase 2 to 6: Reveal human, 2, F, blocks, circuits
      targetPos.set(0, 0, 0);
      particleOpacity = 0.8;
      solidOpacity = 0.0;
      if (spark) spark.visible = false;
    } else if (scroll < 7.0) {
      // Phase 7: Medallion solidification crossfade (fade out particles, fade in original image)
      const t = scroll - 6.0;
      targetPos.set(0, 0, 0);
      particleOpacity = (1 - t) * 0.8;
      solidOpacity = t;
      backlightOpacity = 0.05 + t * 0.2;
      if (spark) spark.visible = false;
    } else if (scroll < 8.0) {
      // Phase 8: Shine sweep
      targetPos.set(0, 0, 0);
      particleOpacity = 0.0;
      solidOpacity = 1.0;
      backlightOpacity = 0.25;
    } else if (scroll < 9.0) {
      // Phase 9: Hover
      const t = scroll - 8.0;
      targetPos.set(0, 0, 0);
      particleOpacity = 0.0;
      solidOpacity = 1.0;
      backlightOpacity = 0.25;
      targetRotY = (Math.sin(time * 0.3) * 0.02) + t * 0.078;
    } else {
      // Settle in Navbar
      const t = Math.min(scroll - 9.0, 1.0);
      const navX = -3.55;
      const navY = 2.05;

      targetPos.set(
        THREE.MathUtils.lerp(0, navX, t),
        THREE.MathUtils.lerp(0, navY, t),
        0
      );

      const shrinkScale = THREE.MathUtils.lerp(1.7, 0.28, t);
      targetScale.set(shrinkScale, shrinkScale, shrinkScale);

      targetRotX = THREE.MathUtils.lerp(targetRotX, 0, t);
      targetRotY = THREE.MathUtils.lerp(targetRotY, 0, t);
      backlightOpacity = 0;
      solidOpacity = 1.0;
      particleOpacity = 0.0;
    }

    // Cap tilts strictly under 5 degrees (0.075 radians)
    const isSettledInNav = scroll >= 9.0;
    const maxTilt = 0.075;
    const floatAmount = isSettledInNav ? 0 : Math.sin(time * 1.3) * 0.05;
    const tiltX = isSettledInNav ? 0 : THREE.MathUtils.clamp(mouse.current.y * 0.06, -maxTilt, maxTilt);
    const tiltY = isSettledInNav ? 0 : THREE.MathUtils.clamp(mouse.current.x * 0.06, -maxTilt, maxTilt);

    // Apply group transforms
    group.position.x = THREE.MathUtils.lerp(group.position.x, targetPos.x, 0.08);
    group.position.y = THREE.MathUtils.lerp(group.position.y, targetPos.y + floatAmount, 0.08);
    group.position.z = THREE.MathUtils.lerp(group.position.z, targetPos.z, 0.08);
    group.scale.lerp(targetScale, 0.08);

    const targetQ = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(targetRotX + tiltX, targetRotY + tiltY, 0)
    );
    group.quaternion.slerp(targetQ, 0.08);

    // Update particle morphing positions
    const positions = particles.geometry.attributes.position.array as Float32Array;
    const targets = particleTargetsRef.current;

    for (let i = 0; i < particleCount; i++) {
      const p = particleData.pInfo[i];
      let t = 0;
      if (scroll < p.startScroll) {
        t = 0;
      } else if (scroll > p.endScroll) {
        t = 1;
      } else {
        t = (scroll - p.startScroll) / (p.endScroll - p.startScroll);
      }

      const driftX = Math.sin(time * 0.4 + i) * 0.12;
      const driftY = Math.cos(time * 0.4 + i * 0.7) * 0.12;
      
      const sX = p.randomX + driftX;
      const sY = p.randomY + driftY;
      const sZ = p.randomZ;

      const target = targets[i] || new THREE.Vector3(0, 0, 0);

      positions[i * 3] = THREE.MathUtils.lerp(sX, target.x, t);
      positions[i * 3 + 1] = THREE.MathUtils.lerp(sY, target.y, t);
      positions[i * 3 + 2] = THREE.MathUtils.lerp(sZ, target.z, t);
    }
    particles.geometry.attributes.position.needsUpdate = true;

    // Apply opacities to materials
    const particleMat = particles.material as THREE.PointsMaterial;
    if (particleMat) {
      particleMat.opacity = particleOpacity;
      particleMat.visible = particleOpacity > 0.01;
    }

    if (frontMat) {
      frontMat.opacity = solidOpacity;
      frontMat.transparent = solidOpacity < 0.99;
      frontMat.visible = solidOpacity > 0.01;
    }

    if (backlight) {
      const backMat = backlight.material as THREE.MeshBasicMaterial;
      if (backMat) {
        backMat.opacity = backlightOpacity;
        backMat.visible = backlightOpacity > 0.01;
      }
    }
  });

  return (
    <group ref={groupRef}>
      {/* Dynamic spot light for sweep effect */}
      <spotLight
        ref={spotLightRef}
        position={[-4, 4, 3.5]}
        angle={0.4}
        penumbra={1}
        intensity={3.0}
        color="#FFFFFF"
      />

      {/* 1. GLOWING RADIAL AURA BACKLIGHT */}
      <mesh ref={backlightRef} position={[0, 0, -0.08]} visible={false}>
        <planeGeometry args={[2.5, 2.5]} />
        <meshBasicMaterial
          color="#FF6F00"
          transparent
          opacity={0.05}
          blending={THREE.AdditiveBlending}
          map={new THREE.TextureLoader().load(
            'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128"><radialGradient id="g" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="white" stop-opacity="1"/><stop offset="100%" stop-color="white" stop-opacity="0"/></radialGradient><rect width="128" height="128" fill="url(%23g)"/></svg>'
          )}
        />
      </mesh>

      {/* 2. WELDER'S SPARK TRACKER FOR OUTER RING */}
      <mesh ref={sparkRef} visible={false}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <meshBasicMaterial color="#FFD700" />
      </mesh>

      {/* 3. THREE.JS PARTICLES ASSEMBLY */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particleData.positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#FF9F00"
          size={0.065}
          sizeAttenuation
          transparent
          opacity={0.0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          map={new THREE.TextureLoader().load(
            'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><radialGradient id="g" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="white" stop-opacity="1"/><stop offset="100%" stop-color="white" stop-opacity="0"/></radialGradient><circle cx="16" cy="16" r="16" fill="url(%23g)"/></svg>'
          )}
        />
      </points>

      {/* 4. MASK-SHADED LOGO PLANE (Mesh A: Scroll Morphing) */}
      {logoTexture && maskTexture1 && maskTexture2 && scroll < 7.0 && (
        <mesh position={[0, 0, 0.015]}>
          <planeGeometry args={[1.8, 1.8]} />
          <shaderMaterial
            vertexShader={vertexShaderCode}
            fragmentShader={fragmentShaderCode}
            uniforms={uniformsRef.current}
            transparent
            depthWrite={false}
          />
        </mesh>
      )}

      {/* 5. THE ORIGINAL BRAND MEDALLION (Mesh B: Completed PBR Medallion) */}
      {logoTexture && (
        <mesh castShadow receiveShadow visible={scroll >= 6.0} position={[0, 0, 0.01]}>
          <planeGeometry args={[1.8, 1.8]} />
          <meshPhysicalMaterial
            ref={frontMaterialRef}
            map={logoTexture}
            alphaMap={logoTexture}
            transparent={true}
            roughness={0.15}
            metalness={0.88}
            clearcoat={1.0}
            clearcoatRoughness={0.05}
            emissive="#FF6F00"
            emissiveMap={logoTexture}
            emissiveIntensity={0}
          />
        </mesh>
      )}
    </group>
  );
};

export const Logo3DCanvas: React.FC<{ scroll: number }> = ({ scroll }) => {
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', pointerEvents: 'none', position: 'relative' }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 40 }}
        shadows
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.7} color="#CD7F32" />
        
        {/* Directional lighting for brushed metal sheen */}
        <directionalLight
          position={[4, 3, 4]}
          intensity={2.8}
          color="#FF6F00" // Sunrise Orange
          castShadow
        />

        <directionalLight
          position={[-4, 1.5, -2]}
          intensity={1.2}
          color="#FFD700" // Sunrise Gold
        />

        <LogoModel scroll={scroll} mouse={mouse} />
      </Canvas>
    </div>
  );
};

export default Logo3DCanvas;
