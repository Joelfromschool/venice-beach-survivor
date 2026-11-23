'use strict';
// PincoPop feed app: vertical swipe feed, gestures, rail actions, sheets, settings.
const APP=(()=>{
 const $=id=>document.getElementById(id);
 const GL={
  search:'<svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.3" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M15.3 15.3l5 5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>',
  me:'<svg viewBox="0 0 24 24"><circle cx="12" cy="8.2" r="3.8" fill="none" stroke="currentColor" stroke-width="2"/><path d="M4.5 20.2c.9-3.9 3.9-6 7.5-6s6.6 2.1 7.5 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  back:'<svg viewBox="0 0 24 24"><path d="M15 4.5L7.5 12l7.5 7.5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  heart:'<svg viewBox="0 0 24 24"><path d="M12 20.6s-7.6-4.5-9.4-9.3C1.3 7.9 3.3 4.4 6.8 4.4c2.1 0 3.7 1.2 5.2 3.2 1.5-2 3.1-3.2 5.2-3.2 3.5 0 5.5 3.5 4.2 6.9-1.8 4.8-9.4 9.3-9.4 9.3z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
  heartF:'<svg viewBox="0 0 24 24"><defs><linearGradient id="hg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff7ab6"/><stop offset="1" stop-color="#ff2d6f"/></linearGradient></defs><path d="M12 20.6s-7.6-4.5-9.4-9.3C1.3 7.9 3.3 4.4 6.8 4.4c2.1 0 3.7 1.2 5.2 3.2 1.5-2 3.1-3.2 5.2-3.2 3.5 0 5.5 3.5 4.2 6.9-1.8 4.8-9.4 9.3-9.4 9.3z" fill="url(#hg)"/><path d="M7 8.2c.8-1 2-1.2 2.8-.9" stroke="#fff" stroke-width="1.4" stroke-linecap="round" fill="none" opacity=".7"/></svg>',
  cmt:'<svg viewBox="0 0 24 24"><path d="M6 3.8h12a3.2 3.2 0 0 1 3.2 3.2v7.6a3.2 3.2 0 0 1-3.2 3.2h-6.6l-4.9 3.6v-3.6H6a3.2 3.2 0 0 1-3.2-3.2V7A3.2 3.2 0 0 1 6 3.8z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M8.6 10.6q3.4 3.1 6.8 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  share:'<svg viewBox="0 0 24 24"><path d="M10.5 4.5H7A3 3 0 0 0 4 7.5v9.5a3 3 0 0 0 3 3h9.5a3 3 0 0 0 3-3v-3.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M14 3.8h6.2V10M20.2 3.8l-8.4 8.4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  star:'<svg viewBox="0 0 24 24"><path d="M12 3.2l2.6 5.5 6 .8-4.4 4.1 1.1 6-5.3-2.9-5.3 2.9 1.1-6-4.4-4.1 6-.8z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
  note:'<svg viewBox="0 0 24 24"><path d="M9 18.5V6.2l10-2.2v12" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><circle cx="6.6" cy="18.6" r="2.6" fill="currentColor"/><circle cx="16.6" cy="16.2" r="2.6" fill="currentColor"/></svg>',
  play:'<svg viewBox="0 0 24 24"><path d="M7 4.5v15l12.5-7.5z" fill="#fff"/></svg>',
  home:'<svg viewBox="0 0 30 24"><path d="M8 4l-6 8 6 8" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/><rect x="13" y="5" width="6" height="6" rx="1.6" fill="currentColor"/><rect x="21" y="5" width="6" height="6" rx="1.6" fill="currentColor"/><rect x="13" y="13" width="6" height="6" rx="1.6" fill="currentColor"/><rect x="21" y="13" width="6" height="6" rx="1.6" fill="currentColor"/></svg>',
  gear:'<svg viewBox="0 0 24 24"><path d="M4 7h9M17 7h3M4 17h3M11 17h9" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><circle cx="15" cy="7" r="2.4" fill="none" stroke="currentColor" stroke-width="2.2"/><circle cx="9" cy="17" r="2.4" fill="none" stroke="currentColor" stroke-width="2.2"/></svg>',
  mute:'<svg viewBox="0 0 24 24"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor"/><path d="M16 9.5l5 5M21 9.5l-5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  vol:'<svg viewBox="0 0 24 24"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor"/><path d="M15.5 9a4.2 4.2 0 0 1 0 6M18.2 6.5a8 8 0 0 1 0 11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  link:'<svg viewBox="0 0 24 24"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  up:'<svg viewBox="0 0 24 24"><path d="M6 14l6-6 6 6" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  no:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M6 6l12 12" stroke="currentColor" stroke-width="2"/></svg>',
  badge:'<svg class="vb" viewBox="0 0 24 24"><path d="M12 2l2.4 1.9 3-.3.9 2.9 2.7 1.4-.9 2.9 1 2.8-2.6 1.6-.7 3-3-.1L12 22l-2.4-1.9-3 .3-.9-2.9-2.7-1.4.9-2.9-1-2.8 2.6-1.6.7-3 3 .1z" fill="#ff4f9a"/><path d="M8 12.2l2.6 2.6L16.2 9" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  badgeG:'<svg class="vb" viewBox="0 0 24 24"><path d="M12 2l2.4 1.9 3-.3.9 2.9 2.7 1.4-.9 2.9 1 2.8-2.6 1.6-.7 3-3-.1L12 22l-2.4-1.9-3 .3-.9-2.9-2.7-1.4.9-2.9-1-2.8 2.6-1.6.7-3 3 .1z" fill="#f2b705"/><path d="M8 12.2l2.6 2.6L16.2 9" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  coin:'<svg viewBox="0 0 30 30"><circle cx="15" cy="15" r="13" fill="#e9a81b"/><circle cx="15" cy="15" r="10" fill="#ffd451"/><text x="15" y="20.5" text-anchor="middle" font-size="15" font-weight="900" font-family="Arial" fill="#c98a0c">$</text></svg>',
 };
 // ---------- state ----------
 const LS='pincopop_v1';let st={lang:null,want:true,auto:false,liked:{},saved:{},fol:{},cl:{},nope:{},gold:false,seen:0,mine:{}};
 try{Object.assign(st,JSON.parse(localStorage.getItem(LS)||'{}'))}catch(e){}
 if(!st.lang)st.lang=(navigator.language||'en').toLowerCase().startsWith('ja')?'ja':'en';
 const save=()=>{try{localStorage.setItem(LS,JSON.stringify(st))}catch(e){}};
 const T=(k,v)=>{let s=(STR[st.lang]&&STR[st.lang][k])||STR.en[k]||k;if(v)for(const q in v)s=s.replace('{'+q+'}',v[q]);return s};
 const L=a=>Array.isArray(a)?(st.lang==='ja'&&a[1]?a[1]:a[0]):a;
 RD.lang=st.lang;AU.setWant(st.want);
 const CL=window.CLIPS;CL.forEach(c=>RD.norm(c));
 const byId={};CL.forEach((c,i)=>byId[c.id]=i);
 // ---------- avatars (head crops from cut-outs) ----------
 const AV={};
 function avatar(name){if(AV[name])return AV[name];const ph='data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><rect width="10" height="10" fill="#ffd84a"/></svg>');
  AV[name]=ph;RD.load(name).then(im=>{if(!im)return;const c=document.createElement('canvas');c.width=c.height=96;const x=c.getContext('2d');const s=Math.min(im.width,im.height*.42);const sx=(im.width-s)/2,sy=im.height*.02;
   x.fillStyle='#ffe9a8';x.fillRect(0,0,96,96);x.drawImage(im,sx,sy,s,s,0,0,96,96);AV[name]=c.toDataURL('image/jpeg',.85);document.querySelectorAll('img[data-av="'+name+'"]').forEach(e=>e.src=AV[name])});return ph}
 const avImg=(name,cls)=>`<img ${cls?'class="'+cls+'"':''} data-av="${name}" src="${avatar(name)}" alt="">`;
 // ---------- formatting ----------
 function fmt(n){if(st.lang==='ja'){if(n>=1e8)return (n/1e8).toFixed(1).replace(/\.0$/,'')+'億';if(n>=1e4)return (n/1e4).toFixed(n>=1e5?0:1).replace(/\.0$/,'')+'万';return n.toLocaleString('ja-JP')}
  if(n>=1e6)return (n/1e6).toFixed(1).replace(/\.0$/,'')+'M';if(n>=1e4)return (n/1e3).toFixed(1).replace(/\.0$/,'')+'K';return n.toLocaleString('en-US')}
 const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 // ---------- feed ----------
 let cat='all',feed=[],idx=0,H=innerHeight,W=innerWidth,DPR=Math.min(2,devicePixelRatio||1);
 function rngS(seed){let s=seed%2147483647;if(s<=0)s+=2147483646;return()=>(s=s*16807%2147483647)/2147483647}
 let shuffleSeed=(Date.now()%100000)+7;
 let col={kind:'saved',list:[],prev:'all'};
 function pool(){if(cat==='mine')return col.list.filter(i=>CL[i]);return CL.map((c,i)=>i).filter(i=>{const c=CL[i];if(cat==='all'&&c.noFY)return false;if(cat==='tokyo'&&c.noTok)return false;if(st.nope[c.id])return false;if(c.cat==='secret')return st.gold&&(cat==='secret'||cat==='all');return cat==='all'||c.cat===cat||(c.also||[]).includes(cat)})}
 function extend(){const P=pool();if(!P.length)return;const r=rngS(shuffleSeed++);
  if(cat==='mine'){feed.push(...P);return}
  let arr=P.slice();for(let i=arr.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]]}
  if(cat==='all'){const wk=i=>{const c=CL[i];const w=c.w!=null?c.w:(c.bb?2.2:c.cat==='parent'?1.7:1);return -Math.log(Math.max(1e-9,r()))/w};const K=new Map(arr.map(i=>[i,wk(i)]));arr.sort((a,b)=>K.get(a)-K.get(b))}
  if(cat==='all'){// spread categories and put a real video clip early
   const out=[];const rest=arr.slice();while(rest.length){const last=out.length?CL[out[out.length-1]].cat:null;let k=rest.findIndex(i=>CL[i].cat!==last);if(k<0)k=0;out.push(rest.splice(k,1)[0])}arr=out;
   if(!feed.length){const vi=arr.findIndex(i=>CL[i].vid);if(vi>1){const v=arr.splice(vi,1)[0];arr.splice(1,0,v)}const fi=arr.findIndex(i=>CL[i].id==='f01');if(fi>0&&!st.seen){const f=arr.splice(fi,1)[0];arr.unshift(f)}}}
  if(feed.length&&arr[0]===feed[feed.length-1])arr.push(arr.shift());
  feed.push(...arr)}
 // ---------- slots ----------
 const feedEl=$('feed');const slots=[];
 function mkSlot(k){const el=document.createElement('div');el.className='slide';
  el.innerHTML=`<canvas></canvas><video playsinline webkit-playsinline muted loop preload="auto"></video><div class="shadeT"></div><div class="loadc"></div><div class="ov"><div class="shade"></div>
   <div class="rail"><button class="rb like" type="button">${GL.heart}<span class="n"></span></button><button class="rb cmt" type="button">${GL.cmt}<span class="n"></span></button><button class="rb shr" type="button">${GL.share}<span class="n"></span></button><button class="rb sav" type="button">${GL.star}<span class="n"></span></button><button class="disc" type="button"><img alt=""></button></div>
   <div class="meta"><div class="who"><img class="av" alt=""><b class="h"></b><button class="fol" type="button"></button></div><div class="cap"><span class="ct"></span><button class="more" type="button"></button></div><div class="aud">${GL.note}<div class="mq"><span></span></div></div></div>
   <div class="pz">${GL.play}</div></div><div class="prog"><i></i></div>`;
  feedEl.appendChild(el);const s={k,el,cv:el.querySelector('canvas'),vd:el.querySelector('video'),i:-999,clip:null,drawnAt:-1,poster:null};s.x=s.cv.getContext('2d',{alpha:false});
  const q=c=>el.querySelector(c);s.q={like:q('.like'),likeN:q('.like .n'),cmtN:q('.cmt .n'),shrN:q('.shr .n'),sav:q('.sav'),savN:q('.sav .n'),disc:q('.disc img'),discB:q('.disc'),av:q('.who .av'),h:q('.who .h'),fol:q('.fol'),cap:q('.cap'),ct:q('.ct'),more:q('.more'),mq:q('.mq span'),prog:q('.prog i'),progB:q('.prog')};
  q('.like').onclick=e=>{e.stopPropagation();toggleLike(s,false)};
  q('.cmt').onclick=e=>{e.stopPropagation();openComments(s.clip)};
  q('.shr').onclick=e=>{e.stopPropagation();openShare(s.clip)};
  q('.sav').onclick=e=>{e.stopPropagation();toggleSave(s)};
  q('.disc').onclick=e=>{e.stopPropagation();openProfile(s.clip.by)};
  q('.who .av').onclick=q('.who .h').onclick=e=>{e.stopPropagation();openProfile(s.clip.by)};
  q('.fol').onclick=e=>{e.stopPropagation();st.fol[s.clip.by]=!st.fol[s.clip.by];save();slots.forEach(fill);AU.sfx('pop')};
  q('.cap').onclick=e=>{e.stopPropagation();s.q.cap.classList.toggle('open');s.q.more.textContent=s.q.cap.classList.contains('open')?T('less'):T('more')};
  return s}
 for(let k=0;k<3;k++)slots.push(mkSlot(k));
 const pk=mkSlot(3);$('peek').appendChild(pk.el);pk.el.style.transform='none';
 const slotFor=i=>slots[((i%3)+3)%3];
 function measureSafe(){try{const s=slots[0];if(!s||!W||!H)return;const fr=feedEl.getBoundingClientRect(),rl=s.q.rail||s.el.querySelector('.rail'),mt=s.el.querySelector('.meta'),tp=$('top');const a=rl.getBoundingClientRect(),m=mt.getBoundingClientRect(),t=tp.getBoundingClientRect();const top0=s.el.getBoundingClientRect().top;
  const sp=$('soundPill');let tb=t.bottom;if(sp.classList.contains('show')){const pr=sp.getBoundingClientRect();if(pr.height)tb=Math.max(tb,pr.bottom+4)}
  RD.safe={top:Math.max(0,(tb-fr.top))/H,railL:(a.left-fr.left)/W,railT:(a.top-top0)/H,railB:(a.bottom-top0)/H,metaT:(m.top-top0)/H}}catch(e){}}
 try{new MutationObserver(()=>{setTimeout(measureSafe,30);slots.forEach(s=>s.drawnAt=-1)}).observe($('soundPill'),{attributes:true,attributeFilter:['class']})}catch(e){}
 function resize(){W=feedEl.clientWidth||innerWidth;H=feedEl.clientHeight||innerHeight;DPR=Math.min(2,devicePixelRatio||1);slots.concat(pk).forEach(s=>{s.cv.width=Math.round(W*DPR);s.cv.height=Math.round(H*DPR);s.drawnAt=-1});place(0,false);measureSafe()}
 function assign(s,i){if(s.i===i&&s.clip)return;s.i=i;const ci=feed[i];s.clip=ci==null?null:CL[ci];s.drawnAt=-1;s.t=0;s.el.classList.remove('paused');s.q.cap.classList.remove('open');
  if(s.clip&&s.clip.vid){if(s.vd.dataset.v!==s.clip.vid){s.vd.dataset.v=s.clip.vid;s.vd.src='vid/'+s.clip.vid+'.mp4?v='+(window.__BUILD__||'');s.vd.load()}s.poster=new Image();s.poster.src='vid/'+s.clip.vid+'.jpg?v='+(window.__BUILD__||'');try{s.vd.pause();s.vd.currentTime=0}catch(e){}}
  else{if(s.vd.dataset.v){s.vd.removeAttribute('src');s.vd.dataset.v='';try{s.vd.load()}catch(e){}}s.poster=null}
  if(s.clip){RD.loadClip(s.clip).then(()=>{s.drawnAt=-1})}fill(s)}
 function fill(s){const c=s.clip;if(!c)return;const cr=CREATORS[c.by];const liked=!!st.liked[c.id];
  s.q.like.classList.toggle('on',liked);s.q.like.querySelector('svg').outerHTML=liked?GL.heartF:GL.heart;s.q.likeN.textContent=fmt(c.likes+(liked?1:0));
  s.q.cmtN.textContent=fmt(c.cm+((st.mine[c.id]||[]).length));s.q.shrN.textContent=fmt(Math.round(c.likes*.071));
  s.q.sav.classList.toggle('on',!!st.saved[c.id]);s.q.savN.textContent=fmt(Math.round(c.likes*.12)+(st.saved[c.id]?1:0));
  const av=avatar(cr.av);s.q.av.dataset.av=cr.av;s.q.av.src=av;s.q.disc.dataset.av=cr.av;s.q.disc.src=av;
  s.q.h.innerHTML=esc(cr.h)+(st.gold?GL.badgeG:GL.badge);s.q.fol.textContent=st.fol[c.by]?T('following'):T('follow');s.q.fol.classList.toggle('on',!!st.fol[c.by]);
  s.q.ct.textContent=L(c.cap)+(c.cat==='preg'?'  ⓘ '+T('nomed'):c.note?'  ⓘ '+T('chk'):'');s.q.more.textContent=s.q.cap.classList.contains('open')?T('less'):T('more');
  const a=L(c.snd)+' · '+cr.h+' · '+T('orig');s.q.mq.textContent=a+'    •    '+a+'    •    '}
 let drag=0,animating=false;
 function place(dy,anim){slots.forEach(s=>{const off=(s.i-idx)*H+dy;const jump=s.lastOff==null||Math.abs(off-s.lastOff)>H*1.5;s.lastOff=off;s.el.style.transition=anim&&!jump?'transform '+anim+'ms cubic-bezier(.22,.8,.3,1)':'none';s.el.style.transform=`translate3d(0,${off}px,0)`;s.el.style.visibility=Math.abs(s.i-idx)>1?'hidden':'visible'})}
 function ensure(){if(idx>feed.length-4)extend();for(let d=-1;d<=1;d++){const i=idx+d;if(i<0){const s=slotFor(i);s.i=i;s.clip=null;continue}assign(slotFor(i),i)}}
 // ---------- playback ----------
 let playing=true,hold=false,lastNow=performance.now();const cur=()=>slotFor(idx);
 function startCur(at){const s=cur();if(!s.clip)return;s.t=at||0;s.loops=0;s.el.classList.remove('paused');
  if(s.clip.vid){try{s.vd.currentTime=s.t;const p=s.vd.play();if(p)p.catch(()=>{})}catch(e){}}
  if(playing&&!hold)AU.start(s.clip,s.t);else AU.stop()}
 function stopSlot(s){if(s.clip&&s.clip.vid){try{s.vd.pause()}catch(e){}}}
 function setPlaying(p,showIcon){playing=p;const s=cur();if(!s.clip)return;s.el.classList.toggle('paused',!p&&showIcon);
  if(p&&!hold){if(s.clip.vid){const pr=s.vd.play();if(pr)pr.catch(()=>{})}AU.start(s.clip,s.t)}else{if(s.clip.vid)s.vd.pause();AU.stop()}
  s.q.discB.classList.toggle('stop',!p)}
 function go(dir){if(animating)return;const ni=idx+dir;if(ni<0){place(0,260);return}
  stopSlot(cur());AU.stop();const prev=idx;idx=ni;ensure();
  animating=true;place(0,Math.round(lastFlingMs));setTimeout(()=>{animating=false;place(0,false)},lastFlingMs+30);
  playing=true;startCur(0);st.seen++;if(st.seen%5===0)save();hideHint()}
 let lastFlingMs=300;
 // ---------- render loop ----------
 function drawSlot(s,t){if(!s.clip)return false;if(!RD.ready(s.clip))return false;RD.VID.cur=s.clip.vid?s.vd:null;RD.VID.poster=s.poster;RD.draw(s.x,s.clip,t,s.cv.width,s.cv.height);return true}
 let fpsAcc=0,fpsN=0,slowFrames=0;
 function frame(now){requestAnimationFrame(frame);const dt=Math.min(.1,(now-lastNow)/1000);lastNow=now;
  const s=cur();if(!s.clip)return;
  if(playing&&!hold){let t;if(s.clip.vid){t=s.vd.currentTime||0;if(t+.25<(s.t||0)){AU.start(s.clip,t);s.loops++}}else{const at=AU.time();t=at!=null?at:s.t+dt;}
   if(t>=s.clip.dur){t=t%s.clip.dur;s.loops=(s.loops||0)+1;if(st.auto&&!sheetOpen){go(1);return}if(!s.clip.vid)AU.start(s.clip,t)}
   s.t=t}
  const ok=drawSlot(s,s.t||0);s.el.classList.toggle('loading',!ok);
  s.q.prog.style.width=(Math.min(1,(s.t||0)/s.clip.dur)*100).toFixed(2)+'%';
  // neighbours: draw one still frame once ready (instant preview while swiping)
  for(const d of [-1,1]){const n=slotFor(idx+d);if(n.i!==idx+d||!n.clip)continue;if(n.drawnAt<0&&drawSlot(n,Math.min(1.1,n.clip.dur*.12))){n.drawnAt=now;n.el.classList.remove('loading');n.q.prog.style.width='0%'}}
  // adaptive resolution: drop DPR if we are slow
  if(dt>0){fpsAcc+=dt;fpsN++;if(fpsN>=90){const avg=fpsAcc/fpsN;fpsAcc=0;fpsN=0;if(avg>1/40&&DPR>1.25){DPR=Math.max(1.25,DPR-.35);resize()}}}}
 // ---------- gestures ----------
 let ptr=null,lastTap=0,tapTimer=0,lpTimer=0,samples=[];
 feedEl.addEventListener('pointerdown',e=>{if(sheetOpen||ptr||hzAnim)return;const wasMuted=!AU.running;unlockAudio();ptr={wasMuted,id:e.pointerId,x:e.clientX,y:e.clientY,t:performance.now(),moved:false,onUi:!!e.target.closest('button,a,.meta,.prog')};samples=[[e.clientY,ptr.t]];samplesX=[[e.clientX,ptr.t]];
  try{feedEl.setPointerCapture(e.pointerId)}catch(er){}
  if(!ptr.onUi)lpTimer=setTimeout(()=>{if(ptr&&!ptr.moved){hold=true;document.body.classList.add('clean');setPlaying(playing,false);ptr.lp=true}},380)},{passive:true});
 feedEl.addEventListener('pointermove',e=>{if(!ptr||e.pointerId!==ptr.id)return;const dy=e.clientY-ptr.y,dx=e.clientX-ptr.x;
  if(!ptr.moved&&!animating&&Math.abs(dx)>10&&Math.abs(dx)>Math.abs(dy)*1.2){ptr.moved=true;ptr.hz=true;clearTimeout(lpTimer);if(ptr.lp)endHold();hzStart()}
  if(ptr.hz){samplesX.push([e.clientX,performance.now()]);if(samplesX.length>6)samplesX.shift();hzMove(dx);return}
  if(!ptr.moved&&Math.abs(dy)>9&&Math.abs(dy)>Math.abs(dx)*.8){ptr.moved=true;clearTimeout(lpTimer);if(ptr.lp)endHold()}
  if(ptr.moved&&!animating){let d=dy;if(idx===0&&d>0)d*=.3;drag=d;place(d,false)}samples.push([e.clientY,performance.now()]);if(samples.length>6)samples.shift()},{passive:true});
 function endHold(){if(!hold)return;hold=false;document.body.classList.remove('clean');setPlaying(playing,false)}
 const up=e=>{if(!ptr||e.pointerId!==ptr.id)return;clearTimeout(lpTimer);const p=ptr;ptr=null;const now=performance.now();
  if(p.lp){endHold();return}
  if(p.hz){const a=samplesX[0],b=samplesX[samplesX.length-1];const vx=b&&a&&b[1]>a[1]?(b[0]-a[0])/(b[1]-a[1]):0;hzEnd(e.type==='pointercancel'?0:e.clientX-p.x,e.type==='pointercancel'?0:vx);return}
  if(p.moved){const dy=e.clientY-p.y;const a=samples[0],b=samples[samples.length-1];const v=b&&a&&b[1]>a[1]?(b[0]-a[0])/(b[1]-a[1]):0;
   let dir=0;if(dy<-H*.18||v<-.45)dir=1;else if(dy>H*.18||v>.45)dir=-1;if(dir===-1&&idx===0)dir=0;
   const remaining=dir?H-Math.abs(dy):Math.abs(dy);lastFlingMs=Math.max(170,Math.min(380,remaining/Math.max(.9,Math.abs(v))));
   drag=0;if(dir)go(dir);else place(0,240);return}
  if(p.onUi||e.type==='pointercancel')return;
  // taps: single = pause/play, double = like with heart at the finger
  if(now-lastTap<300&&Math.hypot(e.clientX-p.lx0,e.clientY-p.ly0)<60){clearTimeout(tapTimer);lastTap=0;burst(e.clientX,e.clientY);if(!st.liked[cur().clip.id])toggleLike(cur(),true);return}
  lastTap=now;p.lx0=e.clientX;p.ly0=e.clientY;lastXY=[e.clientX,e.clientY];const firstUnmute=p.wasMuted&&st.want&&playing;tapTimer=setTimeout(()=>{lastTap=0;if(firstUnmute){volFlash(true);return}setPlaying(!playing,true)},300)};
 let lastXY=[0,0],samplesX=[];
 // ---------- horizontal swipe between sections ----------
 let hz=null,hzAnim=false;
 function tabList(){if(cat==='mine')return ['mine'];return st.gold?CATS.concat('secret'):CATS}
 function hzStart(){const cs=tabList();hz={cs,i:cs.indexOf(cat),nb:null,d:0};hideHint()}
 function preparePeek(c){const sc=secFor(c);const ci=sc.feed[sc.idx];const clip=CL[ci];pk.clip=clip;pk.i=-1;pk.el.classList.remove('paused');pk.q.cap.classList.remove('open');fill(pk);pk.q.prog.style.width='0%';
  const t=Math.min(sc.t||Math.min(1.1,clip.dur*.12),clip.dur-.05);const paint=()=>{if(pk.clip!==clip)return;const x=pk.x;if(clip.vid){RD.VID.cur=null;const im=new Image();im.onload=()=>{if(pk.clip===clip){RD.VID.poster=im;RD.draw(x,clip,t,pk.cv.width,pk.cv.height)}};im.src='vid/'+clip.vid+'.jpg?v='+(window.__BUILD__||'')}else{RD.VID.cur=null;RD.draw(x,clip,t,pk.cv.width,pk.cv.height)}pk.el.classList.remove('loading')};
  pk.x.fillStyle='#0d0d10';pk.x.fillRect(0,0,pk.cv.width,pk.cv.height);pk.el.classList.add('loading');if(RD.ready(clip))paint();else RD.loadClip(clip).then(paint)}
 function hzSet(d,anim){const pe=$('peek');const tr=anim?'transform '+anim+'ms cubic-bezier(.22,.8,.3,1)':'none';feedEl.style.transition=tr;pe.style.transition=tr;feedEl.style.transform=d?'translate3d('+d.toFixed(1)+'px,0,0)':'';const dir=hz&&hz.dir||0;pe.style.transform='translate3d('+(d+(dir>0?W:-W)).toFixed(1)+'px,0,0)'}
 function hzMove(dx){if(!hz)return;const dir=dx<0?1:-1,ni=hz.i+dir;let d=dx;
  if(ni<0||ni>=hz.cs.length){d=dx*.28;hz.dir=0;$('peek').style.visibility='hidden';placeInd(cat,cat,0,false)}
  else{if(hz.nb!==ni){hz.nb=ni;preparePeek(hz.cs[ni])}hz.dir=dir;$('peek').style.visibility='visible';placeInd(cat,hz.cs[ni],Math.min(1,Math.abs(dx)/W),false)}
  hz.d=d;hzSet(d,false)}
 function hzEnd(dx,vx){if(!hz)return;const h=hz;const dir=dx<0?1:-1,ni=h.i+dir;const ok=h.dir===dir&&ni>=0&&ni<h.cs.length&&(Math.abs(dx)>W*.22||(Math.abs(vx)>.45&&Math.sign(vx)===-dir));
  hzAnim=true;
  if(ok){const ms=Math.round(Math.max(170,Math.min(340,(W-Math.abs(dx))/Math.max(.9,Math.abs(vx)))));hzSet(-dir*W,ms);placeInd(cat,h.cs[ni],1,ms);
   setTimeout(()=>{const c=h.cs[ni];setCat(c);feedEl.style.transition='none';feedEl.style.transform='';let n=0;const wait=()=>{const s=cur();if((s.clip&&RD.ready(s.clip)&&n>1)||n>40){$('peek').style.visibility='hidden';pk.clip=null;hz=null;hzAnim=false}else{n++;requestAnimationFrame(wait)}};requestAnimationFrame(wait)},ms+20)}
  else{hzSet(0,240);placeInd(cat,cat,0,240);setTimeout(()=>{$('peek').style.visibility='hidden';hz=null;hzAnim=false;feedEl.style.transition='none';feedEl.style.transform=''},260)}}
 feedEl.addEventListener('pointerup',e=>{if(ptr){ptr.lx0=lastXY[0];ptr.ly0=lastXY[1]}up(e)});feedEl.addEventListener('pointercancel',up);
 // wheel / keys for desktop testing (no instructions shown; mobile is the target)
 let wheelLock=0;feedEl.addEventListener('wheel',e=>{e.preventDefault();const now=performance.now();if(now<wheelLock||Math.abs(e.deltaY)<12)return;wheelLock=now+520;lastFlingMs=300;go(e.deltaY>0?1:-1)},{passive:false});
 addEventListener('keydown',e=>{if(sheetOpen||EX.open||e.target.tagName==='INPUT')return;if(e.key==='ArrowDown'){lastFlingMs=300;go(1)}else if(e.key==='ArrowUp'){lastFlingMs=300;go(-1)}else if(e.key===' '){e.preventDefault();setPlaying(!playing,true)}});
 // scrub on the progress bar
 slots.forEach(s=>{const pb=s.q.progB;let on=false;const seek=x=>{const c=s.clip;if(!c)return;s.t=Math.max(0,Math.min(c.dur-.05,x/W*c.dur));if(c.vid)try{s.vd.currentTime=s.t}catch(e){}if(playing)AU.start(c,s.t)};
  pb.addEventListener('pointerdown',e=>{e.stopPropagation();on=true;pb.classList.add('drag');seek(e.clientX);try{pb.setPointerCapture(e.pointerId)}catch(er){}});
  pb.addEventListener('pointermove',e=>{if(on)seek(e.clientX)});pb.addEventListener('pointerup',()=>{on=false;pb.classList.remove('drag')})});
 // ---------- likes / saves ----------
 function toggleLike(s,fromDouble){const c=s.clip;if(!c)return;if(st.liked[c.id])delete st.liked[c.id];else st.liked[c.id]=Date.now();save();fill(s);s.q.like.classList.remove('pop');void s.q.like.offsetWidth;s.q.like.classList.add('pop');if(st.liked[c.id])AU.sfx(st.gold?'coin':'pop')}
 function toggleSave(s){const c=s.clip;if(st.saved[c.id])delete st.saved[c.id];else st.saved[c.id]=Date.now();save();fill(s);s.q.sav.classList.remove('pop');void s.q.sav.offsetWidth;s.q.sav.classList.add('pop');toast(T(st.saved[c.id]?'savedT':'unsavedT'))}
 function burst(x,y){const b=$('bursts');const r=$('feed').getBoundingClientRect();x-=r.left;y-=r.top;const d=document.createElement('div');d.className='burst';d.style.left=x+'px';d.style.top=y+'px';d.style.setProperty('--r',(Math.random()*30-15).toFixed(0)+'deg');d.innerHTML=st.gold?GL.coin:GL.heartF;b.appendChild(d);setTimeout(()=>d.remove(),950);
  if(st.gold){for(let i=0;i<10;i++){const c=document.createElement('div');c.className='coinb';c.style.left=x+'px';c.style.top=y+'px';c.style.setProperty('--dx',(Math.random()*240-120).toFixed(0)+'px');c.style.setProperty('--dy',(Math.random()*-160-40).toFixed(0)+'px');c.style.animationDelay=(i*25)+'ms';c.innerHTML=GL.coin;b.appendChild(c);setTimeout(()=>c.remove(),1300)}AU.sfx('cash')}else AU.sfx('pop')}
 // ---------- audio unlock ----------
 function unlockAudio(){if(AU.unlocked&&AU.running)return;AU.unlock();const s=cur();if(s.clip&&playing&&!hold)setTimeout(()=>{if(AU.unlocked&&playing)AU.start(s.clip,s.t||0)},30);
  if(st.want){$('soundPill').classList.remove('show')}}
 document.addEventListener('touchend',()=>{if(!AU.running)unlockAudio()},{passive:true});
 $('soundPill').onclick=e=>{e.stopPropagation();st.want=true;save();AU.setWant(true);unlockAudio();$('soundPill').classList.remove('show');volFlash(true)};
 function volFlash(on){const d=document.createElement('div');d.className='vol';d.innerHTML=on?GL.vol:GL.mute;$('app').appendChild(d);setTimeout(()=>d.remove(),1000)}
 // ---------- sheets ----------
 let sheetOpen=null;const sheet=$('sheet'),sb=$('sheetBody');
 function openSheet(kind,html,auto){sheetOpen=kind;sb.innerHTML=html;sheet.classList.toggle('auto',!!auto);sheet.classList.add('on');$('backdrop').classList.add('on');sheet.style.transform=''}
 function closeSheet(){if(!sheetOpen)return;sheetOpen=null;sheet.classList.remove('on');$('backdrop').classList.remove('on');sheet.style.transform='';const a=document.activeElement;if(a&&a.blur)a.blur()}
 $('backdrop').addEventListener('pointerdown',e=>{e.preventDefault();closeSheet()});
 // drag the sheet down to close
 (()=>{let y0=null,dy=0;sheet.addEventListener('pointerdown',e=>{if(!e.target.closest('.grab,.sh-title,.prof .ph'))return;y0=e.clientY;dy=0;sheet.style.transition='none';try{sheet.setPointerCapture(e.pointerId)}catch(er){}});
  sheet.addEventListener('pointermove',e=>{if(y0==null)return;dy=Math.max(0,e.clientY-y0);sheet.style.transform=`translateY(${dy}px)`});
  const end=()=>{if(y0==null)return;y0=null;sheet.style.transition='';if(dy>90)closeSheet();else sheet.style.transform='';};sheet.addEventListener('pointerup',end);sheet.addEventListener('pointercancel',end)})();
 function commentsFor(c){const r=rngS(c.id.split('').reduce((a,ch)=>a*31+ch.charCodeAt(0),7));const pc=POOL[c.cat]||POOL.all;const out=[];
  (c.com||[]).forEach(x=>out.push(x));const used=new Set();while(out.length<10){const src=r()<.6?pc:POOL.all;const k=Math.floor(r()*src.length);const key=(src===pc?'c':'a')+k;if(used.has(key))continue;used.add(key);out.push(src[k])}
  return out.map((x,i)=>({by:x[0],t:[x[1],x[2]],lk:Math.round(Math.pow(r(),2)*c.likes*.03)+3,ago:[['2h','2時間前'],['5h','5時間前'],['1d','1日前'],['3d','3日前'],['1w','1週間前']][Math.floor(r()*5)],id:c.id+'_'+i}))}
 function cmRow(m,mine){const cr=CREATORS[m.by];const liked=st.cl[m.id];const name=mine?T('you'):cr.h;const av=mine?'<div class="yav">★</div>':avImg(cr.av);
  return `<div class="cm" data-id="${m.id}">${av}<div class="bd"><div class="nm">${esc(name)}<small>${esc(L(m.ago))}</small></div><div class="tx">${esc(L(m.t))}</div><div class="rp">${T('reply')}</div></div><button class="lk ${liked?'on':''}" type="button">${GL.heart}<span>${fmt(m.lk+(liked?1:0))}</span></button></div>`}
 function openComments(c){if(!c)return;const list=commentsFor(c);const mine=(st.mine[c.id]||[]);
  openSheet('cm',`<div class="sh-title">${T('comments')} · ${fmt(c.cm+mine.length)}</div><div class="clist" id="cList">${mine.map(m=>cmRow(m,m.by==='you')).join('')}${list.map(m=>cmRow(m)).join('')}</div>
   <div class="cbar"><div class="emo">${['❤️','😂','🔥','👏','😍','🥺','💰','🫛'].map(e=>`<button type="button">${e}</button>`).join('')}</div><div class="cin">${'<div class="yav" style="width:34px;height:34px;border-radius:50%;flex:none;background:linear-gradient(135deg,#ff4f9a,#ffb36b);display:grid;place-items:center;font-weight:900">★</div>'}<input id="cInp" maxlength="140" enterkeyhint="send" placeholder="${T('addc')}"><button id="cPost" type="button" disabled>${T('post')}</button></div></div>`);
  const inp=$('cInp'),post=$('cPost');inp.oninput=()=>post.disabled=!inp.value.trim();
  sb.querySelectorAll('.emo button').forEach(b=>b.onclick=()=>{inp.value+=b.textContent;post.disabled=false;inp.focus()});
  const send=()=>{const v=inp.value.trim();if(!v)return;const m={by:'you',t:[v,v],lk:0,ago:[T('now'),T('now')],id:c.id+'_u'+Date.now()};(st.mine[c.id]=st.mine[c.id]||[]).unshift(m);save();inp.value='';post.disabled=true;
   $('cList').insertAdjacentHTML('afterbegin',cmRow(m,true));$('cList').scrollTop=0;bindLikes();slots.forEach(fill);AU.sfx('pop');
   setTimeout(()=>{if(sheetOpen!=='cm')return;const cr=CREATORS[c.by];const rep=cr.rep[Math.floor(Math.random()*cr.rep.length)];const rm={by:c.by,t:['@'+T('you')+' '+rep[0],'@'+T('you')+' '+rep[1]],lk:1,ago:[T('now'),T('now')],id:c.id+'_r'+Date.now()};st.mine[c.id].unshift(rm);save();const row=cmRow(rm);const l=$('cList');if(l){l.insertAdjacentHTML('afterbegin',row);bindLikes();AU.sfx('ding')}},1700)};
  post.onclick=send;inp.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();send()}};bindLikes()}
 function bindLikes(){sb.querySelectorAll('.cm .lk').forEach(b=>b.onclick=()=>{const id=b.closest('.cm').dataset.id;st.cl[id]=!st.cl[id];if(!st.cl[id])delete st.cl[id];save();b.classList.toggle('on',!!st.cl[id]);const n=b.querySelector('span');const v=parseInt(n.dataset.b||n.textContent.replace(/[^0-9]/g,''))||0;n.dataset.b=n.dataset.b||(st.cl[id]?v:v-1);n.textContent=fmt(+n.dataset.b+(st.cl[id]?1:0));if(st.cl[id])AU.sfx('pop')})}
 function openShare(c){if(!c)return;const ppl=Object.keys(CREATORS).filter(k=>k!==c.by);
  openSheet('sh',`<div class="sh-title">${T('share')}</div><div class="srow">${ppl.map(k=>`<button class="sp" type="button" data-k="${k}">${avImg(CREATORS[k].av)}<span>${esc(L(CREATORS[k].n))}</span></button>`).join('')}</div>
   <div class="acts"><button class="act" type="button" id="aCopy"><i>${GL.link}</i>${T('copy')}</button><button class="act" type="button" id="aShare"><i>${GL.share}</i>${T('sharevia')}</button><button class="act" type="button" id="aSave"><i>${GL.star}</i>${st.saved[c.id]?T('unsave'):T('save')}</button><button class="act" type="button" id="aNope"><i>${GL.no}</i>${T('nope')}</button></div>`,true);
  sb.querySelectorAll('.sp').forEach(b=>b.onclick=()=>{b.classList.add('sent');AU.sfx('swish');toast(T('sentto',{n:L(CREATORS[b.dataset.k].n)}))});
  const url=location.href.split('#')[0]+'#'+c.id;
  $('aCopy').onclick=()=>{try{navigator.clipboard.writeText(url)}catch(e){}toast(T('copied'));closeSheet()};
  $('aShare').onclick=()=>{if(navigator.share)navigator.share({title:'PincoPop',text:L(c.cap),url}).catch(()=>{});else{try{navigator.clipboard.writeText(url)}catch(e){}toast(T('copied'))}closeSheet()};
  $('aSave').onclick=()=>{closeSheet();toggleSave(cur())};
  $('aNope').onclick=()=>{st.nope[c.id]=1;save();closeSheet();toast(T('nopeT'));lastFlingMs=300;go(1)}}
 function openProfile(by){const cr=CREATORS[by];const mine=CL.map((c,i)=>i).filter(i=>CL[i].by===by&&(CL[i].cat!=='secret'||st.gold));
  openSheet('pf',`<div class="prof"><div class="ph">${avImg(cr.av)}<div class="stats"><div><b>${mine.length}</b><span>${T('posts')}</span></div><div><b>${fmt(cr.f+(st.fol[by]?1:0))}</b><span>${T('followers')}</span></div><div><b>${8+by.length}</b><span>${T('followingN')}</span></div></div></div>
   <div class="pn">${esc(L(cr.n))} ${st.gold?GL.badgeG:GL.badge}</div><div class="pb">@${esc(cr.h)} · ${esc(L(cr.bio))}</div><button class="pfol ${st.fol[by]?'on':''}" type="button" id="pFol">${st.fol[by]?T('following'):T('follow')}</button></div>
   <div class="grid">${mine.map(i=>`<button type="button" data-i="${i}"><canvas width="180" height="320"></canvas><span class="gv">${GL.play}${fmt(CL[i].likes*7+1234)}</span></button>`).join('')}</div>`);
  $('pFol').onclick=()=>{st.fol[by]=!st.fol[by];save();$('pFol').classList.toggle('on',!!st.fol[by]);$('pFol').textContent=st.fol[by]?T('following'):T('follow');slots.forEach(fill);AU.sfx('pop')};
  sb.querySelectorAll('.grid button').forEach(b=>{const i=+b.dataset.i,c=CL[i];const cv=b.querySelector('canvas');
   const paint=()=>{if(c.vid){const im=new Image();im.onload=()=>cv.getContext('2d').drawImage(im,0,0,180,320);im.src='vid/'+c.vid+'.jpg?v='+(window.__BUILD__||'')}else{RD.VID.cur=null;RD.draw(cv.getContext('2d'),c,Math.min(c.dur*.45,4),180,320)}};
   RD.loadClip(c).then(paint);
   b.onclick=()=>{closeSheet();feed.splice(idx+1,0,i);slots.forEach(s=>{if(s.i===idx+1)s.i=-999});ensure();lastFlingMs=320;go(1)}})}
 function openSettings(){const seg=(id,a,b,on)=>`<div class="seg" id="${id}"><button type="button" class="${on?'on':''}">${a}</button><button type="button" class="${on?'':'on'}">${b}</button></div>`;
  openSheet('set',`<div class="sh-title">${T('settings')}</div><div class="opts">
   <div class="orow"><span>${T('lang')}</span>${seg('oLang','English','日本語',st.lang==='en')}</div>
   <div class="orow"><span>${T('snd')}</span>${seg('oSnd',T('on'),T('off'),st.want)}</div>
   <div class="orow"><span>${T('auto')}<small>${T('autoT')}</small></span>${seg('oAuto',T('on'),T('off'),st.auto)}</div>
   <div class="orow"><span>${T('cheat')}</span><div class="chin"><input id="oCheat" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="••••••"><button type="button" id="oCheatGo">${T('apply')}</button></div></div>
   <div class="orow"><a class="olink" href="../"><span>${T('allgames')}</span><span>›</span></a></div>
   <div class="orow"><span></span><button class="obtn" type="button" id="oReset">${T('reset')}</button></div>
   <div class="about">${T('about')}<br>PincoPop ${window.__BUILD__} · LANZAGAMES</div></div>`);
  const bs=id=>[...$(id).querySelectorAll('button')];
  bs('oLang').forEach((b,i)=>b.onclick=()=>{setLang(i?'ja':'en');openSettings()});
  bs('oSnd').forEach((b,i)=>b.onclick=()=>{st.want=!i;save();AU.setWant(st.want);if(st.want)unlockAudio();openSettings()});
  bs('oAuto').forEach((b,i)=>b.onclick=()=>{st.auto=!i;save();openSettings()});
  $('oCheatGo').onclick=()=>{const v=($('oCheat').value||'').trim().toUpperCase();if(v==='AMSABABY'){st.gold=true;save();clearSecs();AU.sfx('cash');toast(T('cheatOk'));buildTabs();slots.forEach(fill);closeSheet()}else{AU.sfx('buzz');toast(T('cheatBad'))}};
  $('oReset').onclick=()=>{st.liked={};st.saved={};st.cl={};st.mine={};st.nope={};save();clearSecs();slots.forEach(fill);toast(T('resetT'))}}
 $('gear').onclick=e=>{e.stopPropagation();unlockAudio();openSettings()};
 // ---------- your collection: Saved / Liked grid ----------
 function colIds(kind){const m=kind==='liked'?st.liked:st.saved;return Object.keys(m).map(id=>[id,+m[id]||0]).sort((a,b)=>b[1]-a[1]).map(x=>CL.findIndex(c=>c.id===x[0])).filter(i=>i>=0&&(CL[i].cat!=='secret'||st.gold))}
 function openMine(kind){kind=kind||col.kind;col.kind=kind;const L=colIds(kind);
  openSheet('mine',`<div class="sh-title mine-t"><button type="button" class="sh-back" id="mBack" aria-label="${T('back')}">${GL.back}</button>${T('mine')}</div>
   <div class="mtabs"><button type="button" data-k="saved" class="${kind==='saved'?'on':''}">${GL.star}<span>${T('savedV')}</span><b>${colIds('saved').length}</b></button><button type="button" data-k="liked" class="${kind==='liked'?'on':''}">${GL.heart}<span>${T('likedV')}</span><b>${colIds('liked').length}</b></button></div>
   ${L.length?`<div class="grid" id="mGrid">${L.map((i,n)=>`<button type="button" data-n="${n}"><canvas width="180" height="320"></canvas><span class="gv">${GL.play}${fmt(CL[i].likes)}</span></button>`).join('')}</div>`:`<div class="mempty">${kind==='liked'?GL.heart:GL.star}<p>${T(kind==='liked'?'noLiked':'noSaved')}</p></div>`}`);
  $('mBack').onclick=e=>{e.stopPropagation();closeSheet()};
  sb.querySelectorAll('.mtabs button').forEach(b=>b.onclick=e=>{e.stopPropagation();AU.sfx('pop');openMine(b.dataset.k)});
  sb.querySelectorAll('#mGrid button').forEach(b=>{const n=+b.dataset.n,c=CL[L[n]];const cv=b.querySelector('canvas');
   const paint=()=>{if(c.vid){const im=new Image();im.onload=()=>cv.getContext('2d').drawImage(im,0,0,180,320);im.src='vid/'+c.vid+'.jpg?v='+(window.__BUILD__||'')}else{RD.VID.cur=null;RD.draw(cv.getContext('2d'),c,Math.min(c.dur*.45,4),180,320)}};
   RD.loadClip(c).then(paint);b.onclick=e=>{e.stopPropagation();closeSheet();enterMine(kind,L,n)}})}
 function enterMine(kind,L,n){if(cat!=='mine'){saveSec();col.prev=cat}stopSlot(cur());AU.stop();cat='mine';col.kind=kind;col.list=L.slice(n).concat(L.slice(0,n));feed=[];idx=0;extend();
  buildTabs();slots.forEach(s=>{s.i=-999});ensure();place(0,false);playing=true;startCur(0)}
 function exitMine(){stopSlot(cur());AU.stop();const c=col.prev||'all';const k=col.kind;cat='__';setCat(c);if(k==='explore')exOpen(true);else openMine(k)}
 $('mineBtn').onclick=e=>{e.stopPropagation();unlockAudio();openMine()};
 // ---------- explore (v1.5) ----------
 const EX={q:'',chip:'',scroll:0,open:false,idx:null,order:null,thumbs:new Map(),queue:[],busy:false,io:null};
 const EXN={pinco:'pinco ピンコ',pooh:'pooh プー',bean:'mr bean bean ミスター・ビーン ビーン',bronny:'bronny ブロニー',asmon:'asmon アスモン',max:'max マックス',mogu:'mogu モグ もぐ',party:'party パーティー',pooping:'mr pooping dad プーピング パパ',prof:'professor prof プーピング教授 教授',bbean:'baby bean ベビービーン 赤ちゃん baby',babies:'baby 赤ちゃん ベビー'};
 const exNorm=s=>String(s||'').normalize('NFKC').toLowerCase().replace(/[#＃]/g,'');
 const EXCHIPS=[['bb','exBB',c=>c.bb||/bbean_|babies_1/.test(JSON.stringify(c.shots))],['parent','parent'],['tokyo','tokyo'],['la','la'],['food','food'],['scone','exScone',null,'scone スコーン'],['lunch','exLunch',c=>/^lu\d/.test(c.id),'lunch ランチ'],['xmas','exXmas',null,'christmas クリスマス holiday ホリデー illumination イルミ light-up lights new year 年越し 大みそか 元日 rose parade'],['yoyogi','exYoyogi',null,'yoyogi 代々木'],['sawtelle','exSawtelle',null,'sawtelle ソーテル'],['comedy','comedy'],['makeup','makeup'],['preg','preg'],['lng','lng'],['couple','couple']];
 function exOk(c){if(!c||c.noFY||c.by==='kaise'||(c.cat==='secret'&&!st.gold))return false;return !/"kaise_\d/.test(JSON.stringify(c.shots))}
 function exLocal(c){const a=c.also||[];return c.cat==='tokyo'||c.cat==='la'||a.includes('tokyo')||a.includes('la')||/^(sc|lu|u)\d/.test(c.id)}
 function exBuild(){if(EX.idx)return;EX.idx=CL.map(c=>{const p=[c.id,c.cat,...(c.also||[]),STR.en[c.cat],STR.ja&&STR.ja[c.cat]];const cr=CREATORS[c.by];if(cr)p.push(cr.h,cr.n[0],cr.n[1],EXN[c.by]||'');
   (c.cap||[]).forEach(x=>p.push(x));(c.snd||[]).forEach(x=>p.push(x));if(c.bb)p.push(EXN.bbean);
   const walk=sh=>{(sh.tx||[]).forEach(t=>{p.push(t[2],t[3])});(sh.a||[]).forEach(a=>{const n=String(a[0]);if(/^(bbean_|babies_1)/.test(n))p.push(EXN.bbean);else if(/^babies_0/.test(n))p.push('baby pinco ベビーピンコ');else{const m=/^(?:c_|w_|xb_)?([a-z]+)/.exec(n);if(m&&EXN[m[1]])p.push(EXN[m[1]])}});(sh.panes||[]).forEach(walk)};
   (c.shots||[]).forEach(walk);return exNorm(p.join(' \n '))});
  const sc=CL.map((c,i)=>{if(!exOk(c))return null;let s=Math.log10((c.likes||1e4)+1);if(c.bb)s+=3;if(c.cat==='parent'||(c.also||[]).includes('parent'))s+=2;if(exLocal(c))s+=1.6;const r=Math.sin(i*12.9898+7.1)*43758.5453;s+=(r-Math.floor(r))*.9;return [i,s]}).filter(Boolean);
  EX.order=sc.sort((a,b)=>b[1]-a[1]).map(x=>x[0])}
 function exChipMatch(i,ch){const c=CL[i];if(!ch)return true;const d=EXCHIPS.find(x=>x[0]===ch);if(!d)return true;if(d[2]&&d[2](c))return true;if(!d[2]&&!d[3]&&(c.cat===ch||(c.also||[]).includes(ch)))return true;if(ch==='food'&&(c.cat==='food'||(c.also||[]).includes('food')))return true;
  if(d[3]){const ks=d[3].split(' ').filter(Boolean);const ix=EX.idx[i];if(ch==='xmas')return ks.some(k=>ix.includes(k));return ks.some(k=>ix.includes(k))}return false}
 function exResults(){exBuild();const toks=exNorm(EX.q).split(/[\s　]+/).filter(Boolean);return EX.order.filter(i=>exChipMatch(i,EX.chip)&&toks.every(t=>EX.idx[i].includes(t)))}
 function exPump(){if(EX.busy||!EX.queue.length||!EX.open)return;EX.busy=true;const [c,imgs]=EX.queue.shift();
  const done=url=>{EX.thumbs.set(c.id,url);imgs.forEach(im=>{im.src=url;im.classList.add('ok')});EX.busy=false;setTimeout(exPump,16)};
  if(EX.thumbs.has(c.id)){done(EX.thumbs.get(c.id));return}
  if(c.vid){done('vid/'+c.vid+'.jpg?v='+(window.__BUILD__||''));return}
  RD.loadClip(c).then(()=>requestAnimationFrame(()=>{const cv=document.createElement('canvas');cv.width=216;cv.height=384;RD.VID.cur=null;try{RD.draw(cv.getContext('2d'),c,Math.min(((c.shots&&c.shots[0]&&c.shots[0].d)||4)*.6,2.6),216,384)}catch(e){}
   cv.toBlob(b=>done(b?URL.createObjectURL(b):cv.toDataURL('image/jpeg',.8)),'image/jpeg',.82)})).catch(()=>{EX.busy=false;setTimeout(exPump,16)})}
 function exWant(btn){const i=+btn.dataset.i,c=CL[i],im=btn.querySelector('img');if(btn.dataset.q)return;btn.dataset.q=1;if(EX.thumbs.has(c.id)){im.src=EX.thumbs.get(c.id);im.classList.add('ok');return}
  const q=EX.queue.find(x=>x[0]===c);if(q)q[1].push(im);else EX.queue.push([c,[im]]);exPump()}
 function exRender(){const L=exResults(),g=$('exGrid'),cnt=$('exCount');EX.list=L;
  if(EX.io)EX.io.disconnect();EX.queue.length=0;
  if(!L.length){g.className='exempty';g.innerHTML=`${GL.search}<p>${T('exNone',{q:EX.q||T(EXCHIPS.find(x=>x[0]===EX.chip)?.[1]||'explore')})}</p><button type="button" id="exClear">${T('exClear')}</button>`;$('exClear').onclick=e=>{e.stopPropagation();EX.q='';EX.chip='';$('exQ').value='';exChips();exRender()};cnt.textContent='';return}
  g.className='exgrid';let tall=0;
  g.innerHTML=L.map((i,n)=>{const c=CL[i];const t=(n%10===2||n%10===5)?(tall++%2?' t l':' t r'):'';return `<button type="button" class="ext${t}" data-i="${i}" data-n="${n}" aria-label="${(c.cap?c.cap[st.lang==='ja'?1:0]:c.id).replace(/"/g,'&quot;').slice(0,80)}"><img alt="" decoding="async"><span class="gv">${GL.play}${fmt(c.likes)}</span>${c.bb?'<i class="exbb">🫛</i>':''}</button>`}).join('');
  cnt.textContent=T(L.length===1?'exCount1':'exCount',{n:L.length});
  EX.io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)exWant(e.target)}),{root:g,rootMargin:'400px 0px'});
  g.querySelectorAll('.ext').forEach(b=>{EX.io.observe(b);b.onclick=e=>{e.stopPropagation();if(g.__drag)return;const n=+b.dataset.n;EX.scroll=g.scrollTop;exClose(true);enterMine('explore',EX.list,n)}})}
 function exChips(){$('exChips').innerHTML=`<button type="button" data-c="" class="${EX.chip?'':'on'}">${T('exAll')}</button>`+EXCHIPS.map(d=>`<button type="button" data-c="${d[0]}" class="${EX.chip===d[0]?'on':''}">${T(d[1])}</button>`).join('');
  $('exChips').querySelectorAll('button').forEach(b=>b.onclick=e=>{e.stopPropagation();AU.sfx('pop');EX.chip=b.dataset.c;exChips();exRender();$('exGrid').scrollTop=0;b.scrollIntoView({inline:'center',block:'nearest',behavior:'smooth'})})}
 function exOpen(restore){const ov=$('explore');EX.open=true;if(!restore){EX.scroll=0}
  stopSlot(cur());AU.stop();setPlaying(false,false);
  ov.innerHTML=`<div class="exhead"><button type="button" class="exback" id="exBack" aria-label="${T('back')}">${GL.back}</button><label class="exsearch">${GL.search}<input id="exQ" type="search" enterkeyhint="search" autocomplete="off" placeholder="${T('exPh')}"><button type="button" id="exX" aria-label="${T('exClear')}">×</button></label></div><div class="exchips" id="exChips"></div><div class="excount" id="exCount"></div><div id="exGrid"></div>`;
  ov.classList.add('on');$('top').classList.add('exhide');
  const q=$('exQ');q.value=EX.q;let deb=0;q.oninput=()=>{clearTimeout(deb);deb=setTimeout(()=>{EX.q=q.value;exRender();$('exGrid').scrollTop=0},140)};
  q.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();q.blur()}};
  $('exX').onclick=e=>{e.stopPropagation();EX.q='';q.value='';exRender()};
  $('exBack').onclick=e=>{e.stopPropagation();exClose(false)};
  exChips();exRender();const g=$('exGrid');g.scrollTop=EX.scroll;
  let y0=0;g.addEventListener('pointerdown',e=>{y0=e.clientY;g.__drag=false},{passive:true});g.addEventListener('pointermove',e=>{if(Math.abs(e.clientY-y0)>8)g.__drag=true},{passive:true});
  g.addEventListener('scroll',()=>{if(document.activeElement===q)q.blur()},{passive:true})}
 function exClose(toFeed){const ov=$('explore');EX.open=false;if(EX.io)EX.io.disconnect();EX.queue.length=0;ov.classList.remove('on');$('top').classList.remove('exhide');ov.innerHTML='';
  if(!toFeed){setPlaying(true,false);startCur(cur().t||0)}}
 $('exploreBtn').onclick=e=>{e.stopPropagation();unlockAudio();closeSheet();exOpen(false)};
 // ---------- tabs / language ----------
 const CATS=['all','tokyo','la','food','comedy','parent','makeup','preg','lng','couple'];
 function buildTabs(){if(cat==='mine'){$('tabs').innerHTML=`<button class="tab on mineb" type="button" data-c="__back">${GL.back}<span>${T(col.kind==='liked'?'likedV':col.kind==='explore'?'explore':'savedV')}</span></button><i id="tabInd"></i>`;$('tabs').querySelector('.tab').onclick=e=>{e.stopPropagation();if(hzAnim||ptr)return;exitMine()};requestAnimationFrame(()=>placeInd(cat,cat,0,false));return}
  const cs=st.gold?CATS.concat('secret'):CATS;$('tabs').innerHTML=cs.map(k=>`<button class="tab ${k===cat?'on':''} ${k==='secret'?'gold':''}" type="button" role="tab" data-c="${k}">${T(k==='all'?'foryou':k)}</button>`).join('')+'<i id="tabInd"></i>';
  $('tabs').querySelectorAll('.tab').forEach(b=>b.onclick=e=>{e.stopPropagation();if(hzAnim||ptr)return;unlockAudio();setCat(b.dataset.c)});requestAnimationFrame(()=>placeInd(cat,cat,0,false))}
 function tabCenter(c){const b=c==='mine'?$('tabs').querySelector('.tab'):$('tabs').querySelector('.tab[data-c="'+c+'"]');return b?b.offsetLeft+b.offsetWidth/2:0}
 function placeInd(a,b,p,anim){const el=$('tabInd');if(!el)return;const x=tabCenter(a)+(tabCenter(b)-tabCenter(a))*p;el.style.transition=anim?'transform '+anim+'ms cubic-bezier(.22,.8,.3,1)':'none';el.style.transform='translate3d('+(x-9).toFixed(1)+'px,0,0)'}
 // ---------- sections: each tab keeps its own feed + position ----------
 const secs={};
 function saveSec(){secs[cat]={feed,idx,t:cur().t||0}}
 function clearSecs(){for(const k in secs)delete secs[k]}
 function secFor(c){if(c===cat)return {feed,idx,t:cur().t||0};if(!secs[c]){const sc=cat,sf=feed;cat=c;feed=[];extend();secs[c]={feed,idx:0,t:0};cat=sc;feed=sf}return secs[c]}
 function setCat(c){let at=0;if(c===cat){lastFlingMs=300;if(idx>0){stopSlot(cur());idx=0;feed=[];}else return;stopSlot(cur());AU.stop();feed=[];idx=0;extend()}
  else{saveSec();stopSlot(cur());AU.stop();cat=c;const sc=secs[c];if(sc){feed=sc.feed;idx=sc.idx;at=sc.t||0}else{feed=[];idx=0;extend()}}
  buildTabs();slots.forEach(s=>{s.i=-999});ensure();place(0,false);playing=true;startCur(at);if(cur().clip&&at>=cur().clip.dur)startCur(0);
  const t=$('tabs').querySelector('.tab.on');if(t&&t.scrollIntoView)t.scrollIntoView({inline:'center',block:'nearest',behavior:'smooth'})}
 function setLang(l){st.lang=l;save();RD.lang=l;document.documentElement.lang=l;buildTabs();applyStatic();slots.forEach(s=>{fill(s);s.drawnAt=-1})}
 function applyStatic(){$('home').innerHTML=GL.home;$('gear').innerHTML=GL.gear;$('mineBtn').innerHTML=GL.me;$('exploreBtn').innerHTML=GL.search;$('exploreBtn').setAttribute('aria-label',T('explore'));$('mineBtn').setAttribute('aria-label',T('mine'));$('home').setAttribute('aria-label',T('allgames'));$('gear').setAttribute('aria-label',T('settings'));$('soundPill').innerHTML=GL.mute+'<span>'+T('sound')+'</span>'}
 let toastT=0;function toast(m){const t=$('toast');t.textContent=m;t.classList.add('on');clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove('on'),2200)}
 let hintEl=null;function hideHint(){if(hintEl){hintEl.remove();hintEl=null}}
 // ---------- boot ----------
 function boot(){applyStatic();buildTabs();document.documentElement.lang=st.lang;
  const hash=location.hash.slice(1);extend();if(hash&&byId[hash]!=null){feed.unshift(byId[hash])}
  ensure();resize();
  const first=CL[feed[0]];const go0=()=>{$('splash').classList.add('off');setTimeout(()=>$('splash').remove(),600);startCur(0);
   if(!AU.unlocked||!st.want)$('soundPill').classList.add('show');
   if(!st.seen){hintEl=document.createElement('div');hintEl.className='swipehint';hintEl.innerHTML=GL.up+'<span>'+T('swipe')+'</span>';$('app').appendChild(hintEl);setTimeout(hideHint,4600)}};
  Promise.race([RD.loadClip(first),new Promise(r=>setTimeout(r,2500))]).then(()=>setTimeout(go0,350));
  requestAnimationFrame(frame)}
 addEventListener('resize',()=>{clearTimeout(window.__rz);window.__rz=setTimeout(resize,120)});
 document.addEventListener('visibilitychange',()=>{if(document.hidden){AU.stop();const s=cur();if(s.clip&&s.clip.vid)s.vd.pause()}else if(playing&&!hold)setPlaying(true,false)});
 boot();
 return {T,get st(){return st},get idx(){return idx},get feed(){return feed},get cat(){return cat},get secs(){return secs},go,cur,setCat,setLang,openComments,openShare,openProfile,openSettings,closeSheet,CL}
})();
