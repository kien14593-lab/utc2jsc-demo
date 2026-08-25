// Header shadow
var hd=document.getElementById('header');
if(hd)addEventListener('scroll',function(){hd.classList.toggle('scrolled',scrollY>10)});

// Mobile menu
var burger=document.getElementById('burger'),menu=document.getElementById('menu');
if(burger&&menu){
  burger.onclick=function(){burger.classList.toggle('x');menu.classList.toggle('open')};
  menu.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){burger.classList.remove('x');menu.classList.remove('open')})});
}

// Hero slider (trang chu)
var slides=[].slice.call(document.querySelectorAll('.hero .slide')),dots=document.getElementById('dots');
if(slides.length&&dots){
  var cur=0;
  slides.forEach(function(_,i){var b=document.createElement('button');if(i===0)b.classList.add('on');b.onclick=function(){go(i)};dots.appendChild(b)});
  function go(i){slides[cur].classList.remove('on');dots.children[cur].classList.remove('on');cur=i;slides[cur].classList.add('on');dots.children[cur].classList.add('on')}
  setInterval(function(){go((cur+1)%slides.length)},5000);
}

// Reveal on scroll
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12});
document.querySelectorAll('.reveal').forEach(function(el){io.observe(el)});

// Counters
var cio=new IntersectionObserver(function(es){es.forEach(function(e){
  if(!e.isIntersecting)return;cio.unobserve(e.target);
  var el=e.target,end=+el.dataset.count,t0=performance.now();
  (function tick(t){var p=Math.min((t-t0)/1600,1);el.textContent=Math.round(end*(1-Math.pow(1-p,3)))+'+';if(p<1)requestAnimationFrame(tick)})(t0);
})},{threshold:.5});
document.querySelectorAll('[data-count]').forEach(function(el){cio.observe(el)});

// Project filter
document.querySelectorAll('.filter button').forEach(function(btn){btn.onclick=function(){
  var on=document.querySelector('.filter .on');if(on)on.classList.remove('on');btn.classList.add('on');
  var f=btn.dataset.f;
  document.querySelectorAll('.prj').forEach(function(p){p.classList.toggle('hide',f!=='all'&&p.dataset.c!==f)});
}});
