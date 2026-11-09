// Original procedural 16x16 pixel textures for every block, painted at startup.
// Nothing here is copied from any existing game; palettes and patterns are hand-tuned for Blockhaven.
import {mulberry} from './util.js';
export const TS=16, AT=256, PER=AT/TS;
const hex=h=>{h=h.replace('#','');return[parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)]};
const vary=(c,a)=>c.map(v=>Math.max(0,Math.min(255,Math.round(v+a))));
const mix=(a,b,t)=>a.map((v,i)=>Math.round(v+(b[i]-v)*t));
export const TILE={};
const painters=[];
function T(name,fn){TILE[name]=painters.length;painters.push(fn)}
// Painter helper
function P(data,ox,oy,seed){const r=mulberry(seed*7919+13);const p={r,
 px(x,y,c,a=255){if(x<0||y<0||x>15||y>15)return;const i=((oy+y)*AT+ox+x)*4;data[i]=c[0];data[i+1]=c[1];data[i+2]=c[2];data[i+3]=a},
 get(x,y){const i=((oy+y)*AT+ox+x)*4;return[data[i],data[i+1],data[i+2],data[i+3]]},
 noise(pal,amt=0){for(let y=0;y<16;y++)for(let x=0;x<16;x++){p.px(x,y,vary(pal[Math.floor(r()*pal.length)],(r()-.5)*amt))}},
 clump(pal,k=0.55){// spatially coherent noise: neighbours share tones
  const g=[];for(let y=0;y<16;y++){g[y]=[];for(let x=0;x<16;x++){let v=r();if(x>0&&r()<k)v=g[y][x-1];else if(y>0&&r()<k)v=g[y-1][x];g[y][x]=v;p.px(x,y,pal[Math.min(pal.length-1,Math.floor(v*pal.length))])}}},
 speck(col,n,size=1){for(let i=0;i<n;i++){let x=Math.floor(r()*16),y=Math.floor(r()*16);for(let k=0;k<size;k++)p.px(x+(k%2),y+(k>>1),col)}},
 clear(){for(let y=0;y<16;y++)for(let x=0;x<16;x++)p.px(x,y,[0,0,0],0)}};return p}
const GREENS=['#5da839','#69b541','#57a034','#74c04b','#4f9530'].map(hex);
const DIRT=['#8b5d3c','#7c5034','#976846','#6f452c','#85593a'].map(hex);
const STONE=['#8c8c8c','#828282','#979797','#777777','#8a8a8f'].map(hex);
function ore(p,col,hi,n=5){p.clump(STONE,.5);for(let i=0;i<n;i++){let cx=2+Math.floor(p.r()*12),cy=2+Math.floor(p.r()*12);const pts=[[0,0],[1,0],[0,1],[1,1],[-1,0],[0,-1]];for(const[dx,dy]of pts)if(p.r()<.75)p.px(cx+dx,cy+dy,vary(col,(p.r()-.5)*24));p.px(cx,cy,hi)}}
function bark(p,base,dark,light){for(let x=0;x<16;x++){let col=x%4===0?dark:p.r()<.3?light:base;for(let y=0;y<16;y++){p.px(x,y,vary(p.r()<.12?dark:col,(p.r()-.5)*12))}}for(let i=0;i<5;i++){let x=Math.floor(p.r()*16),y=Math.floor(p.r()*14);p.px(x,y,dark);p.px(x,y+1,dark)}}
function rings(p,bark,inner,ring){for(let y=0;y<16;y++)for(let x=0;x<16;x++){let d=Math.max(Math.abs(x-7.5),Math.abs(y-7.5));let c=d>6.6?bark:Math.floor(d)%2?ring:inner;p.px(x,y,vary(c,(p.r()-.5)*10))}}
function leaves(p,pal,holes=.16){for(let y=0;y<16;y++)for(let x=0;x<16;x++){if(p.r()<holes)p.px(x,y,[0,0,0],0);else p.px(x,y,pal[Math.floor(p.r()*pal.length)])}}
function felt(p,base){for(let y=0;y<16;y++)for(let x=0;x<16;x++){let v=((x+y)%4===0?-14:0)+((x-y+16)%4===0?-8:0)+(p.r()-.5)*14;p.px(x,y,vary(base,v))}for(let i=0;i<16;i+=2){p.px(i,0,vary(base,-30));p.px(i,15,vary(base,-30));p.px(0,i,vary(base,-30));p.px(15,i,vary(base,-30))}}
function planksP(p,base){for(let y=0;y<16;y++){const board=Math.floor(y/4);for(let x=0;x<16;x++){let c=vary(base,(p.r()-.5)*14+(board%2?-8:4));if(y%4===3)c=vary(base,-46);if((x+board*5)%16===0&&y%4!==3)c=vary(base,-38);p.px(x,y,c)}}for(let i=0;i<6;i++){p.px(Math.floor(p.r()*16),Math.floor(p.r()*4)*4+1,vary(base,-24))}}
function cross(p,stem,pal,head){p.clear();for(let y=6;y<16;y++)p.px(7+(y%3===0?1:0),y,stem);p.px(6,11,stem);p.px(5,10,stem);p.px(9,12,stem);p.px(10,11,stem);for(const[dx,dy]of[[0,0],[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,-1],[1,-1],[-1,1]])p.px(7+dx,4+dy,pal[(dx+dy+3)%pal.length]);p.px(7,4,head)}
function brick(p,mortar,brickPal,h=4,w=8){for(let y=0;y<16;y++)for(let x=0;x<16;x++){const row=Math.floor(y/h),off=row%2?w/2:0;let c=(y%h===h-1||(x+off)%w===0)?mortar:brickPal[(Math.floor((x+off)/w)+row)%brickPal.length];p.px(x,y,vary(c,(p.r()-.5)*16))}}
function cobble(p,pal,mortar){const seeds=[];for(let i=0;i<9;i++)seeds.push([p.r()*16,p.r()*16,pal[Math.floor(p.r()*pal.length)]]);for(let y=0;y<16;y++)for(let x=0;x<16;x++){let best=1e9,second=1e9,c;for(const s of seeds){for(const ox of[-16,0,16])for(const oy of[-16,0,16]){let d=Math.hypot(x-s[0]-ox,y-s[1]-oy);if(d<best){second=best;best=d;c=s[2]}else if(d<second)second=d}}p.px(x,y,second-best<1.1?mortar:vary(c,(p.r()-.5)*18+(best<2?10:0)))}}

