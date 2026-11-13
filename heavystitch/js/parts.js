/* Heavy Stitch: procedural weld-on armor renderer. Every part is drawn in code (original designs),
   clamped, cabled and Glimmer-welded onto the character cut-outs. Dystopian-future industrial style. */
'use strict';
const INK='#0c0d13';
const IMGS={};
// Robust image loader: waits for full decode (iOS Safari can report onload before pixels are ready), retries once, never caches a failure.
function loadImg(src){if(IMGS[src])return IMGS[src];const p=new Promise((ok,no)=>{let tries=0;const go=()=>{const i=new Image();i.decoding='async';
  i.onload=()=>{const done=()=>ok(i);if(i.decode)i.decode().then(done,done);else done();};
  i.onerror=()=>{if(++tries<2)setTimeout(go,400);else{delete IMGS[src];no(new Error('img '+src));}};i.src=src+(tries?(src.includes('?')?'&':'?')+'r='+tries:'');};go();});
 return IMGS[src]=p;}
function hex2rgb(h){if(h[0]==='r')return h.match(/[\d.]+/g).slice(0,3).map(Number);h=h.replace('#','');return[parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)];}
function shade(h,f){const c=hex2rgb(h).map(v=>f>=1?Math.round(v+(255-v)*(f-1)):Math.round(v*f));return'rgb('+c.map(v=>Math.max(0,Math.min(255,v))).join(',')+')';}
function rgba(h,a){const c=hex2rgb(h);return`rgba(${c[0]},${c[1]},${c[2]},${a})`;}
// ---- drawing kit ----
function pathPts(c,p){c.beginPath();c.moveTo(p[0][0],p[0][1]);for(let i=1;i<p.length;i++)c.lineTo(p[i][0],p[i][1]);c.closePath();}
function bbox(p){let a=1e9,b=1e9,C=-1e9,d=-1e9;for(const q of p){a=Math.min(a,q[0]);b=Math.min(b,q[1]);C=Math.max(C,q[0]);d=Math.max(d,q[1]);}return[a,b,C,d];}
function celGrad(c,bb,col){const g=c.createLinearGradient(bb[0],bb[1],bb[0]+(bb[2]-bb[0])*.35,bb[3]);
 g.addColorStop(0,shade(col,1.38));g.addColorStop(.42,col);g.addColorStop(.6,col);g.addColorStop(.61,shade(col,.7));g.addColorStop(1,shade(col,.52));return g;}
function plate(c,p,col,o){o=o||{};pathPts(c,p);const bb=bbox(p);c.fillStyle=celGrad(c,bb,col);c.fill();
 c.lineJoin='round';c.lineWidth=o.lw||2.2;c.strokeStyle=INK;c.stroke();
 // inner bevel highlight
 const cx=(bb[0]+bb[2])/2,cy=(bb[1]+bb[3])/2,k=o.inset||.84;
 c.save();c.beginPath();p.forEach((q,i)=>{const x=cx+(q[0]-cx)*k,y=cy+(q[1]-cy)*k;i?c.lineTo(x,y):c.moveTo(x,y);});c.closePath();
 c.lineWidth=.8;c.strokeStyle='rgba(255,255,255,.28)';c.stroke();c.restore();
 if(o.trim){pathPts(c,p);c.lineWidth=.9;c.strokeStyle=o.trim;c.stroke();}}
function rrect(x,y,w,h,r){r=Math.min(r,w/2,h/2);const p=[],n=4;const cs=[[x+w-r,y+r,-Math.PI/2],[x+w-r,y+h-r,0],[x+r,y+h-r,Math.PI/2],[x+r,y+r,Math.PI]];
 for(const[cx,cy,a0]of cs)for(let i=0;i<=n;i++){const a=a0+i/n*Math.PI/2;p.push([cx+Math.cos(a)*r,cy+Math.sin(a)*r]);}return p;}
function ell(cx,cy,rx,ry,n,a0,a1){n=n||18;a0=a0||0;a1=a1==null?Math.PI*2:a1;const p=[];for(let i=0;i<=n;i++){const a=a0+(a1-a0)*i/n;p.push([cx+Math.cos(a)*rx,cy+Math.sin(a)*ry]);}return p;}
function xf(p,cx,cy,ang,sx,sy){const co=Math.cos(ang),si=Math.sin(ang);sx=sx||1;sy=sy||1;return p.map(([x,y])=>{x*=sx;y*=sy;return[cx+x*co-y*si,cy+x*si+y*co];});}
function bolt(c,x,y,r){r=r||2.2;const p=[];for(let i=0;i<6;i++){const a=i/6*Math.PI*2+.5;p.push([x+Math.cos(a)*r,y+Math.sin(a)*r]);}
 pathPts(c,p);const g=c.createLinearGradient(x-r,y-r,x+r,y+r);g.addColorStop(0,'#f2f3f6');g.addColorStop(.5,'#a7acb7');g.addColorStop(1,'#5b606b');c.fillStyle=g;c.fill();c.lineWidth=1;c.strokeStyle=INK;c.stroke();
 c.beginPath();c.arc(x,y,r*.38,0,7);c.fillStyle='#3a3e48';c.fill();}
function glow(c,x,y,r,col,a){const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,rgba(col,a==null?.95:a));g.addColorStop(.35,rgba(col,(a==null?.95:a)*.45));g.addColorStop(1,rgba(col,0));
 c.save();c.globalCompositeOperation='lighter';c.fillStyle=g;c.beginPath();c.arc(x,y,r,0,7);c.fill();c.restore();}
function lens(c,x,y,r,col){c.beginPath();c.arc(x,y,r,0,7);c.fillStyle=INK;c.fill();c.beginPath();c.arc(x,y,r*.7,0,7);c.fillStyle=col;c.fill();
 c.beginPath();c.arc(x-r*.25,y-r*.25,r*.25,0,7);c.fillStyle='#fff';c.fill();glow(c,x,y,r*2.6,col,.55);}
// glowing cross-stitch: the Glimmer thread that holds steel to plush
function stitch(c,x1,y1,x2,y2,col,n){n=n||4;c.save();c.lineCap='round';
 for(let i=0;i<n;i++){const t=(i+.5)/n,x=x1+(x2-x1)*t,y=y1+(y2-y1)*t,s=1.8;
  c.strokeStyle=rgba(col,.35);c.lineWidth=2.6;c.beginPath();c.moveTo(x-s,y-s);c.lineTo(x+s,y+s);c.moveTo(x+s,y-s);c.lineTo(x-s,y+s);c.stroke();
  c.strokeStyle='#fff';c.lineWidth=.9;c.stroke();}
 c.restore();}
function strap(c,cx,cy,w,h,ang,P){const p=xf(rrect(-w/2,-h/2,w,h,1.2),cx,cy,ang);plate(c,p,P.s,{lw:1.6});const b=xf([[-w/2+3,0],[w/2-3,0]],cx,cy,ang);bolt(c,b[0][0],b[0][1],1.6);bolt(c,b[1][0],b[1][1],1.6);}
function stripes(c,p,col){c.save();pathPts(c,p);c.clip();const bb=bbox(p);c.strokeStyle=col;c.lineWidth=2.4;
 for(let x=bb[0]-30;x<bb[2]+30;x+=6){c.beginPath();c.moveTo(x,bb[3]+2);c.lineTo(x+(bb[3]-bb[1])+4,bb[1]-2);c.stroke();}c.restore();pathPts(c,p);c.lineWidth=1.4;c.strokeStyle=INK;c.stroke();}
