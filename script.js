// ===== TYPED EFFECT =====
const typedEl = document.getElementById('typed-text');
const phrases = [
  'Full Stack Developer 🚀',
  'HTML / CSS / JavaScript',
  'BCA Student @ CSJMU',
  'Open to Work ✨'
];
let pi = 0, ci = 0, deleting = false;
function typeLoop() {
  const phrase = phrases[pi];
  if (!deleting) {
    typedEl.textContent = phrase.slice(0, ++ci);
    if (ci === phrase.length) { deleting = true; return setTimeout(typeLoop, 1800); }
  } else {
    typedEl.textContent = phrase.slice(0, --ci);
    if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; return setTimeout(typeLoop, 400); }
  }
  setTimeout(typeLoop, deleting ? 50 : 90);
}
typeLoop();

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 100) current = s.id; });
  navLinks.forEach(a => { a.classList.toggle('active', a.getAttribute('href') === '#' + current); });
});

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navLinksEl = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
  navLinksEl.classList.toggle('open');
  hamburger.classList.toggle('open');
});
navLinksEl.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navLinksEl.classList.remove('open');
  hamburger.classList.remove('open');
}));

// ===== ENHANCED PARTICLES =====
const particleContainer = document.getElementById('particles');
function createParticle() {
  const p = document.createElement('div');
  p.className = 'particle';
  const size = Math.random() * 5 + 1;
  const shapes = ['50%', '0%', '30%'];
  const colors = [
    'rgba(108,99,255,0.7)', 'rgba(168,85,247,0.6)',
    'rgba(6,182,212,0.6)', 'rgba(255,255,255,0.4)',
    'rgba(255,180,100,0.3)'
  ];
  p.style.cssText = `
    width:${size}px;height:${size}px;
    left:${Math.random()*100}%;
    background:${colors[Math.floor(Math.random()*colors.length)]};
    border-radius:${shapes[Math.floor(Math.random()*shapes.length)]};
    animation-duration:${Math.random()*12+6}s;
    animation-delay:${Math.random()*6}s;
    filter: blur(${Math.random() > 0.7 ? 1 : 0}px);
  `;
  particleContainer.appendChild(p);
  setTimeout(() => p.remove(), 20000);
}
setInterval(createParticle, 500);
for (let i = 0; i < 20; i++) createParticle();

// ===== SKILL BARS ANIMATION =====
const skillFills = document.querySelectorAll('.skill-fill');
const skillObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('animated'); });
}, { threshold: 0.3 });
skillFills.forEach(f => skillObs.observe(f));

// ===== SCROLL REVEAL (AOS-like) =====
function initReveal() {
  const revealEls = document.querySelectorAll('.project-card, .cert-card, .timeline-card, .skill-category, .stat-card, .contact-link-item, .info-item');
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => {
          e.target.style.opacity = '1';
          e.target.style.transform = 'perspective(1000px) rotateX(0deg) translateY(0) translateX(0)';
        }, (e.target.dataset.delay || 0));
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'perspective(1000px) rotateX(7deg) translateY(36px)';
    el.style.transition = `opacity 0.65s cubic-bezier(0.4,0,0.2,1) ${(i % 4) * 0.1}s, transform 0.65s cubic-bezier(0.4,0,0.2,1) ${(i % 4) * 0.1}s`;
    revealObs.observe(el);
  });

  // Reveal section headers
  document.querySelectorAll('.section-header').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'perspective(1000px) rotateX(5deg) translateY(24px)';
    el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    const hObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.opacity = '1';
          e.target.style.transform = 'perspective(1000px) rotateX(0deg) translateY(0)';
          hObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.2 });
    hObs.observe(el);
  });

  // About photo reveal
  const photoWrap = document.getElementById('profile-photo');
  if (photoWrap) {
    photoWrap.style.opacity = '0';
    photoWrap.style.transform = 'scale(0.85) translateY(20px)';
    photoWrap.style.transition = 'opacity 0.9s ease, transform 0.9s cubic-bezier(0.34, 1.56, 0.64, 1)';
    const pObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.opacity = '1';
          e.target.style.transform = 'scale(1) translateY(0)';
          pObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.2 });
    pObs.observe(photoWrap);
  }
}
initReveal();

