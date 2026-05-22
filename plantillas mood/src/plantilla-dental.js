const MOODS={
  clean:{fonts:'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap',heroImg:'https://images.unsplash.com/photo-1643660526741-094639fbe53a?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',gradFrom:'#0d2233',gradMid:'#1a6b8a',showGrid:false,breathe:false},
  calido:{fonts:'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap',heroImg:'https://images.unsplash.com/photo-1593022356769-11f762e25ed9?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',gradFrom:'#1a0e08',gradMid:'#3d2410',showGrid:false,breathe:true},
  tech:{fonts:'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap',heroImg:'1629909613654-28e377c37b09',gradFrom:'#050d1a',gradMid:'#0a1f35',showGrid:true,breathe:false}
};
function getHeroImageUrl(heroImg){
  if(heroImg.startsWith('https://images.unsplash.com/')) return heroImg;
  if(heroImg.startsWith('http')){
    const id=heroImg.split('-').pop();
    return `https://unsplash.com/photos/${id}/download?force=true&w=1400&q=80&fit=crop`;
  }
  return `https://images.unsplash.com/photo-${heroImg}?w=1400&q=80&fit=crop`;
}
function setMood(m){
  document.body.setAttribute('data-mood',m);
  document.querySelectorAll('.mood-btn').forEach(b=>b.classList.toggle('active',b.dataset.m===m));
  document.getElementById('gfont').href=MOODS[m].fonts;
  const hbg=document.getElementById('hbg');
  const cfg=MOODS[m];
  const heroUrl=getHeroImageUrl(cfg.heroImg);
  hbg.style.background=`linear-gradient(135deg,${cfg.gradFrom},${cfg.gradMid},${cfg.gradFrom})`;
  const img=new Image();
  img.onload=()=>{hbg.style.backgroundImage=`url('${heroUrl}')`;hbg.style.backgroundSize='cover';hbg.style.backgroundPosition='center';};
  img.src=heroUrl;
  document.getElementById('hgrid').style.opacity=cfg.showGrid?'1':'0';
  document.getElementById('hbreathe').style.opacity=cfg.breathe?'1':'0';
  rebuildParticles(m);
}
function rebuildParticles(m){
  const a=document.getElementById('amb'); a.innerHTML='';
  const colors={clean:['26,107,138','201,168,76'],calido:['74,124,89','196,124,58'],tech:['6,182,212','129,140,248']};
  const c=colors[m];
  for(let i=0;i<30;i++){const d=document.createElement('div'),sz=Math.random()*2.5+.7,col=c[i%c.length],op=Math.random()*.1+.03,x=Math.random()*100,dur=Math.random()*25+15,dl=-(Math.random()*dur),dr=(Math.random()-.5)*130;d.style.cssText=`position:absolute;width:${sz}px;height:${sz}px;background:rgba(${col},${op});border-radius:50%;left:${x}%;bottom:-10px;animation:ambFloat ${dur}s linear ${dl}s infinite;--drift:${dr}px;`;a.appendChild(d);}
}
function animCount(el,val,dec=0,dur=1600){const start=performance.now();const run=now=>{const t=Math.min((now-start)/dur,1);const ease=1-Math.pow(1-t,3);el.textContent=dec?(ease*val).toFixed(dec):Math.floor(ease*val);if(t<1)requestAnimationFrame(run);};requestAnimationFrame(run);}
const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');if(e.target.id==='sRating')animCount(e.target,parseFloat(e.target.dataset.val)||0,1);if(e.target.id==='sResenas')animCount(e.target,parseInt(e.target.dataset.val)||0);obs.unobserve(e.target);}});},{threshold:.15});
document.querySelectorAll('.reveal,#sRating,#sResenas').forEach(el=>obs.observe(el));
const waFloat=document.getElementById('wa-float');
function toggleWaFloat(){if(!waFloat)return;waFloat.classList.toggle('visible',window.scrollY>window.innerHeight*.55);}
window.addEventListener('scroll',toggleWaFloat,{passive:true});
toggleWaFloat();
setMood('clean');