function line(c,pts,col,w){c.beginPath();c.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)c.lineTo(pts[i][0],pts[i][1]);c.strokeStyle=col;c.lineWidth=w||1;c.stroke();}
const GOLD='#ff3df0'; // tier-3 neon trim
const HAZ='#ffd23a';
// insulated power cable with a glowing coupler
function cable(c,x1,y1,x2,y2,sag,col){const mx=(x1+x2)/2,my=(y1+y2)/2+sag;c.save();c.lineCap='round';c.beginPath();c.moveTo(x1,y1);c.quadraticCurveTo(mx,my,x2,y2);c.strokeStyle=INK;c.lineWidth=4.2;c.stroke();c.strokeStyle='#3a3f4b';c.lineWidth=2.4;c.stroke();
 c.setLineDash([2,5]);c.strokeStyle=rgba(col,.9);c.lineWidth=1.2;c.stroke();c.setLineDash([]);c.restore();const qx=.25*x1+.5*mx+.25*x2,qy=.25*y1+.5*my+.25*y2;c.beginPath();c.arc(qx,qy,2.2,0,7);c.fillStyle=col;c.fill();glow(c,qx,qy,6,col,.6);}
function trimFor(part){return part&&part.tier>=3?GOLD:null;}

// ---------- HEAD ----------
function drawHead(c,A,part,P){if(!part)return;const[hx,hy]=A.head,w=A.hw,y1=A.eyeY-.2*w,y0=hy-.08*w,tr=trimFor(part),sh=part.shape;
 const cap=(sc)=>{sc=sc||1;const p=[];for(let i=0;i<=16;i++){const a=Math.PI+i/16*Math.PI;p.push([hx+Math.cos(a)*.5*w*sc,y1+Math.sin(a)*(y1-y0)]);}p.push([hx+.5*w*sc,y1+.06*w],[hx-.5*w*sc,y1+.06*w]);return p;};
 const ears=()=>{for(const s of[-1,1]){const p=rrect(hx+s*.5*w-.08*w,y1-.2*w,.16*w,.24*w,3);plate(c,p,P.s,{trim:tr});bolt(c,hx+s*.5*w,y1-.08*w,2);}};
 if(sh==='halo'){const p=rrect(hx-.52*w,y1-.14*w,1.04*w,.15*w,4);plate(c,p,P.p,{trim:GOLD});glow(c,hx,y1-.065*w,.3*w,P.g,.4);
  for(let i=-3;i<=3;i++)bolt(c,hx+i*.14*w,y1-.065*w,1.5);
  c.save();c.lineWidth=4;c.strokeStyle=INK;c.beginPath();c.ellipse(hx,y0-.22*w,.4*w,.1*w,0,0,7);c.stroke();c.lineWidth=2.2;c.strokeStyle=GOLD;c.stroke();c.restore();
  glow(c,hx,y0-.22*w,.5*w,P.g,.35);for(const a of[0,1.57,3.14,4.71])lens(c,hx+Math.cos(a)*.4*w,y0-.22*w+Math.sin(a)*.1*w,2.2,P.g);
  stitch(c,hx-.5*w,y1+.02*w,hx+.5*w,y1+.02*w,P.g,6);return;}
 if(sh==='horns'){for(const s of[-1,1]){const p=[[hx+s*.3*w,y0+.2*w],[hx+s*.62*w,y0-.25*w],[hx+s*.78*w,y0-.42*w],[hx+s*.66*w,y0-.1*w],[hx+s*.42*w,y0+.34*w]];plate(c,p,P.a,{trim:tr});}}
 if(sh==='fin'){const p=[[hx-.06*w,y0+.1*w],[hx-.02*w,y0-.55*w],[hx+.2*w,y0-.38*w],[hx+.1*w,y0+.15*w]];plate(c,p,P.a);line(c,[[hx-.02*w,y0-.5*w],[hx+.06*w,y0+.08*w]],'rgba(255,255,255,.4)',.8);}
 plate(c,cap(sh==='horns'?1.04:1),P.p,{trim:tr});
 // panel line and accent stripe
 c.save();pathPts(c,cap());c.clip();c.fillStyle=P.a;c.fillRect(hx-.06*w,y0-10,.12*w,(y1-y0)+20);c.restore();
 line(c,[[hx-.38*w,y1-.05*w],[hx+.38*w,y1-.05*w]],INK,1);
 if(sh==='visor'){const p=rrect(hx-.56*w,y1-.18*w,1.12*w,.2*w,5);plate(c,p,P.s);const v=rrect(hx-.44*w,y1-.13*w,.88*w,.08*w,3);pathPts(c,v);c.fillStyle=P.g;c.fill();glow(c,hx,y1-.09*w,.5*w,P.g,.5);}
 else{const brim=rrect(hx-.54*w,y1,1.08*w,.07*w,2);plate(c,brim,P.s,{lw:1.6});}
 if(sh==='cluster'){const p=rrect(hx+.36*w,y1-.36*w,.3*w,.34*w,5);plate(c,p,P.s);lens(c,hx+.45*w,y1-.26*w,3.2,P.g);lens(c,hx+.57*w,y1-.22*w,2.4,P.g);lens(c,hx+.47*w,y1-.12*w,2,P.g);}
 if(sh!=='visor')ears();
 stitch(c,hx-.46*w,y1+.035*w,hx+.46*w,y1+.035*w,P.g,5);}
