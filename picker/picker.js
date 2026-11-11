/* LANZAGAMES picker: billboard previews, row selection, EN/JA, continue, Secret gate. */
(function(){
'use strict';
var D=JSON.parse(document.getElementById('pickerData').textContent);
var G={};D.games.forEach(function(g){G[g.id]=g});
var $=function(id){return document.getElementById(id)};
var store={get:function(k){try{return localStorage.getItem(k)}catch(e){return null}},set:function(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
var lang=store.get('picker_lang')||((navigator.language||'').toLowerCase().indexOf('ja')===0?'ja':'en');
var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
var saveData=navigator.connection&&navigator.connection.saveData;
var canHover=window.matchMedia&&matchMedia('(hover: hover) and (pointer: fine)').matches;
var noAuto=reduce||(/[?&]noauto=1/).test(location.search);
var cur=null,curTile=null;
var lastPtr=null; // set by the first real pointer or key event
document.addEventListener('pointerdown',function(e){lastPtr=e.pointerType||'mouse'},true);
document.addEventListener('keydown',function(){lastPtr='key'},true);

/* ---------- hero / billboard ---------- */
var poster=$('heroPoster'),vids=[$('vA'),$('vB')],vi=0,heroBody=document.querySelector('.hero-body');
var MONTHS=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function fmtMeta(g){
  var n=g.rev||0, p=(g.updated||'').split('-');
  if(p.length!==3)return '';
  if(lang==='ja'){
    return '改訂'+n+'回 · 最終更新 '+p[0]+'年'+parseInt(p[1],10)+'月'+parseInt(p[2],10)+'日';
  }
  var word=n===1?'revision':'revisions';
  return n+' '+word+' · Last updated '+MONTHS[parseInt(p[1],10)-1]+' '+parseInt(p[2],10)+', '+p[0];
}
function setHero(id,opts){
  var g=G[id];if(!g)return;
  var same=cur===id;cur=id;
  var t=g[lang];
  $('heroTitle').textContent=t[0];$('heroGenre').textContent=t[1];$('heroDesc').textContent=t[2];
  var meta=$('heroMeta');if(meta)meta.textContent=fmtMeta(g);
  $('heroNew').hidden=!g.new;
  var play=$('heroPlay');play.href=id+'/';play.dataset.game=id;
  $('heroPlayLabel').textContent=D.ui[lang][g.secret?'open_secret':'play'];
  if(same&&!(opts&&opts.force))return;
  if(opts&&opts.keepVideo)return;
  if(!(opts&&opts.instant)){heroBody.classList.remove('fade');void heroBody.offsetWidth;heroBody.classList.add('fade')}
  if(poster.getAttribute('src')!=='picker/posters/'+id+'.webp'){poster.src='picker/posters/'+id+'.webp'}
  playPreview(id,g);
}
var pvTimer=0,autoArmed=false;
function playPreview(id,g){
  clearTimeout(pvTimer);
  autoArmed=false;
  var bar=$('heroBar');if(bar)bar.style.width='0';
  vids.forEach(function(v){v.classList.remove('on');v.onended=null});
  if(reduce||saveData)return;
  pvTimer=setTimeout(function(){
    vi^=1;var v=vids[vi];
    vids[vi^1].pause();
    var src='picker/previews/'+id+'.mp4';
    v.onplaying=function(){if(cur===id)v.classList.add('on')};
    v.onended=function(){if(cur===id)advanceHero()};
    v.onloadeddata=function(){if(cur===id){var pr=v.play();if(pr&&pr.catch)pr.catch(function(){})}};
    if(v.getAttribute('src')!==src){v.src=src;v.load()}else{try{v.currentTime=0}catch(e){}}
    var pr=v.play();if(pr&&pr.catch)pr.catch(function(){});
  },canHover?350:120);
}

/* ---------- auto-advance the billboard when a trailer finishes, or after idle ---------- */
var userPaused=false,idleTimer=0,fallbackTimer=0;
function bumpIdle(){
  if(noAuto)return;
  userPaused=true;
  clearTimeout(idleTimer);clearTimeout(fallbackTimer);
  idleTimer=setTimeout(function(){userPaused=false;armFallback()},7000);
}
function armFallback(){
  clearTimeout(fallbackTimer);
  if(noAuto||userPaused||document.hidden)return;
  var v=vids[vi], wait=8000;
  if(v&&v.duration&&isFinite(v.duration))wait=Math.max(2500,(v.duration-v.currentTime)*1000+200);
  fallbackTimer=setTimeout(function(){if(!userPaused)advanceHero()},wait);
}
function allTiles(){return [].slice.call(document.querySelectorAll('.row[data-rowid="all"] .tile:not(.clone)'))}
function originalTile(id){return document.querySelector('.row[data-rowid="all"] .tile[data-game="'+id+'"]:not(.clone)')}
function advanceHero(){
  if(noAuto||userPaused||document.hidden)return;
  var list=allTiles();if(!list.length)return;
  var i=list.findIndex(function(t){return t.dataset.game===cur});
  var nx=list[(i+1+list.length)%list.length];
  if(!nx)return;
  select(nx,{fromAuto:true});
  if(nx.scrollIntoView)nx.scrollIntoView({block:'nearest',inline:'center',behavior:reduce?'auto':'smooth'});
}
['pointerdown','wheel','keydown'].forEach(function(ev){
  document.addEventListener(ev,function(){bumpIdle()}, {passive:true});
});

/* ---------- tiles & selection ---------- */
var tiles=[].slice.call(document.querySelectorAll('.tile'));
function select(tile,opts){
  if(curTile)curTile.classList.remove('sel');
  curTile=tile;tile.classList.add('sel');
  setHero(tile.dataset.game,opts);
  if(!(opts&&opts.fromAuto))bumpIdle();
}
function bindTile(tile){
  var wasSel=false,hv=0;
  tile.addEventListener('pointerdown',function(e){wasSel=(curTile===tile)},true);
  tile.addEventListener('focus',function(){if(lastPtr!=='key')return;select(tile)});
  tile.addEventListener('pointerenter',function(e){
    if(e.pointerType!=='mouse')return;
    clearTimeout(hv);hv=setTimeout(function(){select(tile);showTilePreview(tile)},180);
  });
  tile.addEventListener('pointerleave',function(){clearTimeout(hv);hideTilePreview(tile)});
  tile.addEventListener('click',function(e){
    var id=tile.dataset.game;
    if((lastPtr==='touch'||lastPtr==='pen')&&!wasSel&&curTile!==tile){ // first tap selects; second tap opens
      e.preventDefault();select(tile);
      var hero=$('hero').getBoundingClientRect();if(hero.bottom<80)window.scrollTo({top:0,behavior:reduce?'auto':'smooth'});
      return;
    }
    wasSel=false;
    if(G[id]&&G[id].secret){e.preventDefault();openSecret();return}
    store.set('picker_last',id);
  });
}
tiles.forEach(bindTile);
$('heroPlay').addEventListener('click',function(e){
  var id=this.dataset.game;
  if(G[id]&&G[id].secret){e.preventDefault();openSecret();return}
  store.set('picker_last',id);
});

/* hover preview on a tile, Netflix-style (desktop only, one shared video) */
var hoverVid=document.createElement('video');
hoverVid.muted=true;hoverVid.loop=true;hoverVid.playsInline=true;hoverVid.setAttribute('disablepictureinpicture','');
hoverVid.className='tile-hover-vid';hoverVid.setAttribute('aria-hidden','true');
var hoverTile=null;
function showTilePreview(tile){
  if(!canHover||reduce||saveData)return;
  var id=tile.dataset.game;if(!id)return;
  if(hoverTile&&hoverTile!==tile)hoverTile.classList.remove('is-previewing');
  hoverTile=tile;tile.classList.add('is-previewing');
  var src='picker/previews/'+id+'.mp4';
  if(hoverVid.parentNode!==tile)tile.appendChild(hoverVid);
  if(hoverVid.getAttribute('src')!==src){hoverVid.src=src;hoverVid.load()}
  var pr=hoverVid.play();if(pr&&pr.catch)pr.catch(function(){});
}
function hideTilePreview(tile){
  if(hoverTile!==tile)return;
  tile.classList.remove('is-previewing');
  hoverVid.pause();
  hoverTile=null;
}

/* swipe: selection follows the tile that snaps to the start of the row (touch only) */
function trackOf(t){return t.closest('.track')}
function oneSetWidth(tr){
  var n=+(tr.dataset.setCount||0);if(!n)return 0;
  var a=tr.children[n], b=tr.children[n*2];
  if(!a||!b)return 0;
  return b.offsetLeft-a.offsetLeft;
}
function loopStart(tr){
  var n=+(tr.dataset.setCount||0);if(!n||!tr.children[n])return 0;
  var pad=parseFloat(getComputedStyle(tr).scrollPaddingLeft)||0;
  return tr.children[n].offsetLeft-pad;
}
var quietScroll=0;
function beginQuiet(){quietScroll++}
function endQuiet(){requestAnimationFrame(function(){requestAnimationFrame(function(){quietScroll=Math.max(0,quietScroll-1)})})}
function withQuiet(fn){beginQuiet();try{fn()}finally{endQuiet()}}
function normalizeLoop(tr){
  var w=oneSetWidth(tr);if(w<20)return;
  var start=loopStart(tr), x=tr.scrollLeft, n=x, slop=24;
  if(x>=start+w+slop)n=x-w;
  else if(x<=start-slop)n=x+w;
  if(Math.abs(n-x)>0.5)withQuiet(function(){tr.scrollLeft=n});
}
function goToOriginals(tr){
  withQuiet(function(){tr.scrollLeft=loopStart(tr)});
}
function setupLoop(tr){
  if(tr.dataset.looped||tr.id==='continueTrack'||reduce)return;
  var kids=[].slice.call(tr.children);
  if(kids.length<2)return;
  var before=document.createDocumentFragment(),after=document.createDocumentFragment();
  kids.forEach(function(c){
    [before,after].forEach(function(frag){
      var x=c.cloneNode(true);
      x.removeAttribute('id');x.classList.add('clone');
      bindTile(x);frag.appendChild(x);
    });
  });
  tr.insertBefore(before,tr.firstChild);
  tr.appendChild(after);
  tr.dataset.looped='1';
  tr.dataset.setCount=String(kids.length);
  tr.style.scrollSnapType='x proximity';
  requestAnimationFrame(function(){goToOriginals(tr)});
}
[].slice.call(document.querySelectorAll('.track')).forEach(function(tr){
  var tm=0;
  setupLoop(tr);
  tr.addEventListener('scroll',function(){
    updateNav(tr);
    if(tr.dataset.looped){clearTimeout(tr._loopT);tr._loopT=setTimeout(function(){normalizeLoop(tr)},80)}
    if(quietScroll)return;
    bumpIdle();
    if(lastPtr!=='touch'&&lastPtr!=='pen')return;
    clearTimeout(tm);tm=setTimeout(function(){
      var pad=parseFloat(getComputedStyle(tr).scrollPaddingLeft)||0,best=null,bd=1e9,x=tr.getBoundingClientRect().left+pad;
      [].forEach.call(tr.children,function(c){if(c.classList.contains('clone'))return;var d=Math.abs(c.getBoundingClientRect().left-x);if(d<bd){bd=d;best=c}});
      if(best&&best!==curTile)select(best);
    },140);
  },{passive:true});
  var wrap=tr.parentNode,prev=wrap.querySelector('.prev'),next=wrap.querySelector('.next');
  function page(dir){
    if(tr.dataset.looped)normalizeLoop(tr);
    tr.scrollBy({left:dir*tr.clientWidth*0.85,behavior:reduce?'auto':'smooth'});
  }
  if(prev)prev.addEventListener('click',function(){page(-1)});
  if(next)next.addEventListener('click',function(){page(1)});
  updateNav(tr);
});
function updateNav(tr){
  var w=tr.parentNode,p=w.querySelector('.prev'),n=w.querySelector('.next');if(!p)return;
  if(tr.dataset.looped){p.disabled=false;n.disabled=false;return}
  p.disabled=tr.scrollLeft<4;n.disabled=tr.scrollLeft+tr.clientWidth>=tr.scrollWidth-4;
}

/* keyboard: arrows move along a row and between rows */
document.addEventListener('keydown',function(e){
  if($('spGate').style.display!=='none')return;
  var a=document.activeElement,k=e.key;
  if(!/^Arrow(Left|Right|Up|Down)$/.test(k))return;
  var all=[].slice.call(document.querySelectorAll('.row:not([hidden]) .track'));
  if(!a||!a.classList.contains('tile')){
    a=(curTile&&curTile.offsetParent)?curTile:all[0]&&all[0].querySelector('.tile:not(.clone)');
    if(!a)return;
  }
  var tr=trackOf(a),kids=[].slice.call(tr.children),i=kids.indexOf(a),ti=all.indexOf(tr),nx=null,setN=+(tr.dataset.setCount||0);
  if(k==='ArrowRight')nx=kids[i+1]||(setN?kids[setN]:null);
  if(k==='ArrowLeft')nx=kids[i-1]||(setN?kids[setN*2-1]:null);
  if(k==='ArrowDown'||k==='ArrowUp'){
    var t2=all[ti+(k==='ArrowDown'?1:-1)];
    if(!t2&&k==='ArrowUp'){e.preventDefault();$('heroPlay').focus();window.scrollTo({top:0,behavior:reduce?'auto':'smooth'});return}
    if(t2){
      var n2=+(t2.dataset.setCount||0) || t2.children.length;
      var idx=setN? (i%setN) : i;
      var t2kids=[].slice.call(t2.children);
      var base=n2&&t2.dataset.looped?n2:0;
      nx=t2kids[base+Math.min(idx,n2-1)];
    }
  }
  if(nx){e.preventDefault();nx.focus({preventScroll:true});nx.scrollIntoView({block:'nearest',inline:'nearest',behavior:reduce?'auto':'smooth'})}
});

/* ---------- continue row ---------- */
function buildContinue(){
  var last=store.get('picker_last'),row=$('continueRow'),tr=$('continueTrack');
  tr.innerHTML='';
  if(!last||!G[last]){row.hidden=true;return null}
  var src=originalTile(last)||document.querySelector('.tile[data-game="'+last+'"]:not(.clone)');
  if(!src){row.hidden=true;return null}
  var c=src.cloneNode(true);c.removeAttribute('id');c.classList.add('cont');c.classList.remove('sel','clone','is-previewing');c.dataset.row='cont';c.removeAttribute('aria-hidden');c.tabIndex=0;
  var hv=c.querySelector('.tile-hover-vid');if(hv)hv.remove();
  var b=c.querySelector('.badge');if(b)b.remove();
  c.querySelector('.tile-genre').removeAttribute('data-g');
  c.querySelector('.tile-genre').setAttribute('data-i18n','last');
  tr.appendChild(c);bindTile(c);row.hidden=false;return c;
}

/* ---------- language ---------- */
function applyLang(){
  document.documentElement.lang=lang;
  var u=D.ui[lang];
  [].forEach.call(document.querySelectorAll('[data-i18n]'),function(el){var k=el.getAttribute('data-i18n');if(u[k]!=null)el.textContent=u[k]});
  [].forEach.call(document.querySelectorAll('[data-i18n-row]'),function(el){el.textContent=D.rows[el.getAttribute('data-i18n-row')][lang]});
  [].forEach.call(document.querySelectorAll('[data-t]'),function(el){el.textContent=G[el.getAttribute('data-t')][lang][0]});
  [].forEach.call(document.querySelectorAll('[data-g]'),function(el){el.textContent=G[el.getAttribute('data-g')][lang][1]});
  var b=$('langBtn');b.textContent=u.lang;b.setAttribute('lang',lang==='en'?'ja':'en');b.setAttribute('aria-label',u.lang_label);
  if(cur)setHero(cur,{force:true,instant:true,keepVideo:true});
}
$('langBtn').addEventListener('click',function(){lang=lang==='en'?'ja':'en';store.set('picker_lang',lang);applyLang()});

/* ---------- header solid on scroll ---------- */
var top=document.querySelector('.top');
function onScroll(){top.classList.toggle('solid',window.scrollY>40)}
window.addEventListener('scroll',onScroll,{passive:true});onScroll();

/* ---------- Secret Project gate (same ids/keys as before) ---------- */
var gate=$('spGate'),pw=$('spPw'),lastFocus=null;
function openSecret(){
  if(store.get('secret_pw_ok')==='pumpkin'){location.href='secret/';return}
  lastFocus=document.activeElement;
  gate.style.display='flex';pw.value='';$('spErr').textContent='';
  setTimeout(function(){pw.focus()},50);
}
function closeSecret(){gate.style.display='none';if(lastFocus&&lastFocus.focus)lastFocus.focus({preventScroll:true})}
function go(){
  if(pw.value.trim().toLowerCase()==='pumpkin'){store.set('secret_pw_ok','pumpkin');location.href='secret/'}
  else{$('spErr').textContent=D.ui[lang].pw_wrong;pw.value=''}
}
$('spGo').onclick=go;
pw.addEventListener('keydown',function(e){if(e.key==='Enter')go()});
$('spX').onclick=closeSecret;
gate.addEventListener('keydown',function(e){if(e.key==='Escape')closeSecret()});
gate.addEventListener('click',function(e){if(e.target===gate)closeSecret()});
window.__picker={select:function(id){var t=originalTile(id);if(t)select(t)},openSecret:openSecret,advance:advanceHero};

/* ---------- start ---------- */
var c=buildContinue();
applyLang();
var first=originalTile(D.games[0].id)||document.querySelector('.row[data-rowid="all"] .tile:not(.clone)');
select(first,{force:true,instant:true,fromAuto:true});
if(!noAuto)armFallback();
// pause previews when tab hidden
document.addEventListener('visibilitychange',function(){
  var v=vids[vi];
  if(document.hidden){v.pause();clearTimeout(fallbackTimer)}
  else if(v.src&&!reduce){v.play().catch(function(){});if(!noAuto&&!userPaused)armFallback()}
});
// billboard progress bar
(function tickBar(){
  var v=vids[vi], bar=$('heroBar');
  if(bar&&v&&v.duration&&isFinite(v.duration)&&v.classList.contains('on'))bar.style.width=(100*v.currentTime/v.duration)+'%';
  requestAnimationFrame(tickBar);
})();
})();
