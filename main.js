/* ══════════════════════════════════════════════
   1. THEME
   ══════════════════════════════════════════════ */
(function () {
  var hour = new Date().getHours();
  document.documentElement.setAttribute('data-theme', (hour >= 20 || hour < 7) ? 'dark' : 'light');

  function updateIcon() {
    var dark = document.documentElement.getAttribute('data-theme') === 'dark';
    var icon = document.querySelector('.toggle-icon');
    if (icon) icon.textContent = dark ? '🌙' : '☀️';
  }
  updateIcon();

  document.getElementById('theme-toggle').addEventListener('click', function () {
    var dark = document.documentElement.getAttribute('data-theme') === 'dark';
    document.documentElement.setAttribute('data-theme', dark ? 'light' : 'dark');
    updateIcon();
    if (window.bgApplyTheme) window.bgApplyTheme();
  });
})();

/* ══════════════════════════════════════════════
   2. CURSOR
   ══════════════════════════════════════════════ */
(function () {
  var dot  = document.getElementById('cursor-dot');
  var glow = document.getElementById('cursor-glow');
  var gx = innerWidth / 2, gy = innerHeight / 2, mx = gx, my = gy;

  document.addEventListener('mousemove', function (e) {
    mx = e.clientX; my = e.clientY;
    dot.style.left = e.clientX + 'px';
    dot.style.top  = e.clientY + 'px';
  });

  (function loop() {
    gx += (mx - gx) * 0.055; gy += (my - gy) * 0.055;
    glow.style.left = gx + 'px'; glow.style.top = gy + 'px';
    requestAnimationFrame(loop);
  })();

  var SEL = '.pill,.dot,.tag,.project-card,.cert-card,.contact-card,.stat-block';
  document.addEventListener('mouseenter', function (e) {
    if (e.target && e.target.closest && e.target.closest(SEL)) {
      dot.style.width = '16px'; dot.style.height = '16px'; dot.style.opacity = '0.4';
    }
  }, true);
  document.addEventListener('mouseleave', function (e) {
    if (e.target && e.target.closest && e.target.closest(SEL)) {
      dot.style.width = '8px'; dot.style.height = '8px'; dot.style.opacity = '1';
    }
  }, true);
})();

/* ══════════════════════════════════════════════
   3. TILT (subtle — only rotates, no translate)
   ══════════════════════════════════════════════ */
function initTilt() {
  document.querySelectorAll('.tilt-el').forEach(function (el) {
    el.addEventListener('mousemove', function (e) {
      var r = el.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width  - 0.5;
      var y = (e.clientY - r.top)  / r.height - 0.5;
      el.style.transform = 'perspective(700px) rotateY(' + (x * 7) + 'deg) rotateX(' + (-y * 6) + 'deg)';
      el.style.transition = 'transform 0.08s ease';
    });
    el.addEventListener('mouseleave', function () {
      el.style.transform = 'perspective(700px) rotateY(0) rotateX(0)';
      el.style.transition = 'transform 0.5s ease';
    });
  });
}

/* ══════════════════════════════════════════════
   4. TYPEWRITER
   ══════════════════════════════════════════════ */
(function () {
  var roles = ['Software Developer', 'Cloud Engineer', 'DevOps Engineer', 'ML Engineer', 'Full Stack Dev'];
  var rIdx = 0, cIdx = 0, del = false;
  var el = document.getElementById('typed-role');
  function run() {
    var w = roles[rIdx];
    if (!del) {
      el.textContent = w.slice(0, ++cIdx);
      if (cIdx === w.length) { del = true; setTimeout(run, 1500); return; }
      setTimeout(run, 82);
    } else {
      el.textContent = w.slice(0, --cIdx);
      if (cIdx === 0) { del = false; rIdx = (rIdx + 1) % roles.length; setTimeout(run, 320); return; }
      setTimeout(run, 44);
    }
  }
  run();
})();

/* ══════════════════════════════════════════════
   5. ELEGANT ANALOG CLOCK (persistent, HiDPI)
   ══════════════════════════════════════════════ */
