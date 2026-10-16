// ===== Pinco Pretty Princess — main =====
const BUILD=window.__BUILD__;
const cv=document.getElementById('c'),X=cv.getContext('2d');let W=0,H=0,DPR=1;
function fit(){DPR=Math.min(2,devicePixelRatio||1);W=innerWidth;H=innerHeight;cv.width=W*DPR;cv.height=H*DPR;cv.style.width=W+'px';cv.style.height=H+'px';}
addEventListener('resize',fit);fit();
const $=id=>document.getElementById(id);
const IT={};ITEMS.forEach(i=>IT[i.id]=i);
const SAFE_T=()=>parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--sat'))||0;
// ---------- save ----------
const SK='pinco_save_v1';let S;
function defSave(){const owned={};ITEMS.forEach(i=>{if(!i.p)owned[i.id]=1;});return{coins:30,owned,closet:[],mute:0,rounds:0,best:0,lastTheme:-1};}
try{S=Object.assign(defSave(),JSON.parse(localStorage.getItem(SK)||'{}'));}catch(e){S=defSave();}
ITEMS.forEach(i=>{if(!i.p)S.owned[i.id]=1;});
function save(){try{localStorage.setItem(SK,JSON.stringify(S));}catch(e){try{S.closet=S.closet.slice(-8);localStorage.setItem(SK,JSON.stringify(S));}catch(_){}}}
// ---------- art ----------
const PIN=new Image();PIN.src='art/pinco.png';
const SHEETS={};CATS.forEach(([c])=>{const im=new Image();im.onload=()=>{SHEETS[c]=im;THUMBS={};if(UI.cat)renderItems();};im.onerror=()=>{};im.src='art/items_'+c+'.png';});
// sprite-sheet cell: 4 columns, square cells, index = order of the item within its category
function sheetCell(it){const sh=SHEETS[it.c];if(!sh)return null;const list=ITEMS.filter(i=>i.c===it.c),i=list.indexOf(it),cs=sh.width/4;return{im:sh,sx:(i%4)*cs,sy:Math.floor(i/4)*cs,cs};}
const tintCv=document.createElement('canvas'),tintX=tintCv.getContext('2d');
function drawSheetItem(x,it,c){const cell=sheetCell(it);if(!cell)return false;const [bx,by,bw,bh]=BOX[it.c];const s=Math.min(bw,bh);const dx=bx+(bw-s)/2,dy=by+(bh-s)/2;
 if(c&&c!==it.col){tintCv.width=tintCv.height=256;tintX.clearRect(0,0,256,256);tintX.globalCompositeOperation='source-over';tintX.drawImage(cell.im,cell.sx,cell.sy,cell.cs,cell.cs,0,0,256,256);tintX.globalCompositeOperation='multiply';tintX.fillStyle=c;tintX.fillRect(0,0,256,256);tintX.globalCompositeOperation='destination-in';tintX.drawImage(cell.im,cell.sx,cell.sy,cell.cs,cell.cs,0,0,256,256);x.drawImage(tintCv,dx,dy,s,s);}
 else x.drawImage(cell.im,cell.sx,cell.sy,cell.cs,cell.cs,dx,dy,s,s);return true;}
// ---------- outfit ----------
let O=newOutfit();function newOutfit(){return{top:null,bot:null,shoe:null,hat:null,acc:null,bow:null,wand:null,bg:null,tint:{},stamps:[]};}
const col=(o,id)=>(o.tint&&o.tint[id])||IT[id].col;
// ---------- Pinco renderer (unit space) ----------
function drawLegs(x,ph){const sw=Math.sin(ph||0);for(const s of[0,1]){x.save();const hx=s?246:150,hy=530;x.translate(hx,hy);x.rotate((s?-1:1)*sw*.09);x.translate(-hx,-hy);
 const fx=legX(s,900),p=new Path2D();p.moveTo(hx-20,hy);p.quadraticCurveTo(hx-22+(fx-hx)*.5,720,fx-16,890);p.lineTo(fx+16,890);p.quadraticCurveTo(hx+22+(fx-hx)*.5,720,hx+20,hy);p.closePath();
 const g=x.createLinearGradient(hx-24,0,hx+24,0);g.addColorStop(0,'#c86f8c');g.addColorStop(.45,'#f2a3bb');g.addColorStop(1,'#bd6683');x.fillStyle=g;x.fill(p);x.strokeStyle='rgba(120,70,80,.35)';x.lineWidth=3;x.stroke(p);
 x.fillStyle='rgba(255,255,255,.12)';for(let yy=560;yy<880;yy+=18){x.fillRect(hx-6+(fx-hx)*((yy-530)/360),yy,3,8);}
 const f=new Path2D();f.ellipse(fx+(s?8:-8),900,30,16,0,0,7);x.fillStyle=rg(x,fx,895,32,'#ee9db6');x.fill(f);x.stroke(f);x.restore();}}
function itemDraw(x,id,o,extra){const it=IT[id];const c=col(o,id);if(drawSheetItem(x,it,c))return null;
 switch(it.c){case'top':return drawTop(x,it,c);case'bot':return drawBot(x,it,c);case'shoe':return drawShoe(x,it,c);case'hat':return drawHat(x,it,c);case'acc':return drawAcc(x,it,c,extra);case'bow':return drawBow(x,it,c);case'wand':return drawWand(x,it,c);}}
