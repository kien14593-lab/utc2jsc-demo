
window.UTC2=(function(){
const CATS={"tin-tuc-utc2-jsc": "Tin tức UTC2 JSC", "hoi-thao-cong-nghe": "Hội thảo công nghệ", "tin-tuc-nganh": "Tin tức ngành", "cong-trinh-tieu-bieu": "Công trình tiêu biểu", "giao-thong-van-tai": "Giao thông vận tải", "ha-tang-ky-thuat": "Hạ tầng kỹ thuật", "xay-dung-dan-dung": "Xây dựng dân dụng", "quy-hoach": "Quy hoạch", "phan-mem": "Phần mềm", "tai-lieu-xay-dung": "Tài liệu xây dựng", "van-ban-phap-luat": "Văn bản pháp luật"};
function fixHTML(html,R){return html.split('src="images/').join('src="'+R+'images/');}
function fixImg(p,R){if(!p)return null;if(/^https?:/.test(p))return p;return R+p;}
async function load(R){const r=await fetch(R+'data/posts.json?v='+Date.now());return await r.json();}
function card(p,R){
  const img=fixImg(p.img,R);
  const th=img?'<img src="'+img+'" alt="" loading="lazy">':'<div style="height:100%;display:flex;align-items:center;justify-content:center;font-size:40px">📰</div>';
  return '<a class="card rv in" href="'+R+'tin-tuc/bai-viet.html?id='+encodeURIComponent(p.id)+'">'
   +'<div class="thumb">'+th+'</div><div class="body">'
   +'<span class="cat">'+(CATS[p.cat]||p.cat)+'</span><h3>'+p.title+'</h3>'
   +(p.excerpt?'<p>'+p.excerpt+'</p>':'')
   +'<span class="meta">📅 '+(p.date||'')+'</span><span class="more">Đọc tiếp →</span></div></a>';
}
async function renderList(elId,cats,R,tabsElId){
  const el=document.getElementById(elId);
  let posts=(await load(R)).filter(p=>cats.includes(p.cat));
  const draw=list=>{el.innerHTML=list.length?list.map(p=>card(p,R)).join(''):'<p class="loading">Chưa có bài viết.</p>';};
  if(tabsElId){
    const tEl=document.getElementById(tabsElId);
    tEl.innerHTML='<button class="on" data-c="all">Tất cả</button>'+cats.filter(c=>posts.some(p=>p.cat===c)).map(c=>'<button data-c="'+c+'">'+CATS[c]+'</button>').join('');
    tEl.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{
      tEl.querySelectorAll('button').forEach(x=>x.classList.remove('on'));b.classList.add('on');
      draw(b.dataset.c==='all'?posts:posts.filter(p=>p.cat===b.dataset.c));
    }));
  }
  draw(posts);
}
async function renderPost(R){
  const id=new URLSearchParams(location.search).get('id');
  const posts=await load(R);
  const p=posts.find(x=>x.id===id)||posts[0];
  if(!p){document.getElementById('art').innerHTML='<p class="loading">Không tìm thấy bài viết.</p>';return;}
  document.title=p.title+' – UTC2 JSC';
  document.getElementById('art').innerHTML=
    '<h1 class="art-title">'+p.title+'</h1>'
    +'<div class="art-meta"><span class="c">'+(CATS[p.cat]||p.cat)+'</span><span>📅 Đăng ngày: '+(p.date||'')+'</span></div>'
    +'<div class="prose">'+fixHTML(p.html||('<p>'+(p.excerpt||'')+'</p>'),R)+'</div>';
  const rel=posts.filter(x=>x.cat===p.cat&&x.id!==p.id).slice(0,3);
  if(rel.length){document.getElementById('rel').innerHTML='<h2 style="color:var(--blue-900);margin:40px 0 20px;font-size:22px">Bài viết liên quan</h2><div class="grid3">'+rel.map(x=>card(x,R)).join('')+'</div>';}
}
async function renderHomeNews(elId,R){
  const el=document.getElementById(elId);
  const cats=['tin-tuc-utc2-jsc','hoi-thao-cong-nghe','tin-tuc-nganh'];
  const posts=(await load(R)).filter(p=>cats.includes(p.cat)).slice(0,3);
  el.innerHTML=posts.map(p=>card(p,R)).join('');
}
return{renderList,renderPost,renderHomeNews,CATS};
})();
