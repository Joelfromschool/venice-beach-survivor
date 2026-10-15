#!/usr/bin/env python3
"""Slice the Space Maze art sheets -> art/space_art.js (window.SART).
Usage (from space/art/):  python3 slice_space.py
Expects space_sheet1.jpg (4 cols x 3 rows) and space_sheet2.jpg (3 cols x 2 rows), magenta #FF00FF bg.
Missing sheet = those sprites fall back to the built-in code art."""
import base64,io,os,sys
from PIL import Image,ImageFilter
SHEETS=[('space_sheet1.jpg',4,3,['hero_back','hero_left','hero_right','hero_bump','boss_cloud','boss_blob','boss_robot','boss_dragon','boss_moon','alien','jelly','comet']),
        ('space_sheet2.jpg',3,2,['star','satellite','whale','planet','asteroid','fluff'])]
MAXS={'hero_back':720,'hero_left':720,'hero_right':720,'hero_bump':720,'whale':512}
def key(im):
    im=im.convert('RGBA');px=im.load();w,h=im.size
    for y in range(h):
        for x in range(w):
            r,g,b,a=px[x,y];m=min(r,b)-g  # magenta-ness
            if m>70 and r>120 and b>120: px[x,y]=(0,0,0,0)
            elif m>25: # soft edge + despill
                a=int(255*max(0,min(1,(70-m)/45)));px[x,y]=(r if r<g+40 else (g+r)//2,g,b if b<g+40 else (g+b)//2,a)
    a=im.split()[3].filter(ImageFilter.MinFilter(3));im.putalpha(a);return im
out={}
for fn,C,Rw,names in SHEETS:
    if not os.path.exists(fn):print('skip (missing)',fn);continue
    S=Image.open(fn).convert('RGB');W,H=S.size;cw,ch=W/C,H/Rw
    for i,n in enumerate(names):
        cx,cy=i%C,i//C;inset=4
        cell=S.crop((int(cx*cw)+inset,int(cy*ch)+inset,int((cx+1)*cw)-inset,int((cy+1)*ch)-inset))
        im=key(cell);bb=im.getbbox()
        if not bb:print('empty cell',n);continue
        im=im.crop(bb);mx=MAXS.get(n,384);s=min(1,mx/max(im.size));im=im.resize((max(1,int(im.width*s)),max(1,int(im.height*s))),Image.LANCZOS)
        if n.startswith('hero') or n in('alien','jelly','comet','satellite','fluff','star','asteroid','planet') or n.startswith('boss'):
            # square canvas for billboards, hero keeps aspect
            if not n.startswith('hero'):
                q=max(im.size);sq=Image.new('RGBA',(q,q));sq.paste(im,((q-im.width)//2,(q-im.height)//2));im=sq
        b=io.BytesIO();im.save(b,'WEBP',quality=88);out[n]='data:image/webp;base64,'+base64.b64encode(b.getvalue()).decode()
        im.save('prev_'+n+'.png');print('ok',n,im.size)
open('space_art.js','w').write('window.SART='+__import__('json').dumps(out)+';\n')
print('wrote space_art.js with',len(out),'sprites')
