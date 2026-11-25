'use strict';
// ================= UI (DOM) =================
const $=s=>document.querySelector(s);
function h(tag,cls,html){const e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e}
const ICONC={};
function iconURL(id){const it=ITEMS[id];if(!it)return '';if(ICONC[id])return ICONC[id];let u;
 if(it.svg){u='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(SVG[it.svg].replace('<svg ','<svg xmlns="http://www.w3.org/2000/svg" color="'+(it.col||'#ccc')+'" '))}
 else u=emojiCanvas(it.e||'🎁',it.tint||'',96).toDataURL();return ICONC[id]=u}
function icon(id,extra=''){const it=ITEMS[id];return `<span class="ic ${extra}"><img src="${iconURL(id)}" alt="">${it&&it.dot?`<i class="dot" style="background:${it.dot}"></i>`:''}</span>`}
function fmt(n){return (n||0).toLocaleString()}
const UI={
 init(){
  // joystick
  const tz=$('#touch');let jid=null,ox=0,oy=0;const knob=$('#joy'),kn=$('#joyK');
  tz.addEventListener('pointerdown',e=>{if(G.mode!=='play'||this.blocking())return;if(G.interior&&G.interior.deco){House.tapFloor(e.clientX,e.clientY);return}if(e.clientX>innerWidth*.62&&e.clientY>innerHeight*.55)return;
   jid=e.pointerId;ox=e.clientX;oy=e.clientY;knob.style.left=ox+'px';knob.style.top=oy+'px';knob.classList.add('on');kn.style.transform='translate(0,0)';G.joy.on=true;ac();e.preventDefault()});
  const mv=e=>{if(e.pointerId!==jid)return;let dx=e.clientX-ox,dy=e.clientY-oy;const r=Math.hypot(dx,dy),mx=52;if(r>mx){dx*=mx/r;dy*=mx/r}kn.style.transform=`translate(${dx}px,${dy}px)`;G.joy.x=dx/mx;G.joy.y=dy/mx};
  const up=e=>{if(e.pointerId!==jid)return;jid=null;G.joy.x=G.joy.y=0;G.joy.on=false;knob.classList.remove('on')};
  addEventListener('pointermove',mv,{passive:true});addEventListener('pointerup',up);addEventListener('pointercancel',up);
  const tap=(sel,fn)=>$(sel).addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();ac();fn(e)});
  tap('#bAct',()=>{if(this.blocking())return;if(G.interior){if(House.nearDoor())House.exit();return}Act.go()});
  tap('#bTool',()=>this.toolTray());tap('#bBag',()=>this.bag());tap('#bPad',()=>this.pad());
  tap('#hDeco',()=>{if(G.interior.deco)House.decoEnd();else House.decoStart()});tap('#hStore',()=>this.storage());tap('#hOut',()=>House.exit());
  $('#dlg').addEventListener('pointerdown',e=>{e.preventDefault();this.dlgTap()});
  document.addEventListener('contextmenu',e=>e.preventDefault());
  // title
  $('#tStart').onclick=()=>{ac();Music.title();$('#tStart').classList.add('hide');$('#tMenu').classList.add('on')};
  $('#tCont').onclick=()=>{ac();S=loadSave();setLang(LANG);startPlay(false);this.toast(T('welcomeBack'))};
  $('#tNew').onclick=()=>{if(loadSave()){this.confirm(T('newWarn'),()=>this.create())}else this.create()};
  $('#tOpt').onclick=()=>this.options(true);
  document.querySelectorAll('[data-lang]').forEach(b=>b.onclick=()=>{setLang(b.dataset.lang);this.i18n()});
  this.i18n();this.titleState();
  setInterval(()=>this.checkVersion(),5*60e3);setTimeout(()=>this.checkVersion(),4000);
  $('#upd button').onclick=()=>{save();location.replace(location.pathname+'?v='+Date.now())};
 },
 i18n(){document.querySelectorAll('[data-t]').forEach(e=>e.textContent=T(e.dataset.t));document.querySelectorAll('[data-lang]').forEach(b=>b.classList.toggle('sel',b.dataset.lang===LANG));this.titleState();if(G.mode==='play'){this.refreshHud();this.tutCard()}},
 titleState(){const s=loadSave();$('#tCont').style.display=s?'':'none';if(s)$('#tContSub').textContent=(s.name||'')+' · '+(s.island||'')},
 show(k){for(const id of ['sTitle','sCreate','hud','houseHud'])$('#'+id).classList.remove('on');
  if(k==='title')$('#sTitle').classList.add('on');if(k==='create')$('#sCreate').classList.add('on');if(k==='hud')$('#hud').classList.add('on');if(k==='house'){$('#hud').classList.add('on');$('#houseHud').classList.add('on')}
  document.body.classList.toggle('inhouse',k==='house')},
 blocking(){return !!(this.dlgOpen||this.panelOpen||this.popOpen)},
 // ---------- HUD ----------
 refreshHud(){if(!S||G.mode!=='play')return;$('#hCoins').textContent=fmt(S.coins);$('#hStamps').textContent=fmt(S.stamps);
  const s=heldTool();$('#bTool').innerHTML=s?icon(s.id)+`<i class="dur" style="width:${Math.max(0,(s.d??ITEMS[s.id].dur)/ITEMS[s.id].dur*100)}%"></i>`:'<span class="ic none">✋</span>';
  this.clock(true)},
 clock(force){const d=now();const m=d.getMinutes();if(!force&&m===this._lm)return;this._lm=m;const hh=d.getHours();
  $('#hTime').textContent=LANG==='ja'?`${hh}:${String(m).padStart(2,'0')}`:`${hh%12||12}:${String(m).padStart(2,'0')}`;$('#hAmpm').textContent=LANG==='ja'?'':(hh<12?'AM':'PM');
  const wd=LANG==='ja'?'日月火水木金土'[d.getDay()]:['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getDay()];
  $('#hDate').textContent=LANG==='ja'?`${d.getMonth()+1}月${d.getDate()}日（${wd}）`:`${wd}, ${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getMonth()]} ${d.getDate()}`;
  const ss=season();$('#hSeason').textContent={spring:'🌸',summer:'☀️',autumn:'🍂',winter:'❄️'}[ss]+' '+T('season'+ss[0].toUpperCase()+ss.slice(1))},
 frame(dt){this._ft=(this._ft||0)+dt;this.clock();if(this._ft<.1)return;this._ft=0;
  let lab,ic;if(G.interior){lab=House.nearDoor()?T('act_exit'):T('act_none');ic=House.nearDoor()?'🚪':'✋';G._tgt=null}else{const t=Act.target();G._tgt=t;lab=T(Act.label(t));ic=Act.icon(t)}
  if(lab!==this._lab){this._lab=lab;$('#bActL').textContent=lab;$('#bActI').textContent=ic}
  $('#bAct').classList.toggle('alert',!!(G.fishing&&G.fishing.ph==='bite'));
  $('#sneak').classList.toggle('on',!!G.sneak&&!G.interior);
  // name tag of nearest npc
  const tag=$('#ntag');let best=null,bd=3.2;if(!G.interior)for(const id in G.npcs){const n=G.npcs[id];if(!n.vis)continue;const d=Math.hypot(n.x-G.pp.x,n.z-G.pp.z);if(d<bd){bd=d;best=n}}
  if(best&&!this.dlgOpen){const v=new THREE.Vector3(best.x,(walkH(G.W,best.x,best.z)??.3)+VILL[best.id].h+.15,best.z).project(G.cam);tag.style.left=((v.x+1)/2*innerWidth)+'px';tag.style.top=((1-v.y)/2*innerHeight)+'px';tag.textContent=N(VILL[best.id].n);tag.style.background=VILL[best.id].col;tag.classList.add('on')}else tag.classList.remove('on')},
 toast(msg){const t=h('div','toast',msg);$('#toasts').appendChild(t);setTimeout(()=>t.classList.add('out'),2600);setTimeout(()=>t.remove(),3100);while($('#toasts').children.length>3)$('#toasts').firstChild.remove()},
 itemGet(id,q=1){const t=h('div','toast get',icon(id)+'<span>'+(q>1?T('gotXn',N(ITEMS[id].n),q):T('gotX',N(ITEMS[id].n)))+'</span>');$('#toasts').appendChild(t);setTimeout(()=>t.classList.add('out'),2400);setTimeout(()=>t.remove(),2900);while($('#toasts').children.length>3)$('#toasts').firstChild.remove()},
 excl(){const e=$('#excl');e.classList.remove('on');void e.offsetWidth;e.classList.add('on')},
 catchPop(id,title,sub,isNew,ok){this.popOpen=true;const p=$('#pop');p.innerHTML=`<div class="pbox"><div class="big">${icon(id)}</div><h3>${title}</h3>${sub?`<p class="sub">${sub}</p>`:''}${isNew?`<p class="new">✨ ${T('newEntry')}</p>`:''}<p class="price">${icon('recipe','tiny').replace(/<img[^>]*>/,'')}${T('price')}: ${fmt(ITEMS[id].p)} 🍯</p></div>`;p.classList.add('on');
  const close=()=>{p.classList.remove('on');this.popOpen=false;p.onpointerdown=null};setTimeout(()=>{p.onpointerdown=e=>{e.preventDefault();close()}},450);setTimeout(()=>{if(this.popOpen&&p.classList.contains('on'))close()},4500)},
 badge(){if(!S)return;const n=this.claimable();$('#bPad').classList.toggle('badge',n>0)},
 claimable(){let n=0;for(const g of GOALS){if(!S.goals[g[0]]&&this.goalProg(g)>=g[4])n++}for(const d of (S.daily.list||[])){const def=DAILY_POOL.find(p=>p[0]===d.id);if(def&&!d.claimed&&d.prog>=def[4])n++}return n},
 goalProg(g){const k=g[3];if(k==='house')return S.house.tier+(S.house.tier===0&&S.house.debt===0?1:0)+(S.house.tier>0?1:0)>=g[4]?g[4]:(S.house.tier===0&&S.house.debt===0?1:S.house.tier);if(k==='donate'){let n=0;for(const c in S.museum)n+=Object.keys(S.museum[c]).length;return n}return S.stats[k]||0},
 tutCard(){const c=$('#tut');const x=S&&Tut.text();if(!x||G.mode!=='play'){c.classList.remove('on');return}c.classList.add('on');c.querySelector('.tt').textContent=x.t;c.querySelector('.tn').textContent=x.n+'/'+x.of;c.querySelector('.th').textContent=x.h;
  c.querySelector('.thb').onclick=()=>c.classList.toggle('open');c.querySelector('.tsk').onclick=()=>{Tut.skip();this.refreshHud()};c.querySelector('.thb').textContent=T('tutHintBtn');c.querySelector('.tsk').textContent=T('tutSkip')},
 afterNewDay(initial){if(!S)return;const msgs=[];if(S.houseReadyMsg){S.houseReadyMsg=false;msgs.push(T('houseReady'));buildPlayerHome()}
  for(const id of (S.moved||[]))msgs.push(T('movedIn',N(VILL[id].n)));S.moved=[];
  if(S.kaiseDay===dayNum())msgs.push(T('kaiseHere'));if(S.newHybrid){msgs.push(LANG==='ja'?'🌸 新しい色の花が咲きそう！':'🌸 A new flower color sprouted overnight!');S.newHybrid=0}
  msgs.forEach((m,i)=>setTimeout(()=>this.toast(m),600+i*1200));this.badge();this.tutCard();Music.tick()},
 // ---------- dialogue ----------
 dlgShow(id,text){const V=VILL[id];const d=$('#dlg');d.classList.add('on');this.dlgOpen=true;$('#dName').textContent=N(V.n);$('#dName').style.background=V.col;
  const art=NPC.art({id},1);$('#dArt').src='art/'+art+'.webp?v='+VERSION;$('#dArt').className='dart '+id;
  const tx=$('#dText');tx.textContent='';this._full=text;this._ti=0;this._typing=true;$('#dNext').style.opacity=0;clearInterval(this._tw);
  this._tw=setInterval(()=>{this._ti+=LANG==='ja'?1:2;tx.textContent=text.slice(0,this._ti);if(this._ti%3===0)SFX.play('blip',V.voice);if(this._ti>=text.length){clearInterval(this._tw);this._typing=false;$('#dNext').style.opacity=1;this._done&&this._done()}},28)},
 dlgTap(){if(this._typing){clearInterval(this._tw);this._typing=false;$('#dText').textContent=this._full;$('#dNext').style.opacity=1;this._done&&this._done();return}if(this._choices)return;if(this._res){const r=this._res;this._res=null;r()}},
 say(id,text){return new Promise(res=>{this._choices=null;this._done=null;this.dlgShow(id,text);this._res=()=>{this.dlgClose();res()}})},
 ask(id,text,choices){return new Promise(res=>{this._choices=choices;const box=$('#dCh');box.innerHTML='';
  this._done=()=>{box.innerHTML='';choices.forEach((c,i)=>{const b=h('button','ch',c);b.onpointerdown=e=>{e.preventDefault();e.stopPropagation();SFX.play('tap');box.innerHTML='';this._choices=null;this.dlgClose();res(i)};box.appendChild(b)});box.classList.add('on')};
  this.dlgShow(id,text)})},
 dlgClose(){$('#dlg').classList.remove('on');$('#dCh').classList.remove('on');$('#dCh').innerHTML='';this.dlgOpen=false},
 // ---------- generic panel ----------
 panel(title,build,opts={}){this.closePanel(true);this.panelOpen=true;SFX.play('open');const p=$('#panel');p.className='panel on '+(opts.cls||'');
  p.innerHTML=`<div class="pwrap"><div class="phead"><h2>${title}</h2><button class="x">✕</button></div><div class="pbody"></div><div class="pfoot"></div></div>`;
  p.querySelector('.x').onclick=()=>this.closePanel();this._onClose=opts.onClose;build(p.querySelector('.pbody'),p.querySelector('.pfoot'),p);},
 closePanel(silent){const p=$('#panel');if(!p.classList.contains('on'))return;p.classList.remove('on');p.innerHTML='';this.panelOpen=false;if(!silent)SFX.play('close');const f=this._onClose;this._onClose=null;f&&f();this.refreshHud()},
 confirm(msg,yes){this.panel('',(b,f)=>{b.innerHTML=`<p class="msg">${msg}</p>`;const y=h('button','btn pri',T('yes'));y.onclick=()=>{this.closePanel();yes()};const n=h('button','btn',T('no'));n.onclick=()=>this.closePanel();f.append(n,y)},{cls:'small'})},
 tabs(el,names,cur,fn){const t=h('div','tabs');names.forEach((n,i)=>{const b=h('button',i===cur?'sel':'',n);b.onclick=()=>fn(i);t.appendChild(b)});el.appendChild(t)},
 // ---------- leaf pad ----------
 pad(){this.panel(T('phone'),(b,f)=>{const g=h('div','apps');const A=[['app_tasks','🌟',()=>this.tasks()],['app_pedia','📖',()=>this.pedia()],['app_diy','🔨',()=>this.recipes()],['app_map','🗺️',()=>this.map()],['app_ward','👕',()=>this.wardrobe()],['app_friends','💚',()=>this.friends()],['app_help','❓',()=>this.help()],['app_opt','⚙️',()=>this.options()],['app_title','💾',()=>{save();location.reload()}],['allgames','🎮',()=>{save();location.href='../'}]];
  for(const [k,e,fn] of A){const a=h('button','app'+(k==='app_tasks'&&this.claimable()?' badge':''),`<span class="ai">${e}</span><span>${T(k)}</span>`);a.onclick=()=>{SFX.play('tap');fn()};g.appendChild(a)}b.appendChild(g);
  b.appendChild(h('p','padinfo',`${S.name} · ${S.island} · ${N(HOUSE[S.house.tier].n)}`))},{cls:'pad'})},
 help(){this.panel(T('app_help'),b=>{b.innerHTML=`<div class="help">${T('helpBody')}</div>`})},
 // ---------- bag ----------
 bagGrid(el,filter,onTap){const g=h('div','grid');S.bag.forEach((s,i)=>{const c=h('button','slot'+(s?'':' empty')+(S.held===i?' held':''));if(s){c.innerHTML=icon(s.id)+(s.q>1?`<b class="q">${s.q}</b>`:'')+(ITEMS[s.id].tool?`<i class="dur" style="width:${Math.max(0,(s.d??ITEMS[s.id].dur)/ITEMS[s.id].dur*100)}%"></i>`:'');if(filter&&!filter(s))c.classList.add('dim');else c.onclick=()=>onTap(i,s)}g.appendChild(c)});el.appendChild(g)},
 bag(){this.panel(T('bag'),(b,f)=>{const info=h('div','iinfo','');b.appendChild(info);
  const draw=()=>{b.querySelectorAll('.grid').forEach(x=>x.remove());this.bagGrid(b,null,(i,s)=>this.itemMenu(i,s,info,draw))};draw();
  info.innerHTML=`<span>${S.bag.filter(Boolean).length}/${S.bag.length}</span>`})},
 itemMenu(i,s,info,redraw){const it=ITEMS[s.id];const ops=[];
  info.innerHTML=`${icon(s.id)}<div><b>${N(it.n)}</b>${s.x&&s.x.cm?` · ${s.x.cm} cm`:''}<small>${T('price')}: ${fmt(it.p)} 🍯</small></div>`;
  if(it.tool)ops.push([T('m_equip'),()=>{S.held=i;updateHeld();this.closePanel();SFX.play('tap')}]);
  if(it.cat==='fruit')ops.push([T('m_eat'),()=>{this.take(i,1);this.toast(T('tasty'));SFX.play('pop');redraw()}]);
  if(it.plant&&!G.interior)ops.push([T('m_plant'),()=>{this.closePanel();this.plant(i)}]);
  if(it.cat==='fruit'&&s.id!=='coconut'&&!G.interior)ops.push([T('m_plant'),()=>{this.closePanel();this.plant(i,true)}]);
  if(['furn','fish','bug','fossil'].includes(it.cat)&&!G.interior)ops.push([T('m_place'),()=>{this.closePanel();this.placeOut(i)}]);
  if(['top','bottom','hat','shoe'].includes(it.cat))ops.push([T('m_wear'),()=>{this.take(i,1);S.owned[s.id]=1;this.wear(s.id);redraw()}]);
  if(['wall','floor'].includes(it.cat)&&G.interior)ops.push([T('m_open'),()=>{this.take(i,1);House.setSurface(s.id);redraw()}]);
  if(s.id==='recipe')ops.push([T('m_learn'),()=>{const r=s.x;if(S.recipes.includes(r))this.toast(T('knowIt'));else{S.recipes.push(r);this.toast(T('learned',N(ITEMS[RECIPES[r][0]].n)));SFX.play('jingle')}this.take(i,1);redraw()}]);
  if(it.cat==='furn'||['fish','bug','fossil','wall','floor','top','bottom','hat','shoe'].includes(it.cat))ops.push([T('m_store'),()=>{this.take(i,1,true);S.storage.push({id:s.id,q:1,x:s.x});SFX.play('pop');redraw()}]);
  if(!G.interior)ops.push([T('m_drop'),()=>{const q=s.q;this.take(i,q,true);dropItem(s.id,G.pp.x+Math.sin(G.yaw)*.7,G.pp.z+Math.cos(G.yaw)*.7,q);this.closePanel()}]);
  const m=h('div','imenu');ops.forEach(([l,fn])=>{const b=h('button','btn',l);b.onclick=fn;m.appendChild(b)});info.appendChild(m)},
 take(i,q,keepHeld){const s=S.bag[i];s.q-=q;if(s.q<=0){S.bag[i]=null;if(S.held===i){S.held=null;updateHeld()}}this.refreshHud()},
 frontTile(){const fx=G.pp.x+Math.sin(G.yaw)*1.0,fz=G.pp.z+Math.cos(G.yaw)*1.0;return [Math.floor(fx),Math.floor(fz)]},
 plant(i,fruit){const s=S.bag[i];const it=ITEMS[s.id];const [x,z]=this.frontTile();
  if(!freeTileWorld(x,z)||G.W.T[G.W.I(x,z)]!==TY.GRASS){this.toast(T('cantPlant'));SFX.play('nope');return}
  if(fruit||it.plant==='tree')addObj({t:'sapling',x,z,st:0,fr:fruit?s.id:null});
  else if(it.cat==='seed')addObj({t:'flower',x,z,sp:it.sp,col:it.col2,st:0});else addObj({t:'flower',x,z,sp:it.sp,col:it.col,st:3});
  this.take(i,1);stat('plant');playAnim('dig',.5);SFX.play('dig');this.toast(T('planted'));save()},
 placeOut(i){const s=S.bag[i];const it=ITEMS[s.id];const [x,z]=this.frontTile();if(!freeTileWorld(x,z)){this.toast(T('cantPlace'));SFX.play('nope');return}
  let id=s.id,x2;if(it.cat==='fish'){id='tank';x2=s.id}else if(it.cat==='bug'){id='cage';x2=s.id}else if(it.cat==='fossil'){id='fstand';x2=s.id}
  addObj({t:'furn',id,x,z,x2,r:Math.round(((G.yaw+Math.PI)%(Math.PI*2))/(Math.PI/2))%4});this.take(i,1);stat('outdoor');SFX.play('place');this.toast(T('placed'));save()},
 pickItem(title,filter){return new Promise(res=>{let done=false;this.panel(title,(b)=>{this.bagGrid(b,filter,(i)=>{done=true;this.closePanel();res(i)})},{onClose:()=>{if(!done)res(null)}})})},
 toolTray(){if(this.blocking())return;const tray=$('#tray');if(tray.classList.contains('on')){tray.classList.remove('on');return}tray.innerHTML='';
  const tools=S.bag.map((s,i)=>[s,i]).filter(([s])=>s&&ITEMS[s.id].tool);
  const none=h('button','tslot','<span class="ic none">✋</span>');none.onclick=()=>{S.held=null;updateHeld();tray.classList.remove('on')};tray.appendChild(none);
  for(const [s,i] of tools){const b=h('button','tslot'+(S.held===i?' sel':''),icon(s.id)+`<small>${N(ITEMS[s.id].n).replace(/^(Flimsy|Sturdy) /,'')}</small>`);b.onclick=()=>{S.held=i;updateHeld();SFX.play('tap');tray.classList.remove('on')};tray.appendChild(b)}
  if(!tools.length)tray.appendChild(h('div','tnone',LANG==='ja'?'どうぐがない。作業台でつくろう！':'No tools yet. Craft some at a workbench!'));
  tray.classList.add('on')},
 // ---------- crafting ----------
 craft(){let sel=null;this.panel(T('craftT'),(b,f)=>{b.appendChild(h('p','hint',T('craftHint')));const list=h('div','rlist');b.appendChild(list);
  const det=h('div','rdet');f.appendChild(det);
  const has=(m,q)=>m==='anyflower'?anyFlowerCount()>=q:bagCount(m)>=q;
  const draw=()=>{list.innerHTML='';const keys=S.recipes.filter(r=>RECIPES[r]).sort((a,b)=>{const ok=k=>Object.entries(RECIPES[k][2]).every(([m,q])=>has(m,q)||S.cheat);return ok(b)-ok(a)});
   for(const r of keys){const [out,q,mats]=RECIPES[r];const ok=Object.entries(mats).every(([m,qq])=>has(m,qq))||S.cheat;const c=h('button','rcard'+(ok?' ok':'')+(sel===r?' sel':''),icon(out)+`<span>${N(ITEMS[out].n)}</span>`);c.onclick=()=>{sel=r;draw();show()};list.appendChild(c)}};
  const show=()=>{if(!sel){det.innerHTML='';return}const [out,q,mats]=RECIPES[sel];const ok=Object.entries(mats).every(([m,qq])=>has(m,qq))||S.cheat;
   det.innerHTML=`<div class="mats">${Object.entries(mats).map(([m,qq])=>`<span class="mat ${has(m,qq)?'have':''}">${m==='anyflower'?'🌷':icon(m)}<b>${m==='anyflower'?anyFlowerCount():bagCount(m)}/${qq}</b></span>`).join('')}</div>`;
   const btn=h('button','btn pri'+(ok?'':' off'),T('craftBtn'));btn.onclick=()=>{if(!ok){this.toast(T('needMats'));SFX.play('nope');return}
    if(!S.cheat)for(const [m,qq] of Object.entries(mats)){if(m==='anyflower')removeAnyFlower(qq);else removeItem(m,qq)}
    if(!addItem(out,q)){this.toast(T('bagFull'));return}stat('craft');SFX.play('jingle');this.toast(T('crafted',N(ITEMS[out].n)));Tut.ev('craft:'+out);
    if(ITEMS[out].tool&&S.held==null){S.held=S.bag.findIndex(s=>s&&s.id===out);updateHeld()}draw();show()};det.appendChild(btn)};
  draw()})},
 recipes(){this.panel(T('app_diy'),b=>{const all=Object.keys(RECIPES);b.appendChild(h('p','hint',`${S.recipes.length}/${all.length}`));const l=h('div','rlist');
  for(const r of all){const k=S.recipes.includes(r);const [out,,mats]=RECIPES[r];l.appendChild(h('div','rcard'+(k?' ok':' locked'),(k?icon(out):'<span class="ic">❔</span>')+`<span>${k?N(ITEMS[out].n):'???'}</span>`+(k?`<small>${Object.entries(mats).map(([m,q])=>(m==='anyflower'?(LANG==='ja'?'花':'flowers'):N(ITEMS[m].n))+'×'+q).join(', ')}</small>`:'')))}b.appendChild(l)})},
 // ---------- shop ----------
 shop(who){const kaise=who==='kaise';this.panel(kaise?(LANG==='ja'?'カイセの服屋さん':"Kaise's Clothes Cart"):T('shopT'),(b,f)=>{const coins=h('div','wallet');b.appendChild(coins);const upd=()=>coins.innerHTML=`🍯 ${fmt(S.coins)}`;upd();
  const sec=(title,ids)=>{b.appendChild(h('h4','',title));const l=h('div','shoplist');for(const id of ids){const it=ITEMS[id];if(!it)continue;const p=Math.round(it.p*(it.cat==='seed'?4:it.tool?(id.startsWith('f')?4:2):(['top','bottom','hat','shoe','wall','floor','furn'].includes(it.cat)?2:1)));
   const c=h('button','scard',icon(id)+`<span>${N(it.n)}</span><b>${fmt(p)}</b>`);c.onclick=()=>{if(S.coins<p){this.toast(T('noCoins'));SFX.play('nope');return}if(!addItem(id)){this.toast(T('bagFull'));return}S.coins-=p;upd();SFX.play('coin');this.toast(T('bought',N(it.n)))};l.appendChild(c)}b.appendChild(l)};
  if(kaise)sec(T('daily'),S.shop.kaise||[]);
  else{sec(T('daily'),[...(S.shop.furn||[]),...(S.shop.wall||[]),...(S.shop.cloth||[])]);sec(T('always'),['sd_tulip_red','sd_tulip_yellow','sd_tulip_white','sd_rose_red','sd_rose_yellow','sd_rose_white','sd_cosmos_red','sd_cosmos_yellow','sd_cosmos_white','sapling','fshovel','fcan','frod','fnet','faxe'])}
  },{cls:'shop'})},
 sell(){const sel=new Set();this.panel(T('sell'),(b,f)=>{const tot=h('div','wallet');b.appendChild(tot);
  const draw=()=>{b.querySelectorAll('.grid').forEach(x=>x.remove());this.bagGrid(b,s=>ITEMS[s.id].p>0,(i)=>{if(sel.has(i))sel.delete(i);else sel.add(i);draw()});
   b.querySelectorAll('.grid .slot').forEach((c,i)=>c.classList.toggle('pick',sel.has(i)));let sum=0;sel.forEach(i=>{const s=S.bag[i];if(s)sum+=ITEMS[s.id].p*s.q});tot.innerHTML=`🍯 ${fmt(S.coins)} <span class="plus">${sum?'+ '+fmt(sum):''}</span>`;return sum};
  draw();const all=h('button','btn',T('sellAll'));all.onclick=()=>{S.bag.forEach((s,i)=>{if(s&&ITEMS[s.id].p>0&&!ITEMS[s.id].tool)sel.add(i)});draw()};
  const go=h('button','btn pri',T('sellSel'));go.onclick=()=>{let sum=0,n=0;sel.forEach(i=>{const s=S.bag[i];if(!s)return;sum+=ITEMS[s.id].p*s.q;n+=s.q;S.bag[i]=null;if(S.held===i){S.held=null;updateHeld()}});if(!n)return;sel.clear();S.coins+=sum;stat('earn',sum);stat('sellN',n);SFX.play('coin');this.toast(T('sold',fmt(sum)));Tut.ev('sell');draw();save()};f.append(all,go)},{cls:'sell'})},
 stampShop(){this.panel(T('stampShopT'),(b)=>{const w=h('div','wallet');b.appendChild(w);const upd=()=>w.innerHTML=`${icon('recipe','tiny').replace(/<img[^>]*>/,'')}<img class="stico" src="${'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(SVG.stamp.replace('<svg ','<svg xmlns="http://www.w3.org/2000/svg" '))}"> ${fmt(S.stamps)}`;upd();
  const l=h('div','shoplist');for(const s of STAMP_SHOP){const owned=s.pack&&Object.keys(RECIPES).filter(k=>RECIPES[k][3]===s.pack).every(k=>S.recipes.includes(k));if(s.id==='pk_holiday'&&!['autumn','winter'].includes(season())&&!S.cheat)continue;
   const ico=s.give?icon(s.give):`<span class="ic"><img src="data:image/svg+xml;charset=utf-8,${encodeURIComponent(SVG[s.svg].replace('<svg ','<svg xmlns="http://www.w3.org/2000/svg" '))}"></span>`;
   const c=h('button','scard'+(owned?' done':''),ico+`<span>${N(s.n)}</span><b>${owned?'✓':fmt(s.cost)}</b>`);
   c.onclick=()=>{if(owned)return;if(S.stamps<s.cost){this.toast(T('noStamps'));SFX.play('nope');return}
    if(s.pack){Object.keys(RECIPES).filter(k=>RECIPES[k][3]===s.pack).forEach(k=>{if(!S.recipes.includes(k))S.recipes.push(k)});this.toast(T('learned',N(s.n)))}
    else if(s.id==='bagup'){if(S.cap>=40){this.toast('✓');return}S.cap+=10;for(let i=0;i<10;i++)S.bag.push(null);this.toast('🎒 '+S.cap)}
    else{if(!canAdd(s.give,s.qty||1)){this.toast(T('bagFull'));return}addItem(s.give,s.qty||1);this.itemGet(s.give,s.qty||1)}
    S.stamps-=s.cost;upd();SFX.play('jingle');this.stampShop()};l.appendChild(c)}b.appendChild(l)},{cls:'shop'})},
 tasks(){this.panel(T('tasksT'),(b)=>{const w=h('div','wallet',`<img class="stico" src="data:image/svg+xml;charset=utf-8,${encodeURIComponent(SVG.stamp.replace('<svg ','<svg xmlns="http://www.w3.org/2000/svg" '))}"> ${fmt(S.stamps)}`);b.appendChild(w);
  const row=(name,prog,goal,rew,claimed,claim)=>{const r=h('div','task'+(claimed?' done':''));const pct=Math.min(100,prog/goal*100);r.innerHTML=`<div class="tl"><b>${name}</b><div class="bar"><i style="width:${pct}%"></i></div><small>${fmt(Math.min(prog,goal))}/${fmt(goal)}</small></div>`;
   const btn=h('button','btn'+(prog>=goal&&!claimed?' pri':' off'),claimed?T('claimed'):`+${rew}`);if(prog>=goal&&!claimed)btn.onclick=()=>{claim();S.stamps+=rew;SFX.play('jingle');this.toast(T('stampGet',rew));this.badge();save();this.tasks()};r.appendChild(btn);return r};
  b.appendChild(h('h4','',T('todayT')));for(const d of S.daily.list||[]){const def=DAILY_POOL.find(p=>p[0]===d.id);if(!def)continue;b.appendChild(row((LANG==='ja'?def[2]:def[1]).replace('{0}',def[4]),d.prog||0,def[4],def[5],d.claimed,()=>d.claimed=true))}
  b.appendChild(h('h4','',T('goalsT')));const gs=[...GOALS].sort((a,c)=>(!!S.goals[a[0]])-(!!S.goals[c[0]]));for(const g of gs)b.appendChild(row(LANG==='ja'?g[2]:g[1],this.goalProg(g),g[4],g[5],!!S.goals[g[0]],()=>S.goals[g[0]]=1))})},
 // ---------- museum / pedia ----------
 async donate(){const can=S.bag.map((s,i)=>[s,i]).filter(([s])=>{if(!s)return false;const it=ITEMS[s.id];if(!['fish','bug','fossil'].includes(it.cat))return false;return !(S.museum[it.cat]||{})[it.crit]});
  if(!can.length){await UI.say('kermit',T('nothingDonate'));return}
  const pick=await this.pickItem(T('donate'),s=>{const it=ITEMS[s.id];return ['fish','bug','fossil'].includes(it.cat)&&!(S.museum[it.cat]||{})[it.crit]});if(pick==null)return;
  const s=S.bag[pick];const it=ITEMS[s.id];(S.museum[it.cat]||(S.museum[it.cat]={}))[it.crit]=1;this.take(pick,1);SFX.play('fanfare');
  await UI.say('kermit',LANG==='ja'?`${N(it.n)}！すばらしい！博物館で大切にするよ。`:`A ${N(it.n).toLowerCase()}! Marvelous! It will have a lovely home in the museum.`);save();return this.donate()},
 museum(){this.pedia(true)},
 pedia(museum){let tab=0;const draw=()=>this.panel(museum?T('museumT'):T('app_pedia'),(b)=>{this.tabs(b,[T('fish'),T('bugs'),T('fossils')],tab,i=>{tab=i;draw()});
  const kind=['fish','bug','fossil'][tab];const list=tab===0?FISH:tab===1?BUGS:FOSSILS;const book=museum?(S.museum[kind]||{}):(S.pedia[kind]||{});
  const n=Object.keys(book).length;b.appendChild(h('p','hint',`${n}/${list.length}`+(museum?` · ${T('museumColl')}`:'')));
  const g=h('div','pgrid');const d=now(),hr=d.getHours(),mo=d.getMonth()+1;const det=h('div','pdet');
  for(const e of list){const id=(tab===0?'fi_':tab===1?'bu_':'fo_')+e[0];const got=!!book[e[0]];const c=h('button','pcell'+(got?' got':''),got?icon(id):`<span class="ic sil">${icon(id)}</span>`);
   if(tab<2){const live=(tab===0?inHours(hr,e[6])&&e[7].includes(mo):inHours(hr,e[5])&&e[6].includes(mo));if(live)c.classList.add('live')}
   c.onclick=()=>{const it=ITEMS[id];if(tab===2){det.innerHTML=`<b>${got?N(it.n):'???'}</b>`;return}
    det.innerHTML=`<b>${got||museum?N(it.n):'???'}</b><div class="kv"><span>${T('where')}</span>${T('w_'+e[3])}</div><div class="kv"><span>${T('when')}</span>${fmtHours(tab===0?e[6]:e[5])}</div><div class="kv"><span>${T('months')}</span>${fmtMonths(tab===0?e[7]:e[6])}</div>${got?`<div class="kv"><span>${T('price')}</span>${fmt(it.p)} 🍯</div>`:`<div class="kv"><i>${T('notYet')}</i></div>`}${c.classList.contains('live')?`<div class="nowtag">${T('nowHere')}</div>`:''}`};g.appendChild(c)}
  b.appendChild(g);b.appendChild(det)},{cls:'pedia'});draw()},
 // ---------- map ----------
 map(){this.panel(T('mapT'),(b)=>{const W=G.W;const c=document.createElement('canvas');const s=8;c.width=W.N*s;c.height=W.N*s;const x=c.getContext('2d');
  for(let z=0;z<W.N;z++)for(let xx=0;xx<W.N;xx++){const i=W.I(xx,z),t=W.T[i];x.fillStyle=t===TY.SEA?'#7fd3e6':t===TY.SAND?'#f2dfa9':t===TY.RIVER||t===TY.POND?'#5cb8e0':t===TY.BRIDGE?'#c99460':t===TY.DOCK?'#c99460':['#86cf6a','#6bb352','#579a42'][W.L[i]];x.fillRect(xx*s,z*s,s,s)}
  for(const o of S.w.objs){if(o.t==='tree'||o.t==='palm'){x.fillStyle='#3f8a3a';x.beginPath();x.arc(o.x*s+s/2,o.z*s+s/2,s*.38,0,7);x.fill()}}
  const pin=(px,pz,e,lab)=>{x.font='18px sans-serif';x.textAlign='center';x.fillText(e,px*s,pz*s+6)};
  pin(...LAY.marquee,'⛺');pin(...LAY.shop,'🍯');pin(...LAY.museum,'🏛️');pin(...LAY.tent,'🏠');for(const id in LAY.homes)if(S.vill[id]&&S.vill[id].in)pin(...LAY.homes[id],id==='mogu'?'🕳️':'🏡');
  x.fillStyle='#ff4d6d';x.beginPath();x.arc(G.pp.x*s,G.pp.z*s,6,0,7);x.fill();x.strokeStyle='#fff';x.lineWidth=2;x.stroke();
  c.className='map';b.appendChild(c);b.appendChild(h('p','hint','⛺ '+(LANG==='ja'?'島民サービス':'Resident Services')+' · 🍯 '+(LANG==='ja'?'お店':'Shop')+' · 🏛️ '+(LANG==='ja'?'博物館':'Museum')+' · 🏠 '+(LANG==='ja'?'あなたの家':'Your home')))})},
 // ---------- wardrobe ----------
 wear(id){const it=ITEMS[id];const k={top:'top',bottom:'bottom',hat:'hat',shoe:'shoe'}[it.cat];S.look[k]=id;buildPlayer();stat('dress');SFX.play('place');save()},
 wardrobe(){let tab=0;const draw=()=>this.panel(T('wardT'),(b)=>{this.tabs(b,[T('tops'),T('bottoms'),T('hats'),T('shoes'),T('looks')],tab,i=>{tab=i;draw()});
  if(tab<4){const cat=['top','bottom','hat','shoe'][tab];const ids=Object.keys(S.owned).filter(k=>ITEMS[k]&&ITEMS[k].cat===cat);const g=h('div','shoplist');
   if(cat==='hat'){const c=h('button','scard'+(!S.look.hat?' sel':''),'<span class="ic">🚫</span><span>'+T('noneHat')+'</span>');c.onclick=()=>{S.look.hat=null;buildPlayer();draw()};g.appendChild(c)}
   for(const id of ids){const c=h('button','scard'+(S.look[cat]===id?' sel':''),icon(id)+`<span>${N(ITEMS[id].n)}</span>`);c.onclick=()=>{this.wear(id);draw()};g.appendChild(c)}b.appendChild(g)}
  else this.lookEditor(b,()=>{buildPlayer();save()})},{cls:'ward'});draw()},
 lookEditor(b,onChange){const L=S?S.look:this._look;const row=(lab,arr,key,fmtf)=>{const r=h('div','lrow');r.appendChild(h('span','ll',lab));const o=h('div','opts');arr.forEach((v,i)=>{const c=h('button','opt'+((L[key]|0)===i?' sel':''),fmtf(v,i));c.onclick=()=>{L[key]=i;o.querySelectorAll('.opt').forEach((x,j)=>x.classList.toggle('sel',j===i));onChange()};o.appendChild(c)});r.appendChild(o);b.appendChild(r)};
  row(T('skin'),SKINS,'skin',v=>`<i class="sw" style="background:${v}"></i>`);row(T('hair'),HAIRS,'hair',(v,i)=>['◡','◖◗','●','✶','≋'][i]);row(T('hairC'),HAIRC,'hairC',v=>`<i class="sw" style="background:${v}"></i>`);row(T('eyes'),[0,1,2],'eyes',(v,i)=>['●●','◠◠','•  •'][i])},
 friends(){this.panel(T('friendsT'),(b)=>{for(const id of RESIDENTS){const v=S.vill[id];if(!v||!v.in)continue;const hh=hearts(v.f);const r=h('div','friend',`<img src="art/${NPC.art({id},0)}.webp?v=${VERSION}" alt=""><div><b>${N(VILL[id].n)}</b><div class="hearts">${'❤️'.repeat(hh)}${'🤍'.repeat(5-hh)}</div>${v.favor&&!v.favor.done?`<small>💭 ${LANG==='ja'?'おねがいがあるみたい':'Has a favor to ask'}</small>`:''}</div>`);b.appendChild(r)}})},
 // ---------- options ----------
 options(fromTitle){const O=S?S.opt:(this._opt=this._opt||{music:1,sfx:1});this.panel(T('optT'),(b)=>{
  const tog=(lab,k,fn)=>{const r=h('div','orow',`<span>${lab}</span>`);const bt=h('button','btn'+(O[k]?' pri':''),O[k]?T('on'):T('off'));bt.onclick=()=>{O[k]=O[k]?0:1;fn&&fn();save();this.options(fromTitle)};r.appendChild(bt);b.appendChild(r)};
  tog(T('music'),'music',()=>Music.vol());tog(T('sfx'),'sfx');
  const lr=h('div','orow',`<span>${T('lang')}</span>`);['en','ja'].forEach(l=>{const bt=h('button','btn'+(LANG===l?' pri':''),l==='en'?'English':'日本語');bt.onclick=()=>{setLang(l);this.i18n();this.options(fromTitle)};lr.appendChild(bt)});b.appendChild(lr);
  // cheat
  const ch=h('div','cheat');b.appendChild(h('h4','',T('cheat')));b.appendChild(ch);
  if(S&&S.cheat){ch.appendChild(h('p','ok',T('cheatOn')));const acts=[['ch_coins',()=>{S.coins+=50000}],['ch_stamps',()=>{S.stamps+=5000}],['ch_recipes',()=>{S.recipes=Object.keys(RECIPES)}],
    ['ch_mats',()=>{['wood','softwood','hardwood','stone','iron','clay','branch','weeds','shell'].forEach(m=>S.storage.push({id:m,q:30}));['wood','softwood','hardwood','iron','stone','branch'].forEach(m=>addItem(m,20));this.toast(LANG==='ja'?'ポケットと家に素材を入れた':'Materials added to pockets and home storage')}],
    ['ch_furn',()=>{FURN.forEach(f=>{if(!['tank','cage','fstand'].includes(f[0]))S.storage.push({id:f[0],q:1})});WALLS.concat(FLOORS).forEach(w=>S.owned[w[0]]=1);CLOTHES.forEach(c=>S.owned[c[0]]=1);this.toast(LANG==='ja'?'家のしまう場所に家具を入れた':'Furniture sent to home storage')}],
    ['ch_hour',()=>{S.timeOff+=3600e3;updateSky(true);Music.tick();NPC.schedule()}],['ch_day',()=>{const d=now();const nx=new Date(d);nx.setDate(nx.getDate()+(d.getHours()>=5?1:0));nx.setHours(5,1,0,0);S.timeOff+=nx-d;ensureDay();this.afterNewDay();updateSky(true);NPC.schedule()}],['ch_now',()=>{S.timeOff=0;ensureDay();updateSky(true);NPC.schedule()}],
    ['ch_house',()=>{if(S.house.pend>=0){S.house.tier=S.house.pend;S.house.pend=-1;S.house.debt=HOUSE[S.house.tier].debt;stat('house2')}else{S.house.debt=0}buildPlayerHome();updateSky(true)}],['ch_villagers',()=>{for(const id of RESIDENTS){const v=S.vill[id]||(S.vill[id]={f:0});v.in=true}buildVillHomes();NPC.spawnAll();updateSky(true)}],
    ['ch_tools',()=>{S.unbreak=!S.unbreak;this.toast(S.unbreak?'∞':'—')}],['ch_tut',()=>{if(!S.tut.done){Tut.grant();if(!bagCount('frod'))addItem('frod');if(!bagCount('fnet'))addItem('fnet');Tut.finish()}}]];
   if(!fromTitle){const g=h('div','cgrid');for(const [k,fn] of acts){const bt=h('button','btn',T(k)+(k==='ch_tools'&&S.unbreak?' ✓':''));bt.onclick=()=>{fn();SFX.play('coin');this.refreshHud();save();this.toast('✓ '+T(k))};g.appendChild(bt)}ch.appendChild(g)}
   const off=h('button','btn',T('cheatOff'));off.onclick=()=>{S.cheat=false;save();this.options(fromTitle)};ch.appendChild(off)}
  else if(S){const inp=h('input','cin');inp.placeholder=T('cheatPh');inp.autocapitalize='characters';inp.autocomplete='off';const bt=h('button','btn pri',T('apply'));bt.onclick=()=>{if(inp.value.trim().toUpperCase()==='AMSABABY'){S.cheat=true;save();SFX.play('fanfare');this.options(fromTitle)}else{this.toast(T('cheatBad'));inp.value=''}};ch.append(inp,bt)}
  else ch.appendChild(h('p','hint',LANG==='ja'?'ゲームを始めてから入力できます。':'Start or continue an island to enter a code.'));
  if(S){const del=h('button','btn danger',T('resetT'));del.onclick=()=>this.confirm(T('resetQ'),()=>{localStorage.removeItem(SAVE_KEY);location.reload()});b.appendChild(del)}
  b.appendChild(h('p','ver','Driftwood Days v'+VERSION+' · LANZAGAMES'))})},
 // ---------- home storage & decorating ----------
 storage(){let tab=0;const draw=()=>this.panel(T('storage'),(b)=>{this.tabs(b,[T('storage'),T('bag')],tab,i=>{tab=i;draw()});
  if(tab===0){const g=h('div','grid');S.storage.forEach((s,i)=>{const c=h('button','slot',icon(s.id)+(s.q>1?`<b class="q">${s.q}</b>`:''));c.onclick=()=>{if(!addItem(s.id,s.q,s.x)){this.toast(T('bagFull'));return}S.storage.splice(i,1);SFX.play('pop');draw()};g.appendChild(c)});if(!S.storage.length)b.appendChild(h('p','hint','—'));b.appendChild(g);b.appendChild(h('p','hint',T('toBag')))}
  else{this.bagGrid(b,s=>!ITEMS[s.id].tool,(i,s)=>{S.storage.push({id:s.id,q:s.q,x:s.x});S.bag[i]=null;SFX.play('pop');draw()});b.appendChild(h('p','hint',T('toStore')))}});draw()},
 deco(){const d=$('#decoBar');d.classList.add('on');$('#hDeco').classList.add('sel');let tab=0;
  const draw=()=>{d.innerHTML='';const tb=h('div','dtabs');[T('furnT'),T('wallT'),T('floorT')].forEach((n,i)=>{const b=h('button',i===tab?'sel':'',n);b.onclick=()=>{tab=i;draw()};tb.appendChild(b)});const dn=h('button','dok',T('done'));dn.onclick=()=>House.decoEnd();tb.appendChild(dn);d.appendChild(tb);
   const row=h('div','drow');
   if(tab===0){const src=[];S.bag.forEach((s,i)=>{if(s&&ITEMS[s.id].cat==='furn')src.push(['b',i,s])});S.storage.forEach((s,i)=>{if(ITEMS[s.id].cat==='furn')src.push(['s',i,s])});S.bag.forEach((s,i)=>{if(s&&['fish','bug','fossil'].includes(ITEMS[s.id].cat))src.push(['b',i,s])});
    for(const [w,i,s] of src){const c=h('button','dslot',icon(s.id)+(w==='s'?'<small>🏠</small>':''));c.onclick=()=>{const it=ITEMS[s.id];let id=s.id,x2=s.x;if(it.cat==='fish'){id='tank';x2=s.id}else if(it.cat==='bug'){id='cage';x2=s.id}else if(it.cat==='fossil'){id='fstand';x2=s.id}
      if(w==='b'){this.take(i,1)}else{S.storage[i].q--;if(S.storage[i].q<=0)S.storage.splice(i,1)}House.newItem(id,x2);draw()};row.appendChild(c)}
    if(!src.length)row.appendChild(h('div','dnone',LANG==='ja'?'置ける家具がない。お店で買うかDIYしよう！':'No furniture to place. Buy some at the shop or craft it!'))}
   else{const cat=tab===1?'wall':'floor';const ids=new Set(Object.keys(S.owned).filter(k=>ITEMS[k]&&ITEMS[k].cat===cat));S.bag.forEach(s=>{if(s&&ITEMS[s.id].cat===cat)ids.add(s.id)});
    for(const id of ids){const c=h('button','dslot'+(S.house[cat]===id?' sel':''),icon(id));c.onclick=()=>{const bi=S.bag.findIndex(s=>s&&s.id===id);if(bi>=0&&!S.owned[id])this.take(bi,1);House.setSurface(id);draw()};row.appendChild(c)}}
   d.appendChild(row);d.appendChild(h('p','dhint',House&&G.interior.sel?'':T('tapFloor')))};draw();this._decoDraw=draw},
 decoClose(){$('#decoBar').classList.remove('on');$('#hDeco').classList.remove('sel');$('#decoSel').classList.remove('on')},
 decoSel(it){const e=$('#decoSel');if(!it){e.classList.remove('on');this._decoDraw&&this._decoDraw();return}e.classList.add('on');e.innerHTML='';
  const nm=h('b','',N(ITEMS[it.id].n));e.appendChild(nm);const r=h('button','btn',T('rotate'));r.onclick=()=>House.rotate();const st=h('button','btn',T('storeIt'));st.onclick=()=>House.store();const c=h('button','btn',T('cancel'));c.onclick=()=>House.cancelSel();
  e.append(r,st,c);e.appendChild(h('small','',T('tapFloor')))},
 // ---------- character creation ----------
 create(){this.show('create');const L=this._look={skin:1,hair:1,hairC:1,eyes:0,top:'t_white',bottom:'b_shorts',shoe:'s_sneak',hat:null};
  if(!G.previewP){}
  const b=$('#cBody');b.innerHTML='';
  const nm=h('div','lrow',`<span class="ll">${T('yourName')}</span>`);const ni=h('input','cin');ni.maxLength=10;ni.value=T('defName');nm.appendChild(ni);b.appendChild(nm);
  const isl=h('div','lrow',`<span class="ll">${T('islandName')}</span>`);const ii=h('input','cin');ii.maxLength=12;ii.value=T('defIsland');isl.appendChild(ii);b.appendChild(isl);
  const prev=()=>{if(G.player)G.scene.remove(G.player);G.player=makePlayer(L);G.scene.add(G.player);G.player.position.set(27,.25,42.4);G.player.rotation.y=0};
  this.lookEditor(b,prev);
  const tops=['t_white','t_stripe','t_green','t_pink'];const r=h('div','lrow',`<span class="ll">${T('topC')}</span>`);const o=h('div','opts');tops.forEach(id=>{const c=h('button','opt'+(L.top===id?' sel':''),icon(id));c.onclick=()=>{L.top=id;o.querySelectorAll('.opt').forEach(x=>x.classList.remove('sel'));c.classList.add('sel');prev()};o.appendChild(c)});r.appendChild(o);b.appendChild(r);
  prev();G.mode='create';
  $('#cGo').onclick=()=>{const name=(ni.value.trim()||T('defName')).slice(0,10),island=(ii.value.trim()||T('defIsland')).slice(0,12);S=newSave(name,island,L);S.owned[L.top]=1;G.scene.remove(G.player);G.player=null;G.W=null;startPlay(true);
   setTimeout(()=>this.toast(LANG==='ja'?`${island}島へようこそ！`:`Welcome to ${island}!`),500)}},
 async checkVersion(){try{const r=await fetch('version.json?t='+Date.now(),{cache:'no-store'});if(!r.ok)return;const j=await r.json();if(j.version&&j.version!==VERSION){const u=$('#upd');u.querySelector('span').textContent=T('update')+' ('+j.version+')';u.querySelector('button').textContent=T('reload');u.classList.add('on')}}catch(e){}},
};