// ---------- CORE ----------
function drawCore(c,A,part,P,ch){if(!part)return;let[cx,cy,w,h]=A.torso;const tr=trimFor(part),sh=part.shape;
 const top=cy-h*.5,bot=cy+h*.32,L=cx-w*.42,R=cx+w*.42;
 // shoulder straps
 if(ch.body!=='pod'){strap(c,A.shl[0]+6,A.shl[1]-2,7,22,.5,P);strap(c,A.shr[0]-6,A.shr[1]-2,7,22,-.5,P);}
 else{const by=cy-h*.12;const band=rrect(cx-w*.56,by-4,w*1.12,8,3);plate(c,band,P.s,{lw:1.6});}
 if(sh==='patch'){const p=[[L+6,top],[R-6,top],[R,top+10],[R-4,bot],[cx,bot+8],[L+4,bot],[L,top+10]];plate(c,p,P.p,{trim:tr});
  c.save();pathPts(c,p);c.clip();c.fillStyle=P.a;c.fillRect(L,top+h*.18,w*.18,h*.12);c.restore();
  stitch(c,cx,top+4,cx,bot,P.g,4);[[L+7,top+7],[R-7,top+7],[L+8,bot-6],[R-8,bot-6]].forEach(q=>bolt(c,q[0],q[1],2.2));}
 else if(sh==='quilt'){for(let r=0;r<3;r++)for(let k=0;k<2;k++){const x=L+4+k*(w*.42),y=top+r*(h*.27);plate(c,rrect(x,y,w*.4,h*.27,6),P.p,{trim:tr});}
  stitch(c,cx,top+3,cx,bot-2,P.g,5);[[L+5,top+4],[R-5,top+4]].forEach(q=>bolt(c,q[0],q[1],2));}
 else if(sh==='brig'){for(let r=3;r>=0;r--){const y=top+r*h*.2;const p=[[L-2+r,y],[R+2-r,y],[R-r*1.5,y+h*.26],[L+r*1.5,y+h*.26]];plate(c,p,r%2?P.p:shade(P.p,.92),{trim:tr,lw:1.8});
  for(let i=0;i<5;i++)bolt(c,L+8+i*(R-L-16)/4,y+4,1.3);}
  stitch(c,L+4,bot+2,R-4,bot+2,P.g,6);}
 else if(sh==='rivet'){const p=[[L+2,top],[R-2,top],[R+3,top+h*.5],[R-6,bot+2],[L+6,bot+2],[L-3,top+h*.5]];plate(c,p,P.p,{trim:tr});
  const rx=cx,ry=top+h*.42,rr=w*.15;c.beginPath();c.arc(rx,ry,rr+3,0,7);c.fillStyle=P.s;c.fill();c.lineWidth=2;c.strokeStyle=INK;c.stroke();
  c.beginPath();c.arc(rx,ry,rr,0,7);c.fillStyle=P.g;c.fill();glow(c,rx,ry,rr*3,P.g,.7);
  for(let i=0;i<8;i++){const a=i/8*6.283;bolt(c,rx+Math.cos(a)*(rr+7),ry+Math.sin(a)*(rr+7),1.6);}}
 else if(sh==='bastion'){const col=[[L-6,top-8],[R+6,top-8],[R+2,top+4],[L-2,top+4]];
  const p=[[L-8,top],[R+8,top],[R+2,bot],[cx+w*.12,bot+10],[cx-w*.12,bot+10],[L-2,bot]];plate(c,p,P.p,{trim:tr});plate(c,col,P.s);
  for(const s of[-1,1]){const v=rrect(cx+s*w*.2-6,top+h*.25,12,h*.28,2);pathPts(c,v);c.fillStyle=INK;c.fill();for(let i=0;i<3;i++)line(c,[[cx+s*w*.2-4,top+h*.3+i*5],[cx+s*w*.2+4,top+h*.3+i*5]],P.g,1.2);}
  stripes(c,rrect(L+4,bot-9,R-L-8,7,1),P.a);[[L-3,top+5],[R+3,top+5],[L+2,bot-4],[R-2,bot-4]].forEach(q=>bolt(c,q[0],q[1],2.6));}
 else if(sh==='cathedral'){const p=[[L-2,top+2],[L+8,top-8],[R-8,top-8],[R+2,top+2],[R,bot],[cx+w*.16,bot+10],[cx-w*.16,bot+10],[L,bot]];plate(c,p,P.p,{trim:GOLD});
  const q=rrect(cx-w*.2,top-2,w*.4,h*.72,4);plate(c,q,P.s,{trim:GOLD});
  for(let i=0;i<5;i++){const y=top+3+i*h*.13;line(c,[[cx-w*.15,y],[cx+w*.15,y]],P.g,1.6);}glow(c,cx,top+h*.28,w*.42,P.g,.55);
  for(const sx of[-1,1]){const v=rrect(cx+sx*w*.33-5,top+h*.1,10,h*.5,2);pathPts(c,v);c.fillStyle=INK;c.fill();for(let i=0;i<4;i++)line(c,[[cx+sx*w*.33-3,top+h*.16+i*6],[cx+sx*w*.33+3,top+h*.16+i*6]],GOLD,1.2);}
  stripes(c,rrect(L+4,bot-8,R-L-8,6,1),HAZ);[[L+3,top+4],[R-3,top+4]].forEach(q=>bolt(c,q[0],q[1],2.4));}
}
// ---------- ARMS ----------
function drawArms(c,A,part,P,ch){if(!part)return;const tr=trimFor(part),sh=part.shape,u=A.unit;
 if(ch.body==='pod'){ // side pylons clamped around the pod
  for(const s of['l','r']){const m=A['m'+s],hd=A['h'+s],dir=s==='l'?-1:1;
   const th=sh==='board'||sh==='atlas'?11:sh==='feather'?6:8;
   const strut=[[m[0],m[1]-th],[hd[0]-dir*6,hd[1]-th*.8],[hd[0]-dir*6,hd[1]+th*.8],[m[0],m[1]+th]];plate(c,strut,P.s,{trim:tr});
   const plateP=rrect(hd[0]-dir*6-9,hd[1]-16,18,32,4);plate(c,plateP,P.p,{trim:tr});bolt(c,hd[0]-dir*6,hd[1]-9,2);bolt(c,hd[0]-dir*6,hd[1]+9,2);
   const cl=rrect(m[0]-8,m[1]-14,16,28,4);plate(c,cl,P.p);bolt(c,m[0],m[1],2.4);
   if(sh==='piston'){line(c,[[m[0]+dir*8,m[1]-th-3],[hd[0]-dir*14,hd[1]-th-3]],'#c7cbd3',3);line(c,[[m[0]+dir*8,m[1]-th-3],[hd[0]-dir*14,hd[1]-th-3]],INK,.8);}
   if(sh==='spool'){for(let i=0;i<4;i++){const x=m[0]+dir*(14+i*7);line(c,[[x,m[1]-th-2],[x+dir*3,m[1]+th+2]],P.g,1.4);}}
   if(sh==='atlas'||sh==='board')stripes(c,rrect(Math.min(m[0],hd[0])+12,m[1]-th+2,Math.abs(hd[0]-m[0])-24,5,1),P.a);
   stitch(c,m[0],m[1]-12,m[0],m[1]+12,P.g,3);}
  const band=rrect(A.ml[0]-2,A.ml[1]-5,A.mr[0]-A.ml[0]+4,10,4);plate(c,band,P.s,{lw:1.6});return;}
 for(const s of['l','r']){const S=A['sh'+s],H=A['h'+s],dir=s==='l'?-1:1;const ang=Math.atan2(H[1]-S[1],H[0]-S[0]);
  // bracer on forearm
  const t=.62,bx=S[0]+(H[0]-S[0])*t,by=S[1]+(H[1]-S[1])*t,len=Math.hypot(H[0]-S[0],H[1]-S[1]);
  if(len>30){const bl=sh==='board'||sh==='atlas'?.42:.32,bw=sh==='feather'?.13:.2;const p=xf(rrect(-len*bl/2,-u*bw/2,len*bl,u*bw,4),bx,by,ang);plate(c,p,sh==='spool'?P.s:P.p,{trim:tr});
   const b=xf([[-len*bl/2+4,0],[len*bl/2-4,0]],bx,by,ang);bolt(c,b[0][0],b[0][1],1.8);bolt(c,b[1][0],b[1][1],1.8);
   if(sh==='piston'){const q1=xf([[-len*.55,-u*.16],[len*.05,-u*.16]],bx,by,ang);line(c,q1,'#d5d8de',3.2);line(c,q1,INK,.9);}}
  const px=S[0],py=S[1]-u*.06,r=u*(sh==='board'?.34:sh==='atlas'?.36:sh==='feather'?.24:.27);
  if(sh==='clamp'){const p=ell(px,py,r,r*.8,16,Math.PI*.95,Math.PI*2.05);p.push([px+r*.9,py+r*.3],[px-r*.9,py+r*.3]);plate(c,p,P.p,{trim:tr});bolt(c,px,py-r*.3,2.2);}
  else if(sh==='spool'){const p=rrect(px-r,py-r*.75,2*r,r*1.4,4);plate(c,p,P.s);for(let i=-2;i<=2;i++)line(c,[[px-r*.8,py+i*r*.22],[px+r*.8,py+i*r*.22+2]],P.g,1.3);glow(c,px,py,r*1.2,P.g,.25);
   plate(c,rrect(px-r-3,py-r*.85,5,r*1.7,2),P.p);plate(c,rrect(px+r-2,py-r*.85,5,r*1.7,2),P.p);}
  else if(sh==='feather'){for(let i=0;i<3;i++){const p=xf([[0,-3],[r*1.4,-1],[r*1.5,3],[0,4]],px-dir*r*.4,py-r*.4+i*r*.42,dir<0?Math.PI+.35-i*.15:-.35+i*.15);plate(c,p,i%2?P.p:P.a,{lw:1.6});}bolt(c,px,py-r*.2,2);}
  else if(sh==='piston'){const p=[[px-r,py+r*.2],[px-r*.7,py-r*.8],[px+r*.7,py-r*.8],[px+r,py+r*.2],[px+r*.6,py+r*.5],[px-r*.6,py+r*.5]];plate(c,p,P.p,{trim:tr});stripes(c,rrect(px-r*.6,py-r*.62,r*1.2,r*.3,1),P.a);bolt(c,px-r*.5,py,2);bolt(c,px+r*.5,py,2);}
  else if(sh==='board'){const p=xf(rrect(-r*1.1,-r*.45,r*2.2,r*.9,5),px+dir*r*.1,py-r*.1,dir*.25);plate(c,p,P.p);stripes(c,xf(rrect(-r*1.0,-r*.35,r*.7,r*.7,2),px+dir*r*.1,py-r*.1,dir*.25),P.a);
   const b=xf([[r*.5,0],[r*.85,0]],px+dir*r*.1,py-r*.1,dir*.25);bolt(c,b[0][0],b[0][1],2.4);bolt(c,b[1][0],b[1][1],2.4);}
  else if(sh==='atlas'){const p2=ell(px,py+r*.1,r*1.15,r*.85,16,Math.PI*.95,Math.PI*2.05);p2.push([px+r,py+r*.5],[px-r,py+r*.5]);plate(c,p2,P.s,{trim:GOLD});
   const p=ell(px,py-r*.15,r*.9,r*.7,16,Math.PI*.95,Math.PI*2.05);p.push([px+r*.8,py+r*.25],[px-r*.8,py+r*.25]);plate(c,p,P.p,{trim:GOLD});
   stitch(c,px-r*.7,py+r*.35,px+r*.7,py+r*.35,P.g,4);bolt(c,px,py-r*.4,2.4);}
  stitch(c,px-r*.5,py+r*.5,px+r*.5,py+r*.5,P.g,3);}
}
// ---------- LEGS / MOBILITY ----------
function drawLegs(c,A,part,P,ch){if(!part)return;const tr=trimFor(part),sh=part.shape,u=A.unit;
 if(ch.body==='float'){ // Pooh: hover rings around the floating shoes
  const big=sh==='anvil'?1.25:sh==='sprint'?.9:1;
  for(const s of['l','r']){const F=A['ft'+s],rx=u*.36*big,ry=u*.1*big,y=F[1]+2;
   const ring=(yy,rxx,col)=>{c.save();c.lineWidth=7;c.strokeStyle=INK;c.beginPath();c.ellipse(F[0],yy,rxx,ry,0,0,7);c.stroke();c.lineWidth=4.6;c.strokeStyle=col;c.stroke();c.lineWidth=1.2;c.strokeStyle=P.g;c.beginPath();c.ellipse(F[0],yy+1,rxx-2,ry-1,0,.2,Math.PI-.2);c.stroke();c.restore();};
   ring(y,rx,P.p);if(sh==='coil'||sh==='cloud'||sh==='anvil')ring(y+u*.12,rx*.82,P.s);
   for(const k of[-1,1]){const nx=F[0]+k*rx*.75,ny=y+ry*.6;const n=[[nx-4,ny],[nx+4,ny],[nx+5.5,ny+8],[nx-5.5,ny+8]];plate(c,n,P.s,{lw:1.5});glow(c,nx,ny+11,9,P.g,.8);}
   if(sh==='sprint'||sh==='comet'){for(const k of[-1,1])plate(c,[[F[0]+k*rx,y],[F[0]+k*(rx+10),y-10],[F[0]+k*(rx+6),y+4]],P.a,{lw:1.4});}
   if(sh==='skate')for(const k of[-1,0,1]){c.beginPath();c.arc(F[0]+k*rx*.5,y+ry+5,3.2,0,7);c.fillStyle=P.s;c.fill();c.lineWidth=1.4;c.strokeStyle=INK;c.stroke();}
   if(sh==='cloud')glow(c,F[0],y+u*.18,u*.42,P.g,.6);
   bolt(c,F[0]-rx,y,2);bolt(c,F[0]+rx,y,2);if(tr){c.save();c.lineWidth=1;c.strokeStyle=GOLD;c.beginPath();c.ellipse(F[0],y,rx,ry,0,0,7);c.stroke();c.restore();}}
  return;}
 if(ch.body==='pod'){ // Mr Bean: tail drive + skirt
  const B=A.bottom,T=A.tail;const sk=[[B[0]-u*.48,B[1]-u*.42],[B[0]+u*.42,B[1]-u*.42],[B[0]+u*.36,B[1]-u*.1],[B[0]-u*.4,B[1]-u*.1]];plate(c,sk,P.p,{trim:tr});
  if(sh==='anvil'||sh==='skate')stripes(c,rrect(B[0]-u*.4,B[1]-u*.36,u*.76,u*.1,1),P.a);
  stitch(c,B[0]-u*.4,B[1]-u*.38,B[0]+u*.34,B[1]-u*.38,P.g,5);
  const len=sh==='sprint'||sh==='cloud'?1.25:sh==='anvil'?.95:1.1;
  const cow=xf([[-u*.14,-u*.1],[u*.14*len,-u*.13],[u*.22*len,0],[u*.14*len,u*.13],[-u*.14,u*.1]],T[0],T[1],-.25);plate(c,cow,P.s,{trim:tr});
  const nz=xf([[u*.22*len,0]],T[0],T[1],-.25)[0];glow(c,nz[0]+4,nz[1]-1,u*.2,P.g,.9);
  if(sh==='coil')for(let i=0;i<4;i++){const q=xf([[-u*.1+i*u*.07,-u*.12],[-u*.07+i*u*.07,u*.12]],T[0],T[1],-.25);line(c,q,'#d5d8de',2);}
  if(sh==='sprint'||sh==='comet'||sh==='cloud'){plate(c,xf([[-u*.1,-u*.1],[u*.05,-u*.3],[u*.12,-u*.1]],T[0],T[1],-.25),P.a,{lw:1.4});}
  bolt(c,T[0],T[1],2);return;}
 for(const s of['l','r']){const Lg=A['leg'+s],F=A['ft'+s];
  const gw=u*(sh==='anvil'?.36:sh==='sprint'?.2:.26),gh=u*(sh==='anvil'?.62:.5);
  const g=rrect(Lg[0]-gw/2,Lg[1]-gh*.3,gw,gh,5);plate(c,g,P.p,{trim:tr});
  const kn=ell(Lg[0],Lg[1]-gh*.3,gw*.55,gw*.42,14);plate(c,kn,P.s);bolt(c,Lg[0],Lg[1]-gh*.3,2.2);
  if(sh==='anvil'){const ft=rrect(F[0]-u*.27,F[1]-u*.16,u*.54,u*.2,4);plate(c,ft,P.s);stripes(c,rrect(F[0]-u*.22,F[1]-u*.12,u*.44,u*.08,1),P.a);}
  if(sh==='sprint'){plate(c,[[Lg[0]+gw/2,Lg[1]-gh*.2],[Lg[0]+gw/2+u*.18,Lg[1]-gh*.05],[Lg[0]+gw/2,Lg[1]+gh*.2]],P.a,{lw:1.5});}
  if(sh==='coil'){for(let i=0;i<5;i++)line(c,[[Lg[0]-gw*.6,Lg[1]+gh*.05+i*4],[Lg[0]+gw*.6,Lg[1]+gh*.05+i*4+2]],'#d5d8de',2);}
  if(sh==='skate'){for(const k of[-1,1]){c.beginPath();c.arc(F[0]+k*u*.14,F[1]+4,4,0,7);c.fillStyle=P.s;c.fill();c.lineWidth=1.5;c.strokeStyle=INK;c.stroke();glow(c,F[0]+k*u*.14,F[1]+6,7,P.g,.5);}
   plate(c,rrect(F[0]-u*.22,F[1]-2,u*.44,5,2),P.p,{lw:1.4});}
  if(sh==='cloud'){plate(c,ell(F[0],F[1]+3,u*.24,u*.06,14),P.s,{trim:GOLD});glow(c,F[0],F[1]+8,u*.3,P.g,.8);}
  const nz=[[F[0]+u*.12,F[1]-u*.12],[F[0]+u*.2,F[1]-u*.08],[F[0]+u*.2,F[1]+u*.0],[F[0]+u*.12,F[1]-u*.02]];plate(c,nz,P.s,{lw:1.4});glow(c,F[0]+u*.23,F[1]-u*.04,7,P.g,.7);
  stitch(c,Lg[0]-gw/2+2,Lg[1]+gh*.62,Lg[0]+gw/2-2,Lg[1]+gh*.62,P.g,2);}
}
// ---------- BOOSTER (behind body) ----------
function drawBooster(c,A,part,P,ch,out){if(!part)return;const[bx,by]=A.back,u=A.unit,sh=part.shape,tr=trimFor(part);out.noz=[];
 const nozzle=(x,y,ang,len,wid)=>{const p=xf([[0,-wid],[len,-wid*1.25],[len,wid*1.25],[0,wid]],x,y,ang);plate(c,p,P.s,{trim:tr});const e=xf([[len+2,0]],x,y,ang)[0];glow(c,e[0],e[1],wid*2.4,P.g,.85);out.noz.push(e);};
 if(sh==='puff'){plate(c,rrect(bx-u*.6,by-u*.12,u*1.2,u*.18,4),P.s);for(const s of[-1,1]){plate(c,ell(bx+s*u*.62,by-u*.1,u*.16,u*.16,14),P.p,{trim:tr});nozzle(bx+s*u*.62,by-u*.1+u*.1,Math.PI/2+s*.3,u*.14,u*.07);bolt(c,bx+s*u*.62,by-u*.12,2);}}
 else if(sh==='hornet'){for(const s of[-1,1]){const p=xf(rrect(-u*.1,-u*.55,u*.2,u*.7,6),bx+s*u*.5,by-u*.2,s*.35);plate(c,p,P.p,{trim:tr});stripes(c,xf(rrect(-u*.08,-u*.5,u*.16,u*.12,1),bx+s*u*.5,by-u*.2,s*.35),P.a);
  const b=xf([[0,u*.15]],bx+s*u*.5,by-u*.2,s*.35)[0];nozzle(b[0],b[1],Math.PI/2+s*.35,u*.12,u*.07);}}
 else if(sh==='kettle'){plate(c,ell(bx,by-u*.42,u*.42,u*.34,20),P.p,{trim:tr});plate(c,rrect(bx-u*.12,by-u*.86,u*.24,u*.12,3),P.s);
  stripes(c,rrect(bx-u*.36,by-u*.5,u*.72,u*.08,1),P.a);for(const s of[-1,1])nozzle(bx+s*u*.36,by-u*.3,s<0?Math.PI*.8:Math.PI*.2,u*.2,u*.09);}
 else if(sh==='comet'){for(const s of[-1,1]){const p=[[bx+s*u*.2,by-u*.2],[bx+s*u*.95,by-u*.75],[bx+s*u*1.05,by-u*.6],[bx+s*u*.4,by+u*.1]];plate(c,p,P.p,{trim:tr});
  plate(c,[[bx+s*u*.6,by-u*.45],[bx+s*u*1.0,by-u*.95],[bx+s*u*.9,by-u*.5]],P.a,{lw:1.5});nozzle(bx+s*u*.35,by+u*.05,Math.PI/2+s*.5,u*.18,u*.08);}}
 else if(sh==='wildfire'){c.save();c.lineWidth=9;c.strokeStyle=INK;c.beginPath();c.arc(bx,by-u*.2,u*.75,0,7);c.stroke();c.lineWidth=6;c.strokeStyle=P.s;c.stroke();c.lineWidth=1.2;c.strokeStyle=GOLD;c.stroke();c.restore();
  for(let i=0;i<6;i++){const a=-Math.PI/2+(i-2.5)*.55;const x=bx+Math.cos(a)*u*.75,y=by-u*.2+Math.sin(a)*u*.75;nozzle(x,y,a,u*.12,u*.06);}}
}
// ---------- GENERATOR (hip) ----------
function drawGen(c,A,part,P){if(!part)return;const[x,y]=A.hip,u=A.unit,sh=part.shape,tr=trimFor(part);
 if(sh==='pocket'){plate(c,rrect(x-u*.12,y-u*.12,u*.24,u*.24,3),P.s);plate(c,rrect(x-u*.07,y-u*.07,u*.14,u*.1,2),P.g,{lw:1.2});glow(c,x,y-u*.02,u*.2,P.g,.5);bolt(c,x-u*.08,y+u*.08,1.5);bolt(c,x+u*.08,y+u*.08,1.5);}
 else if(sh==='teapot'){plate(c,ell(x,y,u*.17,u*.14,18),P.p);plate(c,[[x+u*.14,y-u*.02],[x+u*.3,y-u*.12],[x+u*.32,y-u*.08],[x+u*.15,y+u*.06]],P.s,{lw:1.5});
  plate(c,ell(x,y-u*.14,u*.07,u*.035,10),P.s,{lw:1.4});c.beginPath();c.arc(x,y+u*.02,u*.06,0,7);c.fillStyle=P.g;c.fill();glow(c,x,y+u*.02,u*.22,P.g,.7);glow(c,x+u*.32,y-u*.12,u*.1,P.g,.6);}
 else if(sh==='spindle'){plate(c,rrect(x-u*.09,y-u*.2,u*.18,u*.4,4),P.s);for(let i=0;i<6;i++)line(c,[[x-u*.07,y-u*.14+i*u*.055],[x+u*.07,y-u*.12+i*u*.055]],P.g,1.6);glow(c,x,y,u*.25,P.g,.45);
  plate(c,rrect(x-u*.12,y-u*.24,u*.24,u*.06,2),P.p,{lw:1.4});plate(c,rrect(x-u*.12,y+u*.18,u*.24,u*.06,2),P.p,{lw:1.4});}
 else if(sh==='lantern'){plate(c,rrect(x-u*.13,y-u*.2,u*.26,u*.05,2),P.p);plate(c,rrect(x-u*.13,y+u*.14,u*.26,u*.05,2),P.p);c.beginPath();c.arc(x,y-u*.02,u*.1,0,7);c.fillStyle=P.g;c.fill();glow(c,x,y-u*.02,u*.32,P.g,.85);
  for(const k of[-1,-.33,.33,1])line(c,[[x+k*u*.11,y-u*.16],[x+k*u*.11,y+u*.15]],INK,1.6);}
 else if(sh==='sun'){c.beginPath();c.arc(x,y,u*.15,0,7);c.fillStyle=GOLD;c.fill();c.lineWidth=2;c.strokeStyle=INK;c.stroke();for(let i=0;i<10;i++){const a=i/10*6.283;plate(c,[[x+Math.cos(a)*u*.15,y+Math.sin(a)*u*.15],[x+Math.cos(a+.15)*u*.25,y+Math.sin(a+.15)*u*.25],[x+Math.cos(a+.3)*u*.15,y+Math.sin(a+.3)*u*.15]],GOLD,{lw:1.2});}
  c.beginPath();c.arc(x,y,u*.09,0,7);c.fillStyle=P.g;c.fill();glow(c,x,y,u*.4,P.g,.9);}
 strap(c,x,y-u*.2,u*.2,5,0,P);
}
// ---------- FCS ----------
function drawFcs(c,A,part,P){if(!part)return;const[hx]=A.head,w=A.hw,y=A.eyeY-.32*w,x=hx+.55*w,sh=part.shape;
 if(sh==='peep'){plate(c,rrect(x-3,y-6,14,10,3),P.s,{lw:1.6});lens(c,x+11,y-1,3,P.g);}
 else if(sh==='magpie'){plate(c,rrect(x-3,y-4,12,10,2),P.s,{lw:1.6});for(let i=0;i<3;i++)line(c,[[x+2+i*3,y-4],[x+i*6-2,y-26-i*4]],INK,1.4);for(let i=0;i<3;i++){c.beginPath();c.arc(x+i*6-2,y-26-i*4,1.8,0,7);c.fillStyle=P.g;c.fill();}}
 else if(sh==='needle'){plate(c,rrect(x-4,y-6,30,9,3),P.s,{lw:1.6});plate(c,rrect(x+8,y-10,8,4,1),P.p,{lw:1.2});lens(c,x+27,y-1.5,3.6,P.g);}
 else if(sh==='oracle'){const ox=x+14,oy=y-16;c.save();c.lineWidth=3;c.strokeStyle=INK;c.beginPath();c.ellipse(ox,oy,12,4,-.3,0,7);c.stroke();c.lineWidth=1.6;c.strokeStyle=GOLD;c.stroke();c.restore();lens(c,ox,oy,5.5,P.g);}
}
// ---------- WEAPONS (local: grip at 0,0 pointing +x) ----------
function weaponShape(c,part,P,u,o){const sh=part.shape,g=P.s,m=shade(P.s,1.5),tr=trimFor(part);let muz=[u*1.1,-u*.05];
 switch(sh){
 case'rifle':plate(c,rrect(-u*.3,-u*.12,u*.32,u*.16,3),g);plate(c,rrect(u*.2,u*.02,u*.14,u*.24,2),m);plate(c,rrect(0,-u*.16,u*.9,u*.2,4),P.p);plate(c,rrect(u*.86,-u*.1,u*.34,u*.07,2),g);plate(c,rrect(u*.25,-u*.26,u*.32,u*.09,3),g);lens(c,u*.58,-u*.215,2.2,P.g);stripes(c,rrect(u*.65,-u*.13,u*.14,u*.13,1),P.a);muz=[u*1.22,-u*.065];break;
 case'smg':plate(c,rrect(0,-u*.16,u*.6,u*.24,4),P.p);plate(c,ell(u*.28,u*.16,u*.14,u*.14,14),m);plate(c,rrect(u*.58,-u*.1,u*.26,u*.08,2),g);bolt(c,u*.28,u*.16,2);stripes(c,rrect(u*.06,-u*.12,u*.16,u*.08,1),P.a);muz=[u*.86,-u*.06];break;
 case'shotgun':case'mitt':plate(c,rrect(-u*.15,-u*.18,u*.55,u*.3,5),P.p);plate(c,rrect(u*.36,-u*.2,u*.5,u*.11,3),g);plate(c,rrect(u*.36,-u*.07,u*.5,u*.11,3),g);plate(c,rrect(u*.45,u*.06,u*.22,u*.08,2),m);
  c.beginPath();c.arc(u*.86,-u*.145,u*.035,0,7);c.arc(u*.86,-u*.015,u*.035,0,7);c.fillStyle=INK;c.fill();stripes(c,rrect(-u*.1,-u*.14,u*.18,u*.1,1),P.a);muz=[u*.9,-u*.08];break;
 case'longrifle':plate(c,rrect(-u*.35,-u*.1,u*.4,u*.16,3),g);plate(c,rrect(0,-u*.14,u*.85,u*.18,4),P.p);plate(c,rrect(u*.8,-u*.09,u*.75,u*.06,2),g);plate(c,rrect(u*.15,-u*.3,u*.5,u*.11,4),g);lens(c,u*.68,-u*.245,2.8,P.g);plate(c,rrect(u*1.45,-u*.12,u*.12,u*.12,2),m);muz=[u*1.6,-u*.06];break;
 case'burst':plate(c,rrect(0,-u*.18,u*.75,u*.26,4),P.p);for(let i=0;i<3;i++)plate(c,rrect(u*.72,-u*.17+i*u*.075,u*.34,u*.06,2),g);plate(c,rrect(u*.2,u*.06,u*.3,u*.14,2),m);for(let i=0;i<4;i++)bolt(c,u*.12+i*u*.16,-u*.05,1.6);muz=[u*1.08,-u*.06];break;
 case'cannon':plate(c,rrect(-u*.25,-u*.24,u*1.3,u*.38,10),P.p,{trim:tr});plate(c,rrect(u*1.0,-u*.3,u*.28,u*.5,4),g);c.beginPath();c.arc(u*1.28,-u*.05,u*.12,0,7);c.fillStyle=INK;c.fill();
  stripes(c,rrect(u*.2,-u*.2,u*.3,u*.3,1),P.a);plate(c,rrect(u*.1,u*.12,u*.2,u*.16,2),m);bolt(c,0,-u*.05,2.4);muz=[u*1.32,-u*.05];break;
 case'laser':plate(c,rrect(0,-u*.13,u*.95,u*.2,8),P.p);for(let i=0;i<3;i++){const x=u*.3+i*u*.18;c.beginPath();c.ellipse(x,-u*.03,u*.04,u*.15,0,0,7);c.fillStyle=INK;c.fill();c.lineWidth=2;c.strokeStyle=P.g;c.stroke();glow(c,x,-u*.03,u*.14,P.g,.45);}
  lens(c,u*1.0,-u*.03,u*.07,P.g);plate(c,rrect(u*.05,u*.05,u*.16,u*.16,2),g);muz=[u*1.06,-u*.03];break;
 case'couture':plate(c,rrect(-u*.2,-u*.1,u*.25,u*.14,3),g,{trim:GOLD});plate(c,rrect(0,-u*.16,u*1.05,u*.22,8),P.p,{trim:GOLD});for(let i=0;i<4;i++){plate(c,rrect(u*.2+i*u*.18,-u*.1,u*.1,u*.1,2),P.g,{lw:1});}glow(c,u*.5,-u*.05,u*.4,P.g,.4);
  plate(c,rrect(u*1.0,-u*.09,u*.4,u*.06,2),g,{trim:GOLD});muz=[u*1.42,-u*.06];break;
 case'pistol':plate(c,rrect(0,-u*.13,u*.5,u*.18,4),P.p);plate(c,rrect(u*.06,u*.03,u*.12,u*.18,2),g);plate(c,rrect(u*.46,-u*.09,u*.16,u*.06,2),g);stripes(c,rrect(u*.25,-u*.1,u*.12,u*.1,1),P.a);muz=[u*.64,-u*.06];break;
 }
 return muz;}
