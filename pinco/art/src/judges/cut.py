import cv2,numpy as np
from rembg import remove,new_session
from PIL import Image
S=new_session('isnet-general-use')
def poly(shape,pts,k):
    m=np.zeros(shape[:2],np.uint8);cv2.fillPoly(m,[(np.array(pts)*k).astype(np.int32)],255);return m
def finish(name,rgb,a,H=520):
    a=(a>120).astype(np.uint8)*255
    n,lab,st,_=cv2.connectedComponentsWithStats(a);big=1+np.argmax(st[1:,4]);a=np.where(lab==big,255,0).astype(np.uint8)
    a=cv2.morphologyEx(a,cv2.MORPH_OPEN,np.ones((7,7),np.uint8));a=cv2.morphologyEx(a,cv2.MORPH_CLOSE,np.ones((11,11),np.uint8))
    a=cv2.GaussianBlur(a,(5,5),0)
    ys,xs=np.where(a>20);o=np.dstack([rgb,a])[ys.min():ys.max()+1,xs.min():xs.max()+1]
    im=Image.fromarray(o);sc=H/im.height;im=im.resize((int(im.width*sc),H),Image.LANCZOS);im.save('j_'+name+'.png')
    bg=Image.new('RGBA',im.size,(255,214,234,255));bg.alpha_composite(im);bg.convert('RGB').save('/tmp/jc_'+name+'.jpg');print(name,im.size)
# bean (preview scale 3.333)
im=Image.open('bean.jpg').convert('RGB');rgb=np.array(im);k=1500/450
a=np.array(remove(im,session=S))[:,:,3].copy()
a[int(468*k):,:]=0; a[int(388*k):,int(298*k):]=0
a[poly(rgb.shape,[(0,0),(140,0),(140,600),(0,600)],k)>0]=0
finish('bean',rgb,a)
# kermit
im=Image.open('kermit.jpg').convert('RGB');rgb=np.array(im);k=1500/450
a=np.array(remove(im,session=S))[:,:,3].copy()
a[:int(405*k),int(300*k):]=0                       # can
pod=poly(rgb.shape,[(206,236),(240,214),(268,240),(300,322),(318,382),(300,396),(262,370),(230,318),(210,276)],k)
tag=poly(rgb.shape,[(70,360),(140,360),(140,455),(70,455)],k)
fix=cv2.dilate(cv2.bitwise_or(pod,tag),np.ones((15,15),np.uint8))
rgb=cv2.inpaint(rgb,fix,25,cv2.INPAINT_TELEA)
a[pod>0]=np.maximum(a[pod>0],255)
finish('kermit',rgb,a)
# pooh (scale 5.085)
im=Image.open('pooh.jpg').convert('RGB');rgb=np.array(im);k=1500/295
a=np.array(remove(im,session=S))[:,:,3].copy()
a[:int(345*k),:int(58*k)]=0; a[:,int(266*k):]=0; a[int(505*k):,:]=0
a[poly(rgb.shape,[(0,330),(40,330),(20,390),(0,400)],k)>0]=0
finish('pooh',rgb,a)
