'use strict';
// PincoPop audio: an original Web Audio sound engine written for this app only.
// Every clip gets its own seeded song (style + key + tempo + generated hook), plus synthesized SFX and character voice blips.
const AU=(()=>{
 let ctx=null,master,comp,musicBus,sfxBus,verb,verbIn,noise,unlocked=false,muted=true,want=true;
 let play=null; // current song player
 const NOTE=n=>440*Math.pow(2,(n-69)/12);
 function rng(seed){let s=(seed*9301+49297)%233280||7;return()=>{s=(s*16807)%2147483647;return(s-1)/2147483646}}
 function init(){
  if(ctx)return true;const C=window.AudioContext||window.webkitAudioContext;if(!C)return false;
  try{if(navigator.audioSession)navigator.audioSession.type='playback'}catch(e){}
  ctx=new C();
  master=ctx.createGain();master.gain.value=0;master.connect(ctx.destination);
  comp=ctx.createDynamicsCompressor();comp.threshold.value=-14;comp.knee.value=10;comp.ratio.value=4;comp.attack.value=.003;comp.release.value=.2;comp.connect(master);
  musicBus=ctx.createGain();musicBus.gain.value=.62;musicBus.connect(comp);
  sfxBus=ctx.createGain();sfxBus.gain.value=.9;sfxBus.connect(comp);
  const len=ctx.sampleRate*1.5;noise=ctx.createBuffer(1,len,ctx.sampleRate);const d=noise.getChannelData(0);for(let i=0;i<len;i++)d[i]=Math.random()*2-1;
  // small plate reverb from a decaying noise impulse
  verb=ctx.createConvolver();const il=ctx.sampleRate*1.4,ib=ctx.createBuffer(2,il,ctx.sampleRate);
  for(let ch=0;ch<2;ch++){const x=ib.getChannelData(ch);for(let i=0;i<il;i++)x[i]=(Math.random()*2-1)*Math.pow(1-i/il,3.2)}
  verb.buffer=ib;verbIn=ctx.createGain();verbIn.gain.value=.22;verbIn.connect(verb);const vo=ctx.createGain();vo.gain.value=.5;verb.connect(vo);vo.connect(comp);
  return true}
 // iOS: a silent looping media element moves the audio session to "playback" so the ring/silent switch does not mute us.
 let silentEl=null;
 function silentWav(){const sr=8000,n=800,b=new ArrayBuffer(44+n),v=new DataView(b);const w=(o,s)=>{for(let i=0;i<s.length;i++)v.setUint8(o+i,s.charCodeAt(i))};
  w(0,'RIFF');v.setUint32(4,36+n,true);w(8,'WAVE');w(12,'fmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,1,true);v.setUint32(24,sr,true);v.setUint32(28,sr,true);v.setUint16(32,1,true);v.setUint16(34,8,true);w(36,'data');v.setUint32(40,n,true);for(let i=0;i<n;i++)v.setUint8(44+i,128);
  let s='';const u=new Uint8Array(b);for(let i=0;i<u.length;i++)s+=String.fromCharCode(u[i]);return 'data:audio/wav;base64,'+btoa(s)}
 function unlock(){
  if(!init())return;
  if(ctx.state!=='running')ctx.resume().catch(()=>{});
  if(!unlocked){unlocked=true;try{const b=ctx.createBuffer(1,1,22050),s=ctx.createBufferSource();s.buffer=b;s.connect(ctx.destination);s.start(0)}catch(e){}
   try{if(!silentEl){silentEl=document.createElement('audio');silentEl.setAttribute('playsinline','');silentEl.loop=true;silentEl.src=silentWav();silentEl.volume=0.01}silentEl.play().catch(()=>{})}catch(e){}}
  setMuted(!want);if(!unlock._vp){unlock._vp=1;setTimeout(()=>{try{(window.CLIPS||[]).forEach(voxPreload)}catch(e){}},1200)}}
 function setMuted(m){muted=m;if(!ctx)return;const t=ctx.currentTime;master.gain.cancelScheduledValues(t);master.gain.setTargetAtTime(m?0:1,t,.04)}
 // ---------- instruments ----------
 function env(g,t,a,peak,dec,sus,rel,end){g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(peak,t+a);g.gain.setTargetAtTime(sus*peak,t+a,dec);g.gain.setTargetAtTime(0,end,rel)}
 function osc(type,f,t,end,dest,detune){const o=ctx.createOscillator();o.type=type;o.frequency.setValueAtTime(f,t);if(detune)o.detune.value=detune;o.connect(dest);o.start(t);o.stop(end+.5);return o}
 function gain(v,dest){const g=ctx.createGain();g.gain.value=v;g.connect(dest);return g}
 function filt(type,f,q,dest){const b=ctx.createBiquadFilter();b.type=type;b.frequency.value=f;if(q!=null)b.Q.value=q;b.connect(dest);return b}
 function nz(t,dur,dest,rate){const s=ctx.createBufferSource();s.buffer=noise;if(rate)s.playbackRate.value=rate;s.connect(dest);s.start(t,Math.random()*.5,dur+.05);return s}
 const I={
  kick(t,v,bus){const g=gain(0,bus);env(g,t,.002,v*1.1,.09,0,.05,t+.25);const o=osc('sine',150,t,t+.3,g);o.frequency.exponentialRampToValueAtTime(42,t+.12)},
  kick808(t,v,bus){const g=gain(0,bus);env(g,t,.002,v*1.1,.35,0,.1,t+.7);const o=osc('sine',120,t,t+.8,g);o.frequency.exponentialRampToValueAtTime(38,t+.1)},
  snare(t,v,bus){const g=gain(0,bus);env(g,t,.001,v*.55,.06,0,.04,t+.18);nz(t,.2,filt('highpass',1600,.7,g));const g2=gain(0,bus);env(g2,t,.001,v*.35,.04,0,.03,t+.1);osc('triangle',190,t,t+.12,g2)},
  clap(t,v,bus){for(let i=0;i<3;i++){const g=gain(0,bus);const tt=t+i*.011;env(g,tt,.001,v*.45,i<2?.01:.07,0,.04,tt+(i<2?.02:.2));nz(tt,.22,filt('bandpass',1300,1.2,g))}},
  hat(t,v,bus,open){const g=gain(0,bus);env(g,t,.001,v*.22,open?.09:.018,0,.03,t+(open?.25:.05));nz(t,.3,filt('highpass',7500,.6,g))},
  shaker(t,v,bus){const g=gain(0,bus);env(g,t,.012,v*.12,.04,0,.03,t+.08);nz(t,.12,filt('bandpass',6000,1.5,g))},
  wood(t,v,bus,f){const g=gain(0,bus);env(g,t,.001,v*.5,.03,0,.02,t+.07);osc('sine',f||1100,t,t+.1,g);const g2=gain(0,bus);env(g2,t,.001,v*.25,.015,0,.01,t+.04);osc('square',(f||1100)*2.3,t,t+.05,g2)},
  rim(t,v,bus){const g=gain(0,bus);env(g,t,.001,v*.4,.02,0,.01,t+.05);nz(t,.05,filt('bandpass',3200,4,g));osc('triangle',820,t,t+.05,g)},
  bass(t,f,d,v,bus){const g=gain(0,bus);env(g,t,.004,v*.62,.12,.45,.05,t+d);const lp=filt('lowpass',f*5,2,g);lp.frequency.setValueAtTime(f*9,t);lp.frequency.exponentialRampToValueAtTime(f*2.2,t+.18);osc('sawtooth',f,t,t+d,lp);osc('sine',f/2,t,t+d,g)},
  sub(t,f,d,v,bus,slide){const g=gain(0,bus);env(g,t,.004,v*.9,.5,.6,.06,t+d);const o=osc('sine',f,t,t+d,g);if(slide)o.frequency.exponentialRampToValueAtTime(slide,t+Math.min(d,.25));const g2=gain(0,bus);env(g2,t,.002,v*.25,.05,0,.04,t+.12);osc('triangle',f*2,t,t+.15,g2)},
  tuba(t,f,d,v,bus){const g=gain(0,bus);env(g,t,.03,v*.55,.15,.6,.05,t+d*.9);const lp=filt('lowpass',f*3.2,4,g);osc('sawtooth',f,t,t+d,lp);osc('square',f*.5,t,t+d,gain(.25,lp))},
  keys(t,f,d,v,bus){const g=gain(0,bus);env(g,t,.003,v*.25,.5,.25,.18,t+d);const tr=ctx.createGain();tr.connect(g);const lfo=osc('sine',5.2,t,t+d,ctx.createGain());const lg=ctx.createGain();lg.gain.value=.25;lfo.disconnect();lfo.connect(lg);lg.connect(tr.gain);osc('sine',f,t,t+d,tr);const g2=gain(0,tr);env(g2,t,.001,.5,.07,0,.05,t+.2);osc('sine',f*2,t,t+.3,g2);gain(.3,verbIn);g.connect(verbIn)},
  pluck(t,f,d,v,bus){const g=gain(0,bus);env(g,t,.002,v*.42,.16,0,.08,t+Math.min(d,.6));const lp=filt('lowpass',f*6,1,g);lp.frequency.exponentialRampToValueAtTime(f*1.5,t+.25);osc('triangle',f,t,t+.7,lp);osc('sawtooth',f*1.003,t,t+.7,gain(.35,lp));g.connect(verbIn)},
  bell(t,f,d,v,bus){const g=gain(0,bus);env(g,t,.001,v*.3,.35,0,.2,t+1.2);osc('sine',f,t,t+1.3,g);const g2=gain(0,bus);env(g2,t,.001,v*.12,.08,0,.05,t+.3);osc('sine',f*3.5,t,t+.4,g2);g.connect(verbIn)},
  marimba(t,f,d,v,bus){const g=gain(0,bus);env(g,t,.001,v*.45,.12,0,.06,t+.4);osc('sine',f,t,t+.5,g);const g2=gain(0,bus);env(g2,t,.001,v*.18,.02,0,.02,t+.06);osc('sine',f*4,t,t+.1,g2);g.connect(verbIn)},
  musicbox(t,f,d,v,bus){const g=gain(0,bus);env(g,t,.001,v*.28,.5,0,.3,t+1.4);osc('sine',f*2,t,t+1.5,g);const g2=gain(0,bus);env(g2,t,.001,v*.07,.03,0,.02,t+.08);osc('triangle',f*8,t,t+.1,g2);g.connect(verbIn)},
  kazoo(t,f,d,v,bus){const g=gain(0,bus);env(g,t,.02,v*.22,.1,.8,.04,t+d*.92);const bp=filt('bandpass',1250,2.2,g);const lp=filt('lowpass',3800,.7,bp);const o=osc('sawtooth',f*.97,t,t+d,lp);o.frequency.linearRampToValueAtTime(f,t+.05);const vib=ctx.createOscillator();vib.frequency.value=6;const vg=ctx.createGain();vg.gain.value=f*.012;vib.connect(vg);vg.connect(o.frequency);vib.start(t);vib.stop(t+d+.3)},
  stab(t,f,d,v,bus){const g=gain(0,bus);env(g,t,.004,v*.16,.12,.3,.06,t+d);const lp=filt('lowpass',2400,3,g);lp.frequency.setValueAtTime(5200,t);lp.frequency.exponentialRampToValueAtTime(900,t+.22);[-14,-5,5,14].forEach(dt=>osc('sawtooth',f,t,t+d,lp,dt));g.connect(verbIn)},
  lead(t,f,d,v,bus){const g=gain(0,bus);env(g,t,.008,v*.2,.2,.5,.08,t+d);const lp=filt('lowpass',f*5,1.4,g);osc('square',f,t,t+d,lp);osc('sine',f*2,t,t+d,gain(.4,lp));g.connect(verbIn)},
  harpsi(t,f,d,v,bus){const g=gain(0,bus);env(g,t,.001,v*.22,.22,0,.08,t+.6);const hp=filt('highpass',f*.8,.7,g);osc('sawtooth',f,t,t+.7,hp);osc('square',f*2.002,t,t+.7,gain(.3,hp));g.connect(verbIn)},
  pad(t,f,d,v,bus){const g=gain(0,bus);env(g,t,.35,v*.07,.6,.8,.4,t+d);const lp=filt('lowpass',1400,.5,g);[-9,0,9].forEach(dt=>osc('sawtooth',f,t,t+d,lp,dt));g.connect(verbIn)},
  sleigh(t,v,bus){for(let i=0;i<3;i++){const tt=t+i*.018,g=gain(0,bus);env(g,tt,.001,v*.09,.03,0,.02,tt+.07);nz(tt,.08,filt('bandpass',8200+i*900,6,g))}},
  vinyl(t,v,bus){const g=gain(0,bus);g.gain.value=.025*v;nz(t,1.4,filt('bandpass',2400,.4,g));for(let i=0;i<5;i++){const tt=t+Math.random()*1.4,g2=gain(0,bus);env(g2,tt,.001,.12*v,.004,0,.003,tt+.012);nz(tt,.012,filt('highpass',3000,.5,g2))}},
  whistle(t,f,d,v,bus){const g=gain(0,bus);env(g,t,.03,v*.2,.2,.7,.05,t+d*.9);const o=osc('sine',f,t,t+d,g);const vib=ctx.createOscillator();vib.frequency.value=5.5;const vg=ctx.createGain();vg.gain.value=f*.01;vib.connect(vg);vg.connect(o.frequency);vib.start(t);vib.stop(t+d+.2);g.connect(verbIn)},
 };
 // ---------- styles (all original patterns) ----------
 // chords as scale-degree roots (0-6) + quality, scales as semitone arrays
 const MAJ=[0,2,4,5,7,9,11],MIN=[0,2,3,5,7,8,10],DOR=[0,2,3,5,7,9,10],MIX=[0,2,4,5,7,9,10];
 const STY={
  chant:{bpm:[98,104],swing:0,fixed:1,scale:[MAJ],root:[55],progs:[[0,0,3,4]],
   drums:{kick:'x...x...x...x...',clap:'....x.......x...',hat:'..x...x...x...x.',shaker:'x.x.x.x.x.x.x.x.'},chord:'stab',crhythm:'................',bass:'bass',brhythm:'x.....x.x.......',lead:'bell',ldens:0},
  food:{bpm:[86,98],swing:.16,scale:[MAJ,DOR],root:[50,52,53,55],progs:[[1,4,0,5],[3,2,1,4],[0,5,3,4],[5,1,4,0]],
   drums:{kick:'x.....x...x.....|x.....x..x......',snare:'....x.......x...',hat:'x.x.x.x.x.x.xxx.',shaker:'..x...x...x...x.'},chord:'keys',crhythm:'x......x..x.....',bass:'bass',brhythm:'x.....x...x..x..',lead:'marimba',ldens:.45},
  comedy:{bpm:[124,138],swing:.0,scale:[MAJ,MIX],root:[53,55,57,58],progs:[[0,3,4,0],[0,5,1,4],[0,4,5,3],[3,0,4,4]],
   drums:{kick:'x.......x.......',snare:'....x.......x...',wood:'..x...x...x...xx',hat:'..x...x...x...x.'},chord:'stab',crhythm:'..x...x...x...x.',bass:'tuba',brhythm:'x.......x.......',lead:'kazoo',ldens:.5},
  parent:{bpm:[78,92],swing:.08,scale:[MAJ],root:[57,58,60,62],progs:[[0,4,5,3],[0,3,0,4],[5,3,0,4],[0,2,3,4]],
   drums:{kick:'x...............|x.......x.......',shaker:'x.xxx.xxx.xxx.xx',rim:'........x.......'},chord:'pluck',crhythm:'x..x..x.x..x..x.',bass:'sub',brhythm:'x.......x.......',lead:'musicbox',ldens:.4},
  makeup:{bpm:[116,124],swing:0,scale:[MIN,DOR,MAJ],root:[52,53,55,56],progs:[[5,3,0,4],[0,5,2,6],[3,4,0,0],[5,6,0,0]],
   drums:{kick:'x...x...x...x...',clap:'....x.......x...',hat:'..x...x...x...x.',ohat:'......x.......x.'},chord:'stab',crhythm:'.x..x..x..x..x..',bass:'sub',brhythm:'..x...x...x...x.',lead:'bell',ldens:.42,pump:1},
  villain:{bpm:[136,144],swing:0,scale:[MIN],root:[48,50,51,53],progs:[[0,5,6,4],[0,0,5,4],[0,3,5,4]],
   drums:{kick808:'x......x..x.....|x.........x.x...',clap:'........x.......',hat:'x.x.x.x.xxx.x.xx'},chord:'harpsi',crhythm:'x..x..x...x..x..',bass:'sub',brhythm:'x......x..x.....',lead:'harpsi',ldens:.35,half:1},
  sweet:{bpm:[96,104],swing:.1,scale:[MAJ],root:[55,57,59,60],progs:[[0,4,5,3],[3,4,2,5],[0,3,4,3]],
   drums:{kick:'x.......x.x.....',snare:'....x.......x...',hat:'x.x.x.x.x.x.x.x.',shaker:'.x.x.x.x.x.x.x.x'},chord:'keys',crhythm:'x...x...x...x...',bass:'bass',brhythm:'x..x....x..x....',lead:'whistle',ldens:.35},
  xmas:{bpm:[104,114],swing:.18,scale:[MAJ],root:[55,57,60,62],progs:[[0,3,4,0],[0,5,3,4],[0,3,1,4]],
   drums:{kick:'x.......x.......',snare:'....x.......x...',sleigh:'x.xxx.xxx.xxx.xx'},chord:'keys',crhythm:'x...x...x...x...',bass:'bass',brhythm:'x.......x...x...',lead:'bell',ldens:.5},
  lofi:{bpm:[72,80],swing:.3,scale:[DOR,MAJ],root:[50,52,53],progs:[[1,4,0,5],[3,2,5,1],[0,5,3,4]],
   drums:{kick:'x......x..x.....',snare:'....x.......x...',hat:'x.x.x.x.x.x.x.x.',vinyl:'x...............'},chord:'keys',crhythm:'x.......x.......',bass:'sub',brhythm:'x.........x.....',lead:'pluck',ldens:.3},
  synth:{bpm:[96,104],swing:0,scale:[MIN,DOR],root:[50,52,53],progs:[[0,5,6,4],[5,3,0,4],[0,6,5,6]],
   drums:{kick:'x...x...x...x...',snare:'....x.......x...',hat:'..x...x...x...x.'},chord:'stab',crhythm:'x.......x.......',bass:'bass',brhythm:'x.x.x.x.x.x.x.x.',lead:'lead',ldens:.4,pad:1},
  anime:{bpm:[150,162],swing:0,scale:[MAJ,MIN],root:[57,59,60],progs:[[3,4,2,5],[5,3,4,0],[3,4,0,5]],
   drums:{kick:'x...x...x...x...',snare:'....x.......x.x.',hat:'xxxxxxxxxxxxxxxx'},chord:'stab',crhythm:'x..x..x...x..x..',bass:'bass',brhythm:'x.x.x.x.x.x.x.x.',lead:'lead',ldens:.6},
  asmr:{bpm:[64,70],swing:.1,scale:[MAJ],root:[60,62,64],progs:[[0,3,0,4],[0,5,3,4]],
   drums:{shaker:'........x.......'},chord:'keys',crhythm:'x...............',bass:'sub',brhythm:'................',lead:'musicbox',ldens:.22,pad:1},
  clay:{bpm:[108,118],swing:.12,scale:[MAJ,MIX],root:[53,55,57],progs:[[0,4,0,4],[0,3,4,0],[0,1,4,0]],
   drums:{kick:'x.......x.......',wood:'x..x..x.x..x..x.'},chord:'pluck',crhythm:'..x...x...x...x.',bass:'tuba',brhythm:'x.......x.......',lead:'marimba',ldens:.5},
  silent:{bpm:[122,132],swing:.05,scale:[MAJ],root:[55,57,58],progs:[[0,4,0,4],[0,3,4,0],[0,5,1,4]],
   drums:{kick:'x.......x.......',rim:'....x.......x...'},chord:'harpsi',crhythm:'....x.......x...',bass:'bass',brhythm:'x.......x.......',lead:'harpsi',ldens:.65},
  stream:{bpm:[138,146],swing:0,scale:[MIN,DOR],root:[50,53,55],progs:[[0,5,3,4],[0,6,5,4]],
   drums:{kick808:'x.........x.....|x......x..x.....',clap:'........x.......',hat:'x.xxx.x.x.xxx.xx'},chord:'keys',crhythm:'x.......x.......',bass:'sub',brhythm:'x.........x.....',lead:'bell',ldens:.3,half:1},
 };
 function makeSong(style,seed,bpmOverride){
  const S=STY[style]||STY.food,r=rng(seed*13+7);
  const scale=S.scale[Math.floor(r()*S.scale.length)],root=S.root[Math.floor(r()*S.root.length)];
  const bpm=bpmOverride||Math.round(S.bpm[0]+r()*(S.bpm[1]-S.bpm[0]));
  const prog=S.progs[Math.floor(r()*S.progs.length)].slice();if(!S.fixed&&r()<.35){const i=1+Math.floor(r()*3),j=Math.floor(r()*7);prog[i]=j}
  const deg=(d)=>{const o=Math.floor(d/7),i=((d%7)+7)%7;return scale[i]+12*o};
  // generate a 2-bar hook (32 steps) on chord tones, then answer phrase
  const mk=()=>{const notes=[];let cur=Math.floor(r()*3)*2;const dens=S.ldens;
   for(let s=0;s<32;s++){const strong=s%4===0,on=strong?r()<dens+.3:r()<dens*.55;if(!on)continue;
    const bar=Math.floor(s/16),ch=prog[bar];const tones=[ch,ch+2,ch+4,ch+7];
    if(strong){let best=tones[0];for(const tt of tones)if(Math.abs(tt-cur)<Math.abs(best-cur)||r()<.15)best=tt;cur=best}else cur+=r()<.5?(r()<.5?1:-1):(r()<.5?2:-2);
    cur=Math.max(-2,Math.min(11,cur));const len=strong&&r()<.4?3:1;notes.push([s,cur,len])}
   return notes};
  const A=mk(),B=mk();
  const hook=[...A,...B.map(n=>[n[0]+32,n[1],n[2]])];
  return {style,S,scale,root,bpm,prog,deg,hook,step:60/bpm/4,seed}}
 const pat=(p,i)=>{const bars=p.split('|');const b=bars[Math.floor(i/16)%bars.length];return b[i%16]==='x'};
 function playStep(song,i,t,bus){
  const S=song.S,bar=Math.floor(i/16)%4,st=i%16;const sw=(st%2===1)?song.step*S.swing:0;t+=sw;
  const D=S.drums;
  for(const k in D){if(!pat(D[k],i%32))continue;
   if(k==='ohat')I.hat(t,.9,bus,true);else if(k==='hat')I.hat(t,st%4===0?.9:.6,bus);else if(k==='wood')I.wood(t,.8,bus,st%8===6?1500:1050);else I[k](t,1,bus)}
  const ch=song.prog[bar],rootN=song.root+song.deg(ch)-12;
  if(pat(S.crhythm,st)){const tri=[0,2,4,6].map(x=>song.root+song.deg(ch+x));const d=song.step*(S.chord==='keys'?6:2.2);tri.forEach((n,k)=>{if(k<3||S.chord==='keys')I[S.chord](t+k*(S.chord==='pluck'?.012:0),NOTE(n),d,.8,bus)})}
  if(pat(S.brhythm,st)){const alt=(st>=8&&song.style!=='parent'&&song.style!=='villain')?7:0;const f=NOTE(rootN-12+(S.bass==='tuba'&&st>=8?song.deg(ch+4)-song.deg(ch):alt?0:0));
   if(S.bass==='sub')I.sub(t,NOTE(rootN-12),song.step*(song.style==='villain'?5:3),.9,bus,song.style==='villain'&&st===10?NOTE(rootN-10):0);else I[S.bass](t,f,song.step*(S.bass==='tuba'?3:2.5),.9,bus)}
  // lead hook (bars 1-2 = hook A, bars 3-4 = hook B); skip lead in first bar of the very first pass for an intro feel
  const hs=i%64;for(const n of song.hook)if(n[0]===hs){const m=song.root+12+song.deg(n[1]);I[S.lead](t,NOTE(m),song.step*n[2]*1.1,.9,bus)}
  if(S.pad||song.style==='parent'||song.style==='villain'){if(st===0)I.pad(t,NOTE(song.root+song.deg(ch)),song.step*16,.8,bus)}
 }
 // ---------- SFX ----------
 const VOW={a:[800,1200],e:[480,1900],i:[300,2250],o:[480,850],u:[340,750]};
 function singNote(t,o,b){const m=o.m+(VOICE_SHIFT[o.who]||0),f=NOTE(m),d=o.d,amp=(o.a||1)*.16;const F=VOW[o.v]||VOW.a;
  const out=gain(0,b);env(out,t,.035,amp,.25,.85,.06,t+d*.96);
  const f1=filt('bandpass',F[0],5,out),f2=filt('bandpass',F[1],7,gain(.55,out)),f3=filt('bandpass',2800,6,gain(.18,out));
  const src=ctx.createGain();src.gain.value=1;src.connect(f1);src.connect(f2);src.connect(f3);
  const o1=osc('sawtooth',f,t,t+d,src),o2=osc('sawtooth',f,t,t+d,gain(.5,src),7);
  if(o.gl){[o1,o2].forEach(x=>{x.frequency.setValueAtTime(f,t+Math.min(.25,d*.3));x.frequency.exponentialRampToValueAtTime(NOTE(m+o.gl),t+d*.8)})}
  if(d>.45){const lfo=ctx.createOscillator();lfo.frequency.value=o.vib||5.6;const lg=ctx.createGain();lg.gain.setValueAtTime(0,t);lg.gain.linearRampToValueAtTime(f*(o.vib?.03:.018),t+Math.min(1,d*.6));lfo.connect(lg);lg.connect(o1.frequency);lg.connect(o2.frequency);lfo.start(t);lfo.stop(t+d+.2)}
  if(o.c){const g=gain(0,b);env(g,t,.001,amp*.5,.02,0,.01,t+.05);nz(t,.05,filt('bandpass',o.c==='l'?900:300,1.5,g))}
  out.connect(verbIn)}
 const VOICE_SHIFT={pooh:-12,pooping:-12,bronny:-12,asmon:-17,pinco:0,bean:5,prof:-12,max:0};
 const FX={
  sing(t,b,o){(o.who||['pooh']).forEach((w,k)=>singNote(t+k*.008,Object.assign({},o,{who:w,a:(o.a||1)/Math.sqrt((o.who||[1]).length)*(w==='asmon'&&o.grump?.7:1)}),b))},
  boing(t,b){const g=gain(0,b);env(g,t,.005,.5,.15,0,.08,t+.45);const o=osc('sine',180,t,t+.5,g);o.frequency.exponentialRampToValueAtTime(520,t+.08);o.frequency.exponentialRampToValueAtTime(140,t+.4);const vib=ctx.createOscillator();vib.frequency.value=22;const vg=ctx.createGain();vg.gain.value=40;vib.connect(vg);vg.connect(o.frequency);vib.start(t);vib.stop(t+.5)},
  pop(t,b){const g=gain(0,b);env(g,t,.001,.6,.03,0,.02,t+.08);const o=osc('sine',900,t,t+.1,g);o.frequency.exponentialRampToValueAtTime(260,t+.06)},
  whoosh(t,b){const g=gain(0,b);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.55,t+.12);g.gain.linearRampToValueAtTime(0,t+.32);const f=filt('bandpass',400,1.6,g);f.frequency.setValueAtTime(300,t);f.frequency.exponentialRampToValueAtTime(3500,t+.28);nz(t,.35,f)},
  swish(t,b){const g=gain(0,b);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.35,t+.06);g.gain.linearRampToValueAtTime(0,t+.2);const f=filt('highpass',3000,.8,g);nz(t,.22,f)},
  ding(t,b){I.bell(t,NOTE(88),1,1.4,b);I.bell(t+.002,NOTE(95),1,.6,b)},
  chime(t,b){[84,88,91,96].forEach((n,i)=>I.bell(t+i*.06,NOTE(n),.6,.9,b))},
  sparkle(t,b){[96,100,103,108,103].forEach((n,i)=>I.musicbox(t+i*.045,NOTE(n-12),.3,.8,b))},
  cash(t,b){I.bell(t,NOTE(91),1,1,b);I.bell(t+.09,NOTE(96),1,1.2,b);const g=gain(0,b);env(g,t,.001,.4,.05,0,.03,t+.12);nz(t,.12,filt('highpass',5000,1,g))},
  sizzle(t,b,d){d=d||1.2;const g=gain(0,b);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.22,t+.1);g.gain.setValueAtTime(.22,t+d-.2);g.gain.linearRampToValueAtTime(0,t+d);nz(t,d,filt('highpass',4200,.5,g));for(let i=0;i<14;i++){const tt=t+Math.random()*d,g2=gain(0,b);env(g2,tt,.001,.25,.006,0,.005,tt+.02);nz(tt,.02,filt('bandpass',3000+Math.random()*3000,3,g2))}},
  slurp(t,b){const g=gain(0,b);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.5,t+.05);g.gain.linearRampToValueAtTime(0,t+.55);const f=filt('bandpass',500,6,g);f.frequency.setValueAtTime(400,t);f.frequency.exponentialRampToValueAtTime(2200,t+.5);nz(t,.6,f)},
  chomp(t,b){for(let i=0;i<2;i++){const tt=t+i*.12,g=gain(0,b);env(g,tt,.001,.6,.03,0,.02,tt+.08);nz(tt,.08,filt('lowpass',900,1,g));const g2=gain(0,b);env(g2,tt,.001,.3,.02,0,.02,tt+.05);osc('square',140,tt,tt+.06,filt('lowpass',600,1,g2))}},
  gulp(t,b){const g=gain(0,b);env(g,t,.005,.5,.06,0,.04,t+.18);const o=osc('sine',300,t,t+.2,g);o.frequency.exponentialRampToValueAtTime(90,t+.15)},
  slip(t,b){const g=gain(0,b);env(g,t,.01,.3,.3,.7,.05,t+.55);const o=osc('sine',1500,t,t+.6,g);o.frequency.exponentialRampToValueAtTime(260,t+.55)},
  rise(t,b){const g=gain(0,b);env(g,t,.01,.25,.3,.8,.05,t+.5);const o=osc('sine',300,t,t+.6,g);o.frequency.exponentialRampToValueAtTime(1600,t+.5)},
  thud(t,b){const g=gain(0,b);env(g,t,.001,1,.12,0,.05,t+.3);const o=osc('sine',110,t,t+.3,g);o.frequency.exponentialRampToValueAtTime(40,t+.2);const g2=gain(0,b);env(g2,t,.001,.5,.04,0,.03,t+.1);nz(t,.1,filt('lowpass',700,1,g2))},
  splat(t,b){const g=gain(0,b);env(g,t,.001,.7,.07,0,.05,t+.25);const f=filt('lowpass',1800,2,g);f.frequency.exponentialRampToValueAtTime(300,t+.2);nz(t,.25,f)},
  rimshot(t,b){I.snare(t,1,b);I.snare(t+.18,1,b);I.kick(t+.36,1,b);I.hat(t+.36,1.3,b,true);const g=gain(0,b);env(g,t+.36,.001,.35,.4,0,.3,t+1.2);nz(t+.36,1,filt('highpass',6000,.5,g))},
  crickets(t,b){for(let k=0;k<3;k++)for(let i=0;i<4;i++){const tt=t+k*.42+i*.045,g=gain(0,b);env(g,tt,.003,.12,.01,0,.01,tt+.03);osc('sine',4400,tt,tt+.04,g)}},
  laugh(t,b){for(let i=0;i<9;i++){const tt=t+i*.12+Math.random()*.04,g=gain(0,b);env(g,tt,.01,.22,.05,0,.04,tt+.1);const f=filt('bandpass',700+Math.random()*500,3,g);nz(tt,.12,f);osc('sawtooth',180+Math.random()*90,tt,tt+.1,gain(.15,f))}},
  aww(t,b){for(let i=0;i<5;i++){const g=gain(0,b);env(g,t,.15,.08,.5,.8,.2,t+1);const f=filt('bandpass',700,4,g);const o=osc('sawtooth',200+i*23,t,t+1.2,f);o.frequency.linearRampToValueAtTime(150+i*20,t+1)}},
  cheer(t,b){const g=gain(0,b);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.3,t+.2);g.gain.setTargetAtTime(0,t+1,.3);nz(t,1.6,filt('bandpass',1500,.6,g));FX.laugh(t+.1,b)},
  scratch(t,b){const g=gain(0,b);env(g,t,.005,.5,.1,0,.05,t+.3);const f=filt('bandpass',900,3,g);f.frequency.setValueAtTime(1800,t);f.frequency.linearRampToValueAtTime(400,t+.12);f.frequency.linearRampToValueAtTime(1500,t+.25);nz(t,.3,f)},
  kiss(t,b){const g=gain(0,b);env(g,t,.002,.5,.03,0,.02,t+.08);nz(t,.08,filt('bandpass',2500,5,g));const g2=gain(0,b);env(g2,t+.02,.002,.3,.05,0,.04,t+.15);osc('sine',1400,t+.02,t+.15,g2).frequency.exponentialRampToValueAtTime(2400,t+.1)},
  shutter(t,b){FX.pop(t,b);const g=gain(0,b);env(g,t+.05,.001,.4,.03,0,.02,t+.1);nz(t+.05,.06,filt('bandpass',2500,1,g))},
  thunder(t,b){const g=gain(0,b);env(g,t,.005,.9,.5,0,.4,t+1.6);const f=filt('lowpass',600,.5,g);f.frequency.exponentialRampToValueAtTime(120,t+1.4);nz(t,1.6,f,.5)},
  evil(t,b){for(let i=0;i<4;i++){const tt=t+i*.2,g=gain(0,b);env(g,tt,.01,.4,.1,0,.05,tt+.17);const f=filt('bandpass',700,5,g);osc('sawtooth',150-i*8,tt,tt+.2,f);osc('sawtooth',152-i*8,tt,tt+.2,f)}},
  snore(t,b){const g=gain(0,b);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.3,t+.5);g.gain.linearRampToValueAtTime(0,t+1);const f=filt('lowpass',380,6,g);nz(t,1,f);osc('sawtooth',70,t,t+1,gain(.2,f))},
  squeak(t,b){const g=gain(0,b);env(g,t,.003,.4,.06,.5,.03,t+.18);const o=osc('square',1800,t,t+.2,filt('bandpass',2200,3,g));o.frequency.linearRampToValueAtTime(2600,t+.1);o.frequency.linearRampToValueAtTime(1700,t+.18)},
  cry(t,b){for(let i=0;i<2;i++){const tt=t+i*.5,g=gain(0,b);env(g,tt,.05,.22,.3,.7,.1,tt+.42);const f=filt('bandpass',1100,5,g);const o=osc('sawtooth',520,tt,tt+.45,f);o.frequency.linearRampToValueAtTime(680,tt+.15);o.frequency.linearRampToValueAtTime(430,tt+.42)}},
  giggle(t,b){for(let i=0;i<6;i++){const tt=t+i*.085,g=gain(0,b);env(g,tt,.005,.2,.03,0,.02,tt+.07);const f=filt('bandpass',1500,3,g);osc('triangle',700+i*40+(i%2)*120,tt,tt+.08,f)}},
  spray(t,b){const g=gain(0,b);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.3,t+.02);g.gain.linearRampToValueAtTime(0,t+.35);nz(t,.4,filt('highpass',5500,.5,g))},
  drop(t,b){I.kick808(t,1.2,b);FX.sparkle(t,b);const g=gain(0,b);g.gain.setValueAtTime(.3,t);g.gain.exponentialRampToValueAtTime(.001,t+1.2);nz(t,1.2,filt('highpass',8000,.5,g))},
  riser(t,b){const g=gain(0,b);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.3,t+.9);g.gain.linearRampToValueAtTime(0,t+1);const f=filt('bandpass',500,2,g);f.frequency.exponentialRampToValueAtTime(6000,t+.95);nz(t,1,f)},
  tick(t,b){I.wood(t,.7,b,1800)},
  coin(t,b){I.bell(t,NOTE(95),.3,.8,b);I.bell(t+.07,NOTE(100),.4,.9,b)},
  bonk(t,b){I.wood(t,1.3,b,520);FX.boing(t+.03,b)},
  yawn(t,b){const g=gain(0,b);env(g,t,.2,.22,.5,.8,.2,t+1.1);const f=filt('bandpass',800,4,g);f.frequency.linearRampToValueAtTime(400,t+1.1);const o=osc('sawtooth',260,t,t+1.2,f);o.frequency.linearRampToValueAtTime(170,t+1.1)},
  bells(t,b){for(let i=0;i<8;i++){const tt=t+i*.05;I.sleigh(tt,1.4,b)}I.bell(t,NOTE(91),.6,.8,b)},
  type(t,b){for(let i=0;i<6;i++){const tt=t+i*.07+Math.random()*.02,g=gain(0,b);env(g,tt,.001,.3,.01,0,.008,tt+.025);nz(tt,.025,filt('bandpass',2500+Math.random()*1500,2,g))}},
  tape(t,b){FX.thud(t,b);const g=gain(0,b);env(g,t+.05,.001,.25,.05,0,.04,t+.2);nz(t+.05,.15,filt('bandpass',1200,2,g))},
  pour(t,b){const g=gain(0,b);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.25,t+.1);g.gain.linearRampToValueAtTime(0,t+1.2);const f=filt('bandpass',900,3,g);f.frequency.linearRampToValueAtTime(1800,t+1.1);nz(t,1.25,f)},
  notif(t,b){const g=gain(0,b);env(g,t,.002,.12,.05,0,.03,t+.12);osc('sine',1320,t,t+.12,g)},
  gift(t,b){FX.sparkle(t,b);FX.coin(t+.1,b)},
  buzz(t,b){const g=gain(0,b);env(g,t,.005,.25,.4,.8,.05,t+.45);osc('square',110,t,t+.5,filt('lowpass',900,1,g));osc('square',116,t,t+.5,filt('lowpass',900,1,g))},
 };
 const VOICE={pooh:[220,1],pinco:[430,1.1],bean:[520,.8],pooping:[170,1],bronny:[150,.9],asmon:[130,1.2],max:[380,1],mogu:[600,.9],party:[700,1],prof:[190,1],babyp:[760,1],babyb:[820,1],babyh:[700,1],you:[330,1],kaise:[390,1.05]};
 function voice(t,who,n,b){const v=VOICE[who]||[300,1];const r=rng(Math.floor(t*1000)%9973);n=Math.min(n,14);
  for(let i=0;i<n;i++){const tt=t+i*.075,g=gain(0,b);env(g,tt,.004,.17,.03,.4,.02,tt+.06);const f=filt('bandpass',v[0]*3,2,g);const o=osc(who==='bean'||who.startsWith('baby')?'triangle':'sawtooth',v[0]*(.85+r()*.45),tt,tt+.07,f);o.frequency.linearRampToValueAtTime(v[0]*(.9+r()*.3),tt+.06)}}
 // ---------- clip player ----------
 // ---- recorded vocal tracks (clip.vox): decoded once, played sample-accurately against the same clock as the beat ----
 const VOX={};
 function voxLoad(url){if(VOX[url])return VOX[url];const ver=window.__BUILD__||'';
  const dec=ab=>new Promise((res,rej)=>{try{const r=ctx.decodeAudioData(ab,res,rej);if(r&&r.then)r.then(res,rej)}catch(e){rej(e)}});
  const get=u=>fetch(u+(u.includes('?')?'':'?v='+ver)).then(r=>{if(!r.ok)throw new Error(r.status);return r.arrayBuffer()}).then(dec);
  const alt=url.replace(/\.m4a$/,'.mp3');
  VOX[url]=get(url).catch(()=>alt!==url?get(alt):Promise.reject()).catch(()=>{VOX[url]=null;return null});return VOX[url]}
 function voxPreload(clip){if(clip&&clip.vox&&ctx)voxLoad(clip.vox)}
 function voxStart(p){const c=p.clip;voxLoad(c.vox).then(buf=>{if(play!==p||!ctx)return;
   if(!buf){p.voxFail=1;return}
   const now=ctx.currentTime,off=Math.max(0,now-p.t0);if(off>=buf.duration-.05)return;
   const g=ctx.createGain();g.gain.value=0;g.connect(p.vbus);g.gain.setTargetAtTime(c.voxVol||1,now,.012);
   const src=ctx.createBufferSource();src.buffer=buf;src.connect(g);src.start(now+.005,off+.005);p.vsrc=src;p.vg=g;p.voxOn=1})}
 function start(clip,offset){
  stop();if(!ctx||!unlocked)return;
  const song=clip._song||(clip._song=makeSong(clip.song,clip.seed||1,clip.bpm));
  const bus=ctx.createGain();bus.gain.value=0;bus.connect(musicBus);bus.gain.setTargetAtTime(clip.musicVol==null?1:Math.max(.0001,clip.musicVol),ctx.currentTime,.03);
  const sbus=ctx.createGain();sbus.connect(sfxBus);
  let ev=(clip._ev||[]);if(clip.vox)ev=ev.filter(e=>e[1]!=='voice');
  const t0=ctx.currentTime-offset;const p={clip,song,bus,sbus,t0,next:Math.ceil(offset/song.step-1e-6),ev,evi:0,dur:clip.dur};
  if(clip.vox){p.vbus=ctx.createGain();p.vbus.gain.value=.9;p.vbus.connect(master);voxStart(p)}
  while(p.evi<p.ev.length&&p.ev[p.evi][0]<offset-0.02)p.evi++;
  play=p;pump();p.timer=setInterval(pump,25);return p}
 function pump(){const p=play;if(!p||!ctx)return;const now=ctx.currentTime,ahead=now+.14;
  while(p.t0+p.next*p.song.step<ahead){const st=p.next*p.song.step;if(st<p.dur-.04){const vol=p.clip.musicVol==null?1:p.clip.musicVol;if(vol>0)playStep(p.song,p.next,p.t0+st,p.bus)}p.next++;if(st>p.dur)break}
  while(p.evi<p.ev.length&&p.t0+p.ev[p.evi][0]<ahead){const e=p.ev[p.evi++];const tt=Math.max(now,p.t0+e[0]);if(e[1]==='sing'&&p.clip.vox&&!p.voxFail)continue;try{if(e[1]==='voice')voice(tt,e[2],e[3],p.sbus);else if(FX[e[1]])FX[e[1]](tt,p.sbus,e[2])}catch(err){}}}
 function stop(){const p=play;if(!p)return;play=null;clearInterval(p.timer);if(ctx){const t=ctx.currentTime;if(p.vsrc){try{p.vsrc.stop(t+.07)}catch(e){}}[p.bus,p.sbus].concat(p.vbus?[p.vbus]:[]).forEach(g=>{g.gain.cancelScheduledValues(t);g.gain.setValueAtTime(g.gain.value,t);g.gain.linearRampToValueAtTime(0,t+.06);setTimeout(()=>{try{g.disconnect()}catch(e){}},300)})}}
 function time(){return play&&ctx?ctx.currentTime-play.t0:null}
 function sfx(name){if(!ctx||!unlocked)return;try{FX[name](ctx.currentTime+.005,sfxBus)}catch(e){}}
 return {unlock,init,start,stop,time,sfx,voxPreload,get voxState(){return play?{on:!!play.voxOn,fail:!!play.voxFail}:null},
  get unlocked(){return unlocked},get running(){return !!ctx&&ctx.state==='running'},get muted(){return muted},
  setWant(w){want=w;if(unlocked)setMuted(!w)},get want(){return want},makeSong,STY,FX};
})();
