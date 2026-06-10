import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  fadeSpeed: number;
}

export const SunriseBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles: Particle[] = [];
    const maxParticles = 60;

    const createParticle = (initBottom = false): Particle => {
      return {
        x: Math.random() * width,
        y: initBottom ? height + 10 : Math.random() * height,
        size: Math.random() * 3 + 1,
        speedY: -(Math.random() * 0.6 + 0.2), // Rising slowly
        speedX: (Math.random() - 0.5) * 0.4,   // Swaying left/right
        opacity: Math.random() * 0.5 + 0.1,
        fadeSpeed: Math.random() * 0.005 + 0.001,
      };
    };

    // Pre-populate particles
    for (let i = 0; i < maxParticles; i++) {
      particles.push(createParticle(false));
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw warm sunrise fog at the bottom
      const fogGrad = ctx.createLinearGradient(0, height * 0.7, 0, height);
      fogGrad.addColorStop(0, 'rgba(5, 5, 5, 0)');
      fogGrad.addColorStop(0.5, 'rgba(211, 84, 0, 0.05)');
      fogGrad.addColorStop(1, 'rgba(255, 111, 0, 0.12)');
      ctx.fillStyle = fogGrad;
      ctx.fillRect(0, height * 0.7, width, height * 0.3);

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        // Render particle with additive glow
        ctx.beginPath();
        const particleGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
        particleGrad.addColorStop(0, `rgba(255, 215, 0, ${p.opacity})`); // Sunrise Gold
        particleGrad.addColorStop(0.5, `rgba(255, 111, 0, ${p.opacity * 0.5})`); // Orange glow
        particleGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = particleGrad;
        ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
        ctx.fill();

        // Move particle
        p.y += p.speedY;
        p.x += p.speedX;

        // Wrap around sides
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        // If particle goes off top or fades out, recreate it at the bottom
        if (p.y < -10) {
          particles[i] = createParticle(true);
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <div className="sunrise-sky" />
      <div className="sunrise-horizon" />
      <div className="sunrise-ray" />
      <div className="fog-overlay" />
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: -1,
        }}
      />
    </>
  );
};

export default SunriseBackground;
