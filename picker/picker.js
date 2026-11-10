/* Honeyvale Games picker: billboard previews, row selection, EN/JA, continue, Secret gate. */
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
var cur=null,curTile=null;
var lastPtr=canHover?'mouse':'touch'; // updated by real pointer input
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
  poster.style.objectPosition=g.pos;
  if(poster.getAttribute('src')!=='picker/posters/'+id+'.webp'){poster.src='picker/posters/'+id+'.webp'}
  playPreview(id,g);
}
var pvTimer=0;
function playPreview(id,g){
  clearTimeout(pvTimer);
  var old=vids[vi];
  vids.forEach(function(v){v.classList.remove('on')});
  if(reduce||saveData)return;
  pvTimer=setTimeout(function(){
    vi^=1;var v=vids[vi];
    vids[vi^1].pause();
    v.style.objectPosition=g.pos;
    var src='picker/previews/'+id+'.mp4';
    v.onplaying=function(){if(cur===id)v.classList.add('on')};
    if(v.getAttribute('src')!==src){v.src=src;v.load()}else{try{v.currentTime=0}catch(e){}}
    var pr=v.play();if(pr&&pr.catch)pr.catch(function(){});
  },canHover?350:120);
}

/* ---------- tiles & selection ---------- */
var tiles=[].slice.call(document.querySelectorAll('.tile'));
function select(tile,opts){
  if(curTile)curTile.classList.remove('sel');
  curTile=tile;tile.classList.add('sel');
  setHero(tile.dataset.game,opts);
}
function bindTile(tile){
  var wasSel=false,hv=0;
  tile.addEventListener('pointerdown',function(e){wasSel=(curTile===tile)},true);
  tile.addEventListener('focus',function(){if(lastPtr==='touch'||lastPtr==='pen')return;select(tile)});
  tile.addEventListener('pointerenter',function(e){if(e.pointerType!=='mouse')return;clearTimeout(hv);hv=setTimeout(function(){select(tile)},180)});
  tile.addEventListener('pointerleave',function(){clearTimeout(hv)});
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

/* swipe: selection follows the tile that snaps to the start of the row (touch only) */
function trackOf(t){return t.closest('.track')}
[].slice.call(document.querySelectorAll('.track')).forEach(function(tr){
  var tm=0;
  tr.addEventListener('scroll',function(){
    updateNav(tr);
    if(lastPtr!=='touch'&&lastPtr!=='pen')return;
    clearTimeout(tm);tm=setTimeout(function(){
      var pad=parseFloat(getComputedStyle(tr).scrollPaddingLeft)||0,best=null,bd=1e9,x=tr.getBoundingClientRect().left+pad;
      [].forEach.call(tr.children,function(c){var d=Math.abs(c.getBoundingClientRect().left-x);if(d<bd){bd=d;best=c}});
      if(best&&best!==curTile)select(best);
    },140);
  },{passive:true});
  var wrap=tr.parentNode,prev=wrap.querySelector('.prev'),next=wrap.querySelector('.next');
  function page(dir){tr.scrollBy({left:dir*tr.clientWidth*0.85,behavior:reduce?'auto':'smooth'})}
  if(prev)prev.addEventListener('click',function(){page(-1)});
  if(next)next.addEventListener('click',function(){page(1)});
  updateNav(tr);
});
function updateNav(tr){
  var w=tr.parentNode,p=w.querySelector('.prev'),n=w.querySelector('.next');if(!p)return;
  p.disabled=tr.scrollLeft<4;n.disabled=tr.scrollLeft+tr.clientWidth>=tr.scrollWidth-4;
}

/* keyboard: arrows move along a row and between rows */
document.addEventListener('keydown',function(e){
  if($('spGate').style.display!=='none')return;
  var a=document.activeElement,k=e.key;
  if(!/^Arrow(Left|Right|Up|Down)$/.test(k))return;
  var all=[].slice.call(document.querySelectorAll('.row:not([hidden]) .track'));
  if(!a||!a.classList.contains('tile')){
    if(k==='ArrowDown'||k==='ArrowRight'){var f=(curTile&&curTile.offsetParent)?curTile:all[0]&&all[0].children[0];if(f){e.preventDefault();f.focus()}}
    return;
  }
  var tr=trackOf(a),items=[].slice.call(tr.children),i=items.indexOf(a),ti=all.indexOf(tr),nx=null;
  if(k==='ArrowRight')nx=items[i+1];
  if(k==='ArrowLeft')nx=items[i-1];
  if(k==='ArrowDown'||k==='ArrowUp'){
    var t2=all[ti+(k==='ArrowDown'?1:-1)];
    if(!t2&&k==='ArrowUp'){e.preventDefault();$('heroPlay').focus();window.scrollTo({top:0,behavior:reduce?'auto':'smooth'});return}
    if(t2)nx=t2.children[Math.min(i,t2.children.length-1)];
  }
  if(nx){e.preventDefault();nx.focus({preventScroll:true});nx.scrollIntoView({block:'nearest',inline:'nearest',behavior:reduce?'auto':'smooth'})}
});

/* ---------- continue row ---------- */
function buildContinue(){
  var last=store.get('picker_last'),row=$('continueRow'),tr=$('continueTrack');
  tr.innerHTML='';
  if(!last||!G[last]){row.hidden=true;return null}
  var src=document.querySelector('.tile[data-game="'+last+'"]');
  var c=src.cloneNode(true);c.removeAttribute('id');c.classList.add('cont');c.classList.remove('sel');c.dataset.row='cont';
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
window.__picker={select:function(id){var t=document.querySelector('.track .tile[data-game="'+id+'"]');if(t)select(t)},openSecret:openSecret};

/* ---------- start ---------- */
var c=buildContinue();
applyLang();
var first=document.querySelector('.row[data-rowid="all"] .tile');
select(first,{force:true,instant:true});
// pause previews when tab hidden
document.addEventListener('visibilitychange',function(){var v=vids[vi];if(document.hidden)v.pause();else if(v.src&&!reduce)v.play().catch(function(){})});
})();
