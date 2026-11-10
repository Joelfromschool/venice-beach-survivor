/* LANZAGAMES Felt Letters splash. Does not block picker.js. */
(function(){
'use strict';
var KEY='lg-splash-seen';
var WORD='LANZAGAMES';
var STAGGER=50, POP=480, SETTLE_AT=1000, FADE_AT=1550, FADE=450, SKIP_FADE=160;
var splash=document.getElementById('lgSplash');
if(!splash)return;

var reduced=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
var skipClass=document.documentElement.classList.contains('lg-splash-skip');
var active=false, leaving=false, ctx=null;

function seen(){try{return sessionStorage.getItem(KEY)==='1'}catch(e){return false}}
function store(){try{sessionStorage.setItem(KEY,'1')}catch(e){}}

function hide(){
  active=false; leaving=false;
  splash.classList.remove('is-play','is-out','is-settled');
  splash.hidden=true;
  splash.setAttribute('aria-hidden','true');
  splash.style.pointerEvents='none';
  document.documentElement.classList.add('lg-splash-skip');
}

function playFelt(){
  /* Fire-and-forget. Never holds the overlay if audio is blocked. */
  try{
    var AC=window.AudioContext||window.webkitAudioContext;
    if(!AC)return;
    if(!ctx)ctx=new AC();
    var start=function(){
      if(!ctx||ctx.state!=='running')return;
      var when=ctx.currentTime+0.02;
      var master=ctx.createGain();
      master.gain.value=0.85;
      master.connect(ctx.destination);
      function pan(x){var p=ctx.createStereoPanner();p.pan.value=x;p.connect(master);return p}
      var L=pan(-0.3),R=pan(0.3);
      function osc(dest,o){
        var t=when+(o.start||0), att=o.attack||0.0025, dec=o.decay, peak=o.peak;
        var n=ctx.createOscillator();n.type=o.type||'sine';n.frequency.setValueAtTime(o.freq,t);
        if(o.detune)n.detune.setValueAtTime(o.detune,t);
        var g=ctx.createGain();g.gain.setValueAtTime(0.0001,t);
        g.gain.exponentialRampToValueAtTime(Math.max(peak,0.0002),t+Math.max(att,0.004));
        g.gain.exponentialRampToValueAtTime(0.0001,t+att+dec);
        n.connect(g);g.connect(dest);n.start(t);n.stop(t+att+dec+0.02);
      }
      function noise(o){
        var t=when+(o.start||0), dur=o.dur, n=Math.ceil(ctx.sampleRate*dur)+8;
        var buf=ctx.createBuffer(1,n,ctx.sampleRate), d=buf.getChannelData(0);
        for(var i=0;i<n;i++)d[i]=Math.random()*2-1;
        var src=ctx.createBufferSource();src.buffer=buf;
        var bp=ctx.createBiquadFilter();bp.type='bandpass';bp.frequency.value=o.freq;bp.Q.value=o.q||1.1;
        var g=ctx.createGain();g.gain.setValueAtTime(0.0001,t);
        g.gain.exponentialRampToValueAtTime(Math.max(o.peak,0.0002),t+(o.attack||0.001));
        g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
        src.connect(bp);bp.connect(g);g.connect(master);src.start(t);src.stop(t+dur+0.02);
      }
      function pluck(freq,start,peak,decay,side){
        var dest=side<0?L:side>0?R:master;
        osc(dest,{freq:freq,start:start,decay:decay,peak:peak,type:'sine'});
        osc(master,{freq:freq*2.003,start:start,attack:0.002,decay:decay*0.55,peak:peak*0.28,type:'sine'});
        osc(master,{freq:freq*4.47,start:start,attack:0.002,decay:decay*0.22,peak:peak*0.07,type:'sine'});
        noise({start:start,dur:0.06,freq:2400,q:1.1,peak:peak*0.22,attack:0.001});
      }
      pluck(392.00,0.00,0.16,0.45,-1);
      pluck(493.88,0.14,0.14,0.42,1);
      pluck(587.33,0.28,0.15,0.5,-1);
      pluck(784.00,0.48,0.18,1.05,0);
    };
    if(ctx.state==='suspended'){ctx.resume().then(start).catch(function(){})}
    else start();
  }catch(e){}
}

function layoutLetters(){
  var solid=splash.querySelector('.lg-wm');
  var layer=splash.querySelector('.lg-letters');
  if(!solid||!layer)return;
  var node=solid.firstChild;
  if(!node||node.nodeType!==3)return;
  var base=solid.getBoundingClientRect();
  layer.textContent='';
  for(var i=0;i<WORD.length;i++){
    var range=document.createRange();
    range.setStart(node,i);range.setEnd(node,i+1);
    var rec=range.getBoundingClientRect();
    var s=document.createElement('span');
    s.textContent=WORD[i];
    s.style.left=(rec.left-base.left)+'px';
    s.style.top='0px';
    s.style.animationDelay=(i*STAGGER)+'ms';
    layer.appendChild(s);
  }
}

function finish(){store();hide()}

function leave(instant){
  if(leaving||!active)return;
  leaving=true;active=false;
  splash.style.pointerEvents='none';
  if(instant){finish();return}
  splash.classList.add('is-out');
  setTimeout(finish, FADE+20);
}

function skip(ev){
  if(!active||leaving)return;
  if(ev){ev.preventDefault();ev.stopImmediatePropagation()}
  /* Start leaving immediately; sound is best-effort and must not delay the exit. */
  splash.classList.add('is-out','lg-skip');
  splash.style.pointerEvents='none';
  leaving=true;active=false;
  playFelt();
  setTimeout(finish, SKIP_FADE+20);
}

function onKey(e){
  if(!active||leaving)return;
  if(e.metaKey||e.ctrlKey||e.altKey)return;
  skip(e);
}

function play(){
  if(skipClass||reduced||seen()){store();hide();return}
  splash.hidden=false;
  splash.removeAttribute('aria-hidden');
  splash.style.pointerEvents='';
  var go=function(){
    layoutLetters();
    splash.classList.add('is-play');
    active=true;
    playFelt(); /* silent no-op if the browser blocks autoplay */
    setTimeout(function(){if(active&&!leaving)splash.classList.add('is-settled')},SETTLE_AT);
    setTimeout(function(){if(active&&!leaving)leave(false)},FADE_AT);
  };
  var fonts=document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve();
  fonts.then(function(){requestAnimationFrame(function(){requestAnimationFrame(go)})}).catch(go);
}

splash.addEventListener('pointerdown',skip,true);
window.addEventListener('keydown',onKey,true);
play();
})();