// ===== 3D CARD TILT EFFECT =====
document.querySelectorAll('.project-card, .cert-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotX = ((y - cy) / cy) * -6;
    const rotY = ((x - cx) / cx) * 6;
    card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s ease, border-color 0.3s, box-shadow 0.3s';
  });
});

// ===== ANIMATED STAT COUNTERS =====
function animateCounter(el, target, duration = 1500) {
  let start = 0;
  const step = Math.ceil(target / (duration / 16));
  const timer = setInterval(() => {
    start += step;
    if (start >= target) {
      el.textContent = target + (el.dataset.suffix || '+');
      clearInterval(timer);
    } else {
      el.textContent = start + (el.dataset.suffix || '+');
    }
  }, 16);
}
const statObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const numEl = e.target.querySelector('.stat-num');
      if (numEl && !numEl.dataset.animated) {
        numEl.dataset.animated = true;
        const raw = numEl.textContent;
        const num = parseInt(raw);
        const suffix = raw.replace(/[0-9]/g, '');
        numEl.dataset.suffix = suffix;
        numEl.textContent = '0' + suffix;
        animateCounter(numEl, num);
      }
      statObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-card').forEach(c => statObs.observe(c));

// ===== CURSOR GLOW EFFECT (Hero section) =====
const hero = document.querySelector('.hero');
if (hero) {
  hero.addEventListener('mousemove', e => {
    const x = e.clientX;
    const y = e.clientY - hero.getBoundingClientRect().top;
    hero.style.setProperty('--mx', x + 'px');
    hero.style.setProperty('--my', y + 'px');
  });
}

// ===== CONTACT FORM =====
const form = document.getElementById('contact-form');
const successMsg = document.getElementById('form-success');
const sendBtn = document.getElementById('send-msg-btn');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name-input').value.trim();
  const email = document.getElementById('email-input').value.trim();
  const message = document.getElementById('message-input').value.trim();
  if (!name || !email || !message) {
    [document.getElementById('name-input'), document.getElementById('email-input'), document.getElementById('message-input')]
      .forEach(el => { if (!el.value.trim()) { el.style.borderColor = '#ef4444'; el.style.animation = 'shake 0.4s ease'; setTimeout(() => el.style.animation = '', 400); } });
    return;
  }
  sendBtn.innerHTML = '<span style="display:inline-block;animation:spin-ring 0.8s linear infinite;border:2px solid #fff;border-top-color:transparent;border-radius:50%;width:16px;height:16px;"></span> Sending...';
  sendBtn.disabled = true;
  setTimeout(() => {
    form.reset();
    successMsg.style.display = 'block';
    sendBtn.textContent = 'Send Message 🚀';
    sendBtn.disabled = false;
    setTimeout(() => successMsg.style.display = 'none', 5000);
  }, 1200);
});
document.querySelectorAll('.form-group input, .form-group textarea').forEach(el => {
  el.addEventListener('input', () => el.style.borderColor = '');
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ===== SHAKE KEYFRAME (inline) =====
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%,100%{transform:translateX(0)}
    25%{transform:translateX(-6px)}
    75%{transform:translateX(6px)}
  }
`;
document.head.appendChild(shakeStyle);

console.log('%c👨‍💻 Anish Prajapati Portfolio ', 'background:linear-gradient(135deg,#6c63ff,#a855f7);color:#fff;font-size:14px;padding:8px 16px;border-radius:8px;font-weight:bold;');
console.log('%c⚡ Built with HTML, CSS & JavaScript | Kanpur, UP, India', 'color:#a855f7;font-size:12px;');
