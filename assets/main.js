
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
// lightbox: click content images to zoom
const lb=document.createElement('div');lb.className='lb';
lb.innerHTML='<button class="x" aria-label="Đóng">×</button><button class="nav pv" style="left:14px" aria-label="Ảnh trước">‹</button><img alt=""><button class="nav nx" style="right:14px" aria-label="Ảnh sau">›</button><span class="cnt"></span>';
document.body.appendChild(lb);
const lbImg=lb.querySelector('img'),lbCnt=lb.querySelector('.cnt'),lbPv=lb.querySelector('.pv'),lbNx=lb.querySelector('.nx');
let gal=[],gi=0;
function lbShow(i){gi=(i+gal.length)%gal.length;lbImg.src=gal[gi];
  const many=gal.length>1;lbPv.style.display=lbNx.style.display=many?'':'none';
  lbCnt.textContent=many?(gi+1)+' / '+gal.length:'';}
function lbClose(){lb.classList.remove('open');document.body.style.overflow='';}
document.addEventListener('click',e=>{
  const t=e.target;
  if(t.tagName==='IMG'&&t.closest('.prose')){
    e.preventDefault();e.stopPropagation();
    gal=[...t.closest('.prose').querySelectorAll('img')].map(x=>x.src);
    lb.classList.add('open');document.body.style.overflow='hidden';
    lbShow(gal.indexOf(t.src));
  }
},true);
lb.addEventListener('click',e=>{if(e.target===lb||e.target.classList.contains('x'))lbClose();});
lbPv.addEventListener('click',e=>{e.stopPropagation();lbShow(gi-1)});
lbNx.addEventListener('click',e=>{e.stopPropagation();lbShow(gi+1)});
document.addEventListener('keydown',e=>{
  if(!lb.classList.contains('open'))return;
  if(e.key==='Escape')lbClose();
  if(e.key==='ArrowLeft')lbShow(gi-1);
  if(e.key==='ArrowRight')lbShow(gi+1);
});
