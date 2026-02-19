// github repo info.
const OWNER = 'HyPrismTeam';
const REPO = 'HyPrism';

// turns big numbers into readable ones.
function fmt(n) {
    if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
    if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
    return n.toLocaleString();
}


// ---- mobile nav ----
// toggles the hamburger menu.
function burger() {
    const btn = document.getElementById('menu-toggle');
    const nav = document.getElementById('mobile-nav');
    if (!btn || !nav) return;

    btn.addEventListener('click', () => nav.classList.toggle('mobile-nav--open'));

    nav.querySelectorAll('.mobile-nav__link').forEach(a => {
        a.addEventListener('click', () => nav.classList.remove('mobile-nav--open'));
    });
}


// ---- header scroll effect ----
// adds shadow and opacity when scrolled.
function headerScroll() {
    const h = document.getElementById('header');
    if (!h) return;
    window.addEventListener('scroll', () => {
        if (scrollY > 40) {
            h.classList.add('header--scrolled');
        } else {
            h.classList.remove('header--scrolled');
        }
    }, { passive: true });
}


// ---- scroll progress bar ----
// the little bar at the top of the page.
function scrollProgress() {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;

    window.addEventListener('scroll', () => {
        const total = document.documentElement.scrollHeight - window.innerHeight;
        const pct = total > 0 ? (scrollY / total) * 100 : 0;
        bar.style.width = pct + '%';
    }, { passive: true });
}


// ---- smooth scrolling ----
// makes anchor links glide instead of teleport.
function smoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const id = a.getAttribute('href');
            if (id === '#') return;
            const target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}


// ---- particle canvas ----
// floating dots in the background. looks cool.
function particles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let w, h, dots = [];
    const COUNT = 50;
    const CONNECT_DIST = 150;

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }

    function spawn() {
        dots = [];
        for (let i = 0; i < COUNT; i++) {
            dots.push({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                r: Math.random() * 1.5 + 0.5
            });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, w, h);

        // move dots.
        for (const d of dots) {
            d.x += d.vx;
            d.y += d.vy;
            if (d.x < 0 || d.x > w) d.vx *= -1;
            if (d.y < 0 || d.y > h) d.vy *= -1;
        }

        // draw lines between nearby dots.
        for (let i = 0; i < dots.length; i++) {
            for (let j = i + 1; j < dots.length; j++) {
                const dx = dots[i].x - dots[j].x;
                const dy = dots[i].y - dots[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < CONNECT_DIST) {
                    const alpha = (1 - dist / CONNECT_DIST) * 0.15;
                    ctx.strokeStyle = `rgba(123, 140, 255, ${alpha})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(dots[i].x, dots[i].y);
                    ctx.lineTo(dots[j].x, dots[j].y);
                    ctx.stroke();
                }
            }
        }

        // draw dots.
        for (const d of dots) {
            ctx.fillStyle = 'rgba(123, 140, 255, 0.4)';
            ctx.beginPath();
            ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
            ctx.fill();
        }

        requestAnimationFrame(draw);
    }

    resize();
    spawn();
    draw();

    window.addEventListener('resize', () => {
        resize();
        spawn();
    });
}


// ---- 3d card tilt ----
// cards tilt toward your mouse. fun to play with.
function cardTilt() {
    const cards = document.querySelectorAll('[data-tilt]');

    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const cx = rect.width / 2;
            const cy = rect.height / 2;
            const rotateX = ((y - cy) / cy) * -8;
            const rotateY = ((x - cx) / cx) * 8;

            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}


// ---- mouse tracking glow ----
// the glow in the hero follows your cursor.
function mouseGlow() {
    const glow = document.getElementById('hero-glow');
    const hero = document.getElementById('hero');
    if (!glow || !hero) return;

    hero.addEventListener('mousemove', e => {
        const rect = hero.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        glow.style.transform = `translate(${x - 450}px, ${y - 450}px)`;
    });
}


// ---- parallax on scroll ----
// hero content moves slower than the page for depth.
function parallax() {
    const els = document.querySelectorAll('[data-parallax]');
    if (!els.length) return;

    window.addEventListener('scroll', () => {
        const sy = scrollY;
        els.forEach(el => {
            const speed = parseFloat(el.dataset.parallax) || 0.05;
            el.style.transform = `translateY(${sy * speed}px)`;
        });
    }, { passive: true });
}


// ---- count-up animation ----
// numbers roll up from zero when visible.
function countUp() {
    const el = document.getElementById('total-downloads');
    if (!el) return;

    let counted = false;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !counted) {
                counted = true;
                const target = parseInt(el.dataset.target || '0', 10);
                if (target <= 0) return;
                animateCount(el, target);
            }
        });
    }, { threshold: 0.5 });

    observer.observe(el);
}

function animateCount(el, target) {
    const duration = 1500;
    const start = performance.now();

    function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // ease out cubic.
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);
        el.textContent = fmt(current);

        if (progress < 1) {
            requestAnimationFrame(tick);
        } else {
            el.textContent = fmt(target);
            el.classList.add('count-done');
        }
    }

    requestAnimationFrame(tick);
}


// ---- download count from github ----
// fetches total downloads and triggers count-up.
async function downloads() {
    try {
        const r = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/releases`);
        if (!r.ok) throw 0;
        const data = await r.json();
        let n = 0;
        data.forEach(rel => rel.assets.forEach(a => n += a.download_count));
        const el = document.getElementById('total-downloads');
        if (el) {
            el.dataset.target = n;
            el.textContent = '0';
        }
    } catch {
        const el = document.getElementById('total-downloads');
        if (el) el.textContent = '?';
    }
}


// ---- download links ----
// resolves latest release urls from github.
async function links() {
    const names = {
        win: 'HyPrism.exe',
        mac: 'HyPrism-macOS-arm64.dmg',
        appimg: 'HyPrism-x86_64.AppImage',
        flat: 'HyPrism.flatpak',
        tar: 'HyPrism-linux-x86_64.tar.gz'
    };

    const base = `https://github.com/${OWNER}/${REPO}/releases/latest/download/`;
    const urls = { win: base + names.win, mac: base + names.mac, linux: base + names.appimg };

    try {
        const r = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/releases?per_page=1`);
        if (!r.ok) throw 0;
        const [rel] = await r.json();
        if (!rel) throw 0;
        const a = rel.assets;

        const w = a.find(x => x.name === names.win);
        const m = a.find(x => x.name === names.mac);
        const l = a.find(x => x.name === names.appimg)
               || a.find(x => x.name === names.flat)
               || a.find(x => x.name === names.tar);

        if (w) urls.win = w.browser_download_url;
        if (m) urls.mac = m.browser_download_url;
        if (l) urls.linux = l.browser_download_url;
    } catch (e) {
        console.warn('github api is being shy. using fallback links.', e);
    }

    const set = (id, url) => { const el = document.getElementById(id); if (el) el.href = url; };
    set('download-windows', urls.win);
    set('download-macos', urls.mac);
    set('download-linux', urls.linux);
}


// ---- aos setup ----
// scroll animations from the library.
function aos() {
    if (typeof AOS !== 'undefined') {
        AOS.init({ duration: 700, once: true, offset: 60, easing: 'ease-out-cubic' });
    }
}


// ---- boot everything ----
document.addEventListener('DOMContentLoaded', () => {
    burger();
    headerScroll();
    scrollProgress();
    smoothScroll();
    particles();
    cardTilt();
    mouseGlow();
    parallax();
    aos();

    // fetch data then setup count-up.
    downloads().then(() => countUp());
    links();
});