(function () {
  var cvs = document.getElementById('clock-canvas');
  var ctx = cvs.getContext('2d');
  var label = document.getElementById('clock-time-label');

  var dpr = window.devicePixelRatio || 1;
  var S = 120;

  cvs.width = S * dpr;
  cvs.height = S * dpr;
  cvs.style.width = S + 'px';
  cvs.style.height = S + 'px';

  ctx.scale(dpr, dpr);

  var cx = S / 2;
  var cy = S / 2;
  var R = 56;

  function isDark() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  }

  function draw() {
    var now = new Date();

    var utc = now.getTime() + now.getTimezoneOffset() * 60000;
    var t = new Date(utc + 4 * 3600000);

    var hour = t.getHours() % 12;
    var minute = t.getMinutes();
    var second = t.getSeconds();

    var dark = isDark();

    var face = dark ? '#17171f' : '#fbfaf7';
    var faceHighlight = dark ? '#20202a' : '#ffffff';

    var outerBorder = dark
      ? '#6f6780'
      : '#b8b3ad';

    var outerBorderLight = dark
      ? 'rgba(210,200,225,0.25)'
      : 'rgba(80,70,65,0.18)';

    var rim = dark
      ? 'rgba(190,180,220,0.55)'
      : 'rgba(55,48,70,0.35)';

    var innerRing = dark
      ? 'rgba(210,205,225,0.16)'
      : 'rgba(60,50,70,0.13)';

    var text = dark ? '#f0edf5' : '#25222c';

    var marker = dark
      ? 'rgba(225,220,235,0.65)'
      : 'rgba(50,45,55,0.55)';

    var hourColor = dark ? '#f3f0f7' : '#24212b';
    var minuteColor = dark ? '#d5d0dc' : '#44404c';

    var accent = dark ? '#b39aff' : '#6c63ff';

    ctx.clearRect(0, 0, S, S);

    ctx.save();

    ctx.beginPath();
    ctx.arc(cx, cy, R + 2.5, 0, Math.PI * 2);

    ctx.shadowColor = dark
      ? 'rgba(0,0,0,0.55)'
      : 'rgba(25,20,35,0.18)';

    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 2;

    ctx.fillStyle = outerBorder;
    ctx.fill();

    ctx.restore();

    ctx.beginPath();
    ctx.arc(cx, cy, R + 1.2, 0, Math.PI * 2);

    ctx.strokeStyle = outerBorderLight;
    ctx.lineWidth = 1;

    ctx.stroke();

    var gradient = ctx.createRadialGradient(
      cx - 12,
      cy - 14,
      4,
      cx,
      cy,
      R
    );

    gradient.addColorStop(0, faceHighlight);
    gradient.addColorStop(1, face);

    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);

    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx, cy, R - 0.5, 0, Math.PI * 2);

    ctx.strokeStyle = rim;
    ctx.lineWidth = 1.4;

    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, R - 7, 0, Math.PI * 2);

    ctx.strokeStyle = innerRing;
    ctx.lineWidth = 0.7;

    ctx.stroke();

    for (var i = 0; i < 60; i++) {
      var angle =
        (i / 60) * Math.PI * 2 -
        Math.PI / 2;

      var isHour = i % 5 === 0;

      var outerRadius = R - 8;
      var innerRadius = isHour ? R - 14 : R - 11;

      ctx.beginPath();

      ctx.moveTo(
        cx + Math.cos(angle) * outerRadius,
        cy + Math.sin(angle) * outerRadius
      );

      ctx.lineTo(
        cx + Math.cos(angle) * innerRadius,
        cy + Math.sin(angle) * innerRadius
      );

      ctx.strokeStyle = marker;
      ctx.lineWidth = isHour ? 1.5 : 0.55;
      ctx.lineCap = 'round';

      ctx.stroke();
    }

    var romanNumerals = [
      '',
      'I',
      'II',
      'III',
      'IV',
      'V',
      'VI',
      'VII',
      'VIII',
      'IX',
      'X',
      'XI',
      'XII'
    ];

    ctx.fillStyle = text;
    ctx.font = 'bold 8px Georgia, "Times New Roman", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    var numberRadius = R - 20;

    for (var n = 1; n <= 12; n++) {
      var numberAngle =
        (n / 12) * Math.PI * 2 -
        Math.PI / 2;

      var nx =
        cx + Math.cos(numberAngle) * numberRadius;

      var ny =
        cy + Math.sin(numberAngle) * numberRadius;

      ctx.fillText(
        romanNumerals[n],
        nx,
        ny
      );
    }

    var hourAngle =
      ((hour + minute / 60) / 12) * Math.PI * 2 -
      Math.PI / 2;

    var minuteAngle =
      (minute / 60) * Math.PI * 2 -
      Math.PI / 2;

    var secondAngle =
      (second / 60) * Math.PI * 2 -
      Math.PI / 2;

    function drawArrowHand(angle, length, width, color) {
      var tipX = cx + Math.cos(angle) * length;
      var tipY = cy + Math.sin(angle) * length;

      var backLength = length * 0.25;

      var backX = cx - Math.cos(angle) * backLength;
      var backY = cy - Math.sin(angle) * backLength;

      var perpX = -Math.sin(angle);
      var perpY = Math.cos(angle);

      var halfWidth = width / 2;

      ctx.beginPath();

      ctx.moveTo(
        backX + perpX * halfWidth,
        backY + perpY * halfWidth
      );

      ctx.lineTo(
        tipX -
          Math.cos(angle) * 5 +
          perpX * halfWidth * 0.45,
        tipY -
          Math.sin(angle) * 5 +
          perpY * halfWidth * 0.45
      );

      ctx.lineTo(tipX, tipY);

      ctx.lineTo(
        tipX -
          Math.cos(angle) * 5 -
          perpX * halfWidth * 0.45,
        tipY -
          Math.sin(angle) * 5 -
          perpY * halfWidth * 0.45
      );

      ctx.lineTo(
        backX - perpX * halfWidth,
        backY - perpY * halfWidth
      );

      ctx.closePath();

      ctx.fillStyle = color;
      ctx.fill();

      ctx.beginPath();

      ctx.arc(
        cx - Math.cos(angle) * backLength,
        cy - Math.sin(angle) * backLength,
        width * 0.45,
        0,
        Math.PI * 2
      );

      ctx.fillStyle = color;
      ctx.fill();
    }

    drawArrowHand(
      hourAngle,
      27,
      4.5,
      hourColor
    );

    drawArrowHand(
      minuteAngle,
      38,
      3.2,
      minuteColor
    );

    ctx.beginPath();

    ctx.moveTo(
      cx - Math.cos(secondAngle) * 10,
      cy - Math.sin(secondAngle) * 10
    );

    ctx.lineTo(
      cx + Math.cos(secondAngle) * 45,
      cy + Math.sin(secondAngle) * 45
    );

    ctx.strokeStyle = accent;
    ctx.lineWidth = 1;
    ctx.lineCap = 'round';

    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, 4, 0, Math.PI * 2);

    ctx.fillStyle = accent;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx, cy, 1.6, 0, Math.PI * 2);

    ctx.fillStyle = face;
    ctx.fill();

    var hh = String(t.getHours()).padStart(2, '0');
    var mm = String(minute).padStart(2, '0');
    var ss = String(second).padStart(2, '0');

    label.textContent =
      hh + ':' + mm + ':' + ss;
  }

  window.drawClock = draw;

  function tick() {
    draw();

    var delay =
      1000 - new Date().getMilliseconds();

    setTimeout(tick, delay);
  }

  tick();
})();
/* ══════════════════════════════════════════════
   6. THREE.JS PARTICLE BACKGROUND
   ══════════════════════════════════════════════ */