const STAMPS={star:(x,s)=>x.fill(starP(s.x,s.y,16)),heart:(x,s)=>x.fill(heartP(s.x,s.y,15)),dot:(x,s)=>x.fill(circP(s.x,s.y,10))};
function stampClip(o){if(o.top&&!SHEETS.top)return TOPSHAPE[IT[o.top].shape]();return TORSO();}
function drawPinco(x,o,opt){opt=opt||{};
 if(o.acc==='cape')drawAcc(x,IT.cape,col(o,'cape'),true);
 if(o.acc==='wings'&&!SHEETS.acc)drawWings(x,col(o,'wings'));
 drawLegs(x,opt.ph);
 if(PIN.complete&&PIN.naturalWidth)x.drawImage(PIN,0,0,466,560);
 if(o.bot)itemDraw(x,o.bot,o);
 if(o.shoe)itemDraw(x,o.shoe,o);
 if(o.top)itemDraw(x,o.top,o);
 if(o.stamps.length){x.save();x.clip(stampClip(o));for(const s of o.stamps){x.fillStyle=s.c;x.strokeStyle='rgba(0,0,0,.25)';STAMPS[s.t](x,s);}x.restore();}
 if(o.acc&&o.acc!=='wings')itemDraw(x,o.acc,o,false);
 if(o.bow)itemDraw(x,o.bow,o);
 if(o.hat)itemDraw(x,o.hat,o);
 if(o.wand)itemDraw(x,o.wand,o);}
function bgDraw(x,o,w,h,t){const id=o.bg;if(!id)return drawBG(x,'studio',w,h,'#ff7eb6',t);const it=IT[id];const cell=sheetCell(it);if(cell){x.drawImage(cell.im,cell.sx,cell.sy,cell.cs,cell.cs,0,0,w,h);return;}drawBG(x,it.k,w,h,col(o,id),t);}
// fit Pinco (unit bounds −40..490 × −200..930) into a rect; returns transform
function place(rx,ry,rw,rh,k){const s=Math.min(rw/530,rh/1100)*(k||1);return{s,ox:rx+rw/2-225*s,oy:ry+rh-935*s};}
// ---------- audio ----------
let AC=null,MG=null,SG=null;function audio(){if(AC)return;try{AC=new (window.AudioContext||window.webkitAudioContext)();MG=AC.createGain();SG=AC.createGain();MG.gain.value=S.mute?0:.42;SG.gain.value=S.mute?0:.7;const comp=AC.createDynamicsCompressor();MG.connect(comp);SG.connect(comp);comp.connect(AC.destination);}catch(e){}}
function nz(){const b=AC.createBuffer(1,AC.sampleRate*.3,AC.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;return b;}let NZ=null;
function tone(f,t,d,type,v,dest,glide){if(!AC)return;const o=AC.createOscillator(),g=AC.createGain();o.type=type||'sine';o.frequency.setValueAtTime(f,t);if(glide)o.frequency.exponentialRampToValueAtTime(glide,t+d);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.008);g.gain.exponentialRampToValueAtTime(.0008,t+d);o.connect(g);g.connect(dest||SG);o.start(t);o.stop(t+d+.05);}
function noise(t,d,v,fq,dest,type){if(!AC)return;NZ=NZ||nz();const s=AC.createBufferSource();s.buffer=NZ;const f=AC.createBiquadFilter();f.type=type||'bandpass';f.frequency.value=fq;f.Q.value=1.2;const g=AC.createGain();g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+d);s.connect(f);f.connect(g);g.connect(dest||SG);s.start(t);s.stop(t+d+.02);}
const mf=n=>440*Math.pow(2,(n-69)/12);
const SFX={tap(){if(!AC)return;tone(1200,AC.currentTime,.06,'triangle',.18);},
 equip(){if(!AC)return;const t=AC.currentTime;tone(880,t,.09,'triangle',.22);tone(1320,t+.06,.14,'triangle',.2);noise(t,.08,.08,6000);},
 sparkle(){if(!AC)return;const t=AC.currentTime;[1568,2093,2637,3136].forEach((f,i)=>tone(f,t+i*.045,.18,'sine',.12));},
 stamp(){if(!AC)return;const t=AC.currentTime;tone(660,t,.08,'square',.06,null,1320);noise(t,.05,.12,3000);},
 judge(i){if(!AC)return;const t=AC.currentTime;tone(mf(76+[0,2,4,7,9,12][i%6]),t,.35,'triangle',.25);tone(mf(88+[0,2,4,7,9,12][i%6]),t,.25,'sine',.1);},
 boo(){if(!AC)return;tone(300,AC.currentTime,.25,'sawtooth',.06,null,200);},
 fan(){if(!AC)return;const t=AC.currentTime;[72,76,79,84].forEach((n,i)=>{tone(mf(n),t+i*.1,.4,'triangle',.22);tone(mf(n-12),t+i*.1,.4,'square',.05);});noise(t+.4,.6,.15,8000,null,'highpass');},
 flash(){if(!AC)return;const t=AC.currentTime;noise(t,.07,.25,5000,null,'highpass');tone(2600,t,.05,'square',.03);},
 buy(){if(!AC)return;const t=AC.currentTime;[84,88,91].forEach((n,i)=>tone(mf(n),t+i*.07,.2,'square',.08));},
 bad(){if(!AC)return;tone(220,AC.currentTime,.18,'square',.08,null,160);},
 tick(){if(!AC)return;tone(1800,AC.currentTime,.04,'square',.05);}};
