#!/usr/bin/env python3
"""Slice Space Maze sheets -> space_art.js (window.SART). Run from space/art/.
Sheets are sliced by equal cells (any size). Background colour is sampled from the corners; only bg connected to the cell border is removed."""
import base64,io,os,json
import numpy as np
from PIL import Image
from scipy import ndimage
SHEETS=[('space_sheet1.jpg',4,3,['hero_back',None,None,'hero_bump','boss_cloud','boss_blob','boss_robot','boss_dragon','boss_moon','alien','jelly','comet']),
        ('space_sheet2.jpg',3,2,['star','satellite','whale','planet','asteroid','fluff'])]
MAXS={'hero_back':720,'hero_bump':720,'whale':512}
def key(cell,bg):
    a=np.asarray(cell).astype(np.float32);d=np.sqrt(((a-bg)**2).sum(2))
    near=d<95;lab,n=ndimage.label(near);edge=set(np.unique(np.concatenate([lab[0],lab[-1],lab[:,0],lab[:,-1]])))-{0}
    bgm=np.isin(lab,list(edge))
    grow=ndimage.binary_dilation(bgm,iterations=2)
    alpha=np.where(bgm,0,255).astype(np.float32)
    soft=grow&~bgm;alpha[soft]=np.clip((d[soft]-60)/80,0,1)*255
    # despill: pull magenta out of edge pixels
    out=a.copy();sp=soft|ndimage.binary_dilation(bgm,iterations=4)&~bgm
    g=out[...,1];out[...,0]=np.where(sp,np.minimum(out[...,0],g+60+(out[...,0]-g)*.4),out[...,0]);out[...,2]=np.where(sp,np.minimum(out[...,2],g+60+(out[...,2]-g)*.4),out[...,2])
    fl,fn=ndimage.label(alpha>0)
    if fn>1:
        sz=ndimage.sum(np.ones_like(alpha),fl,range(1,fn+1));big=sz.max()
        for k,v in enumerate(sz,1):
            if v<big*.06:alpha[fl==k]=0
    rgba=np.dstack([np.clip(out,0,255),alpha]).astype(np.uint8);return Image.fromarray(rgba,'RGBA')
out={}
for fn,C,Rw,names in SHEETS:
    if not os.path.exists(fn):print('skip (missing)',fn);continue
    S=Image.open(fn).convert('RGB');W,H=S.size;cw,ch=W/C,H/Rw
    A=np.asarray(S);bg=np.median(np.stack([A[2,2],A[2,-3],A[-3,2],A[-3,-3]]),0)
    for i,n in enumerate(names):
        if not n:continue
        cx,cy=i%C,i//C;cell=S.crop((int(cx*cw)+2,int(cy*ch)+2,int((cx+1)*cw)-2,int((cy+1)*ch)-2))
        im=key(cell,bg);bb=im.getbbox()
        if not bb:print('empty',n);continue
        im=im.crop(bb);mx=MAXS.get(n,384);s=min(1,mx/max(im.size))
        if s<1:im=im.resize((int(im.width*s),int(im.height*s)),Image.LANCZOS)
        if not n.startswith('hero'):
            q=max(im.size);sq=Image.new('RGBA',(q,q));sq.paste(im,((q-im.width)//2,(q-im.height)//2));im=sq
        b=io.BytesIO();im.save(b,'WEBP',quality=88);out[n]='data:image/webp;base64,'+base64.b64encode(b.getvalue()).decode()
        im.save('/tmp/prev_'+n+'.png');print('ok',n,im.size)
open('space_art.js','w').write('window.SART='+json.dumps(out)+';\n');print('wrote',len(out))
