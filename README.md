# N04-Fake-Info-Recognition-Tool-Base-on-KEY-ID
基于数字身份的社交平台虚假信息识别工具

## Demo预览

![](https://raw.githubusercontent.com/Wanxiang-Blockchain-Hackathon-2020/N04-Fake-Info-Recognition-Tool-Base-on-KEY-ID/master/gifdemo.gif)

## 部署redis

### 安装

下载、解压、编译Redis

```
$ wget http://download.redis.io/releases/redis-5.0.5.tar.gz
$ tar xzf redis-5.0.5.tar.gz
$ cd redis-5.0.5
$ make
```

进入到解压后的 src 目录，通过如下命令启动Redis:

```
$ src/redis-server
```

## 部署node server

 1:进入node项目根目录，在控制台，生成https证书，均放置在了根目录下（若使用http，则不需要此步骤）

// #生成私钥key文件：

```
npm run privatekey

// #通过私钥生成CSR证书签名：
npm run csr
// 此过程需要输入一些证书信息，请按照提示完成

// # 通过私钥和证书签名生成证书文件
npm run crt
```

2:进入node项目：打开./app.js，配置连接redis-server的参数

```
// 常量
const redisHost = "127.0.0.1"; // redis服务地址
const redisPort = 6379; // redis服务端口
const redisPassWord = ""; // 如果没有密码，则不填
```

3:打开控制台，安装依赖包：

```
npm install
```

4:打开控制台，启动服务：

```
npm run start
```

## 安装插件extension
1:打开项目，进入content-script.js，配置参数

```
const isUseHttps = true; // true使用https请求，false使用http请求
const host = "0.0.0.0"; // 本地ip
const getSignIntervalTime = 5000; // 轮询服务器是否收到mykey签名回调的间隔
```

2.打包插件

2.1:地址栏输入：chrome://extensions/     打开chrome扩展程序管理页面

2.2:选择“打包扩展程序”选项，选择项目根目录，然后在弹出框中显示打包后的.crx存放地址

2.3:将生成的.crx文件，拖入chrome扩展程序管理页面，即可完成本地安装

2.4:上架chrome扩展程序商店

## 本次Hackathon Slides 下载(内含视频Demo)
https://github.com/Wanxiang-Blockchain-Hackathon-2020/N04-Fake-Info-Recognition-Tool-Base-on-KEY-ID/blob/master/%E5%9F%BA%E4%BA%8E%E6%95%B0%E5%AD%97%E8%BA%AB%E4%BB%BD%E7%9A%84%E7%A4%BE%E4%BA%A4%E5%B9%B3%E5%8F%B0%E8%99%9A%E5%81%87%E4%BF%A1%E6%81%AF%E8%AF%86%E5%88%AB%E5%B7%A5%E5%85%B7%20.pptx

## 其他相关参考

https://github.com/mykeylab/KEYID-protocol KEY-ID协议合约开源代码

https://docs.mykey.org/integrate-with-mykey/scan#qian-ming MYKEY扫码签名文档

https://mykey.org/ MYKEY APP 下载

