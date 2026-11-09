// Original WebAudio sound effects and generative ambient music (no samples, no speech).
import {G} from './state.js';
let ctx=null,master,sfxBus,musicBus,verb,started=false;
export function audioWake(){if(!ctx){try{ctx=new (window.AudioContext||window.webkitAudioContext)();master=ctx.createGain();master.gain.value=.9;master.connect(ctx.destination);sfxBus=ctx.createGain();sfxBus.connect(master);musicBus=ctx.createGain();musicBus.gain.value=.0;musicBus.connect(master);
 // simple feedback-delay "room" for music
 const d=ctx.createDelay(1),fb=ctx.createGain(),lp=ctx.createBiquadFilter();d.delayTime.value=.37;fb.gain.value=.42;lp.type='lowpass';lp.frequency.value=2400;verb=ctx.createGain();verb.gain.value=.5;verb.connect(d);d.connect(lp);lp.connect(fb);fb.connect(d);lp.connect(musicBus)}catch(e){return}}
 if(ctx.state==='suspended')ctx.resume();started=true}
export function audioSuspend(on){if(!ctx)return;if(on)ctx.suspend();else ctx.resume()}
function env(g,t,a,d,peak){g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(peak,t+a);g.gain.exponentialRampToValueAtTime(0.0001,t+a+d)}
function noise(dur){const n=ctx.sampleRate*dur|0,b=ctx.createBuffer(1,n,ctx.sampleRate),d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=Math.random()*2-1;const s=ctx.createBufferSource();s.buffer=b;return s}
function nz(t,dur,freq,q,vol,type='bandpass'){const s=noise(dur),f=ctx.createBiquadFilter(),g=ctx.createGain();f.type=type;f.frequency.value=freq;f.Q.value=q;s.connect(f);f.connect(g);g.connect(sfxBus);env(g,t,.004,dur,vol);s.start(t);s.stop(t+dur+.05)}
function tone(t,freq,dur,vol,type='sine',slide=0,bus=sfxBus){const o=ctx.createOscillator(),g=ctx.createGain();o.type=type;o.frequency.setValueAtTime(freq,t);if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(20,freq*slide),t+dur);o.connect(g);g.connect(bus);env(g,t,.006,dur,vol);o.start(t);o.stop(t+dur+.05)}
const MAT={stone:[1800,1.2],wood:[700,2.5],dirt:[420,.9],sand:[2600,.6],glass:[4200,3],plant:[3000,.5],wool:[500,.4],metal:[2400,6]};
export function matOf(id){if([3,4,6,15,16,17,18,19,20,21,24,37,42,52,54,61,59,60,14].includes(id))return'stone';if([7,8,23,25,35,49,41].includes(id))return'wood';if([5,12].includes(id))return'sand';if([10,47].includes(id))return'glass';if([9,36,50,27,28,29,30,31,32,33,51,53,57,58,34,55].includes(id))return'plant';if([22,43,44,45,46].includes(id))return'wool';if([39,40,56].includes(id))return'metal';return'dirt'}
export function sfx(name,arg){if(!ctx||!G.opt.sound)return;const t=ctx.currentTime;const r=Math.random();
 switch(name){
 case'hit_block':{const[m,q]=MAT[matOf(arg)];nz(t,.06,m*(.9+r*.2),q,.25);break}
 case'break':{const[m,q]=MAT[matOf(arg)];nz(t,.16,m,q,.5);nz(t+.03,.12,m*.6,q,.3);if(matOf(arg)==='wood')tone(t,180+r*40,.09,.2,'triangle',.6);if(matOf(arg)==='glass'){for(let i=0;i<4;i++)tone(t+i*.03,2400+Math.random()*1800,.12,.06,'sine')}break}
 case'place':{const[m,q]=MAT[matOf(arg)];nz(t,.09,m*.7,q,.4);tone(t,140,.07,.15,'sine',.7);break}
 case'step':{const[m,q]=MAT[matOf(arg)];nz(t,.05,m*.8*(.85+r*.3),q,.09);break}
 case'swing':nz(t,.12,1400,.7,.12,'highpass');break;
 case'hit':nz(t,.08,900,1,.4);tone(t,220,.12,.25,'square',.5);break;
 case'mobhurt':tone(t,330+r*80,.18,.18,'sawtooth',.6);nz(t,.08,700,1,.2);break;
 case'hurt':tone(t,520,.08,.22,'triangle',.7);tone(t+.07,380,.16,.2,'triangle',.7);nz(t,.06,500,1,.25);break;
 case'pop':tone(t,700+r*200,.07,.18,'sine',1.6);break;
 case'eat':for(let i=0;i<3;i++)nz(t+i*.12,.07,1500+r*400,2,.22);break;
 case'burp':tone(t,140,.25,.2,'sawtooth',.8);break;
 case'craft':tone(t,523,.09,.18,'triangle');tone(t+.08,784,.14,.16,'triangle');nz(t,.05,3000,2,.1);break;
 case'ui':tone(t,880,.05,.1,'sine');break;
 case'xp':tone(t,1318+r*400,.12,.1,'sine');break;
 case'level':[523,659,784,1046].forEach((f,i)=>tone(t+i*.09,f,.25,.15,'triangle'));break;
 case'bow':nz(t,.25,600,.6,.15,'lowpass');tone(t,180,.2,.1,'triangle',1.6);break;
 case'shoot':nz(t,.12,2400,1,.25,'highpass');tone(t,600,.1,.08,'sine',.5);break;
 case'thunk':nz(t,.06,500,2,.3);break;
 case'fuse':nz(t,1.4,5000,.5,.12,'highpass');break;
 case'boom':{nz(t,.9,160,.5,.9,'lowpass');nz(t,.4,900,.6,.4);tone(t,70,.6,.5,'sine',.4);break}
 case'roar':tone(t,90,.9,.35,'sawtooth',.6);tone(t,135,.8,.2,'sawtooth',.7);nz(t,.7,400,.8,.25,'lowpass');break;
 case'slam':tone(t,60,.5,.6,'sine',.5);nz(t,.35,250,.6,.6,'lowpass');break;
 case'shard':[784,988,1175,1568,1976].forEach((f,i)=>tone(t+i*.07,f,.5,.12,'sine'));break;
 case'portal':for(let i=0;i<8;i++)tone(t+i*.05,300+i*90,.6,.06,'sine',1.5);nz(t,1,1800,3,.08);break;
 case'splash':nz(t,.3,900,.6,.3,'lowpass');break;
 case'coin':tone(t,1568,.06,.15,'square');tone(t+.06,2093,.18,.12,'square');break;
 case'sleep':[392,330,262].forEach((f,i)=>tone(t+i*.3,f,.6,.1,'sine'));break;
 case'quest':[523,659,784,1046,1318].forEach((f,i)=>tone(t+i*.08,f,.4,.13,'triangle'));break;
 case'fanfare':[392,523,659,784,659,784,1046].forEach((f,i)=>tone(t+i*.14,f,.45,.16,'triangle'));break}}
