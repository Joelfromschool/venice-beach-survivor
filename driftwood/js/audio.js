'use strict';
// ================= procedural music (changes every hour) & SFX =================
let AC=null,MASTER=null,MUS=null,SFXG=null,LP=null;
function ac(){if(!AC){try{AC=new (window.AudioContext||window.webkitAudioContext)();MASTER=AC.createGain();MASTER.gain.value=.9;MASTER.connect(AC.destination);
 LP=AC.createBiquadFilter();LP.type='lowpass';LP.frequency.value=18000;LP.connect(MASTER);MUS=AC.createGain();MUS.gain.value=0;MUS.connect(LP);SFXG=AC.createGain();SFXG.gain.value=.55;SFXG.connect(MASTER)}catch(e){}}
 if(AC&&AC.state==='suspended')AC.resume();return AC}
const mtof=m=>440*Math.pow(2,(m-69)/12);
let NOISE=null;function noiseBuf(){if(!NOISE){const b=AC.createBuffer(1,AC.sampleRate*.6,AC.sampleRate);const d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;NOISE=b}return NOISE}
function tone(dest,f,t,d,type='sine',v=.2,a=.005,detune=0,f2){const o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+d);o.detune.value=detune;
 g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+a);g.gain.exponentialRampToValueAtTime(.0008,t+d);o.connect(g);g.connect(dest);o.start(t);o.stop(t+d+.05)}
function noise(dest,t,d,v=.2,ft='bandpass',fq=1200,q=1,fq2){const s=AC.createBufferSource();s.buffer=noiseBuf();const f=AC.createBiquadFilter();f.type=ft;f.frequency.setValueAtTime(fq,t);if(fq2)f.frequency.exponentialRampToValueAtTime(fq2,t+d);f.Q.value=q;const g=AC.createGain();g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0008,t+d);s.connect(f);f.connect(g);g.connect(dest);s.start(t);s.stop(t+d+.02)}
const SFX={play(k,arg){if(!S||!S.opt.sfx)return;if(!ac())return;const t=AC.currentTime,D=SFXG;
 switch(k){
 case 'step':noise(D,t,.06,.06,'lowpass',700);break;case 'stepSand':noise(D,t,.08,.07,'bandpass',2200,.8);break;case 'stepWood':tone(D,180,t,.06,'triangle',.08);noise(D,t,.04,.04,'bandpass',900);break;
 case 'pop':tone(D,520,t,.12,'sine',.25,.003,0,1100);break;case 'pull':noise(D,t,.15,.15,'bandpass',1500,1,500);tone(D,300,t+.05,.1,'sine',.12,.003,0,600);break;
 case 'rustle':for(let i=0;i<5;i++)noise(D,t+i*.09,.12,.12,'bandpass',2500+i*300,.7);break;case 'drop':tone(D,220,t,.15,'sine',.25,.002,0,110);break;
 case 'chop':noise(D,t,.08,.3,'bandpass',800,2);tone(D,140,t,.1,'square',.08);break;case 'clink':tone(D,1800,t,.25,'triangle',.18);tone(D,2700,t,.18,'sine',.08);break;
 case 'coin':tone(D,1320,t,.1,'square',.08);tone(D,1760,t+.08,.25,'square',.08);break;
 case 'jingle':[72,76,79,84].forEach((m,i)=>tone(D,mtof(m),t+i*.07,.3,'triangle',.14));break;
 case 'fanfare':[67,72,76,79,84].forEach((m,i)=>tone(D,mtof(m),t+i*.08,i===4?.7:.25,'triangle',.16));tone(D,mtof(60),t+.32,.7,'sine',.12);break;
 case 'swish':noise(D,t,.25,.18,'bandpass',600,1.5,3000);break;case 'cast':noise(D,t,.4,.12,'bandpass',2000,2,500);break;
 case 'plip':tone(D,900,t,.12,'sine',.2,.002,0,1600);break;case 'nibble':tone(D,700,t,.06,'sine',.12,.002,0,1100);break;
 case 'bite':noise(D,t,.35,.35,'lowpass',1500);tone(D,300,t,.2,'sine',.2,.002,0,900);break;case 'reel':for(let i=0;i<6;i++)noise(D,t+i*.04,.02,.1,'highpass',3000);break;
 case 'dig':noise(D,t,.18,.25,'lowpass',500);noise(D,t+.15,.12,.18,'bandpass',900);break;case 'water':noise(D,t,.5,.12,'highpass',2500);break;
 case 'break':noise(D,t,.4,.35,'bandpass',1200,.6);tone(D,400,t,.3,'square',.08,.002,0,100);break;case 'door':tone(D,200,t,.15,'triangle',.15);noise(D,t+.1,.15,.12,'lowpass',400);break;
 case 'hello':tone(D,mtof(76),t,.12,'sine',.15);tone(D,mtof(81),t+.1,.18,'sine',.15);break;case 'tap':tone(D,880,t,.05,'sine',.12);break;
 case 'place':tone(D,330,t,.1,'triangle',.18);tone(D,660,t+.06,.12,'triangle',.12);break;case 'nope':tone(D,200,t,.15,'square',.08);tone(D,160,t+.1,.15,'square',.08);break;
 case 'blip':{const p=arg||1;tone(D,(380+Math.random()*160)*p,t,.06,'triangle',.07,.004);break}
 case 'open':tone(D,600,t,.08,'sine',.12,.002,0,900);break;case 'close':tone(D,700,t,.08,'sine',.1,.002,0,450);break;
 }}};
