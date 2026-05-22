const MOODS={
  dark:{fonts:'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;700&family=Playfair+Display:ital,wght@0,700;1,400&display=swap',heroImg:'1516035069371-29a1b244cc32',gradFrom:'#0a0a0a',gradMid:'#1a1a0a',showScan:true,showGrain:false,scanColor:'rgba(245,197,24,.3)'},
  editorial:{fonts:'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;700&family=Playfair+Display:ital,wght@0,700;1,400&display=swap',heroImg:'1452780212940-6f5c0d14d848',gradFrom:'#0a0a14',gradMid:'#14000a',showScan:true,showGrain:false,scanColor:'rgba(230,57,70,.35)'},
  vintage:{fonts:'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;700&family=Playfair+Display:ital,wght@0,700;1,400&display=swap',heroImg:'1502982720700-bfff97f2ecac',gradFrom:'#1a1208',gradMid:'#2e1a08',showScan:false,showGrain:true}
};
function setMood(m){
  document.body.setAttribute('data-mood',m);
  document.querySelectorAll('.mood-btn').forEach(b=>b.classList.toggle('active',b.dataset.m===m));
  document.getElementById('gfont').href=MOODS[m].fonts;
  const hbg=document.getElementById('hbg');
  const cfg=MOODS[m];
  hbg.style.background=`linear-gradient(135deg,${cfg.gradFrom},${cfg.gradMid},${cfg.gradFrom})`;
  const img=new Image();
  img.onload=()=>{hbg.style.backgroundImage=`url('https://images.unsplash.com/photo-${cfg.heroImg}?w=1400&q=80&fit=crop')`;hbg.style.backgroundSize='cover';hbg.style.backgroundPosition='center';};
  img.src=`https://images.unsplash.com/photo-${cfg.heroImg}?w=1400&q=80&fit=crop`;
  const scan=document.getElementById('hscan');
  const grain=document.getElementById('hgrain');
  scan.style.opacity=cfg.showScan?'1':'0';
  if(cfg.showScan)scan.style.background=`linear-gradient(90deg,transparent,${cfg.scanColor},transparent)`;
  grain.style.visibility=cfg.showGrain?'visible':'hidden';
  rebuildParticles(m);
}
function rebuildParticles(m){
  const a=document.getElementById('amb');a.innerHTML='';
  const colors={dark:['245,197,24','255,255,255'],editorial:['230,57,70','26,26,26'],vintage:['212,105,30','232,200,122']};
  const c=colors[m];
  for(let i=0;i<30;i++){const d=document.createElement('div'),sz=Math.random()*2.5+.7,col=c[i%c.length],op=Math.random()*.1+.03,x=Math.random()*100,dur=Math.random()*25+15,dl=-(Math.random()*dur),dr=(Math.random()-.5)*130;d.style.cssText=`position:absolute;width:${sz}px;height:${sz}px;background:rgba(${col},${op});border-radius:50%;left:${x}%;bottom:-10px;animation:ambFloat ${dur}s linear ${dl}s infinite;--drift:${dr}px;`;a.appendChild(d);}
}
function animCount(el,val,dec=0,dur=1600){const start=performance.now();const run=now=>{const t=Math.min((now-start)/dur,1);const ease=1-Math.pow(1-t,3);el.textContent=dec?(ease*val).toFixed(dec):Math.floor(ease*val);if(t<1)requestAnimationFrame(run);};requestAnimationFrame(run);}
const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');if(e.target.id==='sRating')animCount(e.target,parseFloat(e.target.dataset.val)||0,1);if(e.target.id==='sResenas')animCount(e.target,parseInt(e.target.dataset.val)||0);obs.unobserve(e.target);}});},{threshold:.15});
document.querySelectorAll('.reveal,#sRating,#sResenas').forEach(el=>obs.observe(el));
setMood('dark');