// music: 16-step patterns, chords per bar
const SONGS={
 dress:{bpm:116,ch:[[60,64,67],[55,59,62],[57,60,64],[53,57,60]],
  mel:[76,0,79,0,81,79,76,0,74,0,76,79,0,76,74,72, 74,0,76,0,79,76,74,0,71,0,74,76,0,74,71,67, 72,0,76,0,79,81,79,0,76,0,72,74,0,76,0,0, 77,0,76,0,74,72,74,0,76,0,79,0,84,0,0,0],
  bass:[1,0,0,1,0,0,2,0,1,0,0,1,0,2,0,1],kick:[1,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0],clap:[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,1],hat:[0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,1]},
 run:{bpm:124,ch:[[57,60,64],[53,57,60],[60,64,67],[55,59,62]],
  mel:[81,0,84,0,81,0,79,76,0,76,79,0,81,0,0,0, 77,0,81,0,77,0,76,72,0,72,74,0,76,0,0,0, 79,0,84,0,88,0,86,84,0,79,0,81,0,84,0,0, 83,0,86,0,83,0,79,0,74,0,79,0,83,0,86,0],
  bass:[1,0,2,0,1,0,2,0,1,0,2,0,1,2,1,2],kick:[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],clap:[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],hat:[0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0],arp:1}};
let song=null,step=0,nextT=0;function playSong(k){audio();if(!AC)return;if(song===SONGS[k])return;song=SONGS[k];step=0;nextT=AC.currentTime+.08;}
function stopSong(){song=null;}
function musicTick(){if(!AC||!song)return;const sp=60/song.bpm/4;while(nextT<AC.currentTime+.15){const t=nextT,i=step%16,bar=Math.floor(step/16)%4,ch=song.ch[bar];
  if(song.kick[i]){tone(140,t,.18,'sine',.55,MG,45);}
  if(song.clap[i]){noise(t,.12,.35,1500,MG);noise(t+.012,.1,.25,1800,MG);}
  if(song.hat[i])noise(t,.035,.12,9000,MG,'highpass');
  const b=song.bass[i];if(b)tone(mf(ch[0]-24+(b===2?12:0)),t,sp*1.6,'square',.13,MG);
  if(b)tone(mf(ch[0]-24+(b===2?12:0)),t,sp*1.6,'sine',.2,MG);
  const m=song.mel[(step%64)];if(m){tone(mf(m),t,.42,'triangle',.16,MG);tone(mf(m+12),t,.22,'sine',.06,MG);}
  if(i%4===2){ch.forEach(n=>tone(mf(n+12),t,.12,'sine',.035,MG));}
  if(song.arp&&i%2===1)tone(mf(ch[(i>>1)%3]+24),t,.1,'square',.03,MG);
  nextT+=sp;step++;}}
function setMute(m){S.mute=m?1:0;save();if(MG){MG.gain.value=m?0:.42;SG.gain.value=m?0:.7;}document.querySelectorAll('.mute').forEach(b=>b.textContent=m?'🔇':'🔊');}
const buzz=n=>{try{navigator.vibrate&&navigator.vibrate(n||8)}catch(e){}};
// ---------- particles ----------
let P=[];function burst(x,y,n,cols,sp){for(let i=0;i<n;i++){const a=Math.random()*6.28,v=(sp||120)*(.3+Math.random());P.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-40,life:.6+Math.random()*.7,t:0,c:cols[i%cols.length],r:3+Math.random()*5,st:Math.random()<.5});}}
function updP(dt){for(const p of P){p.t+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=120*dt;p.vx*=.98;}P=P.filter(p=>p.t<p.life);}
function drawP(x){for(const p of P){x.globalAlpha=Math.max(0,1-p.t/p.life);x.fillStyle=p.c;if(p.st)x.fill(starP(p.x,p.y,p.r*1.4));else x.fill(circP(p.x,p.y,p.r*.7));}x.globalAlpha=1;}
// ---------- game flow ----------
let scene='title',st=0,theme=THEMES[0],timeLeft=90,RUN=null,RESULT=null,last=performance.now();
const UI={cat:'top',stamp:false,stampT:'star',sw:SW[0][0]};
function show(id){document.querySelectorAll('.scr').forEach(e=>e.classList.toggle('on',e.id===id));}
function toast(t,ms){const d=$('toast');d.textContent=t;d.classList.remove('on');void d.offsetWidth;d.classList.add('on');clearTimeout(toast.h);toast.h=setTimeout(()=>d.classList.remove('on'),ms||1700);}
function setCoins(){document.querySelectorAll('.coins').forEach(e=>e.textContent=S.coins);}
function goTitle(){scene='title';st=0;show('s-title');playSong('dress');setCoins();$('t-best').textContent=S.rounds?('Rounds: '+S.rounds+' · Best: '+S.best+'★'):'';}
function pickTheme(){let i;do{i=Math.floor(Math.random()*THEMES.length);}while(i===S.lastTheme&&THEMES.length>1);S.lastTheme=i;save();return THEMES[i];}
function goTheme(){audio();theme=pickTheme();scene='theme';st=0;show('s-theme');$('th-e').textContent=theme.e;$('th-n').textContent=theme.n;$('th-h').textContent=theme.hint;
 $('th-p').innerHTML=theme.p.map(c=>'<i style="background:'+c+'"></i>').join('');SFX.sparkle();buzz(12);}
