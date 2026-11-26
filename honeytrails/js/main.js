// Honey Trails: game controller and UI.
import {SP,SPECIES,ITEMS,STR,TYPES,RAR_N,XP_LV,calcCP,calcHP,cpm,SHINY} from './data.js?v=1.0.2';
import {S,load,save,wipe,lvFromXp,newPal,refresh,today,bagCount,BAG_MAX} from './state.js?v=1.0.2';
import {AU} from './audio.js?v=1.0.2';
import * as MAP from './map.js?v=1.0.2';
import {project,terrain,isNight,hash,rng,CELL,HATS} from './world.js?v=1.0.2';
import * as ENC from './encounter.js?v=1.0.2';
import * as BAT from './battle.js?v=1.0.2';
const V=window.__V;const $=id=>document.getElementById(id);
window.__art=(sp,shiny,hat)=>hat&&HATS.has(sp)?`art/${sp==='bean'?'beanx':sp+'_h'}.webp?v=${V}`:`art/${sp}${shiny&&SHINY.has(sp)?'_s':''}.webp?v=${V}`;
const art=window.__art;
export const T=(k,sp)=>sp?SP[k][S.lang]:(STR[S.lang][k]??STR.en[k]??k);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const G={view:'title',hints:{},last:performance.now(),refreshT:0,nightT:0,nearKeys:new Set()};
const YOYOGI=project(35.6717,139.6949);
let gpsWatch=null,origin=null,lastFix=null;
// ---------- helpers ----------
function toast(msg,ms=2200){const om=document.querySelector('#scr #oMsg');if(om){om.textContent=msg;om.classList.add('on');clearTimeout(om._h);om._h=setTimeout(()=>om.classList.remove('on'),ms+800);return}const t=$('toast');t.textContent=msg;t.classList.add('on');clearTimeout(t._h);t._h=setTimeout(()=>t.classList.remove('on'),ms)}
function popup({title,img,html,lines,buttons,cls}){const p=$('pop');p.innerHTML=`<div class="pbox ${cls||''}">${title?`<h3>${esc(title)}</h3>`:''}${img?`<img class="big" src="${img}" alt="">`:''}${html||''}${lines?`<div class="lines">${lines.map(l=>`<span>${esc(l)}</span>`).join(' ')}</div>`:''}<div class="bt"></div></div>`;
 const bt=p.querySelector('.bt');return new Promise(res=>{(buttons||[{t:T('sendOK')}]).forEach((b,i)=>{const e=document.createElement('button');e.className='btn '+(b.c||(i?'ghost':'honey'));e.textContent=b.t;e.onclick=()=>{AU.play('tap');p.classList.remove('on');p.innerHTML='';res(b.v??i)};bt.appendChild(e)});p.classList.add('on')})}
function screen(html,cls=''){const s=$('scr');s.innerHTML=`<div class="screen ${cls}">${html}</div>`;return s.firstChild}
function closeScreen(){$('scr').innerHTML='';if(G.view==='screen')G.view='map';$('hud').classList.toggle('on',G.view==='map')}
function applyI18n(root=document){root.querySelectorAll('[data-t]').forEach(e=>e.textContent=T(e.dataset.t));document.documentElement.lang=S.lang}
function fmt(n){return n.toLocaleString(S.lang==='ja'?'ja-JP':'en-US')}
// ---------- XP / level ----------
const pend=[];// queued level-up popups
function addXP(n){if(!n)return;const before=S.lv;S.xp+=n;S.lv=lvFromXp(S.xp);if(S.lv>before)for(let l=before+1;l<=S.lv;l++)pend.push(l);updHud()}
async function flushLevelUps(){while(pend.length){const l=pend.shift();const rw={jar:15+(l>=10?0:5),drop:l>=6?5:0,gjar:l>=10?10:0,rjar:l>=18?10:0,bun:l>=14?3:0};const lines=[];
 for(const k in rw)if(rw[k]){S.items[k]+=rw[k];lines.push(`${ITEMS[k][S.lang]} ×${rw[k]}`)}if(l%5===0){S.eggs.length<9&&S.eggs.push({id:Date.now()+l,km:l>=10?10:5});lines.push(`${T('egg')} ×1`)}
 AU.play('lvup');save();await popup({title:T('lvUp')+' '+l,img:art(S.avatar),lines})}}
// ---------- HUD ----------
function updHud(){$('hLv').textContent=S.lv;const a=XP_LV[S.lv]||0,b=XP_LV[S.lv+1]||a+1;const f=S.lv>=40?1:(S.xp-a)/(b-a);$('hXp').setAttribute('stroke-dashoffset',100.5*(1-f));$('hAv').src=art(S.avatar);
 $('hMode').textContent=(S.mode==='gps'?'📍 ':'🕹 ')+T(S.mode==='gps'?'st_gps':'st_exp');$('joy').classList.toggle('on',S.mode!=='gps')}
function hint(k,ms=5000){if(G.hints[k]||S['h_'+k])return;G.hints[k]=1;S['h_'+k]=1;const h=$('hHint');h.textContent=T(k);h.classList.add('on');clearTimeout(h._t);h._t=setTimeout(()=>h.classList.remove('on'),ms)}
function updNearby(){const L=$('hNearL');const arr=MAP.M.spawns.map(s=>({s,d:Math.hypot(s.x-MAP.M.ax,s.y-MAP.M.ay)})).filter(o=>o.d<220).sort((a,b)=>a.d-b.d).slice(0,3);
 L.innerHTML=arr.length?arr.map(o=>`<i class="${S.dex[o.s.sp]?'':'sil'}" style="background-image:url(${art(o.s.sp,false,o.s.hat)})"></i>`).join(''):`<em>${esc(T('nobody'))}</em>`}
// ---------- location ----------
function stopLoc(){if(gpsWatch!=null&&navigator.geolocation)navigator.geolocation.clearWatch(gpsWatch);gpsWatch=null}
function startLoc(){stopLoc();lastFix=null;
 if(S.mode==='gps'&&navigator.geolocation){const m=$('hGps');m.textContent=T('gpsWait');m.classList.add('on');
  if(!origin)place(YOYOGI.x,YOYOGI.y,true);
  gpsWatch=navigator.geolocation.watchPosition(onPos,onPosErr,{enableHighAccuracy:true,maximumAge:3000,timeout:25000})}
 else{const p=S.lastPos||YOYOGI;place(p.x,p.y,true);$('hGps').classList.remove('on')}updHud()}
function place(x,y,jump){if(!origin||Math.hypot(x-origin.x,y-origin.y)>2500){origin={x,y};MAP.setOrigin(x,y);jump=true}MAP.M.px=x;MAP.M.py=y;if(jump){MAP.M.ax=x;MAP.M.ay=y;G.walkTo=null}}
function onPos(pos){const c=pos.coords;const m=$('hGps');if(c.accuracy>120&&lastFix){m.textContent=T('gpsLost');m.classList.add('on');return}m.classList.remove('on');
 const p=project(c.latitude,c.longitude);const now=Date.now();
 if(!lastFix){lastFix={x:p.x,y:p.y,t:now};place(p.x,p.y,true);return}
 const d=Math.hypot(p.x-lastFix.x,p.y-lastFix.y),dt=(now-lastFix.t)/1000;if(d<4)return;
 const speed=d/Math.max(1,dt);if(speed<3.2)walked(d);// egg distance only at walking/jogging speed
 lastFix={x:p.x,y:p.y,t:now};place(p.x,p.y,d>400)}
