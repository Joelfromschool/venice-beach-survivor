#!/usr/bin/env python3
"""space_chars.jpg (4x2 grey cells, thin black borders) -> puppet Pooh + Bean Guy sprites.
Called by slice_space.py; returns {key: RGBA PIL image}."""
import cv2,numpy as np
from PIL import Image,ImageFilter
def cut(img,cx,cy,C=4,R=2):
    H,W=img.shape[:2];cw,ch=W/C,H/R;x0,y0,x1,y1=int(cx*cw),int(cy*ch),int((cx+1)*cw),int((cy+1)*ch)
    c=img[y0:y1,x0:x1].copy()
    # trim black border lines
    g=cv2.cvtColor(c,cv2.COLOR_BGR2GRAY);rows=np.where(g.mean(1)>40)[0];cols=np.where(g.mean(0)>40)[0]
    c=c[rows[0]+3:rows[-1]-2,cols[0]+3:cols[-1]-2];return c
def key(c):
    h,w=c.shape[:2];lab=cv2.cvtColor(c,cv2.COLOR_BGR2LAB).astype(np.float32)
    corners=np.concatenate([lab[:8,:8].reshape(-1,3),lab[:8,-8:].reshape(-1,3),lab[-8:,:8].reshape(-1,3),lab[-8:,-8:].reshape(-1,3)])
    bg=np.median(corners,0)
    # grey is low-chroma: distance in a/b chroma + loose lightness (handles soft floor shadows)
    da=np.abs(lab[...,1]-bg[1])+np.abs(lab[...,2]-bg[2]);dl=np.abs(lab[...,0]-bg[0])
    cand=((da<14)&(dl<70)).astype(np.uint8)
    n,lbl=cv2.connectedComponents(cand);edge=set(np.unique(np.concatenate([lbl[0],lbl[-1],lbl[:,0],lbl[:,-1]])))-{0}
    bgm=np.isin(lbl,list(edge))
    fg=(~bgm).astype(np.uint8)*255
    fg=cv2.morphologyEx(fg,cv2.MORPH_OPEN,np.ones((3,3),np.uint8))
    n,lbl,st,_=cv2.connectedComponentsWithStats(fg);
    if n>1:k=1+np.argmax(st[1:,cv2.CC_STAT_AREA]);fg=np.where(lbl==k,255,0).astype(np.uint8)
    fg=cv2.erode(fg,np.ones((3,3),np.uint8),1)   # eat the grey halo ring
    a=cv2.GaussianBlur(fg,(5,5),0)
    rgb=cv2.cvtColor(c,cv2.COLOR_BGR2RGB)
    im=Image.fromarray(np.dstack([rgb,a]),'RGBA');return im.crop(im.getbbox())
def shirt(body,H,cx,half):
    red=np.array([200,32,42],np.float32);b=body.astype(np.float32);al=body[...,3]>40
    lum=(b[...,0]*.3+b[...,1]*.59+b[...,2]*.11);ref=np.percentile(lum[al],70);L=np.clip(lum/ref,0,1.3)
    hh,ww=al.shape;yy,xx=np.mgrid[0:hh,0:ww]
    y0,y1=int(H*.47),int(H*.67)
    hem=y1+ (np.abs(xx-cx)/max(half,1))**2*H*-.02
    torso=al&(yy>=y0)&(yy<hem)&(np.abs(xx-cx)<=half*1.02)
    sl=al&(yy>=y0-int(H*.01))&(yy<y0+int(H*.08))&(np.abs(xx-cx)>half*1.02)&(np.abs(xx-cx)<half*1.6)
    m=torso|sl
    for c in range(3):b[...,c]=np.where(m,np.clip(red[c]*L*1.05,0,255),b[...,c])
    # darker hem/sleeve trim line
    edge=m&~np.roll(m,-2,0)
    for c in range(3):b[...,c]=np.where(edge,b[...,c]*.7,b[...,c])
    return b.astype(np.uint8)
def puppet(im):
    a=np.array(im);H,W=a.shape[:2];cut_y=int(H*.78);body=a[:cut_y].copy();al=body[...,3]>128
    top=int(cut_y-H*.12)
    bel=body[int(H*.45):int(H*.65),:,:3][al[int(H*.45):int(H*.65)]];col=np.mean(bel,0)
    # torso width (ignore arms): use row at 62% height, take the widest centre run
    r=np.where(al[int(H*.62)])[0];cx=W/2
    if len(r):
        runs=np.split(r,np.where(np.diff(r)>2)[0]+1);run=max(runs,key=len);x0,x1=run[0],run[-1];cx=(x0+x1)/2;half=(x1-x0)/2*.95
    else:half=W*.3
    sh=int(H*.2);out=np.zeros((cut_y+sh,W,4),np.uint8)
    rng=np.random.default_rng(3);xs=np.arange(W);phase=rng.uniform(0,6,3)
    for y in range(top,cut_y+sh):
        t=max(0,(y-cut_y))/sh;hw=half*(1-.28*t)
        m=np.abs(xs-cx)<hw
        if y>=cut_y:
            rag=cut_y+sh*(.72+.1*np.sin(xs*.06+phase[0])+.07*np.sin(xs*.15+phase[1])+.04*np.sin(xs*.31+phase[2]))
            m&=y<rag
        d=np.abs(xs-cx)/max(hw,1);shade=1.02-.22*t-.35*d**2
        for ch in range(3):out[y,m,ch]=np.clip(col[ch]*shade[m]+rng.normal(0,3.5,m.sum()),0,255)
        out[y,m,3]=255
    img=Image.fromarray(out,'RGBA');A=img.split()[3].filter(ImageFilter.GaussianBlur(1.6));img.putalpha(A)
    body=shirt(body,H,cx,half)
    b=Image.fromarray(body,'RGBA');img.alpha_composite(b,(0,0))
    return img.crop(img.getbbox())
def run(path):
    img=cv2.imread(path);o={}
    o['hero_back']=puppet(key(cut(img,0,0)))
    o['hero_alt']=puppet(key(cut(img,2,0)))
    o['bean_a']=key(cut(img,0,1));o['bean_b']=key(cut(img,1,1))
    return o
if __name__=='__main__':
    for k,v in run('space_chars.jpg').items():v.save('/tmp/ch_'+k+'.png');print(k,v.size)
