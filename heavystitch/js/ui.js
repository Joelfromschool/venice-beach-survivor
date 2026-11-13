/* Heavy Stitch: menus, hangar, gacha, missions, options, results, save data. A LANZAGAMES production. v2.0 */
'use strict';
const HCATS={wpn:['wr','wl','sh','bk'],frame:['head','core','arms','legs'],sys:['booster','gen','fcs']};
const HS={
 KEY:'heavystitch_v1',lang:'en',scr:'sTitle',sel:'pinco',
 $:id=>document.getElementById(id),
 defState(){const own={};for(const id in PARTS)if(PARTS[id].tier===0&&!PARTS[id].gacha)own[id]=true;const ld={};for(const c of PLAYABLE)ld[c]=Object.assign({},STARTER);
  const ja=(navigator.language||'').toLowerCase().startsWith('ja');const mob=matchMedia('(pointer:coarse)').matches;
  return{v:2,cr:3000,flux:300,alloy:0,lv:{},pity:{},pulls:0,zbest:{round:0,score:0},started:false,owned:own,paints:{grey:true},load:ld,paint:{pinco:'grey',pooh:'grey',bean:'grey',asmon:'violet'},cleared:{},asmonUnlocked:false,seenOpening:false,cheat:false,sel:'pinco',
   opt:{lang:ja?'ja':'en',on:true,mv:.7,sv:1,shake:true,cam:'shoulder',q:mob&&(navigator.hardwareConcurrency||4)<=4?'low':'high'}};},
 load(){let s=null;try{s=JSON.parse(localStorage.getItem(this.KEY));}catch(e){}const d=this.defState();if(!s||(s.v!==1&&s.v!==2))return d;
  if(s.v===1){// v1 -> v2 migration: keep every part, paint, credit and clear; add the new systems and a welcome FLUX gift
   s.v=2;s.flux=(s.flux||0)+1000;s.alloy=0;s.lv={};s.pity={};s.zbest={round:0,score:0};s.started=true;s.welcomeV2=true;}
  s.opt=Object.assign(d.opt,s.opt||{});s.owned=Object.assign(d.owned,s.owned||{});s.paints=Object.assign(d.paints,s.paints||{});s.load=Object.assign(d.load,s.load||{});s.paint=Object.assign(d.paint,s.paint||{});
  s.lv=s.lv||{};s.pity=s.pity||{};s.zbest=Object.assign({round:0,score:0},s.zbest||{});
  for(const c of PLAYABLE)for(const sl of SLOTS)if(s.load[c][sl]===undefined||(s.load[c][sl]&&!PARTS[s.load[c][sl]]))s.load[c][sl]=STARTER[sl];return Object.assign(d,s);},
 save(){try{localStorage.setItem(this.KEY,JSON.stringify(this.state));}catch(e){}},
 hasSave(){return!!this.state.started;},
 T(k){const u=UI[k];if(!u)return k;return u[this.lang==='ja'?1:0];},
 L(o){return o?(o[this.lang]||o.en):'';},
 toast(t,ms){const el=this.$('toast');el.textContent=t;el.classList.add('on');clearTimeout(this.tt);this.tt=setTimeout(()=>el.classList.remove('on'),ms||2000);},
 crv(){document.querySelectorAll('.crv').forEach(e=>e.textContent=this.state.cr.toLocaleString());document.querySelectorAll('.fluxv').forEach(e=>e.textContent=this.state.flux.toLocaleString());document.querySelectorAll('.alloyv').forEach(e=>e.textContent=this.state.alloy.toLocaleString());},
 modal(html,btns){const m=this.$('modal');m.innerHTML=`<div class="mbox">${html}<div class="mbtns">${btns.map((b,i)=>`<button class="mbtn ${b[2]||''}" data-i="${i}">${b[0]}</button>`).join('')}</div></div>`;m.classList.add('on');
  m.querySelectorAll('[data-i]').forEach(x=>x.onclick=e=>{e.stopPropagation();m.classList.remove('on');AU.play('ui');const f=btns[+x.dataset.i][1];if(f)f();});},
 show(id){document.querySelectorAll('.screen').forEach(s=>s.classList.toggle('on',s.id===id));this.scr=id;
  if(id==='sMenu'){this.renderMenu();AU.playMusic('hangar');}if(id==='sHangar'){this.renderHangar();AU.playMusic('hangar');}if(id==='sMissions'){this.renderMissions();AU.playMusic('hangar');}
  if(id==='sGacha'){GACHA.render();AU.playMusic('gacha');}
  if(id==='sOptions')this.renderOptions();if(id==='sTitle'){this.renderTitle();AU.playMusic('title');}this.crv();},
 applyLang(){document.documentElement.lang=this.lang;document.querySelectorAll('[data-t]').forEach(e=>{e.textContent=this.T(e.dataset.t);});
  document.querySelectorAll('[data-lang]').forEach(b=>b.classList.toggle('on',b.dataset.lang===this.lang));const u=document.getElementById('updbar');if(u)u.textContent=this.T('updated');},
 setLang(l){this.lang=this.state.opt.lang=l;this.save();this.applyLang();if(this.scr!=='sGame'&&this.scr!=='sCut')this.show(this.scr);},
 cleared(id){return!!this.state.cleared[id];},
 storyList(){return MISSIONS.filter(m=>!m.free);},
 unlockedM(m){if(this.state.cheat)return true;if(m.free)return this.cleared(m.unlockAfter);const L=this.storyList();const i=L.indexOf(m);return i===0||this.cleared(L[i-1].id);},
 nextStory(){return this.storyList().find(m=>!this.cleared(m.id))||null;},
 paintOf(c){return PAINTS.find(p=>p.id===this.state.paint[c])||PAINTS[0];},
 async drawTo(cv,cid,load,paint,scale){const r=await composeAsync(cid,load,paint,{scale:scale||2});cv.width=r.canvas.width;cv.height=r.canvas.height;const g=cv.getContext('2d');g.clearRect(0,0,cv.width,cv.height);g.drawImage(r.canvas,0,0);return r;},
 // ---------- TITLE ----------
 renderTitle(){const tc=this.$('tCast');const has=this.hasSave();const c=this.$('tCont');c.disabled=!has;c.classList.toggle('dis',!has);this.$('tContSub').textContent=has?this.saveSummary():this.T('noSave');
  if(tc.dataset.k===this.castKey())return;tc.dataset.k=this.castKey();tc.innerHTML='';
  for(const c of['pooh','pinco','bean']){const cv=document.createElement('canvas');tc.appendChild(cv);this.drawTo(cv,c,this.state.load[c],this.paintOf(c),1.6);}},
 saveSummary(){const n=this.nextStory();const done=this.storyList().filter(m=>this.cleared(m.id)).length;return(n?`${this.T('ep')} ${String(n.ep).padStart(2,'0')}${this.T('epSuf')}`:(this.lang==='ja'?'全話クリア':'All clear'))+` · ◆ ${this.state.flux.toLocaleString()}`;},
 castKey(){return JSON.stringify([this.state.load.pinco,this.state.load.pooh,this.state.load.bean,this.state.paint]);},
 titleTap(){AU.unlock();AU.on=this.state.opt.on;AU.apply&&AU.apply();AU.playMusic('title');AU.play('slam',.7);this.$('sTitle').classList.add('go');},
 newGame(){const start=()=>{const lang=this.lang,opt=Object.assign({},this.state.opt);this.state=this.defState();this.state.opt=opt;this.state.opt.lang=lang;this.state.started=true;this.state.seenOpening=true;this.save();
   this.sel='pinco';this.mSel=null;this.renderTitle();CUT.playOP(()=>this.show('sMenu'));};
  if(this.hasSave())this.modal(`<h3>${this.T('newg')}</h3><p>${this.T('newgQ')}</p>`,[[this.T('yes'),start,'hot'],[this.T('no'),null]]);else start();},
 cont(){if(!this.hasSave())return;AU.play('ui');this.show('sMenu');if(this.state.welcomeV2){this.state.welcomeV2=false;this.save();setTimeout(()=>this.toast(this.T('welcomeV2'),5000),400);}},
 // ---------- MENU ----------
 renderMenu(){const h=this.$('mHero');h.innerHTML='';const cv=document.createElement('canvas');h.appendChild(cv);const c=this.sel;this.drawTo(cv,c,this.state.load[c],this.paintOf(c),1.8);
  const n=this.nextStory();this.$('mStorySub').textContent=n?`${this.T('ep')} ${String(n.ep).padStart(2,'0')}${this.T('epSuf')} · ${this.L(n.title)}`:(this.lang==='ja'?'全話クリア！ もう一度遊ぶ':'All episodes clear! Replay any');
  const zb=this.state.zbest;this.$('mZSub').textContent=zb.round?`${this.T('zbest')} ${zb.round}`:this.T('zsub');
  const ev=BANNERS.filter(b=>b.ev).map(b=>this.L(b.title)).join(' · ');this.$('mGSub').textContent=ev;},
 // ---------- HANGAR ----------
 hCat:'wpn',preview:null,
 slotName(s,c){const b=CHARS[c].body;if(s==='arms'&&b==='pod')return this.T('slot_arms_pod');if(s==='legs'&&b==='float')return this.T('slot_legs_float');if(s==='legs'&&b==='pod')return this.T('slot_legs_pod');return this.T('slot_'+s);},
 partAvail(p,c){if(p.only&&p.only!==c)return'hide';if(this.state.owned[p.id])return'own';if(p.gacha)return'gacha';if(p.reward)return p.only?'hide':'reward';if(p.unlock&&!this.cleared(p.unlock)&&!this.state.cheat)return'locked';return'shop';},
 epOf(id){const m=MISSIONS.find(x=>x.id===id);return m?(m.free?this.L(m.title):`${this.T('ep')} ${m.ep}${this.T('epSuf')}`):id;},
 lvOf(id){return this.state.lv[id]||0;},
 upCost(p){return(this.lvOf(p.id)+1)*25*(1+GACHA.rarOf(p.id));},
 renderHangar(){const c=this.sel,ch=CHARS[c];this.$('hName').textContent=ch.name[this.lang];this.$('hRole').textContent=this.L(ch.role);
  const hc=this.$('hChars');hc.innerHTML='';for(const id of PLAYABLE){const lock=id==='asmon'&&!this.state.asmonUnlocked;const b=document.createElement('button');b.className=(id===c?'on':'')+(lock?' lock':'');
   b.innerHTML=`<img src="${CHARS[id].img}" alt=""><span>${lock?'🔒':CHARS[id].name[this.lang]}</span>`;b.onclick=()=>{if(lock){AU.play('deny');this.toast(this.lang==='ja'?'第10話をクリアすると解放':'Clear Episode 10 to unlock');return;}this.sel=this.state.sel=id;this.save();this.preview=null;this.previewPaint=null;AU.play('ui');this.renderHangar();};hc.appendChild(b);}
  document.querySelectorAll('[data-hc]').forEach(t=>t.classList.toggle('on',t.dataset.hc===this.hCat));
  this.drawHangarChar();this.renderStats();this.renderList();},
 previewLoad(){const c=this.sel;return this.preview?Object.assign({},this.state.load[c],{[this.preview.slot]:this.preview.id}):this.state.load[c];},
 drawHangarChar(bump){const c=this.sel;const load=this.previewLoad();
  const paint=this.previewPaint?PAINTS.find(p=>p.id===this.previewPaint):this.paintOf(c);const cv=this.$('hCanvas');const tok=this.drawTok=(this.drawTok||0)+1;
  composeAsync(c,load,paint,{scale:2}).then(r=>{if(tok!==this.drawTok)return;cv.width=r.canvas.width;cv.height=r.canvas.height;const g=cv.getContext('2d');g.clearRect(0,0,cv.width,cv.height);g.drawImage(r.canvas,0,0);
   if(bump){cv.classList.remove('bump');void cv.offsetWidth;cv.classList.add('bump');}});},
 renderStats(){const c=this.sel;const cur=computeStats(c,this.state.load[c]);const pv=this.preview?computeStats(c,this.previewLoad()):null;
  const rows=[['st_ap','ap',16000],['st_def','def',340],['st_spd','spd',24],['st_en','en',4400],['st_fire','fire',9000]];let h='';
  const fmt=(f,x)=>f==='spd'?x.toFixed(1):Math.round(x).toLocaleString();
  for(const[k,f,mx]of rows){const v=cur[f];h+=`<div class="st"><span>${this.T(k)}</span><div class="sb"><i style="width:${Math.min(100,v/mx*100)}%"></i></div><em>${fmt(f,v)}</em></div>`;}
  const ld=Math.round(cur.weight/cur.load*100);h+=`<div class="st ${cur.over>0?'dn':''}"><span>${this.T('st_load')}</span><div class="sb"><i style="width:${Math.min(100,ld)}%;background:${cur.over>0?'var(--red)':'var(--gold)'}"></i></div><em>${ld}%</em></div>`;
  this.$('hStats').innerHTML=h;
  const dc=this.$('hDelta');if(!pv||!this.preview){dc.classList.remove('on');return;}
  const p=this.preview.id?PARTS[this.preview.id]:null;let d='';for(const[k,f]of[...rows,['st_load','weight']]){const a=cur[f],b=pv[f];const df=b-a;if(Math.abs(df)<(f==='spd'?.05:.5))continue;const good=f==='weight'?df<0:df>0;
   d+=`<div class="${good?'u':'d'}"><span>${this.T(k)}</span><b>${df>0?'+':''}${fmt(f,df)}</b></div>`;}
  if(pv.over>0)d+=`<div class="d"><span>⚠</span><b>${this.T('overweight')}</b></div>`;
  dc.innerHTML=`<small>${this.T('compare')}</small><h4>${p?p.name[this.lang]:(this.lang==='ja'?'（なし）':'(empty)')}</h4>${d||`<div><span>—</span><b>±0</b></div>`}`;dc.classList.add('on');},
 rowHTML(p,s,c){const av=this.partAvail(p,c);const eq=this.state.load[c][s]===p.id;const r=GACHA.rarOf(p.id);const lv=this.lvOf(p.id);
  let act;if(eq)act=`<span class="tag eq">${this.T('equipped')}</span>`;else if(av==='own')act=`<button class="btn hot" data-a="eq">${this.T('equip')}</button>`;
  else if(av==='shop')act=`<button class="btn" data-a="buy">${p.price.toLocaleString()} CR</button>`;else if(av==='gacha')act=`<button class="btn gach" data-a="gacha">◆ ${this.T('gachaOnly')}</button>`;
  else act=`<span class="tag">🔒 ${av==='reward'?this.epOf(p.reward):this.epOf(p.unlock)}</span>`;
  const up=av==='own'?(lv>=5?`<span class="tag lv">${this.T('lv')} ${this.T('maxLv')}</span>`:`<button class="btn up" data-a="up">▲ ${this.T('lv')}${lv+1} · ${this.upCost(p)}</button>`):'';
  return`<div class="pi r${r} ${eq?'eq':''} ${av==='own'||eq?'':'nown'} ${this.preview&&this.preview.id===p.id?'pv':''}" data-id="${p.id}" data-s="${s}"><canvas class="ic" data-ic="${p.id}" width="64" height="64"></canvas>
   <div class="pm"><div class="pn">${p.name[this.lang]}</div><div class="pt"><b style="color:${RCOL[r]}">${RAR[r]}</b>${lv?` · ${this.T('lv')}${lv}`:''}${p.only?' · '+CHARS[p.only].name[this.lang]:''}</div><div class="pd">${this.partStats(p)}</div></div>
   <div class="pa">${act}${up}</div></div>`;},
 partStats(p){const L=this.lang==='ja';const o=[];const add=(k,v)=>o.push(`<span>${k} <b>${v}</b></span>`);
  if(p.cls){const cn={rifle:['Rifle','ライフル'],shotgun:['Shotgun','ショットガン'],cannon:['Cannon','キャノン'],laser:['Laser','レーザー'],blade:['Blade','ブレード'],pile:['Pile','パイル'],missile:['Missiles','ミサイル'],mortar:['Mortar','迫撃砲'],rocket:['Rockets','ロケット'],gatling:['Gatling','ガトリング'],rack:['Repair','修理'],drones:['Drones','ドローン'],pulse:['Shield pulse','パルスシールド'],rail:['Railgun','レールガン']}[p.cls];
   o.push(`<span class="u">${cn[L?1:0]}</span>`);if(p.dmg)add(L?'威力':'DMG',p.dmg+(p.pel?'×'+p.pel:'')+(p.n?'×'+p.n:'')+(p.hits?'×'+p.hits:''));if(p.rate&&p.cls!=='rack')add(L?'連射':'RATE',p.rate+'/s');if(p.mag)add(L?'装弾':'MAG',p.mag);if(p.kits)add(L?'キット':'KITS','+'+p.kits);}
  else{if(p.ap)add('AP',p.ap.toLocaleString());if(p.def)add(L?'防御':'DEF',p.def);if(p.spd&&p.slot==='legs')add(L?'速度':'SPD','×'+p.spd);if(p.load)add(L?'積載':'LOAD',p.load.toLocaleString());if(p.thrust)add(L?'推力':'THRUST','×'+p.thrust);if(p.dash&&p.slot==='booster')add('DASH','×'+p.dash);
   if(p.en&&p.slot==='gen')add('EN',p.en);if(p.regen)add(L?'回復':'REGEN',p.regen);if(p.range)add(L?'射程':'RANGE',p.range+'m');if(p.aim)add(L?'射撃':'AIM','×'+p.aim);if(p.melee)add(L?'格闘':'MELEE','×'+p.melee);}
  if(p.w)add(L?'重量':'WT',p.w);return o.join('');},
 renderList(){const c=this.sel,el=this.$('hList');const keep=el.scrollTop;el.innerHTML='';
  if(this.hCat==='paint'){let h='<div class="paints">';for(const p of PAINTS){const own=this.state.paints[p.id];const lock=!own&&(p.gacha||p.reward||(p.unlock&&!this.cleared(p.unlock)&&!this.state.cheat));const on=this.state.paint[c]===p.id;
    h+=`<button class="pt2 ${on?'on':''} ${lock?'lock':''}" data-p="${p.id}"><i style="background:linear-gradient(135deg,${p.p} 0 50%,${p.a} 50% 75%,${p.g} 75%)"></i><span>${this.L(p.name)}</span><small>${on?this.T('equipped'):own?this.T('owned'):p.gacha?'◆ '+this.T('gachaOnly'):lock?'🔒 '+(p.reward?this.epOf(p.reward):this.epOf(p.unlock)):p.price.toLocaleString()+' CR'}</small></button>`;}
   el.innerHTML=h+'</div>';el.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>{const p=PAINTS.find(x=>x.id===b.dataset.p);const S=this.state;
    if(S.paints[p.id]){S.paint[c]=p.id;this.previewPaint=null;this.save();AU.play('clank');this.renderList();this.drawHangarChar(true);this.renderTitle&&0;return;}
    if(p.gacha){this.previewPaint=p.id;this.drawHangarChar();AU.play('ui');this.toast(this.T('gachaOnly'));return;}
    if(b.classList.contains('lock')){this.previewPaint=p.id;this.drawHangarChar();AU.play('deny');return;}
    if(S.cr<p.price){AU.play('deny');this.toast(this.T('notEnough'));return;}S.cr-=p.price;S.paints[p.id]=true;S.paint[c]=p.id;this.previewPaint=null;this.save();AU.play('buy');this.crv();this.renderList();this.drawHangarChar(true);});
   el.scrollTop=keep;return;}
  let h='';for(const s of HCATS[this.hCat]){const list=Object.values(PARTS).filter(p=>p.slot===s&&this.partAvail(p,c)!=='hide').sort((a,b)=>{const ao=this.state.load[c][s]===a.id?-1:0,bo=this.state.load[c][s]===b.id?-1:0;if(ao!==bo)return ao-bo;const oa=this.state.owned[a.id]?0:1,ob=this.state.owned[b.id]?0:1;if(oa!==ob)return oa-ob;return(a.tier-b.tier)||(a.price-b.price);});
   h+=`<h4 class="sh">${this.slotName(s,c)}</h4>`;h+=list.map(p=>this.rowHTML(p,s,c)).join('');}
  el.innerHTML=h;el.scrollTop=keep;
  const pt=this.paintOf(c);el.querySelectorAll('canvas[data-ic]').forEach(cv=>{const ic=partIcon(cv.dataset.ic,pt,64);if(ic)cv.getContext('2d').drawImage(ic,0,0);});
  el.querySelectorAll('.pi').forEach(d=>d.onclick=ev=>{const p=PARTS[d.dataset.id],s=d.dataset.s;const a=ev.target.closest('[data-a]');
   if(a){ev.stopPropagation();const k=a.dataset.a;if(k==='buy')this.buy(p,s);else if(k==='eq')this.equip(s,p.id);else if(k==='up')this.upgrade(p);else if(k==='gacha'){AU.play('ui');GACHA.bi=Math.max(0,BANNERS.findIndex(b=>b.feat&&b.feat.includes(p.id)));this.show('sGacha');}return;}
   this.preview={slot:s,id:p.id};AU.play('ui',.4);el.querySelectorAll('.pi.pv').forEach(x=>x.classList.remove('pv'));d.classList.add('pv');this.renderStats();this.drawHangarChar();});},
 buy(p,s){if(this.state.cr<p.price){AU.play('deny');this.toast(this.T('notEnough'));return;}this.state.cr-=p.price;this.state.owned[p.id]=true;AU.play('buy');this.crv();this.equip(s,p.id);},
 equip(s,id){const c=this.sel;this.state.load[c][s]=id;this.preview=null;this.save();AU.play('clank');this.renderList();this.renderStats();this.drawHangarChar(true);},
 upgrade(p){const S=this.state,cost=this.upCost(p);if(this.lvOf(p.id)>=5)return;if(S.alloy<cost&&!S.cheat){AU.play('deny');this.toast(this.T('notEnoughAlloy'));return;}if(!S.cheat)S.alloy-=cost;S.lv[p.id]=this.lvOf(p.id)+1;this.save();AU.play('sr');this.crv();
  this.toast(`${p.name[this.lang]} ${this.T('lv')}${S.lv[p.id]}`);this.renderList();this.renderStats();},
 // ---------- MISSIONS ----------
 mSel:null,
 renderMissions(){const el=this.$('mList');el.innerHTML='';const add=(h)=>{const x=document.createElement('h3');x.textContent=h;el.appendChild(x);};
  if(!this.mSel){const n=this.nextStory();this.mSel=(n||this.storyList()[0]).id;}
  const row=m=>{const un=this.unlockedM(m);const b=document.createElement('button');b.className='ep'+(m.id===this.mSel?' on':'')+(un?'':' lock');b.dataset.m=m.id;
   b.innerHTML=`<div class="en">${m.free?'◆':String(m.ep).padStart(2,'0')}</div><div><div class="et">${un?this.L(m.title):'???'}</div><div class="es">${un?(m.free?this.T('free'):(this.state.cleared[m.id]?this.T('cleared'):'◆ +'+(150+30)+' FLUX')):'🔒 '+(m.free?this.T('clearTo')+' '+this.epOf(m.unlockAfter):'')}</div></div><div class="er">${this.state.cleared[m.id]||''}</div>`;
   b.onclick=()=>{if(!un){AU.play('deny');return;}this.mSel=m.id;AU.play('ui');this.renderMissions();};el.appendChild(b);};
  add(this.T('story_t'));this.storyList().forEach(row);add(this.T('free_t'));MISSIONS.filter(m=>m.free).forEach(row);
  const m=MISSIONS.find(x=>x.id===this.mSel);const d=this.$('mDetail');const L=this.lang;
  const loot=(m.grant||[]).map(id=>{const p=PARTS[id];return`<span>${p.name[L]}${p.only?' ('+CHARS[p.only].name[L]+')':''}</span>`;}).join('')+(m.paint?`<span>${this.L(PAINTS.find(p=>p.id===m.paint).name)}</span>`:'');
  d.innerHTML=`<div class="dk">${m.free?this.T('free'):this.T('ep')+' '+String(m.ep).padStart(2,'0')+this.T('epSuf')}${this.state.cleared[m.id]?' · '+this.T('best')+' '+this.state.cleared[m.id]:''}</div><h2>${this.L(m.title)}</h2>
   <div class="img" style="background-image:url(art/${MAPS[m.map].bg}.webp)"></div><p>${this.L(m.sum)}</p>
   <div class="rw"><span>${this.T('reward')}: ${(m.endless?m.cr+' / '+this.T('wave'):m.cr.toLocaleString())} CR</span><span>◆ ${m.free?20:30}${!m.free&&!this.cleared(m.id)?' +150':''} FLUX</span>${loot}${m.grantRank?`<span>(${this.T('rank')} ${m.grantRank})</span>`:''}</div>
   <div class="go">${m.brief?`<button class="mbtn" id="mBrief">${this.T('brief')}</button>`:''}<button class="mbtn big" id="mLaunch">${this.T('launch')} ▶</button></div>`;
  this.$('mLaunch').onclick=()=>this.launch(m,false);if(m.brief)this.$('mBrief').onclick=()=>this.launch(m,true);},
 // ---------- FLOW ----------
 launch(m,brief){AU.unlock();AU.play('ui');const c=this.sel;if(c==='asmon'&&!this.state.asmonUnlocked)this.sel='pinco';
  const shots=[{card:m,bg:MAPS[m.map].bg,fx:'lines'}];if(m.brief&&(brief||!this.cleared(m.id)))shots.push(...SCENES[m.brief]);shots.music='debrief';
  CUT.play(shots,()=>this.sortie(m));},
 zombieIntro(){const zb=this.state.zbest;this.modal(`<h3 class="zt">${this.L(ZMISSION.title)}</h3><p>${this.L(ZMISSION.sum)}</p><p class="howto">${this.T('zhowto')}</p>${zb.round?`<p><b>${this.T('zbest')}: ${zb.round}</b> · ${this.T('zscore')} ${zb.score.toLocaleString()}</p>`:''}`,
  [[this.T('zgo')+' ▶',()=>{AU.unlock();this.sortie(ZMISSION);},'big hot'],[this.T('back'),null]]);},
 sortie(m){this.cur=m;this.show('sGame');this.$('pause').classList.remove('on');G.start(m,this.sel,Object.assign({},this.state.load[this.sel]),this.state.paint[this.sel]);},
 togglePause(force){if(!G.on||G.result)return;const p=force!=null?force:!G.paused;G.paused=p;G.clearInput();this.$('pause').classList.toggle('on',p);AU.play(p?'back':'ui');if(p)AU.boost(0);},
 quitToMenu(){G.cleanup();this.$('pause').classList.remove('on');this.show('sMenu');},
 missionEnd(r){const S=this.state,m=r.mission;G.cleanup();const loot=[];let flux=0;
  S.cr+=r.credits;
  if(r.zombie){flux=r.flux;const nb=r.round>S.zbest.round||(r.round===S.zbest.round&&r.score>S.zbest.score);if(nb){S.zbest={round:r.round,score:r.score};loot.push('★ '+this.T('newBest'));}}
  else if(r.win){const prev=S.cleared[m.id];const ord='CBAS';if(!prev||ord.indexOf(r.rank)>ord.indexOf(prev))S.cleared[m.id]=r.rank;
   flux=m.free?20:30;if(!prev&&!m.free)flux+=150;if(r.rank==='S')flux+=20;
   const give=!m.free||(m.grantRank&&r.rank==='S');if(give)for(const id of m.grant||[]){if(!S.owned[id]){S.owned[id]=true;loot.push(PARTS[id].name[this.lang]);}}
   if(m.paint&&!S.paints[m.paint]){S.paints[m.paint]=true;loot.push(this.L(PAINTS.find(p=>p.id===m.paint).name));}
   if(m.id==='m10'&&!S.asmonUnlocked){S.asmonUnlocked=true;S.owned.wl_regalia=true;S.paints.violet=true;S.load.asmon.wl='wl_regalia';loot.push('★ '+CHARS.asmon.name[this.lang]);}
   const nu=Object.values(PARTS).filter(p=>p.unlock===m.id&&!S.owned[p.id]).length;if(nu&&!prev)loot.push((this.lang==='ja'?'ショップに新パーツ ×':'New parts in the shop ×')+nu);}
  S.flux+=flux;r.fluxGain=flux;
  this.save();this.result=r;this.loot=loot;this.renderResult();this.show('sResult');AU.playMusic('debrief');},
 renderResult(){const r=this.result,m=r.mission;const h=this.$('rHead');h.textContent=r.zombie?this.T('zover'):this.T(r.win?'mclear':'mfail');h.className='rhead'+(r.win?'':' fail');
  const rk=this.$('rRank');rk.textContent=r.zombie?r.round:r.rank;rk.classList.toggle('zr',!!r.zombie);rk.style.animation='none';void rk.offsetWidth;rk.style.animation='';
  const row=(k,v,c)=>`<div class="rrow ${c||''}"><span>${k}</span><b>${v}</b></div>`;
  if(r.zombie)this.$('rRows').innerHTML=row(this.T('round'),r.round)+row(this.T('zscore'),r.score.toLocaleString())+row(this.T('husks'),r.kills)+row(this.T('credits'),'+'+r.credits.toLocaleString()+' CR')+row(this.T('fluxEarned'),'◆ +'+r.fluxGain,'fx');
  else this.$('rRows').innerHTML=row(this.T('time'),HUD.fmt(r.time))+row(this.T('apLeft'),Math.round(r.apPct*100)+'%')+row(this.T('kills'),r.kills)+(m.endless?row(this.T('wave'),r.wave):'')+row(this.T('credits'),'+'+r.credits.toLocaleString()+' CR')+(r.fluxGain?row(this.T('fluxEarned'),'◆ +'+r.fluxGain,'fx'):'');
  this.$('rLoot').innerHTML=this.loot.map(t=>`<div><small>${r.zombie?this.T('zrec'):this.T('newPart')}</small>${t}</div>`).join('');
  const nx=this.$('rNext');const story=r.win&&!m.free&&!r.zombie;nx.style.display=story?'':'none';
  if(story){const i=this.storyList().indexOf(m);const nm=this.storyList()[i+1];nx.textContent=nm?this.T('next')+' ▶':(this.lang==='ja'?'エピローグ ▶':'Epilogue ▶');
   nx.onclick=()=>{AU.play('ui');CUT.play(Object.assign(SCENES[m.debrief].slice(),{music:'debrief'}),()=>{nm?this.launch(nm,false):(this.show('sMenu'),m.id==='m10'&&this.toast(this.T('asmonJoined'),4000));});};}},
 // ---------- OPTIONS ----------
 optBack:'sMenu',
 renderOptions(){const S=this.state,o=S.opt,L=this.lang;const seg=(k,opts)=>`<div class="seg" data-o="${k}">${opts.map(([v,t])=>`<button data-v="${v}" class="${String(o[k])===String(v)?'on':''}">${t}</button>`).join('')}</div>`;
  const vol=[[0,this.T('off')],[.4,'40%'],[.7,'70%'],[1,'100%']];
  this.$('oBody').innerHTML=`
   <div class="orow"><b>${this.T('opt_lang')}</b><div class="seg" id="oLang"><button data-l="en" class="${L==='en'?'on':''}">English</button><button data-l="ja" class="${L==='ja'?'on':''}">日本語</button></div></div>
   <div class="orow"><b>${this.T('opt_sound')}</b>${seg('on',[[true,this.T('on')],[false,this.T('off')]])}</div>
   <div class="orow"><b>${this.T('opt_music')}</b>${seg('mv',vol)}</div>
   <div class="orow"><b>${this.T('opt_sfx')}</b>${seg('sv',vol)}</div>
   <div class="orow"><b>${this.T('opt_cam')}</b>${seg('cam',[['fp',this.T('cam_fp')],['shoulder',this.T('cam_sh')],['third',this.T('cam_tp')]])}</div>
   <div class="orow"><b>${this.T('opt_shake')}</b>${seg('shake',[[true,this.T('on')],[false,this.T('off')]])}</div>
   <div class="orow"><b>${this.T('opt_quality')}</b>${seg('q',[['low',this.T('q_low')],['high',this.T('q_high')]])}</div>
   <div class="orow"><b>${this.T('cheat')}</b><div class="cheat"><input id="oCode" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="${this.T('cheatPh')}"><button class="btn hot" id="oApply">${this.T('apply')}</button>
    ${S.cheat?`<p>${this.T('cheatOn')}</p><button class="btn" id="oCheatOff">${this.T('cheatOff')}</button>`:''}<p id="oMsg"></p></div></div>
   <div class="orow"><b>${this.T('howto')}</b><p class="howto" style="width:100%">${this.T('howtoTxt')}</p></div>
   <div class="orow"><b>${this.T('credits')}</b><div class="seg"><button id="oOP">▶ ${L==='ja'?'オープニング':'Opening'}</button><button id="oCredits">▶ ${this.T('credits')}</button></div></div>
   <div class="orow"><b>${this.T('reset')}</b><button class="btn" id="oReset" style="border-color:var(--red)">${this.T('reset')}</button></div>
   <p style="opacity:.5;font-size:12px;text-align:center">HEAVY STITCH ${window.__BUILD__||''} · ${this.T('brand')}</p>`;
  const B=this.$('oBody');B.querySelectorAll('#oLang [data-l]').forEach(b=>b.onclick=()=>{AU.play('ui');this.setLang(b.dataset.l);});
  B.querySelectorAll('.seg[data-o] button').forEach(b=>b.onclick=()=>{const k=b.parentNode.dataset.o;let v=b.dataset.v;v=v==='true'?true:v==='false'?false:isNaN(+v)?v:+v;o[k]=v;this.save();
   AU.on=o.on;AU.mv=o.mv;AU.sv=o.sv;AU.apply&&AU.apply();if(k==='q')G.setQuality(v);if(k==='cam'){G.camMode=v;G.applyCam();}AU.play('ui');this.renderOptions();});
  const apply=()=>{const v=this.$('oCode').value.trim().toUpperCase();if(v==='AMSABABY')this.cheat();else{AU.play('deny');this.$('oMsg').textContent=this.T('cheatBad');}};
  this.$('oApply').onclick=apply;this.$('oCode').addEventListener('keydown',e=>{if(e.key==='Enter')apply();});
  if(S.cheat)this.$('oCheatOff').onclick=()=>{S.cheat=false;this.save();AU.play('back');this.renderOptions();};
  this.$('oCredits').onclick=()=>{CUT.play(Object.assign([{bg:'bg_city',credits:1,fx:'lines'}],{music:'debrief'}),()=>this.show('sOptions'));};
  this.$('oOP').onclick=()=>{CUT.playOP(()=>this.show('sOptions'));};
  this.$('oReset').onclick=()=>this.modal(`<h3>${this.T('reset')}</h3><p>${this.T('resetQ')}</p>`,[[this.T('yes'),()=>{const lang=this.lang;this.state=this.defState();this.state.opt.lang=lang;this.save();this.sel='pinco';this.mSel=null;AU.play('back');this.toast('OK');this.$('sTitle').classList.remove('go');this.show('sTitle');},'hot'],[this.T('no'),null]]);},
 cheat(){const S=this.state;S.cr+=1000000;S.flux+=100000;S.alloy+=5000;for(const id in PARTS)S.owned[id]=true;for(const p of PAINTS)S.paints[p.id]=true;for(const m of MISSIONS)if(!S.cleared[m.id])S.cleared[m.id]='C';
  S.asmonUnlocked=true;S.cheat=true;S.started=true;this.save();AU.play('win');this.crv();this.renderOptions();this.$('oMsg').textContent=this.T('cheatOk');this.toast(this.T('cheatOk'),3500);},
 // ---------- INIT ----------
 init(){this.state=this.load();this.lang=this.state.opt.lang;this.sel=PLAYABLE.includes(this.state.sel)?this.state.sel:'pinco';if(this.sel==='asmon'&&!this.state.asmonUnlocked)this.sel='pinco';
  AU.on=this.state.opt.on;AU.mv=this.state.opt.mv;AU.sv=this.state.opt.sv;
  G.init();G.setQuality(this.state.opt.q);G.camMode=this.state.opt.cam||'shoulder';CUT.init();this.applyLang();
  const unlock=()=>{AU.unlock();AU.on=this.state.opt.on;AU.apply&&AU.apply();};addEventListener('pointerdown',unlock,{capture:true});addEventListener('touchend',unlock,{capture:true});addEventListener('keydown',unlock,{capture:true});
  document.querySelectorAll('[data-lang]').forEach(b=>b.onclick=e=>{e.stopPropagation();AU.play('ui');this.setLang(b.dataset.lang);});
  this.$('tStart').onclick=()=>this.titleTap();
  this.$('tCont').onclick=()=>this.cont();this.$('tNew').onclick=()=>{AU.play('ui');this.newGame();};
  document.querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>{AU.play(b.classList.contains('back')?'back':'ui');if(b.dataset.go==='sOptions')this.optBack=this.scr;this.show(b.dataset.go);}));
  this.$('mStory').onclick=()=>{const n=this.nextStory();if(n)this.launch(n,false);else{this.mSel=null;this.show('sMissions');}};
  this.$('mZombie').onclick=()=>{AU.play('ui');this.zombieIntro();};
  this.$('hSortie').onclick=()=>{AU.play('ui');this.show('sMissions');};
  document.querySelectorAll('[data-hc]').forEach(t=>t.onclick=()=>{this.hCat=t.dataset.hc;this.preview=null;this.previewPaint=null;this.$('hList').scrollTop=0;AU.play('ui');this.renderHangar();});
  this.$('oBack').onclick=()=>{AU.play('back');if(this.optBack==='sGame'){this.show('sGame');this.$('pause').classList.add('on');G.setQuality(this.state.opt.q);}else this.show(this.optBack||'sMenu');};
  this.$('pResume').onclick=()=>this.togglePause(false);
  this.$('pRetry').onclick=()=>{G.cleanup();this.$('pause').classList.remove('on');this.sortie(this.cur);};
  this.$('pOpts').onclick=()=>{this.optBack='sGame';this.show('sOptions');};
  this.$('pQuit').onclick=()=>this.quitToMenu();
  this.$('rRetry').onclick=()=>{AU.play('ui');this.sortie(this.result.mission);};
  this.$('rHangar').onclick=()=>{AU.play('ui');this.show('sHangar');};
  this.$('rMenu').onclick=()=>{AU.play('back');this.show('sMenu');};
  const cm=document.createElement('button');cm.className='btn cmenu';cm.id='cMenu';cm.innerHTML='◀ <span data-t="menu">'+this.T('menu')+'</span>';cm.addEventListener('pointerdown',e=>e.stopPropagation());
  cm.onclick=e=>{e.stopPropagation();AU.play('back');CUT.done=null;CUT.end();this.show(this.hasSave()?'sMenu':'sTitle');};this.$('sCut').appendChild(cm);
  addEventListener('keydown',e=>{if(e.code==='Escape'&&!G.on&&this.scr!=='sTitle'&&this.scr!=='sMenu'&&this.scr!=='sCut'){this.show('sMenu');}});
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&G.on&&!G.paused&&!G.result)this.togglePause(true);});
  this.show('sTitle');
  window.__hs={G,HS:this,Z,GACHA,skip:()=>G.debugSkip()};}
};
window.HS=HS;
addEventListener('DOMContentLoaded',()=>HS.init());