function onPosErr(e){if(e.code===1){S.mode='explore';save();toast(T('locDenied'),4000);startLoc()}else{const m=$('hGps');m.textContent=T('gpsLost');m.classList.add('on')}}
function walked(m){S.dist+=m;if(S.inc){const egg=S.inc;if(S.dist-egg.start>=egg.km*1000&&!G.hatching){G.hatching=true;setTimeout(hatch,400)}}}
// ---------- map input ----------
const ptr=new Map();let gest=null;
function mapDown(e){if(G.view!=='map')return;AU.init();ptr.set(e.pointerId,{x:e.clientX,y:e.clientY,x0:e.clientX,y0:e.clientY,t:performance.now()});
 if(ptr.size===2){const [a,b]=[...ptr.values()];gest={pinch:Math.hypot(a.x-b.x,a.y-b.y),dist:MAP.M.tdist}}else if(ptr.size===1)gest={drag:false}}
function mapMove(e){const p=ptr.get(e.pointerId);if(!p)return;const dx=e.clientX-p.x,dy=e.clientY-p.y;p.x=e.clientX;p.y=e.clientY;
 if(ptr.size>=2&&gest&&gest.pinch){const [a,b]=[...ptr.values()];const d=Math.hypot(a.x-b.x,a.y-b.y);MAP.M.tdist=Math.max(34,Math.min(115,gest.dist*gest.pinch/Math.max(20,d)));gest.drag=true;return}
 if(gest&&(gest.drag||Math.hypot(e.clientX-p.x0,e.clientY-p.y0)>10)){gest.drag=true;MAP.M.tyaw-=dx*.0085;MAP.M.tdist=Math.max(34,Math.min(115,MAP.M.tdist+dy*.12))}}
function mapUp(e){const p=ptr.get(e.pointerId);ptr.delete(e.pointerId);if(!p||G.view!=='map')return;
 if(gest&&!gest.drag&&ptr.size===0&&performance.now()-p.t<600){tapMap(e.clientX,e.clientY)}if(ptr.size===0)gest=null}
function tapMap(x,y){const e=MAP.pick(x,y);if(e){const d=Math.hypot(e.d.x-MAP.M.ax,e.d.y-MAP.M.ay);
  if(e.kind==='spawn'){if(d<80)encounter(e.d);else toast(T('getCloser'));return}
  if(e.kind==='stop'){if(d<46)openStop(e.d);else toast(T('tooFar'));return}
  if(e.kind==='arena'){if(d<50)openArena(e.d);else toast(T('tooFar'));return}}
 if(S.mode!=='gps'){const g=MAP.screenToGround(x,y);if(g&&Math.hypot(g.X-MAP.M.px,g.Y-MAP.M.py)<260){G.walkTo=g;AU.play('tap')}}}
// joystick
let joy=null;
function joyDown(e){e.stopPropagation();AU.init();const r=$('joy').getBoundingClientRect();joy={id:e.pointerId,cx:r.left+r.width/2,cy:r.top+r.height/2,x:0,y:0};$('joy').setPointerCapture(e.pointerId);joyMove(e);G.walkTo=null}
function joyMove(e){if(!joy||e.pointerId!==joy.id)return;let dx=e.clientX-joy.cx,dy=e.clientY-joy.cy;const l=Math.hypot(dx,dy),mx=46;if(l>mx){dx*=mx/l;dy*=mx/l}joy.x=dx/mx;joy.y=dy/mx;$('joy').firstChild.style.transform=`translate(${dx}px,${dy}px)`}
function joyUp(e){if(!joy||e.pointerId!==joy.id)return;joy=null;$('joy').firstChild.style.transform=''}
// ---------- frame ----------
function frame(t){const dt=Math.min(.05,(t-G.last)/1000);G.last=t;requestAnimationFrame(frame);
 if(G.view!=='map'&&G.view!=='screen')return;if(!MAP.M.ready)return;
 const M=MAP.M,yaw=M.yaw;
 if(S.mode!=='gps'&&G.view==='map'){let mx=0,my=0;
  if(joy&&(Math.abs(joy.x)>.08||Math.abs(joy.y)>.08)){const fx=-Math.sin(yaw),fy=Math.cos(yaw),rx=Math.cos(yaw),ry=Math.sin(yaw);mx=rx*joy.x+fx*-joy.y;my=ry*joy.x+fy*-joy.y}
  else if(G.walkTo){const dx=G.walkTo.X-M.px,dy=G.walkTo.Y-M.py,l=Math.hypot(dx,dy);if(l<1.5)G.walkTo=null;else{mx=dx/l;my=dy/l}}
  const sp=7*Math.min(1,Math.hypot(mx,my)||0);if(sp>0){const l=Math.hypot(mx,my);const stepM=sp*dt;M.px+=mx/l*stepM;M.py+=my/l*stepM;walked(stepM);if(Math.random()<.01)S.lastPos={x:M.px,y:M.py}}}
 // smooth avatar
 const dx=M.px-M.ax,dy=M.py-M.ay,l=Math.hypot(dx,dy);if(l>.05){const mv=Math.min(l,Math.max(7,l*2.5)*dt);M.ax+=dx/l*mv;M.ay+=dy/l*mv;M.moving=Math.min(1,M.moving+dt*6);const sd=dx*Math.cos(yaw)+dy*Math.sin(yaw);if(Math.abs(sd)>l*.25)M.face=Math.sign(sd)}else M.moving=Math.max(0,M.moving-dt*4);
 const now=Date.now();
 if((G.refreshT-=dt)<=0){G.refreshT=1.2;MAP.refreshEntities(now,S.boostUntil>now);updNearby();
  for(const s of M.spawns){const d=Math.hypot(s.x-M.ax,s.y-M.ay);if(d<75&&!G.nearKeys.has(s.key)){G.nearKeys.add(s.key);AU.play('rustle');if(G.nearKeys.size>1)hint('nearbyHint')}}
  if(M.spawns.some(s=>Math.hypot(s.x-M.ax,s.y-M.ay)<75))hint('tapPal',4500)}
 if((G.nightT-=dt)<=0){G.nightT=30;const n=isNight();if(n!==M.night){MAP.setNight(n);if(G.started)AU.song(n?'night':'map')}}
 $('hNeedle').parentNode.style.transform=`rotate(${-yaw}rad)`;
 MAP.frame(G.view==='map'?dt:dt,now)}
// ---------- spawns / encounter ----------
function spawnLevel(s){return 1+Math.floor(s.lvR*Math.min(30,S.lv+3))}
function bgFor(ter,night){const r=Math.random();if(night)return r<.5?'shrine_night':'keyaki';if(ter==='water')return ['yoyogi','la_harbor','boardwalk'][Math.floor(r*3)];if(ter==='park')return ['park','yoyogi','lawn','ginkgo','shrine'][Math.floor(r*5)];return ['la_sawtelle','promenade','lawn'][Math.floor(r*3)]}
function encounter(s,bonus){if(!S.dex[s.sp])S.dex[s.sp]={seen:1,caught:0};const lv=bonus?bonus.lv:spawnLevel(s);const cp=calcCP(s.sp,lv,s.iv);
 $('scr').innerHTML='';G.view='enc';$('hud').classList.remove('on');ENC.resize();const n=(S.encN=(S.encN||0)+1);
 $('eHint').textContent=n<=3?T('flick'):(n===5||n===9)?T('curveHint'):'';setTimeout(()=>$('eHint').textContent='',6000);
 const tutorial=!S.tutCatch&&!bonus;if(tutorial)$('eHint').textContent=T('flick');
 ENC.startEncounter({tutorial,sp:s.sp,lv,iv:s.iv,shiny:s.shiny,hat:s.hat,cp,name:T(s.sp,1),bg:bonus?'lawn':bgFor(s.ter,MAP.M.night),T,toast,raid:!!bonus,bonus,
  onEnd:r=>afterEncounter(s,lv,r,bonus)})}