T('grass_top',p=>p.clump(GREENS,.45));
T('grass_side',p=>{p.clump(DIRT,.4);for(let x=0;x<16;x++){let d=3+Math.floor(p.r()*3)+(x%5===2?1:0);for(let y=0;y<d;y++)p.px(x,y,GREENS[Math.floor(p.r()*GREENS.length)])}});
T('dirt',p=>{p.clump(DIRT,.4);p.speck(hex('#5e3a24'),7);p.speck(hex('#a3774f'),4)});
T('stone',p=>{p.clump(STONE,.55);for(let i=0;i<4;i++){let x=Math.floor(p.r()*14),y=Math.floor(p.r()*16);for(let k=0;k<3;k++)p.px(x+k,y,hex('#6b6b6b'))}});
T('cobble',p=>cobble(p,['#9a9a9a','#848484','#a6a6a6','#7b7b7b'].map(hex),hex('#555558')));
const SAND=['#e9d9a1','#e0cf94','#efe1ae','#d9c78a'].map(hex);
T('sand',p=>{p.clump(SAND,.35);p.speck(hex('#c8b277'),6)});
T('sandstone_side',p=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++){let c=y<3?hex('#e6d39a'):y%5===4?hex('#c9b27a'):SAND[(y+Math.floor(p.r()*2))%4];p.px(x,y,vary(c,(p.r()-.5)*10))}});
T('sandstone_top',p=>{p.clump(['#ead9a2','#e3d197'].map(hex),.6);for(let i=0;i<16;i++){p.px(i,0,hex('#cdb57e'));p.px(i,15,hex('#cdb57e'));p.px(0,i,hex('#cdb57e'));p.px(15,i,hex('#cdb57e'))}});
T('log_side',p=>bark(p,hex('#7a5532'),hex('#523620'),hex('#8c6440')));
T('log_top',p=>rings(p,hex('#5b3d24'),hex('#d2a464'),hex('#b78850')));
T('planks',p=>planksP(p,hex('#c69a5b')));
T('leaves',p=>leaves(p,['#3f8f2c','#4b9e33','#357a25','#58ad3d','#2f6d22'].map(hex)));
T('glass',p=>{p.clear();for(let i=0;i<16;i++){p.px(i,0,hex('#e8f6ff'),230);p.px(i,15,hex('#bcd8ea'),230);p.px(0,i,hex('#e8f6ff'),230);p.px(15,i,hex('#bcd8ea'),230)}for(let i=0;i<4;i++){p.px(3+i,4-i+2,hex('#ffffff'),200);p.px(9+i,12-i,hex('#ffffff'),170)}});
T('water',p=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++){let w=Math.sin((x+y*0.6)*0.9)*10+Math.sin(y*1.7)*6;p.px(x,y,vary(hex('#3a74d6'),w+(p.r()-.5)*8),255)}});
T('snow',p=>{p.clump(['#f4f8fc','#e9f0f7','#ffffff','#dfe8f2'].map(hex),.5)});
T('snow_side',p=>{p.clump(DIRT,.4);for(let x=0;x<16;x++){let d=4+Math.floor(p.r()*3);for(let y=0;y<d;y++)p.px(x,y,vary(hex('#f2f6fb'),(p.r()-.5)*14))}});
T('ice',p=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)p.px(x,y,vary(hex('#9fd3f2'),(p.r()-.5)*12+((x*3+y)%11===0?30:0)));for(let i=0;i<10;i++)p.px(4+i,2+Math.floor(i*1.2),hex('#d7f0ff'))});
T('coal_ore',p=>ore(p,hex('#2d2b2a'),hex('#474240')));
T('iron_ore',p=>ore(p,hex('#d7a684'),hex('#f2cdb0')));
T('gold_ore',p=>ore(p,hex('#f4bd2f'),hex('#fff2a0'),4));
T('star_ore',p=>{ore(p,hex('#b07cf5'),hex('#ffffff'),4);p.speck(hex('#e3c8ff'),3)});
T('deepstone',p=>{p.clump(['#3b3a40','#2c2b30','#4a4950','#232226'].map(hex),.3)});
T('magma',p=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++){let v=Math.sin(x*.9+y*.4)+Math.sin(y*1.1-x*.5);p.px(x,y,v>.9?hex('#ffd04a'):v>0?hex('#ff7a1c'):vary(hex('#7a2410'),(p.r()-.5)*20))}});
T('bricks',p=>brick(p,hex('#cfc6b8'),['#a3452e','#b55436','#94402b'].map(hex)));
T('wool',p=>felt(p,hex('#f1e8d4')));
T('bench_top',p=>{planksP(p,hex('#b98a50'));for(let i=0;i<16;i++){p.px(i,5,hex('#5e3e22'));p.px(i,10,hex('#5e3e22'));p.px(5,i,hex('#5e3e22'));p.px(10,i,hex('#5e3e22'))}});
T('bench_side',p=>{planksP(p,hex('#a87a45'));for(let y=3;y<11;y++)p.px(4,y,hex('#6e4a2a'));for(let x=2;x<7;x++)p.px(x,3,hex('#9da3a8'));for(let x=2;x<7;x++)p.px(x,2,hex('#c4cacf'));for(let y=4;y<12;y++)p.px(11,y,hex('#6e4a2a'));for(let x=9;x<14;x++){p.px(x,4,hex('#8f969b'));p.px(x,5,hex('#8f969b'))}for(let x=0;x<16;x++){p.px(x,15,hex('#4b321c'));p.px(x,14,hex('#6e4a2a'))}});
T('kiln_front',p=>{brick(p,hex('#5e5651'),['#8d7f72','#9a8b7c','#7f7266'].map(hex),4,8);for(let y=7;y<14;y++)for(let x=4;x<12;x++){let arch=y>8||(x>4&&x<11);if(arch)p.px(x,y,y>11?hex('#ff9a2b'):hex('#2a1d17'))}for(let x=4;x<12;x+=2)p.px(x,12,hex('#ffd25a'))});
T('kiln_side',p=>brick(p,hex('#5e5651'),['#8d7f72','#9a8b7c','#7f7266'].map(hex),4,8));
T('chest_front',p=>{planksP(p,hex('#b07a3a'));for(let i=0;i<16;i++){p.px(i,0,hex('#5a3a1a'));p.px(i,15,hex('#5a3a1a'));p.px(0,i,hex('#5a3a1a'));p.px(15,i,hex('#5a3a1a'));p.px(i,6,hex('#5a3a1a'))}for(let y=5;y<9;y++)for(let x=7;x<9;x++)p.px(x,y,hex('#f2c447'))});
T('chest_side',p=>{planksP(p,hex('#b07a3a'));for(let i=0;i<16;i++){p.px(i,0,hex('#5a3a1a'));p.px(i,15,hex('#5a3a1a'));p.px(0,i,hex('#5a3a1a'));p.px(15,i,hex('#5a3a1a'));p.px(i,6,hex('#5a3a1a'))}});
T('torch',p=>{p.clear();for(let y=6;y<16;y++){p.px(7,y,hex('#7a5532'));p.px(8,y,hex('#8c6440'))}p.px(7,5,hex('#ffb32e'));p.px(8,5,hex('#ffde5c'));p.px(7,4,hex('#fff2a8'));p.px(8,4,hex('#ffb32e'));p.px(7,6,hex('#ff8a1e'));p.px(8,6,hex('#ff8a1e'))});
T('flower_red',p=>cross(p,hex('#3f8a2a'),['#e2463b','#c9302a','#f0665a'].map(hex),hex('#ffd23f')));
T('flower_yellow',p=>cross(p,hex('#3f8a2a'),['#f6d23b','#e9b923','#ffe46a'].map(hex),hex('#c76d1e')));
T('flower_blue',p=>cross(p,hex('#3f8a2a'),['#5b86e8','#4569cf','#7aa1f4'].map(hex),hex('#f4f4ff')));
T('tallgrass',p=>{p.clear();for(let i=0;i<9;i++){let x=1+Math.floor(p.r()*14),h=5+Math.floor(p.r()*9);for(let y=16-h;y<16;y++)p.px(x+(y<10&&i%2?1:0),y,GREENS[(y+i)%GREENS.length])}});
for(let s=0;s<4;s++)T('wheat'+s,p=>{p.clear();const h=4+s*3,col=s<3?hex('#6eaa3a'):hex('#d6b04a'),top=s<3?hex('#8bc44c'):hex('#e9cd6a');for(let i=0;i<6;i++){let x=1+i*2.6|0;for(let y=16-h;y<16;y++)p.px(x,y,y<16-h+3?top:col)}});
T('cactus_side',p=>{for(let y=0;y<16;y++)for(let x=1;x<15;x++)p.px(x,y,vary(x%4===1?hex('#2f7a2c'):hex('#4c9a3c'),(p.r()-.5)*12));for(let y=0;y<16;y++){p.px(0,y,[0,0,0],0);p.px(15,y,[0,0,0],0)}for(let i=0;i<8;i++)p.px(1+Math.floor(p.r()*14),Math.floor(p.r()*16),hex('#e8e2b0'))});
T('cactus_top',p=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)p.px(x,y,(x<1||x>14||y<1||y>14)?[0,0,0]:vary(hex('#5aa846'),(p.r()-.5)*12),(x<1||x>14||y<1||y>14)?0:255);for(let i=3;i<13;i++){p.px(i,7,hex('#3d8a34'));p.px(7,i,hex('#3d8a34'))}});
T('pine_log',p=>bark(p,hex('#4f3622'),hex('#33231a'),hex('#5e4330')));
T('pine_top',p=>rings(p,hex('#3b2a1c'),hex('#b38a5c'),hex('#9a7248')));
T('pine_leaves',p=>leaves(p,['#2c5f3c','#336b44','#244f32','#3d7a4f'].map(hex),.12));
T('duskstone',p=>{p.clump(['#1f1730','#2a1f40','#171126','#33264d'].map(hex),.45);p.speck(hex('#8a62d6'),5)});
T('portal',p=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++){let a=Math.atan2(y-7.5,x-7.5),d=Math.hypot(x-7.5,y-7.5);let v=Math.sin(a*3+d*1.3);p.px(x,y,v>.4?hex('#ffe17a'):v>-.3?hex('#f2a93a'):hex('#c76a2a'),200)}});
T('gold_block',p=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++){let e=x===0||y===0?40:x===15||y===15?-40:0;p.px(x,y,vary(hex('#f4c43a'),e+(p.r()-.5)*14+((x+y)%7===0?24:0)))}for(let i=3;i<7;i++)p.px(i,3,hex('#fff4b8'))});
T('iron_block',p=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++){let e=x===0||y===0?40:x===15||y===15?-40:0;p.px(x,y,vary(hex('#d9dde2'),e+(p.r()-.5)*10))}for(let i=2;i<14;i++)p.px(i,8,hex('#b9bec4'))});
T('bed_top',p=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++){let c=y<5?hex('#f6f2ea'):hex('#d8424a');if(y>=5&&(x+y)%6===0)c=hex('#f08a8f');if(x===0||x===15)c=hex('#8a5a32');p.px(x,y,vary(c,(p.r()-.5)*8))}});
T('bed_side',p=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++){let c=y<7?hex('#d8424a'):y<9?hex('#f6f2ea'):y<14?hex('#a8743f'):(x<3||x>12)?hex('#6d4728'):[0,0,0];p.px(x,y,vary(c,(p.r()-.5)*8),y>=14&&!(x<3||x>12)?0:255)}});
T('mossy',p=>{cobble(p,['#9a9a9a','#848484','#a6a6a6','#7b7b7b'].map(hex),hex('#555558'));for(let i=0;i<40;i++){let x=Math.floor(p.r()*16),y=Math.floor(p.r()*16);p.px(x,y,GREENS[i%5])}});
T('felt_pink',p=>felt(p,hex('#f29ab9')));T('felt_blue',p=>felt(p,hex('#6d9ae6')));T('felt_yellow',p=>felt(p,hex('#f3cd47')));T('felt_green',p=>felt(p,hex('#73b84f')));
T('lamp',p=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++){let edge=x<2||y<2||x>13||y>13;let d=Math.hypot(x-7.5,y-7.5);p.px(x,y,edge?hex('#8a5a22'):vary(d<3?hex('#fff3b0'):d<5?hex('#ffd65a'):hex('#f3a92e'),(p.r()-.5)*10))}for(let i=2;i<14;i+=4){p.px(i,7,hex('#8a5a22'));p.px(7,i,hex('#8a5a22'))}});
const GLOOMG=['#5b4a8c','#4f3f7d','#6a58a0','#463873'].map(hex);
T('gloom_top',p=>p.clump(GLOOMG,.45));
T('gloom_side',p=>{p.clump(DIRT.map(c=>vary(c,-18)),.4);for(let x=0;x<16;x++){let d=3+Math.floor(p.r()*4);for(let y=0;y<d;y++)p.px(x,y,GLOOMG[Math.floor(p.r()*4)])}});
T('gloom_log',p=>bark(p,hex('#3d3150'),hex('#271e36'),hex('#4c3e63')));
T('gloom_leaves',p=>{leaves(p,['#7a4fb0','#8b5cc4','#6a429a','#a477d8'].map(hex),.14);p.speck(hex('#d6b8ff'),4)});
T('berry_bush',p=>{p.clear();for(let i=0;i<70;i++){let x=Math.floor(p.r()*16),y=4+Math.floor(p.r()*12);p.px(x,y,GREENS[i%5].map(v=>v-25))}for(let i=0;i<7;i++){let x=2+Math.floor(p.r()*12),y=5+Math.floor(p.r()*9);p.px(x,y,hex('#e0386a'));p.px(x+1,y,hex('#b8244f'));p.px(x,y-1,hex('#ff7aa0'))}});
T('stone_bricks',p=>brick(p,hex('#5f5f62'),['#9a9a9c','#8d8d90','#a4a4a6'].map(hex),8,8));
T('mushroom',p=>{p.clear();for(let y=9;y<16;y++){p.px(7,y,hex('#efe6d2'));p.px(8,y,hex('#ddd2bb'))}for(let y=5;y<9;y++)for(let x=3+(8-y>1?1:0);x<13-(8-y>1?1:0);x++)p.px(x,y,hex('#c8443a'));for(let x=5;x<11;x++)p.px(x,4,hex('#c8443a'));p.px(5,6,hex('#fff'));p.px(9,5,hex('#fff'));p.px(11,7,hex('#fff'))});
T('hoardstone',p=>{p.clump(['#c9a96a','#b8975a','#d6b87a','#a8884e'].map(hex),.5);p.speck(hex('#ffe08a'),6)});
T('web',p=>{p.clear();for(let i=0;i<16;i++){p.px(i,i,hex('#f2f2f2'),200);p.px(15-i,i,hex('#f2f2f2'),200);p.px(7,i,hex('#e6e6e6'),180);p.px(i,7,hex('#e6e6e6'),180)}for(let a=0;a<6.28;a+=.2){p.px(Math.round(7.5+Math.cos(a)*4),Math.round(7.5+Math.sin(a)*4),hex('#ffffff'),190);p.px(Math.round(7.5+Math.cos(a)*7),Math.round(7.5+Math.sin(a)*7),hex('#ffffff'),170)}});
T('star_block',p=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++){let e=x===0||y===0?40:x===15||y===15?-40:0;p.px(x,y,vary(hex('#b07cf5'),e+(p.r()-.5)*14+((x*2+y)%9===0?30:0)))}});
T('sapling',p=>{p.clear();for(let y=8;y<16;y++)p.px(7,y,hex('#6e4a2a'));for(let i=0;i<30;i++){let a=p.r()*6.28,d=p.r()*4.5;p.px(Math.round(7.5+Math.cos(a)*d),Math.round(6+Math.sin(a)*d*.8),GREENS[i%5])}});
T('lantern_gate',p=>{p.clump(['#2f2650','#3a2f63','#272042'].map(hex),.5);for(let i=0;i<16;i++){p.px(i,0,hex('#e8b84a'));p.px(i,15,hex('#e8b84a'));p.px(0,i,hex('#e8b84a'));p.px(15,i,hex('#e8b84a'))}for(let i=5;i<11;i++){p.px(i,7,hex('#ffe17a'));p.px(7,i,hex('#ffe17a'))}});
T('shard_socket',p=>{brick(p,hex('#4a3d2a'),['#d9b45a','#c9a24a'].map(hex),8,8);for(let y=5;y<11;y++)for(let x=5;x<11;x++)p.px(x,y,hex('#20182c'))});
T('cloud',p=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)p.px(x,y,[255,255,255],255)});
T('crack0',p=>{p.clear();for(let i=0;i<5;i++)p.px(6+i,7+(i%2),[0,0,0],170)});

