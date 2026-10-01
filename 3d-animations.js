/* ============================================================
   3D ANIMATIONS  –  Anish Prajapati Portfolio
   Three.js hero globe + page transitions + 3D icon effects
   ============================================================ */

/* ─── PAGE TRANSITION ─────────────────────────────────────── */
(function () {
  const overlay = document.getElementById('page-transition');
  if (!overlay) return;

  // Hide overlay after load bar finishes (~1.4 s)
  window.addEventListener('load', () => {
    setTimeout(() => {
      overlay.classList.add('hide');
      // Remove from DOM after animation
      setTimeout(() => overlay.remove(), 800);
    }, 1400);
  });

  // Smooth page-exit on navigation (internal links only)
  document.querySelectorAll('a[href]:not([href^="#"]):not([target="_blank"])').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (!href || href.startsWith('mailto') || href.startsWith('tel')) return;
      e.preventDefault();
      // Re-create overlay clone for exit
      const exit = document.createElement('div');
      exit.style.cssText = `
        position:fixed;inset:0;z-index:99999;
        background:var(--bg-primary);
        display:flex;align-items:center;justify-content:center;
        opacity:0;transition:opacity 0.35s ease;
        font-family:'Fira Code',monospace;font-size:2.5rem;font-weight:900;
        color:#f0f0ff;
      `;
      exit.innerHTML = '<span style="color:#6c63ff">&lt;</span>AP<span style="color:#6c63ff">/&gt;</span>';
      document.body.appendChild(exit);
      requestAnimationFrame(() => {
        exit.style.opacity = '1';
        setTimeout(() => window.location.href = href, 380);
      });
    });
  });
})();

