/* Heavy Stitch: menus, hangar, missions, options, results, save data. A LANZAGAMES production. */
'use strict';
const HS={
 KEY:'heavystitch_v1',lang:'en',scr:'sTitle',sel:'pinco',
 $:id=>document.getElementById(id),
 defState(){const own={};for(const id in PARTS)if(PARTS[id].tier===0)own[id]=true;const ld={};for(const c of PLAYABLE)ld[c]=Object.assign({},STARTER);
  const ja=(navigator.language||'').toLowerCase().startsWith('ja');const mob=matchMedia('(pointer:coarse)').matches;
  return{v:1,cr:3000,owned:own,paints:{grey:true},load:ld,paint:{pinco:'grey',pooh:'grey',bean:'grey',asmon:'violet'},cleared:{},asmonUnlocked:false,seenOpening:false,cheat:false,sel:'pinco',
   opt:{lang:ja?'ja':'en',on:true,mv:.7,sv:1,shake:true,q:mob&&(navigator.hardwareConcurrency||4)<=4?'low':'high'}};},
 load(){let s=null;try{s=JSON.parse(localStorage.getItem(this.KEY));}catch(e){}const d=this.defState();if(!s||s.v!==1)return d;
  s.opt=Object.assign(d.opt,s.opt||{});s.owned=Object.assign(d.owned,s.owned||{});s.paints=Object.assign(d.paints,s.paints||{});s.load=Object.assign(d.load,s.load||{});s.paint=Object.assign(d.paint,s.paint||{});
  for(const c of PLAYABLE)for(const sl of SLOTS)if(s.load[c][sl]===undefined||(s.load[c][sl]&&!PARTS[s.load[c][sl]]))s.load[c][sl]=STARTER[sl];return Object.assign(d,s);},
 save(){try{localStorage.setItem(this.KEY,JSON.stringify(this.state));}catch(e){}},
 T(k){const u=UI[k];if(!u)return k;return u[this.lang==='ja'?1:0];},
 L(o){return o?(o[this.lang]||o.en):'';},
 toast(t,ms){const el=this.$('toast');el.textContent=t;el.classList.add('on');clearTimeout(this.tt);this.tt=setTimeout(()=>el.classList.remove('on'),ms||2000);},
 crv(){document.querySelectorAll('.crv').forEach(e=>e.textContent=this.state.cr.toLocaleString());},
 show(id){document.querySelectorAll('.screen').forEach(s=>s.classList.toggle('on',s.id===id));this.scr=id;
  if(id==='sMenu'){this.renderMenu();AU.playMusic('hangar');}if(id==='sHangar'){this.renderHangar();AU.playMusic('hangar');}if(id==='sMissions'){this.renderMissions();AU.playMusic('hangar');}
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
 // ---------- TITLE / MENU ----------
 renderTitle(){const tc=this.$('tCast');if(tc.dataset.k===this.castKey())return;tc.dataset.k=this.castKey();tc.innerHTML='';
  for(const c of['pooh','pinco','bean']){const cv=document.createElement('canvas');tc.appendChild(cv);this.drawTo(cv,c,this.state.load[c],this.paintOf(c),1.6);}},
 castKey(){return JSON.stringify([this.state.load.pinco,this.state.load.pooh,this.state.load.bean,this.state.paint]);},
 renderMenu(){const h=this.$('mHero');h.innerHTML='';const cv=document.createElement('canvas');h.appendChild(cv);const c=this.sel;this.drawTo(cv,c,this.state.load[c],this.paintOf(c),1.8);
  const n=this.nextStory();this.$('mStorySub').textContent=n?`${this.T('ep')} ${String(n.ep).padStart(2,'0')}${this.T('epSuf')} · ${this.L(n.title)}`:(this.lang==='ja'?'全話クリア！ もう一度遊ぶ':'All episodes clear! Replay any');},
 // ---------- HANGAR ----------
 hTab:'parts',hSlot:'wr',preview:null,
 slotName(s,c){const b=CHARS[c].body;if(s==='arms'&&b==='pod')return this.T('slot_arms_pod');if(s==='legs'&&b==='float')return this.T('slot_legs_float');if(s==='legs'&&b==='pod')return this.T('slot_legs_pod');return this.T('slot_'+s);},
 partAvail(p,c){if(p.only&&p.only!==c)return'hide';if(this.state.owned[p.id])return'own';if(p.reward)return p.only?'hide':'reward';if(p.unlock&&!this.cleared(p.unlock)&&!this.state.cheat)return'locked';return'shop';},
 epOf(id){const m=MISSIONS.find(x=>x.id===id);return m?(m.free?this.L(m.title):`${this.T('ep')} ${m.ep}${this.T('epSuf')}`):id;},
 renderHangar(){const c=this.sel,ch=CHARS[c];this.$('hName').textContent=ch.name[this.lang];this.$('hRole').textContent=this.L(ch.role);
  const hc=this.$('hChars');hc.innerHTML='';for(const id of PLAYABLE){const lock=id==='asmon'&&!this.state.asmonUnlocked;const b=document.createElement('button');b.className=(id===c?'on':'')+(lock?' lock':'');
   b.innerHTML=`<img src="${CHARS[id].img}" alt=""><span>${lock?'🔒 ':''}${CHARS[id].name[this.lang]}</span>`;b.onclick=()=>{if(lock){AU.play('deny');this.toast(this.lang==='ja'?'第10話をクリアすると解放':'Clear Episode 10 to unlock');return;}this.sel=this.state.sel=id;this.save();this.preview=null;AU.play('ui');this.renderHangar();};hc.appendChild(b);}
  document.querySelectorAll('[data-ht]').forEach(t=>t.classList.toggle('on',t.dataset.ht===this.hTab));
  this.drawHangarChar();this.renderStats();this.renderSlots();this.renderList();},
 drawHangarChar(bump){const c=this.sel;const load=this.preview?Object.assign({},this.state.load[c],{[this.preview.slot]:this.preview.id}):this.state.load[c];
  const paint=this.previewPaint?PAINTS.find(p=>p.id===this.previewPaint):this.paintOf(c);const cv=this.$('hCanvas');const tok=this.drawTok=(this.drawTok||0)+1;
  composeAsync(c,load,paint,{scale:2}).then(r=>{if(tok!==this.drawTok)return;cv.width=r.canvas.width;cv.height=r.canvas.height;const g=cv.getContext('2d');g.clearRect(0,0,cv.width,cv.height);g.drawImage(r.canvas,0,0);
   if(bump){cv.classList.remove('bump');void cv.offsetWidth;cv.classList.add('bump');}});},
 renderStats(){const c=this.sel;const cur=computeStats(c,this.state.load[c]);const pv=this.preview?computeStats(c,Object.assign({},this.state.load[c],{[this.preview.slot]:this.preview.id})):null;
  const rows=[['st_ap','ap',16000],['st_def','def',340],['st_spd','spd',24],['st_en','en',4400],['st_fire','fire',9000],['st_stab','stab',1400]];let h='';
  for(const[k,f,mx]of rows){const v=cur[f],n=pv?pv[f]:v;const d=n-v;const cls=d>0.01?'up':d<-0.01?'dn':'';const fmt=x=>f==='spd'?x.toFixed(1):Math.round(x).toLocaleString();
   h+=`<div class="st ${cls}"><span>${this.T(k)}</span><div class="sb"><i style="width:${Math.min(100,n/mx*100)}%"></i>${pv?`<u style="left:${Math.min(100,v/mx*100)}%"></u>`:''}</div><em>${fmt(n)}</em></div>`;}
  const s=pv||cur;h+=`<div class="st ${s.over>0?'dn':''}"><span>${this.T('st_load')}</span><div class="sb"><i style="width:${Math.min(100,s.weight/s.load*100)}%;background:${s.over>0?'var(--red)':'var(--gold)'}"></i></div><em>${Math.round(s.weight/s.load*100)}%</em></div>`;
  if(s.over>0)h+=`<div class="ow">${this.T('overweight')}</div>`;this.$('hStats').innerHTML=h;},
 renderSlots(){const c=this.sel,el=this.$('hSlots');if(this.hTab!=='parts'){el.style.display='none';return;}el.style.display='';let h='';
  for(const s of SLOTS){const id=this.state.load[c][s];h+=`<button class="slot ${s===this.hSlot?'on':''}" data-slot="${s}"><small>${this.slotName(s,c)}</small><span>${id?PARTS[id].name[this.lang]:'—'}</span></button>`;}
  el.innerHTML=h;el.querySelectorAll('[data-slot]').forEach(b=>b.onclick=()=>{this.hSlot=b.dataset.slot;this.preview=null;AU.play('ui',.6);this.renderSlots();this.renderList();this.renderStats();this.drawHangarChar();});},
 partStats(p){const L=this.lang==='ja';const o=[];const add=(k,v)=>o.push(`<span>${k} <b>${v}</b></span>`);
  if(p.ap)add('AP',p.ap.toLocaleString());if(p.def)add(L?'防御':'DEF',p.def);if(p.spd&&p.slot==='legs')add(L?'速度':'SPD','×'+p.spd);if(p.load)add(L?'積載':'LOAD',p.load.toLocaleString());if(p.jump)add(L?'上昇':'LIFT','×'+p.jump);
  if(p.aim)add(L?'射撃':'AIM','×'+p.aim);if(p.melee)add(L?'格闘':'MELEE','×'+p.melee);if(p.thrust)add(L?'推力':'THRUST','×'+p.thrust);if(p.dash&&p.slot==='booster')add('DASH','×'+p.dash);if(p.ab)add('AB','×'+p.ab);
  if(p.en&&p.slot==='gen')add('EN',p.en);if(p.regen)add(L?'回復':'REGEN',p.regen);if(p.range)add(L?'射程':'RANGE',p.range+'m');if(p.lock&&p.slot==='fcs')add(L?'誘導':'LOCK','×'+p.lock);if(p.enb)add('EN','×'+p.enb);if(p.scan)add('SCAN','×'+p.scan);
  if(p.cls){const cn={rifle:['Rifle','ライフル'],shotgun:['Shotgun','ショットガン'],cannon:['Cannon','キャノン'],laser:['Laser','レーザー'],blade:['Blade','ブレード'],pile:['Pile','パイル'],missile:['Missiles','ミサイル'],mortar:['Mortar','迫撃砲'],rocket:['Rockets','ロケット'],gatling:['Gatling','ガトリング'],rack:['Repair','修理'],drones:['Drones','ドローン'],pulse:['Shield pulse','パルスシールド'],rail:['Railgun','レールガン']}[p.cls];
   o.unshift(`<span class="u">${cn[L?1:0]}</span>`);if(p.dmg)add(L?'威力':'DMG',p.dmg+(p.pel?'×'+p.pel:'')+(p.n?'×'+p.n:'')+(p.hits?'×'+p.hits:''));if(p.cdmg)add(L?'チャージ':'CHARGED',p.cdmg);if(p.rate&&p.cls!=='rack')add(L?'連射':'RATE',p.rate+'/s');if(p.mag)add(L?'装弾':'MAG',p.mag);if(p.shock)add(L?'衝撃':'IMPACT',p.shock);if(p.kits)add(L?'キット':'KITS','+'+p.kits);}
  if(p.w)add(L?'重量':'WT',p.w);return o.join('');},
 renderList(){const c=this.sel,el=this.$('hList');el.innerHTML='';
  if(this.hTab==='paint'){const wrap=document.createElement('div');wrap.className='paints';for(const p of PAINTS){const own=this.state.paints[p.id];const lock=!own&&(p.reward||(p.unlock&&!this.cleared(p.unlock)&&!this.state.cheat));const on=this.state.paint[c]===p.id;
    const b=document.createElement('button');b.className='pt2'+(on?' on':'');b.innerHTML=`<div class="sw"><i style="background:${p.p}"></i><i style="background:${p.s}"></i><i style="background:${p.a}"></i><i style="background:${p.g}"></i></div><span>${this.L(p.name)}</span><small>${on?this.T('equipped'):own?this.T('owned'):lock?'🔒 '+(p.reward?this.epOf(p.reward):this.T('clearTo')+' '+this.epOf(p.unlock)):p.price.toLocaleString()+' CR'}</small>`;
    b.onclick=()=>{if(lock){AU.play('deny');this.previewPaint=p.id;this.drawHangarChar();this.previewPaint=null;return;}if(!own){if(this.state.cr<p.price){AU.play('deny');this.toast(this.T('notEnough'));return;}this.state.cr-=p.price;this.state.paints[p.id]=true;AU.play('buy');}
     this.state.paint[c]=p.id;this.save();AU.play('clank');this.crv();this.renderList();this.drawHangarChar(true);};wrap.appendChild(b);}el.appendChild(wrap);return;}
  const s=this.hSlot;const cur=this.state.load[c][s];const list=Object.values(PARTS).filter(p=>p.slot===s).filter(p=>this.partAvail(p,c)!=='hide').sort((a,b)=>a.tier-b.tier||a.price-b.price);
  if(s==='sh'||s==='bk'){list.push({id:null,none:true});}
  const base=computeStats(c,this.state.load[c]);
  for(const p of list){const d=document.createElement('div');const av=p.none?'own':this.partAvail(p,c);const eq=p.none?cur==null:cur===p.id;
   d.className=`pi t${p.tier||0} ${eq?'eq':''} ${av==='locked'||av==='reward'?'locked':''}`;
   const st=computeStats(c,Object.assign({},this.state.load[c],{[s]:p.id}));const dd=(k,lab,f)=>{const v=st[k]-base[k];if(Math.abs(v)<.05)return'';return`<span class="${v>0?'u':'d'}">${lab} ${v>0?'+':''}${f?v.toFixed(1):Math.round(v).toLocaleString()}</span>`;};
   const diff=eq?'':[dd('ap','AP'),dd('spd',this.lang==='ja'?'速度':'SPD',1),dd('en','EN'),dd('fire',this.lang==='ja'?'火力':'FIRE')].join('');
   let act;if(eq)act=`<span class="btn ghost">${this.T('equipped')}</span>`;else if(av==='own')act=`<button class="btn hot" data-a="eq">${this.T('equip')}</button>`;
   else if(av==='shop')act=`<button class="btn" data-a="buy">${this.T('buy')} ${p.price.toLocaleString()}</button>`;else act=`<span class="btn ghost">🔒 ${av==='reward'?this.epOf(p.reward):this.epOf(p.unlock)}</span>`;
   const tierN=['STD','MK·I','MK·II','ACE'][p.tier||0];
   d.innerHTML=`<div><div class="pn">${p.none?(this.lang==='ja'?'（なし）':'(empty mount)'):p.name[this.lang]}</div><div class="pt">${p.none?'':tierN+(p.only?' · '+this.T('bodyOnly')+' '+CHARS[p.only].name[this.lang]:'')}</div></div><div class="pa">${act}</div><div class="pd">${p.none?'':this.partStats(p)}${diff?' '+diff:''}</div>`;
   d.onclick=ev=>{const a=ev.target.closest('[data-a]');if(a){ev.stopPropagation();if(a.dataset.a==='buy')this.buy(p);else this.equip(p.id);return;}this.preview=p.none?{slot:s,id:null}:{slot:s,id:p.id};AU.play('ui',.4);this.renderStats();this.drawHangarChar();};
   el.appendChild(d);}},
 buy(p){if(this.state.cr<p.price){AU.play('deny');this.toast(this.T('notEnough'));return;}this.state.cr-=p.price;this.state.owned[p.id]=true;AU.play('buy');this.crv();this.equip(p.id);},
 equip(id){const c=this.sel;this.state.load[c][this.hSlot]=id;this.preview=null;this.save();AU.play('clank');this.renderSlots();this.renderList();this.renderStats();this.drawHangarChar(true);},
 // ---------- MISSIONS ----------
 mSel:null,
 renderMissions(){const el=this.$('mList');el.innerHTML='';const add=(h)=>{const x=document.createElement('h3');x.textContent=h;el.appendChild(x);};
  if(!this.mSel){const n=this.nextStory();this.mSel=(n||this.storyList()[0]).id;}
  const row=m=>{const un=this.unlockedM(m);const b=document.createElement('button');b.className='ep'+(m.id===this.mSel?' on':'')+(un?'':' lock');b.dataset.m=m.id;
   b.innerHTML=`<div class="en">${m.free?'◆':String(m.ep).padStart(2,'0')}</div><div><div class="et">${un?this.L(m.title):'???'}</div><div class="es">${un?MAPS[m.map].bg.replace('bg_','').toUpperCase()+(m.free?' · '+this.T('free'):''):'🔒 '+(m.free?this.T('clearTo')+' '+this.epOf(m.unlockAfter):'')}</div></div><div class="er">${this.state.cleared[m.id]||''}</div>`;
   b.onclick=()=>{if(!un){AU.play('deny');return;}this.mSel=m.id;AU.play('ui');this.renderMissions();};el.appendChild(b);};
  add(this.T('story_t'));this.storyList().forEach(row);add(this.T('free_t'));MISSIONS.filter(m=>m.free).forEach(row);
  const m=MISSIONS.find(x=>x.id===this.mSel);const d=this.$('mDetail');const L=this.lang;
  const loot=(m.grant||[]).map(id=>{const p=PARTS[id];return`<span>${p.name[L]}${p.only?' ('+CHARS[p.only].name[L]+')':''}</span>`;}).join('')+(m.paint?`<span>${this.L(PAINTS.find(p=>p.id===m.paint).name)}</span>`:'');
  d.innerHTML=`<div class="dk">${m.free?this.T('free'):this.T('ep')+' '+String(m.ep).padStart(2,'0')+this.T('epSuf')}${this.state.cleared[m.id]?' · '+this.T('best')+' '+this.state.cleared[m.id]:''}</div><h2>${this.L(m.title)}</h2>
   <div class="img" style="background-image:url(art/${MAPS[m.map].bg}.webp)"></div><p>${this.L(m.sum)}</p>
   <div class="rw"><span>${this.T('reward')}: ${(m.endless?m.cr+' / '+this.T('wave'):m.cr.toLocaleString())} CR</span>${loot}${m.grantRank?`<span>(${this.T('rank')} ${m.grantRank})</span>`:''}</div>
   <div class="go" style="display:flex;gap:8px;flex-wrap:wrap">${m.brief?`<button class="mbtn" id="mBrief" style="flex:1">${this.T('brief')}</button>`:''}<button class="mbtn big" id="mLaunch" style="flex:2">${this.T('launch')} ▶</button></div>`;
  this.$('mLaunch').onclick=()=>this.launch(m,false);if(m.brief)this.$('mBrief').onclick=()=>this.launch(m,true);},
 // ---------- FLOW ----------
 launch(m,brief){AU.unlock();AU.play('ui');const c=this.sel;if(c==='asmon'&&!this.state.asmonUnlocked)this.sel='pinco';
  const shots=[{card:m,bg:MAPS[m.map].bg,fx:'lines'}];if(m.brief&&(brief||!this.cleared(m.id)))shots.push(...SCENES[m.brief]);shots.music='debrief';
  CUT.play(shots,()=>this.sortie(m));},
 sortie(m){this.cur=m;this.show('sGame');this.$('pause').classList.remove('on');G.start(m,this.sel,Object.assign({},this.state.load[this.sel]),this.state.paint[this.sel]);},
 togglePause(force){if(!G.on||G.result)return;const p=force!=null?force:!G.paused;G.paused=p;G.clearInput();this.$('pause').classList.toggle('on',p);AU.play(p?'back':'ui');if(p)AU.boost(0);},
 quitToMenu(){G.cleanup();this.$('pause').classList.remove('on');this.show('sMenu');},
 missionEnd(r){const S=this.state,m=r.mission;G.cleanup();const loot=[];
  S.cr+=r.credits;
  if(r.win){const prev=S.cleared[m.id];const ord='CBAS';if(!prev||ord.indexOf(r.rank)>ord.indexOf(prev))S.cleared[m.id]=r.rank;
   const give=!m.free||(m.grantRank&&r.rank==='S');if(give)for(const id of m.grant||[]){if(!S.owned[id]){S.owned[id]=true;loot.push(PARTS[id].name[this.lang]);}}
   if(m.paint&&!S.paints[m.paint]){S.paints[m.paint]=true;loot.push(this.L(PAINTS.find(p=>p.id===m.paint).name));}
   if(m.id==='m10'&&!S.asmonUnlocked){S.asmonUnlocked=true;S.owned.wl_regalia=true;S.paints.violet=true;S.load.asmon.wl='wl_regalia';loot.push('★ '+CHARS.asmon.name[this.lang]);}
   // newly unlocked shop parts
   const nu=Object.values(PARTS).filter(p=>p.unlock===m.id&&!S.owned[p.id]).length;if(nu&&!prev)loot.push((this.lang==='ja'?'ショップに新パーツ ×':'New parts in the shop ×')+nu);}
  this.save();this.result=r;this.loot=loot;this.renderResult();this.show('sResult');AU.playMusic('debrief');},
 renderResult(){const r=this.result,m=r.mission;const h=this.$('rHead');h.textContent=this.T(r.win?'mclear':'mfail');h.className='rhead'+(r.win?'':' fail');
  const rk=this.$('rRank');rk.textContent=r.rank;rk.style.animation='none';void rk.offsetWidth;rk.style.animation='';
  const row=(k,v)=>`<div class="rrow"><span>${k}</span><b>${v}</b></div>`;
  this.$('rRows').innerHTML=row(this.T('time'),HUD.fmt(r.time))+row(this.T('apLeft'),Math.round(r.apPct*100)+'%')+row(this.T('kills'),r.kills)+(m.endless?row(this.T('wave'),r.wave):'')+row(this.T('credits'),'+'+r.credits.toLocaleString()+' CR');
  this.$('rLoot').innerHTML=this.loot.map(t=>`<div><small>${this.T('newPart')}</small>${t}</div>`).join('');
  const nx=this.$('rNext');const story=r.win&&!m.free;nx.style.display=story?'':'none';
  if(story){const i=this.storyList().indexOf(m);const nm=this.storyList()[i+1];nx.textContent=nm?this.T('next')+' ▶':(this.lang==='ja'?'エピローグ ▶':'Epilogue ▶');
   nx.onclick=()=>{AU.play('ui');CUT.play(Object.assign(SCENES[m.debrief].slice(),{music:'debrief'}),()=>{if(nm&&this.state.asmonUnlocked&&m.id==='m10'){this.toast(this.T('asmonJoined'),3500);}nm?this.launch(nm,false):(this.show('sMenu'),m.id==='m10'&&this.toast(this.T('asmonJoined'),4000));});};}
  if(!this.$('rMenu')){const b=document.createElement('button');b.className='mbtn';b.id='rMenu';b.dataset.t='menu';b.textContent=this.T('menu');b.onclick=()=>{AU.play('back');this.show('sMenu');};this.$('rHangar').after(b);}},
 // ---------- OPTIONS ----------
 optBack:'sMenu',
 renderOptions(){const S=this.state,o=S.opt,L=this.lang;const seg=(k,opts)=>`<div class="seg" data-o="${k}">${opts.map(([v,t])=>`<button data-v="${v}" class="${String(o[k])===String(v)?'on':''}">${t}</button>`).join('')}</div>`;
  const vol=[[0,this.T('off')],[.4,'40%'],[.7,'70%'],[1,'100%']];
  this.$('oBody').innerHTML=`
   <div class="orow"><b>${this.T('opt_lang')}</b><div class="seg" id="oLang"><button data-l="en" class="${L==='en'?'on':''}">English</button><button data-l="ja" class="${L==='ja'?'on':''}">日本語</button></div></div>
   <div class="orow"><b>${this.T('opt_sound')}</b>${seg('on',[[true,this.T('on')],[false,this.T('off')]])}</div>
   <div class="orow"><b>${this.T('opt_music')}</b>${seg('mv',vol)}</div>
   <div class="orow"><b>${this.T('opt_sfx')}</b>${seg('sv',vol)}</div>
   <div class="orow"><b>${this.T('opt_shake')}</b>${seg('shake',[[true,this.T('on')],[false,this.T('off')]])}</div>
   <div class="orow"><b>${this.T('opt_quality')}</b>${seg('q',[['low',this.T('q_low')],['high',this.T('q_high')]])}</div>
   <div class="orow"><b>${this.T('cheat')}</b><div class="cheat"><input id="oCode" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="${this.T('cheatPh')}"><button class="btn hot" id="oApply">${this.T('apply')}</button>
    ${S.cheat?`<p>${this.T('cheatOn')}</p><button class="btn" id="oCheatOff">${this.T('cheatOff')}</button>`:''}<p id="oMsg"></p></div></div>
   <div class="orow"><b>${this.T('howto')}</b><p class="howto" style="width:100%">${this.T('howtoTxt')}</p></div>
   <div class="orow"><b>${this.T('credits')}</b><button class="btn" id="oCredits">▶ ${this.T('credits')}</button></div>
   <div class="orow"><b>${this.T('reset')}</b><button class="btn" id="oReset" style="border-color:var(--red)">${this.T('reset')}</button></div>
   <p style="opacity:.5;font-size:12px;text-align:center">HEAVY STITCH ${window.__BUILD__||''} · ${this.T('brand')}</p>`;
  const B=this.$('oBody');B.querySelectorAll('#oLang [data-l]').forEach(b=>b.onclick=()=>{AU.play('ui');this.setLang(b.dataset.l);});
  B.querySelectorAll('.seg[data-o] button').forEach(b=>b.onclick=()=>{const k=b.parentNode.dataset.o;let v=b.dataset.v;v=v==='true'?true:v==='false'?false:isNaN(+v)?v:+v;o[k]=v;this.save();
   AU.on=o.on;AU.mv=o.mv;AU.sv=o.sv;AU.apply&&AU.apply();if(k==='q')G.setQuality(v);AU.play('ui');this.renderOptions();});
  const apply=()=>{const v=this.$('oCode').value.trim().toUpperCase();if(v==='AMSABABY')this.cheat();else{AU.play('deny');this.$('oMsg').textContent=this.T('cheatBad');}};
  this.$('oApply').onclick=apply;this.$('oCode').addEventListener('keydown',e=>{if(e.key==='Enter')apply();});
  if(S.cheat)this.$('oCheatOff').onclick=()=>{S.cheat=false;this.save();AU.play('back');this.renderOptions();};
  this.$('oCredits').onclick=()=>{const back=this.scr;CUT.play(Object.assign([{bg:'bg_sky',credits:1,fx:'lines'}],{music:'debrief'}),()=>this.show('sOptions'));};
  this.$('oReset').onclick=()=>{if(!confirm(this.T('resetQ')))return;const lang=this.lang;this.state=this.defState();this.state.opt.lang=lang;this.save();this.sel='pinco';this.mSel=null;AU.play('back');this.toast('OK');this.show('sTitle');};},
 cheat(){const S=this.state;S.cr+=1000000;for(const id in PARTS)S.owned[id]=true;for(const p of PAINTS)S.paints[p.id]=true;for(const m of MISSIONS)if(!S.cleared[m.id])S.cleared[m.id]='C';
  S.asmonUnlocked=true;S.cheat=true;this.save();AU.play('win');this.crv();this.renderOptions();this.$('oMsg').textContent=this.T('cheatOk');this.toast(this.T('cheatOk'),3500);},
 // ---------- INIT ----------
 init(){this.state=this.load();this.lang=this.state.opt.lang;this.sel=PLAYABLE.includes(this.state.sel)?this.state.sel:'pinco';if(this.sel==='asmon'&&!this.state.asmonUnlocked)this.sel='pinco';
  AU.on=this.state.opt.on;AU.mv=this.state.opt.mv;AU.sv=this.state.opt.sv;
  const touch=matchMedia('(pointer:coarse)').matches||('ontouchstart' in window)||navigator.maxTouchPoints>0;document.body.classList.toggle('nottouch',!touch);
  G.init();G.setQuality(this.state.opt.q);CUT.init();this.applyLang();
  const unlock=()=>{AU.unlock();AU.on=this.state.opt.on;AU.apply&&AU.apply();};addEventListener('pointerdown',unlock,{capture:true});addEventListener('keydown',unlock,{capture:true});
  document.querySelectorAll('[data-lang]').forEach(b=>b.onclick=e=>{e.stopPropagation();AU.play('ui');this.setLang(b.dataset.lang);});
  this.$('tStart').onclick=()=>{AU.unlock();AU.play('title');if(!this.state.seenOpening){this.state.seenOpening=true;this.save();CUT.play(Object.assign(SCENES.opening.slice(),{music:'title'}),()=>this.show('sMenu'));}else this.show('sMenu');};
  document.querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>{AU.play(b.classList.contains('back')?'back':'ui');if(b.dataset.go==='sOptions')this.optBack=this.scr;this.show(b.dataset.go);}));
  this.$('mStory').onclick=()=>{const n=this.nextStory();if(n)this.launch(n,false);else{this.mSel=null;this.show('sMissions');}};
  this.$('hSortie').onclick=()=>{AU.play('ui');this.show('sMissions');};
  document.querySelectorAll('[data-ht]').forEach(t=>t.onclick=()=>{this.hTab=t.dataset.ht;this.preview=null;AU.play('ui');this.renderHangar();});
  this.$('oBack').onclick=()=>{AU.play('back');if(this.optBack==='sGame'){this.show('sGame');this.$('pause').classList.add('on');G.setQuality(this.state.opt.q);}else this.show(this.optBack||'sMenu');};
  this.$('pResume').onclick=()=>this.togglePause(false);
  this.$('pRetry').onclick=()=>{G.cleanup();this.$('pause').classList.remove('on');this.sortie(this.cur);};
  this.$('pOpts').onclick=()=>{this.optBack='sGame';this.show('sOptions');};
  this.$('pQuit').onclick=()=>this.quitToMenu();
  this.$('rRetry').onclick=()=>{AU.play('ui');this.sortie(this.result.mission);};
  this.$('rHangar').onclick=()=>{AU.play('ui');this.show('sHangar');};
  // cutscene menu escape
  const cm=document.createElement('button');cm.className='btn cmenu';cm.id='cMenu';cm.innerHTML='◀ <span data-t="menu">'+this.T('menu')+'</span>';cm.addEventListener('pointerdown',e=>e.stopPropagation());
  cm.onclick=e=>{e.stopPropagation();AU.play('back');CUT.done=null;CUT.end();this.show('sMenu');};this.$('sCut').appendChild(cm);
  addEventListener('keydown',e=>{if(e.code==='Escape'&&!G.on&&this.scr!=='sTitle'&&this.scr!=='sMenu'&&this.scr!=='sCut'){this.show('sMenu');}});
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&G.on&&!G.paused&&!G.result)this.togglePause(true);});
  this.show('sTitle');
  window.__hs={G,HS:this,skip:()=>G.debugSkip()};}
};
window.HS=HS;
addEventListener('DOMContentLoaded',()=>HS.init());