function goDress(){scene='dress';st=0;timeLeft=90;O=newOutfit();show('s-dress');$('d-theme').textContent=theme.e+' '+theme.n;UI.cat='top';UI.stamp=false;renderTabs();renderItems();renderTools();playSong('dress');setCoins();}
function goRunway(){if(scene!=='dress')return;scene='runway';st=0;show('s-run');playSong('run');P=[];RESULT=score(O,theme);SFX.fan();buzz(20);}
function goJudge(){scene='judge';st=0;show('s-judge');}
function goScore(){scene='score';show('s-score');const R=RESULT;const tot=R.stars.reduce((a,b)=>a+b,0);
 $('sc-stars').innerHTML='★'.repeat(Math.round(tot/3))+'<span>'+'★'.repeat(5-Math.round(tot/3))+'</span>';$('sc-tot').textContent=tot+' / 15 stars';$('sc-coin').textContent='+'+R.coins;
 if(!R.paid){R.paid=1;S.coins+=R.coins;S.rounds++;S.best=Math.max(S.best,tot);const th=lookThumb(O,240,320);S.closet.push({o:JSON.parse(JSON.stringify(O)),th,theme:theme.n,stars:tot,d:Date.now()});if(S.closet.length>24)S.closet.shift();save();}
 setCoins();const afford=ITEMS.filter(i=>!S.owned[i.id]&&i.p<=S.coins).length;const nx=ITEMS.filter(i=>!S.owned[i.id]).sort((a,b)=>a.p-b.p)[0];$('sc-unl').textContent=afford?('🛍️ '+afford+' locked item'+(afford>1?'s are':' is')+' now in your price range — tap 🔒 items to unlock!'):nx?('Next unlock: '+nx.n+' for '+nx.p+' coins'):'You own every item! 👑';
 $('sc-tip').textContent=R.tip;SFX.fan();}
// ---------- scoring ----------
function hexd(a,b){const p=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];const A=p(a),B=p(b);return Math.hypot(A[0]-B[0],A[1]-B[1],A[2]-B[2]);}
function score(o,t){const worn=CATS.map(c=>o[c[0]]).filter(Boolean);let match=0;
 for(const id of worn){const it=IT[id];const w=it.c==='bg'?2:1;if(it.tags.includes(t.id))match+=w;else if(it.tags.includes('sparkle')&&['royal','pop','space'].includes(t.id))match+=.5*w;}
 const themeS=Math.min(1,match/6);
 const cl=worn.filter(id=>IT[id].c!=='bg');let cs=0;for(const id of cl){const d=Math.min(...t.p.map(p=>hexd(col(o,id),p)));cs+=d<70?1:d<130?.5:0;}
 const colorS=cl.length?cs/cl.length*Math.min(1,cl.length/4):0;
 const tinted=cl.filter(id=>o.tint[id]&&o.tint[id]!==IT[id].col).length;
 const creS=.45*(worn.length/8)+.35*Math.min(1,o.stamps.length/8)+.2*(cl.length?tinted/cl.length:0);
 const raw=[themeS*.8+creS*.2,colorS*.7+themeS*.3,creS*.7+colorS*.3];
 const stars=raw.map(v=>Math.max(1,Math.min(5,Math.round(.6+v*4.6+(Math.random()-.5)*.5))));
 const tot=stars[0]+stars[1]+stars[2];const coins=5+tot*2+(tot>=13?10:0);
 const low=Math.min(themeS,colorS,creS);const tip=low===themeS?'Tip: pick items that match "'+t.n+'" — the Places tab counts double!':low===colorS?'Tip: tint your items with the theme colours shown on the theme card.':'Tip: fill every category and use ✏️ Stamp mode to decorate the dress.';
 const say=[['Off-theme!','Hmm, close-ish','Nice theme!','So on theme!','PERFECT theme!'],['Colours clash!','Colours are OK','Pretty colours!','Gorgeous palette!','Colour QUEEN!'],['Needs more fun!','A bit plain','Creative!','So original!','ICONIC!']].map((a,i)=>a[stars[i]-1]);
 return{stars,coins,tip,say,themeS,colorS,creS};}
// ---------- dress-up UI ----------
let THUMBS={};
function thumb(id){if(THUMBS[id])return THUMBS[id];const it=IT[id],c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d');
 if(it.c==='bg'){const o=newOutfit();o.bg=id;bgDraw(x,o,128,128,0);}
 else{const [bx,by,bw,bh]=BOX[it.c];const s=112/Math.max(bw,bh);x.translate(64-(bx+bw/2)*s,64-(by+bh/2)*s);x.scale(s,s);const o=newOutfit();if(it.c==='acc'&&(it.k==='cape'||it.k==='wings')){o.acc=id;if(it.k==='cape')drawAcc(x,it,it.col,true);else if(!SHEETS.acc)drawWings(x,it.col);}itemDraw(x,id,o,false);}
 return THUMBS[id]=c.toDataURL();}
