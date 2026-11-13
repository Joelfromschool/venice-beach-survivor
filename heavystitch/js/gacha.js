/* Heavy Stitch v2: SCRAP CAPSULE gacha. Premium currency FLUX is earned only by playing (missions, Dead Zone rounds, first clears).
   No real-money purchases exist anywhere in the game. Duplicates melt into Alloy, which upgrades parts. */
'use strict';
const RAR=['N','R','SR','UR'],RCOL=['#9aa3b2','#2bfff1','#ff3df0','#ffd23a'];
const ODDS=[.50,.33,.14,.03],PULL1=100,PULL10=1000,PITY=70,DUPE=[5,15,40,120];
const BANNERS=[
 {id:'neonriot',ev:1,title:{en:'NEON RIOT',ja:'ネオン・ライオット'},sub:{en:'Blades of the night market',ja:'夜市の刃'},bg:'bg_city',col:'#ff3df0',feat:['wl_katana','wr_zap','h_oni','paint:neon'],ends:'week'},
 {id:'deadzone',ev:1,title:{en:'DEAD ZONE',ja:'デッドゾーン'},sub:{en:'Gear from the quarantine line',ja:'隔離線の装備'},bg:'bg_zone',col:'#7dff4a',feat:['bk_saw','c_overclock','b_phantom','sh_hive','paint:toxic'],ends:'month'},
 {id:'standard',title:{en:'SCRAPYARD STANDARD',ja:'スクラップヤード・スタンダード'},sub:{en:'Every part, any slot',ja:'すべてのパーツ'},bg:'bg_hangar',col:'#2bfff1'},
 {id:'arsenal',title:{en:'CHROME ARSENAL',ja:'クローム・アーセナル'},sub:{en:'Weapons only',ja:'武器のみ'},bg:'bg_factory',col:'#ff7a1a',slots:['wr','wl','sh','bk']},
];
const GACHA={
 rarOf(id){if(id.startsWith('paint:'))return 3;const p=PARTS[id];return p.gacha?3:Math.min(3,p.tier||0);},
 pool(b,r){return Object.values(PARTS).filter(p=>!p.none&&!p.only&&!p.reward&&(!b.slots||b.slots.includes(p.slot))&&(p.gacha?3:Math.min(3,p.tier||0))===r).map(p=>p.id);},
 endsAt(b){const d=new Date();if(b.ends==='week'){const e=new Date(d);e.setHours(23,59,59,0);e.setDate(e.getDate()+((7-e.getDay())%7));if(e<d)e.setDate(e.getDate()+7);return e;}
  if(b.ends==='month'){return new Date(d.getFullYear(),d.getMonth()+1,0,23,59,59);}return null;},
 left(b){const e=this.endsAt(b);if(!e)return'';let s=Math.max(0,Math.floor((e-Date.now())/1000));const dd=Math.floor(s/86400);s%=86400;const h=Math.floor(s/3600),m=Math.floor(s%3600/60);
  return HS.lang==='ja'?`${dd}日 ${h}時間 ${m}分`:`${dd}d ${h}h ${m}m`;},
 roll(b,S,forceSR){const pk=a=>a[Math.floor(Math.random()*a.length)];let pity=S.pity[b.id]||0;
  if(b.ev){pity++;if(pity>=PITY){S.pity[b.id]=0;return pk(b.feat);}}
  let x=Math.random(),r=0,acc=0;for(r=0;r<4;r++){acc+=ODDS[r];if(x<acc)break;}if(r>3)r=0;if(forceSR&&r<2)r=2;
  let id;if(r===3&&b.ev&&Math.random()<.5)id=pk(b.feat);else id=pk(this.pool(b,r));
  if(b.ev){if(b.feat.includes(id))pity=0;S.pity[b.id]=pity;}return id;},
 pull(b,n){const S=HS.state,cost=n===10?PULL10:PULL1;if(S.flux<cost&&!S.cheat){AU.play('deny');HS.toast(HS.T('notEnoughFlux'));return null;}if(!S.cheat)S.flux-=cost;
  const res=[];for(let i=0;i<n;i++){const last=n===10&&i===9&&!res.some(x=>x.r>=2);const id=this.roll(b,S,last);res.push({id,r:this.rarOf(id)});}
  for(const it of res){if(it.id.startsWith('paint:')){const pid=it.id.slice(6);if(S.paints[pid]){it.dupe=DUPE[3];S.alloy+=it.dupe;}else{S.paints[pid]=true;it.isNew=1;}}
   else if(S.owned[it.id]){it.dupe=DUPE[it.r];S.alloy+=it.dupe;}else{S.owned[it.id]=true;it.isNew=1;}}
  S.pulls=(S.pulls||0)+n;HS.save();return res;},
 name(id){if(id.startsWith('paint:')){const p=PAINTS.find(x=>x.id===id.slice(6));return HS.L(p.name)+(HS.lang==='ja'?'（塗装）':' (paint)');}return PARTS[id].name[HS.lang];},
 icon(id,size){if(id.startsWith('paint:')){const p=PAINTS.find(x=>x.id===id.slice(6));const c=document.createElement('canvas');c.width=c.height=size;const g=c.getContext('2d');
   const cols=[p.p,p.s,p.a,p.g];cols.forEach((col,i)=>{g.fillStyle=col;g.beginPath();g.moveTo(size/2,size/2);g.arc(size/2,size/2,size*.42,i*Math.PI/2,(i+1)*Math.PI/2);g.fill();});g.strokeStyle='#07080b';g.lineWidth=4;g.beginPath();g.arc(size/2,size/2,size*.42,0,7);g.stroke();return c;}
  return partIcon(id,HS.paintOf(HS.sel),size);},
 // ---------- SCREEN ----------
 bi:0,
 render(){const S=HS.state,L=HS.lang;const b=BANNERS[this.bi];const el=HS.$('gBody');
  HS.$('gTabs').innerHTML=BANNERS.map((x,i)=>`<button class="gtab ${i===this.bi?'on':''} ${x.ev?'ev':''}" data-i="${i}" style="--bc:${x.col}">${x.ev?`<small>${HS.T('eventB')}</small>`:`<small>${HS.T('normalB')}</small>`}<b>${HS.L(x.title)}</b></button>`).join('');
  HS.$('gTabs').querySelectorAll('[data-i]').forEach(t=>t.onclick=()=>{this.bi=+t.dataset.i;AU.play('ui');this.render();});
  const feat=b.feat||this.pool(b,3);
  el.innerHTML=`<div class="gban" style="--bc:${b.col};background-image:linear-gradient(180deg,rgba(7,8,11,.15),rgba(7,8,11,.92)),url(art/${b.bg}.webp)">
   <div class="gbh">${b.ev?`<span class="gev">${HS.T('eventB')}</span>`:''}<h3>${HS.L(b.title)}</h3><p>${HS.L(b.sub)}</p>${b.ev?`<div class="gcd">${HS.T('endsIn')} <b id="gLeft">${this.left(b)}</b></div>`:''}</div>
   <div class="gfeat">${feat.slice(0,5).map(id=>`<div class="gf"><canvas data-ic="${id}"></canvas><span>${this.name(id)}</span></div>`).join('')}</div>
   ${b.ev?`<div class="gru">★ ${HS.T('rateUp')} · ${HS.T('featured')} UR 50%</div><div class="gpity"><span>${HS.T('pityNote')}</span><b>${PITY-(S.pity[b.id]||0)}</b><div class="pb"><i style="width:${(S.pity[b.id]||0)/PITY*100}%"></i></div></div>`:''}
   </div>
   <div class="gbtns"><button class="mbtn gp" id="gP1"><span>${HS.T('pull1')}</span><small>◆ ${PULL1}</small></button><button class="mbtn big gp" id="gP10"><span>${HS.T('pull10')}</span><small>◆ ${PULL10.toLocaleString()}</small></button></div>
   <div class="gnote">${HS.T('guarantee')} · <button class="lnk" id="gOdds">${HS.T('odds')}</button><br>${HS.T('gNote')}</div>`;
  el.querySelectorAll('canvas[data-ic]').forEach(c=>{const ic=this.icon(c.dataset.ic,120);c.width=c.height=120;c.getContext('2d').drawImage(ic,0,0);});
  HS.$('gP1').onclick=()=>this.go(b,1);HS.$('gP10').onclick=()=>this.go(b,10);HS.$('gOdds').onclick=()=>this.odds(b);this.cur();
  clearInterval(this.tick);if(b.ev)this.tick=setInterval(()=>{const e=HS.$('gLeft');if(e&&HS.scr==='sGacha')e.textContent=this.left(b);else clearInterval(this.tick);},20000);},
 cur(){const S=HS.state;document.querySelectorAll('.fluxv').forEach(e=>e.textContent=S.flux.toLocaleString());document.querySelectorAll('.alloyv').forEach(e=>e.textContent=S.alloy.toLocaleString());},
 odds(b){const L=HS.lang;const pct=[50,33,14,3];let h=`<h3>${HS.T('odds')} · ${HS.L(b.title)}</h3><table>`;
  for(let r=3;r>=0;r--){const pool=this.pool(b,r);h+=`<tr><td><b style="color:${RCOL[r]}">${RAR[r]}</b></td><td>${pct[r]}%</td><td>${pool.length} ${L==='ja'?'種':'items'}</td></tr>`;}
  h+=`</table>`;if(b.ev)h+=`<p>${L==='ja'?`URが出た時、50%でピックアップ（${b.feat.length}種）。${PITY}回でピックアップUR確定。`:`When a UR drops, 50% chance it is a featured item (${b.feat.length}). Featured UR guaranteed at ${PITY} pulls.`}</p>`;
  h+=`<p>${HS.T('guarantee')}</p><p>${L==='ja'?'重複はアロイに変換':'Duplicates melt into Alloy'}: N ${DUPE[0]} · R ${DUPE[1]} · SR ${DUPE[2]} · UR ${DUPE[3]}</p><p>${HS.T('gNote')}</p>`;HS.modal(h,[[HS.T('back'),null]]);},
 go(b,n){const res=this.pull(b,n);if(!res)return;AU.play('capsule');this.cur();this.reveal(res,b);},
 reveal(res,b){const ov=HS.$('gReveal');const top=Math.max(...res.map(x=>x.r));ov.className='greveal on t'+top;ov.style.setProperty('--bc',b.col);
  ov.innerHTML=`<div class="grays"></div><div class="gcaps n${res.length}">${res.map((x,i)=>`<div class="cap r${x.r}" style="--d:${i*0.07}s"><div class="shell"><i></i></div><div class="card"><canvas></canvas><em>${RAR[x.r]}</em><b>${this.name(x.id)}</b><small>${x.isNew?HS.T('newItem'):'+'+x.dupe+' '+HS.T('alloy')}</small></div></div>`).join('')}</div>
   <div class="gfoot"><button class="btn" id="gSkip">${HS.T('skip')} ▶▶</button><span id="gHint">${HS.T('tapCont')}</span></div><div class="gflash"></div>`;
  const caps=[...ov.querySelectorAll('.cap')];caps.forEach((c,i)=>{const cv=c.querySelector('canvas');const ic=this.icon(res[i].id,128);cv.width=cv.height=128;cv.getContext('2d').drawImage(ic,0,0);});
  let i=0,done=false;AU.play('gachaDrop');setTimeout(()=>AU.play(top>=3?'sr':'capsule'),400);
  const open=k=>{const c=caps[k];if(!c||c.classList.contains('open'))return;c.classList.add('open');const r=res[k].r;AU.play(r>=3?'ur':r>=2?'sr':'crack');
   if(r>=3){const f=ov.querySelector('.gflash');f.classList.remove('on');void f.offsetWidth;f.classList.add('on');}};
  const next=()=>{if(done){this.closeReveal();return;}if(i<caps.length){open(i++);if(i>=caps.length)finish();}};
  const finish=()=>{done=true;HS.$('gHint').textContent=HS.T('tapCont');HS.$('gSkip').style.visibility='hidden';};
  ov.onclick=e=>{if(e.target.closest('#gSkip'))return;next();};
  HS.$('gSkip').onclick=e=>{e.stopPropagation();while(i<caps.length)open(i++);finish();};
  // auto-open after the drop for flow; taps speed it up
  setTimeout(()=>{if(!done&&i===0)next();},1100);},
 closeReveal(){const ov=HS.$('gReveal');ov.className='greveal';ov.innerHTML='';ov.onclick=null;AU.play('ui');this.render();},
};
