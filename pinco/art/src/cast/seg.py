import numpy as np,sys
from rembg import remove,new_session
from PIL import Image
names=sys.argv[1:]
for m in ['isnet-general-use','u2net']:
  S=new_session(m)
  for n in names:
    im=Image.open(n+'.jpg').convert('RGB');a=np.array(remove(im,session=S,only_mask=True))
    Image.fromarray(a).save(f'm_{n}_{m[:5]}.png')
