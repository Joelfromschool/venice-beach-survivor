// Original procedural music + SFX for Honey Trails (WebAudio, no samples).
let ctx=null,master,musG,sfxG,cur=null,timer=null,nextT=0,step=0;
export const AU={music:true,sfx:true,
 init(){if(ctx){if(ctx.state==='suspended')ctx.resume();return}
  try{ctx=new (window.AudioContext||window.webkitAudioContext)();}catch(e){return}
  master=ctx.createGain();master.gain.value=.8;master.connect(ctx.destination);
  musG=ctx.createGain();musG.gain.value=this.music?.32:0;musG.connect(master);
  sfxG=ctx.createGain();sfxG.gain.value=this.sfx?.7:0;sfxG.connect(master);
  // unlock iOS
  const b=ctx.createBuffer(1,1,22050),s=ctx.createBufferSource();s.buffer=b;s.connect(master);s.start(0);
  if(cur){const c=cur;cur=null;this.song(c)}
 },
 setMusic(v){this.music=v;if(musG)musG.gain.setTargetAtTime(v?.32:0,ctx.currentTime,.1)},
 setSfx(v){this.sfx=v;if(sfxG)sfxG.gain.setTargetAtTime(v?.7:0,ctx.currentTime,.05)},
 song(name){if(cur===name)return;cur=name;if(!ctx)return;clearInterval(timer);step=0;nextT=ctx.currentTime+.08;
  if(!name)return;timer=setInterval(()=>sched(),40)},
 play(n,a){if(!ctx||!this.sfx)return;const f=SFX[n];if(f)try{f(ctx.currentTime,a)}catch(e){}},
 suspend(){if(ctx&&ctx.state==='running')ctx.suspend()},resume(){if(ctx&&ctx.state!=='running')ctx.resume()}
};
const N=n=>440*Math.pow(2,(n-69)/12);
function tone(t,f,d,{type='sine',v=.2,a=.005,r=.12,dest=musG,det=0,lp=0,slide=0}={}){
 const o=ctx.createOscillator(),g=ctx.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(det)o.detune.value=det;
 if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(20,f*slide),t+d);
 g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+a);g.gain.setTargetAtTime(0,t+d,r);
 let n=o;if(lp){const fl=ctx.createBiquadFilter();fl.type='lowpass';fl.frequency.value=lp;o.connect(fl);n=fl}
 n.connect(g);g.connect(dest);o.start(t);o.stop(t+d+r*6);}
let nb=null;function noise(t,d,{v=.1,hp=4000,dest=musG,bp=0}={}){
 if(!nb){nb=ctx.createBuffer(1,ctx.sampleRate*.5,ctx.sampleRate);const D=nb.getChannelData(0);for(let i=0;i<D.length;i++)D[i]=Math.random()*2-1}
 const s=ctx.createBufferSource(),f=ctx.createBiquadFilter(),g=ctx.createGain();s.buffer=nb;f.type=bp?'bandpass':'highpass';f.frequency.value=bp||hp;
 g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+d);s.connect(f);f.connect(g);g.connect(dest);s.start(t);s.stop(t+d+.02)}