function renderTabs(){$('tabs').innerHTML=CATS.map(([k,n,e])=>'<button class="tab'+(UI.cat===k?' on':'')+(O[k]?' has':'')+'" data-c="'+k+'"><b>'+e+'</b><span>'+n+'</span></button>').join('');}
function renderItems(){const list=ITEMS.filter(i=>i.c===UI.cat);let h='<button class="card none'+(O[UI.cat]?'':' sel')+'" data-i=""><b>✖</b><span>None</span></button>';
 for(const it of list){const own=S.owned[it.id],m=it.tags.includes(theme.id);h+='<button class="card'+(O[UI.cat]===it.id?' sel':'')+(own?'':' lock')+'" data-i="'+it.id+'"><img src="'+thumb(it.id)+'" alt="">'+(m?'<em>✨</em>':'')+'<span>'+it.n+'</span>'+(own?'':'<u>🔒 '+it.p+'</u>')+'</button>';}
 $('items').innerHTML=h;}
function renderTools(){$('sw').innerHTML=SW.map(([c,n])=>'<button class="swb'+(UI.sw===c?' on':'')+'" data-s="'+c+'" title="'+n+'" style="background:'+c+'"></button>').join('');
 $('stampbar').classList.toggle('on',UI.stamp);$('stampbtn').classList.toggle('on',UI.stamp);document.querySelectorAll('.stp').forEach(b=>b.classList.toggle('on',b.dataset.t===UI.stampT));
 $('hint').textContent=UI.stamp?'Tap the outfit to stamp '+UI.stampT+'s!':(O[UI.cat]?'Tap a colour to tint the '+IT[O[UI.cat]].n:'Pick an item, then tap a colour to tint it');}
function equip(id){const c=UI.cat;if(!id){O[c]=null;SFX.tap();}else{const it=IT[id];
  if(!S.owned[id]){if(S.coins>=it.p){S.coins-=it.p;S.owned[id]=1;save();setCoins();SFX.buy();toast('Unlocked '+it.n+'! −'+it.p+' coins');}else{SFX.bad();toast('Need '+(it.p-S.coins)+' more coins for '+it.n);return;}}
  O[c]=id;SFX.equip();buzz(10);const pr=stageRect(),pl=place(pr.x,pr.y,pr.w,pr.h);const [bx,by,bw,bh]=BOX[c];burst(pl.ox+(bx+bw/2)*pl.s,pl.oy+(by+bh/2)*pl.s,14,['#fff','#ffcc33','#ff7eb6'],140);}
 renderTabs();renderItems();renderTools();}
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;audio();
 if(b.dataset.c){UI.cat=b.dataset.c;SFX.tap();renderTabs();renderItems();renderTools();$('items').scrollLeft=0;return;}
 if(b.dataset.i!==undefined){equip(b.dataset.i);return;}
 if(b.dataset.s){UI.sw=b.dataset.s;if(!UI.stamp){const id=O[UI.cat];if(id){O.tint[id]=UI.sw;SFX.sparkle();buzz(6);}else toast('Pick an item first, then tint it');}else SFX.tap();renderTools();return;}
 if(b.dataset.t){UI.stampT=b.dataset.t;SFX.tap();renderTools();return;}
 const a=b.dataset.a;if(!a)return;
 if(a==='play'){SFX.tap();goTheme();}else if(a==='start'){SFX.sparkle();goDress();}else if(a==='done'){goRunway();}
 else if(a==='stamp'){UI.stamp=!UI.stamp;SFX.tap();renderTools();}else if(a==='clrst'){O.stamps=[];SFX.tap();}
 else if(a==='next'){SFX.tap();goTheme();}else if(a==='home'){SFX.tap();goTitle();}
 else if(a==='photo'){photo(O,theme.n,RESULT?RESULT.stars.reduce((p,q)=>p+q,0):null);}
 else if(a==='closet'){SFX.tap();openCloset();}else if(a==='cclose'){show(scene==='score'?'s-score':'s-title');if(scene!=='score')scene='title';}
 else if(a==='mute'){setMute(!S.mute);}else if(a==='skip'){if(scene==='runway')st=99;else if(scene==='judge')st=99;}
 else if(a==='lookx'){$('look').classList.remove('on');}
});
// stamping on the canvas
const hitX=document.createElement('canvas').getContext('2d');
cv.addEventListener('pointerdown',e=>{audio();if(scene!=='dress')return;const pr=stageRect(),pl=place(pr.x,pr.y,pr.w,pr.h);const ux=(e.clientX-pl.ox)/pl.s,uy=(e.clientY-pl.oy)/pl.s;
 if(!UI.stamp){if(ux>-40&&ux<500&&uy>-200&&uy<940){burst(e.clientX,e.clientY,8,['#fff','#ffcc33'],90);SFX.sparkle();}return;}
 if(!hitX.isPointInPath(stampClip(O),ux,uy)){toast(O.top?'Stamp on the dress!':'Stamp on the body — or pick a dress first');SFX.bad();return;}
 if(O.stamps.length>=60)O.stamps.shift();O.stamps.push({x:ux,y:uy,t:UI.stampT,c:UI.sw});SFX.stamp();buzz(6);burst(e.clientX,e.clientY,6,[UI.sw,'#fff'],70);});
