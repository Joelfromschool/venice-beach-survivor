import cv2,numpy as np
from PIL import Image
def poly(shape,pts,k):
    m=np.zeros(shape[:2],np.uint8);cv2.fillPoly(m,[(np.array(pts,float)*k).astype(np.int32)],255);return m
def grab(rgb,P,fg=None,bgm=None,it=6,sc=.5):
    sm=cv2.resize(rgb,None,fx=sc,fy=sc);h,w=sm.shape[:2];R=lambda m:cv2.resize(m,(w,h),interpolation=cv2.INTER_NEAREST)
    m=np.full((h,w),cv2.GC_BGD,np.uint8);m[R(P)>0]=cv2.GC_PR_FGD
    if fg is not None:m[(R(fg)>0)&(R(P)>0)]=cv2.GC_FGD
    if bgm is not None:m[R(bgm)>0]=cv2.GC_BGD
    b=np.zeros((1,65));f=np.zeros((1,65));cv2.grabCut(sm,m,None,b,f,it,cv2.GC_INIT_WITH_MASK)
    r=np.where((m==1)|(m==3),255,0).astype(np.uint8);return cv2.resize(r,(rgb.shape[1],rgb.shape[0]))
def fill_tex(rgb,m,col,seed=1,amp=10,inpaint=True):
    """rebuild region m with a base colour + soft velvet noise, blended in with TELEA"""
    rng=np.random.default_rng(seed);h,w=m.shape
    n=rng.normal(0,1,(h//6+1,w//6+1)).astype(np.float32);n=cv2.resize(n,(w,h),interpolation=cv2.INTER_CUBIC);n=cv2.GaussianBlur(n,(0,0),4)
    fine=cv2.GaussianBlur(rng.normal(0,1,(h,w)).astype(np.float32),(0,0),1.2)
    base=np.array(col,np.float32)[None,None,:]+(n*amp*1.6+fine*amp*.8)[:,:,None]
    out=rgb.copy();sel=m>0;out[sel]=np.clip(base[sel],0,255).astype(np.uint8)
    if inpaint:
        ring=cv2.dilate(m,np.ones((15,15),np.uint8))-cv2.erode(m,np.ones((15,15),np.uint8))
        tel=cv2.inpaint(out,ring,9,cv2.INPAINT_TELEA)
        f=cv2.GaussianBlur((ring>0).astype(np.float32),(0,0),4)[:,:,None]
        out=(out*(1-f)+tel*f).astype(np.uint8)
    return out
def fin(name,rgb,a,H=420,smooth=3,out='.'):
    a=(a>127).astype(np.uint8)*255
    n,lab,st,_=cv2.connectedComponentsWithStats(a);big=1+np.argmax(st[1:,4]);a=np.where(lab==big,255,0).astype(np.uint8)
    cs,_=cv2.findContours(a,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_NONE);a=np.zeros_like(a);cv2.drawContours(a,cs,-1,255,-1)  # fill holes
    s=smooth*a.shape[1]/1500;a=(cv2.GaussianBlur(a.astype(np.float32),(0,0),s*2)>127).astype(np.uint8)*255   # smooth jaggies
    # defringe: pull interior colours outwards over the edge band
    inner=cv2.erode(a,np.ones((9,9),np.uint8));band=(cv2.dilate(a,np.ones((9,9),np.uint8))>0)&(inner==0)
    rgb=cv2.inpaint(rgb,band.astype(np.uint8)*255,7,cv2.INPAINT_TELEA)
    ys,xs=np.where(a>0);pad=12;y0,y1,x0,x1=max(0,ys.min()-pad),ys.max()+pad,max(0,xs.min()-pad),xs.max()+pad
    rgb=rgb[y0:y1,x0:x1];a=a[y0:y1,x0:x1];sc=H/a.shape[0];sz=(int(a.shape[1]*sc),H)
    rgb=cv2.resize(rgb,sz,interpolation=cv2.INTER_AREA);a=cv2.resize(a,sz,interpolation=cv2.INTER_AREA)
    a=cv2.erode(a,np.ones((2,2),np.uint8));a=cv2.GaussianBlur(a,(0,0),.9)   # 1-2px feather, no halo
    im=Image.fromarray(np.dstack([rgb,a]));im.save(f'{out}/{name}.png')
    for bgc,t in [((255,0,255),'m'),((255,214,234),'p')]:
        bg=Image.new('RGBA',im.size,bgc+(255,));bg.alpha_composite(im);bg.convert('RGB').save(f'/tmp/cx_{name}_{t}.jpg')
    print(name,im.size)
def load(f):return np.array(Image.open(f).convert('RGB'))
def mask(f):return np.array(Image.open(f))
