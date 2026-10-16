import cv2,numpy as np
from PIL import Image,ImageFilter
p=Image.open('pooh_raw.png').convert('RGBA');a=np.array(p)
hsv=cv2.cvtColor(a[...,:3],cv2.COLOR_RGB2HSV)
# drop skin-coloured (pinkish) pixels on the right side (hand)
H,W=a.shape[:2];xx=np.arange(W)[None,:]
yy=np.arange(H)[:,None]
skin=((hsv[...,0]<17)|(hsv[...,0]>165))&(hsv[...,1]>45)&(hsv[...,2]>90)&(xx>W*.66)&(yy>H*.45)
m=skin.astype(np.uint8)*255;m=cv2.morphologyEx(m,cv2.MORPH_OPEN,np.ones((3,3),np.uint8));m=cv2.dilate(m,np.ones((9,9),np.uint8))
a[...,3][m>0]=0
n,l,st,_=cv2.connectedComponentsWithStats((a[...,3]>40).astype(np.uint8));k=1+np.argmax(st[1:,4]);a[...,3][l!=k]=0
al=a[...,3];al=cv2.erode(al,np.ones((3,3),np.uint8));al=cv2.GaussianBlur(al,(5,5),0);a[...,3]=al
# kill alpha halos: despill purple/white faint edges
p=Image.fromarray(a);p=p.crop(p.getbbox())
b=Image.open('bean.png').convert('RGBA');bw,bh=b.size;b=b.crop((0,0,bw,int(bh*.64)))
ba=np.array(b);hh=ba.shape[0];f=np.clip((hh-np.arange(hh))/(hh*.12),0,1)[:,None];ba[...,3]=(ba[...,3]*f).astype(np.uint8);b=Image.fromarray(ba)
PW,PH=p.size;s=PH*.55/b.size[1]*1.0/.64*.64;  # bean visible height ~55% of pooh
tb=int(PH*.55);b=b.resize((int(b.size[0]*tb/b.size[1]),tb),Image.LANCZOS).rotate(-12,expand=True,resample=Image.BICUBIC)
top=int(tb*.62);C=Image.new('RGBA',(PW+40,PH+top),(0,0,0,0))
bx=int(PW*.56);C.alpha_composite(b,(bx,0));C.alpha_composite(p,(0,top))
C=C.crop(C.getbbox())
ca=np.array(C);pts=np.array([[528,535],[611,535],[611,712],[462,712],[462,672],[452,640],[480,615],[512,580]],np.int32);mk=np.zeros(ca.shape[:2],np.uint8);cv2.fillPoly(mk,[pts],255);mk=cv2.GaussianBlur(mk,(7,7),0);ca[...,3]=(ca[...,3]*(1-mk/255.)).astype(np.uint8);C=Image.fromarray(ca);C=C.crop(C.getbbox());C.save('hero_photo.png');print(C.size)
bg=Image.new('RGBA',C.size,(40,30,90,255));bg.alpha_composite(C);bg.convert('RGB').save('cv.jpg')
s=bg.resize((C.size[0]//4,C.size[1]//4),Image.LANCZOS);s.save('cv_small.png')