function stageRect(){const top=$('d-top').getBoundingClientRect().bottom,bot=$('d-panel').getBoundingClientRect().top;return{x:0,y:top+4,w:W,h:Math.max(120,bot-top-6)};}
// ---------- closet ----------
function openCloset(){show('s-closet');const L=S.closet.slice().reverse();$('cl-grid').innerHTML=L.length?L.map((l,i)=>'<button class="look" data-l="'+(S.closet.length-1-i)+'"><img src="'+l.th+'"><span>'+l.theme+'</span><em>'+l.stars+'★</em></button>').join(''):'<p class="empty">No looks yet — finish a round and your look is saved here automatically.</p>';}
document.addEventListener('click',e=>{const b=e.target.closest('[data-l]');if(!b)return;const l=S.closet[+b.dataset.l];if(!l)return;SFX.tap();$('look-img').src=lookThumb(l.o,480,640);$('look-t').textContent=l.theme+' · '+l.stars+'★';$('look').classList.add('on');
 $('look-photo').onclick=()=>photo(l.o,l.theme,l.stars);$('look-del').onclick=()=>{S.closet.splice(+b.dataset.l,1);save();$('look').classList.remove('on');openCloset();toast('Look deleted');};});
function lookThumb(o,w,h){const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');bgDraw(x,o,w,h,1);const pl=place(0,h*.02,w,h*.96);x.translate(pl.ox,pl.oy);x.scale(pl.s,pl.s);drawPinco(x,o);return c.toDataURL('image/jpeg',.82);}
function photo(o,tn,stars){const w=1080,h=1440,c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');bgDraw(x,o,w,h,1);x.save();const pl=place(60,90,w-120,h-300);x.translate(pl.ox,pl.oy);x.scale(pl.s,pl.s);drawPinco(x,o);x.restore();
 for(let i=0;i<26;i++)spark(x,(i*397)%w,(i*233)%(h-220),10+(i%4)*6,.8);
 x.fillStyle='rgba(255,255,255,.92)';x.beginPath();x.roundRect?x.roundRect(60,h-200,w-120,150,40):x.rect(60,h-200,w-120,150);x.fill();x.fillStyle='#ff3d8b';x.font='800 64px Fredoka,"Baloo 2",system-ui,sans-serif';x.textAlign='center';x.fillText('Pinco Pretty Princess',w/2,h-120);x.fillStyle='#8e44ec';x.font='700 40px Fredoka,system-ui,sans-serif';x.fillText(tn+(stars!=null?'  ·  '+stars+' / 15 ★':''),w/2,h-70);
 x.lineWidth=24;x.strokeStyle='#fff';x.strokeRect(12,12,w-24,h-24);
 SFX.flash();const fl=$('flash');fl.classList.remove('on');void fl.offsetWidth;fl.classList.add('on');
 c.toBlob(b=>{const name='pinco-'+tn.toLowerCase().replace(/\s+/g,'-')+'.png';const f=new File([b],name,{type:'image/png'});
  if(navigator.canShare&&navigator.canShare({files:[f]})){navigator.share({files:[f],title:'My Pinco look'}).catch(()=>{});}
  else{const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},800);}
  toast('📸 Photo saved!');},'image/png');}