// ---- Coast (Venice Beach / Santa Monica) tiles: all original patterns ----
T('palm_log',p=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++){const band=(y%4===0);p.px(x,y,vary(band?hex('#7a5a36'):hex('#9c7a4c'),(p.r()-.5)*14+(x%5===0?-14:0)))}});
T('palm_top',p=>{rings(p,hex('#7a5a36'),hex('#b89366'),hex('#a07c50'))});
T('palm_leaves',p=>{p.clear();const pal=['#3f9a3a','#4fb04a','#2f7f2e','#5cbd52'].map(hex);for(let k=0;k<4;k++){const y0=1+k*4;for(let x=0;x<16;x++){const y=y0+Math.floor(Math.abs(x-7.5)/4);p.px(x,y,pal[(x+k)%4]);if(x%2===0)p.px(x,y+1,pal[(x+k+1)%4]);if(p.r()<.35)p.px(x,y-1,pal[2])}}});
T('asphalt',p=>{p.noise(['#4a4a50','#45454b','#505057','#3f3f45'].map(hex),8);p.speck(hex('#5c5c64'),10)});
T('asphalt_line',p=>{p.noise(['#4a4a50','#45454b','#505057','#3f3f45'].map(hex),8);for(let y=0;y<16;y++)if(y%8<5)for(const x of[7,8])p.px(x,y,vary(hex('#e8c84a'),(p.r()-.5)*20))});
T('concrete',p=>{p.noise(['#c9c6be','#c2bfb7','#cfccc4','#bdbab2'].map(hex),6);for(let i=0;i<16;i++){p.px(i,0,hex('#aeaba3'));p.px(0,i,hex('#aeaba3'))}});
T('boardwalk',p=>{planksP(p,hex('#b9a27e'));for(let y=0;y<16;y++)p.px(0,y,hex('#7b6a50'))});
T('mural_sun',p=>{const c=['#ffcf4a','#ff9a3c','#ff6a5a','#e04a8a','#7a4ac9'].map(hex);for(let y=0;y<16;y++)for(let x=0;x<16;x++)p.px(x,y,c[Math.min(4,Math.floor(y/3.2))]);for(let y=4;y<11;y++)for(let x=4;x<12;x++)if(Math.hypot(x-7.5,y-9)<4.5&&y<10)p.px(x,y,hex('#fff2a0'));for(let x=0;x<16;x++){p.px(x,11,hex('#2a2a5a'));p.px(x,12+(x%3===0?1:0),hex('#2a2a5a'))}});
T('mural_wave',p=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)p.px(x,y,hex('#2f8fd8'));for(let y=0;y<16;y+=5)for(let x=0;x<16;x++){const yy=y+Math.round(Math.sin((x+y)/2.5)*1.5)+1;p.px(x,yy,hex('#e8fbff'));p.px(x,yy+1,hex('#7fd0f4'))}p.px(3,3,hex('#ffe066'));p.px(12,9,hex('#ff8ab0'))});
T('mural_palm',p=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)p.px(x,y,mix(hex('#ff7a59'),hex('#ffd36a'),y/15));for(let y=6;y<16;y++)p.px(8+Math.round((15-y)*.2),y,hex('#2a1838'));for(const[a,b]of[[-5,-1],[-4,1],[4,-1],[5,1],[-2,-3],[2,-3]])for(let t=0;t<5;t++)p.px(8+Math.round(a*t/4),5+Math.round(b*t/4)+(t>2?1:0),hex('#2a1838'))});
T('mural_pop',p=>{const c=['#ff4fa0','#3ad1c9','#ffd23f','#7a5af0'].map(hex);for(let y=0;y<16;y++)for(let x=0;x<16;x++)p.px(x,y,c[(Math.floor(x/8)+Math.floor(y/8)*2)%4]);for(let y=2;y<14;y+=4)for(let x=2;x<14;x+=4)p.px(x,y,hex('#ffffff'));for(let i=0;i<16;i++){p.px(i,i,hex('#1a1a2a'));p.px(15-i,i,hex('#1a1a2a'))}});
T('seaglass_sand',p=>{p.clump(SAND,.35);for(const[x,y,c]of[[3,4,'#5fe0c0'],[10,6,'#7ab8ff'],[6,11,'#9be08a'],[12,12,'#5fe0c0']]){p.px(x,y,hex(c));p.px(x+1,y,hex('#ffffff'))}});
T('awning',p=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)p.px(x,y,vary(Math.floor(x/4)%2?hex('#f4f0e6'):hex('#d8383a'),(p.r()-.5)*10));for(let x=0;x<16;x++)p.px(x,15,hex('#8a1c1c'))});
T('felt_red',p=>felt(p,hex('#cf3a3a')));
T('felt_white',p=>felt(p,hex('#ece8de')));
T('ferry_bell',p=>{planksP(p,hex('#8a6a42'));for(let y=3;y<13;y++)for(let x=4;x<12;x++)if(Math.abs(x-7.5)<1.5+(y-3)*.3)p.px(x,y,vary(hex('#e8b33a'),(p.r()-.5)*20));p.px(7,13,hex('#5a3a12'));p.px(8,13,hex('#5a3a12'))});
T('neon',p=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)p.px(x,y,hex('#2a1838'));for(let i=1;i<15;i++){p.px(i,2,hex('#ff6ad5'));p.px(i,13,hex('#ff6ad5'));p.px(2,i,hex('#6af0ff'));p.px(13,i,hex('#6af0ff'))}for(let i=5;i<11;i++)p.px(i,i-1,hex('#ffe066'))});
export function buildAtlas(){const c=document.createElement('canvas');c.width=c.height=AT;const g=c.getContext('2d');const img=g.createImageData(AT,AT);painters.forEach((fn,i)=>fn(P(img.data,(i%PER)*TS,Math.floor(i/PER)*TS,i+1)));g.putImageData(img,0,0);return c}
// Break-progress cracks (10 stages), drawn as their own little atlas.
export function buildCracks(){const c=document.createElement('canvas');c.width=160;c.height=16;const g=c.getContext('2d');const r=mulberry(99);const lines=[];for(let i=0;i<26;i++){let x=8,y=8,pts=[[x,y]];let a=r()*6.28;for(let k=0;k<6;k++){a+=(r()-.5)*1.6;x+=Math.cos(a)*1.6;y+=Math.sin(a)*1.6;pts.push([x,y])}lines.push(pts)}for(let s=0;s<10;s++){g.fillStyle='rgba(20,14,10,.75)';const n=Math.round((s+1)*2.6);for(let i=0;i<n;i++)for(const[x,y]of lines[i].slice(0,2+Math.min(5,s)))g.fillRect(s*16+Math.floor(x),Math.floor(y),1,1)}return c}