/* ─── THREE.JS HERO GLOBE ─────────────────────────────────── */
(function () {
  if (typeof THREE === 'undefined') return;
  const canvas = document.getElementById('hero-3d-canvas');
  if (!canvas) return;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  } catch {
    canvas.hidden = true;
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.clientWidth || 460, canvas.clientHeight || 460);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.z = 5.2;

  const sceneGroup = new THREE.Group();
  scene.add(sceneGroup);

  /* — Wireframe Globe — */
  const sphereGeo = new THREE.IcosahedronGeometry(1, 5);
  const wireframe = new THREE.WireframeGeometry(sphereGeo);
  const lineMat = new THREE.LineBasicMaterial({
    color: 0x6c63ff,
    transparent: true,
    opacity: 0.35,
  });
  const globeLines = new THREE.LineSegments(wireframe, lineMat);
  sceneGroup.add(globeLines);

  /* — Glowing solid sphere inside — */
  const innerGeo = new THREE.SphereGeometry(0.96, 64, 64);
  const innerMat = new THREE.MeshPhongMaterial({
    color: 0x0a0a1a,
    emissive: 0x1a0a3a,
    emissiveIntensity: 0.4,
    transparent: true,
    opacity: 0.85,
    shininess: 60,
  });
  const innerSphere = new THREE.Mesh(innerGeo, innerMat);
  sceneGroup.add(innerSphere);

  /* — Atmospheric glow shell — */
  const auraGeo = new THREE.SphereGeometry(1.14, 64, 64);
  const auraMat = new THREE.MeshBasicMaterial({
    color: 0x8b5cf6,
    transparent: true,
    opacity: 0.12,
    side: THREE.BackSide,
  });
  const auraSphere = new THREE.Mesh(auraGeo, auraMat);
  sceneGroup.add(auraSphere);

  /* — Floating particles around sphere — */
  const particleCount = 180;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const palette = [
    [0.42, 0.39, 1.0],   // purple
    [0.66, 0.33, 0.97],  // violet
    [0.02, 0.71, 0.83],  // cyan
  ];
  for (let i = 0; i < particleCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 1.15 + Math.random() * 0.6;
    positions[i*3]   = r * Math.sin(phi) * Math.cos(theta);
    positions[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i*3+2] = r * Math.cos(phi);
    const c = palette[Math.floor(Math.random() * palette.length)];
    colors[i*3] = c[0]; colors[i*3+1] = c[1]; colors[i*3+2] = c[2];
  }
  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const particleMat = new THREE.PointsMaterial({
    size: 0.025,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  /* — Orbit rings — */
  function addOrbitRing(radius, color, tiltX, tiltZ) {
    const geo = new THREE.TorusGeometry(radius, 0.006, 8, 120);
    const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.5 });
    const ring = new THREE.Mesh(geo, mat);
    ring.rotation.x = tiltX;
    ring.rotation.z = tiltZ;
    scene.add(ring);
    return ring;
  }
  const ring1 = addOrbitRing(1.35, 0x6c63ff, Math.PI / 3, 0.3);
  const ring2 = addOrbitRing(1.55, 0xa855f7, Math.PI / 6, -0.5);
  const ring3 = addOrbitRing(1.75, 0x06b6d4, Math.PI / 2 + 0.3, 0.1);
  const ring4 = addOrbitRing(2.05, 0x7c3aed, Math.PI / 4, 0.9);

  /* — Lights — */
  scene.add(new THREE.AmbientLight(0xffffff, 0.3));
  const pointLight1 = new THREE.PointLight(0x6c63ff, 2.5, 10);
  pointLight1.position.set(3, 3, 3);
  scene.add(pointLight1);
  const pointLight2 = new THREE.PointLight(0x06b6d4, 1.5, 10);
  pointLight2.position.set(-3, -2, 2);
  scene.add(pointLight2);

  /* — Mouse interaction — */
  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;
  let scrollTarget = 0;
  let scrollRotation = 0;
  const heroSection = document.querySelector('.hero');

  document.addEventListener('pointermove', e => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;

    if (heroSection) {
      const rect = heroSection.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      heroSection.style.setProperty('--hero-tilt-x', `${(py * -12).toFixed(2)}deg`);
      heroSection.style.setProperty('--hero-tilt-y', `${(px * 16).toFixed(2)}deg`);
      canvas.style.transform = `translateY(-50%) perspective(1400px) rotateX(${(py * -12).toFixed(2)}deg) rotateY(${(px * 16).toFixed(2)}deg)`;
    }
  });

  document.addEventListener('pointerleave', () => {
    if (heroSection) {
      heroSection.style.setProperty('--hero-tilt-x', '0deg');
      heroSection.style.setProperty('--hero-tilt-y', '0deg');
    }
    canvas.style.transform = 'translateY(-50%)';
  });
  function updateScrollTarget() {
    scrollTarget = Math.min(window.scrollY / Math.max(window.innerHeight, 1), 6);
  }
  window.addEventListener('scroll', updateScrollTarget, { passive: true });
  updateScrollTarget();

  /* — Resize — */
  function onResize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', onResize);

  /* — Animate — */
  let clock = 0;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function animate() {
    if (!reducedMotion) requestAnimationFrame(animate);
    clock += 0.005;

    // Smooth mouse follow
    targetX += (mouseX - targetX) * 0.04;
    targetY += (mouseY - targetY) * 0.04;
    scrollRotation += (scrollTarget - scrollRotation) * 0.035;

    sceneGroup.rotation.y = clock * 0.45 + targetX * 0.8 + scrollRotation * 0.12;
    sceneGroup.rotation.x = clock * 0.2 + targetY * 0.7 + scrollRotation * 0.06;
    sceneGroup.rotation.z = targetX * 0.3;
    sceneGroup.position.y = Math.sin(clock * 1.3) * 0.15;
    sceneGroup.position.x = targetX * 0.25;

    globeLines.rotation.y = clock * 0.4 + targetX * 0.5 + scrollRotation * 0.12;
    globeLines.rotation.x = clock * 0.15 + targetY * 0.3 + scrollRotation * 0.06;
    innerSphere.rotation.y = clock * 0.2;
    auraSphere.scale.setScalar(1 + Math.sin(clock * 2.2) * 0.08);

    particles.rotation.y = -clock * 0.2 + targetX * 0.3;
    particles.rotation.x = targetY * 0.2;

    ring1.rotation.y = clock * 0.8;
    ring2.rotation.y = -clock * 0.5;
    ring3.rotation.z = clock * 0.35;
    ring4.rotation.x = clock * 0.75;
    ring4.rotation.y = -clock * 0.55;

    // Pulsing opacity on wireframe
    lineMat.opacity = 0.25 + 0.12 * Math.sin(clock * 2);
    auraMat.opacity = 0.08 + 0.08 * Math.sin(clock * 2.5);

    renderer.render(scene, camera);
  }
  animate();
})();