async function afterEncounter(s,lv,r,bonus){AU.song(MAP.M.night?'night':'map');G.view='map';$('hud').classList.add('on');
 if(r.ran){save();return}
 S.gone[s.key]=Date.now()+3600000;if(bonus)S.raidsDone[bonus.key]=1;
 if(r.fled){save();if(bonus)toast(T('fled'));return}
 if(r.caught){S.tutCatch=1;const isNew=!S.dex[s.sp].caught;S.dex[s.sp].caught=(S.dex[s.sp].caught||0)+1;if(s.shiny)S.dex[s.sp].shiny=1;if(s.hat)S.dex[s.sp].hat=1;
  const p=newPal(s.sp,lv,s.iv,s.shiny,{hat:!!s.hat});S.pals.push(p);
  let xp=100+(r.bonus==='excellent'?100:r.bonus==='great'?50:r.bonus==='nice'?10:0)+(r.curve?10:0)+(r.first?50:0)+(isNew?500:0);let gl=100+(s.shiny?400:0),tr=3+(SP[s.sp].rar==='r'?2:0);
  const lines=[`+${xp} ${T('xp')}`,`+${gl} ${T('glitter')}`,`+${tr} ${T('treats')}`];
  if(S.daily.catch!==today()){S.daily.catch=today();const k=Math.min(7,S.daily.streak||1);const bx=k>=7?2500:500,bg=k>=7?2000:600;xp+=bx;gl+=bg;lines.push(`${T('firstCatch')}: +${bx} ${T('xp')}`)}
  S.glitter+=gl;S.treats[SP[s.sp].fam]=(S.treats[SP[s.sp].fam]||0)+tr;addXP(xp);save();
  await popup({title:(isNew?T('newSp')+' ':'')+T(s.sp,1)+(s.shiny?' ✦':''),img:art(s.sp,s.shiny,s.hat),html:`<p>${esc(T('caught'))} CP ${p.cp}</p>`,lines});
  if(s.sp==='asmon')await popup({title:T('asmon',1),img:art('asmon'),html:`<p>${esc(T('asmon',1)+(S.lang==='ja'?'':' ')+T('joinTeam'))}</p>`});
  await flushLevelUps();save()}}
// ---------- stops ----------
const STOP_PICS=['park','yoyogi','ginkgo','la_sawtelle','promenade','shrine'];
function openStop(st){G.view='screen';$('hud').classList.remove('on');const used=S.spun[st.id]>Date.now();
 const el=screen(`<h2>${esc(S.lang==='ja'?st.ja:st.en)}</h2><div class="disc" id="disc"><div class="hex ${used?'used':''}"></div><div class="ph" style="background-image:url(bg/${STOP_PICS[st.pic]}.webp?v=${V})"></div></div><div class="sh">${esc(used?T('spun'):T('spinHint'))}</div><div class="loot" id="loot"></div><button class="sxbtn" id="sx">✕</button>`,'stop');
 el.querySelector('#sx').onclick=()=>{AU.play('back');closeScreen()};
 const disc=el.querySelector('#disc');let sx=null,rot=0;
 disc.onpointerdown=e=>{sx=e.clientX;disc.setPointerCapture(e.pointerId)};
 disc.onpointermove=e=>{if(sx==null)return;const d=e.clientX-sx;disc.style.transform=`rotateY(${d*.6}deg)`};
 disc.onpointerup=e=>{if(sx==null)return;const d=e.clientX-sx;sx=null;if(Math.abs(d)>50)spin(st,disc,Math.sign(d));else disc.style.transform=''}}
async function spin(st,disc,dir){disc.style.transition='transform 1s cubic-bezier(.2,.8,.3,1)';disc.style.transform=`rotateY(${dir*720}deg)`;
 if(S.spun[st.id]>Date.now()){AU.play('back');setTimeout(()=>{disc.style.transition='';disc.style.transform=''},1000);return}
 AU.play('spin');S.spun[st.id]=Date.now()+5*60000;disc.querySelector('.hex').classList.add('used');
 const r=Math.random,got={};const n=4+Math.floor(r()*3)+(S.lv>=10?1:0);const add=(k,c=1)=>got[k]=(got[k]||0)+c;
 if(bagCount()>=BAG_MAX&&!S.cheat){toast(T('bagFull'))}else for(let i=0;i<n;i++){const x=r();if(S.lv>=18&&x<.12)add('rjar');else if(S.lv>=10&&x<.3)add('gjar');else if(S.lv>=6&&x<.45)add('drop');else if(S.lv>=14&&x<.52)add('bun');else add('jar')}
 let egg=null;if(S.eggs.length<9&&r()<.22){const e=r();egg={id:Date.now(),km:e<.5?2:e<.85?5:10};S.eggs.push(egg)}
 for(const k in got)S.items[k]+=got[k];let xp=50;const lines=Object.entries(got).map(([k,c])=>`${ITEMS[k][S.lang]} ×${c}`);if(egg)lines.push(`${T('egg')} ${egg.km}${T('km')}`);
 if(S.daily.spin!==today()){S.daily.spin=today();xp+=500;lines.push(`${T('firstSpin')}: +500 ${T('xp')}`)}
 addXP(xp);lines.unshift(`+${xp} ${T('xp')}`);save();
 const loot=document.getElementById('loot');const imgs=[...Object.keys(got).flatMap(k=>Array(got[k]).fill(k==='drop'?'art/drop.png':k==='bun'?'art/bun.png':`art/${k}.png`)),...(egg?[`art/egg${egg.km}.png`]:[])];
 imgs.forEach((src,i)=>{const im=document.createElement('img');im.src=src+'?v='+V;const a=-Math.PI/2+(i-(imgs.length-1)/2)*.5;im.style.left='calc(50% - 27px)';im.style.top='40%';loot.appendChild(im);
  im.animate([{transform:'translate(0,0) scale(.3)',opacity:0},{transform:`translate(${Math.cos(a)*120}px,${Math.sin(a)*120+40}px) scale(1.1)`,opacity:1,offset:.5},{transform:`translate(${Math.cos(a)*120}px,${Math.sin(a)*120+260}px) scale(.7)`,opacity:0}],{duration:1500,delay:i*90,easing:'ease-out',fill:'forwards'});setTimeout(()=>AU.play('item'),i*90+300)});
 setTimeout(async()=>{await popup({title:T('stopItems'),lines});await flushLevelUps();closeScreen()},1500)}