// marimba-ish pluck
const mar=(t,n,v=.16,d=.18)=>{tone(t,N(n),d,{type:'sine',v,r:.09});tone(t,N(n)*4,.03,{type:'sine',v:v*.25,r:.02})};
const pad=(t,ns,d,v=.035)=>ns.forEach(n=>{tone(t,N(n),d,{type:'triangle',v,a:.25,r:.4,det:-6});tone(t,N(n),d,{type:'triangle',v:v*.8,a:.3,r:.4,det:7})});
const bass=(t,n,d=.2,v=.18)=>tone(t,N(n),d,{type:'triangle',v,r:.07,lp:900});
// SONGS: 16th-note grid. chords as midi arrays per bar; melody per bar (16 steps, null = rest)
const SONGS={
 map:{bpm:108,bars:[[53,57,60,64],[50,53,57,60],[46,50,53,57],[48,52,55,58]],
  mel:[[72,0,0,69,0,0,67,0,69,0,72,0,74,0,72,0],[69,0,0,65,0,0,64,0,65,0,69,0,67,0,0,0],[70,0,0,69,0,0,65,0,62,0,65,0,69,0,70,0],[72,0,0,0,70,0,69,0,67,0,0,64,67,0,0,0],
       [72,0,74,0,76,0,74,0,72,0,69,0,72,0,0,0],[74,0,72,0,69,0,65,0,69,0,0,0,65,0,62,0],[65,0,0,67,0,0,69,0,70,0,69,0,65,0,62,0],[64,0,65,0,67,0,0,0,64,0,0,0,60,0,0,0]],
  arp:[0,2,1,3,0,2,1,3,0,2,1,3,0,2,3,1],drum:'map'},
 night:{bpm:84,bars:[[50,57,60,65],[46,53,57,62],[48,55,58,64],[45,52,57,60]],
  mel:[[74,0,0,0,72,0,69,0,0,0,0,0,67,0,0,0],[69,0,0,0,0,0,65,0,62,0,0,0,0,0,0,0],[67,0,0,0,70,0,0,0,72,0,0,0,70,0,67,0],[69,0,0,0,0,0,0,0,64,0,0,0,0,0,0,0]],
  arp:[0,1,2,3,2,1,0,1,0,1,2,3,2,1,0,1],drum:'soft'},
 enc:{bpm:138,bars:[[50,54,57,62],[47,50,54,59],[43,47,50,55],[45,49,52,57]],
  mel:[[74,0,74,76,0,78,0,76,74,0,71,0,74,0,0,0],[71,0,71,74,0,76,0,74,71,0,69,0,66,0,0,0],[67,0,67,71,0,74,0,76,78,0,76,0,74,0,71,0],[73,0,76,0,73,0,69,0,73,0,0,76,0,0,0,0]],
  arp:[0,2,1,2,3,2,1,2,0,2,1,2,3,2,1,2],drum:'enc'},
 battle:{bpm:150,bars:[[45,52,57,60],[41,48,53,57],[43,50,55,59],[40,47,52,56]],
  mel:[[69,0,72,0,76,0,74,72,0,74,0,72,69,0,67,0],[65,0,69,0,72,0,71,69,0,67,0,65,64,0,0,0],[67,0,71,0,74,0,72,71,0,72,0,74,76,0,0,0],[76,0,75,0,76,0,71,0,68,0,71,0,64,0,0,0]],
  arp:[0,0,2,0,1,0,3,0,0,0,2,0,1,0,3,2],drum:'battle'},
 title:{bpm:100,bars:[[53,57,60,64],[52,55,60,64],[50,53,57,62],[48,55,58,64]],
  mel:[[77,0,0,76,77,0,72,0,0,0,69,0,72,0,0,0],[76,0,0,74,76,0,72,0,0,0,67,0,72,0,0,0],[74,0,0,72,74,0,77,0,0,0,74,0,72,0,69,0],[70,0,72,0,74,0,0,0,72,0,0,0,0,0,0,0]],
  arp:[0,1,2,3,1,2,3,1,0,1,2,3,1,2,3,2],drum:'soft'},
};
function sched(){const S=SONGS[cur];if(!S)return;const sd=60/S.bpm/4;
 while(nextT<ctx.currentTime+.18){const t=nextT,i=step%16,bar=Math.floor(step/16);const ch=S.bars[bar%S.bars.length],m=S.mel[bar%S.mel.length][i];
  if(i===0)pad(t,ch.map(n=>n+12),sd*16,cur==='battle'?.025:.03);
  if(i%4===0)bass(t,ch[0]-12+(i===8&&cur!=='night'?7:0),sd*2);
  if(cur!=='night'||i%2===0)mar(t,ch[S.arp[i]]+24,cur==='battle'?.06:.07,.1);
  if(m)mar(t,m,cur==='night'?.13:.15,sd*1.6);
  const D=S.drum;
  if(D==='map'){if(i%8===0)tone(t,90,.08,{type:'sine',v:.22,slide:.4,r:.05});if(i%4===2)noise(t,.05,{v:.05});if(i===4||i===12)noise(t,.09,{v:.07,bp:1800})}
  if(D==='enc'){if(i%4===0)tone(t,80,.08,{type:'sine',v:.25,slide:.4,r:.05});if(i%2===1)noise(t,.03,{v:.04});if(i===4||i===12)noise(t,.1,{v:.09,bp:2000})}
  if(D==='battle'){if(i%4===0||i===10)tone(t,70,.09,{type:'sine',v:.3,slide:.35,r:.05});noise(t,.025,{v:.03});if(i===4||i===12)noise(t,.12,{v:.12,bp:1500})}
  if(D==='soft'){if(i%8===4)noise(t,.06,{v:.03,bp:3000})}
  nextT+=sd;step++;}}
