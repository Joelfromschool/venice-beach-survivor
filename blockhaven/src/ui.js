// Chunky pixel-style DOM UI for Blockhaven: HUD, hotbar, bag, crafting, kiln, chest, shop, dialog, menus.
import * as THREE from '../vendor/three.module.min.js';
import {G,VERSION} from './state.js';
import {BLOCKS,def,isBlock,RECIPES,SMELT,iconURL,ARMOR_SLOTS,B} from './blocks.js';
import {T,tx,itemName} from './i18n.js';
import {NPC,QUESTS,TRADES,PLACE} from './story.js';
import {makeModel,animate} from './models.js';
import {sfx,audioWake} from './audio.js';
const $=s=>document.querySelector(s);
const h=(tag,cls,html)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(html!==undefined)e.innerHTML=html;return e};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const A=()=>G.api;
let isDirty=true,panel=null,panelKind=null,afterClose=null;
export function dirty(){isDirty=true;if(panelKind&&panelRefresh)panelRefresh()}
let panelRefresh=null;
// ---------- pixel icons (hearts, hunger, xp) ----------
function pix(rows,pal){const c=document.createElement('canvas');c.width=rows[0].length;c.height=rows.length;const g=c.getContext('2d');rows.forEach((r,y)=>[...r].forEach((ch,x)=>{if(ch!=='.'&&pal[ch]){g.fillStyle=pal[ch];g.fillRect(x,y,1,1)}}));return c.toDataURL()}
const HEART=['.kk.kk..','krrkwrk.','krrrrrrk','krrrrrrk','.krrrrk.','..krrk..','...kk...'];
const heartFull=pix(HEART,{k:'#2a0a0a',r:'#e23a3a',w:'#ffc2c2'}),heartEmpty=pix(HEART,{k:'#2a0a0a',r:'#3a2222',w:'#3a2222'});
function halfIcon(full,empty){return`<i class="ic"><img src="${empty}"><img src="${full}" style="clip-path:inset(0 50% 0 0)"></i>`}
const APPLE=['...gg...','..kgk...','.kkrkkk.','krrrrwrk','krrrrrrk','krrrrrrk','.krrrrk.','..kkkk..'];
const foodFull=pix(APPLE,{k:'#2a1608',r:'#d86a2a',w:'#ffd2a6',g:'#5aa83a'}),foodEmpty=pix(APPLE,{k:'#2a1608',r:'#3a2a20',w:'#3a2a20',g:'#3a3a2a'});
const ARMORI=['kkk..kkk','kaakkaak','kaaaaaak','kaaaaaak','.kaaaak.','.kaaaak.','..kkkk..'];
const armorFull=pix(ARMORI,{k:'#1a1a22',a:'#c9ccd6'}),armorEmpty=pix(ARMORI,{k:'#1a1a22',a:'#3a3a44'});
const bar=(n,max,full,empty,pairs=10)=>{let s='';for(let i=0;i<pairs;i++){const v=n-i*2;s+=v>=2?`<i class="ic"><img src="${full}"></i>`:v===1?halfIcon(full,empty):`<i class="ic"><img src="${empty}"></i>`}return s};
// ---------- pixel logo ----------
function logo(text){const c=document.createElement('canvas');const W=text.length*7+6,H=14;c.width=W;c.height=H;const g=c.getContext('2d');g.font='bold 11px monospace';g.textBaseline='top';g.fillStyle='#000';g.fillText(text,3,2);const d=g.getImageData(0,0,W,H);const out=document.createElement('canvas');out.width=W;out.height=H;const o=out.getContext('2d');
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(d.data[(y*W+x)*4+3]>110){o.fillStyle='#3a2a1a';o.fillRect(x+1,y+1,1,1)}}
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(d.data[(y*W+x)*4+3]>110){const t=y/H;o.fillStyle=t<.35?'#ffe58a':t<.6?'#f2b531':'#c97a1c';if((x*7+y*3)%11===0)o.fillStyle='#fff3c0';o.fillRect(x,y,1,1)}}return out.toDataURL()}
// ---------- voxel portraits (rendered once with a tiny offscreen renderer) ----------
const portraitCache={};let pr=null;
export function portrait(id){if(portraitCache[id])return portraitCache[id];try{if(!pr){const c=document.createElement('canvas');c.width=c.height=128;pr={r:new THREE.WebGLRenderer({canvas:c,alpha:true,antialias:false,preserveDrawingBuffer:true}),s:new THREE.Scene(),cam:new THREE.PerspectiveCamera(30,1,.1,50)};pr.r.setPixelRatio(1);pr.r.outputColorSpace=THREE.LinearSRGBColorSpace;pr.r.setSize(128,128,false)}
 const m=makeModel(id);animate(m,0,0);pr.s.add(m.root);m.root.rotation.y=-.5;m.root.updateMatrixWorld(true);const bb=new THREE.Box3().setFromObject(m.root);const cy=(bb.min.y+bb.max.y)/2,hh=bb.max.y-bb.min.y,ww=Math.max(bb.max.x-bb.min.x,bb.max.z-bb.min.z);const size=Math.max(hh,ww)*1.08;const dist=size/2/Math.tan(15*Math.PI/180);
 pr.cam.position.set(0,cy+size*.08,dist+(bb.max.z));pr.cam.lookAt(0,cy,0);pr.r.setClearColor(0x000000,0);pr.r.render(pr.s,pr.cam);const url=pr.r.domElement.toDataURL();pr.s.remove(m.root);portraitCache[id]=url;return url}catch(e){return''}}