// ---------- arenas / raids ----------
function team(){return [...S.pals].sort((a,b)=>b.cp-a.cp).slice(0,3)}
function openArena(a){G.view='screen';$('hud').classList.remove('on');const now=Date.now();const rd=a.raid&&!S.raidsDone[a.raid.key]?a.raid:null;
 const won=S.arenaWins[a.id]&&S.arenaWins[a.id]>now-30*60000;const sp=rd?rd.sp:a.def;const tm=team();
 const el=screen(`<button class="xbtn" id="ax">✕</button><h2>${esc(rd?T('raid'):T('arena'))}</h2>${rd?`<div class="stars">${'★'.repeat(rd.tier)}</div>`:''}
 <img class="boss" src="${art(sp)}" alt=""><div class="hd" style="font-size:24px">${esc(T(sp,1))}</div>
 <div class="info">${esc(rd?T('aboutRaid')+' '+T('raidEnds')+' '+Math.ceil((rd.end-now)/60000)+' min':won?T('arenaHold'):T('aboutRaid'))}</div>
 <div class="hd" style="color:#7a1d4a">${esc(T('team'))}</div><div class="tm">${tm.map(p=>`<div><img src="${art(p.sp,p.shiny,p.hat)}" alt="">CP ${p.cp}</div>`).join('')||`<div style="width:auto;padding:12px">${esc(T('nobody'))}</div>`}</div>
 <button class="btn pink" id="af" ${tm.length&&!(won&&!rd)?'':'disabled'}>${esc(T('fight'))}</button>`,'arena');
 el.querySelector('#ax').onclick=()=>{AU.play('back');closeScreen()};
 el.querySelector('#af').onclick=()=>{AU.play('tap');fight(a,rd)}}
function fight(a,rd){$('scr').innerHTML='';G.view='bat';BAT.resize();const tier=rd?rd.tier:a.tier;
 const opp=rd?{sp:rd.sp,lv:{1:20,3:25,5:30}[tier],hpMax:{1:260,3:450,5:650}[tier],tier}:{sp:a.def,lv:Math.min(35,S.lv+4+tier*2),hpMax:Math.round(calcHP(a.def,Math.min(35,S.lv+4+tier*2),[15,15,15])*9),tier};
 $('bHint').textContent=T('tapAtk')+' · '+T('swipeDodge');setTimeout(()=>$('bHint').textContent='',5500);
 BAT.startBattle({team:team(),opp,raid:!!rd,bg:rd?'keyaki':'lawn',T,onEnd:r=>afterBattle(a,rd,r)})}
async function afterBattle(a,rd,r){G.view='map';$('hud').classList.add('on');AU.song(MAP.M.night?'night':'map');
 if(!r.won){await popup({title:T('lose'),img:art(rd?rd.sp:a.def)});return}
 if(rd){const xp={1:600,3:1500,5:3000}[rd.tier];const gl={1:600,3:1200,5:2500}[rd.tier];S.glitter+=gl;S.items.jar+=3;if(S.lv>=6)S.items.drop+=2;S.treats[SP[rd.sp].fam]=(S.treats[SP[rd.sp].fam]||0)+5;addXP(xp);save();
  const alive=r.team.filter(x=>x.hp>0).length;const jars=5+alive*2;
  await popup({title:T('win'),img:art(rd.sp),lines:[`+${xp} ${T('xp')}`,`+${gl} ${T('glitter')}`,`${T('bonusJars')} ×${jars}`]});
  await flushLevelUps();
  const rr=rng(hash(rd.key,7));const s={key:'raid_'+rd.key,sp:rd.sp,iv:[10+Math.floor(rr()*6),10+Math.floor(rr()*6),10+Math.floor(rr()*6)],shiny:false,ter:'park'};
  setTimeout(()=>encounter(s,{jars,lv:{1:20,3:25,5:30}[rd.tier],key:rd.key}),300)}
 else{S.arenaWins[a.id]=Date.now();S.glitter+=300;S.items.jar+=2;addXP(300);save();await popup({title:T('arenaWin'),img:art(a.def),lines:[`+300 ${T('xp')}`,`+300 ${T('glitter')}`,`${ITEMS.jar[S.lang]} ×2`]});await flushLevelUps()}}
// ---------- eggs ----------
const EGG_POOL={2:SPECIES.filter(s=>s.egg===2).map(s=>s.id),5:SPECIES.filter(s=>s.egg===5).map(s=>s.id),10:SPECIES.filter(s=>s.egg===10).map(s=>s.id)};
async function hatch(){const inc=S.inc;if(!inc){G.hatching=false;return}while(G.view!=='map'&&G.view!=='screen')await new Promise(r=>setTimeout(r,800));
 S.inc=null;const pool=EGG_POOL[inc.km];const sp=pool[Math.floor(Math.random()*pool.length)];const iv=[10+Math.floor(Math.random()*6),10+Math.floor(Math.random()*6),10+Math.floor(Math.random()*6)];
 const p=newPal(sp,Math.min(20,S.lv),iv,Math.random()<1/64&&SHINY.has(sp));S.pals.push(p);const isNew=!(S.dex[sp]&&S.dex[sp].caught);S.dex[sp]=S.dex[sp]||{seen:1,caught:0};S.dex[sp].caught++;S.dex[sp].seen=1;
 const xp={2:200,5:500,10:1000}[inc.km]+(isNew?500:0),gl={2:400,5:800,10:1600}[inc.km],tr={2:6,5:12,10:20}[inc.km];S.glitter+=gl;S.treats[SP[sp].fam]=(S.treats[SP[sp].fam]||0)+tr;addXP(xp);save();
 AU.play('crack');await popup({title:T('hatch'),img:`art/egg${inc.km}.png?v=${V}`,cls:'hatchbox'});AU.play('hatch');
 await popup({title:T(sp,1)+(p.shiny?' ✦':''),img:art(sp,p.shiny),html:`<p>${esc(S.lang==='ja'?T(sp,1)+T('hatched'):T(sp,1)+' '+T('hatched'))} CP ${p.cp}</p>`,lines:[`+${xp} ${T('xp')}`,`+${gl} ${T('glitter')}`,`+${tr} ${T('treats')}`]});
 G.hatching=false;await flushLevelUps()}
// ---------- menus ----------
function sheet(title,body,onClose){G.view='screen';$('hud').classList.remove('on');const el=screen(`<div class="sheet"><div class="shead"><h2>${esc(title)}</h2><button class="xbtn" id="sx">✕</button></div><div class="sbody">${body}</div></div>`);
 el.querySelector('#sx').onclick=()=>{AU.play('back');if(onClose)onClose();else closeScreen()};return el}
function openMenu(){AU.play('open');const b=[['pals','🐾'],['dex','📖'],['items','🎒'],['eggs','🥚'],['me','⭐'],['options','⚙️']];
 const el=sheet(T('menu'),`<div class="grid">${b.map(([k,i])=>`<button class="card" data-k="${k}" style="padding:18px 6px"><div style="font-size:40px">${i}</div><div class="nm" style="font-size:15px;margin-top:6px">${esc(T(k))}</div></button>`).join('')}</div>
 <div class="cur" style="margin-top:16px"><div>${fmt(S.glitter)}<small>✨ ${esc(T('glitter'))}</small></div><div>${S.pals.length}<small>🐾 ${esc(T('pals'))}</small></div><div>${(S.dist/1000).toFixed(1)} km<small>👟 ${esc(T('walking'))}</small></div></div>`);
 el.querySelectorAll('[data-k]').forEach(e=>e.onclick=()=>{AU.play('tap');({pals:openPals,dex:openDex,items:openBag,eggs:openEggs,me:openMe,options:()=>openOptions(true)})[e.dataset.k]()})}