// ---------- judges (code-drawn plushies) ----------
const JUDGES=[{n:'Judge Bunbun',c:'#fffafc',e:'#ff7eb6',k:'bunny',r:'Theme'},{n:'Judge Teddy',c:'#c9925f',e:'#8a5a3c',k:'bear',r:'Colour'},{n:'Judge Mimi',c:'#b39dff',e:'#8e44ec',k:'kitty',r:'Creativity'}];
function drawJudge(x,j,cx,cy,s,t,stars,shown,say){x.save();x.translate(cx,cy);x.scale(s,s);const bob=Math.sin(t*4+cx)*3;x.translate(0,bob);
 x.fillStyle='rgba(0,0,0,.18)';x.beginPath();x.ellipse(0,92,58,12,0,0,7);x.fill();
 // paddle
 if(stars){const up=Math.min(1,shown*3);x.translate(0,-(1-up)*0);x.strokeStyle='#8a5a3c';x.lineWidth=6;x.beginPath();x.moveTo(40,40);x.lineTo(0,-50-up*30);x.stroke();
  const py=-118-up*30;fillP(x,rrP(-58,py,116,70,16),'#fff','#ff7eb6',4);x.fillStyle='#ff3d8b';x.font='800 15px Fredoka,system-ui';x.textAlign='center';x.fillText(j.r.toUpperCase(),0,py+20);
  for(let i=0;i<5;i++){const on=i<Math.min(stars,Math.floor(shown*6));x.fillStyle=on?'#ffcc33':'#eee';x.fill(starP(-40+i*20,py+46,10));x.strokeStyle=on?'#c48a00':'#ccc';x.lineWidth=2;x.stroke(starP(-40+i*20,py+46,10));}}
 const body=new Path2D();body.ellipse(0,52,50,44,0,0,7);fillP(x,body,rg(x,0,50,54,j.c),j.c,4);
 if(j.k==='bunny'){for(const sx of[-1,1]){const e=new Path2D();e.ellipse(sx*20,-58,13,38,sx*.18,0,7);fillP(x,e,rg(x,sx*20,-58,30,j.c),j.c,4);const q=new Path2D();q.ellipse(sx*20,-56,6,26,sx*.18,0,7);x.fillStyle=j.e;x.fill(q);}}
 if(j.k==='bear')for(const sx of[-1,1]){fillP(x,circP(sx*34,-26,16),rg(x,sx*34,-26,16,j.c),j.c,4);x.fillStyle=j.e;x.fill(circP(sx*34,-26,8));}
 if(j.k==='kitty')for(const sx of[-1,1]){const e=new Path2D();e.moveTo(sx*14,-34);e.lineTo(sx*40,-62);e.lineTo(sx*44,-20);e.closePath();fillP(x,e,j.c,j.c,4);}
 const head=circP(0,0,46);fillP(x,head,rg(x,0,0,48,j.c),j.c,4);
 x.fillStyle='#2b2233';const blink=(t*1.3+cx)%4<.12;for(const sx of[-1,1]){if(blink)x.fillRect(sx*16-7,-4,14,3);else{x.fill(circP(sx*16,-4,7));x.fillStyle='#fff';x.fill(circP(sx*16+2,-7,2.5));x.fillStyle='#2b2233';}}
 x.fillStyle='rgba(255,110,160,.45)';x.fill(circP(-28,12,8));x.fill(circP(28,12,8));
 x.strokeStyle='#2b2233';x.lineWidth=3;x.beginPath();x.arc(0,10,8,.2,Math.PI-.2);x.stroke();
 if(j.k==='bear'){x.fillStyle=sh(j.c,.35);x.beginPath();x.ellipse(0,10,16,12,0,0,7);x.fill();x.fillStyle='#2b2233';x.fill(circP(0,5,5));}
 if(j.k==='kitty'){x.strokeStyle='#2b2233';x.lineWidth=2;for(const sx of[-1,1])for(const dy of[-3,4]){x.beginPath();x.moveTo(sx*24,8+dy);x.lineTo(sx*44,6+dy*1.8);x.stroke();}}
 x.restore();
 if(say){x.save();x.font='800 '+Math.round(13*s/.9)+'px Fredoka,system-ui';const tw=x.measureText(say).width+18,bx=cx-tw/2,by=cy+s*104;x.fillStyle='#fff';x.strokeStyle='#ff7eb6';x.lineWidth=3;x.beginPath();x.roundRect?x.roundRect(bx,by,tw,26,13):x.rect(bx,by,tw,26);x.fill();x.stroke();x.fillStyle='#8e44ec';x.textAlign='center';x.fillText(say,cx,by+18);x.restore();}}
// ---------- per-scene drawing ----------
function drawTitle(t){drawBG(X,'bedroom',W,H,'#ff7eb6',t);const top=H*.2,bh=H*.48;const o={top:'gown',bot:null,shoe:'heels',hat:'tiara',acc:'pearls',bow:'classic',wand:'starw',bg:null,tint:{},stamps:[]};
 const pl=place(W*.1,top,W*.8,bh);X.save();X.translate(pl.ox,pl.oy+Math.sin(t*3)*6*pl.s*10);X.translate(225*pl.s,930*pl.s);X.rotate(Math.sin(t*1.6)*.03);X.translate(-225*pl.s,-930*pl.s);X.scale(pl.s,pl.s);drawPinco(X,o);X.restore();
 if(Math.random()<.2)burst(Math.random()*W,top+Math.random()*bh,1,['#fff','#ffcc33','#ff7eb6'],30);}
function drawStage(t){const r=stageRect();bgDraw(X,O,W,H,t);X.save();const pl=place(r.x,r.y,r.w,r.h);X.translate(pl.ox,pl.oy);X.scale(pl.s,pl.s);
 const br=1+Math.sin(t*2.2)*.006;X.translate(225,930);X.scale(br,1/br);X.translate(-225,-930);drawPinco(X,O);X.restore();}