function bladeShape(c,part,P,u,charged){const sh=part.shape,g=P.s;let tip=[u*1.3,0];
 // forearm emitter block
 plate(c,rrect(-u*.25,-u*.12,u*.4,u*.24,4),g,{trim:trimFor(part)});bolt(c,-u*.15,0,2);
 if(sh==='cutter'){const p=[[u*.1,-u*.08],[u*1.15,-u*.08],[u*1.35,u*.02],[u*.1,u*.08]];plate(c,p,'#dfe3ea');for(let i=1;i<6;i++){const x=u*.1+i*u*.2;line(c,[[x,-u*.08],[x+u*.1,u*.08]],INK,1);}plate(c,rrect(u*.05,-u*.14,u*.25,u*.28,3),P.p);tip=[u*1.35,0];}
 else if(sh==='shears'){for(const s of[-1,1]){const p=[[u*.05,s*u*.02],[u*1.1,s*u*.1]];const z=[[u*.05,0]];for(let i=0;i<=10;i++){z.push([u*.05+i*u*.1,s*(u*.06+(i%2?u*.05:0))]);}z.push([u*1.15,s*u*.02]);plate(c,z,'#d5dae2',{lw:1.6});}
  bolt(c,u*.1,0,3);plate(c,ell(-u*.05,u*.18,u*.12,u*.08,12),P.a,{lw:1.6});tip=[u*1.15,0];}
 else if(sh==='needle'){plate(c,rrect(-u*.3,-u*.22,u*.95,u*.44,10),P.p);stripes(c,rrect(-u*.2,-u*.18,u*.2,u*.36,1),P.a);plate(c,rrect(u*.6,-u*.14,u*.12,u*.28,3),g);
  const n=[[u*.7,-u*.06],[u*1.5,-u*.03],[u*1.8,0],[u*1.5,u*.03],[u*.7,u*.06]];plate(c,n,'#e9ecf2');c.beginPath();c.ellipse(u*.9,0,u*.07,u*.025,0,0,7);c.fillStyle=INK;c.fill();
  c.save();c.strokeStyle=P.g;c.lineWidth=1.6;c.beginPath();c.moveTo(u*.9,0);c.bezierCurveTo(u*.6,u*.4,u*.2,u*.1,-u*.1,u*.35);c.stroke();c.restore();glow(c,u*.9,0,u*.2,P.g,.6);tip=[u*1.8,0];}
 else if(sh==='moon'||sh==='regalia'){const col=sh==='regalia'?'#c58cff':P.g;const L=sh==='regalia'?1.7:1.55;
  c.save();c.globalCompositeOperation='lighter';const g2=c.createLinearGradient(0,-u*.2,0,u*.2);g2.addColorStop(0,rgba(col,0));g2.addColorStop(.5,rgba(col,.9));g2.addColorStop(1,rgba(col,0));
  c.fillStyle=g2;c.beginPath();c.moveTo(u*.15,-u*.1);c.quadraticCurveTo(u*L*.7,-u*.32,u*L,0);c.quadraticCurveTo(u*L*.7,-u*.08,u*.15,u*.1);c.fill();
  c.fillStyle='rgba(255,255,255,.9)';c.beginPath();c.moveTo(u*.15,-u*.03);c.quadraticCurveTo(u*L*.7,-u*.22,u*L,0);c.quadraticCurveTo(u*L*.7,-u*.1,u*.15,u*.03);c.fill();c.restore();
  plate(c,rrect(-u*.02,-u*.12,u*.22,u*.24,3),P.p,{trim:GOLD});tip=[u*L,0];}
 else if(sh==='rapier'||sh==='katana'){const col=sh==='rapier'?'#ff4fa0':P.g,L=sh==='katana'?1.75:1.6;
  c.save();c.globalCompositeOperation='lighter';c.fillStyle=rgba(col,.55);c.beginPath();c.moveTo(u*.18,-u*.07);c.lineTo(u*L,sh==='katana'?-u*.05:0);c.lineTo(u*.18,u*.07);c.fill();
  c.strokeStyle='rgba(255,255,255,.95)';c.lineWidth=sh==='katana'?3:2;c.beginPath();c.moveTo(u*.2,0);c.quadraticCurveTo(u*L*.6,sh==='katana'?-u*.06:0,u*(L-.04),sh==='katana'?-u*.05:0);c.stroke();c.restore();glow(c,u*.9,0,u*.5,col,.35);
  plate(c,rrect(-u*.05,-u*.06,u*.24,u*.12,2),P.s,{lw:1.4});plate(c,rrect(u*.14,-u*.1,u*.06,u*.2,1),sh==='katana'?P.a:HAZ,{lw:1.2});tip=[u*L,0];}
 if(charged)glow(c,tip[0]*.6,tip[1],u*.6,P.g,.6);
 return tip;}
