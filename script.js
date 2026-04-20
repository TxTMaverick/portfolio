/* TOUCH DETECT */
    const isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
    if (isTouch) document.body.classList.add('is-touch');

    /* CURSOR TRAIL */
    const trail = document.getElementById('cursor-trail');
    const darkZones = ['#contact', 'footer'];
    let mx = 0, my = 0;

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      trail.style.left = mx + 'px';
      trail.style.top  = my + 'px';
      const el = document.elementFromPoint(mx, my);
      let isDark = false;
      if (el) isDark = darkZones.some(sel => el.closest(sel));
      document.body.classList.toggle('cursor-dark', isDark);
    });
    document.addEventListener('mouseover', e => {
      if (e.target.closest('a, button')) document.body.classList.add('cursor-hover');
    });
    document.addEventListener('mouseout', e => {
      if (e.target.closest('a, button')) document.body.classList.remove('cursor-hover');
    });
    document.addEventListener('mouseleave', () => trail.style.opacity = '0');
    document.addEventListener('mouseenter', () => trail.style.opacity = '');

    /* TOUCH RIPPLE */
    if (isTouch) {
      document.addEventListener('touchstart', e => {
        const touch = e.touches[0];
        const x = touch.clientX, y = touch.clientY;
        const el = document.elementFromPoint(x, y);
        const onDark = el && darkZones.some(sel => el.closest(sel));
        const ripple = document.createElement('div');
        ripple.className = 'touch-ripple' + (onDark ? ' light' : '');
        ripple.style.left = x + 'px';
        ripple.style.top  = y + 'px';
        document.body.appendChild(ripple);
        ripple.addEventListener('animationend', () => ripple.remove());
      }, { passive: true });
    }

    /* PARTICLE SYSTEM */
    (function () {
      const zone   = document.getElementById('particle-zone');
      const canvas = document.getElementById('particle-canvas');
      const ctx    = canvas.getContext('2d');
      let parts = [], lx = 0, ly = 0;

      function resize() {
        const r = canvas.getBoundingClientRect();
        canvas.width  = r.width;
        canvas.height = r.height;
      }
      resize();
      window.addEventListener('resize', resize);

      function Particle(x, y) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.4 + Math.random() * 1.2;
        const grays = ['#111','#444','#777','#aaa','#ccc'];
        this.x = x + (Math.random() - 0.5) * 10;
        this.y = y + (Math.random() - 0.5) * 10;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed - 0.3;
        this.size  = 1 + Math.random() * 2.2;
        this.alpha = 0.65 + Math.random() * 0.35;
        this.fade  = 0.012 + Math.random() * 0.015;
        this.color = grays[Math.floor(Math.random() * grays.length)];
        this.isChar = Math.random() < 0.07;
        this.char   = Math.random() < 0.5 ? '>' : '<';
      }
      Particle.prototype.update = function() {
        this.x += this.vx; this.y += this.vy;
        this.vy -= 0.005; this.alpha -= this.fade;
      };
      Particle.prototype.draw = function() {
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.fillStyle = this.color;
        if (this.isChar) {
          ctx.font = `600 ${this.size * 4}px 'Outfit', sans-serif`;
          ctx.fillText(this.char, this.x, this.y);
        } else {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      };

      zone.addEventListener('mouseenter', () => document.body.classList.add('cursor-particle'));
      zone.addEventListener('mouseleave', () => document.body.classList.remove('cursor-particle'));
      zone.addEventListener('mousemove', e => {
        const r = canvas.getBoundingClientRect();
        lx = e.clientX - r.left; ly = e.clientY - r.top;
        for (let i = 0; i < 4; i++) parts.push(new Particle(lx, ly));
      });
      zone.addEventListener('click', () => {
        for (let i = 0; i < 22; i++) parts.push(new Particle(lx, ly));
      });

      (function loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        parts = parts.filter(p => p.alpha > 0);
        parts.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(loop);
      })();
    })();

    /* HAMBURGER MENU */
    function toggleMenu() {
      const m = document.getElementById('mobileMenu');
      const b = document.getElementById('backdrop');
      const h = document.getElementById('hamburger');
      const open = m.classList.toggle('open');
      b.classList.toggle('open', open);
      h.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    }
    function closeMenu() {
      document.getElementById('mobileMenu').classList.remove('open');
      document.getElementById('backdrop').classList.remove('open');
      document.getElementById('hamburger').classList.remove('open');
      document.body.style.overflow = '';
    }

    /* TYPEWRITER */
    (function () {
      const name = 'Tejas Tripathi';
      const el = document.getElementById('typewriter');
      let i = 0, typing = true;
      function tick() {
        if (typing) {
          el.textContent = name.slice(0, i + 1); i++;
          if (i === name.length) { setTimeout(() => { typing = false; tick(); }, 2500); return; }
          setTimeout(tick, 65 + Math.random() * 55);
        } else {
          el.textContent = name.slice(0, i - 1); i--;
          if (i === 0) { typing = true; setTimeout(tick, 500); return; }
          setTimeout(tick, 38);
        }
      }
      setTimeout(tick, 900);
    })();

    /* SCROLL FADE-IN */
    (function () {
      const obs = new IntersectionObserver(
        entries => entries.forEach(e => {
          if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
        }),
        { threshold: 0.12 }
      );
      document.querySelectorAll('.fade-in').forEach(el => obs.observe(el));
    })();

    /* PHOTO UPLOAD */
    const photoInput = document.getElementById('photo-input');
    photoInput.addEventListener('change', e => {
      const file = e.target.files[0];
      if (file) loadPhoto(file);
    });
    function loadPhoto(file) {
      const url = URL.createObjectURL(file);
      document.getElementById('photoImgDesktop').src = url;
      document.getElementById('photoImgMobile').src = url;
    }