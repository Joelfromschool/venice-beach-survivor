from lib import *
import sys
k=1500/450
def keep_poly(a,pts):P=poly(a.shape,pts,k);a=a.copy();a[P==0]=0;return a
def cut_poly(a,pts):P=poly(a.shape,pts,k);a=a.copy();a[P>0]=0;return a
J=sys.argv[1:] or ['party','holiday','baller','mole','tad','leaf']
if 'party' in J:
  rgb=load('c6ff12d8.jpg');a=mask('m_c6ff12d8_isnet.png');fin('c_party',rgb,a,H=440)
if 'holiday' in J:
  rgb=load('e79f2ecf.jpg');a=mask('m_e79f2ecf_isnet.png')
  a=cut_poly(a,[(262,240),(345,240),(345,322),(302,318),(268,306)]);a=cut_poly(a,[(266,380),(450,380),(450,600),(266,600)])
  fin('c_holiday',rgb,a,H=440)
if 'baller' in J:
  rgb=load('9a74ac78.jpg');a=mask('m_9a74ac78_u2net.png')
  a=cut_poly(a,[(283,358),(300,358),(318,362),(345,372),(345,428),(286,428),(280,400)])
  a=cut_poly(a,[(322,296),(350,296),(350,430),(322,430)])
  box=poly(rgb.shape,[(278,290),(350,290),(350,430),(278,430)],k);hsv=cv2.cvtColor(rgb,cv2.COLOR_RGB2HSV);lt=((hsv[:,:,2]>120)&(hsv[:,:,1]<70)&(box>0)).astype(np.uint8);a[cv2.dilate(lt,np.ones((5,5),np.uint8))>0]=0
  card=poly(rgb.shape,[(260,276),(298,280),(300,314),(266,314)],k);card=cv2.dilate(card,np.ones((9,9),np.uint8))
  rgb=cv2.inpaint(rgb,card,15,cv2.INPAINT_TELEA);rgb=fill_tex(rgb,np.zeros_like(card),(0,0,0))
  fin('c_baller',rgb,a,H=440)
if 'mole' in J:
  rgb=load('d681d049.jpg');a0=mask('m_d681d049_isnet.png')
  P=poly(rgb.shape,[(92,150),(130,105),(215,92),(300,104),(345,150),(352,360),(442,418),(445,470),(380,492),(10,498),(5,430),(60,380),(84,350)],k)
  a=grab(rgb,P,fg=(a0>230).astype(np.uint8)*255);a[P==0]=0;a=cut_poly(a,[(350,320),(375,320),(375,345),(350,345)])
  fin('c_mole',rgb,a,H=440,smooth=4)
if 'tad' in J:
  rgb=load('70a4826d.jpg');a=mask('m_70a4826d_isnet.png');fin('c_tad',rgb,a,H=440)
if 'leaf' in J:
  rgb=load('fcb78985.jpg');a=mask('m_fcb78985_isnet.png');fin('c_leaf',rgb,a,H=440)
if 'old' in J:
  for n in ['bean','pooh','king']:
    im=np.array(Image.open('../art/j_'+n+'.png'));fin('c_'+n,im[:,:,:3].copy(),im[:,:,3],H=im.shape[0],smooth=1)
