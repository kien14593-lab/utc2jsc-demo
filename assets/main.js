
// mobile menu
const bg=document.querySelector('.burger');
if(bg){bg.addEventListener('click',()=>document.querySelector('.menu').classList.toggle('open'));}
// reveal on scroll
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.rv').forEach(el=>io.observe(el));
// hero slider
const slides=document.querySelectorAll('.hero .slide');
if(slides.length){
  const dots=document.querySelectorAll('.hero .dots button');let cur=0;
  const go=i=>{slides[cur].classList.remove('on');dots[cur].classList.remove('on');cur=i;slides[cur].classList.add('on');dots[cur].classList.add('on')};
  dots.forEach((d,i)=>d.addEventListener('click',()=>go(i)));
  setInterval(()=>go((cur+1)%slides.length),5500);
}
// counters
const cs=document.querySelectorAll('[data-count]');
const cio=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;cio.unobserve(e.target);
  const el=e.target,t=+el.dataset.count,d=1400,s=performance.now();
  const tick=n=>{const p=Math.min((n-s)/d,1);el.textContent=Math.round(t*(1-Math.pow(1-p,3)))+(el.dataset.suffix||'');if(p<1)requestAnimationFrame(tick)};
  requestAnimationFrame(tick);}),{threshold:.5});
cs.forEach(el=>cio.observe(el));
// project filter (curated grid)
const pills=document.querySelectorAll('.pills[data-filter] button');
pills.forEach(b=>b.addEventListener('click',()=>{
  pills.forEach(x=>x.classList.remove('on'));b.classList.add('on');
  document.querySelectorAll('#prj-grid .card').forEach(c=>{
    c.style.display=(b.dataset.f==='all'||c.dataset.c===b.dataset.f)?'':'none';});
}));
