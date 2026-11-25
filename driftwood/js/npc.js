'use strict';
// ================= villagers & service characters =================
const TEXL=new THREE.TextureLoader();const ATEX={};
function artTex(k){if(!ATEX[k]){const t=TEXL.load('art/'+k+'.webp?v='+VERSION,tx=>{tx.userData.ar=tx.image.width/tx.image.height;for(const id in G.npcs){const n=G.npcs[id];if(n.tex===tx)NPC.fit(n)}});t.encoding=THREE.sRGBEncoding;t.anisotropy=4;ATEX[k]=t}return ATEX[k]}
const HEART_T=[10,25,45,70,100];
function hearts(f){let h=0;for(const t of HEART_T)if(f>=t)h++;return h}
const FRIEND_GIFT={bean:'beanplush',bbean:'h_bean',pinco:'t_pink',mogu:'fern',bronny:'surfboard',asmon:'armchair'};
const NPC={
 present(id){const h=now().getHours();const V=VILL[id];
  if(id==='kaise')return S.kaiseDay===dayNum()&&h>=9&&h<21;
  if(V.svc)return true;const v=S.vill[id];if(!v||!v.in)return false;if(!S.tut.done&&id!=='bean'&&id!=='bbean'&&id!=='pinco')return false;
  if(id==='mogu')return true;return h>=6||h<1},
 spawnAll(){for(const id in G.npcs){const n=G.npcs[id];G.worldGrp.remove(n.sp,n.sh)}G.npcs={};
  for(const id in VILL){const V=VILL[id];let x,z;if(V.svc){[x,z]=LAY.spots[id]}else if(id==='bbean'){const [hx,hz]=LAY.homes.bean;x=hx+1.4;z=hz+1.8}else{const [hx,hz]=LAY.homes[id];x=hx+(id==='mogu'?0:.4);z=hz+(id==='mogu'?0:1.9)}
   const n={id,x,z,hx:x,hz:z,tx:x,tz:z,wt:Math.random()*3,vis:false,pose:0,r:id==='mogu'?.75:.38};
   n.tex=artTex(this.art(n,0));n.sp=new THREE.Sprite(new THREE.SpriteMaterial({map:n.tex,transparent:true,alphaTest:.05}));n.sp.center.set(.5,id==='mogu'?.05:0);n.sh=shadowBlob(id==='mogu'?.01:.32);
   G.worldGrp.add(n.sp,n.sh);G.npcs[id]=n;this.fit(n)}
  this.schedule()},
 art(n,p){const V=VILL[n.id];if(n.id==='asmon'&&S.vill.asmon&&S.vill.asmon.warm)return V.art[1];return V.art[p]||V.art[0]},
 fit(n){const V=VILL[n.id];const ar=(n.tex.image&&n.tex.image.width)?n.tex.image.width/n.tex.image.height:.7;n.sp.scale.set(V.h*ar,V.h,1)},
 setPose(n,p){const k=this.art(n,p);const t=artTex(k);if(n.tex!==t){n.tex=t;n.sp.material.map=t;n.sp.material.needsUpdate=true;this.fit(n)}},
 schedule(){for(const id in G.npcs){const n=G.npcs[id];const v=this.present(id);n.vis=v;n.sp.visible=n.sh.visible=v;this.setPose(n,0)}},
 update(dt){for(const id in G.npcs){const n=G.npcs[id];if(!n.vis)continue;const V=VILL[id];
   if(!V.svc&&id!=='mogu'&&!n.talking){n.wt-=dt;if(n.wt<=0){n.wt=3+Math.random()*5;const a=Math.random()*Math.PI*2,r=Math.random()*(id==='asmon'&&!(S.vill.asmon||{}).warm?1.2:2.6);n.tx=n.hx+Math.cos(a)*r;n.tz=n.hz+Math.sin(a)*r}
    const dx=n.tx-n.x,dz=n.tz-n.z,d=Math.hypot(dx,dz);if(d>.1){const sp=.7*dt;const nx=n.x+dx/d*sp,nz=n.z+dz/d*sp;if(walkH(G.W,nx,nz)!=null&&!blockedSoft(nx,nz)&&Math.hypot(nx-G.pp.x,nz-G.pp.z)>.8){n.x=nx;n.z=nz;n.walk=true}else{n.tx=n.x;n.tz=n.z;n.walk=false}}else n.walk=false}
   const y=walkH(G.W,n.x,n.z)??.3;const bob=n.walk?Math.abs(Math.sin(G.t*8+n.hx))*.06:Math.sin(G.t*2+n.hx)*.015;
   n.sp.position.set(n.x,y+bob,n.z);n.sp.material.color.setScalar(G.tint||1);n.sh.position.set(n.x,y+.02,n.z);
   const sq=n.walk?1+Math.sin(G.t*16)*.03:1+Math.sin(G.t*2.2+n.hz)*.015;const base=n.sp.scale.y;n.sp.material.rotation=n.walk?Math.sin(G.t*8)*.04:0}},
 // ---------- talking ----------
 async talk(n){const id=n.id,V=VILL[id];if(G.talking)return;G.talking=true;n.talking=true;Act.face(n.x,n.z);this.setPose(n,1);SFX.play('hello');
  try{
   if(!S.tut.done&&await Tut.talk(id)){return}
   if(id==='pooping')await this.pooping(n);else if(id==='pooh')await this.pooh(n);else if(id==='kermit')await this.kermit(n);else if(id==='kaise')await this.kaise(n);else await this.resident(n)}
  finally{G.talking=false;n.talking=false;this.setPose(n,0);UI.refreshHud();save()}},
 line(id){let L=LINES[id];if(id==='asmon'&&S.vill.asmon&&S.vill.asmon.warm)L=LINES.asmonF;const h=now().getHours();
  if(id==='mogu'&&(h<6||h>=23))return ['*snore*… Mmm… warm soil… *snore*','*すやすや*…むにゃ…あったかい土…*すやすや*'];
  return L[(Math.random()*L.length)|0]},
 async resident(n){const id=n.id;const v=S.vill[id]||(S.vill[id]={f:0,in:true});
  if(!v.talk){v.talk=1;v.f+=1;stat('talkN');stat('talk')}
  // Asmon change of heart
  if(id==='asmon'&&!v.warm&&v.f>=HEART_T[1]){v.warm=true;this.setPose(n,1);
   await UI.say(id,LANG==='ja'?'…なあ。ちょっといいか。':'…Hey. Got a minute?');
   await UI.say(id,LANG==='ja'?'この島に来た時は、だれとも関わりたくなかった。でもおまえは毎日あいさつしてきた。プレゼントまで。':'When I moved here I wanted nothing to do with anyone. But you kept saying hello. Every day. With presents.');
   await UI.say(id,LANG==='ja'?'…ありがとう。これからは、なかまってことで…いいか？':'…Thanks. I guess we are friends now. If that is okay with you.');
   UI.toast(LANG==='ja'?'アズモンと友だちになった！':'Asmon is your friend now!');SFX.play('fanfare');return}
  const h0=hearts(v.f);
  const greet=this.line(id);
  const ch=[T('tk_chat'),T('tk_gift'),T('tk_favor'),T('tk_bye')];
  const c=await UI.ask(id,N(greet),ch);
  if(c===0){await UI.say(id,N(this.line(id)))}
  else if(c===1){const pick=await UI.pickItem(T('pickGift'),s=>!['tool'].includes(ITEMS[s.id].cat)||true);if(pick==null){await UI.say(id,LANG==='ja'?'ふふ、気持ちだけでうれしいよ。':'Aw, the thought counts!');}
   else{const s=S.bag[pick];const it=ITEMS[s.id];if(S.held===pick)S.held=null;s.q--;if(!s.q)S.bag[pick]=null;updateHeld();const likes=VILL[id].likes||[];const love=likes.includes(it.cat);v.gift=(v.gift||0)+1;const pts=v.gift>2?1:(love?6:3);v.f+=pts;stat('gift');
    SFX.play(love?'fanfare':'jingle');await UI.say(id,N(love?GIFT_REPLY.love:(it.p>500?GIFT_REPLY.like:GIFT_REPLY.ok)))}}
  else if(c===2){await this.favor(n,v)}
  else{await UI.say(id,LANG==='ja'?'またね！':'See you later!')}
  const h1=hearts(v.f);if(h1>h0){SFX.play('fanfare');UI.toast('❤️ '+N(VILL[id].n)+' '+'♥'.repeat(h1));if(h1===2&&FRIEND_GIFT[id]&&!v.gave){v.gave=true;if(addItem(FRIEND_GIFT[id])){await UI.say(id,LANG==='ja'?'いつもありがとう！これ、受け取って！':'You are the best neighbor! Please take this!');UI.itemGet(FRIEND_GIFT[id])}}}
  if(S.stats.friend1==null||true){const c1=RESIDENTS.filter(r=>S.vill[r]&&hearts(S.vill[r].f)>=1).length;S.stats.friend1=c1}},
 async favor(n,v){const id=n.id;const f=v.favor;
  if(!f||f.done){await UI.say(id,LANG==='ja'?'今日はだいじょうぶ！ありがとう！':'I am all set today, thank you!');return}
  const has=()=>{if(f.k==='item')return S.bag.findIndex(s=>s&&s.id===f.item);if(f.k==='fish')return S.bag.findIndex(s=>s&&ITEMS[s.id].cat==='fish');return S.bag.findIndex(s=>s&&ITEMS[s.id].cat==='bug')};
  const ask=N(FAVOR_ASK[f.k]).replace('{0}',f.item?N(ITEMS[f.item].n):'');
  const idx=has();
  if(idx<0){await UI.say(id,ask);return}
  const c=await UI.ask(id,ask,[T('tk_deliver'),T('no')]);if(c!==0)return;
  const s=S.bag[idx];if(S.held===idx)S.held=null;s.q--;if(!s.q)S.bag[idx]=null;updateHeld();f.done=true;v.f+=5;stat('favor');
  await UI.say(id,N(FAVOR_THX));
  const R=Math.random();if(R<.5){const c2=300+((Math.random()*10)|0)*100;S.coins+=c2;UI.toast('+'+c2+' 🍯');SFX.play('coin')}
  else{const pool=FURN.map(x=>x[0]).filter(x=>ITEMS[x].p>0&&!['arcade'].includes(x));const it=pool[(Math.random()*pool.length)|0];if(addItem(it))UI.itemGet(it);else{S.coins+=500}}},
 // ---------- services ----------
 async pooping(n){const c=await UI.ask('pooping',N(this.line('pooping')),[T('tk_stamps'),T('tk_home'),T('app_tasks'),T('tk_bye')]);
  if(c===0)UI.stampShop();else if(c===1)await this.homeTalk();else if(c===2)UI.tasks()},
 async homeTalk(){const H=S.house,cur=HOUSE[H.tier];const ja=LANG==='ja';
  if(H.pend>=0){await UI.say('pooping',ja?'工事は明日の朝5時に終わるよ。楽しみにね！':'Construction finishes tomorrow at 5 AM. Exciting!');return}
  if(H.debt>0){const isSt=cur.cur==='stamps';const have=isSt?S.stamps:S.coins;const unit=isSt?T('stamps'):T('coins');
   const msg=ja?`${N(cur.n)}のローンはのこり ${H.debt.toLocaleString()} ${unit}。いまは ${have.toLocaleString()} 持っているね。`:`You owe ${H.debt.toLocaleString()} ${unit} on your ${N(cur.n).toLowerCase()}. You have ${have.toLocaleString()}.`;
   const opts=[];if(have>0)opts.push(ja?'払えるだけ払う':'Pay what I can');opts.push(T('back'));
   const c=await UI.ask('pooping',msg,opts);if(c===0&&have>0){const pay=Math.min(have,H.debt);if(isSt)S.stamps-=pay;else S.coins-=pay;H.debt-=pay;SFX.play('coin');
    if(H.debt<=0){H.debt=0;stat('house');await UI.say('pooping',ja?'完済おめでとう！これで正式にきみの家だ。':'Paid in full! Congratulations, it is officially yours.')}
    else await UI.say('pooping',ja?`ありがとう！のこりは ${H.debt.toLocaleString()} ${unit}。`:`Thank you! ${H.debt.toLocaleString()} ${unit} to go.`)}
   UI.refreshHud();return}
  if(H.tier>=HOUSE.length-1){await UI.say('pooping',ja?'これ以上ないほどすてきな家だね！':'Your house is as grand as it gets!');return}
  const nx=HOUSE[H.tier+1];
  const c=await UI.ask('pooping',ja?`${N(nx.n)}に増築する？ローンは ${nx.debt?nx.debt.toLocaleString()+' '+T('coins'):'なし'}。明日には完成するよ。`:`Shall I upgrade you to a ${N(nx.n).toLowerCase()}? ${nx.debt?'The loan is '+nx.debt.toLocaleString()+' Honey Coins.':'No loan this time!'} It will be ready tomorrow.`,[T('yes'),T('no')]);
  if(c===0){H.pend=H.tier+1;SFX.play('jingle');await UI.say('pooping',ja?'まかせて！明日の朝を楽しみにね。':'Leave it to me! See you in the morning.')}},
 async pooh(n){const c=await UI.ask('pooh',N(this.line('pooh')),[T('buy'),T('sell'),T('tk_chat'),T('tk_bye')]);
  if(c===0)UI.shop();else if(c===1)UI.sell();else if(c===2)await UI.say('pooh',N(this.line('pooh')))},
 async kermit(n){const ja=LANG==='ja';const unid=S.bag.filter(s=>s&&s.id==='fossil_u').length;
  const opts=[T('tk_donate'),T('tk_museum')];if(unid)opts.unshift(T('assess'));opts.push(T('tk_bye'));
  const c=await UI.ask('kermit',N(this.line('kermit')),opts);const k=opts[c];
  if(k===T('assess')){for(let i=0;i<S.bag.length;i++){const s=S.bag[i];if(s&&s.id==='fossil_u'){const pool=FOSSILS.map(f=>f[0]);const notDon=pool.filter(f=>!(S.museum.fossil||{})[f]);const src=notDon.length&&Math.random()<.7?notDon:pool;const pick=src[(Math.random()*src.length)|0]||pool[0];S.bag[i]={id:'fo_'+pick,q:1};(S.pedia.fossil||(S.pedia.fossil={}))[pick]=1}}
   SFX.play('jingle');await UI.say('kermit',ja?'ふむふむ…鑑定できたよ！ポケットを見てごらん。':'Hmm, hmm… All assessed! Check your pockets.');return this.kermit(n)}
  if(k===T('tk_donate'))await UI.donate();else if(k===T('tk_museum'))UI.museum()},
 async kaise(n){const c=await UI.ask('kaise',N(this.line('kaise')),[T('buy'),T('tk_bye')]);if(c===0)UI.shop('kaise')},
};