(function () {
  const canvas = document.getElementById('profile-code-rain');
  if (!canvas) return;

  const context = canvas.getContext('2d');
  if (!context) return;

  const fontSize = 13;
  const characters = '01{}[]<>/\\$#*+-=ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let columns = 0;
  let drops = [];
  let frameId = 0;
  let isVisible = false;

  function resize() {
    const bounds = canvas.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(bounds.width * ratio);
    canvas.height = Math.round(bounds.height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    columns = Math.ceil(bounds.width / fontSize);
    drops = Array.from({ length: columns }, () => Math.random() * (bounds.height / fontSize));
    if (reducedMotion) draw(false);
  }

  function draw(advance) {
    const bounds = canvas.getBoundingClientRect();
    context.clearRect(0, 0, bounds.width, bounds.height);
    context.font = `${fontSize}px 'Fira Code', monospace`;

    for (let column = 0; column < columns; column++) {
      const y = drops[column] * fontSize;
      context.fillStyle = Math.random() > 0.94 ? 'rgba(190, 255, 150, 0.9)' : 'rgba(54, 211, 112, 0.62)';
      context.fillText(characters[Math.floor(Math.random() * characters.length)], column * fontSize, y);
      if (advance) {
        drops[column] = y > bounds.height && Math.random() > 0.975
          ? 0
          : drops[column] + 0.35 + Math.random() * 0.45;
      }
    }
  }

  function animate() {
    if (!isVisible || document.hidden || reducedMotion) return;
    draw(true);
    frameId = requestAnimationFrame(animate);
  }

  function stop() {
    if (frameId) cancelAnimationFrame(frameId);
    frameId = 0;
  }

  function start() {
    if (isVisible && !document.hidden && !reducedMotion && !frameId) {
      frameId = requestAnimationFrame(animate);
    }
  }

  resize();
  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
  new IntersectionObserver(entries => {
    isVisible = entries.some(entry => entry.isIntersecting);
    if (isVisible && reducedMotion) draw(false);
    else if (isVisible) start();
    else stop();
  }, { threshold: 0.05 }).observe(canvas);
})();

/* ─── 3D ICON PARALLAX TILT (cat-icon-3d, cert-icon-3d) ─── */
(function () {
  function addTilt(selector, maxDeg, scale = 1.18) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.querySelectorAll(selector).forEach(el => {
      el.addEventListener('mousemove', e => {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        el.style.transform =
          `perspective(500px) rotateY(${x * maxDeg * 2}deg) rotateX(${-y * maxDeg}deg) scale(${scale}) translateY(-4px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
        el.style.transition = 'transform 0.55s cubic-bezier(0.34,1.56,0.64,1)';
        setTimeout(() => el.style.transition = '', 600);
      });
      el.addEventListener('mouseenter', () => {
        el.style.transition = 'transform 0.15s ease';
      });
    });
  }
  addTilt('.cat-icon-3d', 20);
  addTilt('.cert-icon-3d', 15);
  addTilt('.contact-icon-3d', 18);
  addTilt('.profile-img-3d', 10, 1.025);
})();

/* ─── SMOOTH SECTION SLIDE-IN (enhanced) ─────────────────── */
(function () {
  const targets = document.querySelectorAll(
    '.about-text > h3, .about-text > p, .about-info-grid, .exp-note, .certs-note'
  );
  const obs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => {
          e.target.style.opacity = '1';
          e.target.style.transform = 'translateY(0)';
        }, i * 80);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  targets.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = 'opacity 0.65s cubic-bezier(0.4,0,0.2,1), transform 0.65s cubic-bezier(0.4,0,0.2,1)';
    obs.observe(el);
  });
})();

/* ─── FLOATING GLOWING ORBS (background ambiance) ─────────── */
(function () {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  for (let i = 0; i < 5; i++) {
    const orb = document.createElement('div');
    const size = 80 + Math.random() * 160;
    const colors = ['rgba(108,99,255,', 'rgba(168,85,247,', 'rgba(6,182,212,'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    orb.style.cssText = `
      position:absolute;
      width:${size}px; height:${size}px;
      border-radius:50%;
      background:radial-gradient(circle, ${color}0.12) 0%, transparent 70%);
      top:${Math.random()*80}%;
      left:${Math.random()*90}%;
      pointer-events:none;
      animation: orb-drift ${10 + Math.random()*12}s ease-in-out ${Math.random()*4}s infinite alternate;
      z-index:0;
    `;
    hero.appendChild(orb);
  }

  // Inject keyframes
  if (!document.getElementById('orb-style')) {
    const s = document.createElement('style');
    s.id = 'orb-style';
    s.textContent = `
      @keyframes orb-drift {
        from { transform: translate(0,0) scale(1); }
        to   { transform: translate(${30 + Math.random()*40}px, ${-20 - Math.random()*30}px) scale(1.15); }
      }
    `;
    document.head.appendChild(s);
  }
})();

/* ─── SKILL CATEGORY 3D HOVER (mousemove tilt) ─────────────── */
(function () {
  document.querySelectorAll('.skill-category').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform =
        `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 5}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.55s cubic-bezier(0.34,1.56,0.64,1), border-color 0.3s, box-shadow 0.3s';
      setTimeout(() => card.style.transition = '', 600);
    });
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.12s ease, border-color 0.3s, box-shadow 0.3s';
    });
  });
})();

console.log('%c🎯 3D Animations Loaded', 'background:linear-gradient(135deg,#6c63ff,#06b6d4);color:#fff;font-size:12px;padding:6px 12px;border-radius:6px;font-weight:bold;');
