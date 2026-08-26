
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
  if(t.tagName==='IMG'&&t.closest('.prose')&&!t.closest('a')){
    e.preventDefault();e.stopPropagation();
    gal=[...t.closest('.prose').querySelectorAll('img')].filter(x=>!x.closest('a')).map(x=>x.src);
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
// normalize content image sizes: small graphics keep natural size
function imgSize(im){
  if(im.closest('a'))return;
  if(im.naturalWidth&&im.naturalWidth<480)im.classList.add('img-sm');
}
document.querySelectorAll('.prose img').forEach(im=>{im.complete?imgSize(im):im.addEventListener('load',()=>imgSize(im),{once:true})});
document.addEventListener('load',e=>{
  if(e.target.tagName==='IMG'&&e.target.closest&&e.target.closest('.prose'))imgSize(e.target);
},true);

// ===== global search (self-injecting) =====
(function(){
  const nav=document.querySelector('header.site .nav');if(!nav)return;
  const ms=document.querySelector('script[src$="assets/main.js"]');if(!ms)return;
  const R=ms.getAttribute('src').replace('assets/main.js','');
  const EN=location.pathname.indexOf('/en/')>-1;
  const L=EN?{ph:'Search articles… (Ctrl+K)',hint:'Type at least 2 characters to search',none:'No results for',all:'articles'}
           :{ph:'Tìm kiếm bài viết… (Ctrl+K)',hint:'Nhập ít nhất 2 ký tự để tìm kiếm',none:'Không tìm thấy kết quả cho',all:'bài viết'};
  const CATS={'tin-tuc-utc2-jsc':'Tin tức UTC2 JSC','hoi-thao-cong-nghe':'Hội thảo công nghệ','tin-tuc-nganh':'Tin tức ngành','cong-trinh-tieu-bieu':'Công trình tiêu biểu','giao-thong-van-tai':'Giao thông vận tải','ha-tang-ky-thuat':'Hạ tầng kỹ thuật','xay-dung-dan-dung':'Xây dựng dân dụng','quy-hoach':'Quy hoạch','phan-mem':'Phần mềm','tai-lieu-xay-dung':'Tài liệu xây dựng','van-ban-phap-luat':'Văn bản pháp luật','hop-tac-trong-nuoc':'Hợp tác trong nước','hop-tac-ngoai-nuoc':'Hợp tác ngoài nước'};
  const CATS_EN={'tin-tuc-utc2-jsc':'UTC2 JSC News','hoi-thao-cong-nghe':'Technology Workshops','tin-tuc-nganh':'Industry News','cong-trinh-tieu-bieu':'Featured Projects','giao-thong-van-tai':'Transportation','ha-tang-ky-thuat':'Infrastructure','xay-dung-dan-dung':'Civil Construction','quy-hoach':'Planning','phan-mem':'Software','tai-lieu-xay-dung':'Construction Docs','van-ban-phap-luat':'Legal Docs','hop-tac-trong-nuoc':'Domestic Cooperation','hop-tac-ngoai-nuoc':'Intl Cooperation'};
  const PRJ=['cong-trinh-tieu-bieu','giao-thong-van-tai','ha-tang-ky-thuat','xay-dung-dan-dung','quy-hoach'];
  const LIB=['phan-mem','tai-lieu-xay-dung','van-ban-phap-luat'];
  const viewer=c=>EN?(PRJ.indexOf(c)>-1?'en/projects/detail.html':LIB.indexOf(c)>-1?'en/library/detail.html':'en/news/article.html')
                   :(PRJ.indexOf(c)>-1?'du-an/chi-tiet.html':LIB.indexOf(c)>-1?'thu-vien/chi-tiet.html':'tin-tuc/bai-viet.html');
  const norm=s=>(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d');
  const btn=document.createElement('button');btn.className='sch-btn';btn.type='button';btn.setAttribute('aria-label',EN?'Search':'Tìm kiếm');btn.textContent='🔍';
  const langSw=document.getElementById('lang-sw');
  nav.insertBefore(btn,langSw||nav.querySelector('.burger'));
  const ov=document.createElement('div');ov.className='sch-ov';
  ov.innerHTML='<div class="sch-box"><div class="sch-bar"><span>🔍</span><input type="text" placeholder="'+L.ph+'" aria-label="search"><button class="sch-x" aria-label="close">×</button></div><div class="sch-res"><p class="sch-hint">'+L.hint+'</p></div></div>';
  document.body.appendChild(ov);
  const inp=ov.querySelector('input'),res=ov.querySelector('.sch-res');
  let posts=null;
  function open(){ov.classList.add('open');document.body.style.overflow='hidden';inp.focus();
    if(!posts)fetch(R+'data/posts.json').then(r=>r.json()).then(j=>{posts=j;if(inp.value)run();});}
  function close(){ov.classList.remove('open');document.body.style.overflow='';}
  function run(){
    const q=norm(inp.value.trim());
    if(q.length<2){res.innerHTML='<p class="sch-hint">'+L.hint+'</p>';return;}
    if(!posts){res.innerHTML='<p class="sch-hint">…</p>';return;}
    const scored=[];
    for(const p of posts){
      const t=norm(EN&&p.title_en?p.title_en:p.title),e=norm(EN&&p.excerpt_en?p.excerpt_en:p.excerpt);
      let s=-1;
      if(t.indexOf(q)>-1)s=t.indexOf(q)===0?0:1;else if(e.indexOf(q)>-1)s=2;
      if(s>-1)scored.push([s,p]);
    }
    scored.sort((a,b)=>a[0]-b[0]);
    const top=scored.slice(0,20).map(x=>x[1]);
    if(!top.length){res.innerHTML='<p class="sch-hint">'+L.none+' “'+inp.value.trim()+'”</p>';return;}
    res.innerHTML=top.map(p=>{
      const t=EN&&p.title_en?p.title_en:p.title;
      const img=p.img?(/^https?:/.test(p.img)?p.img:R+p.img):null;
      const cl=EN?(CATS_EN[p.cat]||p.cat):(CATS[p.cat]||p.cat);
      return '<a class="sch-it" href="'+R+viewer(p.cat)+'?id='+encodeURIComponent(p.id)+'">'
        +(img?'<img src="'+img+'" alt="" loading="lazy">':'<span class="ni">📰</span>')
        +'<span class="tx"><b>'+t+'</b><span><span class="c">'+cl+'</span>'+(p.date?' · '+p.date:'')+'</span></span></a>';
    }).join('')+'<p class="sch-hint" style="padding:10px">'+top.length+(scored.length>20?'+':'')+' / '+posts.length+' '+L.all+'</p>';
  }
  btn.addEventListener('click',open);
  ov.querySelector('.sch-x').addEventListener('click',close);
  ov.addEventListener('click',e=>{if(e.target===ov)close();});
  inp.addEventListener('input',run);
  document.addEventListener('keydown',e=>{
    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();ov.classList.contains('open')?close():open();}
    else if(e.key==='Escape'&&ov.classList.contains('open'))close();
  });
})();
