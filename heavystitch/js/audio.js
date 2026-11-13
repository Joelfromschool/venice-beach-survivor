/* Heavy Stitch: original procedural audio (Web Audio). Unlocks on first user gesture (iPhone Safari). */
'use strict';
const AU={ctx:null,master:null,music:null,sfx:null,on:true,mv:.55,sv:.8,track:null,step:0,next:0,timer:null,boostG:null,
 init(){if(this.ctx)return;const C=window.AudioContext||window.webkitAudioContext;if(!C)return;const c=this.ctx=new C();
  this.master=c.createGain();this.master.connect(c.destination);this.music=c.createGain();this.music.connect(this.master);this.sfx=c.createGain();this.sfx.connect(this.master);
  const comp=c.createDynamicsCompressor();comp.threshold.value=-14;comp.ratio.value=4;this.master.disconnect();this.master.connect(comp);comp.connect(c.destination);
  const ws=c.createWaveShaper();const cu=new Float32Array(1024);for(let i=0;i<1024;i++){const x=i/512-1;cu[i]=Math.tanh(x*6)*.8;}ws.curve=cu;const lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.value=2600;ws.connect(lp);lp.connect(this.music);this.gtrBus=ws;
  const len=c.sampleRate;const b=c.createBuffer(1,len,c.sampleRate);const d=b.getChannelData(0);for(let i=0;i<len;i++)d[i]=Math.random()*2-1;this.noiseBuf=b;this.apply();},
 unlock(){this.init();if(!this.ctx)return;if(this.ctx.state!=='running')this.ctx.resume();
  if(!this.unlocked){this.unlocked=true;try{const b=this.ctx.createBuffer(1,1,22050),src=this.ctx.createBufferSource();src.buffer=b;src.connect(this.ctx.destination);src.start(0);}catch(e){}}
  if(this.track&&!this.timer){this.next=this.t()+.1;this.timer=setInterval(()=>this.sched(),60);}},
 apply(){if(!this.ctx)return;this.master.gain.value=this.on?1:0;this.music.gain.value=this.mv*.5;this.sfx.gain.value=this.sv;},
 t(){return this.ctx?this.ctx.currentTime:0;},
 ok(){return this.ctx&&this.ctx.state==='running'&&this.on;},
 osc(type,f,t0,dur,g,dest,f2,att){const c=this.ctx,o=c.createOscillator(),v=c.createGain();o.type=type;o.frequency.setValueAtTime(f,t0);if(f2)o.frequency.exponentialRampToValueAtTime(Math.max(20,f2),t0+dur);
  v.gain.setValueAtTime(0.0001,t0);v.gain.exponentialRampToValueAtTime(g,t0+(att||.005));v.gain.exponentialRampToValueAtTime(.0001,t0+dur);o.connect(v);v.connect(dest||this.sfx);o.start(t0);o.stop(t0+dur+.05);return o;},
 noise(t0,dur,g,ftype,f,q,dest,f2){const c=this.ctx,s=c.createBufferSource();s.buffer=this.noiseBuf;s.loop=true;const fl=c.createBiquadFilter();fl.type=ftype||'lowpass';fl.frequency.setValueAtTime(f||2000,t0);if(f2)fl.frequency.exponentialRampToValueAtTime(f2,t0+dur);fl.Q.value=q||1;
  const v=c.createGain();v.gain.setValueAtTime(g,t0);v.gain.exponentialRampToValueAtTime(.0001,t0+dur);s.connect(fl);fl.connect(v);v.connect(dest||this.sfx);s.start(t0,Math.random()*.5);s.stop(t0+dur+.05);},
 // ---- SFX ----
 play(n,vol){if(!this.ok())return;const t=this.t();vol=vol==null?1:vol;
  switch(n){
  case'ui':this.osc('square',880,t,.05,.08*vol);this.osc('square',1320,t+.03,.05,.05*vol);break;
  case'back':this.osc('square',660,t,.06,.07*vol,null,440);break;
  case'clank':this.noise(t,.18,.5*vol,'bandpass',2400,3);this.osc('triangle',190,t,.25,.35*vol,null,80);this.osc('square',1700,t,.08,.08*vol,null,900);this.noise(t+.06,.1,.25*vol,'highpass',5000);break;
  case'buy':[523,659,784,1046].forEach((f,i)=>this.osc('square',f,t+i*.05,.12,.06*vol));break;
  case'deny':this.osc('sawtooth',160,t,.18,.12*vol,null,110);break;
  case'rifle':this.noise(t,.07,.35*vol,'bandpass',1800,1.2,null,600);this.osc('square',220,t,.05,.12*vol,null,90);break;
  case'shotgun':this.noise(t,.22,.6*vol,'lowpass',3000,.8,null,300);this.osc('sine',120,t,.18,.4*vol,null,45);break;
  case'cannon':this.noise(t,.5,.8*vol,'lowpass',1600,.7,null,120);this.osc('sine',90,t,.5,.7*vol,null,30);this.osc('square',60,t,.12,.25*vol);break;
  case'laser':this.osc('sawtooth',1400,t,.16,.12*vol,null,300);this.osc('sine',2200,t,.1,.08*vol,null,800);break;
  case'charge':this.osc('sawtooth',200,t,.7,.08*vol,null,1400,.3);break;
  case'beam':this.osc('sawtooth',90,t,.6,.3*vol,null,60);this.noise(t,.6,.4*vol,'bandpass',900,2,null,3000);this.osc('square',1800,t,.4,.08*vol,null,600);break;
  case'missile':this.noise(t,.35,.25*vol,'bandpass',1200,1.5,null,3500);break;
  case'blade':this.noise(t,.16,.5*vol,'bandpass',3500,2,null,900);this.osc('sawtooth',900,t,.1,.06*vol,null,300);break;
  case'pile':this.osc('square',70,t,.3,.6*vol,null,30);this.noise(t,.25,.8*vol,'lowpass',4000,1,null,200);this.noise(t+.02,.06,.5*vol,'highpass',6000);break;
  case'hit':this.noise(t,.06,.3*vol,'highpass',2500);this.osc('square',520,t,.04,.06*vol,null,260);break;
  case'hurt':this.noise(t,.18,.45*vol,'lowpass',900);this.osc('sawtooth',110,t,.2,.2*vol,null,60);break;
  case'boom':this.noise(t,.8,.9*vol,'lowpass',900,.7,null,60);this.osc('sine',70,t,.7,.8*vol,null,25);break;
  case'dash':this.noise(t,.28,.55*vol,'bandpass',900,1,null,2600);this.osc('sine',140,t,.15,.2*vol,null,70);break;
  case'break':this.osc('square',1046,t,.09,.15*vol);this.osc('square',1568,t+.07,.2,.13*vol);this.noise(t,.4,.4*vol,'highpass',3000);this.osc('sine',55,t,.5,.6*vol,null,35);break;
  case'cutin':this.noise(t,.5,.4*vol,'bandpass',1500,2,null,6000);this.osc('sawtooth',220,t,.5,.12*vol,null,880,.3);this.osc('square',110,t+.48,.4,.3*vol,null,55);this.noise(t+.48,.3,.6*vol,'lowpass',3000);break;
  case'repair':[392,523,659].forEach((f,i)=>this.osc('triangle',f,t+i*.07,.2,.15*vol));break;
  case'lock':this.osc('square',1600,t,.04,.05*vol);this.osc('square',2100,t+.05,.04,.05*vol);break;
  case'warn':this.osc('square',880,t,.12,.08*vol);this.osc('square',880,t+.18,.12,.08*vol);break;
  case'win':[392,523,659,784,1046].forEach((f,i)=>{this.osc('sawtooth',f,t+i*.09,.35,.06*vol);this.osc('square',f/2,t+i*.09,.3,.05*vol);});break;
  case'lose':[392,330,262,196].forEach((f,i)=>this.osc('sawtooth',f,t+i*.16,.4,.07*vol));break;
  case'type':this.osc('square',1200+Math.random()*300,t,.02,.025*vol);break;
  // cutscene stings
  case'hitst':this.noise(t,.5,.7*vol,'lowpass',2500,.7,null,200);this.osc('sawtooth',73,t,.6,.3*vol);this.osc('sawtooth',110,t,.6,.2*vol);this.osc('sawtooth',87,t,.6,.2*vol);break;
  case'rise':this.noise(t,1.2,.25*vol,'bandpass',400,3,null,5000);this.osc('sawtooth',110,t,1.2,.06*vol,null,440,.8);break;
  case'title':[0,.12].forEach((d,i)=>{this.osc('sawtooth',146.8*(i?1.5:1),t+d,1.4,.16*vol);this.osc('sawtooth',73.4,t+d,1.4,.2*vol);});this.noise(t,1.2,.5*vol,'lowpass',3000,.7,null,100);break;
  case'alarm':for(let i=0;i<3;i++)this.osc('square',740,t+i*.3,.18,.09*vol,null,520);break;
  case'whoosh':this.noise(t,.35,.35*vol,'bandpass',600,1,null,4000);break;
  case'slam':this.noise(t,1.4,1*vol,'lowpass',5000,.7,null,80);this.osc('sine',60,t,1.2,1*vol,null,28);[0,7,12,15].forEach(n=>{this.osc('sawtooth',73.4*Math.pow(2,n/12),t,1.6,.09*vol);this.osc('square',146.8*Math.pow(2,n/12),t,1.2,.05*vol);});this.noise(t,.08,.6*vol,'highpass',6000);break;
  case'super':this.osc('sawtooth',110,t,.9,.2*vol,null,1760,.6);this.noise(t,.9,.5*vol,'bandpass',800,1.5,null,8000);this.osc('square',880,t+.6,.4,.1*vol);this.osc('square',1318,t+.68,.4,.1*vol);break;
  case'drift':this.noise(t,.45,.5*vol,'bandpass',2800,4,null,1400);this.osc('sawtooth',300,t,.3,.06*vol,null,900);break;
  case'combo':this.osc('square',660+Math.min(12,(vol||1)*2)*40,t,.06,.05);break;
  case'hype':[523,784,1046,1568].forEach((f,i)=>this.osc('square',f,t+i*.05,.18,.07*vol));this.noise(t,.3,.2*vol,'highpass',5000);break;
  case'capsule':this.osc('triangle',300,t,.25,.25*vol,null,900);this.noise(t,.12,.3*vol,'bandpass',2500,3);break;
  case'crack':this.noise(t,.2,.6*vol,'highpass',3000);this.osc('square',1200,t,.1,.08*vol,null,2400);break;
  case'sr':[784,988,1175,1568].forEach((f,i)=>this.osc('triangle',f,t+i*.06,.4,.12*vol));break;
  case'ur':this.noise(t,1.5,.5*vol,'bandpass',1200,1,null,9000);[523,659,784,1046,1318,1568,2093].forEach((f,i)=>{this.osc('sawtooth',f,t+i*.07,.8,.05*vol);this.osc('triangle',f*2,t+i*.07,.6,.05*vol);});this.osc('sine',55,t,1,.6*vol,null,40);break;
  case'groan':this.osc('sawtooth',90+Math.random()*30,t,.7,.05*vol,null,60,.2);this.noise(t,.5,.08*vol,'bandpass',400,4);break;
  case'door':this.noise(t,1,.5*vol,'lowpass',600,1,null,120);this.osc('square',80,t,.8,.2*vol,null,50);[523,659,784].forEach((f,i)=>this.osc('square',f,t+.3+i*.08,.2,.06*vol));break;
  case'plank':this.osc('triangle',220,t,.12,.3*vol,null,140);this.noise(t,.08,.3*vol,'bandpass',1500,2);break;
  case'round':[0,.25,.5].forEach(d=>{this.osc('sawtooth',98,t+d,.5,.15*vol,null,92);this.noise(t+d,.3,.3*vol,'lowpass',800);});this.osc('sawtooth',73,t+.8,1.4,.2*vol,null,70);break;
  case'gachaDrop':for(let i=0;i<4;i++)this.osc('triangle',200+i*90,t+i*.09,.12,.2*vol,null,120);this.noise(t+.36,.3,.4*vol,'lowpass',900);break;
  case'pop':this.osc('sine',500,t,.12,.25*vol,null,1400);this.noise(t,.15,.25*vol,'bandpass',3000,2);break;
  }},
 boost(level){if(!this.ok())return;const c=this.ctx;if(!this.boostG){const s=c.createBufferSource();s.buffer=this.noiseBuf;s.loop=true;const f=c.createBiquadFilter();f.type='bandpass';f.frequency.value=700;f.Q.value=.8;
   const g=c.createGain();g.gain.value=0;s.connect(f);f.connect(g);g.connect(this.sfx);s.start();this.boostG=g;this.boostF=f;}
  this.boostG.gain.setTargetAtTime(level*.22,c.currentTime,.05);this.boostF.frequency.setTargetAtTime(500+level*1400,c.currentTime,.08);},
 // ---- MUSIC: small step sequencer, original patterns ----
 TR:{
  title:{bpm:150,root:38,bass:[0,0,12,0,0,12,0,12,0,0,12,0,0,12,7,10],pad:[[0,3,7],[-4,0,3],[-2,2,5],[-5,-1,2]],kick:'x...x...x...x.x.',snare:'....x.......x...',hat:'x.x.x.x.x.x.x.xx',arp:null,dark:0,gtr:'x..x..x...x.x...',crash:1,
   lead:[12,,10,12,,15,,12,10,,7,,5,,7,,8,,7,8,,10,,12,15,,,12,10,,8,,10,,12,15,,17,,15,12,,10,,12,,15,,13,,,14,,,19,,17,,15,,14,,13,,]},
  op:{bpm:164,root:38,bass:[0,12,0,12,0,12,0,12,0,12,0,12,7,10,12,15],pad:[[0,3,7],[-4,0,3],[-2,2,5],[-5,-1,2]],kick:'x...x...x...x...',snare:'....x.......x..x',hat:'xxxxxxxxxxxxxxxx',arp:[24,,27,,31,,27,,24,,27,,31,,34,],dark:0,gtr:'x.xx.x.xx.x.xx.x',crash:1,
   lead:[19,,,17,15,,17,,19,,22,,24,,,,20,,,19,17,,15,,12,,15,,17,,,,22,,,20,19,,17,,15,,17,,19,,22,,25,,,24,,,22,,21,,19,,17,,25,,]},
  zombie:{bpm:118,root:33,bass:[0,,,0,,,0,,1,,,1,,,-1,],pad:[[0,3,6],[0,3,6],[1,4,8],[-1,3,6]],kick:'x.....x...x.....',snare:'....x.......x...',hat:'..x...x...x...x.',arp:[12,,15,,18,,15,,13,,16,,19,,16,],dark:1,gtr:'x.....x...x.....'},
  gacha:{bpm:128,root:41,bass:[0,,12,,0,,12,,0,,12,,0,,12,],pad:[[0,4,7],[7,11,14],[9,12,16],[5,9,12]],kick:'x...x...x...x...',snare:'....x.......x...',hat:'..x...x...x...x.',arp:[24,28,31,36,31,28,24,28,31,36,40,36,31,28,24,19],dark:0},
  hangar:{bpm:76,root:45,bass:[0,,,,,,,,0,,,,,,,,],pad:[[0,7,10],[0,5,10],[-2,5,9],[-2,3,7]],kick:'',snare:'',hat:'....x.......x...',arp:[12,,15,,,19,,,17,,,,15,,,,],dark:1,soft:1},
  sortie:{bpm:138,root:38,bass:[0,0,12,0,0,12,0,10,0,0,12,0,3,5,7,10],pad:[[0,3,7],[0,3,7],[-4,0,3],[-2,2,5]],kick:'x...x...x...x..x',snare:'....x.......x...',hat:'..x.xx.x..x.x.xx',arp:[24,,27,,31,,27,,24,,27,,34,,31,],dark:0,gtr:'x..x..x.x..x..x.'},
  boss:{bpm:146,root:37,bass:[0,0,0,12,0,0,1,0,0,0,12,0,1,0,13,12],pad:[[0,3,6],[0,3,6],[1,4,8],[-1,3,6]],kick:'x..xx...x..xx..x',snare:'....x.......x.xx',hat:'xxxxxxxxxxxxxxxx',arp:[24,25,24,,27,,24,,30,,27,,25,,24,],dark:0},
  debrief:{bpm:90,root:43,bass:[0,,,,7,,,,5,,,,3,,,,],pad:[[0,4,7],[5,9,12],[3,7,10],[2,7,11]],kick:'x.......x.......',snare:'',hat:'....x.......x...',arp:[19,,,,24,,,,22,,,,26,,,,],dark:1,soft:1},
 },
 playMusic(name){if(this.track===name)return;this.track=name;this.step=0;if(!this.ctx)return;this.next=this.t()+.1;if(!this.timer)this.timer=setInterval(()=>this.sched(),60);},
 stopMusic(){this.track=null;},
 sched(){if(!this.ctx||!this.track||this.ctx.state!=='running')return;const T=this.TR[this.track];const spb=60/T.bpm/4;
  while(this.next<this.t()+.25){const i=this.step%16,bar=Math.floor(this.step/16)%4,t=this.next,M=this.music;const f=m=>440*Math.pow(2,(m-69)/12);
   if(T.kick[i]==='x'){this.osc('sine',150,t,.28,.9,M,40);}
   if(T.snare[i]==='x'){this.noise(t,.16,.5,'bandpass',1800,.8,M);this.osc('triangle',200,t,.08,.25,M,120);}
   if(T.hat[i]==='x'){this.noise(t,.04,T.soft?.08:.16,'highpass',8000,1,M);}
   const b=T.bass[i];if(b!=null){const pd=T.pad[bar][0];const o=this.osc(T.dark?'triangle':'sawtooth',f(T.root+b+pd),t,spb*(T.soft?3.5:1.6),T.soft?.22:.2,M);}
   if(i===0){for(const n of T.pad[bar]){const o=this.osc('sawtooth',f(T.root+24+n),t,spb*16,.035,M,null,spb*4);}}
   if(T.arp){const a=T.arp[i];if(a!=null)this.osc('square',f(T.root+a+T.pad[bar][0]),t,spb*.9,T.soft?.03:.05,M);}
   if(T.lead){const L=T.lead[this.step%64];if(L!=null){let d=1;while(d<4&&T.lead[(this.step+d)%64]==null)d++;const fr=f(T.root+24+L);this.osc('sawtooth',fr,t,spb*d*.95,.05,M,null,.01);this.osc('square',fr*2.003,t,spb*d*.8,.022,M,null,.01);}}
   if(T.gtr&&T.gtr[i]==='x'&&this.gtrBus){const r0=f(T.root+12+T.pad[bar][0]);for(const m of[1,1.5,2]){this.osc('sawtooth',r0*m,t,spb*1.6,.12,this.gtrBus);}}
   if(T.crash&&i===0&&bar===0){this.noise(t,1.2,.18,'highpass',5000,1,M);}
   this.next+=spb;this.step++;}},
};