function openPals(){const sorts={cp:(a,b)=>b.cp-a.cp,new:(a,b)=>b.t-a.t,no:(a,b)=>SP[a.sp].no-SP[b.sp].no||b.cp-a.cp};const list=[...S.pals].sort(sorts[S.sort]||sorts.cp);
 const el=sheet(T('pals')+` ${S.pals.length}`,`<div class="sorts">${['cp','new','no'].map(k=>`<button class="chip ${S.sort===k?'on':''}" data-s="${k}">${esc(T('sort'+k[0].toUpperCase()+k.slice(1)))}</button>`).join('')}</div>
 <div class="grid">${list.map(p=>`<button class="card" data-u="${p.uid}">${p.fav?'<span class="tag">★</span>':''}<div class="cp">CP <b>${p.cp}</b></div><img src="${art(p.sp,p.shiny,p.hat)}" alt="" loading="lazy"><div class="nm">${esc(p.nick||T(p.sp,1))}${p.shiny?' ✦':''}</div><div class="bar"><i style="width:${Math.round((p.lv/40)*100)}%"></i></div></button>`).join('')||`<p class="desc">${esc(T('nobody'))}</p>`}</div>`,()=>openMenu());
 el.querySelectorAll('[data-s]').forEach(e=>e.onclick=()=>{S.sort=e.dataset.s;AU.play('tap');openPals()});
 el.querySelectorAll('[data-u]').forEach(e=>e.onclick=()=>{AU.play('tap');openPal(+e.dataset.u)})}
function arcSVG(f){const a0=Math.PI,a1=Math.PI+Math.PI*f;const R=140,cx=150,cy=150;const x=cx+R*Math.cos(a1),y=cy+R*Math.sin(a1);
 return `<svg class="arc" viewBox="0 0 300 160"><path d="M10 150 A140 140 0 0 1 290 150" fill="none" stroke="rgba(255,255,255,.45)" stroke-width="4"/><path d="M10 150 A140 140 0 0 1 ${x.toFixed(1)} ${y.toFixed(1)}" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="8" fill="#fff"/></svg>`}
function puCost(p){return {gl:200+Math.floor(p.lv)*100,tr:p.lv<20?1:p.lv<30?2:3}}
function openPal(uid){const p=S.pals.find(x=>x.uid===uid);if(!p)return openPals();const s=SP[p.sp],ty=TYPES[s.ty],fam=s.fam,tr=S.treats[fam]||0,pc=puCost(p),cap=Math.min(40,S.lv+2);
 G.view='screen';$('hud').classList.remove('on');
 const el=screen(`<div class="pd"><div class="pdtop" style="background:linear-gradient(${ty.c},#fffaf0)"><button class="favb ${p.fav?'on':''}" id="pf">★</button><button class="xbtn" id="px">✕</button>
 ${arcSVG(Math.min(1,p.lv/cap))}<div class="cpbig"><small>CP</small>${p.cp}</div><img class="art" src="${art(p.sp,p.shiny,p.hat)}" alt=""></div>
 <div class="pdb"><h3>${esc(T(p.sp,1))}${p.shiny?' <span style="color:#ffb21e">✦</span>':''}</h3><div class="hpbar"><i></i></div><div class="ctr">${p.hp} / ${p.hp} ${T('hp')} · ${esc(T('level'))} ${p.lv}</div>
 <div style="text-align:center"><span class="tyb" style="background:${ty.c}">${esc(ty[S.lang])}</span><span class="tyb" style="background:#b0a0c0">${esc(RAR_N[s.rar][S.lang])}</span>${p.hat?`<span class="tyb" style="background:#e0457b">${esc(T('holiday'))}</span>`:''}</div>
 <p class="desc">${esc(s.d[S.lang])}</p>
 <div class="cur"><div>${fmt(S.glitter)}<small>✨ ${esc(T('glitter'))}</small></div><div>${tr}<small>🍬 ${esc(T(s.fam==='bean'?'bean':fam,1)||'')} ${esc(T('treats'))}</small></div></div>
 <div class="acts"><button class="btn honey" id="pu" ${p.lv>=cap?'disabled':''}><span>${esc(T('power'))}</span><small>✨${fmt(pc.gl)} · 🍬${pc.tr}</small></button>
 ${s.evo?`<button class="btn pink" id="pe"><span>${esc(T('evolve'))} → ${esc(T(s.evo.to,1))}</span><small>🍬${s.evo.cost}</small></button>`:''}
 ${['pinco','pooh','bean'].includes(p.sp)?`<button class="btn ghost" id="pw"><span>${esc(T('buddy'))}</span><small>👣</small></button>`:''}
 <button class="btn ghost" id="pr"><span>${esc(T('release'))}</span><small>+1 🍬</small></button></div></div></div>`);
 el.querySelector('#px').onclick=()=>{AU.play('back');openPals()};
 el.querySelector('#pf').onclick=()=>{p.fav=!p.fav;save();AU.play('tap');openPal(uid)};
 el.querySelector('#pu').onclick=()=>{if(p.lv>=cap)return toast(T('maxLv'));if(!S.cheat&&S.glitter<pc.gl)return toast(T('needGl'));if(!S.cheat&&tr<pc.tr)return toast(T('needTr'));
  if(!S.cheat){S.glitter-=pc.gl;S.treats[fam]-=pc.tr}p.lv=Math.min(cap,p.lv+.5);refresh(p);save();AU.play('power');openPal(uid)};
 const pe=el.querySelector('#pe');if(pe)pe.onclick=async()=>{if(!S.cheat&&tr<s.evo.cost)return toast(T('needTr'));if(!S.cheat)S.treats[fam]-=s.evo.cost;const from=p.sp;
  const img=el.querySelector('img.art');AU.play('evolve');img.animate([{filter:'brightness(1)'},{filter:'brightness(4)',transform:'translateX(-50%) scale(1.1)'},{filter:'brightness(4)',transform:'translateX(-50%) scale(.9)'},{filter:'brightness(1)'}],{duration:1600});
  await new Promise(r=>setTimeout(r,1500));p.sp=s.evo.to;p.hat=false;refresh(p);const isNew=!(S.dex[p.sp]&&S.dex[p.sp].caught);S.dex[p.sp]=S.dex[p.sp]||{seen:1,caught:0};S.dex[p.sp].caught++;addXP(500+(isNew?500:0));save();
  await popup({title:T(p.sp,1),img:art(p.sp,p.shiny),html:`<p>${esc(S.lang==='ja'?T(from,1)+T('evolved')+' '+T(p.sp,1)+'に！':T(from,1)+' '+T('evolved')+' '+T(p.sp,1)+'!')}</p>`,lines:[`+${500+(isNew?500:0)} ${T('xp')}`]});await flushLevelUps();openPal(uid)};
 const pw=el.querySelector('#pw');if(pw)pw.onclick=()=>{S.avatar=p.sp;MAP.setAvatar(p.sp);updHud();save();AU.play('item');toast('👣 '+T(p.sp,1))};
 el.querySelector('#pr').onclick=async()=>{if(p.fav)return toast('★');const v=await popup({title:T('release'),img:art(p.sp,p.shiny,p.hat),html:`<p>${esc(T(p.sp,1))} CP ${p.cp}</p>`,buttons:[{t:T('yes'),v:1},{t:T('no'),v:0}]});
  if(v){S.pals=S.pals.filter(x=>x.uid!==uid);S.treats[fam]=tr+1;save();toast(T('released'));openPals()}}}