(function () {
  var scene    = new THREE.Scene();
  var cam      = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 1000);
  cam.position.z = 30;
  var canvas   = document.getElementById('bg-canvas');
  var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

  var COUNT = 100, pData = [];
  var geo = new THREE.BufferGeometry();
  var pos = new Float32Array(COUNT * 3);
  for (var i = 0; i < COUNT; i++) {
    pos[i*3]   = (Math.random()-.5)*80;
    pos[i*3+1] = (Math.random()-.5)*50;
    pos[i*3+2] = (Math.random()-.5)*20;
    pData.push({ vx:(Math.random()-.5)*.010, vy:(Math.random()-.5)*.006, i:i });
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  var ptMat = new THREE.PointsMaterial({ color:0x6c63ff, size:0.24, transparent:true, opacity:0.28, sizeAttenuation:true });
  scene.add(new THREE.Points(geo, ptMat));

  var lBuf = new Float32Array(COUNT*COUNT*6);
  var lGeo = new THREE.BufferGeometry();
  var lMat = new THREE.LineBasicMaterial({ color:0x6c63ff, transparent:true, opacity:0.06 });
  var lSegs = new THREE.LineSegments(lGeo, lMat);
  scene.add(lSegs);

  function applyTheme() {
    var dark = document.documentElement.getAttribute('data-theme') === 'dark';
    renderer.setClearColor(dark ? 0x0c0c10 : 0xf5f4f0, 1);
    ptMat.color.set(dark ? 0xa78bfa : 0x6c63ff); ptMat.opacity = dark ? 0.35 : 0.25;
    lMat.color.set(dark ? 0xa78bfa : 0x6c63ff);  lMat.opacity  = dark ? 0.09 : 0.06;
  }
  applyTheme();
  window.bgApplyTheme = applyTheme;

  var mx3=0, my3=0;
  document.addEventListener('mousemove', function(e) {
    mx3 = (e.clientX/innerWidth-.5)*2; my3 = -(e.clientY/innerHeight-.5)*2;
  });

  (function tick() {
    requestAnimationFrame(tick);
    var p = geo.attributes.position.array;
    pData.forEach(function(d) {
      p[d.i*3]   += d.vx; if(p[d.i*3]>40)p[d.i*3]=-40; if(p[d.i*3]<-40)p[d.i*3]=40;
      p[d.i*3+1] += d.vy; if(p[d.i*3+1]>25)p[d.i*3+1]=-25; if(p[d.i*3+1]<-25)p[d.i*3+1]=25;
    });
    geo.attributes.position.needsUpdate = true;
    var lc=0;
    for(var a=0;a<COUNT;a++) for(var b=a+1;b<COUNT;b++) {
      var dx=p[a*3]-p[b*3],dy=p[a*3+1]-p[b*3+1],dz=p[a*3+2]-p[b*3+2];
      if(Math.sqrt(dx*dx+dy*dy+dz*dz)<8 && lc<lBuf.length/6) {
        lBuf[lc*6]=p[a*3];lBuf[lc*6+1]=p[a*3+1];lBuf[lc*6+2]=p[a*3+2];
        lBuf[lc*6+3]=p[b*3];lBuf[lc*6+4]=p[b*3+1];lBuf[lc*6+5]=p[b*3+2]; lc++;
      }
    }
    lGeo.setAttribute('position', new THREE.BufferAttribute(lBuf.slice(0,lc*6),3));
    cam.position.x += (mx3*3-cam.position.x)*0.02;
    cam.position.y += (my3*2-cam.position.y)*0.02;
    cam.lookAt(scene.position);
    renderer.render(scene,cam);
  })();

  window.addEventListener('resize', function() {
    cam.aspect = innerWidth/innerHeight; cam.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });
})();

