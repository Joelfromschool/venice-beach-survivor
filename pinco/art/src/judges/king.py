exec(open('cut.py').read().split('# bean')[0])
im=Image.open('king.jpg').convert('RGB');rgb=np.array(im);k=1500/375
a=np.array(remove(im,session=S))[:,:,3].copy()
a[poly(rgb.shape,[(0,140),(110,160),(100,250),(60,260),(0,250)],k)>0]=0
hand=poly(rgb.shape,[(292,300),(335,282),(340,360),(300,362)],k);a[hand>0]=0
b=(a>120).astype(np.uint8)*255;cs,_=cv2.findContours(b,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE);c=max(cs,key=cv2.contourArea);a=np.zeros_like(b);cv2.drawContours(a,[c],-1,255,-1)
finish('king',rgb,a,H=440)
