import cv2,numpy as np
from rembg import remove,new_session
from PIL import Image
exec(open('cut.py').read().split('# bean')[0])
import sys
def grab(rgb,a0,polyp,k,bgpolys=(),it=6):
    sc=.5;sm=cv2.resize(rgb,None,fx=sc,fy=sc);h,w=sm.shape[:2]
    P=cv2.resize(poly(rgb.shape,polyp,k),(w,h))
    A=cv2.resize(a0,(w,h))
    m=np.full((h,w),cv2.GC_BGD,np.uint8);m[P>0]=cv2.GC_PR_FGD
    m[(A>200)&(P>0)]=cv2.GC_FGD
    for bp in bgpolys:m[cv2.resize(poly(rgb.shape,bp,k),(w,h))>0]=cv2.GC_BGD
    bg=np.zeros((1,65));fg=np.zeros((1,65));cv2.grabCut(sm,m,None,bg,fg,it,cv2.GC_INIT_WITH_MASK)
    r=np.where((m==1)|(m==3),255,0).astype(np.uint8);return cv2.resize(r,(rgb.shape[1],rgb.shape[0]))
# kermit
im=Image.open('kermit.jpg').convert('RGB');rgb=np.array(im);k=1500/450
a0=np.array(remove(im,session=S))[:,:,3]
pod=poly(rgb.shape,[(206,236),(240,214),(268,240),(300,322),(318,382),(300,396),(262,370),(230,318),(210,276)],k)
tag=poly(rgb.shape,[(72,362),(138,362),(138,452),(72,452)],k)
fix=cv2.dilate(cv2.bitwise_or(pod,tag),np.ones((21,21),np.uint8))
rgb2=rgb.copy()
def patch(m,dx,dy):
    global rgb2
    M=np.float32([[1,0,-dx*k],[0,1,-dy*k]]);src=cv2.warpAffine(rgb,M,(rgb.shape[1],rgb.shape[0]),borderMode=cv2.BORDER_REFLECT)
    f=cv2.GaussianBlur(cv2.dilate(m,np.ones((25,25),np.uint8)).astype(np.float32)/255,(0,0),8)[:,:,None]
    rgb2=(rgb2*(1-f)+src*f).astype(np.uint8)
patch(pod,-15,130)
patch(tag,70,10)
noise=np.random.randint(-6,6,rgb.shape);rgb2=np.where(fix[:,:,None]>0,np.clip(rgb2.astype(int)+noise,0,255),rgb2).astype(np.uint8)
KP=[(55,165),(95,140),(160,138),(190,172),(196,225),(232,242),(300,292),(332,382),(342,420),(380,448),(450,448),(450,600),(0,600),(0,470),(18,440),(48,280)]
a=grab(rgb2,a0,KP,k,bgpolys=[[(300,230),(450,230),(450,405),(300,405)]])
hsv=cv2.cvtColor(rgb,cv2.COLOR_RGB2HSV);light=((hsv[:,:,2]>95)&(hsv[:,:,1]<70));light[:int(180*k),:]=0;light.astype(np.uint8)*255;light=light.astype(np.uint8)*255 if light.dtype==bool else light;light=cv2.morphologyEx(light,cv2.MORPH_OPEN,np.ones((9,9),np.uint8));a[light>0]=0
a[cv2.erode(pod,np.ones((40,40),np.uint8))>0]=255;cut=poly(rgb.shape,[(222,200),(330,200),(330,400),(302,400)],k);a[cut>0]=0;a=cv2.morphologyEx(a,cv2.MORPH_CLOSE,np.ones((31,31),np.uint8));a=cv2.morphologyEx(a,cv2.MORPH_OPEN,np.ones((25,25),np.uint8));a[poly(rgb.shape,KP,k)==0]=0
finish('kermit',rgb2,a)
if 'k' in sys.argv[1:]:raise SystemExit
# pooh
im=Image.open('pooh.jpg').convert('RGB');rgb=np.array(im);k=1500/295
a0=np.array(remove(im,session=S))[:,:,3]
PP=[(95,40),(165,28),(248,150),(266,200),(270,250),(263,330),(258,420),(225,470),(205,505),(10,505),(10,420),(22,378),(58,330),(62,250),(95,200)]
a=grab(rgb,a0,PP,k,bgpolys=[[(0,40),(55,40),(55,330),(0,330)],[(130,505),(295,480),(295,600),(130,600)]])
a[poly(rgb.shape,PP,k)==0]=0
finish('pooh',rgb,a)