function backShape(c,part,P,u){const sh=part.shape,tr=trimFor(part);let muz=[0,-u];
 switch(sh){
 case'rack':plate(c,rrect(-u*.28,-u*.42,u*.56,u*.5,5),P.p);plate(c,rrect(-u*.12,-u*.3,u*.24,u*.24,3),'#f4f1e6',{lw:1.4});
  c.save();c.strokeStyle=P.g;c.lineWidth=1.6;c.setLineDash([2.5,2]);c.strokeRect(-u*.09,-u*.27,u*.18,u*.18);c.restore();stripes(c,rrect(-u*.26,-u*.04,u*.52,u*.08,1),P.a);bolt(c,-u*.2,-u*.35,2);bolt(c,u*.2,-u*.35,2);break;
 case'bkcannon':plate(c,rrect(-u*.2,-u*.25,u*.4,u*.35,5),P.s);plate(c,xf(rrect(-u*.1,-u*1.3,u*.2,u*1.25,5),0,-u*.1,.35),P.p);const t=xf([[0,-u*1.32]],0,-u*.1,.35)[0];plate(c,ell(t[0],t[1],u*.12,u*.07,12),P.s);muz=t;break;
 case'kites':plate(c,rrect(-u*.08,-u*.6,u*.16,u*.6,3),P.s);for(const s of[-1,1]){const k=[[s*u*.28,-u*.8],[s*u*.42,-u*.58],[s*u*.28,-u*.36],[s*u*.14,-u*.58]];plate(c,k,P.p);lens(c,s*u*.28,-u*.58,2.4,P.g);}muz=[0,-u*.6];break;
 case'pulse':plate(c,rrect(-u*.15,-u*.4,u*.3,u*.45,4),P.s);plate(c,ell(0,-u*.62,u*.32,u*.2,18),P.p);c.beginPath();c.ellipse(0,-u*.62,u*.18,u*.1,0,0,7);c.fillStyle=P.g;c.fill();glow(c,0,-u*.62,u*.5,P.g,.6);muz=[0,-u*.62];break;
 case'rail':plate(c,rrect(-u*.22,-u*.3,u*.44,u*.4,5),P.s,{trim:GOLD});for(const s of[-1,1])plate(c,xf(rrect(-u*.05+s*u*.08,-u*1.7,u*.08,u*1.6,3),0,-u*.1,.32),P.p,{trim:GOLD});
  const r1=xf([[0,-u*1.2],[0,-u*.4]],0,-u*.1,.32);c.save();c.globalCompositeOperation='lighter';c.strokeStyle=rgba(P.g,.9);c.lineWidth=2;c.beginPath();c.moveTo(r1[0][0],r1[0][1]);c.lineTo(r1[1][0],r1[1][1]);c.stroke();c.restore();muz=xf([[0,-u*1.75]],0,-u*.1,.32)[0];break;
 case'hunny':plate(c,rrect(-u*.15,-u*.3,u*.3,u*.32,4),P.s);const pot=ell(0,-u*.62,u*.3,u*.26,20);plate(c,pot,'#b06a2a');plate(c,rrect(-u*.22,-u*.92,u*.44,u*.1,4),'#f2a531');
  c.fillStyle='#ffc21f';c.beginPath();c.moveTo(-u*.2,-u*.83);c.quadraticCurveTo(-u*.1,-u*.66,-u*.06,-u*.8);c.quadraticCurveTo(u*.04,-u*.6,u*.1,-u*.8);c.lineTo(u*.2,-u*.83);c.fill();
  c.beginPath();c.arc(0,-u*.92,u*.08,Math.PI,0);c.fillStyle=INK;c.fill();bolt(c,-u*.22,-u*.6,2);bolt(c,u*.22,-u*.6,2);muz=[0,-u*.95];break;
 }
 return muz;}
