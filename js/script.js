;(function () {
  'use strict';

  /* ===================================================
     1.  PARTICLES CANVAS
  =================================================== */
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animId = null;
  let isVisible = true;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2.5 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.25;
      this.speedY = -Math.random() * 0.15 - 0.05;
      this.opacity = Math.random() * 0.35 + 0.05;
      this.color = Math.random() > 0.5 ? '124, 58, 237' : '59, 130, 246';
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < -10) this.x = canvas.width + 10;
      if (this.x > canvas.width + 10) this.x = -10;
      if (this.y < -10) this.y = canvas.height + 10;
      if (this.y > canvas.height + 10) this.y = -10;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
      ctx.fill();
    }
  }

  function initParticles(count) {
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(124, 58, 237, ${0.04 * (1 - dist / 150)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animateParticles() {
    if (!isVisible) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    animId = requestAnimationFrame(animateParticles);
  }

  function startParticles() {
    const count = Math.min(80, Math.floor(canvas.width * canvas.height / 12000));
    initParticles(count);
    if (animId) cancelAnimationFrame(animId);
    animateParticles();
  }

  resizeCanvas();
  startParticles();

  window.addEventListener('resize', () => {
    resizeCanvas();
    startParticles();
  });

  document.addEventListener('visibilitychange', () => {
    isVisible = !document.hidden;
    if (isVisible) animateParticles();
  });

  /* ===================================================
     2.  TYPING ANIMATION — CODE BLOCK
  =================================================== */
  (function typingCode() {
    const codeLines = [
      '<span class="comment">// haniel.tech</span>',
      '<span class="keyword">function</span> atenderCliente() {',
      '&nbsp;&nbsp;<span class="keyword">const</span> msg = <span class="string">"Olá! Como posso ajudar?"</span>;',
      '&nbsp;&nbsp;<span class="function">enviarWhatsApp</span>(msg);',
      '&nbsp;&nbsp;<span class="keyword">await</span> <span class="function">resolver</span>();',
      '&nbsp;&nbsp;<span class="keyword">return</span> <span class="string">"Cliente satisfeito ✅"</span>;',
      '}',
      '',
      '<span class="comment">// 100% automatizado 🤖</span>'
    ];

    const container = document.getElementById('typingCode');
    if (!container) return;

    let lineIndex = 0;
    let typingTimer = null;

    function typeLine() {
      if (lineIndex >= codeLines.length) {
        if (typingTimer) clearTimeout(typingTimer);
        typingTimer = setTimeout(() => {
          container.innerHTML = '<div class="cursor-line"><span class="cursor">|</span></div>';
          lineIndex = 0;
          typingTimer = setTimeout(typeLine, 800);
        }, 4000);
        return;
      }

      const existingLines = container.querySelectorAll('div:not(.cursor-line)');
      const isNewLine = existingLines.length <= lineIndex;

      if (isNewLine) {
        const lineDiv = document.createElement('div');
        lineDiv.innerHTML = codeLines[lineIndex] + ' <span class="cursor">|</span>';
        container.appendChild(lineDiv);

        if (lineIndex > 0) {
          const prev = existingLines[lineIndex - 1];
          if (prev) {
            const prevCursor = prev.querySelector('.cursor');
            if (prevCursor) prevCursor.remove();
          }
        }

        lineIndex++;
        typingTimer = setTimeout(typeLine, 100);
      }
    }

    container.innerHTML = '<div class="cursor-line"><span class="cursor">|</span></div>';
    typingTimer = setTimeout(typeLine, 600);
  })();

  /* ===================================================
     3.  SCROLL REVEAL (IntersectionObserver)
  =================================================== */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, entry.target.dataset.delay || 0);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ===================================================
     4.  FAQ ACCORDION
  =================================================== */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');

      document.querySelectorAll('.faq-item.open').forEach(openItem => {
        if (openItem !== item) {
          openItem.classList.remove('open');
          openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        }
      });

      if (isOpen) {
        item.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ===================================================
      5.  HAMBURGER MENU
  =================================================== */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', isOpen);
      document.body.classList.toggle('nav-open', isOpen);
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('nav-open');
      });
    });
  }

  /* ===================================================
      6.  CLOSE BUTTONS (migrated from inline onclick)
  =================================================== */
  const launchClose = document.getElementById('launchClose');
  if (launchClose) {
    launchClose.addEventListener('click', () => {
      document.getElementById('launchBar').classList.add('hidden');
    });
  }

  const stickyCtaClose = document.getElementById('stickyCtaClose');
  if (stickyCtaClose) {
    stickyCtaClose.addEventListener('click', () => {
      document.getElementById('stickyCta').classList.remove('visible');
    });
  }

  /* ===================================================
      7.  LEAD FORM
  =================================================== */
  const leadForm = document.getElementById('leadForm');
  if (leadForm) {
    leadForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const form = e.target;
      const card = document.getElementById('form-card');
      const submitBtn = document.getElementById('formSubmit');
      const errorEl = document.getElementById('formError');

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Enviando...';

      const data = new FormData(form);
      const endpoint = form.getAttribute('data-endpoint');

      let sent = false;

      if (endpoint) {
        try {
          const body = {};
          data.forEach((value, key) => { body[key] = value; });
          const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
          });
          sent = res.ok;
        } catch {
          sent = false;
        }
      }

      try {
        const saved = JSON.parse(localStorage.getItem('haniel_leads') || '[]');
        const entry = {};
        data.forEach((value, key) => { entry[key] = value; });
        entry._timestamp = new Date().toISOString();
        saved.push(entry);
        localStorage.setItem('haniel_leads', JSON.stringify(saved));
      } catch {
        /* localStorage unavailable */
      }

      if (sent) {
        card.querySelector('form').style.display = 'none';
        document.getElementById('formSuccess').classList.add('show');
      } else {
        if (errorEl) errorEl.style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.innerHTML = `Quero ser contactado
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`;
      }
    });
  }

  /* ===================================================
      8.  STICKY CTA — APARECE AO PASSAR DO HERO
  =================================================== */
  const hero = document.getElementById('hero');
  const stickyCta = document.getElementById('stickyCta');

  if (hero && stickyCta) {
    const scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
          stickyCta.classList.add('visible');
        } else {
          stickyCta.classList.remove('visible');
        }
      });
    }, { threshold: 0 });

    scrollObserver.observe(hero);
  }

})();