// ---------- generative music ----------
const MOODS={
 title:{scale:[0,2,4,7,9,12,14,16],root:57,tempo:.62,density:.55,pad:true},
 day:{scale:[0,2,4,7,9,12,14,16,19],root:60,tempo:.7,density:.4,pad:true},
 night:{scale:[0,3,5,7,10,12,15],root:55,tempo:.9,density:.3,pad:true},
 cave:{scale:[0,1,5,7,8,12],root:45,tempo:1.1,density:.25,pad:false},
 boss:{scale:[0,3,5,6,7,10,12],root:45,tempo:.22,density:.9,pad:false,drum:true},
 realm:{scale:[0,2,3,7,8,12,14],root:52,tempo:.55,density:.45,pad:true},
 ending:{scale:[0,2,4,5,7,9,11,12,14,16],root:60,tempo:.45,density:.7,pad:true}};
let mood=null,next=0,step=0,timer=null,chord=0;
const mtof=m=>440*Math.pow(2,(m-69)/12);
function piano(t,m,vol){if(!ctx)return;const f=mtof(m);const o=ctx.createOscillator(),o2=ctx.createOscillator(),g=ctx.createGain();o.type='triangle';o2.type='sine';o.frequency.value=f;o2.frequency.value=f*2.001;const g2=ctx.createGain();g2.gain.value=.25;o2.connect(g2);g2.connect(g);o.connect(g);g.connect(musicBus);g.connect(verb);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+.01);g.gain.exponentialRampToValueAtTime(.0001,t+2.4);o.start(t);o2.start(t);o.stop(t+2.5);o2.stop(t+2.5)}
function pad(t,ms,dur){for(const m of ms){const o=ctx.createOscillator(),g=ctx.createGain(),f=ctx.createBiquadFilter();f.type='lowpass';f.frequency.value=900;o.type='sawtooth';o.frequency.value=mtof(m);o.detune.value=(Math.random()-.5)*12;o.connect(f);f.connect(g);g.connect(musicBus);g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(.018,t+dur*.4);g.gain.linearRampToValueAtTime(.0001,t+dur);o.start(t);o.stop(t+dur+.1)}}
function drum(t,k){const o=ctx.createOscillator(),g=ctx.createGain();o.frequency.setValueAtTime(k?110:60,t);o.frequency.exponentialRampToValueAtTime(40,t+.15);o.connect(g);g.connect(musicBus);env(g,t,.003,.2,k?.25:.4);o.start(t);o.stop(t+.3)}
function tick(){if(!ctx||!mood)return;const M=MOODS[mood];while(next<ctx.currentTime+.6){const t=next;if(G.opt.music){
  if(M.pad&&step%16===0){chord=(chord+[0,5,3,4][step/16%4|0])%7;const base=M.root-12+M.scale[chord%M.scale.length];pad(t,[base,base+7,base+12+(M.scale[2]||4)],M.tempo*16)}
  if(Math.random()<M.density){const deg=M.scale[Math.floor(Math.random()*M.scale.length)];piano(t,M.root+deg+(Math.random()<.2?12:0),.05+Math.random()*.03);if(Math.random()<.25)piano(t+M.tempo/2,M.root+M.scale[Math.floor(Math.random()*M.scale.length)],.035)}
  if(M.drum){drum(t,step%4===2);if(step%2)nz(t,.05,6000,1,.04,'highpass')}}
  step++;next+=M.tempo}}
export function setMood(m){if(!ctx)return;if(m===mood)return;mood=m;if(!timer){next=ctx.currentTime+.1;timer=setInterval(tick,200)}musicBus.gain.cancelScheduledValues(ctx.currentTime);musicBus.gain.setValueAtTime(musicBus.gain.value,ctx.currentTime);musicBus.gain.linearRampToValueAtTime(G.opt.music?.9:0,ctx.currentTime+1.5)}
export function musicVolume(){if(!ctx)return;musicBus.gain.setTargetAtTime(G.opt.music?.9:0,ctx.currentTime,.3)}
