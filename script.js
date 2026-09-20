(() => {
  'use strict';

  const canvas = document.getElementById('canvas');
  const context = canvas.getContext('2d', { alpha: false });
  const intro = document.getElementById('intro');
  const startButton = document.getElementById('startButton');
  const endMessage = document.getElementById('endMessage');
  const status = document.getElementById('status');

  const phrases = [
    'Gracias por existir', 'Feliz día', 'Siempre brillas',
    'Eres para mí', 'Mi persona favorita', 'Por siempre', 'Flores para ti', 'Un sol para ti',
    'Te regalo flores amarillas', 'Que nunca te falte luz', 'Eres mi primavera',
    'Mi sol bonito', 'Que tu día florezca', 'Para alegrar tu día', 'Tu sonrisa ilumina todo',
    'Siempre pienso en ti', 'Un detalle lleno de amor', 'Que florezca tu felicidad',
    'Tu corazón es un jardín', 'Brillas más que el sol', 'Te quiero mucho',
    'Feliz Día de las Flores Amarillas', 'Estas flores son para ti',
    'Que florezca nuestro amor', 'Un ramo lleno de cariño',
    'Hoy elijo regalarte luz', 'Amarillo como nuestra alegría',
    'Eres mi flor favorita', 'Que nunca se apague tu brillo',
    'Un detalle para hacerte sonreír', 'Contigo siempre sale el sol',
    'Flores amarillas para mi persona especial', 'Te mereces todas las flores',
    'Que este día florezca para ti', 'Mi cariño florece contigo',
    'Un girasol para iluminarte', 'Hoy florece la felicidad',
    'Para ti, con todo mi amor', 'Tu luz hace bonito el mundo'
    , 'Flores para mi sol', 'Te pienso en amarillo', 'Para ti, mi alegría',
    'Mi amarilla favorita', 'Brillas como ellas', 'Eres mi primavera',
    'Amarillo nos queda bien', 'Florece conmigo', 'Tú y flores amarillas',
    'Mi felicidad eres tú', 'Para mi reina amarilla', 'Hoy y siempre, tú',
    'Sol en forma de flor', 'Te amo en amarillo', 'Mi lugar feliz',
    'Sonríe, son para ti', 'Eres luz', 'Mi 21.09 eres tú',
    'Amarillas como tu risa', 'Quiero verte florecer', 'Para mi corazón',
    'Tú iluminas todo', 'Mi color favorito eres tú', 'Flores de mi corazón',
    'Siempre tú', 'Un pedacito de sol', 'Para mi vida entera',
    'Te mereces esto y más', 'Mi promesa amarilla', 'Contigo todo florece',
    'Eres mi mejor regalo', 'Amarillas por ti', 'Mi amor bonito',
    'Que nunca se apaguen', 'Tú haces bonito todo', 'Mi eterna primavera',
    'Flores con amor', 'Pensando en ti', 'Eres mi solcito',
    'Todo amarillo por ti', 'Para mi persona favorita', 'Mi flor más linda',
    'Te elijo siempre', 'Brilla, mi amor', 'Amarillo de nosotros',
    'Mi felicidad amarilla', 'Para que sonrías', 'Mi amor florece por ti',
    'Siempre floreceremos'
  ];
  const colors = ['#fff9d5', '#ffe96c', '#ffd12f', '#ffffff', '#f4bd36'];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const state = { width: 0, height: 0, dpr: 1, running: false, startedAt: 0, last: 0, elapsed: 0, endShown: false, speed: 1 };
  const flowers = [];
  const particles = [];
  const words = [];
  const streaks = [];
  const backgroundBouquets = [];

  function random(min, max) { return min + Math.random() * (max - min); }
  function resetDepth(item, initial = false) {
    item.z = initial ? random(.08, 1.25) : random(1.02, 1.45);
    item.x = random(-1.1, 1.1);
    item.y = random(-1.25, 1.25);
    item.spin = random(-2.5, 2.5);
    item.rotation = random(0, Math.PI * 2);
  }

  function resetWordDepth(word, initial = false) {
    word.z = initial ? random(1.18, 1.45) : random(1.02, 1.45);
    const direction = random(0, Math.PI * 2);
    const distance = initial ? random(.08, .18) : random(.16, .3);
    word.x = Math.cos(direction) * distance;
    word.y = Math.sin(direction) * distance;
    word.spin = 0;
    word.rotation = 0;
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    state.dpr = Math.min(window.devicePixelRatio || 1, 1.35);
    state.width = rect.width;
    state.height = rect.height;
    canvas.width = Math.floor(rect.width * state.dpr);
    canvas.height = Math.floor(rect.height * state.dpr);
    context.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
  }

  function createScene() {
    flowers.length = 0; particles.length = 0; words.length = 0; streaks.length = 0;
    backgroundBouquets.length = 0;
    const flowerCount = state.width < 420 ? 42 : 56;
    const phraseCount = state.width < 420 ? 14 : 19;
    for (let i = 0; i < flowerCount; i++) flowers.push({ z: 0, x: 0, y: 0, size: random(16, 35), spin: 0, rotation: 0, phase: random(0, 6.28), speed: random(.48, 1.25), flip: Math.random() > .5 });
    for (let i = 0; i < phraseCount; i++) words.push({ z: 0, x: 0, y: 0, size: random(8, 17), spin: 0, rotation: 0, speed: random(.52, 1.2), phase: random(0, 6.28), text: phrases[i % phrases.length], color: colors[i % colors.length], alpha: random(.4, .9) });
    for (let i = 0; i < 80; i++) particles.push({ z: random(.03, 1), angle: random(0, Math.PI * 2), radius: random(.01, 1), size: random(.5, 1.8), speed: random(.7, 1.8), warm: Math.random() > .55 });
    for (let i = 0; i < 16; i++) streaks.push({ z: random(.02, 1), angle: random(0, Math.PI * 2), length: random(.04, .22), width: random(.12, .45), speed: random(.9, 1.7) });
    for (let i = 0; i < 4; i++) backgroundBouquets.push({ x: random(.08, .92), y: random(.2, .92), size: random(15, 24), rotation: random(-.28, .28), opacity: random(.16, .3) });
    flowers.forEach(item => { resetDepth(item, true); item.rotation = 0; });
    words.forEach(item => resetWordDepth(item, true));
  }

  function project(x, y, z) {
    const focal = Math.min(state.width, state.height) * .72;
    const scale = focal / Math.max(z, .035);
    return { x: state.width / 2 + x * scale, y: state.height / 2 + y * scale, scale };
  }

  function drawSunflower(x, y, size, rotation, opacity, flip) {
    context.save();
    context.translate(x, y);
    context.rotate(rotation);
    context.globalAlpha = opacity;
    context.lineCap = 'round';
    const stemEnd = size * (flip ? 1.45 : 1.2);

    context.strokeStyle = '#315f2b';
    context.lineWidth = Math.max(1, size * .055);
    context.beginPath();
    context.moveTo(0, size * .2);
    context.bezierCurveTo(size * .03, size * .55, flip ? -size * .08 : size * .08, size * .9, 0, stemEnd);
    context.stroke();

    function drawLeaf(side, yPosition, leafScale) {
      const direction = side * leafScale;
      context.save();
      context.translate(direction * size * .12, yPosition * size);
      context.rotate(side * .55);
      context.fillStyle = '#3e7e35';
      context.beginPath();
      context.moveTo(0, 0);
      context.bezierCurveTo(direction * size * .18, -size * .2, direction * size * .5, -size * .23, direction * size * .55, -size * .04);
      context.bezierCurveTo(direction * size * .43, size * .1, direction * size * .13, size * .12, 0, 0);
      context.fill();
      context.strokeStyle = '#6ba04b';
      context.lineWidth = Math.max(.45, size * .018);
      context.beginPath(); context.moveTo(0, 0); context.lineTo(direction * size * .43, -size * .07); context.stroke();
      context.restore();
    }

    drawLeaf(flip ? -1 : 1, .7, 1);
    drawLeaf(flip ? 1 : -1, .98, .82);

    const backPetalCount = 24;
    context.shadowColor = 'rgba(255, 183, 20, .38)';
    context.shadowBlur = Math.max(1, size * .06);
    for (let i = 0; i < backPetalCount; i++) {
      context.save();
      context.rotate(i * Math.PI * 2 / backPetalCount + Math.sin(i * 2.7) * .035);
      const petalLength = size * (.43 + (i % 4) * .025);
      const petalWidth = size * (.12 + (i % 3) * .012);
      context.fillStyle = i % 5 === 0 ? '#ffe477' : i % 2 === 0 ? '#f8b719' : '#e89b08';
      context.beginPath();
      context.moveTo(-petalWidth * .42, -size * .18);
      context.bezierCurveTo(-petalWidth * 1.05, -size * .48, -petalWidth * .82, -size * .78, 0, -size * .18 - petalLength);
      context.bezierCurveTo(petalWidth * .82, -size * .78, petalWidth * 1.05, -size * .48, petalWidth * .42, -size * .18);
      context.bezierCurveTo(petalWidth * .2, -size * .08, -petalWidth * .2, -size * .08, -petalWidth * .42, -size * .18);
      context.fill();
      context.restore();
    }
    context.shadowBlur = 0;
    const frontPetalCount = 20;
    for (let i = 0; i < frontPetalCount; i++) {
      context.save();
      context.rotate(i * Math.PI * 2 / frontPetalCount + .08 + Math.sin(i * 4.1) * .025);
      const petalLength = size * (.31 + (i % 3) * .025);
      const petalWidth = size * (.105 + (i % 4) * .01);
      context.fillStyle = i % 4 === 0 ? '#ffdf4d' : '#f5ad12';
      context.beginPath();
      context.moveTo(-petalWidth * .38, -size * .12);
      context.bezierCurveTo(-petalWidth, -size * .36, -petalWidth * .72, -size * .58, 0, -size * .1 - petalLength);
      context.bezierCurveTo(petalWidth * .72, -size * .58, petalWidth, -size * .36, petalWidth * .38, -size * .12);
      context.bezierCurveTo(petalWidth * .18, -.02 * size, -petalWidth * .18, -.02 * size, -petalWidth * .38, -size * .12);
      context.fill();
      context.restore();
    }

    context.shadowBlur = size * .04;
    const core = context.createRadialGradient(-size * .07, -size * .09, size * .03, 0, 0, size * .35);
    core.addColorStop(0, '#b8751d'); core.addColorStop(.38, '#70400f'); core.addColorStop(.78, '#3a1d08'); core.addColorStop(1, '#160b03');
    context.fillStyle = core;
    context.beginPath(); context.arc(0, 0, size * .34, 0, Math.PI * 2); context.fill();
    context.shadowBlur = 0;
    for (let ring = 1; ring < 5; ring++) {
      const seeds = ring * 7;
      for (let i = 0; i < seeds; i++) {
        const angle = i * 2.399 + ring * .4;
        const radius = size * (ring * .055);
        context.fillStyle = ring % 2 ? '#241105' : '#3a1b08';
        context.beginPath(); context.arc(Math.cos(angle) * radius, Math.sin(angle) * radius, Math.max(.3, size * .012), 0, Math.PI * 2); context.fill();
      }
    }
    context.restore();
  }

  function drawIntroFlower() {
    const time = performance.now();
    const centerX = state.width / 2;
    const centerY = state.height * .5;
    const flowers = [
      [-.42, .08, 17, .8, 0], [-.32, -.12, 20, -.5, 1], [-.22, .1, 22, .4, 0],
      [-.11, -.08, 24, -.7, 1], [0, .04, 31, .2, 0], [.1, -.1, 24, .6, 1],
      [.21, .09, 22, -.4, 0], [.32, -.12, 20, .7, 1], [.43, .07, 17, -.7, 0],
      [-.28, .25, 16, .3, 1], [0, .22, 20, -.5, 0], [.29, .24, 16, .8, 1]
    ];
    for (const [offsetX, offsetY, size, sway, flip] of flowers) {
      const movement = Math.sin(time / (650 + size * 8) + offsetX * 8) * 8;
      drawSunflower(centerX + offsetX * state.width + movement, centerY + offsetY * state.height, size, Math.sin(time / 1100 + sway) * .08, 1, flip);
    }
  }

  function drawBackground() {
    context.fillStyle = '#000'; context.fillRect(0, 0, state.width, state.height);
    const glow = context.createRadialGradient(state.width / 2, state.height / 2, 0, state.width / 2, state.height / 2, Math.max(state.width, state.height) * .58);
    glow.addColorStop(0, 'rgba(47, 30, 3, .24)'); glow.addColorStop(.32, 'rgba(15, 11, 2, .1)'); glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    context.fillStyle = glow; context.fillRect(0, 0, state.width, state.height);
    if (state.running) drawBackgroundBouquets();
  }

  function drawBackgroundBouquets() {
    for (const bouquet of backgroundBouquets) {
      const x = bouquet.x * state.width;
      const y = bouquet.y * state.height;
      const size = bouquet.size;
      context.save();
      context.translate(x, y);
      context.rotate(bouquet.rotation);
      context.strokeStyle = `rgba(45, 91, 35, ${bouquet.opacity * 1.35})`;
      context.lineWidth = Math.max(1, size * .06);
      context.beginPath(); context.moveTo(0, size * 1.7); context.quadraticCurveTo(-size * .15, size * .8, 0, 0); context.stroke();
      context.beginPath(); context.moveTo(0, size * 1.3); context.quadraticCurveTo(-size * .55, size * .95, -size * .72, size * .65); context.stroke();
      context.beginPath(); context.moveTo(-size * .05, size * 1.05); context.quadraticCurveTo(size * .55, size * .8, size * .68, size * .38); context.stroke();
      drawSunflower(0, 0, size, -.2, bouquet.opacity, false);
      drawSunflower(-size * .7, size * .62, size * .62, .5, bouquet.opacity * .85, true);
      drawSunflower(size * .68, size * .36, size * .56, -.6, bouquet.opacity * .8, false);
      context.restore();
    }
  }

  function drawParticles(delta, speed) {
    const cx = state.width / 2, cy = state.height / 2;
    context.save();
    context.globalCompositeOperation = 'lighter';
    for (const particle of particles) {
      particle.radius += delta * .00022 * particle.speed * speed;
      if (particle.radius > 1.25) { particle.radius = random(.01, .08); particle.angle = random(0, Math.PI * 2); }
      const distance = particle.radius * Math.max(state.width, state.height) * .72;
      const x = cx + Math.cos(particle.angle) * distance;
      const y = cy + Math.sin(particle.angle) * distance;
      const alpha = Math.max(0, 1 - particle.radius) * .78;
      context.fillStyle = particle.warm ? `rgba(255, 210, 63, ${alpha})` : `rgba(255, 250, 205, ${alpha})`;
      context.beginPath(); context.arc(x, y, particle.size * (1 + particle.radius * 2), 0, Math.PI * 2); context.fill();
    }
    for (const line of streaks) {
      line.z -= delta * .00042 * line.speed * speed;
      if (line.z < .015) { line.z = random(.7, 1.1); line.angle = random(0, Math.PI * 2); }
      const inner = project(Math.cos(line.angle) * .035, Math.sin(line.angle) * .035, line.z + line.length);
      const outer = project(Math.cos(line.angle) * .035, Math.sin(line.angle) * .035, line.z);
      context.strokeStyle = `rgba(255, ${190 + Math.floor(line.z * 55)}, 70, ${Math.min(.8, (1 - line.z) * 1.2)})`;
      context.lineWidth = line.width * .38 * (1 / Math.max(line.z, .08)); context.beginPath(); context.moveTo(inner.x, inner.y); context.lineTo(outer.x, outer.y); context.stroke();
    }
    context.restore();
  }

  function drawWorld(delta, speed) {
    flowers.sort((a, b) => b.z - a.z);
    words.sort((a, b) => b.z - a.z);
    context.textAlign = 'center'; context.textBaseline = 'middle';
    for (const word of words) {
      word.z -= delta * .00024 * word.speed * speed;
      word.rotation += delta * .00008 * word.spin;
      if (word.z < .035) resetWordDepth(word);
      const point = project(word.x, word.y, word.z);
      const size = Math.min(40, word.size / Math.max(word.z, .075));
      const alpha = Math.min(1, word.alpha * (1.2 - word.z));
      if (point.x > -150 && point.x < state.width + 150 && point.y > -50 && point.y < state.height + 50) {
        context.save(); context.translate(point.x, point.y); context.rotate(word.rotation); context.globalAlpha = Math.max(0, alpha);
        context.font = `${Math.max(10, size)}px Georgia, serif`; context.fillStyle = word.color; context.shadowColor = word.color; context.shadowBlur = Math.min(24, size * .7); context.fillText(word.text, 0, 0); context.restore();
      }
    }
    for (const flower of flowers) {
      flower.z -= delta * .00031 * flower.speed * speed;
      if (flower.z < .025) { resetDepth(flower); flower.rotation = 0; }
      const point = project(flower.x, flower.y, flower.z);
      const size = Math.min(118, flower.size / Math.max(flower.z, .09));
      const margin = size * 1.6;
      if (point.x > margin && point.x < state.width - margin && point.y > margin && point.y < state.height - margin) drawSunflower(point.x, point.y, size, flower.rotation, Math.min(1, (1.1 - flower.z) * 1.2), flower.flip);
    }
  }

  function frame(now) {
    if (!state.last) state.last = now;
    const delta = Math.min(34, now - state.last); state.last = now;
    drawBackground();
    if (state.running) {
      state.elapsed = now - state.startedAt;
      const cinematic = 1 + Math.sin(state.elapsed / 2100) * .16;
      const launch = Math.min(1, state.elapsed / 2300);
      const speed = (reduceMotion ? .35 : cinematic) * (.35 + launch * .65);
      drawParticles(delta, speed); drawWorld(delta, speed);
      if (!state.endShown && state.elapsed > 17000) { state.endShown = true; endMessage.classList.add('visible'); }
    } else drawIntroFlower();
    requestAnimationFrame(frame);
  }

  function start() {
    if (state.running) return;
    state.running = true; state.startedAt = performance.now(); state.last = state.startedAt; state.endShown = false;
    intro.classList.add('hidden'); endMessage.classList.remove('visible'); status.textContent = 'La animación está avanzando por el túnel de girasoles.';
  }

  function resizeScene() { resize(); createScene(); }

  startButton.addEventListener('click', start, { passive: true });
  window.addEventListener('resize', resizeScene);
  if ('ResizeObserver' in window) new ResizeObserver(resizeScene).observe(canvas);
  resizeScene(); requestAnimationFrame(frame);
})();