// ---------- root elements ----------
const root=$('#ui');
root.innerHTML=`
<div id="hud" class="hidden">
 <div id="crosshair"></div>
 <div id="topbar"><button id="bPause" class="btn sq" aria-label="pause">❚❚</button><div id="questbox"></div><div id="topright"><button id="bMap" class="btn sq">🗺</button><button id="bView" class="btn sq">👁</button></div></div>
 <div id="bossbar" class="hidden"><div class="bname"></div><div class="btrack"><div class="bfill"></div></div></div>
 <div id="action"></div>
 <div id="toasts"></div>
 <div id="banner" class="hidden"><div class="b1"></div><div class="b2"></div></div>
 <div id="pickups"></div>
 <div id="status"><div id="hearts"></div><div id="armorrow"></div><div id="hunger"></div></div>
 <div id="xp"><div id="xpfill"></div><span id="xplv"></span></div>
 <div id="hotbarwrap"><div id="hotbar"></div><button id="bBag" class="btn sq bag">▦</button></div>
 <div id="touch">
  <div id="stickZone"><div id="stick"><div id="knob"></div></div></div>
  <div id="tbtns"><button id="bTalk" class="btn tb">💬</button><button id="bSneak" class="btn tb">⇩</button><button id="bUse" class="btn tb big">✋</button><button id="bMine" class="btn tb big">⛏</button><button id="bJump" class="btn tb big">⤒</button></div>
 </div>
</div>
<div id="vignette"></div><div id="flash"></div><div id="fade"></div>
<div id="caption" class="hidden"><div class="ctext"></div><button class="btn skip">${'Skip'}</button></div>
<div id="dialog" class="hidden"><div class="dbox"><div class="dport"><img></div><div class="dmain"><div class="dname"></div><div class="dtext"></div><div class="dextra"></div></div><button class="btn dnext"></button></div></div>
<div id="panelwrap" class="hidden"><div id="panel"></div></div>
<div id="loading"><div class="lbox"><img class="llogo"><div class="ltrack"><div class="lfill"></div></div><div class="ltext"></div></div></div>
<div id="title" class="hidden"></div>
<div id="update" class="hidden"><span></span><button class="btn">Update</button></div>`;
$('#loading .llogo').src=logo('BLOCKHAVEN');
const hotbar=$('#hotbar');for(let i=0;i<9;i++){const s=h('div','slot hb');s.dataset.i=i;s.addEventListener('click',()=>{A().P.sel=i;dirty()});s.addEventListener('touchstart',e=>{e.preventDefault();A().P.sel=i;dirty()},{passive:false});hotbar.appendChild(s)}
const tapBtn=(id,fn)=>{const el=$(id);el.addEventListener('click',e=>{e.preventDefault();audioWake();sfx('ui');fn()});el.addEventListener('touchend',e=>{e.preventDefault();audioWake();sfx('ui');fn()},{passive:false})};
tapBtn('#bPause',()=>pause());tapBtn('#bBag',()=>inventory('inv'));tapBtn('#bMap',()=>inventory('map'));tapBtn('#bView',()=>{G.view=(G.view+1)%3});tapBtn('#questbox',()=>inventory('quests'));
// ---------- slot rendering ----------
function slotHTML(s,extra=''){if(!s)return'';const d=def(s.id);let html=`<img src="${iconURL(s.id)}" draggable="false">`;if(s.count>1)html+=`<b class="cnt">${s.count}</b>`;if(d&&d.dur&&s.dur!==undefined&&s.dur<d.dur){const f=s.dur/d.dur;html+=`<span class="dur"><span style="width:${Math.round(f*100)}%;background:hsl(${Math.round(f*120)},80%,50%)"></span></span>`}return html+extra}
// ---------- HUD ----------
let tickT=0;export function tick(dt){tickT-=dt;tickToasts(dt);if(!isDirty&&tickT>0)return;tickT=.2;isDirty=false;const P=A().P;
 [...hotbar.children].forEach((el,i)=>{el.innerHTML=slotHTML(P.inv[i]);el.classList.toggle('sel',i===P.sel)});
 const mh=A().maxHp();$('#hearts').innerHTML=bar(Math.ceil(P.hp),mh,heartFull,heartEmpty,Math.ceil(mh/2));
 $('#hunger').innerHTML=bar(Math.ceil(P.hunger),20,foodFull,foodEmpty);
 const ad=A().armorDef();$('#armorrow').innerHTML=ad>0?bar(ad,20,armorFull,armorEmpty):'';
 let need=10+P.level*4;$('#xpfill').style.width=Math.min(100,P.xp/need*100)+'%';$('#xplv').textContent=P.level>0?P.level:'';
 const q=A().curQuest();const qb=$('#questbox');if(q){const st=G.quest.stage;const away=(st==='offer'||st==='ready')&&!A().giverHere();const txt=away?T('meetin',{name:tx(NPC[q.giver].name),place:tx(PLACE[A().questWorld()])}):st==='offer'?T('talkto',{name:tx(NPC[q.giver].name)}):st==='ready'?T('returnto',{name:tx(NPC[q.giver].name)}):tx(q.hint);
  const op=A().objectivePos();let arrow='';if(op){const dx=op.x+.5-P.pos.x,dz=op.z+.5-P.pos.z;const dist=Math.round(Math.hypot(dx,dz));const ang=Math.atan2(dx,dz);const rel=(ang-(P.yaw+Math.PI));arrow=`<span class="qarrow" style="transform:rotate(${(-rel)}rad)">▲</span><span class="qdist">${dist}m</span>`}
  qb.innerHTML=`<div class="qt">${esc(tx(q.title))}</div><div class="qh">${arrow}${esc(txt)}</div>`}else qb.innerHTML=`<div class="qt">${T('allquests')}</div><div class="qh">${T('day',{n:Math.floor(G.playtime/720)+1})}</div>`;
 const v=$('#vignette');v.style.opacity=P.hp<=6&&!P.dead?(.35+.25*Math.sin(G.time*5)).toFixed(2):'0'}
