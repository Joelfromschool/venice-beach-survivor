// ===== v2.0 core: settings, options, i18n hooks, cast art, poses, crowd SFX =====
var ST={on:false},SC3={},RUNI=2;
const OWN=()=>ST.on?S.story.owned:S.owned;
function WALLET(n){if(ST.on)S.story.coins+=n;else S.coins+=n;save();}
// ---- save defaults ----
function defStory(){return{ch:0,stage:'intro',coins:40,owned:{tee:1,shorts:1,sneaks:1,classic:1,bedroom:1},tutServe:0,done:0,retry:0};}
if(S.mv==null)S.mv=.8;if(S.sv==null)S.sv=.9;if(!S.lang)S.lang=(navigator.language||'').startsWith('ja')?'ja':'en';if(S.easy==null)S.easy=0;if(!S.gifts)S.gifts=[];if(!S.story)S.story=defStory();if(S.tutPose==null)S.tutPose=0;
// ---- volume ----
function applyVol(){if(MG){MG.gain.value=S.mute?0:.42*S.mv*1.25;SG.gain.value=S.mute?0:.7*S.sv*1.1;}}
const _audio=audio;audio=function(){_audio();applyVol();};
setMute=function(m){S.mute=m?1:0;save();applyVol();document.querySelectorAll('.mute').forEach(b=>b.textContent=m?'🔇':'🔊');};
// ---- options ----
function openOpts(){$('o-mv').value=Math.round(S.mv*100);$('o-sv').value=Math.round(S.sv*100);syncOpts();$('opts').classList.add('on');SFX.tap();}
function syncOpts(){document.querySelectorAll('[data-lang]').forEach(b=>b.classList.toggle('on',b.dataset.lang===S.lang));$('o-easy').textContent=S.easy?T('o_on'):T('o_off');$('o-easy').classList.toggle('on',!!S.easy);}
$('o-mv').addEventListener('input',e=>{S.mv=e.target.value/100;applyVol();save();});
$('o-sv').addEventListener('input',e=>{S.sv=e.target.value/100;applyVol();save();});
$('o-sv').addEventListener('change',()=>SFX.equip());
function setLang(l){S.lang=l;save();applyLang();syncOpts();THUMBS={};refreshLangUI();}
function refreshLangUI(){if(scene==='title'){$('t-best').textContent=S.rounds?T('best',S.rounds,S.best):'';}if(scene==='dress'){renderTabs();renderItems();renderTools();$('d-theme').textContent=theme.e+' '+THN(theme);}
 if(scene==='bank')openBank();if(scene==='shop')renderShop();if(scene==='smenu')openSMenu();if(document.getElementById('s-closet').classList.contains('on'))openCloset();if(scene==='story'&&DLG)showBeat();}
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
 if(b.dataset.lang){setLang(b.dataset.lang);SFX.tap();return;}
 const a=b.dataset.a;if(!a)return;
 if(a==='opts')openOpts();else if(a==='optsx'){$('opts').classList.remove('on');SFX.tap();}
 else if(a==='easy'){S.easy=S.easy?0:1;save();syncOpts();SFX.tap();}
 else if(a==='reset'){$('rconfirm').classList.add('on');SFX.tap();}else if(a==='rno'){$('rconfirm').classList.remove('on');SFX.tap();}
 else if(a==='ryes'){const keep={mv:S.mv,sv:S.sv,lang:S.lang,mute:S.mute,easy:S.easy};S=Object.assign(defSave(),keep,{gifts:[],story:defStory(),tutPose:0});save();$('rconfirm').classList.remove('on');$('opts').classList.remove('on');PAUSED=false;$('confirm').classList.remove('on');toast(T('o_resetdone'));goTitle();}
});
// ---- pause/leave also covers serving + story ----
askLeave=function(){if(!['dress','runway','judge','serve'].includes(scene)){goTitle();return;}PAUSED=true;$('confirm').classList.add('on');SFX.tap();};
// ---- cast art ----
const CAST={
 pinco:{img:'art/pinco.png',n:'Pinco',nj:'ピンコ',col:'#ff7eb6'},
 party:{img:'art/c_party.png',n:'Polka Pete',nj:'ポルカ・ピート',col:'#4fd8ff',vibe:['pop','sweet'],cols:['#ff3d8b','#4fd8ff','#7ee8c6','#ffcc33']},
 holiday:{img:'art/c_holiday.png',n:'Jolly Jingles',nj:'ジョリー・ジングル',col:'#e23b3b',vibe:['royal','honey'],cols:['#e23b3b','#fffafc','#c48a00']},
 baller:{img:'art/c_baller.png',n:'Slam Dunkle',nj:'スラム・ダンクル',col:'#ffcc33',vibe:['pop','beach'],cols:['#ffcc33','#8e44ec']},
 mole:{img:'art/c_mole.png',n:'Mochi Mole',nj:'もぐもち',col:'#ff9fca',vibe:['sweet','pea'],cols:['#ff7eb6','#d6dbe6']},
 tad:{img:'art/c_tad.png',n:'Madame Smugsworth',nj:'マダム・スマッグ',col:'#a0522d',vibe:['royal','spooky','swamp'],cols:['#ffcc33','#2b2233','#ff9a2e']},
 leaf:{img:'art/c_leaf.png',n:'Sprout',nj:'スプラウト',col:'#8fd14f',vibe:['pea','swamp','sweet'],cols:['#8fd14f','#3fae5a','#e23b3b']},
 bean:{img:'art/j_bean.png?v2',n:'Emo Bean',nj:'エモ・ビーン',col:'#8fd14f'},
 kermit:{img:'art/j_kermit.png?v2',n:'Dark Kermit',nj:'ダーク・カーミット',col:'#2b2233'},
 pooh:{img:'art/j_pooh.png?v2',n:'Pooh',nj:'プーさん',col:'#ffcc33'},
 king:{img:'art/j_king.png',n:'King Pooh',nj:'キング・プー',col:'#c0182f'},
 shadow:{img:'',n:'???',nj:'？？？',col:'#2b2233'}};
