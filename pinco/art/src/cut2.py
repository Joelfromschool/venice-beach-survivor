import cv2,numpy as np
from rembg import remove,new_session
from PIL import Image
im=Image.open('art/src.jpg').convert('RGB');W,H=im.size;S=W/593
a=np.array(remove(im,session=new_session('isnet-general-use')))[:,:,3]
rgb=np.array(im);hsv=cv2.cvtColor(rgb,cv2.COLOR_RGB2HSV);h,s,v=[hsv[:,:,i].astype(int) for i in range(3)]
a=a.copy();a[0:int(80*S),int(440*S):]=0
a[(h>25)&(h<85)&(s>60)]=0
a[int(690*S):,:int(188*S)]=0          # holder's forearm/hand lower-left
a[:, int(560*S):][ :int(500*S)]=a[:, int(560*S):][:int(500*S)]  # keep
a[int(600*S):,int(470*S):]=0
a[int(705*S):,:]=0   # drop photo legs (code-drawn instead)           # green plush/background lower right
m=(a>110).astype(np.uint8)*255
n,lab,st,_=cv2.connectedComponentsWithStats(m);big=1+np.argmax(st[1:,4]);m=np.where(lab==big,255,0).astype(np.uint8)
m=cv2.morphologyEx(m,cv2.MORPH_CLOSE,np.ones((9,9),np.uint8))
# fade the cropped bottom of legs
fade=np.ones(H);
alpha=(cv2.GaussianBlur(m,(5,5),0)*fade[:,None]).astype(np.uint8)
ys,xs=np.where(alpha>20);x0,x1,y0,y1=xs.min(),xs.max(),ys.min(),ys.max()
out=np.dstack([rgb,alpha])[y0:y1+1,x0:x1+1]
sc=560/out.shape[0];img=Image.fromarray(out).resize((int(out.shape[1]*sc),560),Image.LANCZOS)
img.save('art/pinco.png')
# base
o=np.array(img).astype(float);Hh,Wh=o.shape[:2];yy=np.arange(Hh)[:,None];xx=np.arange(Wh)[None,:]
hh=cv2.cvtColor(o[:,:,:3].astype(np.uint8),cv2.COLOR_RGB2HSV)
pinkish=(hh[:,:,1]>70)&((hh[:,:,0]<12)|(hh[:,:,0]>160))
col=(xx>Wh*.15)&(xx<Wh*.66)
knit=(o[:,:,3]>0)&(yy>Hh*.255)&col&~((yy<Hh*.30)&pinkish)
np.save('/tmp/k.npy',knit)
knit=cv2.GaussianBlur(knit.astype(np.float32),(9,9),0)
L=o[:,:,:3].mean(2,keepdims=True);Ln=L/np.median(L[o[:,:,3]>0])
pink=np.array([238,166,188])*np.clip(0.5+0.5*Ln,0,1.3)
b=o.copy();b[:,:,:3]=o[:,:,:3]*(1-knit[:,:,None])+np.clip(pink,0,255)*knit[:,:,None]
Image.fromarray(b.astype(np.uint8)).save('art/pinco_base.png')
for n in ['pinco','pinco_base']:
  i=Image.open('art/'+n+'.png');bg=Image.new('RGBA',i.size,(120,200,230,255));bg.alpha_composite(i);bg.convert('RGB').save('/tmp/'+n+'.jpg')
print(img.size)