export function action(t){const a=$('#action');if(a._t!==t){a._t=t;a.textContent=t;a.classList.toggle('show',!!t)}}
const toastQ=[];export function toast(t){const el=h('div','toast',esc(t));$('#toasts').appendChild(el);toastQ.push({el,t:2.8});while(toastQ.length>3){toastQ.shift().el.remove()}}
function tickToasts(dt){for(let i=toastQ.length-1;i>=0;i--){const q=toastQ[i];q.t-=dt;if(q.t<.4)q.el.style.opacity=Math.max(0,q.t/.4);if(q.t<=0){q.el.remove();toastQ.splice(i,1)}}}
let banT=null;export function banner(a,b){const el=$('#banner');el.querySelector('.b1').textContent=a;el.querySelector('.b2').textContent=b||'';el.classList.remove('hidden');el.classList.remove('show');void el.offsetWidth;el.classList.add('show');clearTimeout(banT);banT=setTimeout(()=>el.classList.add('hidden'),3200)}
export function flash(){const f=$('#flash');f.classList.remove('on');void f.offsetWidth;f.classList.add('on')}
export function fadeFlash(){const f=$('#fade');f.style.transition='none';f.style.opacity=1;f.style.background='#fff';requestAnimationFrame(()=>{f.style.transition='opacity 1.2s';f.style.opacity=0})}
export function sleepFade(done){const f=$('#fade');f.style.background='#000';f.style.transition='opacity 1.2s';f.style.opacity=1;setTimeout(()=>{done&&done();f.style.opacity=0},1600)}
export function pickup(id,n){const wrap=$('#pickups');const el=h('div','pick',`<img src="${iconURL(id)}"> +${n} ${esc(itemName(id))}`);wrap.appendChild(el);setTimeout(()=>el.classList.add('out'),1500);setTimeout(()=>el.remove(),2000);while(wrap.children.length>4)wrap.firstChild.remove();isDirty=true}
export function boss(m){const el=$('#bossbar');if(!m){el.classList.add('hidden');return}el.classList.remove('hidden');el.querySelector('.bfill').style.width=Math.max(0,m.hp/m.maxHp*100)+'%';if(el._m!==m){el._m=m;el.querySelector('.bname').textContent=tx({en:m.d.name?.en||'',ja:m.d.name?.ja||''})||el.dataset.name||''}}
export function bossIntro(name,line){$('#bossbar .bname').textContent=name;$('#bossbar').dataset.name=name;banner(name,line)}
export function hud(on){$('#hud').classList.toggle('hidden',!on);isDirty=true;if(on){closePanel(true);$('#title').classList.add('hidden')}}
export function loading(p,text){const l=$('#loading');if(p>=1){l.classList.add('hidden');return}l.classList.remove('hidden');l.querySelector('.lfill').style.width=Math.round(p*100)+'%';l.querySelector('.ltext').textContent=text||T('loading')}
export function caption(text,big,hide){const c=$('#caption');if(hide){c.classList.add('hidden');return}c.classList.remove('hidden');const t=c.querySelector('.ctext');t.classList.remove('in');void t.offsetWidth;t.textContent=text;t.classList.add('in');t.classList.toggle('big',!!big);c.querySelector('.skip').textContent=T('skip')}
$('#caption .skip').addEventListener('click',()=>A().skipCinema());
// ---------- panels ----------
const wrap=$('#panelwrap'),P_=$('#panel');
export function isOpen(){return!!panelKind}
function openPanel(kind,build,refresh){audioWake();if(G.inGame&&G.mode==='play'){G.mode='menu';document.exitPointerLock?.()}panelKind=kind;wrap.classList.remove('hidden');P_.className='panel p-'+kind;panelRefresh=null;build(P_);panelRefresh=refresh||null;if(refresh)refresh()}
export function closePanel(silent){if(!panelKind)return;panelKind=null;panelRefresh=null;wrap.classList.add('hidden');P_.innerHTML='';selSlot=null;if(!silent)sfx('ui');if(G.inGame&&(G.mode==='menu'||G.mode==='dead'&&false)){G.mode='play'}const f=afterClose;afterClose=null;f&&f();isDirty=true}
wrap.addEventListener('click',e=>{if(e.target===wrap&&G.inGame&&panelKind&&panelKind!=='pause')closePanel()});
const head=(title,tabs)=>{const d=h('div','phead');if(tabs){const t=h('div','tabs');for(const[k,label]of tabs){const b=h('button','btn tab'+(k===tabs.cur?' on':''),label);b.onclick=()=>{sfx('ui');tabs.go(k)};t.appendChild(b)}d.appendChild(t)}else d.appendChild(h('div','ptitle',esc(title)));const x=h('button','btn sq close','✕');x.onclick=()=>closePanel();d.appendChild(x);return d};
const btn=(label,fn,cls='')=>{const b=h('button','btn '+cls,label);b.onclick=e=>{e.stopPropagation();sfx('ui');fn(b)};return b};
// ---------- inventory / crafting / quests / map ----------
let selSlot=null,lastTap={k:null,t:0},craftCat='all',craftSel=0;
function invTabs(cur){const tabs=[['inv',T('inventory')],['craft',T('craft')],['quests',T('quests')],['map',T('map')]];tabs.cur=cur;tabs.go=k=>inventory(k);return tabs}
function slotEl(get,set,key,opts={}){const el=h('div','slot'+(opts.cls?' '+opts.cls:''));const draw=()=>{el.innerHTML=slotHTML(get())+(opts.ghost&&!get()?`<span class="ghost">${opts.ghost}</span>`:'');el.classList.toggle('picked',selSlot&&selSlot.key===key)};el._draw=draw;draw();
 el.onclick=()=>{const now=performance.now();const dbl=lastTap.k===key&&now-lastTap.t<350;lastTap={k:key,t:now};
  if(dbl&&opts.onDouble&&get()){selSlot=null;opts.onDouble();dirty();return}
  if(!selSlot){if(get()){selSlot={key,get,set,accept:opts.accept};sfx('ui')}}else if(selSlot.key===key){selSlot=null}else{const a=selSlot.get(),b=get();if(opts.accept&&a&&!opts.accept(a)){toast('✕');selSlot=null;dirty();return}if(selSlot.accept&&b&&!selSlot.accept(b)){selSlot=null;dirty();return}
   if(a&&b&&a.id===b.id&&!def(a.id).dur){const ms=def(a.id).stack||64;const mv=Math.min(a.count,ms-b.count);b.count+=mv;a.count-=mv;if(a.count<=0)selSlot.set(null)}else{selSlot.set(b);set(a)}selSlot=null;sfx('place',B.planks)}
  if(opts.accept)el._accept=opts.accept;dirty()};return el}