function openDex(){const seen=SPECIES.filter(s=>S.dex[s.id]).length,caught=SPECIES.filter(s=>S.dex[s.id]&&S.dex[s.id].caught).length;
 const el=sheet(T('dex'),`<div class="cur"><div>${seen}<small>${esc(T('seen'))}</small></div><div>${caught}/${SPECIES.length}<small>${esc(T('caughtN'))}</small></div></div>
 <div class="grid">${SPECIES.map(s=>{const d=S.dex[s.id];const c=d&&d.caught?'':d?'sil':'unk';return `<button class="card ${c}" data-d="${s.id}"><span class="no">#${String(s.no).padStart(3,'0')}</span>${d&&d.shiny?'<span class="tag">✦</span>':''}<img src="${art(s.id)}" alt="" loading="lazy"><div class="nm">${d?esc(T(s.id,1)):esc(T('unknown'))}</div></button>`}).join('')}</div>`,()=>openMenu());
 el.querySelectorAll('[data-d]').forEach(e=>e.onclick=()=>{const s=SP[e.dataset.d],d=S.dex[s.id];if(!d)return;AU.play('tap');
  popup({title:`#${String(s.no).padStart(3,'0')} ${T(s.id,1)}`,img:d.caught?art(s.id):art(s.id),html:`<div><span class="tyb" style="background:${TYPES[s.ty].c}">${esc(TYPES[s.ty][S.lang])}</span><span class="tyb" style="background:#b0a0c0">${esc(RAR_N[s.rar][S.lang])}</span></div><p>${d.caught?esc(s.d[S.lang]):esc(T('seen'))}</p>${d.caught&&SHINY.has(s.id)?`<p style="font-size:13px">${esc(T('shiny'))}: ${d.shiny?'✦':'—'}</p>`:''}${HATS.has(s.id)&&d.hat?`<p style="font-size:13px">${esc(T('holiday'))} 🎄</p>`:''}`,cls:d.caught?'':'silbox'})})}
function openBag(){const ks=['jar','gjar','rjar','drop','bun'];const ic=k=>k==='drop'?'art/drop.png':k==='bun'?'art/bun.png':`art/${k}.png`;
 const desc={jar:{en:'Flick it at a pal to befriend it.',ja:'なかまに投げて、なかよくなろう。'},gjar:{en:'Better than a Honey Jar.',ja:'ハニージャーより効果が高い。'},rjar:{en:'The best jar there is.',ja:'いちばん効果の高いジャー。'},drop:{en:'Makes the next jar more likely to work.',ja:'次のジャーでなかよくなりやすくなる。'},bun:{en:'Calms a pal so it hops around less.',ja:'なかまが落ち着いて、はねにくくなる。'}};
 sheet(T('items')+` ${bagCount()}/${BAG_MAX}`,`<div class="items">${ks.map(k=>{const lock=S.lv<ITEMS[k].lv&&!S.items[k];return `<div class="it ${lock?'lock':''}"><img src="${ic(k)}?v=${V}" alt=""><div><b>${esc(ITEMS[k][S.lang])}</b><small>${lock?esc(T('level'))+' '+ITEMS[k].lv:esc(desc[k][S.lang])}</small></div><em>${S.cheat&&k.endsWith('jar')?'∞':S.items[k]}</em></div>`}).join('')}</div>`,()=>openMenu())}
function openEggs(){const inc=S.inc;const prog=inc?Math.min(1,(S.dist-inc.start)/(inc.km*1000)):0;
 const el=sheet(T('eggs')+` ${S.eggs.length+(inc?1:0)}/9`,`<div class="inc"><img src="${inc?`art/egg${inc.km}.png?v=${V}`:'art/jar.png?v='+V}" alt="" style="${inc?'':'opacity:.25'}"><div style="flex:1"><b>${esc(T('basket'))}</b><div style="font-weight:700;color:#7a6a8a;font-size:14px">${inc?((S.dist-inc.start)/1000).toFixed(2)+' / '+inc.km+' km':esc(T('noEggs'))}</div><div class="pb"><i style="width:${prog*100}%"></i></div></div></div>
 <div class="eggs">${S.eggs.map((e,i)=>`<button data-i="${i}"><img src="art/egg${e.km}.png?v=${V}" alt="">${e.km} km</button>`).join('')}</div>${!S.eggs.length&&!inc?`<p class="desc">${esc(T('noEggs'))}</p>`:''}`,()=>openMenu());
 el.querySelectorAll('[data-i]').forEach(b=>b.onclick=async()=>{const e=S.eggs[+b.dataset.i];if(S.inc)return toast(T('basket'));const v=await popup({title:`${T('egg')} ${e.km} km`,img:`art/egg${e.km}.png?v=${V}`,buttons:[{t:T('incub'),v:1},{t:T('back'),v:0}]});
  if(v){S.eggs.splice(+b.dataset.i,1);S.inc={km:e.km,start:S.dist};save();AU.play('item');openEggs()}})}
function openMe(){const a=XP_LV[S.lv]||0,b=XP_LV[S.lv+1]||a;const caughtT=Object.values(S.dex).reduce((x,d)=>x+(d.caught||0),0);
 const el=sheet(T('me'),`<div style="text-align:center"><img src="${art(S.avatar)}" style="height:150px" alt=""><div class="hd" style="font-size:30px;color:#7a4ad0">${esc(T('level'))} ${S.lv}</div>
 <div class="hpbar" style="max-width:260px;height:12px"><i style="width:${S.lv>=40?100:(S.xp-a)/(b-a)*100}%;background:#ffb21e"></i></div><div class="ctr">${fmt(S.xp)} / ${fmt(b)} ${T('xp')}</div></div>
 <div class="stat">${esc(T('caughtN'))}<span>${caughtT}</span></div><div class="stat">${esc(T('dex'))}<span>${SPECIES.filter(s=>S.dex[s.id]&&S.dex[s.id].caught).length}/${SPECIES.length}</span></div>
 <div class="stat">👟 ${esc(T('walking'))}<span>${(S.dist/1000).toFixed(2)} km</span></div><div class="stat">${esc(T('daily'))}<span>${S.daily.streak||0} ${esc(T('dailyT'))}</span></div>
 <h3 class="hd" style="color:#7a4ad0;font-weight:400;margin:16px 0 4px">${esc(T('pickTitle'))}</h3><div class="avs">${['pinco','pooh','bean'].map(k=>`<button data-a="${k}" class="${S.avatar===k?'on':''}"><img src="${art(k)}" alt="">${esc(T(k,1))}</button>`).join('')}</div>`,()=>openMenu());
 el.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>{S.avatar=b.dataset.a;MAP.setAvatar(S.avatar);updHud();save();AU.play('tap');openMe()})}
