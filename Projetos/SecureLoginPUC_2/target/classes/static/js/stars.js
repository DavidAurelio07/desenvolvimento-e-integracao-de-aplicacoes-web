(function () {
    'use strict';

    const CONFIG = {
        mode: 'repel',        // 'repel' | 'follow' | 'none'
        trail: true,          // rastro atras do mouse
        color: '255, 255, 255', // cor das estrelas em RGB (ex.: '129, 177, 195' = azul claro)

        density: 0.00009,     // estrelas por pixel2. Aumente para ter mais estrelas
        minSize: 0.5,         // tamanho minimo (px)
        maxSize: 2,           // tamanho maximo (px)
        drift: 0.15,          // velocidade da subida lenta (0 = paradas)
        twinkle: true,        // estrelas piscando

        radius: 130,          // distancia (px) em que o mouse influencia as estrelas
        repelStrength: 3.5,   // forca com que fogem do cursor (modo 'repel')
        followStrength: 1.2,  // forca com que seguem o cursor (modo 'follow')
        spring: 0.02,         // velocidade com que voltam ao lugar de origem
        friction: 0.9,        // 0.8 = freiam rapido | 0.98 = deslizam bastante

        trailAmount: 3,       // maximo de estrelinhas criadas por movimento
        trailFade: 0.025      // velocidade com que o rastro some (maior = some mais rapido)
    };


    // Le os atributos data-mode e data-trail da tag <script>, se existirem
    const tag = document.currentScript;
    if (tag && tag.dataset) {
        if (tag.dataset.mode) CONFIG.mode = tag.dataset.mode;
        if (tag.dataset.trail) CONFIG.trail = tag.dataset.trail === 'true';
    }

    const reduceMotion = window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ---------- canvas ----------
    const canvas = document.createElement('canvas');
    canvas.id = 'starfield';
    canvas.setAttribute('aria-hidden', 'true');
    Object.assign(canvas.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        zIndex: '0',
        pointerEvents: 'none'   // o mouse "atravessa" o canvas: formularios continuam clicaveis
    });
    document.body.prepend(canvas);
    const ctx = canvas.getContext('2d');

    let W = 0, H = 0;
    let stars = [];
    let particles = [];
    const mouse = { x: 0, y: 0, active: false };
    let lastMouse = null;

    // ---------- estrelas ----------
    function makeStar(x, y) {
        const z = Math.random(); // "profundidade": 0 = longe/pequena, 1 = perto/grande
        return {
            hx: x, hy: y,          // posicao de origem (home)
            ox: 0, oy: 0,          // deslocamento causado pelo mouse
            vx: 0, vy: 0,
            z: z,
            r: CONFIG.minSize + (CONFIG.maxSize - CONFIG.minSize) * z,
            alpha: 0.35 + z * 0.65,
            phase: Math.random() * Math.PI * 2,
            tw: 0.5 + Math.random() * 1.5
        };
    }

    function targetCount() {
        return Math.max(60, Math.min(320, Math.round(W * H * CONFIG.density)));
    }

    function resize() {
        const oldW = W, oldH = H;
        W = window.innerWidth;
        H = window.innerHeight;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(W * dpr);
        canvas.height = Math.round(H * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        // Reaproveita as estrelas existentes, ajustando a posicao ao novo tamanho
        if (oldW && oldH) {
            stars.forEach(s => { s.hx *= W / oldW; s.hy *= H / oldH; });
        }
        const n = targetCount();
        while (stars.length < n) stars.push(makeStar(Math.random() * W, Math.random() * H));
        if (stars.length > n) stars.length = n;

        if (reduceMotion) draw(performance.now()); // sem animacao: redesenha uma vez
    }

    // ---------- atualizacao ----------
    function update(dt) {
        const follow = CONFIG.mode === 'follow';
        // No modo "seguir" a area de alcance e maior e a mola e mais fraca,
        // para as estrelas realmente irem atras do cursor.
        const R = follow ? CONFIG.radius * 1.8 : CONFIG.radius;
        const spring = follow ? CONFIG.spring * 0.35 : CONFIG.spring;
        const fr = Math.pow(CONFIG.friction, dt);

        for (const s of stars) {
            // subida lenta
            s.hy -= CONFIG.drift * (0.3 + s.z) * dt;
            if (s.hy < -10) {
                s.hy = H + 10;
                s.hx = Math.random() * W;
                s.ox = s.oy = s.vx = s.vy = 0;
            }

            // reacao ao mouse
            if (mouse.active && CONFIG.mode !== 'none') {
                const dx = (s.hx + s.ox) - mouse.x;
                const dy = (s.hy + s.oy) - mouse.y;
                const d = Math.hypot(dx, dy) || 1;

                if (d < R) {
                    const f = 1 - d / R;                       // 1 = colado no mouse, 0 = na borda
                    if (CONFIG.mode === 'repel') {
                        const force = f * CONFIG.repelStrength * (0.4 + s.z) * dt;
                        s.vx += (dx / d) * force;
                        s.vy += (dy / d) * force;
                    } else if (follow) {
                        const soft = Math.min(1, d / 25);      // evita "tremer" em cima do cursor
                        const force = f * CONFIG.followStrength * (0.4 + s.z) * dt * soft;
                        s.vx -= (dx / d) * force;
                        s.vy -= (dy / d) * force;
                    }
                }
            }

            // mola: puxa de volta para a origem
            s.vx += -s.ox * spring * dt;
            s.vy += -s.oy * spring * dt;
            s.vx *= fr;
            s.vy *= fr;
            s.ox += s.vx * dt;
            s.oy += s.vy * dt;
        }

        // rastro
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.life -= CONFIG.trailFade * dt;
            if (p.life <= 0) particles.splice(i, 1);
        }
    }

    // ---------- desenho ----------
    function draw(now) {
        ctx.clearRect(0, 0, W, H);

        for (const s of stars) {
            let a = s.alpha;
            if (CONFIG.twinkle && !reduceMotion) {
                a *= 0.65 + 0.35 * Math.sin(now * 0.001 * s.tw + s.phase);
            }
            const x = s.hx + s.ox;
            const y = s.hy + s.oy;

            if (s.r > 1.5) { // brilho suave nas estrelas maiores
                ctx.fillStyle = 'rgba(' + CONFIG.color + ',' + (a * 0.15) + ')';
                ctx.beginPath();
                ctx.arc(x, y, s.r * 3, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.fillStyle = 'rgba(' + CONFIG.color + ',' + a + ')';
            ctx.beginPath();
            ctx.arc(x, y, s.r, 0, Math.PI * 2);
            ctx.fill();
        }

        for (const p of particles) {
            ctx.fillStyle = 'rgba(' + CONFIG.color + ',' + (p.life * 0.9) + ')';
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * (0.4 + 0.6 * p.life), 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // ---------- loop ----------
    let last = performance.now();
    function frame(now) {
        const dt = Math.min((now - last) / 16.67, 3); // 1 = um frame a 60fps
        last = now;
        update(dt);
        draw(now);
        requestAnimationFrame(frame);
    }

    // ---------- mouse / toque ----------
    function spawnTrail(x, y) {
        if (!CONFIG.trail || reduceMotion) return;
        if (lastMouse) {
            const dist = Math.hypot(x - lastMouse.x, y - lastMouse.y);
            const n = Math.min(CONFIG.trailAmount, Math.floor(dist / 6));
            for (let i = 0; i < n && particles.length < 150; i++) {
                particles.push({
                    x: x + (Math.random() - 0.5) * 6,
                    y: y + (Math.random() - 0.5) * 6,
                    vx: (Math.random() - 0.5) * 0.6,
                    vy: (Math.random() - 0.5) * 0.6,
                    life: 1,
                    size: 1 + Math.random() * 1.8
                });
            }
        }
        lastMouse = { x: x, y: y };
    }

    function onMove(x, y) {
        mouse.x = x;
        mouse.y = y;
        mouse.active = true;
        spawnTrail(x, y);
    }

    function onLeave() {
        mouse.active = false;
        lastMouse = null;
    }

    window.addEventListener('mousemove', e => onMove(e.clientX, e.clientY));
    document.documentElement.addEventListener('mouseleave', onLeave);
    window.addEventListener('blur', onLeave);
    window.addEventListener('touchstart', e => onMove(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
    window.addEventListener('touchmove', e => onMove(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
    window.addEventListener('touchend', onLeave);
    window.addEventListener('resize', resize);

    // ---------- inicio ----------
    resize();
    if (!reduceMotion) requestAnimationFrame(frame);
})();