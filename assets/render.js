
window.UTC2=(function(){
const CATS={"tin-tuc-utc2-jsc": "Tin tức UTC2 JSC", "hoi-thao-cong-nghe": "Hội thảo công nghệ", "tin-tuc-nganh": "Tin tức ngành", "cong-trinh-tieu-bieu": "Công trình tiêu biểu", "giao-thong-van-tai": "Giao thông vận tải", "ha-tang-ky-thuat": "Hạ tầng kỹ thuật", "xay-dung-dan-dung": "Xây dựng dân dụng", "quy-hoach": "Quy hoạch", "phan-mem": "Phần mềm", "tai-lieu-xay-dung": "Tài liệu xây dựng", "van-ban-phap-luat": "Văn bản pháp luật", "hop-tac-trong-nuoc": "Hợp tác trong nước", "hop-tac-ngoai-nuoc": "Hợp tác ngoài nước"};
const CATS_EN={"tin-tuc-utc2-jsc": "UTC2 JSC News", "hoi-thao-cong-nghe": "Technology Workshops", "tin-tuc-nganh": "Industry News", "cong-trinh-tieu-bieu": "Featured Projects", "giao-thong-van-tai": "Transportation", "ha-tang-ky-thuat": "Technical Infrastructure", "xay-dung-dan-dung": "Civil Construction", "quy-hoach": "Urban Planning", "phan-mem": "Software", "tai-lieu-xay-dung": "Construction Documents", "van-ban-phap-luat": "Legal Documents", "hop-tac-trong-nuoc": "Domestic Cooperation", "hop-tac-ngoai-nuoc": "International Cooperation"};
const T={
 vi:{all:'Tất cả',read:'Đọc tiếp →',posted:'📅 Đăng ngày:',related:'Bài viết liên quan',none:'Chưa có bài viết.',notfound:'Không tìm thấy bài viết.'},
 en:{all:'All',read:'Read more →',posted:'📅 Posted:',related:'Related articles',none:'No articles yet.',notfound:'Article not found.',vnonly:'ℹ️ This article is currently available in Vietnamese only.'}
};
function catLabel(c,lang){return lang==='en'?(CATS_EN[c]||CATS[c]||c):(CATS[c]||c);}
function tt(p,lang){return (lang==='en'&&p.title_en)?p.title_en:p.title;}
function ex(p,lang){return (lang==='en'&&p.excerpt_en)?p.excerpt_en:p.excerpt;}
function fixHTML(html,R){return html.split('src="images/').join('src="'+R+'images/');}
function fixImg(p,R){if(!p)return null;if(/^https?:/.test(p))return p;return R+p;}
async function load(R){const r=await fetch(R+'data/posts.json?v='+Date.now());return await r.json();}
function card(p,R,viewer,lang){
  lang=lang||'vi';viewer=viewer||'tin-tuc/bai-viet.html';
  const img=fixImg(p.img,R);
  const th=img?'<img src="'+img+'" alt="" loading="lazy">':'<div style="height:100%;display:flex;align-items:center;justify-content:center;font-size:40px">📰</div>';
  const e=ex(p,lang);
  return '<a class="card rv in" href="'+R+viewer+'?id='+encodeURIComponent(p.id)+'">'
   +'<div class="thumb">'+th+'</div><div class="body">'
   +'<span class="cat">'+catLabel(p.cat,lang)+'</span><h3>'+tt(p,lang)+'</h3>'
   +(e?'<p>'+e+'</p>':'')
   +'<span class="meta">📅 '+(p.date||'')+'</span><span class="more">'+T[lang].read+'</span></div></a>';
}
async function renderList(elId,cats,R,tabsElId,viewer,lang){
  lang=lang||'vi';
  const el=document.getElementById(elId);
  let posts=(await load(R)).filter(p=>cats.includes(p.cat));
  const draw=list=>{el.innerHTML=list.length?list.map(p=>card(p,R,viewer,lang)).join(''):'<p class="loading">'+T[lang].none+'</p>';};
  if(tabsElId){
    const tEl=document.getElementById(tabsElId);
    tEl.innerHTML='<button data-c="all">'+T[lang].all+'</button>'+cats.map(c=>'<button data-c="'+c+'">'+catLabel(c,lang)+'</button>').join('');
    tEl.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{
      tEl.querySelectorAll('button').forEach(x=>x.classList.remove('on'));b.classList.add('on');
      draw(b.dataset.c==='all'?posts:posts.filter(p=>p.cat===b.dataset.c));
    }));
    const pre=new URLSearchParams(location.search).get('cat');
    const sel=(pre&&cats.includes(pre))?pre:'all';
    tEl.querySelector('button[data-c="'+sel+'"]').classList.add('on');
    draw(sel==='all'?posts:posts.filter(p=>p.cat===sel));
    return;
  }
  draw(posts);
}
async function renderPost(R,viewer,lang){
  lang=lang||'vi';
  const id=new URLSearchParams(location.search).get('id');
  const posts=await load(R);
  const p=posts.find(x=>x.id===id)||posts[0];
  if(!p){document.getElementById('art').innerHTML='<p class="loading">'+T[lang].notfound+'</p>';return;}
  const title=tt(p,lang);
  document.title=title+' – UTC2 JSC';
  let body;
  if(lang==='en'){
    body=p.html_en?p.html_en:('<div class="notice info">'+T.en.vnonly+'</div>'+(p.html||('<p>'+(p.excerpt||'')+'</p>')));
  }else{
    body=p.html||('<p>'+(p.excerpt||'')+'</p>');
  }
  document.getElementById('art').innerHTML=
    '<h1 class="art-title">'+title+'</h1>'
    +'<div class="art-meta"><span class="c">'+catLabel(p.cat,lang)+'</span><span>'+T[lang].posted+' '+(p.date||'')+'</span></div>'
    +'<div class="prose">'+fixHTML(body,R)+'</div>';
  const rel=posts.filter(x=>x.cat===p.cat&&x.id!==p.id).slice(0,3);
  if(rel.length){document.getElementById('rel').innerHTML='<h2 style="color:var(--blue-900);margin:40px 0 20px;font-size:22px">'+T[lang].related+'</h2><div class="grid3">'+rel.map(x=>card(x,R,viewer,lang)).join('')+'</div>';}
}
async function renderHomeNews(elId,R,viewer,lang){
  const el=document.getElementById(elId);
  const cats=['tin-tuc-utc2-jsc','hoi-thao-cong-nghe','tin-tuc-nganh'];
  const posts=(await load(R)).filter(p=>cats.includes(p.cat)).slice(0,3);
  el.innerHTML=posts.map(p=>card(p,R,viewer,lang)).join('');
}
async function renderCoop(elId,cat,R,lang){
  lang=lang||'vi';
  const el=document.getElementById(elId);
  const posts=(await load(R)).filter(p=>p.cat===cat);
  if(!posts.length){el.innerHTML='<p class="loading">'+T[lang].none+'</p>';return;}
  el.innerHTML=posts.map(p=>{
    const body=(lang==='en'&&p.html_en)?p.html_en:(p.html||('<p>'+(p.excerpt||'')+'</p>'));
    return '<h2>'+tt(p,lang)+'</h2>'
      +'<p style="color:#64748b;font-size:14px;margin-top:-6px">'+T[lang].posted+' '+(p.date||'')+'</p>'
      +fixHTML(body,R);
  }).join('\n<hr style="margin:36px 0;border:none;border-top:1px solid #e2e8f0">\n');
}
async function renderPartners(elId,R){
  const el=document.getElementById(elId);
  const r=await fetch(R+'data/partners.json?v='+Date.now());
  const list=await r.json();
  el.innerHTML=list.map(p=>'<div class="pcard"'+(p.name?' title="'+p.name+'"':'')+'><img src="'+fixImg(p.img,R)+'" alt="'+(p.name||'Đối tác UTC2 JSC')+'" loading="lazy">'+(p.name?'<span class="pname">'+p.name+'</span>':'')+'</div>').join('')||'<p class="loading">Chưa có đối tác.</p>';
}
return{renderList,renderPost,renderHomeNews,renderCoop,renderPartners,CATS};
})();