function openOptions(fromMap){const seg=(id,opts,cur)=>`<div class="seg" id="${id}">${opts.map(([v,l])=>`<button data-v="${v}" class="${cur===v?'on':''}">${esc(l)}</button>`).join('')}</div>`;
 const body=`<div class="optrow">${esc(T('lang'))}${seg('oL',[['en','English'],['ja','日本語']],S.lang)}</div>
 <div class="optrow">${esc(T('music'))}${seg('oM',[['1',T('on')],['0',T('off')]],S.music?'1':'0')}</div>
 <div class="optrow">${esc(T('sfx'))}${seg('oS',[['1',T('on')],['0',T('off')]],S.sfx?'1':'0')}</div>
 <div class="optrow">${esc(T('mode'))}${seg('oG',[['gps',T('gps')],['explore',T('explore')]],S.mode==='gps'?'gps':'explore')}</div>
 <div class="optrow">${esc(T('arDef'))}${seg('oA',[['1',T('on')],['0',T('off')]],S.arDef?'1':'0')}</div>
 <div class="optrow">${esc(T('cheat'))}<span style="display:flex;gap:6px"><input id="oC" autocomplete="off" autocapitalize="characters" spellcheck="false"><button class="btn" id="oCb" style="min-height:44px;padding:0 14px">${esc(T('apply'))}</button></span></div><div id="oMsg" class="omsg" role="status"></div>
 <p class="privacy">🔒 ${esc(T('privacy'))}</p>
 <div style="text-align:center;margin-top:16px"><button class="btn ghost" id="oR">${esc(T('reset'))}</button></div><div class="ver">Honey Trails v${V} · LANZAGAMES</div>`;
 const el=fromMap?sheet(T('opt'),body,()=>openMenu()):screen(`<div class="sheet"><div class="shead"><h2>${esc(T('opt'))}</h2><button class="xbtn" id="sx">✕</button></div><div class="sbody">${body}</div></div>`,'');
 if(!fromMap)el.querySelector('#sx').onclick=()=>{AU.play('back');showTitle(true)};
 const bind=(id,fn)=>el.querySelectorAll(`#${id} button`).forEach(b=>b.onclick=()=>{fn(b.dataset.v);save();AU.play('tap');openOptions(fromMap)});
 bind('oL',v=>{S.lang=v;applyI18n();updHud()});bind('oM',v=>{S.music=v==='1';AU.setMusic(S.music)});bind('oS',v=>{S.sfx=v==='1';AU.setSfx(S.sfx)});
 bind('oG',v=>{if(v==='gps'&&S.mode!=='gps'){S.mode='gps';origin=null;if(G.started)startLoc()}else if(v==='explore'&&S.mode==='gps'){S.mode='explore';S.lastPos={x:MAP.M.px,y:MAP.M.py};if(G.started)startLoc()}});
 bind('oA',v=>{S.arDef=v==='1'});
 el.querySelector('#oCb').onclick=()=>{const v=(el.querySelector('#oC').value||'').trim().toUpperCase();el.querySelector('#oC').blur();if(v==='AMSABABY'){cheat()}else{AU.play('back');toast(T('cheatBad'))}};
 el.querySelector('#oR').onclick=async()=>{const v=await popup({title:T('reset'),html:`<p>${esc(T('resetQ'))}</p>`,buttons:[{t:T('no'),v:0},{t:T('yes'),v:1,c:'pink'}]});if(v){wipe();save();location.replace(location.pathname+'?r='+Date.now())}}}
function cheat(){S.cheat=true;S.glitter+=50000;['bean','pooping','goblin','wisp'].forEach(f=>S.treats[f]=(S.treats[f]||0)+200);S.boostUntil=Date.now()+30*60000;
 const now=Date.now();const rares=['bronny','kermit','kaise','bramble','toll','ogre','kgkermit','knasmon','hpbronny','wzpoop'];MAP.M.extra=(MAP.M.extra||[]).filter(s=>s.end>now);
 rares.forEach((sp,i)=>{const a=i/rares.length*Math.PI*2;MAP.M.extra.push({key:'ch'+now+'_'+i,sp,x:MAP.M.px+Math.cos(a)*22,y:MAP.M.py+Math.sin(a)*22,ter:'park',lvR:.7,iv:[15,15,15],shiny:i===0?false:SHINY.has(sp),end:now+30*60000})});
 G.refreshT=0;save();AU.play('lvup');toast(T('cheatOk'),3500)}
// ---------- daily ----------
async function daily(){const d=today();if(S.daily.day===d)return;const y=new Date(Date.now()-864e5);const yd=y.getFullYear()+'-'+(y.getMonth()+1)+'-'+y.getDate();
 S.daily.streak=S.daily.day===yd?Math.min(7,(S.daily.streak||0)+1):1;if(S.daily.streak===7&&S.daily.day===yd&&S.daily.prev7)S.daily.streak=1;S.daily.day=d;S.daily.prev7=S.daily.streak===7;
 const k=S.daily.streak;const rw={jar:5+k*2,drop:k>=3?3:0,gjar:k>=5?5:0};const lines=[];for(const x in rw)if(rw[x]){S.items[x]+=rw[x];lines.push(`${ITEMS[x][S.lang]} ×${rw[x]}`)}
 if(k===7){S.glitter+=2000;lines.push(`+2000 ${T('glitter')}`);if(S.eggs.length<9)S.eggs.push({id:Date.now(),km:10}),lines.push(`${T('egg')} 10 km`)}
 save();AU.play('item');await popup({title:`${T('daily')} · ${S.lang==='ja'?k+T('dailyT'):T('dailyT')+' '+k}`,html:`<div style="display:flex;gap:4px;justify-content:center;margin:8px 0">${[1,2,3,4,5,6,7].map(i=>`<span style="width:30px;height:30px;border-radius:50%;display:grid;place-items:center;font-weight:800;background:${i<=k?'#ffc93c':'#eee'}">${i}</span>`).join('')}</div>`,lines})}
// ---------- flow ----------
function showTitle(menu){G.view='title';$('hud').classList.remove('on');ENC.endEncounter();BAT.endBattle();
 const cast=[['pinco',8,30,.95],['bbean',26,4,.62],['pooh',40,22,.9],['bean',58,6,.8],['mogu',72,0,.6],['bronny',84,28,.98],['max',14,0,.6]];
 const has=S.started;
 const el=screen(`<div class="sun"></div><div class="hills"></div><div class="road"></div>
 <a class="chip tgames" href="../">◀ ${esc(T('allgames'))}</a><div class="tlang"><button class="chip ${S.lang==='en'?'on':''}" data-l="en">EN</button><button class="chip ${S.lang==='ja'?'on':''}" data-l="ja">日本語</button></div>
 <div class="tlogo"><div class="tkick">${esc(T('brand'))}</div><h1>Honey<span>Trails</span></h1><div class="tja">ハニートレイル</div><div class="tsub">${esc(T('sub'))}</div></div>
 <div class="tcast">${cast.map(([k,x,y,h],i)=>`<img src="${art(k)}" style="left:${x}%;bottom:${y}%;height:${h*44}%;animation:bob${i%2} ${2+i*.17}s ease-in-out infinite" alt="">`).join('')}</div>
 <div class="tmenu" id="tm">${menu?`${has?`<button class="btn honey" id="tc">${esc(T('cont'))}</button>`:''}<button class="btn ${has?'ghost':'honey'}" id="tn">${esc(T('newg'))}</button><div class="row"><button class="btn ghost" id="to">${esc(T('options'))}</button></div>`:`<div class="tap">${esc(T('tap'))}</div>`}</div>
 <div class="tbrand">© LANZAGAMES</div>`,'title');
 const st=document.createElement('style');st.textContent='@keyframes bob0{50%{transform:translateY(-8px)}}@keyframes bob1{50%{transform:translateY(-5px) rotate(2deg)}}';el.appendChild(st);
 el.querySelectorAll('[data-l]').forEach(b=>b.onclick=e=>{e.stopPropagation();S.lang=b.dataset.l;save();applyI18n();showTitle(menu)});
 if(!menu){el.onclick=e=>{if(e.target.closest('a'))return;AU.init();AU.song('title');AU.play('tap');showTitle(true)};return}
 AU.song('title');
 const tc=el.querySelector('#tc');if(tc)tc.onclick=()=>{AU.play('tap');enterMap()};
 el.querySelector('#tn').onclick=async()=>{AU.play('tap');if(has){const v=await popup({title:T('newg'),html:`<p>${esc(T('resetQ'))}</p>`,buttons:[{t:T('no'),v:0},{t:T('yes'),v:1,c:'pink'}]});if(!v)return;const lang=S.lang;wipe();S.lang=lang;origin=null;G.started=false}setupLoc()};
 el.querySelector('#to').onclick=()=>{AU.play('tap');openOptions(false)}}
