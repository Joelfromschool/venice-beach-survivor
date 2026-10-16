// ===== v1.1: themed sets, decor patterns, new shapes =====
THEMES.push(
 {id:'swamp',n:'Swamp Gala',e:'🐸',p:['#3fae5a','#2b2233','#8fd14f','#8e44ec','#7ee8c6'],bg:'swamp',hint:'Lily pads, midnight cloaks & frog-prince drama!'},
 {id:'honey',n:'Honey Party',e:'🍯',p:['#ffcc33','#ff9a2e','#e23b3b','#fff176','#fffafc'],bg:'honey',hint:'Golden, sweet & a little bit sticky!'},
 {id:'pea',n:'Garden Pea-rty',e:'🫛',p:['#8fd14f','#3fae5a','#ff7eb6','#fffafc','#fff176'],bg:'garden',hint:'Fresh greens, flowers & pea pods!'});
SW.splice(6,0,['#8fd14f','Pea'],['#3fae5a','Lily'],['#e23b3b','Pooh Red']);
// pattern overlay, clipped to the garment path
function decor(x,p,d,c){if(!p||!d)return;x.save();x.clip(p);const L=sh(c,.55),D=sh(c,-.35);
 if(d==='stripes'){x.fillStyle=c==='#ffcc33'||c==='#ff9a2e'?'#2b2233':L;for(let y=-200;y<1000;y+=46)x.fillRect(-100,y,700,20);}
 else if(d==='honeycomb'){x.strokeStyle=sh(c,-.3);x.lineWidth=4;for(let r=0;r<40;r++)for(let q=0;q<14;q++){const cx=q*42+(r%2)*21-40,cy=r*36-200;x.beginPath();for(let i=0;i<6;i++){const a=Math.PI/6+i*Math.PI/3;x.lineTo(cx+Math.cos(a)*22,cy+Math.sin(a)*22);}x.closePath();x.stroke();}x.fillStyle='rgba(255,170,0,.35)';for(let i=0;i<5;i++){x.beginPath();x.ellipse(60+i*80,0,14,0,0,0,7);}
  x.fillStyle=sh('#ff9a2e',-.05);for(let i=0;i<6;i++){const dx=40+i*66;x.beginPath();x.moveTo(dx-18,180);x.quadraticCurveTo(dx,260+(i%3)*40,dx+18,180);x.fill();}}
 else if(d==='lily'){for(let i=0;i<12;i++){const px=20+((i*113)%380),py=260+((i*157)%620);x.fillStyle=sh('#3fae5a',.1);x.beginPath();x.arc(px,py,24,.4,Math.PI*2-.1);x.lineTo(px,py);x.fill();x.fillStyle='#ff9fca';x.fill(starP(px+6,py-6,10,5));}}
 else if(d==='peas'){for(let i=0;i<16;i++){const px=10+((i*89)%400),py=240+((i*131)%640);x.fillStyle='#3fae5a';x.beginPath();x.ellipse(px,py,26,12,-.5,0,7);x.fill();x.fillStyle='#b8f07a';for(let j=-1;j<=1;j++)x.fill(circP(px+j*12*Math.cos(-.5),py+j*12*Math.sin(-.5),5.5));}}
 else if(d==='stars'){x.fillStyle=L;for(let i=0;i<22;i++)x.fill(starP(((i*97)%420)-10,190+((i*61)%720),9+(i%3)*4));}
 else if(d==='scales'){x.strokeStyle=L;x.lineWidth=3;for(let yy=200;yy<920;yy+=20)for(let xx=-20;xx<440;xx+=26){x.beginPath();x.arc(xx+(yy/20%2)*13,yy,12,0,Math.PI);x.stroke();}}
 else if(d==='plaid'){x.globalAlpha=.35;x.fillStyle=D;for(let i=-200;i<1000;i+=60){x.fillRect(-100,i,700,18);x.fillRect(i,-200,18,1200);}x.globalAlpha=.5;x.fillStyle='#ffcc33';for(let i=-200;i<1000;i+=60){x.fillRect(-100,i+30,700,3);x.fillRect(i+30,-200,3,1200);}}
 else if(d==='flowers'){for(let i=0;i<14;i++){const px=((i*103)%420),py=230+((i*149)%660);for(let k=0;k<5;k++){const a=k*1.2566;x.fillStyle=['#fffafc','#ff9fca','#fff176'][i%3];x.fill(circP(px+Math.cos(a)*9,py+Math.sin(a)*9,7));}x.fillStyle='#ffcc33';x.fill(circP(px,py,5));}}
 else if(d==='hearts'){x.fillStyle=L;for(let i=0;i<18;i++)x.fill(heartP(((i*97)%420),210+((i*67)%700),11));}
 x.restore();x.lineWidth=5;x.strokeStyle=sh(c,-.5);x.stroke(p);}
{const _t=drawTop;drawTop=function(x,it,c){const p=_t(x,it,c);decor(x,p,it.dec,c);return p;};}
{const _b=drawBot;drawBot=function(x,it,c){const p=_b(x,it,c);decor(x,p,it.dec,c);return p;};}
// new hats
{const _h=_hat;_hat=function(x,it,c){let p;
 if(it.k==='lilyhat'){p=new Path2D();p.arc(176,30,120,.25,Math.PI*2-.05);p.lineTo(176,30);p.closePath();x.save();x.translate(176,30);x.scale(1,.32);x.translate(-176,-30);fillP(x,p,rg(x,176,30,120,c),c,6);x.restore();for(let i=0;i<5;i++){const a=i*1.2566-1.57;fillP(x,starP(150+Math.cos(a)*4,8+Math.sin(a)*4,30,12),'#ffd0e6','#ff7eb6',3);}x.fillStyle='#ffcc33';x.fill(circP(150,8,9));return;}
 if(it.k==='pot'){p=new Path2D();p.moveTo(110,46);p.quadraticCurveTo(84,-60,140,-80);p.lineTo(230,-80);p.quadraticCurveTo(286,-60,262,46);p.closePath();fillP(x,p,lg(x,-80,46,c),c,5);fillP(x,rrP(126,-96,120,22,10),sh(c,.2),c,4);const lab=rrP(140,-46,92,44,10);fillP(x,lab,'#fff6d8','#c48a00',3);x.fillStyle='#c4166a';x.font='900 26px sans-serif';x.textAlign='center';x.fillText('HUNNY',186,-16);x.fillStyle='#ffb020';const dr=new Path2D();dr.moveTo(130,-84);for(let i=0;i<5;i++){dr.quadraticCurveTo(140+i*22,-40-(i%2)*30,152+i*22,-84);}x.fill(dr);gloss(x,p,-80,0);return;}
 if(it.k==='antenna'){x.strokeStyle='#2b2233';x.lineWidth=6;for(const s of[-1,1]){x.beginPath();x.moveTo(176+s*30,30);x.quadraticCurveTo(176+s*50,-60,176+s*80,-90);x.stroke();fillP(x,circP(176+s*80,-92,16),rg(x,176+s*80,-92,16,c),c,3);}fillP(x,rrP(104,16,160,20,10),'#2b2233','#2b2233',2);return;}
 if(it.k==='beanie'){p=new Path2D();p.moveTo(92,56);p.quadraticCurveTo(110,-60,200,-70);p.quadraticCurveTo(300,-70,300,-10);p.quadraticCurveTo(330,40,280,60);p.quadraticCurveTo(190,30,92,56);fillP(x,p,lg(x,-70,60,c),c,5);const tip=new Path2D();tip.moveTo(120,-20);tip.quadraticCurveTo(40,-30,20,60);tip.quadraticCurveTo(60,30,110,10);fillP(x,tip,lg(x,-30,60,c),c,4);gloss(x,p,-70,0);return;}
 if(it.k==='mesh'){p=new Path2D();p.moveTo(96,50);p.lineTo(130,-130);p.lineTo(232,-130);p.lineTo(272,50);p.closePath();x.fillStyle='rgba(255,247,170,.55)';x.fill(p);x.strokeStyle=c;x.lineWidth=7;x.save();x.clip(p);for(let yy=-140;yy<60;yy+=22)for(let xx=80;xx<290;xx+=30){x.beginPath();x.ellipse(xx+(yy/22%2)*15,yy,14,9,0,0,7);x.stroke();}x.restore();x.lineWidth=4;x.strokeStyle=sh(c,-.3);x.stroke(p);return;}
 return _h(x,it,c);};}