// ---------- music ----------
const SCALES={maj:[0,2,4,5,7,9,11],pent:[0,2,4,7,9],lyd:[0,2,4,6,7,9,11],mix:[0,2,4,5,7,9,10],dor:[0,2,3,5,7,9,10]};
const PROGS=[[0,5,3,4],[0,3,4,0],[0,4,5,3],[3,4,0,5],[0,2,3,4],[5,3,0,4],[0,3,1,4]];
function hourTrack(h){const R=rngf(9001+h*131);const mood=h<5||h>=21?'night':h<9?'morning':h<16?'day':h<19?'evening':'dusk';
 const roots=[60,62,65,67,57,64,58,63];const root=roots[(R()*roots.length)|0]-(mood==='night'?0:0);
 const scale=mood==='night'?SCALES.pent:mood==='morning'?SCALES.lyd:mood==='day'?SCALES.maj:mood==='evening'?SCALES.mix:SCALES.dor;
 const bpm=mood==='night'?68+R()*8:mood==='morning'?92+R()*10:mood==='day'?104+R()*14:mood==='evening'?86+R()*8:76+R()*8;
 const prog=PROGS[(R()*PROGS.length)|0];const lead=mood==='night'?'bell':mood==='morning'?'marimba':mood==='day'?(R()<.5?'uke':'whistle'):mood==='evening'?'flute':'bell';
 const swing=R()<.5?.12:0;
 // melody: 8 bars x 8 eighths; -1 = rest
 const mel=[];let deg=(R()*5)|0;for(let b=0;b<8;b++){const bar=[];for(let i=0;i<8;i++){if(R()<(mood==='night'?.5:.3)){bar.push(-1);continue}deg+=Math.round((R()-.5)*3.2);deg=Math.max(-2,Math.min(9,deg));bar.push(deg)}mel.push(bar)}
 // structure: bars 4-7 echo 0-3 with variation
 for(let b=4;b<8;b++)if(b!==7)mel[b]=mel[b-4].map((d,i)=>i>5&&R()<.5?d+2:d);
 const bass=[0,-1,-1,-1,4,-1,-1,-1].map((x,i)=>R()<.3&&x<0?(R()<.5?2:4):x);
 const perc=mood!=='night';return {h,mood,root,scale,bpm,prog,lead,swing,mel,bass,perc}}