export function inventory(tab='inv'){const P=A().P;if(!G.inGame)return;
 if(tab==='craft')return craftPanel();if(tab==='quests')return questPanel();if(tab==='map')return mapPanel();
 openPanel('inv',p=>{p.innerHTML='';p.appendChild(head('',invTabs('inv')));const body=h('div','invbody');
  const left=h('div','invleft');const port=h('div','invport');port.innerHTML=`<img src="${portrait('pinco')}"><div class="lv">${T('lv')} ${P.level}</div>`;left.appendChild(port);
  const arm=h('div','armorcol');ARMOR_SLOTS.forEach((s,k)=>{const el=slotEl(()=>P.armor[k],v=>{P.armor[k]=v},'a'+k,{cls:'armor',ghost:['⛑','👕','👖','👢'][k],accept:it=>def(it.id).armor===k,onDouble:()=>A().unequip(k)});arm.appendChild(el)});left.appendChild(arm);body.appendChild(left);
  const right=h('div','invright');const grid=h('div','grid main');for(let i=9;i<36;i++)grid.appendChild(slotEl(()=>P.inv[i],v=>{P.inv[i]=v},'i'+i,{onDouble:()=>A().equipFromSlot(i)}));right.appendChild(grid);
  const hb=h('div','grid hot');for(let i=0;i<9;i++)hb.appendChild(slotEl(()=>P.inv[i],v=>{P.inv[i]=v},'i'+i,{cls:'hb',onDouble:()=>{if(def(P.inv[i].id).armor!==undefined)A().equipFromSlot(i);else{P.sel=i;closePanel()}}}));right.appendChild(hb);
  const info=h('div','iteminfo');right.appendChild(info);right.appendChild(h('div','help',T('tapmove')));
  const row=h('div','row');row.appendChild(btn('🗑 '+(G.opt.lang==='ja'?'すてる':'Drop'),()=>{if(selSlot&&selSlot.get()){const s=selSlot.get();selSlot.set(null);selSlot=null;const pp=A().P.pos;import('./entities.js').then(E=>{const it=E.dropItem(s.id,s.count,pp.x,pp.y+1.2,pp.z,null,s.dur);if(it)it.t=-1.5});dirty()}}));right.appendChild(row);
  body.appendChild(right);p.appendChild(body);p._info=info},
 ()=>{P_.querySelectorAll('.slot').forEach(e=>e._draw&&e._draw());const info=P_._info;if(info){const s=selSlot&&selSlot.get();info.innerHTML=s?itemInfo(s):''}})}
