'use strict';
// Pinco Pooh Snap v1.1 audio: an original 16th-step Web Audio band (no samples).
// New songs, keys, tempos, progressions and synth patches written for this game only.
const AU={ctx:null,mv:.7,sv:1,on:true,cur:null,pending:null,timer:null,step:0,nextT:0,
 init(){if(this.ctx)return;const C=window.AudioContext||window.webkitAudioContext;if(!C)return;
  try{if(navigator.audioSession)navigator.audioSession.type='playback';}catch(e){}
  this.ctx=new C();const c=this.ctx;
  this.master=c.createGain();this.master.connect(c.destination);
  this.comp=c.createDynamicsCompressor();this.comp.threshold.value=-16;this.comp.knee.value=12;this.comp.ratio.value=3.5;this.comp.attack.value=.004;this.comp.release.value=.18;this.comp.connect(this.master);
  this.music=c.createGain();this.music.gain.value=this.mv*.55;this.music.connect(this.comp);
  this.sfx=c.createGain();this.sfx.gain.value=this.sv;this.sfx.connect(this.master);
  // short room echo for the lead
  this.echo=c.createDelay(1);this.echo.delayTime.value=.27;const fb=c.createGain();fb.gain.value=.28;const ef=c.createBiquadFilter();ef.type='lowpass';ef.frequency.value=2600;this.echo.connect(ef);ef.connect(fb);fb.connect(this.echo);this.echoOut=c.createGain();this.echoOut.gain.value=.22;ef.connect(this.echoOut);this.echoOut.connect(this.music);
  const len=c.sampleRate;this.noise=c.createBuffer(1,len,c.sampleRate);const d=this.noise.getChannelData(0);for(let i=0;i<len;i++)d[i]=Math.random()*2-1;
  this.setOn(this.on);},
 unlock(){this.init();if(!this.ctx)return;if(this.ctx.state!=='running')this.ctx.resume();
  if(!this._u){this._u=1;const b=this.ctx.createBuffer(1,1,22050);const s=this.ctx.createBufferSource();s.buffer=b;s.connect(this.ctx.destination);s.start(0);}
  if(this.pending){const p=this.pending;this.pending=null;this.playMusic(p,true);}},
 setOn(v){this.on=v;if(this.master)this.master.gain.value=v?1:0;},
 setMV(v){this.mv=v;if(this.music)this.music.gain.value=v*.55;},setSV(v){this.sv=v;if(this.sfx)this.sfx.gain.value=v;},
 hz(n){return 440*Math.pow(2,(n-69)/12);},
 // ---------- generic voices ----------
 env(g,t,a,peak,dur,sus){g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(peak,t+a);g.gain.setTargetAtTime(peak*(sus==null?.6:sus),t+a,.08);g.gain.setTargetAtTime(0,t+dur,.05);},
 tone(t,f,dur,type,vol,dest,att,f2){const c=this.ctx,o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+dur);
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+(att||.005));g.gain.exponentialRampToValueAtTime(.0008,t+dur);o.connect(g);g.connect(dest||this.sfx);o.start(t);o.stop(t+dur+.05);},
 nz(t,dur,vol,fq,type,dest,q){const c=this.ctx,s=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();s.buffer=this.noise;f.type=type||'highpass';f.frequency.value=fq||6000;if(q)f.Q.value=q;
  g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.0008,t+dur);s.connect(f);f.connect(g);g.connect(dest||this.sfx);s.start(t,Math.random()*.5);s.stop(t+dur+.05);},
 pan(dest,p){if(!this.ctx.createStereoPanner)return dest;const k='_pan'+p;if(this[k])return this[k];const n=this.ctx.createStereoPanner();n.pan.value=p;n.connect(dest);return this[k]=n;},
 // ---------- instruments ----------
 I:{
  // bright two-saw brass lead with delayed vibrato (title)
  brass(A,t,n,d,v){const c=A.ctx,f=A.hz(n),g=c.createGain(),lp=c.createBiquadFilter();lp.type='lowpass';lp.Q.value=3;lp.frequency.setValueAtTime(700,t);lp.frequency.linearRampToValueAtTime(4200,t+.03);lp.frequency.setTargetAtTime(1900,t+.04,.12);
   const lfo=c.createOscillator(),lg=c.createGain();lfo.frequency.value=5.6;lg.gain.setValueAtTime(0,t);lg.gain.linearRampToValueAtTime(f*.012,t+.25);lfo.connect(lg);
   for(const dt of[-7,7]){const o=c.createOscillator();o.type='sawtooth';o.frequency.value=f;o.detune.value=dt;lg.connect(o.frequency);o.connect(lp);o.start(t);o.stop(t+d+.3);}
   lfo.start(t);lfo.stop(t+d+.3);A.env(g,t,.012,.16*v,d,.75);lp.connect(g);g.connect(A.music);g.connect(A.echo);
   A.tone(t,f*2,.22,'sine',.035*v,A.music,.003);},
  stab(A,t,n,d,v){const c=A.ctx,g=c.createGain(),lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.setValueAtTime(3200,t);lp.frequency.exponentialRampToValueAtTime(700,t+.14);
   const o=c.createOscillator();o.type='square';o.frequency.value=A.hz(n);o.connect(lp);lp.connect(g);g.gain.setValueAtTime(.06*v,t);g.gain.exponentialRampToValueAtTime(.0008,t+.16);g.connect(A.pan(A.music,.25));o.start(t);o.stop(t+.2);},
  slap(A,t,n,d,v){const c=A.ctx,f=A.hz(n),g=c.createGain(),lp=c.createBiquadFilter();lp.type='lowpass';lp.Q.value=6;lp.frequency.setValueAtTime(2200,t);lp.frequency.exponentialRampToValueAtTime(380,t+.12);
   const o=c.createOscillator();o.type='square';o.frequency.value=f;o.connect(lp);lp.connect(g);const dd=Math.min(d,.3);g.gain.setValueAtTime(.18*v,t);g.gain.setTargetAtTime(.0001,t+dd*.6,.04);g.connect(A.music);o.start(t);o.stop(t+dd+.2);
   A.tone(t,f,dd+.05,'sine',.2*v,A.music,.004);},
  glock(A,t,n,d,v){const f=A.hz(n);A.tone(t,f,.5,'sine',.07*v,A.pan(A.music,-.3),.002);A.tone(t,f*4.07,.18,'sine',.02*v,A.pan(A.music,-.3),.001);},
  // LA: breathy whistle lead with glide
  whistle(A,t,n,d,v){const c=A.ctx,f=A.hz(n),o=c.createOscillator(),g=c.createGain();o.type='sine';const from=A._lastW?A.hz(A._lastW):f;A._lastW=n;o.frequency.setValueAtTime(from,t);o.frequency.exponentialRampToValueAtTime(f,t+.045);
   const lfo=c.createOscillator(),lg=c.createGain();lfo.frequency.value=6.2;lg.gain.setValueAtTime(0,t);lg.gain.linearRampToValueAtTime(f*.018,t+.2);lfo.connect(lg);lg.connect(o.frequency);lfo.start(t);lfo.stop(t+d+.2);
   A.env(g,t,.03,.17*v,d,.85);o.connect(g);g.connect(A.music);g.connect(A.echo);o.start(t);o.stop(t+d+.25);A.nz(t,.06,.012*v,5200,'bandpass',A.music,2);},
  // FM electric piano
  ep(A,t,n,d,v){const c=A.ctx,f=A.hz(n),car=c.createOscillator(),mod=c.createOscillator(),mg=c.createGain(),g=c.createGain();car.frequency.value=f;mod.frequency.value=f;mg.gain.setValueAtTime(f*1.6,t);mg.gain.exponentialRampToValueAtTime(f*.08,t+.4);mod.connect(mg);mg.connect(car.frequency);
   g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.05*v,t+.006);g.gain.exponentialRampToValueAtTime(.0008,t+Math.max(.35,d*1.2));car.connect(g);g.connect(A.pan(A.music,-.2));car.start(t);mod.start(t);car.stop(t+d*1.2+.4);mod.stop(t+d*1.2+.4);},
  round(A,t,n,d,v){const c=A.ctx,f=A.hz(n),o=c.createOscillator(),g=c.createGain(),lp=c.createBiquadFilter();o.type='triangle';o.frequency.value=f;lp.type='lowpass';lp.frequency.value=600;o.connect(lp);lp.connect(g);
   g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.3*v,t+.01);g.gain.setTargetAtTime(.0001,t+d*.8,.05);g.connect(A.music);o.start(t);o.stop(t+d+.3);},
  // Japan: koto-ish pluck with a little pitch drop
  koto(A,t,n,d,v){const c=A.ctx,f=A.hz(n),o=c.createOscillator(),g=c.createGain(),lp=c.createBiquadFilter();o.type='sawtooth';o.frequency.setValueAtTime(f*1.018,t);o.frequency.exponentialRampToValueAtTime(f,t+.04);
   lp.type='lowpass';lp.Q.value=2;lp.frequency.setValueAtTime(4800,t);lp.frequency.exponentialRampToValueAtTime(700,t+.35);o.connect(lp);lp.connect(g);g.gain.setValueAtTime(.14*v,t);g.gain.exponentialRampToValueAtTime(.0008,t+.9);g.connect(A.music);g.connect(A.echo);o.start(t);o.stop(t+1);
   A.tone(t,f*2,.3,'triangle',.03*v,A.music,.002);},
  saw8(A,t,n,d,v){const c=A.ctx,f=A.hz(n),o=c.createOscillator(),g=c.createGain(),lp=c.createBiquadFilter();o.type='sawtooth';o.frequency.value=f;lp.type='lowpass';lp.Q.value=8;lp.frequency.setValueAtTime(1400,t);lp.frequency.exponentialRampToValueAtTime(260,t+.16);
   o.connect(lp);lp.connect(g);g.gain.setValueAtTime(.16*v,t);g.gain.exponentialRampToValueAtTime(.0008,t+.2);g.connect(A.music);o.start(t);o.stop(t+.25);A.tone(t,f,.18,'sine',.14*v,A.music,.003);},
  sbrass(A,t,n,d,v){const c=A.ctx,f=A.hz(n),g=c.createGain(),lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.setValueAtTime(900,t);lp.frequency.linearRampToValueAtTime(3000,t+.05);lp.frequency.setTargetAtTime(1200,t+.06,.1);
   for(const dt of[-10,0,10]){const o=c.createOscillator();o.type='sawtooth';o.frequency.value=f;o.detune.value=dt;o.connect(lp);o.start(t);o.stop(t+d+.2);}A.env(g,t,.02,.035*v,d,.7);lp.connect(g);g.connect(A.pan(A.music,.3));},
  // Islands: steel pan (two partials + FM ping) and ukulele strums
  steel(A,t,n,d,v){const c=A.ctx,f=A.hz(n),car=c.createOscillator(),mod=c.createOscillator(),mg=c.createGain(),g=c.createGain();car.frequency.value=f;mod.frequency.value=f*2.01;mg.gain.setValueAtTime(f*.9,t);mg.gain.exponentialRampToValueAtTime(f*.02,t+.25);mod.connect(mg);mg.connect(car.frequency);
   g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.15*v,t+.004);g.gain.exponentialRampToValueAtTime(.0008,t+.75);car.connect(g);g.connect(A.music);g.connect(A.echo);car.start(t);mod.start(t);car.stop(t+.8);mod.stop(t+.8);A.tone(t,f*2,.4,'sine',.03*v,A.music,.002);},
  uke(A,t,n,d,v,ch){const notes=ch||[n];notes.forEach((m,i)=>{const tt=t+i*.016;const c=A.ctx,o=c.createOscillator(),g=c.createGain(),lp=c.createBiquadFilter();o.type='triangle';o.frequency.value=A.hz(m);lp.type='lowpass';lp.frequency.setValueAtTime(3500,tt);lp.frequency.exponentialRampToValueAtTime(900,tt+.12);
   o.connect(lp);lp.connect(g);g.gain.setValueAtTime(.05*v,tt);g.gain.exponentialRampToValueAtTime(.0008,tt+.3);g.connect(A.pan(A.music,.3));o.start(tt);o.stop(tt+.35);});},
  // Lab: bassoon-ish staccato + marimba
  reed(A,t,n,d,v){const c=A.ctx,f=A.hz(n),o=c.createOscillator(),g=c.createGain(),lp=c.createBiquadFilter();o.type='square';o.frequency.value=f;lp.type='lowpass';lp.Q.value=5;lp.frequency.value=1100;o.connect(lp);lp.connect(g);
   A.env(g,t,.015,.15*v,Math.min(d,.22),.6);g.connect(A.music);o.start(t);o.stop(t+Math.min(d,.22)+.25);},
  marimba(A,t,n,d,v){const f=A.hz(n);A.tone(t,f,.32,'sine',.08*v,A.pan(A.music,-.25),.002);A.tone(t,f*3.9,.07,'sine',.025*v,A.pan(A.music,-.25),.001);},
  pizz(A,t,n,d,v){const f=A.hz(n);A.tone(t,f,.22,'triangle',.24*v,A.music,.003);},
 },
 // ---------- drums ----------
 D:{
  k(A,t,v){const c=A.ctx,o=c.createOscillator(),g=c.createGain();o.frequency.setValueAtTime(160,t);o.frequency.exponentialRampToValueAtTime(46,t+.11);g.gain.setValueAtTime(.75*v,t);g.gain.exponentialRampToValueAtTime(.0008,t+.36);o.connect(g);g.connect(A.music);o.start(t);o.stop(t+.4);A.nz(t,.008,.25*v,3000,'highpass',A.music);},
  s(A,t,v){A.nz(t,.17,.3*v,1900,'bandpass',A.music,.8);A.tone(t,210,.09,'triangle',.18*v,A.music,.002,150);},
  c(A,t,v){for(const dt of[0,.011,.024])A.nz(t+dt,dt===.024?.14:.02,.28*v,1250,'bandpass',A.pan(A.music,.1),1.2);},
  h(A,t,v){A.nz(t,.035,.07*v,8500,'highpass',A.pan(A.music,.35));},
  o(A,t,v){A.nz(t,.2,.06*v,7800,'highpass',A.pan(A.music,.35));},
  sh(A,t,v){A.nz(t,.05,.045*v,6200,'bandpass',A.pan(A.music,-.35),1.5);},
  tb(A,t,v){A.nz(t,.13,.06*v,9500,'highpass',A.pan(A.music,-.2));A.tone(t,7200,.05,'square',.006*v,A.music);},
  cb(A,t,v){A.tone(t,562,.22,'square',.035*v,A.music,.001);A.tone(t,845,.22,'square',.03*v,A.music,.001);},
  wb(A,t,v){A.tone(t,1250,.06,'sine',.16*v,A.pan(A.music,.3),.001);},
  wl(A,t,v){A.tone(t,880,.07,'sine',.16*v,A.pan(A.music,-.3),.001);},
  tk(A,t,v){A.tone(t,118,.5,'sine',.55*v,A.music,.002,68);A.nz(t,.12,.18*v,400,'lowpass',A.music);},
  th(A,t,v){A.tone(t,190,.28,'sine',.4*v,A.music,.002,120);},
  bg(A,t,v){A.tone(t,330,.12,'sine',.22*v,A.pan(A.music,.25),.001,290);},
  bl(A,t,v){A.tone(t,240,.15,'sine',.22*v,A.pan(A.music,.25),.001,210);},
  rm(A,t,v){A.tone(t,1700,.03,'triangle',.12*v,A.music,.001);A.nz(t,.02,.1*v,3500,'bandpass',A.music);},
  sn(A,t,v){A.tone(t,2600,.012,'square',.05*v,A.music);A.nz(t,.05,.2*v,3200,'bandpass',A.music,1);A.nz(t+.075,.06,.16*v,2400,'bandpass',A.music,1);},// camera "snap" hook
  cr(A,t,v){A.nz(t,1.2,.1*v,5000,'highpass',A.music);},
 },
 // ---------- songs ----------
 parse(s){return s.trim().split(/\s+/);},
 nn(x){const m=x.match(/^([A-G])(#|b)?(\d)$/);if(!m)return null;return 12*(+m[3]+1)+{C:0,D:2,E:4,F:5,G:7,A:9,B:11}[m[1]]+(m[2]==='#'?1:m[2]==='b'?-1:0);},
 chord(sym){const m=sym.match(/^([A-G])(#|b)?(.*)$/);let r={C:0,D:2,E:4,F:5,G:7,A:9,B:11}[m[1]]+(m[2]==='#'?1:m[2]==='b'?-1:0);r=(r+12)%12;const q=m[3];
  const iv={'':[0,4,7],'m':[0,3,7],'7':[0,4,7,10],'m7':[0,3,7,10],'maj7':[0,4,7,11],'sus':[0,5,7],'add9':[0,4,7,14],'6':[0,4,7,9]}[q]||[0,4,7];
  const base=r<5?60+r:48+r;return{root:r,notes:iv.map(i=>base+i),bass:36+r};},
 // lead strings are 8th-note tokens; "A5/B5" = two 16ths; "-" holds
 seq(s){const T=this.parse(s);const out=[];T.forEach((x,i)=>{if(x==='-'){out.push('-','-');return;}if(x==='.'){out.push('.','.');return;}const p=x.split('/');if(p.length===2){out.push(this.nn(p[0]),this.nn(p[1]));}else{out.push(this.nn(x),'-');}});return out;},
 T:{},
 defTracks(){const S=s=>this.seq(s);
  this.T={
   // "Say Cheese!" — B-flat major, I-iii-IV-V / I-vi-ii-V, slap bass + offbeat brass stabs
   title:{bpm:136,swing:0,li:'brass',ci:'stab',bassI:'slap',gl:'glock',
    chords:['Bb','Dm','Eb','F','Bb','Gm','Cm7','F7','Eb','F','Dm','Gm','Cm','F','Bb','Bb'],
    lead:S('D5 F5 . Bb5 - A5 F5 . A5 - F5 D5 . F5 A5 . G5 . Bb5 G5 Eb5 . G5 F5 F5 - - . C5 D5 Eb5 E5 '+
      'F5 . D5 F5 Bb5 . A5 Bb5 D6 - Bb5 G5 . D5 G5 Bb5 C6 . Bb5 A5 G5 . Eb5 G5 F5 - A5 - C6 - Eb6 - '+
      'G5 G5 . G5 Bb5 . G5 . A5 A5 . A5 C6 . A5 . F5 . A5 D6 . A5 F5 . G5 - Bb5 - D6 - . . '+
      'Eb6 . D6 C6 . Bb5 C6 . D6 . C6 Bb5 . A5 Bb5 C6 Bb5 - - - F5 - D5 - Bb4 . . Bb4 . . F5 .'),
    glk:S('. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . '+
      '. . . . . . Bb5/Eb6 G6 . . . . . . C6/F6 A6 . . . . . . A5/D6 F6 . . . . . . Bb5/D6 G6 . . . . . . G5/C6 Eb6 . . . . . . A5/C6 F6 . . . . F6 . Bb6 . . . D7 . . . . .'),
    bass:'R.ORF.O.R.OR.FOA',comp:'..x...x...x...xx',
    dr:{k:'x.....x.x.....x.',c:'....x.......x...',h:'xxXxxxXxxxXxxxXx',tb:'....x.......x...',o:'..............x.'},
    fill:{k:'x.....x.x.......',s:'........x.x.xxxx',c:'....x...........',sn:'..............x.'},snapBars:[3,11]},
   // "Boardwalk Cruise" — A-flat major, swung 16ths, whistle + FM keys
   la:{bpm:110,swing:.14,li:'whistle',ci:'ep',bassI:'round',gl:'marimba',
    chords:['Abmaj7','Fm7','Dbmaj7','Eb7','Abmaj7','Cm7','Dbmaj7','Eb7','Abmaj7','Fm7','Dbmaj7','Eb7','Abmaj7','Cm7','Dbmaj7','Eb7'],
    lead:S('Eb5 - C5 Eb5 . F5 Eb5 C5 Ab5 - - . G5 F5 Eb5 . F5 - Db5 F5 . Ab5 G5 F5 G5 - - - Bb4 C5 Db5 D5 '+
      'Eb5 - C5 Eb5 . Ab5 Bb5 C6 Bb5 - G5 Eb5 . G5 Bb5 . Ab5 - F5 Db5 . F5 Eb5 Db5 C5 - - - . . . . '+
      'C6 . Bb5 Ab5 . Eb5 . C5 Eb5 F5 Ab5 . C6 . Bb5 Ab5 F5 . Ab5 Db6 . C6 . Ab5 Bb5 - G5 . Eb5 - Db5 . '+
      'C5 Eb5 Ab5 C6 Eb6 - C6 . Bb5 - G5 . Eb5 . G5 . Ab5 . F5 . Db5 . Eb5 F5 Ab5 - - - . . . .'),
    bass:'R...R.O...R.F.A.',comp:'.x..x.x..x..x...',
    dr:{k:'x..x....x.x.....',s:'....x.......x...',h:'x.x.x.x.x.x.x.x.',sh:'xxxxxxxxxxxxxxxx',c:'............x...'},
    fill:{k:'x..x....x.......',s:'....x.......x.xx',h:'x.x.x.x.x.x.....',c:'............x.x.'},snapBars:[7]},
   // "Scramble Dash" — D-flat major "royal road" IV-V-iii-vi, koto pluck + synth brass
   jp:{bpm:142,swing:0,li:'koto',ci:'sbrass',bassI:'saw8',gl:'glock',
    chords:['Gbmaj7','Ab','Fm7','Bbm','Ebm7','Ab7','Db','Db','Gbmaj7','Ab','Fm7','Bbm','Ebm7','Ab7','Db','Db'],
    lead:S('Bb5 . Ab5 Bb5 . Db6 Bb5 Ab5 F5 . Eb5 F5 Ab5 . Eb5 . Ab5 . F5 Eb5 . Db5 Eb5 F5 Db5 - - . Bb4 Db5 Eb5 F5 '+
      'Gb5 . F5 Gb5 . Bb5 Ab5 Gb5 F5 . Eb5 F5 . Ab5 C6 Eb6 Db6 - - . Ab5 . F5 . Ab5 Bb5 Ab5 F5 Eb5 . Db5 . '+
      'Db6 . Bb5 . Ab5 . Gb5 Ab5 Bb5 . Ab5 . F5 . Eb5 F5 Ab5 . C6 . Ab5 . F5 Ab5 Bb5 - - - Db6 . Bb5 . '+
      'Gb5 . Bb5 Db6 . Bb5 Gb5 . Ab5 . C6 Eb6 . C6 Ab5 . F6 - Eb6 Db6 . Bb5 Ab5 F5 Db6 - - - . . . .'),
    bass:'R.ORR.ORR.ORR.OR',comp:'x..x..x...x.x...',
    dr:{k:'x...x..x..x.x...',s:'....x.......x...',h:'x.x.x.x.x.x.x.x.',o:'..............x.',tb:'..x...x...x...x.'},
    fill:{k:'x...x..x........',s:'....x...........',tk:'........x.x.x.x.',th:'.........x.x.x.x'},snapBars:[7,15]},
   // "Aloha Ride" — E major one-drop, steel pan + ukulele + bongos
   tr:{bpm:106,swing:.1,li:'steel',ci:'uke',bassI:'round',gl:'marimba',
    chords:['E','C#m','A','B7','E','G#m','A','B7','E','C#m','A','B7','E','G#m','A','B7'],
    lead:S('B5 . G#5 . E5 . G#5 B5 C#6 - B5 . G#5 . E5 . A5 . C#6 . E6 . C#6 A5 B5 - - . F#5 G#5 A5 . '+
      'G#5 . B5 . E6 . D#6 C#6 B5 - G#5 . D#5 . G#5 . A5 . F#5 . C#6 . B5 A5 F#5 - - - . . D#5 E5 '+
      'E6 . D#6 . B5 . G#5 . G#5 . B5 C#6 . B5 G#5 . F#5 . A5 . C#6 . E6 . D#6 - C#6 . B5 . A5 . '+
      'G#5 B5 E6 . B5 . G#5 . D#6 - B5 . G#5 . B5 . C#6 . A5 . F#5 . A5 B5 E6 - - - . . . .'),
    bass:'R.....O.F...R.A.',comp:'..x...x...x...x.',
    dr:{k:'........x.......',rm:'........x.......',sh:'xxxxxxxxxxxxxxxx',bg:'.x..x....x..x...',bl:'...x..x.x....x.x',cb:'x...............'},
    fill:{k:'........x.......',rm:'........x...x...',bg:'.x..x....x.xx.xx',bl:'...x..x.x.x.x...'},snapBars:[7]},
   // "Professor's Lab" — G minor, staccato reed + marimba + woodblocks
   lab:{bpm:98,swing:.08,li:'reed',ci:'marimba',bassI:'pizz',gl:'glock',
    chords:['Gm','Eb','Cm','D7','Gm','Bb','Cm','D7'],
    lead:S('G4 . Bb4 . D5 . Bb4 . Eb5 . D5 . Bb4 . G4 . C5 . Eb5 . G5 . Eb5 C5 D5 - F#4 . A4 . C5 . '+
      'Bb4 . D5 . G5 . F5 D5 F5 . D5 . Bb4 . D5 F5 Eb5 . C5 . G4 . A4 Bb4 A4 - F#4 - D4 - . .'),
    bass:'R...F...R...O...',comp:'x.x.x.x.x.x.x.x.',arp:1,
    dr:{k:'x.......x.......',wb:'x.......x.......',wl:'....x.......x...',sh:'..x...x...x...x.'},
    fill:{k:'x.......x.......',wb:'x...x...x.x.x.x.',wl:'....x.......x...'},snapBars:[]},
  };
  for(const k in this.T){const tr=this.T[k];tr.steps=tr.chords.length*16;tr.ch=tr.chords.map(c=>this.chord(c));}},
 playMusic(name,force){if(!this.T.title)this.defTracks();if(!this.ctx||this.ctx.state!=='running'){this.pending=name;if(this.ctx&&this.ctx.state==='suspended')this.ctx.resume().then(()=>{if(this.pending){const p=this.pending;this.pending=null;this.playMusic(p,true);}}).catch(()=>{});return;}
  if(this.cur===name&&!force&&this.timer)return;this.cur=name;this.step=0;this.nextT=this.ctx.currentTime+.08;this._lastW=null;
  if(!this.timer)this.timer=setInterval(()=>this.sched(),35);},
 stopMusic(){this.cur=null;},
 sched(){if(!this.cur||!this.ctx)return;const tr=this.T[this.cur];if(!tr)return;const sp=60/tr.bpm/4;
  while(this.nextT<this.ctx.currentTime+.16){const i=this.step%tr.steps,s16=i%16,bar=(i/16)|0;let t=this.nextT;if(s16%2===1)t+=sp*(tr.swing||0)*2;
   const ch=tr.ch[bar];const nextCh=tr.ch[(bar+1)%tr.ch.length];const fillBar=(bar%4)===3;const I=this.I;
   // lead
   const n=tr.lead[i];if(typeof n==='number'){let len=1;while(tr.lead[(i+len)%tr.steps]==='-'&&len<16)len++;I[tr.li](this,t,n,sp*len*.92,1);}
   if(tr.glk){const g=tr.glk[i];if(typeof g==='number')I.glock(this,t,g,sp*2,1.1);}
   // bass
   const bc=tr.bass[s16];if(bc&&bc!=='.'){let m=ch.bass;if(bc==='O')m+=12;else if(bc==='F')m+=7;else if(bc==='A')m=nextCh.bass+(nextCh.bass>ch.bass?-1:1);let len=1;while(tr.bass[s16+len]==='.'&&len<4)len++;I[tr.bassI](this,t,m,sp*len*.9,1);}
   // comp
   if(tr.comp[s16]==='x'){if(tr.arp){const nn=ch.notes;I[tr.ci](this,t,nn[(s16/2|0)%nn.length]+12,sp*2,1);}else if(tr.ci==='uke'){I.uke(this,t,0,0,1,(s16%4===2)?ch.notes:ch.notes.slice().reverse());}else for(const m of ch.notes)I[tr.ci](this,t,m,tr.ci==='sbrass'?sp*2.5:sp*1.5,.9);}
   // drums
   const dr=fillBar&&(bar%8===7||tr.chords.length<=8)?Object.assign({},tr.dr,tr.fill):tr.dr;
   for(const d in dr){const ch2=dr[d][s16];if(ch2==='x'||ch2==='X')this.D[d](this,t,ch2==='X'?1.3:1);}
   if(i===0)this.D.cr(this,t,1);
   if(tr.snapBars&&tr.snapBars.includes(bar)&&s16===14)this.D.sn(this,t,1);
   this.nextT+=sp;this.step++;}},
 // one-shot results jingle (pauses the loop, then resumes it)
 jingle(){if(!this.ctx||this.ctx.state!=='running')return;const prev=this.cur;this.cur=null;const t0=this.ctx.currentTime+.05,sp=60/150/4;const I=this.I;
  const mel=[['Bb4',0,1],['D5',1,1],['F5',2,1],['Bb5',3,3],['A5',6,1],['Bb5',7,1],['C6',8,2],['D6',10,6]];mel.forEach(([n,s,l])=>{I.brass(this,t0+s*sp,this.nn(n),l*sp*.95,1.1);I.glock(this,t0+s*sp,this.nn(n)+12,l*sp,.8);});
  [[0,'k'],[3,'k'],[4,'c'],[6,'k'],[8,'s'],[9,'s'],[10,'k'],[10,'cr']].forEach(([s,d])=>this.D[d](this,t0+s*sp,1));
  for(const m of[58,62,65,70])I.stab(this,t0+10*sp,m,sp*4,1.4);I.slap(this,t0,34,sp*2,1);I.slap(this,t0+10*sp,46,sp*4,1);this.D.sn(this,t0+13*sp,1);
  clearTimeout(this._jt);this._jt=setTimeout(()=>{if(!this.cur&&prev)this.playMusic(prev,true);},2600);},
 // ---- SFX ----
 play(k){if(!this.ctx||this.ctx.state!=='running')return;const t=this.ctx.currentTime;
  switch(k){
   case'ui':this.tone(t,988,.07,'triangle',.14);this.tone(t+.035,1480,.08,'sine',.08);break;
   case'back':this.tone(t,740,.07,'triangle',.12);this.tone(t+.045,494,.1,'triangle',.1);break;
   case'shutter':this.tone(t,2600,.012,'square',.08);this.nz(t,.05,.5,3000,'bandpass');this.nz(t+.075,.06,.4,2200,'bandpass');break;
   case'wind':this.nz(t,.25,.12,900,'bandpass');this.tone(t,300,.25,'sawtooth',.03,null,.01,600);break;
   case'throw':this.nz(t,.25,.25,1200,'bandpass');this.tone(t,520,.2,'sine',.08,null,.01,240);break;
   case'thud':this.tone(t,170,.15,'sine',.4,null,.002,70);break;
   case'bonk':this.tone(t,620,.12,'triangle',.22,null,.002,300);this.tone(t+.07,1040,.18,'sine',.14);break;
   case'whistle':this.tone(t,1400,.16,'sine',.25,null,.02,2300);this.tone(t+.19,2300,.32,'sine',.25,null,.02,1500);break;
   case'pop':this.tone(t,320,.1,'sine',.35,null,.002,950);this.nz(t,.05,.2,4000);break;
   case'boing':this.tone(t,190,.33,'sine',.3,null,.005,720);break;
   case'nom':for(let i=0;i<3;i++)this.tone(t+i*.12,280+i*25,.08,'triangle',.16);break;
   case'cash':this.tone(t,this.hz(88),.06,'square',.08);this.tone(t+.06,this.hz(96),.32,'triangle',.16);this.tone(t+.06,this.hz(100),.26,'sine',.09);this.nz(t+.05,.12,.12,6000);break;
   case'yay':[74,78,81,86].forEach((n,i)=>this.tone(t+i*.055,this.hz(n),.17,'triangle',.17));break;
   case'secret':[70,74,77,81,82,86,89,94].forEach((n,i)=>this.tone(t+i*.065,this.hz(n),.3,'sine',.12));this.nz(t,.6,.08,7000);break;
   case'tick':this.tone(t,1300+Math.random()*200,.035,'triangle',.1);break;
   case'stamp':this.tone(t,90,.3,'sine',.6,null,.002,40);this.nz(t,.15,.4,600,'lowpass');break;
   case'fanfare':[70,74,77,82,77,82,86].forEach((n,i)=>this.tone(t+i*.1,this.hz(n),i===6?.7:.18,'triangle',.15));break;
   case'notes':[78,81,85,81,78].forEach((n,i)=>this.tone(t+i*.16,this.hz(n),.24,'sine',.15));break;
   case'zzz':this.tone(t,200,.4,'sine',.06,null,.1,160);break;
   case'confetti':for(let i=0;i<6;i++)this.nz(t+i*.04,.06,.2,5000+i*500);this.tone(t,800,.3,'triangle',.1,null,.002,1600);break;
   case'horn':this.tone(t,466,.45,'sawtooth',.1,null,.02,554);break;
   case'film':this.tone(t,300,.3,'triangle',.12,null,.01,150);break;
  }},
};