// new extras (left hand at ~36,470)
{const _a=drawAcc;drawAcc=function(x,it,c,back){
 if(it.k==='wings'){if(back)drawWings(x,c);return;}
 if(it.k==='dipper'){if(back)return;fillP(x,rrP(30,380,12,110,6),lg(x,380,490,'#c9925f'),'#c9925f',3);x.save();x.translate(36,370);for(let i=0;i<4;i++)fillP(x,rrP(-22,-50+i*14,44,10,5),lg(x,-50,0,c),c,3);x.restore();x.fillStyle=sh('#ffb020',.1);x.beginPath();x.moveTo(20,372);x.quadraticCurveTo(14,410,22,430);x.quadraticCurveTo(30,410,28,372);x.fill();return;}
 if(it.k==='jar'){if(back)return;x.strokeStyle='#c48a00';x.lineWidth=4;x.beginPath();x.arc(36,452,20,Math.PI,0);x.stroke();const p=rrP(4,460,64,84,18);x.globalAlpha=.55;fillP(x,p,'#d9fff0','#7ee8c6',4);x.globalAlpha=1;fillP(x,rrP(2,454,68,14,6),'#c9925f','#8a5a3c',3);
  const t=performance.now()/400;for(let i=0;i<4;i++){const fx=20+((i*23)%40)+Math.sin(t+i)*6,fy=480+((i*17)%50)+Math.cos(t*1.3+i)*6;x.fillStyle='rgba(230,255,120,.5)';x.fill(circP(fx,fy,9));x.fillStyle=c;x.fill(circP(fx,fy,4));}return;}
 return _a(x,it,c,back);};}
