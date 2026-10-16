from lib import *
rgb=load('kermit.jpg');k=1500/450;a0=mask('m_kermit_isnet.png')
KP=[(55,165),(95,140),(160,138),(190,172),(194,212),(203,240),(225,258),(260,272),(290,296),(302,322),(306,360),(300,392),(332,395),(380,440),(450,448),(450,600),(0,600),(0,470),(18,440),(48,280)]
pod=poly(rgb.shape,[(204,236),(240,212),(270,240),(302,322),(320,384),(302,398),(262,372),(230,318),(208,276)],k)
tag=poly(rgb.shape,[(70,358),(142,358),(142,456),(70,456)],k)
P=poly(rgb.shape,KP,k)
# cloak colour sampled from nearby velvet
samp=poly(rgb.shape,[(150,300),(200,300),(200,360),(150,360)],k);col=np.median(rgb[samp>0],0);print('cloak',col)
fix=cv2.bitwise_and(cv2.bitwise_or(cv2.dilate(pod,np.ones((19,19),np.uint8)),cv2.dilate(tag,np.ones((15,15),np.uint8))),P)
# keep Kermit's green hand that grips the pod bottom
hand=poly(rgb.shape,[(286,372),(320,372),(330,400),(290,402)],k);fix[hand>0]=0
fix=cv2.bitwise_or(fix,cv2.bitwise_and(cv2.dilate(pod,np.ones((31,31),np.uint8)),P));fix[hand>0]=0
rgb2=rgb.copy()
for reg in [cv2.bitwise_and(cv2.dilate(pod,np.ones((31,31),np.uint8)),P),cv2.bitwise_and(cv2.dilate(tag,np.ones((15,15),np.uint8)),P)]:
  reg[hand>0]=0;ring=(cv2.dilate(reg,np.ones((41,41),np.uint8))>0)&(reg==0)&(P>0)
  px=rgb[ring];px=px[px.sum(1)<120];c=np.median(px,0) if len(px) else col
  t=fill_tex(rgb2,reg,c*.8,amp=1.3,inpaint=False)
  f=cv2.GaussianBlur(cv2.dilate(reg,np.ones((9,9),np.uint8)).astype(np.float32)/255,(0,0),9)[:,:,None]
  rgb2=(rgb2*(1-f)+t*f).astype(np.uint8);print('reg col',c)
# velvet folds: soft diagonal highlight streaks so the rebuilt cloak isn't flat
yy,xx=np.mgrid[0:rgb.shape[0],0:rgb.shape[1]];fold=(np.sin((xx*0.8+yy*0.5)/38.0)*0.5+0.5)**3*5
rgb2=np.where(fix[:,:,None]>0,np.clip(rgb2+fold[:,:,None],0,255),rgb2).astype(np.uint8)
bgm=poly(rgb.shape,[(300,230),(450,230),(450,400),(340,400),(320,330)],k)
a=grab(rgb2,P,fg=(a0>220).astype(np.uint8)*255,bgm=bgm)
hsv=cv2.cvtColor(rgb,cv2.COLOR_RGB2HSV);light=((hsv[:,:,2]>70)&(hsv[:,:,1]<70)).astype(np.uint8)*255;light[:int(180*k)]=0;light=cv2.morphologyEx(light,cv2.MORPH_OPEN,np.ones((11,11),np.uint8));a[(light>0)&(fix==0)]=0
a[fix>0]=255;a[P==0]=0
fin('c_kermit',rgb2,a,H=440,smooth=5)
