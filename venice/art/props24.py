# Slices art/props24.jpg (6x4 grid on magenta, order = PXN in v9.js) into px_* art. Run before build8.py.
import numpy as np,io,base64,json,os,sys
from PIL import Image
K='ball cone trash crate cart cone_p cd souvenir rent hoa gel tarot nft note clap cred taco star boom shock gull_gold hotdog coin churro'.split()
f='art/props24.jpg'
if not os.path.exists(f):print('no props24.jpg; skipping');json.dump({},open('/tmp/art_px.json','w'));sys.exit()
a=np.asarray(Image.open(f).convert('RGB')).astype(np.float32);H,W=a.shape[:2]
bg=np.median(np.concatenate([a[:6].reshape(-1,3),a[-6:].reshape(-1,3)]),0);d=np.sqrt(((a-bg)**2).sum(-1))
al=np.clip((d-50)/60,0,1);R,G,B=a[...,0],a[...,1],a[...,2];sp=np.clip(np.minimum(R,B)-G-20,0,None)*(al<1);a[...,0]-=sp*.8;a[...,2]-=sp*.8
rgba=np.dstack([np.clip(a,0,255),al*255]).astype(np.uint8);out={}
for i,k in enumerate(K):
    c,r=i%6,i//6;t=rgba[int(r*H/4):int((r+1)*H/4),int(c*W/6):int((c+1)*W/6)];ys,xs=np.nonzero(t[...,3]>40)
    if not len(ys):continue
    t=t[ys.min():ys.max()+1,xs.min():xs.max()+1];im=Image.fromarray(t);s=min(96/im.width,96/im.height);im=im.resize((max(1,round(im.width*s)),max(1,round(im.height*s))),Image.LANCZOS)
    cv=Image.new('RGBA',(96,96));cv.paste(im,((96-im.width)//2,(96-im.height)//2),im)
    b=io.BytesIO();(im if k=='boom' else cv).save(b,'WEBP',quality=88);out['px_'+k]='data:image/webp;base64,'+base64.b64encode(b.getvalue()).decode()
json.dump(out,open('/tmp/art_px.json','w'));print('px keys',len(out))