for(const k in CAST){if(!CAST[k].img)continue;const i=new Image();i.src=CAST[k].img;CAST[k].im=i;}
const PINO=()=>ST.lastO||(S.story&&S.story.lastO)||newOutfit();
const CN=k=>LANG()==='ja'?CAST[k].nj:CAST[k].n;
function drawCut(x,k,cx,by,h,t,o){o=o||{};const im=CAST[k]&&CAST[k].im;if(!im||!im.naturalWidth)return null;const w=h*im.naturalWidth/im.naturalHeight;
 x.save();x.translate(cx,by);if(o.rot)x.rotate(o.rot);const sq=o.sq||1;x.scale((o.flip?-1:1)/Math.sqrt(sq),sq);if(o.a!=null)x.globalAlpha=o.a;
 if(k==='pinco'){const s=h/940;x.translate(-225*s,-935*s);x.scale(s,s);drawPinco(x,o.outfit||PINO(),o.opt||{});}else x.drawImage(im,-w/2,-h,w,h);x.restore();return{w,h};}
// ---- Pinco body with optional posed arm (2-bone IK, plush tube style) ----
const ARMCUT=(()=>{const p=new Path2D();p.rect(-60,-260,620,1300);const a=new Path2D('M298 196 L470 190 L470 490 L392 490 L330 330 L300 318 Z');p.addPath(a);return p;})();
function ik(sx,sy,tx,ty,l1,l2,bend){let dx=tx-sx,dy=ty-sy,d=Math.hypot(dx,dy);d=Math.min(d,l1+l2-2);const a=Math.atan2(dy,dx),c=Math.acos(Math.max(-1,Math.min(1,(l1*l1+d*d-l2*l2)/(2*l1*d))));const e=a+(bend||1)*c;return[sx+Math.cos(e)*l1,sy+Math.sin(e)*l1,sx+Math.cos(a)*d,sy+Math.sin(a)*d];}
function drawPinBody(x,opt){if(!(PIN.complete&&PIN.naturalWidth))return;
 if(!opt||!opt.arm){x.drawImage(PIN,0,0,466,560);return;}
 x.save();x.clip(ARMCUT,'evenodd');x.drawImage(PIN,0,0,466,560);x.restore();
 const [tx,ty,bend]=opt.arm,[ex,ey,hx,hy]=ik(318,226,tx,ty,128,120,bend);
 const tube=(w,c)=>{x.strokeStyle=c;x.lineWidth=w;x.lineCap='round';x.lineJoin='round';x.beginPath();x.moveTo(318,226);x.lineTo(ex,ey);x.lineTo(hx,hy);x.stroke();};
 tube(50,'rgba(120,60,80,.45)');tube(44,'#d97896');tube(30,'#f2a3bb');tube(10,'rgba(255,255,255,.25)');
 x.fillStyle='#ee9db6';x.strokeStyle='rgba(120,60,80,.45)';x.lineWidth=3;x.beginPath();x.ellipse(hx,hy,27,24,0,0,7);x.fill();x.stroke();}
