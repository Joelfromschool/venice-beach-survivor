// Small shared helpers: seeded random, gradient noise, math.
export const clamp=(v,a,b)=>v<a?a:v>b?b:v;
export const lerp=(a,b,t)=>a+(b-a)*t;
export const smooth=t=>t*t*(3-2*t);
export function mulberry(seed){let a=seed>>>0;return()=>{a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
export function hash2(x,z,s=0){let h=(x*374761393+z*668265263+s*982451653)|0;h=Math.imul(h^h>>>13,1274126177);return((h^h>>>16)>>>0)/4294967296}
export function hash3(x,y,z,s=0){let h=(x*374761393+y*1103515245+z*668265263+s*982451653)|0;h=Math.imul(h^h>>>13,1274126177);return((h^h>>>16)>>>0)/4294967296}
// Classic improved Perlin noise with a seeded permutation.
export function makeNoise(seed){const r=mulberry(seed),p=new Uint8Array(512),perm=[...Array(256).keys()];for(let i=255;i>0;i--){const j=Math.floor(r()*(i+1));[perm[i],perm[j]]=[perm[j],perm[i]]}for(let i=0;i<512;i++)p[i]=perm[i&255];
 const fade=t=>t*t*t*(t*(t*6-15)+10);
 const g3=(h,x,y,z)=>{h&=15;const u=h<8?x:y,v=h<4?y:h===12||h===14?x:z;return((h&1)?-u:u)+((h&2)?-v:v)};
 function n3(x,y,z){let X=Math.floor(x),Y=Math.floor(y),Z=Math.floor(z);x-=X;y-=Y;z-=Z;X&=255;Y&=255;Z&=255;const u=fade(x),v=fade(y),w=fade(z);const A=p[X]+Y,AA=p[A]+Z,AB=p[A+1]+Z,B=p[X+1]+Y,BA=p[B]+Z,BB=p[B+1]+Z;
  return lerp(lerp(lerp(g3(p[AA],x,y,z),g3(p[BA],x-1,y,z),u),lerp(g3(p[AB],x,y-1,z),g3(p[BB],x-1,y-1,z),u),v),lerp(lerp(g3(p[AA+1],x,y,z-1),g3(p[BA+1],x-1,y,z-1),u),lerp(g3(p[AB+1],x,y-1,z-1),g3(p[BB+1],x-1,y-1,z-1),u),v),w)}
 const n2=(x,z)=>n3(x,0.5,z);
 const fbm2=(x,z,o=4)=>{let a=1,f=1,s=0,n=0;for(let i=0;i<o;i++){s+=a*n2(x*f,z*f);n+=a;a*=.5;f*=2}return s/n};
 return{n2,n3,fbm2}}
export const dist2=(ax,az,bx,bz)=>Math.hypot(ax-bx,az-bz);
export function angleWrap(a){while(a>Math.PI)a-=Math.PI*2;while(a<-Math.PI)a+=Math.PI*2;return a}
