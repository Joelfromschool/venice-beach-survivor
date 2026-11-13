'use strict';
// Original chiptune-ish Web Audio sequencer + SFX (no samples).
const AU={ctx:null,mv:.7,sv:1,on:true,cur:null,pending:null,timer:null,step:0,nextT:0,
 init(){if(this.ctx)return;const C=window.AudioContext||window.webkitAudioContext;if(!C)return;this.ctx=new C();
  this.master=this.ctx.createGain();this.master.connect(this.ctx.destination);
  this.music=this.ctx.createGain();this.music.gain.value=this.mv*.5;this.music.connect(this.master);
  this.sfx=this.ctx.createGain();this.sfx.gain.value=this.sv;this.sfx.connect(this.master);
  const len=this.ctx.sampleRate;this.noise=this.ctx.createBuffer(1,len,this.ctx.sampleRate);const d=this.noise.getChannelData(0);for(let i=0;i<len;i++)d[i]=Math.random()*2-1;
  this.setOn(this.on);},
 unlock(){this.init();if(!this.ctx)return;if(this.ctx.state==='suspended')this.ctx.resume();
  if(!this._u){this._u=1;const b=this.ctx.createBuffer(1,1,22050);const s=this.ctx.createBufferSource();s.buffer=b;s.connect(this.ctx.destination);s.start(0);}
  if(this.pending){const p=this.pending;this.pending=null;this.playMusic(p,true);}},
 setOn(v){this.on=v;if(this.master)this.master.gain.value=v?1:0;},
 setMV(v){this.mv=v;if(this.music)this.music.gain.value=v*.5;},setSV(v){this.sv=v;if(this.sfx)this.sfx.gain.value=v;},
 hz(n){return 440*Math.pow(2,(n-69)/12);},
 tone(t,f,dur,type,vol,dest,att,f2){const c=this.ctx,o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+dur);
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+(att||.005));g.gain.exponentialRampToValueAtTime(.0008,t+dur);o.connect(g);g.connect(dest||this.sfx);o.start(t);o.stop(t+dur+.05);},
 nz(t,dur,vol,fq,type,dest){const c=this.ctx,s=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();s.buffer=this.noise;f.type=type||'highpass';f.frequency.value=fq||6000;
  g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.0008,t+dur);s.connect(f);f.connect(g);g.connect(dest||this.sfx);s.start(t,Math.random()*.5);s.stop(t+dur+.05);},
 // ---- music ----
 // note strings: space separated tokens per 8th step; '.'=rest, '-'=hold; notes like C5 D#4
 parse(s){return s.trim().split(/\s+/).map(x=>{if(x==='.'||x==='-')return x;const m=x.match(/^([A-G])(#|b)?(\d)$/);if(!m)return'.';const b={C:0,D:2,E:4,F:5,G:7,A:9,B:11}[m[1]]+(m[2]==='#'?1:m[2]==='b'?-1:0);return 12*(+m[3]+1)+b;});},
 T:{},
 defTracks(){const P=s=>this.parse(s);
  this.T={
   title:{bpm:132,lead:P('E5 . G5 . A5 G5 E5 . D5 . E5 G5 C5 . . . E5 . G5 . A5 C6 B5 A5 G5 . E5 . G5 . . . A5 . C6 . D6 C6 A5 . G5 . E5 G5 A5 . G5 . E5 . D5 . E5 . G5 E5 D5 . C5 . D5 E5 C5 . . .'),
    bass:P('C3 . C3 . G2 . G2 . A2 . A2 . F2 . G2 . C3 . C3 . G2 . G2 . A2 . A2 . F2 . G2 . F2 . F2 . C3 . C3 . A2 . A2 . E2 . E2 . F2 . F2 . G2 . G2 . C3 . G2 . C3 . . .'),
    chord:[[60,64,67],[55,59,62],[57,60,64],[53,57,60],[60,64,67],[55,59,62],[57,60,64],[53,57,60]],lw:'square',kick:'x...x...x...x...',snare:'....x.......x...',hat:'..x...x...x...x.'},
   la:{bpm:118,lead:P('G4 . B4 D5 . B4 G4 . A4 . C5 E5 . C5 A4 . B4 . D5 G5 . D5 B4 . A4 . F#4 . G4 . . . G4 . B4 D5 . E5 D5 . C5 . E5 G5 . E5 C5 . D5 . B4 G4 . A4 B4 . A4 . G4 . . . . .'),
    bass:P('G2 . . G2 . . G2 . A2 . . A2 . . A2 . B2 . . B2 . . B2 . D3 . . D3 C3 . B2 . G2 . . G2 . . G2 . C3 . . C3 . . C3 . D3 . . D3 . . D3 . G2 . D3 . G2 . . .'),
    chord:[[55,59,62],[57,60,64],[59,62,67],[62,66,69],[55,59,62],[60,64,67],[62,66,69],[55,59,62]],lw:'triangle',kick:'x.....x.x.......',snare:'....x.......x...',hat:'x.xxx.xxx.xxx.xx'},
   jp:{bpm:112,lead:P('D5 . E5 . G5 . A5 . G5 . E5 . D5 . . . A4 . D5 . E5 G5 E5 . D5 . B4 . A4 . . . D5 . E5 . G5 . B5 . A5 . G5 . E5 . . . G5 . E5 D5 B4 . D5 . E5 . . . D5 . . .'),
    bass:P('D3 . . . A2 . . . B2 . . . G2 . . . D3 . . . A2 . . . E3 . . . A2 . . . D3 . . . A2 . . . B2 . . . G2 . . . E3 . . . A2 . . . D3 . . . D3 . . .'),
    chord:[[62,66,69],[59,62,66],[55,59,62],[57,61,64],[62,66,69],[59,62,66],[64,67,71],[62,66,69]],lw:'triangle',kick:'x.......x.......',snare:'........x.......',hat:'..x...x...x...x.'},
   tr:{bpm:124,lead:P('F5 . A5 . C6 . A5 F5 G5 . A#5 . A5 . F5 . E5 . G5 . C6 . G5 E5 F5 . A5 . F5 . . . F5 . A5 . C6 . D6 C6 A#5 . A5 . G5 . F5 . E5 . G5 . C6 . A#5 . A5 . G5 . F5 . . .'),
    bass:P('F2 . . F2 . F3 F2 . A#2 . . A#2 . A#3 A#2 . C3 . . C3 . C4 C3 . F2 . . F2 . F3 F2 . F2 . . F2 . F3 F2 . A#2 . . A#2 . A#3 A#2 . C3 . . C3 . C4 C3 . F2 . . F2 . . .'),
    chord:[[65,69,72],[70,74,77],[60,64,67],[65,69,72],[65,69,72],[70,74,77],[60,64,67],[65,69,72]],lw:'sine',kick:'x..x..x...x..x..',snare:'....x.......x...',hat:'x.x.x.x.x.x.x.x.'},
   lab:{bpm:100,lead:P('C5 . E5 . G5 . E5 . F5 . A5 . G5 . . . E5 . G5 . C6 . B5 . A5 . F5 . G5 . . . C5 . E5 . G5 . E5 . F5 . A5 . C6 . A5 . G5 . F5 . E5 . D5 . C5 . . . . . . .'),
    bass:P('C3 . . . C3 . . . F2 . . . G2 . . . A2 . . . E2 . . . F2 . . . G2 . . . C3 . . . C3 . . . F2 . . . A2 . . . G2 . . . G2 . . . C3 . . . . . . .'),
    chord:[[60,64,67],[60,64,67],[53,57,60],[55,59,62],[57,60,64],[52,55,59],[53,57,60],[55,59,62]],lw:'triangle',kick:'x.......x.......',snare:'',hat:'....x.......x...'},
  };for(const k in this.T){const tr=this.T[k];const fx=a=>{a=a.slice(0,64);while(a.length<64)a.push('.');return a;};tr.lead=fx(tr.lead);tr.bass=fx(tr.bass);}},
 playMusic(name,force){if(!this.T.title)this.defTracks();if(!this.ctx||this.ctx.state!=='running'){this.pending=name;if(this.ctx&&this.ctx.state==='suspended')this.ctx.resume().then(()=>{if(this.pending){const p=this.pending;this.pending=null;this.playMusic(p,true);}}).catch(()=>{});return;}
  if(this.cur===name&&!force&&this.timer)return;this.cur=name;this.step=0;this.nextT=this.ctx.currentTime+.08;
  if(!this.timer)this.timer=setInterval(()=>this.sched(),40);},
 stopMusic(){this.cur=null;},
 sched(){if(!this.cur||!this.ctx)return;const tr=this.T[this.cur];if(!tr)return;const sp=60/tr.bpm/2;
  while(this.nextT<this.ctx.currentTime+.18){const i=this.step%64,t=this.nextT;const m=this.music;
   const n=tr.lead[i];if(typeof n==='number'){let len=1;while(tr.lead[(i+len)%64]==='-'&&len<8)len++;this.tone(t,this.hz(n),sp*len*.95,tr.lw,.14,m,.01);this.tone(t,this.hz(n+12),sp*.5,'sine',.03,m);}
   const b=tr.bass[i];if(typeof b==='number')this.tone(t,this.hz(b),sp*1.6,'triangle',.22,m,.01);
   if(i%8===0){const ch=tr.chord[(i/8)|0];if(ch)for(const c of ch)this.tone(t,this.hz(c),sp*7,'sine',.035,m,.08);}
   const k=i%16;if(tr.kick[k]==='x')this.tone(t,120,.18,'sine',.5,m,.002,40);if(tr.snare&&tr.snare[k]==='x')this.nz(t,.14,.22,1800,'bandpass',m);if(tr.hat[k]==='x')this.nz(t,.04,.06,8000,'highpass',m);
   this.nextT+=sp;this.step++;}},
 // ---- SFX ----
 play(k){if(!this.ctx||this.ctx.state!=='running')return;const t=this.ctx.currentTime;
  switch(k){
   case'ui':this.tone(t,880,.08,'square',.12);this.tone(t+.04,1320,.08,'square',.08);break;
   case'back':this.tone(t,660,.08,'square',.1);this.tone(t+.05,440,.1,'square',.08);break;
   case'shutter':this.nz(t,.05,.5,3000,'bandpass');this.nz(t+.07,.06,.4,2200,'bandpass');this.tone(t,1800,.03,'square',.08);break;
   case'wind':this.nz(t,.25,.12,900,'bandpass');this.tone(t,300,.25,'sawtooth',.03,null,.01,600);break;
   case'throw':this.nz(t,.25,.25,1200,'bandpass');this.tone(t,500,.2,'sine',.08,null,.01,250);break;
   case'thud':this.tone(t,180,.15,'sine',.4,null,.002,70);break;
   case'bonk':this.tone(t,520,.12,'square',.2,null,.002,260);this.tone(t+.08,900,.2,'triangle',.15);break;
   case'whistle':this.tone(t,1500,.18,'sine',.25,null,.02,2200);this.tone(t+.2,2200,.35,'sine',.25,null,.02,1600);break;
   case'pop':this.tone(t,300,.1,'sine',.35,null,.002,900);this.nz(t,.05,.2,4000);break;
   case'boing':this.tone(t,200,.35,'sine',.3,null,.005,700);break;
   case'nom':for(let i=0;i<3;i++)this.tone(t+i*.13,260+i*20,.08,'square',.12);break;
   case'yay':[72,76,79,84].forEach((n,i)=>this.tone(t+i*.06,this.hz(n),.18,'triangle',.18));break;
   case'secret':[72,76,79,83,84,88,91,96].forEach((n,i)=>this.tone(t+i*.07,this.hz(n),.3,'square',.1));this.nz(t,.6,.1,7000);break;
   case'tick':this.tone(t,1200+Math.random()*200,.04,'square',.08);break;
   case'stamp':this.tone(t,90,.3,'sine',.6,null,.002,40);this.nz(t,.15,.4,600,'lowpass');break;
   case'fanfare':[67,72,76,79,76,79,84].forEach((n,i)=>this.tone(t+i*.12,this.hz(n),i===6?.8:.2,'square',.13));break;
   case'notes':[79,83,86,83,79].forEach((n,i)=>this.tone(t+i*.18,this.hz(n),.25,'triangle',.15));break;
   case'zzz':this.tone(t,200,.4,'sine',.06,null,.1,160);break;
   case'confetti':for(let i=0;i<6;i++)this.nz(t+i*.04,.06,.2,5000+i*500);this.tone(t,800,.3,'square',.08,null,.002,1600);break;
   case'horn':this.tone(t,440,.5,'sawtooth',.12,null,.02,520);break;
   case'film':this.tone(t,300,.3,'square',.1,null,.01,150);break;
  }},
};