function runway(t,dt){const hz=H*.36;bgDraw(X,O,W,H,t);X.fillStyle='rgba(20,0,40,.35)';X.fillRect(0,0,W,H);
 // carpet
 const g=X.createLinearGradient(0,hz,0,H);g.addColorStop(0,'#ff9fca');g.addColorStop(1,'#ff3d8b');X.fillStyle=g;X.beginPath();X.moveTo(W*.44,hz);X.lineTo(W*.56,hz);X.lineTo(W*1.05,H);X.lineTo(-W*.05,H);X.fill();
 X.fillStyle='rgba(255,255,255,.25)';for(let i=0;i<10;i++){const k=((i/10+t*.25)%1),y=hz+(H-hz)*k*k,ww=W*(.12+.98*k*k);X.fillRect(W/2-ww/2,y,ww,2+k*4);}
 // audience + cameras
 for(let side=0;side<2;side++)for(let i=0;i<6;i++){const k=(i+1)/7,y=hz+(H-hz)*k,x0=side?W*(.62+k*.42):W*(.38-k*.42);const r=8+k*26;X.fillStyle=['#b39dff','#7ee8c6','#ffcc33','#4fd8ff','#ff8a65','#fffafc'][(i+side*2)%6];X.globalAlpha=.85;X.fill(circP(x0,y,r));X.fill(circP(x0-r*.6,y-r*.8,r*.35));X.fill(circP(x0+r*.6,y-r*.8,r*.35));X.globalAlpha=1;
  if(Math.random()<dt*1.2){RUN.fl.push({x:x0,y:y-r*.4,t:0,r:r});}}
 const walkT=Math.min(1,t/5.2),k=1-Math.pow(1-walkT,1.6),pose=t>5.2;
 const s0=place(0,0,W,H*.9).s,s=s0*(.28+.6*k);const fy=hz+(H*.94-hz)*k;const ph=pose?0:t*7.5;const bob=pose?0:Math.abs(Math.sin(ph))*12*s;
 X.save();X.translate(W/2-225*s,fy-930*s-bob);X.translate(225*s,930*s);X.rotate(pose?Math.sin(t*5)*.05:Math.sin(ph)*.035);X.translate(-225*s,-930*s);X.scale(s,s);drawPinco(X,O,{ph});X.restore();
 if(Math.random()<dt*14)burst(W/2+(Math.random()-.5)*W*.5*k,fy-(Math.random()*900*s),2,['#fff','#ffcc33','#ff7eb6','#4fd8ff'],60);
 if(pose&&!RUN.posed){RUN.posed=1;burst(W/2,fy-500*s,50,['#fff','#ffcc33','#ff7eb6','#b39dff'],260);SFX.sparkle();buzz(30);}
 for(const f of RUN.fl){f.t+=dt;X.globalAlpha=Math.max(0,1-f.t*4);X.fillStyle='#fff';X.fill(starP(f.x,f.y,f.r*1.4*(1+f.t*3),f.r*.3));if(f.t===dt){SFX.flash();RUN.white=.35;}}
 X.globalAlpha=1;RUN.fl=RUN.fl.filter(f=>f.t<.3);if(RUN.white>0){X.fillStyle='rgba(255,255,255,'+RUN.white+')';X.fillRect(0,0,W,H);RUN.white-=dt*2;}
 if(pose){X.save();X.textAlign='center';X.font='800 '+Math.round(W*.11)+'px Fredoka,system-ui';X.lineWidth=8;X.strokeStyle='#fff';X.fillStyle='#ff3d8b';const sc=1+Math.sin(t*6)*.04;X.translate(W/2,H*.2);X.scale(sc,sc);X.strokeText('✨ POSE! ✨',0,0);X.fillText('✨ POSE! ✨',0,0);X.restore();}}
function judging(t){bgDraw(X,O,W,H,t);X.fillStyle='rgba(30,0,50,.35)';X.fillRect(0,0,W,H);
 const pl=place(W*.18,H*.06,W*.64,H*.5);X.save();X.translate(pl.ox,pl.oy);X.scale(pl.s,pl.s);drawPinco(X,O);X.restore();
 X.fillStyle='rgba(255,255,255,.9)';X.beginPath();X.roundRect?X.roundRect(10,H*.57,W-20,H*.4,24):X.rect(10,H*.57,W-20,H*.4);X.fill();
 X.textAlign='center';X.fillStyle='#8e44ec';X.font='800 '+Math.round(W*.06)+'px Fredoka,system-ui';X.fillText('The judges say…',W/2,H*.57+W*.08);
 const s=Math.min(W/3/150,H*.3/260);for(let i=0;i<3;i++){const jt=t-.6-i*1.1,shown=Math.max(0,jt);const st=RESULT.stars[i];
  const prev=RUN.jn[i]||0,nowN=Math.min(st,Math.floor(shown*6));if(nowN>prev){for(let q=prev;q<nowN;q++)SFX.judge(q);RUN.jn[i]=nowN;if(nowN===st){burst(W*(i+.5)/3,H*.72,st*4,['#ffcc33','#fff'],120);buzz(10);}}
  drawJudge(X,JUDGES[i],W*(i+.5)/3,H*.78,s,t,jt>0?st:0,shown,jt>1?RESULT.say[i]:null);}}
// ---------- loop ----------
function frame(now){const dt=Math.min(.05,(now-last)/1000);last=now;st+=dt;musicTick();updP(dt);X.setTransform(DPR,0,0,DPR,0,0);
 if(scene==='title'||scene==='theme')drawTitle(st);
 else if(scene==='dress'){timeLeft-=dt;const tl=Math.max(0,Math.ceil(timeLeft));$('d-time').textContent=tl+'s';$('d-bar').style.width=Math.max(0,timeLeft/90*100)+'%';$('d-bar').classList.toggle('low',timeLeft<15);
  if(timeLeft<10&&Math.ceil(timeLeft)!==Math.ceil(timeLeft+dt))SFX.tick();if(timeLeft<=0){toast("⏰ Time's up! To the runway!");goRunway();}drawStage(st);}
 else if(scene==='runway'){if(!RUN||st<dt*1.5)RUN={fl:[],white:0,posed:0,jn:[]};runway(st,dt);if(st>7.4)goJudge();}
 else if(scene==='judge'){judging(st);if(st>5.4){goScore();}}
 else if(scene==='score'||scene==='closet')judging(9);
 drawP(X);requestAnimationFrame(frame);}
requestAnimationFrame(frame);
setMute(S.mute);goTitle();
document.addEventListener('visibilitychange',()=>{if(!AC)return;if(document.hidden)AC.suspend();else AC.resume();});
window.PG={get S(){return S},get O(){return O},set O(v){O=v},get scene(){return scene},goRunway,goTheme,goDress,score,get timeLeft(){return timeLeft},set timeLeft(v){timeLeft=v},IT,ITEMS};