function shoulderShape(c,part,P,u){const sh=part.shape,tr=trimFor(part);let muz=[0,-u*.3];
 switch(sh){
 case'pod':plate(c,rrect(-u*.26,-u*.42,u*.52,u*.4,5),P.p);for(let i=0;i<2;i++)for(let j=0;j<2;j++){const x=-u*.12+i*u*.24,y=-u*.3+j*u*.18;c.beginPath();c.arc(x,y,u*.07,0,7);c.fillStyle=INK;c.fill();c.beginPath();c.arc(x,y,u*.04,0,7);c.fillStyle=P.a;c.fill();}bolt(c,0,-u*.05,2);muz=[0,-u*.25];break;
 case'swarm':plate(c,ell(0,-u*.25,u*.32,u*.24,18),P.p);for(let i=-1;i<=1;i++)for(let j=-1;j<=1;j++){c.beginPath();c.arc(i*u*.13,-u*.25+j*u*.1,u*.035,0,7);c.fillStyle=INK;c.fill();glow(c,i*u*.13,-u*.25+j*u*.1,u*.05,P.g,.6);}muz=[0,-u*.25];break;
 case'mortar':plate(c,rrect(-u*.2,-u*.18,u*.4,u*.2,4),P.s);const m=xf(rrect(-u*.12,-u*.7,u*.24,u*.6,6),0,-u*.1,-.45);plate(c,m,P.p);const mt=xf([[0,-u*.72]],0,-u*.1,-.45)[0];plate(c,ell(mt[0],mt[1],u*.13,u*.06,12),P.s);stripes(c,xf(rrect(-u*.1,-u*.45,u*.2,u*.1,1),0,-u*.1,-.45),P.a);muz=mt;break;
 case'rockets':for(const s of[-1,1]){plate(c,rrect(s*u*.16-u*.12,-u*.6,u*.24,u*.6,8),P.p);plate(c,ell(s*u*.16,-u*.6,u*.12,u*.12,12,Math.PI,Math.PI*2),P.a);}stripes(c,rrect(-u*.28,-u*.18,u*.56,u*.08,1),P.a);muz=[0,-u*.6];break;
 case'gatling':plate(c,rrect(-u*.25,-u*.32,u*.4,u*.32,5),P.s);for(let i=0;i<3;i++)plate(c,rrect(u*.1,-u*.28+i*u*.08,u*.7,u*.06,2),'#9aa0ab',{lw:1.4});plate(c,rrect(u*.68,-u*.32,u*.1,u*.3,2),P.p);muz=[u*.8,-u*.17];break;
 case'starburst':{const p=[];for(let i=0;i<6;i++){const a=i/6*6.283;p.push([Math.cos(a)*u*.38,-u*.35+Math.sin(a)*u*.38]);}plate(c,p,P.p,{trim:GOLD});
  for(let i=0;i<7;i++){const a=i/6*6.283,r=i<6?u*.22:0;c.beginPath();c.arc(Math.cos(a)*r,-u*.35+Math.sin(a)*r,u*.06,0,7);c.fillStyle=INK;c.fill();glow(c,Math.cos(a)*r,-u*.35+Math.sin(a)*r,u*.08,P.g,.7);}muz=[0,-u*.35];break;}
 case'podburst':plate(c,ell(0,-u*.32,u*.16,u*.16,14),P.s);for(let i=0;i<8;i++){const a=i/8*6.283;const t=xf(rrect(-u*.05,-u*.38,u*.1,u*.2,3),0,-u*.32,a);plate(c,t,P.p,{lw:1.4});}glow(c,0,-u*.32,u*.3,P.g,.5);bolt(c,0,-u*.32,2.4);muz=[0,-u*.32];break;
 }
 return muz;}