/* ══════════════════════════════════════════════
   7. SLIDE NAVIGATION
   ══════════════════════════════════════════════ */
(function () {
  var TOTAL = 7, current = 0, animating = false;

  /* scroll wheel */
  var wheelCooldown = false;
  document.addEventListener('wheel', function (e) {
    e.preventDefault();
    if (animating || wheelCooldown) return;
    wheelCooldown = true;
    setTimeout(function() { wheelCooldown = false; }, 880);
    if (e.deltaY > 0 && current < TOTAL-1) window.goTo(current+1);
    else if (e.deltaY < 0 && current > 0)  window.goTo(current-1);
  }, { passive: false });

  function flipCounter(n) {
    var label = String(n+1).padStart(2,'0');
    var inner = document.getElementById('flip-inner');
    var next  = document.createElement('div');
    next.className = 'flip-digit'; next.textContent = label;
    inner.appendChild(next);
    gsap.to(inner, { y:-17, duration:0.32, ease:'power2.inOut', onComplete:function() {
      inner.firstChild.remove(); gsap.set(inner,{y:0});
    }});
  }

  function animIn($s, idx) {
    var d = 0.24;
    if (idx===0) {
      gsap.from($s.find('.hero-tag')[0],      {y:28,opacity:0,duration:0.6,delay:0.26,ease:'power3.out'});
      gsap.from($s.find('.hero-name .line'),  {y:52,opacity:0,duration:0.65,stagger:0.1,delay:0.4,ease:'power3.out'});
      gsap.from($s.find('.hero-sub')[0],      {y:16,opacity:0,duration:0.5,delay:0.6,ease:'power3.out'});
      gsap.from($s.find('.hero-meta')[0],     {y:12,opacity:0,duration:0.45,delay:0.72,ease:'power3.out'});
      gsap.from($s.find('.pill'),             {y:12,opacity:0,duration:0.42,stagger:0.06,delay:0.82,ease:'power3.out'});
      gsap.from($s.find('.scroll-hint')[0],   {opacity:0,duration:0.5,delay:1.2});
    } else if (idx===1) {
      gsap.from($s.find('.about-summary')[0], {x:-24,opacity:0,duration:0.55,delay:d,ease:'power3.out'});
      gsap.from($s.find('.stat-block'),       {y:20,opacity:0,stagger:0.07,delay:d+0.1,duration:0.48,ease:'power3.out'});
      gsap.from($s.find('.about-langs')[0],   {y:16,opacity:0,duration:0.45,delay:d+0.26,ease:'power3.out'});
    } else if (idx===2) {
      gsap.from($s.find('.timeline-card'),    {x:24,opacity:0,stagger:0.14,delay:d,duration:0.52,ease:'power3.out'});
    } else if (idx===3) {
      gsap.from($s.find('.edu-card')[0],      {y:24,opacity:0,duration:0.58,delay:d,ease:'power3.out'});
      gsap.from($s.find('.edu-note')[0],      {y:12,opacity:0,duration:0.44,delay:d+0.3,ease:'power3.out'});
    } else if (idx===4) {
      gsap.from($s.find('.skill-cluster'),    {y:18,opacity:0,stagger:0.06,delay:d,duration:0.46,ease:'power3.out'});
      gsap.from($s.find('.project-card'),     {y:14,opacity:0,stagger:0.07,delay:d+0.3,duration:0.42,ease:'power3.out'});
    } else if (idx===5) {
      gsap.from($s.find('.cert-card'),        {y:20,opacity:0,stagger:0.09,delay:d,duration:0.48,ease:'power3.out'});
    } else if (idx===6) {
      gsap.from($s.find('.contact-card'),     {y:20,opacity:0,stagger:0.09,delay:d,duration:0.48,ease:'power3.out'});
      gsap.from($s.find('.contact-footer')[0],{y:8,opacity:0,duration:0.4,delay:d+0.4,ease:'power3.out'});
    }
  }

  function updateNav() {
    flipCounter(current);
    $('.dot').removeClass('active').eq(current).addClass('active');
    $('#arrow-prev').css('opacity', current===0 ? 0.3 : 1);
    $('#arrow-next').css('opacity', current===TOTAL-1 ? 0.3 : 1);
  }

  window.goTo = function (next) {
    if (animating || next===current || next<0 || next>=TOTAL) return;
    animating = true;
    var dir  = next > current ? 1 : -1;
    var $cur = $('#slide-'+current), $nxt = $('#slide-'+next);
    gsap.set($nxt[0], { opacity:0, x:dir*90 });
    $nxt.addClass('active');
    gsap.timeline({ onComplete:function() {
      $cur.removeClass('active'); gsap.set($cur[0],{opacity:0,x:0});
      current=next; updateNav(); animating=false;
    }})
    .to($cur[0], {opacity:0, x:dir*-72, duration:0.48, ease:'power2.in'},0)
    .to($nxt[0], {opacity:1, x:0,       duration:0.56, ease:'power2.out'},0.12);
    animIn($nxt, next);
  };

  $(document).ready(function () {
    $('#arrow-next').on('click', function() { window.goTo(current+1); });
    $('#arrow-prev').on('click', function() { window.goTo(current-1); });
    $('.dot').on('click', function() { window.goTo(parseInt($(this).data('index'))); });

    $(document).on('keydown', function(e) {
      if (e.key==='ArrowRight'||e.key==='ArrowDown') window.goTo(current+1);
      else if (e.key==='ArrowLeft'||e.key==='ArrowUp') window.goTo(current-1);
    });

    var tx=0;
    $(document).on('touchstart', function(e) { tx=e.originalEvent.changedTouches[0].screenX; });
    $(document).on('touchend', function(e) {
      var dx=e.originalEvent.changedTouches[0].screenX-tx;
      if (Math.abs(dx)>50) { if(dx<0) window.goTo(current+1); else window.goTo(current-1); }
    });

    gsap.set('#slide-0',{opacity:1,x:0});
    animIn($('#slide-0'),0);
    updateNav();
    $('#arrow-prev').css('opacity',0.3);

    initTilt();
  });
})();