function itemInfo(s){const d=def(s.id);let t=`<b>${esc(itemName(s.id))}</b>`;if(d.dmg&&d.tool==='sword')t+=` · ⚔${d.dmg}`;if(d.def)t+=` · 🛡${d.def}`;if(d.food)t+=` · 🍎+${d.food[0]}`;if(d.dur&&s.dur!==undefined)t+=` · ${s.dur}/${d.dur}`;return t}
function craftPanel(){const P=A().P;openPanel('craft',p=>{p.innerHTML='';p.appendChild(head('',invTabs('craft')));
  const cats=h('div','cats');for(const c of['all','blocks','tools','armor','food','items']){const b=btn(T(c==='all'?'all':'cat_'+c),()=>{craftCat=c;craftSel=0;craftPanel()},'chip'+(c===craftCat?' on':''));cats.appendChild(b)}p.appendChild(cats);
  const body=h('div','craftbody');const list=h('div','rlist');const detail=h('div','rdetail');body.appendChild(list);body.appendChild(detail);p.appendChild(body);p._list=list;p._detail=detail},
 ()=>{const p=P_;const list=p._list,detail=p._detail;if(!list)return;const bench=A().nearBlock([B.workbench]);let rs=RECIPES.map((r,i)=>({r,i})).filter(o=>craftCat==='all'||o.r.cat===craftCat);
  const ok=o=>A().canCraft(o.r);rs.sort((a,b)=>(ok(b)-ok(a))||(a.r.bench-b.r.bench));const sc=list.scrollTop;list.innerHTML='';
  for(const o of rs){const el=h('div','slot recipe'+(ok(o)?' can':'')+(o.i===craftSel?' picked':''),`<img src="${iconURL(o.r.out)}">${o.r.n>1?`<b class="cnt">${o.r.n}</b>`:''}${o.r.bench&&!bench?'<span class="lock">⚒</span>':''}`);el.onclick=()=>{craftSel=o.i;sfx('ui');panelRefresh()};list.appendChild(el)}list.scrollTop=sc;
  if(!rs.find(o=>o.i===craftSel)&&rs.length)craftSel=rs[0].i;const r=RECIPES[craftSel];if(!r){detail.innerHTML='';return}
  const g=h('div','cgrid');const cells=r.grid.padEnd(9,'.').slice(0,9);for(const ch of cells){const k=ch==='.'?-1:ch.charCodeAt(0)-97;const id=k>=0&&r.ing[k]?r.ing[k][0]:0;g.appendChild(h('div','slot sm',id?`<img src="${iconURL(id)}">`:''))}
  detail.innerHTML='';const top=h('div','crow');top.appendChild(g);top.appendChild(h('div','carrow','➜'));top.appendChild(h('div','slot out',`<img src="${iconURL(r.out)}">${r.n>1?`<b class="cnt">${r.n}</b>`:''}`));detail.appendChild(top);
  detail.appendChild(h('div','cname',esc(itemName(r.out))+(r.n>1?' ×'+r.n:'')));
  const need=h('div','cneed');for(const[id,n]of r.ing){const have=A().countItem(id);need.appendChild(h('span','need'+(have>=n||G.opt.cheat?' ok':''),`<img src="${iconURL(id)}"> ${have}/${n}`))}detail.appendChild(need);
  if(r.bench&&!bench)detail.appendChild(h('div','warn','⚒ '+T('needbench')));
  const row=h('div','row');const can=A().canCraft(r);const b1=btn(T('makeit'),()=>{if(A().craft(r))pickup(r.out,r.n)},'go'+(can?'':' dis'));const b5=btn(T('make5'),()=>{let k=0;while(k<5&&A().craft(r))k++;if(k)pickup(r.out,r.n*k)},can?'':'dis');row.appendChild(b1);row.appendChild(b5);detail.appendChild(row)})}
function questPanel(){openPanel('quests',p=>{p.innerHTML='';p.appendChild(head('',invTabs('quests')));const l=h('div','qlist');const qi=G.quest.i;
  QUESTS.forEach((q,i)=>{if(i>qi)return;const done=i<qi;const el=h('div','qitem'+(done?' done':' cur'),`<img src="${portrait(q.giver)}"><div><b>${done?'✔ ':'★ '}${esc(tx(q.title))}</b><div>${esc(done?T('done'):tx(q.hint))}</div></div>`);l.appendChild(el)});
  if(qi>=QUESTS.length)l.appendChild(h('div','qitem done',`<div><b>👑 ${T('allquests')}</b></div>`));
  l.appendChild(h('div','help',isTouchUI()?T('touchhelp'):T('controls')));p.appendChild(l)})}
const isTouchUI=()=>A().isTouch;
let mapCache=null;const tileAvg={};
function avgTile(id){if(tileAvg[id])return tileAvg[id];const b=BLOCKS[id];if(!b||!b.tex)return'#000';const g=G.atlas.getContext('2d');const t=b.tex.top;const d=g.getImageData((t%16)*16,Math.floor(t/16)*16,16,16).data;let r=0,gg=0,bb=0,n=0;for(let i=0;i<d.length;i+=4)if(d[i+3]>100){r+=d[i];gg+=d[i+1];bb+=d[i+2];n++}n=n||1;return tileAvg[id]=[r/n|0,gg/n|0,bb/n|0]}
function buildMap(){const w=G.world;const c=document.createElement('canvas');c.width=w.W;c.height=w.D;const g=c.getContext('2d');const img=g.createImageData(w.W,w.D);
 for(let z=0;z<w.D;z++)for(let x=0;x<w.W;x++){let y=w.H-1;while(y>0&&(!w.get(x,y,z)||BLOCKS[w.get(x,y,z)].cross))y--;const id=w.get(x,y,z);let col=id?avgTile(id):[30,60,140];if(!Array.isArray(col))col=[0,0,0];const sh=id===B.water?1:.75+((y-20)/40)*.5;const k=(z*w.W+x)*4;img.data[k]=Math.min(255,col[0]*sh);img.data[k+1]=Math.min(255,col[1]*sh);img.data[k+2]=Math.min(255,col[2]*sh);img.data[k+3]=255}
 g.putImageData(img,0,0);return c}
