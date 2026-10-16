# art/pinco_cut.png -> art/pinco.png : smooth pink boost on plush fur; eyes + muzzle protected
import cv2,numpy as np
from PIL import Image
im=np.array(Image.open('art/pinco_cut.png'));rgb=im[:,:,:3];a=im[:,:,3]
hsv=cv2.cvtColor(rgb,cv2.COLOR_RGB2HSV).astype(float);h,s,v=hsv[:,:,0],hsv[:,:,1],hsv[:,:,2]
hh=np.where(h<90,h+180,h);sb=cv2.GaussianBlur(s,(0,0),6)
hb=cv2.GaussianBlur(((hh>150)&(hh<195)).astype(float),(0,0),6)
w=np.clip((sb-18)/18,0,1)*np.clip((hb-.4)/.4,0,1)
yel=((h>18)&(h<40)&(s>80)).astype(float);w*=1-cv2.GaussianBlur(yel,(0,0),3).clip(0,1)
mz=np.zeros(w.shape,np.float32);cv2.ellipse(mz,(222,105),(78,68),0,0,360,1,-1);mz[:48,:]=0;mz=cv2.GaussianBlur(mz,(0,0),6)
w*=1-mz;w=cv2.GaussianBlur(w,(0,0),2)
hn=np.mod(hh*(1-.6*w)+172*.6*w,180);sn=np.clip(s+40*w,0,255);vn=np.clip(v+12*w,0,255)
out=cv2.cvtColor(np.dstack([hn,sn,vn]).astype(np.uint8),cv2.COLOR_HSV2RGB)
Image.fromarray(np.dstack([out,a])).save('art/pinco.png')