// ---- crowd + pose SFX ----
SFX.ooh=function(v){if(!AC)return;const t=AC.currentTime;v=v||1;for(let i=0;i<5;i++){const o=AC.createOscillator(),f=AC.createBiquadFilter(),g=AC.createGain();o.type='sawtooth';const base=170+Math.random()*120;o.frequency.setValueAtTime(base,t);o.frequency.linearRampToValueAtTime(base*1.18,t+.25);o.frequency.linearRampToValueAtTime(base*.92,t+.8);
 f.type='bandpass';f.frequency.setValueAtTime(500,t);f.frequency.linearRampToValueAtTime(380,t+.8);f.Q.value=4;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.05*v,t+.15);g.gain.linearRampToValueAtTime(0,t+.9);o.connect(f);f.connect(g);g.connect(SG);o.start(t+i*.02);o.stop(t+1);}};
SFX.clap=function(n,dur){if(!AC)return;const t=AC.currentTime;n=n||10;for(let i=0;i<n;i++){const tt=t+Math.random()*(dur||1);noise(tt,.05,.12+Math.random()*.1,1200+Math.random()*1200);}};
SFX.cheer=function(){if(!AC)return;SFX.clap(40,2);const t=AC.currentTime;noise(t,1.6,.12,2400);SFX.ooh(1.4);};
SFX.click=function(){if(!AC)return;const t=AC.currentTime;noise(t,.02,.35,4000,null,'highpass');tone(1800,t+.02,.03,'square',.04);noise(t+.05,.04,.18,6000,null,'highpass');};
SFX.whoosh=function(){if(!AC)return;const t=AC.currentTime;NZ=NZ||nz();const s=AC.createBufferSource();s.buffer=NZ;s.loop=true;const f=AC.createBiquadFilter();f.type='bandpass';f.Q.value=2;f.frequency.setValueAtTime(300,t);f.frequency.exponentialRampToValueAtTime(3000,t+.35);f.frequency.exponentialRampToValueAtTime(400,t+.6);const g=AC.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.5,t+.25);g.gain.linearRampToValueAtTime(0,t+.65);s.connect(f);f.connect(g);g.connect(SG);s.start(t);s.stop(t+.7);};
SFX.thunder=function(){if(!AC)return;const t=AC.currentTime;noise(t,1.4,.5,90,null,'lowpass');noise(t+.05,.6,.3,300);};
SFX.gasp=function(){if(!AC)return;const t=AC.currentTime;noise(t,.4,.2,1800);tone(320,t,.3,'sine',.04,null,520);};
SFX.angry=function(){if(!AC)return;const t=AC.currentTime;tone(200,t,.2,'sawtooth',.08,null,140);tone(150,t+.15,.25,'sawtooth',.08,null,110);};
SFX.coin=function(){if(!AC)return;const t=AC.currentTime;tone(1568,t,.08,'square',.06);tone(2093,t+.07,.18,'square',.06);};