function mapPanel(){openPanel('map',p=>{p.innerHTML='';p.appendChild(head('',invTabs('map')));const w=G.world;if(!mapCache||mapCache.w!==w||mapCache.edits!==w.edits.size){mapCache={c:buildMap(),w,edits:w.edits.size}}
  const box=h('div','mapbox');const c=document.createElement('canvas');c.width=w.W;c.height=w.D;const g=c.getContext('2d');g.drawImage(mapCache.c,0,0);const P=A().P;
  const op=A().objectivePos();if(op&&G.dim===(op.dim||G.dim)){g.fillStyle='#ffd25a';g.fillRect(op.x-3,op.z-3,7,7);g.fillStyle='#000';g.fillRect(op.x-1,op.z-1,3,3)}
  for(const n of G.npcs){g.fillStyle='#fff';g.fillRect(n.pos.x-1,n.pos.z-1,3,3)}
  g.save();g.translate(P.pos.x,P.pos.z);g.rotate(-P.yaw);g.fillStyle='#ff4fa0';g.beginPath();g.moveTo(0,-6);g.lineTo(4,4);g.lineTo(-4,4);g.closePath();g.fill();g.strokeStyle='#000';g.stroke();g.restore();
  if(w.D>w.W){c.style.width='auto';c.style.height='min(62vh,560px)';c.style.maxWidth='100%'}box.appendChild(c);p.appendChild(box);const leg=h('div','legend',`<span><i style="background:#ff4fa0"></i>${T('you')}</span><span><i style="background:#ffd25a"></i>${T('objective')}</span><span><i style="background:#fff"></i>${T('village')}</span>`);p.appendChild(leg)})}
export function quests(){inventory('quests')}
// ---------- kiln ----------
let kilnI=null;
export function kiln(i){kilnI=i;openPanel('kiln',p=>{p.innerHTML='';p.appendChild(head(T('kiln')));const b=h('div','kilnbody');p.appendChild(b);p._b=b},()=>{const b=P_._b;if(!b)return;const k=A().kilnState(kilnI);const P=A().P;b.innerHTML='';
  const fuel=h('div','fuel',`🔥 ${T('fuel')}: <b>${A().fuelUnits()>=999?'∞':A().fuelUnits()}</b>`);b.appendChild(fuel);
  const ins=h('div','smeltlist');const seen=new Set();for(const s of P.inv){if(!s||seen.has(s.id)||!SMELT[s.id])continue;seen.add(s.id);const n=A().countItem(s.id);const row=h('div','srow',`<span class="slot sm"><img src="${iconURL(s.id)}"><b class="cnt">${n}</b></span><span class="carrow">➜</span><span class="slot sm"><img src="${iconURL(SMELT[s.id])}"></span><span class="sname">${esc(itemName(SMELT[s.id]))}</span>`);
   row.appendChild(btn(T('smeltIt')+' 1',()=>{A().smelt(kilnI,s.id,1);panelRefresh()}));row.appendChild(btn(T('smeltAll'),()=>{A().smelt(kilnI,s.id,Math.min(64,A().countItem(s.id)));panelRefresh()}));ins.appendChild(row)}
  if(!seen.size)ins.appendChild(h('div','help',T('nothingSmelt')));b.appendChild(ins);
  const q=h('div','kq');q.innerHTML=`<div class="lab">${T('queue')}</div>`;const qr=h('div','qrow');for(const[id,n]of k.q)qr.appendChild(h('div','slot sm',`<img src="${iconURL(id)}"><b class="cnt">${n}</b>`));const pb=h('div','prog',`<span style="width:${Math.round(k.prog/2.2*100)}%"></span>`);qr.appendChild(pb);q.appendChild(qr);b.appendChild(q);
  const o=h('div','kq');o.innerHTML=`<div class="lab">${T('output')}</div>`;const or=h('div','qrow');for(const[id,n]of k.out)or.appendChild(h('div','slot sm',`<img src="${iconURL(id)}"><b class="cnt">${n}</b>`));or.appendChild(btn(T('collect'),()=>{A().collectKiln(kilnI);panelRefresh()},k.out.length?'go':'dis'));o.appendChild(or);b.appendChild(o)})}
export function kilnTick(){if(panelKind==='kiln'&&panelRefresh)panelRefresh()}
setInterval(()=>{if(panelKind==='kiln'&&panelRefresh)panelRefresh()},400);
// ---------- chest ----------
export function chest(i){const slots=A().chestSlots(i);sfx('pop');openPanel('chest',p=>{const P=A().P;p.innerHTML='';p.appendChild(head(T('chest')));const c=h('div','grid chestg');for(let k=0;k<27;k++)c.appendChild(slotEl(()=>slots[k],v=>{slots[k]=v},'c'+k,{onDouble:()=>{const s=slots[k];const left=A().addItem(s.id,s.count,s.dur);if(left)s.count=left;else slots[k]=null}}));p.appendChild(c);
  p.appendChild(btn(T('takeAll'),()=>{for(let k=0;k<27;k++){const s=slots[k];if(!s)continue;const left=A().addItem(s.id,s.count,s.dur);if(left)s.count=left;else slots[k]=null}sfx('pop');dirty()},'go'));
  p.appendChild(h('div','lab',T('yours')));const g=h('div','grid main');for(let k=9;k<36;k++)g.appendChild(slotEl(()=>P.inv[k],v=>{P.inv[k]=v},'i'+k));p.appendChild(g);const hb=h('div','grid hot');for(let k=0;k<9;k++)hb.appendChild(slotEl(()=>P.inv[k],v=>{P.inv[k]=v},'i'+k,{cls:'hb'}));p.appendChild(hb)},
 ()=>P_.querySelectorAll('.slot').forEach(e=>e._draw&&e._draw()))}