function degN(tr,d,oct=0){const s=tr.scale;const o=Math.floor(d/s.length);const i=((d%s.length)+s.length)%s.length;return tr.root+s[i]+12*(o+oct)}
const Music={on:false,track:null,step:0,next:0,timer:null,indoorF:false,
 start(){if(!ac())return;this.on=true;this.setTrack(now().getHours());this.vol();if(!this.timer)this.timer=setInterval(()=>this.sched(),60)},
 vol(){if(!MUS)return;MUS.gain.setTargetAtTime(S&&S.opt.music?.32:0,AC.currentTime,.4)},
 tick(){if(!this.on)return;const h=now().getHours();if(!this.track||this.track.h!==h){this.setTrack(h);UI.toast('♪ '+(LANG==='ja'?h+'時の曲':(h%12||12)+(h<12?' AM':' PM')+' tune'))}},
 setTrack(h){this.track=hourTrack(h);this.step=0;this.next=AC?AC.currentTime+.1:0},
 indoor(on){this.indoorF=on;if(LP)LP.frequency.setTargetAtTime(on?1400:18000,AC.currentTime,.3)},
 title(){if(!ac())return;this.on=true;this.track=hourTrack(now().getHours());this.next=AC.currentTime+.1;this.vol();if(!this.timer)this.timer=setInterval(()=>this.sched(),60)},
 sched(){if(!this.on||!AC||!this.track)return;const tr=this.track;const e=60/tr.bpm/2;
  while(this.next<AC.currentTime+.25){const st=this.step%64,bar=(st/8)|0,i=st%8;let t=this.next+(i%2?tr.swing*e:0);
   const ch=tr.prog[(bar>>1)%4];
   // pad/chord on bar start
   if(i===0&&bar%2===0){[0,2,4].forEach(k=>{const m=degN(tr,ch+k,-1);tone(MUS,mtof(m),t,e*15,'sine',.05,.3);tone(MUS,mtof(m),t,e*15,'triangle',.02,.4,7)})}
   // bass
   const bd=tr.bass[i];if(bd>=0)tone(MUS,mtof(degN(tr,ch+bd,-2)),t,e*1.8,'sine',.16,.01);
   // comp (offbeat plucks)
   if(tr.mood==='day'||tr.mood==='morning'){if(i%4===2)[0,2,4].forEach(k=>tone(MUS,mtof(degN(tr,ch+k,0)),t,e*.9,'triangle',.035,.003))}
   // lead
   const d=tr.mel[bar][i];if(d>=0){const m=degN(tr,d,(tr.lead==='bell'||tr.lead==='whistle')?1:0);const f=mtof(m);
    if(tr.lead==='marimba'){tone(MUS,f,t,e*1.6,'sine',.12,.002);tone(MUS,f*4,t,e*.4,'sine',.03,.002)}
    else if(tr.lead==='uke'){tone(MUS,f,t,e*1.4,'triangle',.11,.002);tone(MUS,f*2,t,e*.6,'sine',.03,.002)}
    else if(tr.lead==='whistle'){tone(MUS,f,t,e*1.7,'sine',.07,.04,0);}
    else if(tr.lead==='flute'){tone(MUS,f,t,e*1.9,'sine',.08,.05);tone(MUS,f*2,t,e*1.5,'sine',.015,.05)}
    else{tone(MUS,f,t,e*3,'sine',.07,.003);tone(MUS,f*2.76,t,e*1.2,'sine',.02,.003)}}
   // percussion
   if(tr.perc){if(i%2===1)noise(MUS,t,.04,.035,'highpass',7000);if(i===0||i===4)tone(MUS,110,t,.12,'sine',.12,.002,0,50);if(i===4&&tr.mood==='day')noise(MUS,t,.09,.06,'bandpass',1800,1.5)}
   this.next+=e;this.step++}}
};