// new wand heads (wand drawn in hand space; reuse drawWand but swap head)
{const _w=drawWand;drawWand=function(x,it,c){if(!['lilyw','hexw','peaw','sunw'].includes(it.k))return _w(x,it,c);
 const hx=446,hy=452;x.save();x.translate(hx,hy);x.rotate(-.35);fillP(x,rrP(-6,-150,12,170,6),lg(x,-150,20,'#3fae5a'),'#2a7a3c',3);
 if(it.k==='lilyw'){for(let i=0;i<6;i++){x.save();x.translate(0,-184);x.rotate(i*1.047);fillP(x,new Path2D('M0 0 Q18 -26 0 -50 Q-18 -26 0 0'),lg(x,-50,0,c),c,3);x.restore();}fillP(x,circP(0,-184,10),'#ffcc33','#c48a00',2);}
 if(it.k==='hexw'){const p=new Path2D();for(let i=0;i<6;i++){const a=i*1.047;p.lineTo(Math.cos(a)*44,-184+Math.sin(a)*44);}p.closePath();fillP(x,p,rg(x,0,-184,46,c),c,4);x.fillStyle='rgba(255,255,255,.5)';x.fill(circP(-12,-196,9));}
 if(it.k==='peaw'){const p=new Path2D();p.ellipse(0,-190,22,52,0,0,7);fillP(x,p,lg(x,-240,-140,c),c,4);x.fillStyle='#b8f07a';for(let j=-1;j<=1;j++)x.fill(circP(0,-190+j*24,10));}
 if(it.k==='sunw'){for(let i=0;i<12;i++){x.save();x.translate(0,-184);x.rotate(i*.5236);fillP(x,new Path2D('M0 -20 Q12 -42 0 -60 Q-12 -42 0 -20'),c,c,2);x.restore();}fillP(x,circP(0,-184,24),rg(x,0,-184,24,'#8a5a3c'),'#5a3a1c',3);}
 spark(x,-18,-210,12);x.restore();};}