// ---------- trade ----------
export function trade(){openPanel('trade',p=>{p.innerHTML='';p.appendChild(head(T('trade')));const top=h('div','tradetop',`<img src="${portrait('pooh')}"><div>🪙 <b class="coins"></b></div>`);p.appendChild(top);const l=h('div','tlist');p.appendChild(l);p._l=l},
 ()=>{const p=P_;p.querySelector('.coins').textContent=A().countItem(105);const l=p._l;l.innerHTML='';for(const tr of TRADES){const can=G.opt.cheat||tr.give.every(([id,n])=>A().countItem(id)>=n);const row=h('div','trow'+(can?'':' no'));for(const[id,n]of tr.give)row.appendChild(h('span','slot sm',`<img src="${iconURL(id)}"><b class="cnt">${n}</b>`));row.appendChild(h('span','carrow','➜'));row.appendChild(h('span','slot sm',`<img src="${iconURL(tr.get[0])}"><b class="cnt">${tr.get[1]}</b>`));row.appendChild(h('span','sname',esc(itemName(tr.get[0]))));row.appendChild(btn(T('buy'),()=>{if(A().doTrade(tr)){pickup(tr.get[0],tr.get[1]);dirty()}},can?'go':'dis'));l.appendChild(row)}})}
// ---------- dialog ----------
const D=$('#dialog');let dq=null;
export function dialog(lines,onDone,extra){audioWake();G.lastDialog=lines;if(G.mode==='play'){document.exitPointerLock?.()}dq={lines,i:0,onDone,extra:extra||[],prev:G.mode==='cinema'?'cinema':G.inGame?'play':G.mode};G.mode='dialog';D.classList.remove('hidden');document.body.classList.add('talking');showLine()}
let typeT=null;
function showLine(){const L=dq.lines[dq.i];const who=L.who;D.querySelector('.dport img').src=portrait(who);D.querySelector('.dname').textContent=tx(NPC[who]?.name)+(NPC[who]?' · '+tx(NPC[who].role):'');const full=tx(L.t);const el=D.querySelector('.dtext');let n=0;clearInterval(typeT);el.textContent='';el._full=full;typeT=setInterval(()=>{n+=2;el.textContent=full.slice(0,n);if(n>=full.length)clearInterval(typeT)},16);sfx('ui');
 const ex=D.querySelector('.dextra');ex.innerHTML='';const last=dq.i===dq.lines.length-1;if(last)for(const e of dq.extra){ex.appendChild(btn(e.label,()=>{const fn=e.fn;endDialog();fn()},'chip'))}
 D.querySelector('.dnext').textContent=last?T('close'):T('next')}
export function dialogNext(){if(!dq)return;const el=D.querySelector('.dtext');if(el.textContent.length<el._full.length){clearInterval(typeT);el.textContent=el._full;return}dq.i++;if(dq.i>=dq.lines.length){const f=dq.onDone;endDialog();f&&f()}else showLine()}
export function endDialog(){if(!dq)return;const prev=dq.prev;dq=null;clearInterval(typeT);D.classList.add('hidden');document.body.classList.remove('talking');if(G.mode==='dialog')G.mode=prev==='cinema'?'cinema':G.inGame?'play':prev}
D.addEventListener('click',e=>{if(e.target.closest('.dextra'))return;sfx('ui');dialogNext()});
// ---------- death ----------
export function deathScreen(){document.exitPointerLock?.();openPanel('dead',p=>{p.innerHTML=`<div class="deadt">${T('fainted')}</div><div class="help">${T('faintsub')}</div>`;p.appendChild(btn(T('respawn'),()=>{closePanel(true);G.mode='play';A().respawn()},'go big'));p.appendChild(btn(T('quit'),()=>{closePanel(true);A().respawn();A().toTitle()}))})}
// ---------- ending ----------
const fmtTime=s=>{s=Math.floor(s);const hh=Math.floor(s/3600),mm=Math.floor(s/60)%60;return(hh?hh+'h ':'')+mm+'m'};
export function ending(){document.exitPointerLock?.();openPanel('ending',p=>{const cast=['pinco','bean','pooh','pooping','bronny','kermit','asmon'];p.innerHTML=`<img class="elogo" src="${logo('BLOCKHAVEN')}"><div class="deadt">${T('theend')}</div><div class="cast">${cast.map(c=>`<div><img src="${portrait(c)}"><span>${esc(tx(NPC[c].name))}</span></div>`).join('')}</div><div class="help">${T('credits')}</div><div class="help">${T('stats',{t:fmtTime(G.playtime),k:G.stats.kills,m:G.stats.mined,c:G.stats.crafted})}</div>`;
  p.appendChild(btn(T('keepplaying'),()=>{closePanel(true);G.mode='play';A().save()},'go big'));p.appendChild(btn(T('quit'),()=>{closePanel(true);A().toTitle()}))})}
