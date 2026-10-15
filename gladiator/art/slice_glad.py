#!/usr/bin/env python3
"""Slice ATTICUS VORN art sheets -> glad_art.js (window.GART). Run from gladiator/art/.
Sheets are cut into equal cells (any resolution). Missing sheets/cells fall back to code art."""
import base64,io,os,json
import numpy as np
from PIL import Image
from scipy import ndimage
SHEETS=[
 ('glad_party.jpg',4,3,[f'p_{c}_{p}' for p in['idle','atk','hurt'] for c in['atticus','brutus','sabina','nyx']]),
 ('glad_foes.jpg',4,3,['e_thug','e_gruff','e_wolf','e_lion','e_vara','e_hoplite','e_archer','e_ferox','e_retiarius','e_legion','e_cassius','e_malvex']),
 ('glad_town.jpg',8,4,['t_cobble','t_grass','t_sand','t_dirt','t_water','t_wall','t_roof','t_column','t_door','t_fountain','t_tree','t_olive','t_stall','t_statue','t_crates','t_arena',
   't_gate','t_steps','t_fence','t_brazier','n_lanista','n_doctore','n_merchant','n_woman','i_sword','i_armor','i_shield','i_bread','i_oil','i_wine','i_laurel','i_ambro']),
 ('glad_backs.jpg',2,2,['bg_title','bg_arena','bg_final','bg_ludus']),
 ('glad_story.jpg',3,2,['st_intro1','st_intro2','st_intro3','st_end1','st_end2','st_end3'])]
FULL={'t_cobble','t_grass','t_sand','t_dirt','t_water','t_wall','t_roof','t_door','t_arena','t_gate','t_steps','t_fountain'}
def key(cell,bg):
    a=np.asarray(cell).astype(np.float32);d=np.sqrt(((a-bg)**2).sum(2))
    lab,n=ndimage.label(d<95);edge=set(np.unique(np.concatenate([lab[0],lab[-1],lab[:,0],lab[:,-1]])))-{0};bgm=np.isin(lab,list(edge))
    soft=ndimage.binary_dilation(bgm,iterations=2)&~bgm;alpha=np.where(bgm,0,255).astype(np.float32);alpha[soft]=np.clip((d[soft]-60)/80,0,1)*255
    sp=ndimage.binary_dilation(bgm,iterations=4)&~bgm;out=a.copy();gch=out[...,1]
    for c in(0,2):out[...,c]=np.where(sp,np.minimum(out[...,c],gch+60+(out[...,c]-gch)*.4),out[...,c])
    fl,fn=ndimage.label(alpha>0)
    if fn>1:
        sz=ndimage.sum(np.ones_like(alpha),fl,range(1,fn+1));big=sz.max()
        for k,v in enumerate(sz,1):
            if v<big*.06:alpha[fl==k]=0
    return Image.fromarray(np.dstack([np.clip(out,0,255),alpha]).astype(np.uint8),'RGBA')
def enc(im,q=86,fmt='WEBP'):
    b=io.BytesIO();im.save(b,fmt,quality=q);return'data:image/'+fmt.lower()+';base64,'+base64.b64encode(b.getvalue()).decode()
out={}
for fn,C,Rw,names in SHEETS:
    if not os.path.exists(fn):print('skip (missing)',fn);continue
    S=Image.open(fn).convert('RGB');W,H=S.size;cw,ch=W/C,H/Rw;A=np.asarray(S);bg=np.median(np.stack([A[2,2],A[2,-3],A[-3,2],A[-3,-3]]),0)
    for i,n in enumerate(names):
        cx,cy=i%C,i//C;box=(int(cx*cw),int(cy*ch),int((cx+1)*cw),int((cy+1)*ch))
        if n.startswith(('bg_','st_')):
            im=S.crop((box[0]+2,box[1]+2,box[2]-2,box[3]-2));im.thumbnail((1280,720));out[n]=enc(im,80);print('ok',n,im.size);continue
        cell=S.crop((box[0]+3,box[1]+3,box[2]-3,box[3]-3))
        if n in FULL:
            s=min(cell.size);m=int(s*.08);c=cell.crop(((cell.width-s)//2+m,(cell.height-s)//2+m,(cell.width+s)//2-m,(cell.height+s)//2-m)).resize((48,48),Image.LANCZOS);out[n]=enc(c,90);print('ok',n,'tile');continue
        im=key(cell,bg);bb=im.getbbox()
        if not bb:print('empty',n);continue
        im=im.crop(bb);mx=96 if n.startswith(('t_','i_')) else 360;s=min(1,mx/max(im.size))
        if s<1:im=im.resize((max(1,int(im.width*s)),max(1,int(im.height*s))),Image.LANCZOS)
        if n.startswith('i_'):
            q=max(im.size);sq=Image.new('RGBA',(q,q));sq.paste(im,((q-im.width)//2,(q-im.height)//2));im=sq
        out[n]=enc(im);print('ok',n,im.size)
open('glad_art.js','w').write('window.GART='+json.dumps(out)+';\n');print('wrote',len(out),'sprites')
