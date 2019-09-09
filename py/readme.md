#在新的电脑上运行时，要把env文件夹的内容删掉，然后重新建立virtualenv
pip install virtualenv
cd py
virtualenv --no-site-packages --python=2.7 env
cd env/Scripts
. .\activate
cd ..\..
pip install -r package
#exit
deactivate

#d打包exe
npm run build-python

#react打包
现在package.json里面增加配置字段
"homepage":"."
然后运行
npm run build进行打包

#注意
如果提示再build文件夹下找不到electron.js，把main.js复制到build文件夹下并重命名位electron.js
还要复制一份放到/public下面
同时要修改electron.js中加载index.html的搜索路径，原来是在./build/index.html的，但是electron也放在build文件夹之后就变成了./index.html
要把pydist文件夹靠近build文件夹中
在package.json中增加
"build":{
    "asar":false
  },
  否则源码打包成asar压缩包
  这样启动python子进程会有问题

#electron打包
yarn add electron-builder --dev
#这一步d第一次运行需要翻墙
./node_modules/.bin/electron-builder