const sf=(t,f,d,o={})=>tone(t,f,d,Object.assign({dest:sfxG},o));
const SFX={
 tap:t=>sf(t,880,.04,{type:'triangle',v:.15,r:.03}),
 back:t=>sf(t,520,.06,{type:'triangle',v:.13,slide:.7}),
 throw:t=>{noise(t,.2,{v:.12,bp:1200,dest:sfxG});sf(t,300,.15,{type:'sine',v:.08,slide:2.5})},
 hit:t=>{sf(t,660,.05,{type:'square',v:.06});sf(t+.04,990,.08,{type:'triangle',v:.12})},
 suck:t=>sf(t,200,.35,{type:'sine',v:.15,slide:6}),
 wobble:t=>{sf(t,180,.08,{type:'triangle',v:.2,r:.05});noise(t,.06,{v:.06,bp:500,dest:sfxG})},
 catch:t=>[72,76,79,84].forEach((n,i)=>sf(t+i*.09,N(n),.12,{type:'triangle',v:.16})),
 star:t=>[84,88,91,96].forEach((n,i)=>sf(t+i*.05,N(n),.08,{type:'sine',v:.12})),
 broke:t=>{noise(t,.25,{v:.2,bp:900,dest:sfxG});sf(t,400,.2,{type:'sawtooth',v:.06,slide:.4,lp:1500})},
 flee:t=>sf(t,600,.35,{type:'triangle',v:.12,slide:.3}),
 spin:t=>{for(let i=0;i<7;i++)sf(t+i*.045,N(79+i*2),.05,{type:'triangle',v:.1})},
 item:t=>sf(t,N(88),.08,{type:'sine',v:.12}),
 appear:t=>{sf(t,N(76),.07,{type:'triangle',v:.12});sf(t+.08,N(83),.1,{type:'triangle',v:.12})},
 rustle:t=>noise(t,.25,{v:.05,bp:3500,dest:sfxG}),
 nice:(t,k)=>[0,4,7,12].slice(0,1+(k||1)).forEach((n,i)=>sf(t+i*.06,N(79+n),.1,{type:'sine',v:.14})),
 lvup:t=>[60,64,67,72,76,79,84].forEach((n,i)=>sf(t+i*.07,N(n),.18,{type:'triangle',v:.14})),
 hatch:t=>{noise(t,.15,{v:.15,bp:2500,dest:sfxG});[72,79,84].forEach((n,i)=>sf(t+.15+i*.1,N(n),.2,{type:'triangle',v:.14}))},
 crack:t=>noise(t,.06,{v:.18,bp:3000,dest:sfxG}),
 atk:t=>{noise(t,.07,{v:.12,bp:2200,dest:sfxG});sf(t,500,.06,{type:'square',v:.05,slide:.5})},
 big:t=>{noise(t,.4,{v:.25,bp:700,dest:sfxG});sf(t,150,.4,{type:'sawtooth',v:.1,slide:.3,lp:1200})},
 hurt:t=>sf(t,220,.12,{type:'square',v:.06,slide:.6,lp:1500}),
 dodge:t=>noise(t,.15,{v:.12,hp:2500,dest:sfxG}),
 warn:t=>{sf(t,N(81),.06,{type:'square',v:.05});sf(t+.1,N(81),.06,{type:'square',v:.05})},
 win:t=>[67,72,76,79,76,79,84].forEach((n,i)=>sf(t+i*.1,N(n),.16,{type:'triangle',v:.15})),
 lose:t=>[67,64,60,55].forEach((n,i)=>sf(t+i*.15,N(n),.2,{type:'triangle',v:.12})),
 power:t=>{for(let i=0;i<5;i++)sf(t+i*.05,N(72+i*3),.07,{type:'sine',v:.12})},
 evolve:t=>{for(let i=0;i<14;i++)sf(t+i*.08,N(60+i*2),.1,{type:'triangle',v:.1})},
 open:t=>sf(t,N(76),.06,{type:'sine',v:.1}),
};
