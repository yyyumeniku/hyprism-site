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


// ---- smooth scrolling (lenis) ----
function initLenis() {
    if (typeof Lenis === 'undefined') return;

    const lenis = new Lenis({
        lerp: 0.1,
        smoothWheel: true
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // hook up anchor links to lenis
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = this.getAttribute('href');
            if (target && target !== '#') {
                lenis.scrollTo(target);
            }
        });
    });
}


// ---- grid background hover effect ----
// lights up 3d grid tiles near your cursor.
function gridBackground() {
    const grid = document.getElementById('grid-animation');
    if (!grid) return;

    // responsive grid size: smaller on mobile to save resources
    const isMobile = window.innerWidth < 768;
    const GRID_SIZE = isMobile ? 16 : 24;
    grid.style.setProperty('--grid-size', GRID_SIZE);

    const TILE_COUNT = GRID_SIZE * GRID_SIZE;
    const MAX_DISTANCE = 130;
    const tiles = [];
    const centersX = new Float32Array(TILE_COUNT);
    const centersY = new Float32Array(TILE_COUNT);
    const active = [];

    let gridRect = null;
    let cellWidth = 0;
    let cellHeight = 0;
    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;
    let frame = 0;
    let resizeTimeout = null;

    function buildGrid() {
        grid.innerHTML = '';
        tiles.length = 0;
        for (let i = 0; i < TILE_COUNT; i++) {
            const tile = document.createElement('div');
            tile.className = 'tile';
            grid.appendChild(tile);
            tiles.push(tile);
        }
    }

    buildGrid();

    function recalcGridMetrics() {
        gridRect = grid.getBoundingClientRect();
        cellWidth = gridRect.width / GRID_SIZE;
        cellHeight = gridRect.height / GRID_SIZE;

        for (let row = 0; row < GRID_SIZE; row++) {
            for (let col = 0; col < GRID_SIZE; col++) {
                const idx = row * GRID_SIZE + col;
                centersX[idx] = (col + 0.5) * cellWidth;
                centersY[idx] = (row + 0.5) * cellHeight;
            }
        }
    }

    function updateTiles() {
        if (!gridRect) {
            recalcGridMetrics();
        }

        const mouseX = pointerX - gridRect.left;
        const mouseY = pointerY - gridRect.top;

        for (let i = 0; i < active.length; i++) {
            tiles[active[i]].style.setProperty('--intensity', '0');
        }
        active.length = 0;

        const minCol = Math.max(0, Math.floor((mouseX - MAX_DISTANCE) / cellWidth));
        const maxCol = Math.min(GRID_SIZE - 1, Math.ceil((mouseX + MAX_DISTANCE) / cellWidth));
        const minRow = Math.max(0, Math.floor((mouseY - MAX_DISTANCE) / cellHeight));
        const maxRow = Math.min(GRID_SIZE - 1, Math.ceil((mouseY + MAX_DISTANCE) / cellHeight));

        for (let row = minRow; row <= maxRow; row++) {
            for (let col = minCol; col <= maxCol; col++) {
                const idx = row * GRID_SIZE + col;
                const dx = mouseX - centersX[idx];
                const dy = mouseY - centersY[idx];
                // optimize: use squared distance to avoid sqrt
                const distSq = dx * dx + dy * dy;

                if (distSq < MAX_DISTANCE * MAX_DISTANCE) {
                    const distance = Math.sqrt(distSq);
                    const intensity = 1 - distance / MAX_DISTANCE;
                    tiles[idx].style.setProperty('--intensity', intensity.toFixed(2));
                    active.push(idx);
                }
            }
        }

        frame = 0;
    }

    function queueUpdate() {
        if (!frame) {
            frame = requestAnimationFrame(updateTiles);
        }
    }

    // always listen for pointer moves
    window.addEventListener('pointermove', event => {
        // throttle: skip if frame is already requested
        if (frame) return;
        pointerX = event.clientX;
        pointerY = event.clientY;
        queueUpdate();
    }, { passive: true });

    window.addEventListener('resize', () => {
        // debounce resize to prevent layout thrashing
        if (resizeTimeout) clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            recalcGridMetrics();
            queueUpdate();
        }, 100);
    }, { passive: true });

    recalcGridMetrics();
    queueUpdate();
}


// ---- 3d card tilt ----
// cards tilt toward your mouse. fun to play with.
function cardTilt() {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        return;
    }

    const cards = document.querySelectorAll('[data-tilt]');

    cards.forEach(card => {
        let raf = 0;
        let px = 0;
        let py = 0;

        const updateTilt = () => {
            const rect = card.getBoundingClientRect();
            const x = px - rect.left;
            const y = py - rect.top;
            const cx = rect.width / 2;
            const cy = rect.height / 2;
            const rotateX = ((y - cy) / cy) * -8;
            const rotateY = ((x - cx) / cx) * 8;

            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
            raf = 0;
        };

        card.addEventListener('pointermove', e => {
            px = e.clientX;
            py = e.clientY;
            if (!raf) {
                raf = requestAnimationFrame(updateTilt);
            }
        });

        card.addEventListener('pointerleave', () => {
            card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
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


// ---- boot everything ----
document.addEventListener('DOMContentLoaded', () => {
    initLenis();
    burger();
    gridBackground();
    cardTilt();

    // fetch data then setup count-up.
    downloads().then(() => countUp());
    links();
});