// new places
{const _bg=drawBG;drawBG=function(x,k,w,h,c,t){t=t||0;const G=(a,b)=>{const g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,a);g.addColorStop(1,b);return g;};
 if(k==='swamp'){x.fillStyle=G('#0f2a2a','#2c5a3a');x.fillRect(0,0,w,h);x.fillStyle='#fff6c8';x.fill(circP(w*.78,h*.14,w*.08));for(let i=0;i<5;i++){x.fillStyle='#173a26';x.beginPath();x.moveTo(i*w/4-20,h*.7);x.quadraticCurveTo(i*w/4+10,h*.25,i*w/4+40,h*.7);x.fill();}
  x.fillStyle=G('#1d4a3a','#0d2a22');x.fillRect(0,h*.7,w,h*.3);for(let i=0;i<7;i++){const px=(i*137)%w,py=h*(.76+(i%3)*.07);x.fillStyle='#3fae5a';x.beginPath();x.ellipse(px,py,w*.07,w*.025,0,.3,6.1);x.lineTo(px,py);x.fill();if(i%2){x.fillStyle='#ff9fca';x.fill(starP(px+8,py-4,7,3));}}
  for(let i=0;i<14;i++){const fx=(i*97+Math.sin(t+i)*20)%w,fy=h*.2+((i*61)%(h*.5))+Math.cos(t*1.4+i)*10;x.fillStyle='rgba(230,255,120,'+(.3+.5*Math.abs(Math.sin(t*2+i)))+')';x.fill(circP(fx,fy,4));}return;}
 if(k==='honey'){x.fillStyle=G('#fff3c4','#ffcf6a');x.fillRect(0,0,w,h);x.strokeStyle='rgba(200,130,0,.22)';x.lineWidth=3;for(let r=0;r<16;r++)for(let q=0;q<10;q++){const cx=q*48+(r%2)*24,cy=r*42;x.beginPath();for(let i=0;i<6;i++){const a=Math.PI/6+i*Math.PI/3;x.lineTo(cx+Math.cos(a)*26,cy+Math.sin(a)*26);}x.closePath();x.stroke();}
  x.fillStyle='#ffb020';x.beginPath();x.moveTo(0,0);for(let i=0;i<=10;i++){const dx=i*w/10;x.quadraticCurveTo(dx-w/20,h*(.06+(i%3)*.04),dx,0);}x.fill();
  for(let i=0;i<4;i++){const bx=w*(.12+i*.26),by=h*(.2+(i%2)*.08)+Math.sin(t*1.5+i)*6;x.strokeStyle='#c48a00';x.lineWidth=2;x.beginPath();x.moveTo(bx,by+30);x.lineTo(bx+4,by+90);x.stroke();x.fillStyle=['#e23b3b','#ffcc33','#ff7eb6','#ff9a2e'][i];x.beginPath();x.ellipse(bx,by,22,28,0,0,7);x.fill();}
  x.fillStyle=G('#e8a94a','#c9822a');x.fillRect(0,h*.78,w,h*.22);return;}
 if(k==='garden'){x.fillStyle=G('#bff0ff','#e9ffe0');x.fillRect(0,0,w,h);x.fillStyle='#fff8b0';x.fill(circP(w*.15,h*.12,w*.07));
  for(let i=0;i<9;i++){x.strokeStyle='#3fae5a';x.lineWidth=4;x.beginPath();const vx=i*w/8;x.moveTo(vx,h*.7);x.bezierCurveTo(vx-20,h*.5,vx+20,h*.4,vx,h*.25);x.stroke();x.fillStyle='#8fd14f';x.beginPath();x.ellipse(vx+10,h*.42,14,6,-.6,0,7);x.fill();x.fillStyle='#3fae5a';x.beginPath();x.ellipse(vx-6,h*.55,9,22,.4,0,7);x.fill();}
  x.fillStyle='#fffafc';for(let i=0;i<12;i++){const px=i*w/11;x.fillRect(px-8,h*.6,16,h*.16);x.beginPath();x.moveTo(px-8,h*.6);x.lineTo(px,h*.57);x.lineTo(px+8,h*.6);x.fill();}x.fillRect(0,h*.64,w,8);
  x.fillStyle=G('#8fd14f','#4f9a3a');x.fillRect(0,h*.76,w,h*.24);for(let i=0;i<10;i++){x.fillStyle=['#ff7eb6','#fff176','#fffafc'][i%3];x.fill(starP((i*71)%w,h*(.8+(i%3)*.05),7,3));}return;}
 return _bg(x,k,w,h,c,t);};}