// ---------- COMPOSITE ----------
// Returns {canvas, W, H, feetY, anchors{wr,wl,sh,bk,noz[],head,center}} in canvas px.
function compose(charId,loadout,paint,opt){opt=opt||{};
 // v2.1: real 3D armor first; 2D painter only as a fallback (no WebGL / context lost / error)
 if(!opt.force2d&&typeof compose3d==='function'){try{const r=compose3d(charId,loadout,paint,opt);if(r)return r;}catch(e){console.warn('3D compose failed, using 2D',e);}}
 return compose2d(charId,loadout,paint,opt);}
function compose2d(charId,loadout,paint,opt){const ch=CHARS[charId];const S=opt.scale||2;
 const W=Math.round(ch.w*2.15),H=Math.round(ch.h*1.45);const ox=(W-ch.w)/2,oy=ch.h*.3;
 const cv=opt.canvas||document.createElement('canvas');cv.width=W*S;cv.height=H*S;const c=cv.getContext('2d');c.clearRect(0,0,cv.width,cv.height);
 c.setTransform(S,0,0,S,ox*S,oy*S);const A=ch.a,P=paint,u=A.unit;const part=s=>loadout[s]?PARTS[loadout[s]]:null;const out={noz:[]};
 const T=()=>c.getTransform();const tp=(x,y)=>{const p=T().transformPoint(new DOMPoint(x,y));return[p.x,p.y];};
 // shadow
 if(!opt.noShadow){c.save();c.fillStyle='rgba(0,0,0,.35)';c.beginPath();c.ellipse(ch.w/2,ch.h+4,ch.w*.45,10,0,0,7);c.fill();c.restore();}
 // BACK slot (behind body, over the screen-right shoulder)
 const bk=part('bk');if(bk){c.save();c.translate(A.bkw[0],A.bkw[1]);const m=backShape(c,bk,P,u);out.bk=tp(m[0],m[1]);c.restore();}
 drawBooster(c,A,part('booster'),P,ch,out);out.noz=out.noz.map(q=>tp(q[0],q[1]));
 if(opt.img)c.drawImage(opt.img,0,0,ch.w,ch.h);
 drawLegs(c,A,part('legs'),P,ch);
 drawCore(c,A,part('core'),P,ch);
 if(part('core')&&ch.body!=='pod'){const[tx,ty,tw]=A.torso;cable(c,tx-tw*.38,ty-4,A.shl[0]+4,A.shl[1]+8,10,P.g);cable(c,tx+tw*.38,ty-4,A.shr[0]-4,A.shr[1]+8,10,P.g);}
 else if(part('core')){const[tx,ty,tw]=A.torso;cable(c,tx-tw*.3,ty+10,A.ml[0]+6,A.ml[1],8,P.g);cable(c,tx+tw*.3,ty+10,A.mr[0]-6,A.mr[1],8,P.g);}
 drawGen(c,A,part('gen'),P);
 if(part('gen')&&part('core')){const[tx,ty]=A.torso;cable(c,A.hip[0],A.hip[1]-8,tx,ty+12,12,P.g);}
 drawArms(c,A,part('arms'),P,ch);
 drawHead(c,A,part('head'),P);
 drawFcs(c,A,part('fcs'),P);
 // weapons
 const wu=u*(ch.body==='float'?.9:1);
 for(const[s,hand,dir]of[['wr','hl',-1],['wl','hr',1]]){const w=part(s);if(!w)continue;const H2=A[hand];c.save();c.translate(H2[0],H2[1]);
  if(dir<0)c.scale(-1,1);const blade=['blade','pile'].includes(w.cls);c.rotate(blade?.32:.06);
  const m=blade?bladeShape(c,w,P,wu,opt.charged):weaponShape(c,w,P,wu);
  out[s]=tp(m[0],m[1]);if(ch.body==='pod')bolt(c,0,0,2.2);c.restore();}
 const shp=part('sh');if(shp){c.save();const S1=A.shw;c.translate(S1[0],S1[1]);if(shp.shape==='gatling')c.scale(-1,1);const m=shoulderShape(c,shp,P,u);out.sh=tp(m[0],m[1]);
  c.restore();strap(c,S1[0],S1[1]-u*.02,u*.34,6,0,P);}
 out.head=tp(A.head[0],A.head[1]);out.center=tp(A.torso[0],A.torso[1]);
 c.setTransform(1,0,0,1,0,0);
 return{canvas:cv,W:cv.width,H:cv.height,feetY:(oy+ch.h)*S,anchors:out,scale:S};}
