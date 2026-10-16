from rembg import remove,new_session
from PIL import Image
A='/home/box/agent-data/agents/85072EAF-BE24-4666-9C96-99E4D7EF8772/attachments/'
im=Image.open(A+'3c93758ded238c5c46ffdae453952064768db47db3505fdc040bcfc6c9cd43c7.jpg').convert('RGB');im.thumbnail((1000,1000))
o=remove(im,session=new_session('u2net'),alpha_matting=True);o.save('pooh_raw.png');print('done')