function setupLoc(){G.view='setup';const el=screen(`<h2>${esc(T('locTitle'))}</h2><p class="sub">${esc(T('sub'))}</p>
 <button class="opt" id="lg"><span class="ic">📍</span><span><b>${esc(T('locGps'))}</b><small>${esc(T('locGpsSub'))}</small></span></button>
 <button class="opt" id="le"><span class="ic">🕹</span><span><b>${esc(T('locExp'))}</b><small>${esc(T('locExpSub'))}</small></span></button>
 <p class="privacy">🔒 ${esc(T('privacy'))}</p>`,'setup');
 el.querySelector('#lg').onclick=()=>{AU.play('tap');S.mode='gps';pickAvatar()};el.querySelector('#le').onclick=()=>{AU.play('tap');S.mode='explore';pickAvatar()}}
function pickAvatar(){const el=screen(`<h2>${esc(T('pickTitle'))}</h2><p class="sub">${esc(T('pickSub'))}</p><div class="avs">${['pinco','pooh','bean'].map(k=>`<button data-a="${k}" class="${S.avatar===k?'on':''}"><img src="${art(k)}" alt="">${esc(T(k,1))}</button>`).join('')}</div><button class="btn honey" id="ag" style="align-self:center;min-width:220px">${esc(T('go'))}</button>`,'setup');
 el.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>{S.avatar=b.dataset.a;AU.play('tap');el.querySelectorAll('[data-a]').forEach(x=>x.classList.toggle('on',x===b))});
 el.querySelector('#ag').onclick=()=>{AU.play('tap');intro()}}
function intro(){let i=1;const el=screen(`<img src="${art('prof')}" alt=""><div class="dlg"><b>${esc(T('prof',1))}</b><p id="it"></p><button class="btn honey" id="in">${esc(T('next'))}</button></div>`,'intro');
 const show=()=>{el.querySelector('#it').textContent=T('i'+i)};show();el.querySelector('#in').onclick=()=>{AU.play('tap');i++;if(i>4){S.started=true;S.items.jar=Math.max(S.items.jar,30);save();enterMap()}else show()}}
async function enterMap(){$('scr').innerHTML='';G.view='map';$('hud').classList.add('on');if(!MAP.M.ready){MAP.initMap($('map'))}MAP.setAvatar(S.avatar);
 const n=isNight();MAP.setNight(n);AU.song(n?'night':'map');if(!G.started||!origin){G.started=true;startLoc()}updHud();G.refreshT=0;
 await daily();await flushLevelUps();setTimeout(()=>{hint('drag',5500);if(S.mode!=='gps')setTimeout(()=>hint('walkTo',5000),6000)},800)}
// ---------- version banner ----------
async function checkVersion(){try{const r=await fetch('version.json?t='+Date.now(),{cache:'no-store'});if(!r.ok)return;const j=await r.json();if(j.version&&j.version!==V){const u=$('update');u.querySelector('span').textContent=T('update')+' (v'+j.version+')';u.querySelector('button').textContent=T('reload');u.classList.remove('hidden');u.querySelector('button').onclick=()=>{save();location.replace(location.pathname+'?v='+j.version)}}}catch(e){}}
// ---------- boot ----------
function boot(){load();if(!S.g101){S.g101=1;if(S.started)S.items.jar+=20;}AU.music=S.music;AU.sfx=S.sfx;applyI18n();
 const mc=$('map');mc.addEventListener('pointerdown',mapDown);addEventListener('pointermove',mapMove);addEventListener('pointerup',mapUp);addEventListener('pointercancel',mapUp);
 const j=$('joy');j.addEventListener('pointerdown',joyDown);j.addEventListener('pointermove',joyMove);j.addEventListener('pointerup',joyUp);j.addEventListener('pointercancel',joyUp);
 $('hHome').onclick=()=>{AU.play('back');save();showTitle(true)};$('hMenu').onclick=()=>openMenu();$('hMe').onclick=()=>{AU.play('tap');openMe()};$('hNear').onclick=()=>{AU.play('tap');const n=MAP.M.spawns.filter(s=>Math.hypot(s.x-MAP.M.ax,s.y-MAP.M.ay)<220).length;toast(n?`${T('nearby')}: ${n}`:T('nobody'))};
 $('hCompass').onclick=()=>{MAP.M.tyaw=Math.round(MAP.M.yaw/(Math.PI*2))*Math.PI*2;AU.play('tap')};
 // encounter input
 const ec=$('enc');ec.addEventListener('pointerdown',e=>{if(ENC.onDown(e.clientX,e.clientY))ec.setPointerCapture(e.pointerId);$('eSheet').classList.remove('on')});ec.addEventListener('pointermove',e=>ENC.onMove(e.clientX,e.clientY));ec.addEventListener('pointerup',e=>ENC.onUp(e.clientX,e.clientY));ec.addEventListener('pointercancel',e=>ENC.onUp(e.clientX,e.clientY,true));ec.addEventListener('lostpointercapture',e=>ENC.onUp(e.clientX,e.clientY,true));
 $('eRun').onclick=()=>ENC.run();$('eAR').onclick=()=>{AU.play('tap');ENC.toggleAR()};$('eJar').onclick=()=>ENC.cycleJar();
 $('eDrop').onclick=()=>{AU.play('tap');const sh=$('eSheet');if(sh.classList.contains('on')){sh.classList.remove('on');return}
  sh.innerHTML=['drop','bun'].map(k=>`<button data-b="${k}" ${(S.items[k]>0||S.cheat)?'':'disabled'}><img src="art/${k}.png?v=${V}" alt=""><span>${esc(ITEMS[k][S.lang])} ×${S.cheat?'∞':S.items[k]}<small>${esc(T(k==='drop'?'dropHint':'bunHint'))}</small></span></button>`).join('');
  sh.querySelectorAll('[data-b]').forEach(b=>b.onclick=()=>{ENC.useBerry(b.dataset.b);sh.classList.remove('on')});sh.classList.add('on')};
 const bc=$('bat');bc.addEventListener('pointerdown',e=>BAT.onDown(e.clientX,e.clientY));bc.addEventListener('pointerup',e=>BAT.onUp(e.clientX,e.clientY));$('bSpec').onclick=()=>BAT.special();
 addEventListener('resize',()=>{MAP.resize();ENC.resize();BAT.resize()});
 document.addEventListener('touchmove',e=>{if(!e.target.closest('.sbody,.pdb,.arena,.setup,.pbox'))e.preventDefault()},{passive:false});
 ['enc','bat','map'].forEach(id=>$(id).addEventListener('touchstart',e=>e.preventDefault(),{passive:false}));
 document.addEventListener('visibilitychange',()=>{if(document.hidden){save();AU.suspend()}else{AU.resume();checkVersion()}});
 addEventListener('pagehide',()=>save());
 document.addEventListener('gesturestart',e=>e.preventDefault());
 setInterval(save,20000);setTimeout(checkVersion,4000);setInterval(checkVersion,90000);
 requestAnimationFrame(frame);
 if(location.hash==='#map'&&S.started){AU.init();enterMap()}else showTitle(false)}
window.HT={BAT,ENC,S,MAP,G,encounter,openStop,openArena,cheat,walked,hatch,save,team,enterMap,openPal,openPals,openDex,openMenu,openBag,openEggs,openMe,openOptions,newPal,showTitle,fight};
boot();