ITEMS.push(
 {id:'lilygown',c:'top',n:'Lily Gown',shape:'gown',dec:'lily',col:'#3fae5a',tags:['swamp','royal','sparkle'],p:80},
 {id:'cloakdr',c:'top',n:'Midnight Cloak',shape:'spooky',col:'#2b2233',tags:['swamp','spooky'],p:60},
 {id:'swampsiren',c:'top',n:'Swamp Siren',shape:'mermaid',dec:'scales',col:'#3fae5a',tags:['swamp','sparkle'],p:95},
 {id:'honeygown',c:'top',n:'Honeycomb Gown',shape:'gown',dec:'honeycomb',col:'#ffcc33',tags:['honey','royal','sparkle'],p:85},
 {id:'beetee',c:'top',n:'Bumble Tee',shape:'tee',dec:'stripes',col:'#ffcc33',tags:['honey','sweet'],p:35},
 {id:'redtee',c:'top',n:'Pooh Red Tee',shape:'tee',col:'#e23b3b',tags:['honey','pop'],p:30},
 {id:'honeyhood',c:'top',n:'Honey Hoodie',shape:'hoodie',dec:'honeycomb',col:'#ff9a2e',tags:['honey','sweet'],p:55},
 {id:'peadress',c:'top',n:'Pea Pod Dress',shape:'sun',dec:'peas',col:'#8fd14f',tags:['pea','sweet'],p:45},
 {id:'gardenover',c:'top',n:'Garden Overalls',shape:'overall',dec:'flowers',col:'#7ee8c6',tags:['pea','beach'],p:50},
 {id:'starhood',c:'top',n:'Starry Hoodie',shape:'hoodie',dec:'stars',col:'#2c3e8f',tags:['space','pop'],p:50},
 {id:'candysun',c:'top',n:'Candy Stripe Dress',shape:'sun',dec:'stripes',col:'#ff7eb6',tags:['sweet','pop'],p:40},
 {id:'pearlmaid',c:'top',n:'Pearl Mermaid',shape:'mermaid',dec:'scales',col:'#b39dff',tags:['beach','royal','sparkle'],p:90},
 {id:'plaidcrop',c:'top',n:'Plaid Crop',shape:'pop',dec:'plaid',col:'#8e44ec',tags:['pop','spooky'],p:45},
 {id:'nebula',c:'top',n:'Nebula Gown',shape:'gown',dec:'stars',col:'#2c3e8f',tags:['space','royal','sparkle'],p:110},
 {id:'lilytutu',c:'bot',n:'Lily Tutu',k:'tutu',dec:'lily',col:'#3fae5a',tags:['swamp','sweet'],p:40},
 {id:'honeytutu',c:'bot',n:'Honey Tutu',k:'tutu',dec:'honeycomb',col:'#ffcc33',tags:['honey','sweet'],p:40},
 {id:'beeshorts',c:'bot',n:'Bee Shorts',k:'shorts',dec:'stripes',col:'#ffcc33',tags:['honey','beach'],p:30},
 {id:'peaskirt',c:'bot',n:'Pea Skirt',k:'starskirt',dec:'peas',col:'#8fd14f',tags:['pea'],p:35},
 {id:'plaidleg',c:'bot',n:'Plaid Leggings',k:'leggings',dec:'plaid',col:'#8e44ec',tags:['pop','spooky'],p:40},
 {id:'gardenpants',c:'bot',n:'Garden Pants',k:'cargo',dec:'flowers',col:'#3fae5a',tags:['pea','sweet'],p:40},
 {id:'honeybloom',c:'bot',n:'Honey Bloomers',k:'bloomers',col:'#ff9a2e',tags:['honey','sweet'],p:30},
 {id:'swampskirt',c:'bot',n:'Swamp Skirt',k:'starskirt',dec:'scales',col:'#2c5a3a',tags:['swamp','spooky'],p:45},
 {id:'lilyslip',c:'shoe',n:'Lily Slippers',k:'slippers',col:'#8fd14f',tags:['swamp','pea','sweet'],p:30},
 {id:'rainboots',c:'shoe',n:'Rain Boots',k:'boots',col:'#ffcc33',tags:['pea','honey','beach'],p:35},
 {id:'beesneaks',c:'shoe',n:'Bee Sneakers',k:'sneaks',col:'#ffcc33',tags:['honey','pop'],p:35},
 {id:'frogboots',c:'shoe',n:'Frog Boots',k:'boots',col:'#3fae5a',tags:['swamp'],p:45},
 {id:'rubyheels',c:'shoe',n:'Ruby Heels',k:'heels',col:'#e23b3b',tags:['royal','honey','sparkle'],p:60},
 {id:'peasandal',c:'shoe',n:'Pea Sandals',k:'jelly',col:'#8fd14f',tags:['pea','beach'],p:25},
 {id:'starmoon',c:'shoe',n:'Star Moon Boots',k:'moon',col:'#b39dff',tags:['space','pop'],p:55},
 {id:'lilyhat',c:'hat',n:'Lily Pad Hat',k:'lilyhat',col:'#3fae5a',tags:['swamp','pea'],p:45},
 {id:'honeypot',c:'hat',n:'Honey Pot Hat',k:'pot',col:'#d99a3c',tags:['honey'],p:60},
 {id:'antenna',c:'hat',n:'Bee Antennae',k:'antenna',col:'#ffcc33',tags:['honey','sweet'],p:30},
 {id:'peabeanie',c:'hat',n:'Pea Beanie',k:'beanie',col:'#8fd14f',tags:['pea','sweet'],p:40},
 {id:'meshcap',c:'hat',n:'Foam Mesh Cap',k:'mesh',col:'#fff176',tags:['honey','pop'],p:35},
 {id:'frogcrown',c:'hat',n:'Frog Prince Crown',k:'crown',col:'#8fd14f',tags:['swamp','royal','sparkle'],p:90},
 {id:'rosetiara',c:'hat',n:'Rose Tiara',k:'tiara',col:'#ff7eb6',tags:['royal','pea','sparkle'],p:55},
 {id:'starberet',c:'hat',n:'Star Beret',k:'beret',col:'#2c3e8f',tags:['space','pop'],p:35},
 {id:'dipper',c:'acc',n:'Honey Dipper',k:'dipper',col:'#ffcc33',tags:['honey'],p:35},
 {id:'jar',c:'acc',n:'Firefly Jar',k:'jar',col:'#e6ff6a',tags:['swamp','spooky'],p:45},
 {id:'peapurse',c:'acc',n:'Pea Purse',k:'purse',col:'#8fd14f',tags:['pea','sweet'],p:30},
 {id:'beewings',c:'acc',n:'Bee Wings',k:'wings',col:'#fff176',tags:['honey','sweet'],p:50},
 {id:'batwings',c:'acc',n:'Bat Wings',k:'wings',col:'#2b2233',tags:['spooky','swamp'],p:50},
 {id:'lilybeads',c:'acc',n:'Lily Necklace',k:'pearls',col:'#8fd14f',tags:['swamp','pea'],p:30},
 {id:'honeypearls',c:'acc',n:'Honey Pearls',k:'pearls',col:'#ffcc33',tags:['honey','royal'],p:40},
 {id:'nightcape',c:'acc',n:'Night Cape',k:'cape',col:'#2b2233',tags:['spooky','swamp','royal'],p:70},
 {id:'beebow',c:'bow',n:'Bee Bow',k:'polka',col:'#ffcc33',tags:['honey'],p:25},
 {id:'lilyclip',c:'bow',n:'Lily Flower',k:'flower',col:'#ff9fca',tags:['swamp','pea'],p:25},
 {id:'peabow',c:'bow',n:'Pea Bow',k:'classic',col:'#8fd14f',tags:['pea'],p:20},
 {id:'batbow',c:'bow',n:'Bat Bow',k:'classic',col:'#2b2233',tags:['spooky','swamp'],p:25},
 {id:'starribbon',c:'bow',n:'Star Ribbon',k:'ribbon',col:'#ffcc33',tags:['space','royal'],p:30},
 {id:'lilyw',c:'wand',n:'Lily Wand',k:'lilyw',col:'#ff9fca',tags:['swamp','pea'],p:40},
 {id:'hexw',c:'wand',n:'Honeycomb Wand',k:'hexw',col:'#ffcc33',tags:['honey'],p:40},
 {id:'peaw',c:'wand',n:'Pea Wand',k:'peaw',col:'#8fd14f',tags:['pea'],p:35},
 {id:'fireflyw',c:'wand',n:'Firefly Wand',k:'bubble',col:'#e6ff6a',tags:['swamp','spooky'],p:35},
 {id:'sunw',c:'wand',n:'Sunflower Wand',k:'sunw',col:'#ffcc33',tags:['pea','beach','honey'],p:35},
 {id:'swampbg',c:'bg',n:'Moonlit Swamp',k:'swamp',col:'#3fae5a',tags:['swamp'],p:50},
 {id:'honeybg',c:'bg',n:'Honey Hall',k:'honey',col:'#ffcc33',tags:['honey'],p:50},
 {id:'gardenbg',c:'bg',n:'Pea Garden',k:'garden',col:'#8fd14f',tags:['pea'],p:50});
