const MOODS={
  calma:{fonts:'https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=Nunito:wght@300;400;500;600&display=swap',heroImg:'1516302752625-fcc3c50ae61f',gradFrom:'#1a2e1a',gradMid:'#2d4a2d',breathe:true},
  calidez:{fonts:'https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=Nunito:wght@300;400;500;600&display=swap',heroImg:'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=2938&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',gradFrom:'#2a1005',gradMid:'#3d1f0a',breathe:true},
  sereno:{fonts:'https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=Nunito:wght@300;400;500;600&display=swap',heroImg:'1506126613408-eca07ce68773',gradFrom:'#0a1520',gradMid:'#1a3050',breathe:false}
};
function getHeroImageUrl(heroImg){
  if(heroImg.startsWith('https://images.unsplash.com/')) return heroImg;
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
  document.getElementById('hbreathe').style.opacity=cfg.breathe?'1':'0';
  rebuildParticles(m);
}
function rebuildParticles(m){
  const a=document.getElementById('amb');a.innerHTML='';
  const colors={calma:['90,122,90','138,106,74'],calidez:['196,124,58','139,69,19'],sereno:['74,111,165','124,154,191']};
  const c=colors[m];
  for(let i=0;i<25;i++){const d=document.createElement('div'),sz=Math.random()*2+.6,col=c[i%c.length],op=Math.random()*.08+.02,x=Math.random()*100,dur=Math.random()*30+18,dl=-(Math.random()*dur),dr=(Math.random()-.5)*100;d.style.cssText=`position:absolute;width:${sz}px;height:${sz}px;background:rgba(${col},${op});border-radius:50%;left:${x}%;bottom:-10px;animation:ambFloat ${dur}s linear ${dl}s infinite;--drift:${dr}px;`;a.appendChild(d);}
}
function animCount(el,val,dec=0,dur=1800){const start=performance.now();const run=now=>{const t=Math.min((now-start)/dur,1);const ease=1-Math.pow(1-t,3);el.textContent=dec?(ease*val).toFixed(dec):Math.floor(ease*val);if(t<1)requestAnimationFrame(run);};requestAnimationFrame(run);}
const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');if(e.target.id==='sRating')animCount(e.target,parseFloat(e.target.dataset.val)||0,1);if(e.target.id==='sResenas')animCount(e.target,parseInt(e.target.dataset.val)||0);obs.unobserve(e.target);}});},{threshold:.15});
document.querySelectorAll('.reveal,#sRating,#sResenas').forEach(el=>obs.observe(el));
setMood('calma');
