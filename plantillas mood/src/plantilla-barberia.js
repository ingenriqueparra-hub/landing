const MOODS = {
  urbano: {
    fonts: 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Nunito+Sans:wght@300;400;600;700&display=swap',
    heroImg: '1503951914875-452162b0f3f1',
    gradFrom: '#0e0e12', gradMid: '#1a1206',
    scanColor: 'rgba(196,154,60,.45)',
    showScan: true, showGrid: false, showDeco: false,
  },
  street: {
    fonts: 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Nunito+Sans:wght@300;400;600;700&display=swap',
    heroImg: '1560066984-138dadb4c035',
    gradFrom: '#111111', gradMid: '#1a0505',
    scanColor: 'rgba(230,57,70,.45)',
    showScan: true, showGrid: false, showDeco: false,
  },
  premium: {
    fonts: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,700&family=Nunito+Sans:wght@300;400;600&display=swap',
    heroImg: '1622286342621-4bd786c2447c',
    gradFrom: '#0a0a0a', gradMid: '#1a0f05',
    scanColor: null,
    showScan: false, showGrid: false, showDeco: true,
  }
};

function setMood(m) {
  const body = document.body;
  body.setAttribute('data-mood', m);
  // btns
  document.querySelectorAll('.mood-btn').forEach(b => b.classList.toggle('active', b.dataset.m === m));
  // font
  document.getElementById('gfont').href = MOODS[m].fonts;
  // hero bg
  const hbg = document.getElementById('hbg');
  const cfg = MOODS[m];
  hbg.style.background = `linear-gradient(135deg,${cfg.gradFrom} 0%,${cfg.gradMid} 60%,${cfg.gradFrom} 100%)`;
  const img = new Image();
  img.onload = () => { hbg.style.backgroundImage=`url('https://images.unsplash.com/photo-${cfg.heroImg}?w=1400&q=80&fit=crop')`; hbg.style.backgroundSize='cover'; hbg.style.backgroundPosition='center'; };
  img.src = `https://images.unsplash.com/photo-${cfg.heroImg}?w=1400&q=80&fit=crop`;
  // partículas
  rebuildParticles(m);
  initHeroAnim(m);
}

function initHeroAnim(m) {
  const cfg = MOODS[m];
  const scan = document.getElementById('hscan');
  const grid = document.getElementById('hgrid');
  const deco = document.getElementById('heroDeco');
  scan.style.opacity = cfg.showScan ? '1' : '0';
  if(cfg.showScan) scan.style.background = `linear-gradient(90deg,transparent,${cfg.scanColor},transparent)`;
  grid.style.opacity = cfg.showGrid ? '1' : '0';
  if(deco) deco.style.opacity = cfg.showDeco ? '1' : '0';
}

// Partículas
function rebuildParticles(m) {
  const a = document.getElementById('amb');
  a.innerHTML = '';
  const colors = {
    urbano: ['196,154,60','232,213,163'],
    street: ['230,57,70','255,107,107'],
    premium: ['184,115,51','212,169,106']
  };
  const c = colors[m];
  for(let i=0;i<30;i++){
    const d=document.createElement('div'),
      sz=Math.random()*2.5+.7, col=c[i%c.length],
      op=Math.random()*.1+.03, x=Math.random()*100,
      dur=Math.random()*25+15, dl=-(Math.random()*dur),
      dr=(Math.random()-.5)*130;
    d.style.cssText=`position:absolute;width:${sz}px;height:${sz}px;background:rgba(${col},${op});border-radius:50%;left:${x}%;bottom:-10px;animation:ambFloat ${dur}s linear ${dl}s infinite;--drift:${dr}px;`;
    a.appendChild(d);
  }
}

// Contadores
function animCount(el, val, dec=0, dur=1600) {
  const start = performance.now();
  const run = now => {
    const t = Math.min((now-start)/dur,1);
    const ease = 1-Math.pow(1-t,3);
    el.textContent = dec ? (ease*val).toFixed(dec) : Math.floor(ease*val);
    if(t<1) requestAnimationFrame(run);
  };
  requestAnimationFrame(run);
}

// Scroll reveal
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if(e.isIntersecting){
      e.target.classList.add('visible');
      if(e.target.id==='sRating') animCount(e.target, parseFloat(e.target.dataset.val)||0, 1);
      if(e.target.id==='sResenas') animCount(e.target, parseInt(e.target.dataset.val)||0);
      obs.unobserve(e.target);
    }
  });
}, {threshold:.15});
document.querySelectorAll('.reveal,#sRating,#sResenas').forEach(el=>obs.observe(el));

// Nav scroll
const nav = document.querySelector('#mood-selector');
// Init
setMood('urbano');