async function composeAsync(charId,loadout,paint,opt){const img=await loadImg(CHARS[charId].img);return compose(charId,loadout,paint,Object.assign({},opt,{img}));}

// Standalone icon of one part (drawn with no body, auto-cropped). Cached per part+paint.
const ICONS={};
function partIcon(id,paint,size){paint=paint||PAINTS[0];size=size||96;const k=id+paint.id+size;if(ICONS[k])return ICONS[k];const p=PARTS[id];if(!p)return null;
 const cid=p.only||'pinco';const ld={};ld[p.slot]=id;const r=compose(cid,ld,paint,{scale:1.4,noShadow:true});const cv=r.canvas,g=cv.getContext('2d');
 const d=g.getImageData(0,0,cv.width,cv.height).data;let x0=cv.width,y0=cv.height,x1=0,y1=0;for(let y=0;y<cv.height;y+=2)for(let x=0;x<cv.width;x+=2){if(d[(y*cv.width+x)*4+3]>20){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y;}}
 const out=document.createElement('canvas');out.width=out.height=size;if(x1<=x0){ICONS[k]=out;return out;}const w=x1-x0+4,h=y1-y0+4,sc=Math.min(size*.9/w,size*.9/h);
 out.getContext('2d').drawImage(cv,x0-2,y0-2,w,h,(size-w*sc)/2,(size-h*sc)/2,w*sc,h*sc);ICONS[k]=out;return out;}
