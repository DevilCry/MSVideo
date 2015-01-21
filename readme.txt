运行步骤：
1. python manage.py createsuperuser
依据本机环境，修改数据库配置settings.py
2. python manage.py migration
3. python manage.py runserver 

运行环境：
  操作系统：windows 7
  Python 2.7
  Django 1.7.2
  Mysql 6.2CE
  Mysql connectors是Mysql-python-1.2.4.win32-py2.7.exe

王佳欣的运行环境:
  操作系统：windows 7
  Python 2.7.2
  Django 1.7.2
  Mysql  Server version: 5.6.11 MySQL Community Server (GPL)
  Mysql connectors是Mysql-python-1.2.4.win32-py2.7.exe

王佳欣的运行环境2:
    操作系统：ubuntu 14.04
    Python  2.7.6
    Django  1.7.2
    Mysql   mysql  Ver 14.14 Distrib 5.5.40, for debian-linux-gnu (x86_64) using
readline 6.3
    Mysql connectors 是MySQL_python-1.2.4-py2.7-linux-x86_64.egg


手势识别：leap motion
python 图像处理： pymedia 无法使用，已过时；PIL 有问题，其分支pillow
可代替．ubuntu下无法正常显示图片，安装imagemagic 后可正常．
from PIL import Image
im=Image.open("cyl.jpeg")
im.load()
im.show()
python 视频处理： pyglet+avbin
python 科学计算： Scipy + Matplotlib
其它开源图像视频处理库： openvis3d + 

用于评价目标跟踪算法的视频资源:http://wordpress-jodoin.dmi.usherb.ca
目标跟踪会议：iccv

鼠标手势识别示例：
branch yzbx:
    JS/demo/trackpad.html  #可以判别鼠标手势方向
    JS/demo/demo.html	#可以判别鼠标手势形状并学习

参考资料:
https://github.com/n33/jquery.touch
http://depts.washington.edu/aimgroup/proj/dollar/