// ---------- pause & options ----------
export function pause(){if(!G.inGame||panelKind==='pause'||G.mode==='dialog'||G.mode==='dead'||G.mode==='cinema')return;openPanel('pause',p=>{p.innerHTML='';p.appendChild(h('div','ptitle center',T('paused')));const col=h('div','col');col.appendChild(btn(T('resume'),()=>closePanel(),'go big'));col.appendChild(btn(T('inventory'),()=>inventory('inv'),'big'));col.appendChild(btn(T('quests'),()=>inventory('quests'),'big'));col.appendChild(btn(T('options'),()=>options(),'big'));col.appendChild(btn(T('quit'),()=>{closePanel(true);A().toTitle()},'big'));col.appendChild(pickerLink());col.appendChild(h('div','help',T('version',{v:VERSION})));p.appendChild(col)})}
function pickerLink(){const a=h('a','btn big picker',T('picker'));a.href='https://joelfromschool.github.io/venice-beach-survivor/';a.onclick=()=>{try{A().save()}catch(e){}};return a}
export function options(){const O=G.opt;const from=panelKind==='pause'?'pause':G.inGame?'pause':'title';openPanel('options',p=>{p.innerHTML='';p.appendChild(head(T('options')));const l=h('div','opts');
  const row=(label,ctrl)=>{const r=h('div','orow');r.appendChild(h('span','olab',label));r.appendChild(ctrl);l.appendChild(r)};
  const seg=(key,vals,labels,after)=>{const s=h('div','seg');vals.forEach((v,i)=>{const b=btn(labels[i],()=>{O[key]=v;A().saveOptions();after&&after();options()},'chip'+(O[key]===v?' on':''));s.appendChild(b)});return s};
  row(T('lang'),seg('lang',['en','ja'],['English','日本語'],()=>{dirty()}));
  row(T('sound'),seg('sound',[true,false],[T('on'),T('off')]));
  row(T('music'),seg('music',[true,false],[T('on'),T('off')],()=>A().musicVolume()));
  row(T('difficulty'),seg('difficulty',[0,1,2,3],[T('diff0'),T('diff1'),T('diff2'),T('diff3')]));
  row(T('keepInv'),seg('keepInv',[true,false],[T('on'),T('off')]));
  row(T('view'),seg('view',[3,4,6,8],['3','4','6','8']));
  row(T('sens'),seg('sens',[.6,1,1.5,2.2],['◔','◑','◕','●']));
  row(T('autojump'),seg('autojump',[true,false],[T('on'),T('off')]));
  row(T('reduced'),seg('reduced',[true,false],[T('on'),T('off')]));
  const ch=h('div','cheat');if(O.cheat){ch.appendChild(h('div','help ok',T('cheatOn')));ch.appendChild(btn(T('cheatOff'),()=>{O.cheat=false;A().saveOptions();options()}))}else{const inp=h('input','cin');inp.placeholder=T('cheatPh');inp.autocapitalize='characters';inp.autocomplete='off';ch.appendChild(inp);ch.appendChild(btn(T('apply'),()=>{if(inp.value.trim().toUpperCase()==='AMSABABY'){confirmBox(T('cheatConfirm'),()=>{O.cheat=true;A().saveOptions();sfx('level');options()})}else{toast(T('cheatBad'));inp.value=''}}))}row(T('cheat'),ch);
  p.appendChild(l);const r2=h('div','row');r2.appendChild(btn(T('intro'),()=>{closePanel(true);const was=G.inGame;if(was){A().save()}$('#title').classList.add('hidden');A().startCinema(()=>{if(was){A().enterPlay()}else{A().toTitle()}})}));r2.appendChild(pickerLink());r2.appendChild(btn(T('back'),()=>{if(from==='pause')pause();else{closePanel();title()}},'go'));p.appendChild(r2)})}
function confirmBox(msg,yes){const prev=panelKind;openPanel('confirm',p=>{p.innerHTML=`<div class="ctxt">${esc(msg)}</div>`;const r=h('div','row');r.appendChild(btn(T('yes'),()=>{yes()},'go'));r.appendChild(btn(T('no'),()=>{if(prev==='options')options();else if(prev==='pause')pause();else{closePanel();title()}}));p.appendChild(r)})}
// ---------- title ----------
export function title(){const t=$('#title');t.classList.remove('hidden');const has=!!A().readSave();t.innerHTML='';const box=h('div','tbox');box.appendChild(h('img','tlogo'));box.querySelector('.tlogo').src=logo('BLOCKHAVEN');box.appendChild(h('div','tsub',T('subtitle')));
 const col=h('div','col');if(has)col.appendChild(btn(T('cont'),async()=>{t.classList.add('hidden');loading(.5,T('loading'));await A().continueGame();loading(1);A().enterPlay()},'go big'));
 col.appendChild(btn(T('newgame'),()=>{const go=async()=>{closePanel(true);t.classList.add('hidden');loading(.5,T('gen'));await A().newGame();loading(1);A().startCinema(()=>A().enterPlay())};if(has){t.classList.add('hidden');confirmBox(T('confirmNew'),go)}else go()},has?'big':'go big'));
 col.appendChild(btn(T('options'),()=>{t.classList.add('hidden');options()},'big'));col.appendChild(pickerLink());box.appendChild(col);
 const cast=h('div','tcast');for(const c of['pinco','bean','pooh','pooping','bronny','kermit'])cast.appendChild(h('img','',undefined)).src=portrait(c);box.appendChild(cast);
 box.appendChild(h('div','tver',T('version',{v:VERSION})+' · '+(isTouchUI()?T('touchhelp'):T('controls'))));t.appendChild(box)}
// ---------- version check ----------
async function checkVersion(){try{const r=await fetch('version.json?t='+Date.now(),{cache:'no-store'});if(!r.ok)return;const j=await r.json();if(j.version&&j.version!==VERSION){const u=$('#update');u.querySelector('span').textContent=T('update')+' ('+j.version+')';u.querySelector('button').textContent=T('reload');u.classList.remove('hidden')}}catch(e){}}
$('#update button').addEventListener('click',()=>{try{A().save()}catch(e){}location.reload()});
setTimeout(checkVersion,4000);setInterval(checkVersion,90000);
export function map(){inventory('map')}
