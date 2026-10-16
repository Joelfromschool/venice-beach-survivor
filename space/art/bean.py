import cv2,numpy as np
A='/home/box/agent-data/agents/85072EAF-BE24-4666-9C96-99E4D7EF8772/attachments/'
im=cv2.imread(A+'fcc9e268fe65bbc9b7bcfa4894641530f5039c80584ddc0192b839133da7e3dd.jpg');im=cv2.resize(im,(750,1000))
h=cv2.cvtColor(im,cv2.COLOR_BGR2HSV)
g=((h[...,0]>28)&(h[...,0]<55)&(h[...,1]>110)&(h[...,2]>60)).astype(np.uint8)*255
n,l,st,_=cv2.connectedComponentsWithStats(g);k=1+np.argmax(st[1:,4]);m=(l==k).astype(np.uint8)*255
m=cv2.morphologyEx(m,cv2.MORPH_CLOSE,np.ones((15,15),np.uint8))
# fill holes (eyes, mouth, thumb gap)
ff=m.copy();cv2.floodFill(ff,None,(0,0),255);m=m|cv2.bitwise_not(ff)
# thumb region: inside mask but not green -> inpaint
hole=((m>0)&(g==0)).astype(np.uint8)
# keep facial features (dark, low value) untouched: only inpaint skin-colored pixels
skin=((h[...,0]<25)|(h[...,0]>160))&(h[...,1]>40)&(h[...,2]>110)
hole=(hole&skin).astype(np.uint8)*255;hole=cv2.dilate(hole,np.ones((7,7),np.uint8))
out=cv2.inpaint(im,hole,9,cv2.INPAINT_TELEA)
# thumb sticking out past outline: the hull smooths it; use convex-ish shape: open to remove thin parts
a=cv2.GaussianBlur(cv2.erode(m,np.ones((3,3),np.uint8)),(5,5),0)
x,y,w,hh=cv2.boundingRect(m);rgba=np.dstack([out,a])[y:y+hh,x:x+w]
cv2.imwrite('bean.png',rgba);print(w,hh,hole.sum()//255)
