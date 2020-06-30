# 项目阶段一： #

## 一、项目介绍 ##
项目使用
前端使用：vue
后端使用：koa
代码规范：ESLint
单元测试

## 二、文件上传： ##
1、	返回上传进度条 eggsource -> post请求 ->apolo success的回调函数来实时返回进度(semantic就自带了进度条的实现)；
具体实现代码
     var formData = new FormData(); 
    formData.append("file", document.getElementById('file').files[0]); 
    formData.append("token", token_value); // 其他参数按这样子加入
    
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/uploadurl');
    // 上传完成后的回调函数
    xhr.onload = function () {
      if (xhr.status === 200) {
    　　console.log('上传成功');
      } else {
      　console.log('上传出错');
      }
    };
    // 获取上传进度
    xhr.upload.onprogress = function (event) {
      if (event.lengthComputable) {
    var percent = Math.floor(event.loaded / event.total * 100) ;
    // 设置进度显示
    $("#J_upload_progress").progress('set progress', percent);
      }
    };
    xhr.send(formData);

2、	上传后显示上传成功；
3、	文件类型的校验——>获取文件后缀名/检测文件Buffer的二进制前几位

## 三、大文件，断点续传 ##
1、切片上传，上传到后端，后端再合并

## 四、大文件指纹计算(参考react源码和web-worker) ##
1、文件MD5指紋算法
2、web-worker計算MD5
3、參考react使用時間切片來計算MD5
4、在時間切片計算MD5的基礎上來使用抽樣數據

## 五、并发数控制+错误重试逻辑 ##
> 头条面试题





# 项目阶段二： #


## 一、项目搭建 ##
> 电脑要有npx

前端：
nuxt3.0.0（企业级框架）

后端：
egg2.15.1（企业级框架）
husky：commit前lint和test检查（npm install husky -S）


> ./vue-project-full/
*安装： npx create-nuxt-app front*
**这是我的：**
    create-nuxt-app v3.0.0
    ✨  Generating Nuxt.js project in front
    ? Project name front
    ? Choose programming language JavaScript
    ? Choose the package manager Npm
    ? Choose UI framework Element
    ? Choose Nuxt.js modules (Press <space> to select, <a> to toggle all, <i> to invert selection)
    ? Choose linting tools (Press <space> to select, <a> to toggle all, <i> to invert selection)
    ? Choose test framework Jest
    ? Choose rendering mode Universal (SSR / Static)
    ? Choose development tools (Press <space> to select, <a> to toggle all, <i> to invert selection)
**这是大盛老师的:**
    create-nuxt-app v2.9.2
    ✨  Generating Nuxt.js project in front
    ? Project name front
    ? Choose programming language JavaScript
    ? Choose the package manager Npm
    ? Choose UI framework Element
    ? Choose custom server framework koa
    ? Choose Nuxt.js modules axios
    ? Choose linting tools ESLint
    ? Choose test framework Jest
    ? Choose rendering mode Universal (SSR / Static)
    ? Choose development tools (Press <space> to select, <a> to toggle all, <i> to invert selection)


> ./vue-project-full/server/
*安装： npm init egg --type=simple*
**这是我的：（大盛老师也一样）**
    ? project name server
    ? project description
    ? project author
    ? cookie security keys 1592628503698_1843

**设置securitykeys：项目要管理/使用 session和cookie**


安装husky：（做hook）
期望：每次commit之前，跑lint+test



## 二、代码规范+husky设置 **（代码规范COMMITIZEN没有完成）**##


1. 增加ESlint规范：
后端：
.eslintrc
 
    "rules": {
      "semi": [
        "error",
        "never"
      ]
    }

在commit之前，让husky检测分号，有则报错


2. commit 发布信息规范：
> 安装： npm install commitizen@4.0.3
> commit规范化当前项目：commitizen init cz-conventional-changelog --save-dev --save-exact

我本地安装全局失败，所以安装到了生产：
npm install --save-dev commitizen

npx commitizen init cz-conventional-changelog --save-dev --save-exact

安装了commitizen之后，

git commit就可以改用 git cz 来规范commit message了

**我全局和生产安装都是无法使用commitizen**



## 三、sessin和jwt架构介绍 ##

功能：**登录**

前端：				  后端：          数据库mongodb
用户名Input框： 
密码Input框：   ->    server
按钮buttom：
验证码:validate


请求：

注册   /register
登录   /login
校验用户名   /checkuser或者/verify
验证码：{
  图形， （画svg验证码）
  手机短信验证码，
  邮箱
}

登录信息记录：
**session：**
校验成功：
 前端：           后端：
存cookie       存session
登录完成：
 前端：           后端：  
      setcookie
      <-----
检查登录信息：
 前端：           后端：  
查cookie

session/cookie缺点：
1.存在文件里面
2.占用文件存储
3.扩展服务器后不容易管理

所以一般另外设置一台 session server 服务器 使用redis

**jwt：**
json web token
登录：
 前端：                后端：
				   用户信息+过期时间
				  	  生成👇
				      token
             <-发送
存储token到：
localstorage

请求：
                   后端token放到头部：
                    token-> header
前端axios请求钩子获取：
token
解密

jwt优点：
1.更好解决跨域
2.前后端完全分离

前面完成了：
Oauth：
第三方登录，机制都是Oauth

再完成：
jest自动化测试



## 四、登录验证码功能 ##

1.**后端**

验证码生产工具：
svg-captcha@1.4.0
安装：
npm install --save svg-captcha

controller：

增加验证码图形（./app/controller/util.js）
UtilController captcha


2.**前端**

增加模块：
sass：
npm install sass sass-loader -D

@nuxtjs/proxy：
npm i @nuxtjs/proxy @nuxtjs/axios -D
nuxt.config.js 配置文件中添加对应的模块，并设置代理：
    modules: [（
      '@nuxtjs/axios',
      '@nuxtjs/proxy'
    ],
    axios: {
      proxy: true
    },
    proxy: {
      '/api': {
        target: 'http://localhost:7001',
        pathRewrite: {
          '^/api' : '/'
        }
      }
    }


增加文件：
login.vue（./layout）
login.vue（./page）


代理请求：（nuxt.config.js）
proxy：{。。。}

地址查看：
后端图片：
http://localhost:3000/api/captcha
前端登陆页面：
http://localhost:3000/login



## 五、图片验证码实现 ##

1.**后端**

修改接口：
设置验证码样式/接口返回头（server\app\controller\util.js）


2.**前端**

页面元素：
增加验证码请求（front\pages\login.vue）

增加事件：
验证码点击更换：updateCaptcha





# 项目阶段三： #


## 一、注册表单 ##

1.**后端**

无


2.**前端**

增加页面：
注册页面（front\pages\register.vue）

增加样式：
login.vue（front\layouts\login.vue）
（注意：此处要去掉login.vue页面内style上的scoped，否则无法改变el-form样式）

地址查看：
前端注册页面：
http://localhost:3000/register



## 二、注册功能实现-表单校验/注册请求 ##

1.**后端**

无


2.**前端**

增加模块：
md5加密：
npm install md5 -S


增加组件框架：
注册页面（front\pages\register.vue）

增加样式：
注册页面（front\pages\register.vue）

增加接口请求：
（front\pages\register.vue）
重置验证码resetCaptcha
注册请求handleRegister



## 三、axios配置 ##

1.**后端**

使用robo 3T 新建数据库：kkbhub

2.**前端**


axios：
1.在modules使用，是安装在vue之上；
2.在plugins使用，是用于生成axios实例，用于请求响应拦截；


@nuxtjs/axios已经在第二阶段：4.登录验证码功能安装过
（npm install @nuxtjs/axios -S）
nuxt.config.js：
plugins:[
	'@plugins/axios'
],
modules: [
    '@nuxtjs/axios'
]

新增文件：(front\plugins\)
axios.js



## 四、eggjs规范指定 ##

1.**后端**


增加模块：
egg-router-group 路由分组
egg-mongoose eggjs连接mongodb
egg-validate 校验接口传来的数据

npm install egg-router-group egg-mongoose egg-validate --save

md5加密（前端密码加密后，此处再进行加盐加密；两次加密再存储到数据库是比较合理的）
npm install md5 --save

jwt认证（该api就是字符的加密解密的功能）
npm install jsonwebtoken -S


增加文件：
定制数据规范（server\app\controller\base.js）

跟用户相关的接口(server\app\controller\user.js)


配置插件：（server\config\plugin.js）
egg-router-group 路由分组
egg-mongoose eggjs连接mongodb
egg-validate 校验接口传来的数据


配置路由地址：
使用router-group配置路由（server\app\router.js，插件：egg-router-group）


2.**前端**

无


## 五、注册实现-01 ##

1.**后端**

实现接口：
注册register方法（server\app\controller\user.js）

2.**前端**

无



## 六、数据入库+mongodb ##

1.**后端**

增加model模块（server\app\model,里面定义与数据库的交互）：
用户模块（server\app\model\user.js）

完善接口：
注册register方法（server\app\controller\user.js）

实现接口：
检查mongodb内是否有重复邮箱checkEmail（server\app\controller\user.js）


2.**前端**

新增功能：
axios作响应拦截，因为后端返回的是所有返回内容（front\plugins\axios.js）



## 七、登录认证 ##

1.**后端**

补全方法：
登录login ：（server\app\controller\user.js）
{
1.验证
2.md5加密
3.jwt加密token
4.返回2，3
}

修改方法：
注册register（server\app\controller\user.js）
{
判断减少一层if.else嵌套
}

增加jwt盐Slot：（server\config\config.default.js）
    jwt: {
      secret: ':kkbhub@good@123',
    }, 

2.**前端**

修改页面：
登录Login.vue，复制注册register.vue（front\pages\login.vue）
{
1.只保留验证码，邮箱，密码输入框
2.改动ref为loginForm
3.按钮方法改为handleLogin
3.1 方法内登录成功跳转到首页this.$router.push('/')
}




# 项目阶段四 #

## 一、发送邮件验证码 ##

注册126邮箱（什么邮箱都行，只是不想用常用邮箱）
账号：Aa15917160951@126.com
密码：Aa123456

进入邮箱->设置->开启POP3/SMTP服务获得授权码(是用于登录第三方邮件客户端的专用密码)

1.**后端**

安装模块：
nodemailer:发送邮件验证
(npm install nodemailer -S)

增加接口：
sendcode发送邮件（server\app\router.js）

修改类的引用：
BaseController(server\app\controller\util.js)

增加文件夹和文件：
（server\app\service\)
（server\app\service\tools.js）

增加方法：
sendcode发送邮件(server\app\controller\util.js)
sendMail使用插件nodemailer发送邮件（server\app\service\tools.js）
注意：{
（server\app\service\tools.js）
transporter.auth.pass是上方获得的授权密码
}

2.**前端**


增加数据：（front\pages\login.vue）
- data
1.send
2.rules.emailcode
- computed
1.sendText

增加方法：
sendEmailCode发送邮件（front\pages\login.vue）


增加元素：
按钮&输入框（front\pages\login.vue）

修改样式：
.el-button（front\layouts\login.vue）



## 二、登录邮箱验证码认证 ##

1.**后端**

无

2.**前端**

更改项目名称：（nuxt.config.js）
小光头社区

axios请求拦截：
前端访问接口和其他页面带上token（front\plugins\axios.js）

增加页面：
uc.vue（front\pages\uc.vue）

完成功能：
登录验证：邮箱验证，图形验证



## 三、axios管理token认证 ##

1.**后端**

增加文件夹&文件：
（server\app\middleware）
（server\app\middleware\jwt.js）

增加中间件方法：
判断用户是否已登录，并且token有效（server\app\middleware\jwt.js）

使用中间件方法：
info信息中心（server\app\router.js）

2.**前端**

axios响应拦截：
service.interceptors.response.use（front\plugins\axios.js）


完成功能：
token失效验证



## 四、图片上传0.1版本实现 ##

1.**后端**

安装模块：
fs-extra（文件管理）
(npm install fs-extra --save)

项目配置：
（server\config\config.default.js）
模式：
      config.multipart = {
        mode: 'file',
        whitelist: () => true,
      }
保存文件地址：
     config.UPLOAD_DIR = path.resolve(__dirname, '..', 'app/public')

增加接口：
文件上传uploadfile（server\app\router.js）

增加方法：
文件上传uploadfile（server\app\controller\util.js）

2.**前端**

增加元素：
按钮&输入框（front\pages\uc.vue）

增加方法：
文件上传uploadFile（front\pages\uc.vue）





# 项目阶段五 #


## 一、文件上传0.2版本，拖拽+进度条 ##

1.**后端**

无


2.**前端**

增加数据：
- data
uploadProgress进度条百分比

增加元素：
进度条el-progress（front\pages\uc.vue）

增加方法：
绑定拖拽文件三个事件bindEvent（front\pages\uc.vue）

增加方法参数：
文件上传uploadfile（front\pages\uc.vue）

增加样式：
拖拽区域#drag（front\pages\uc.vue）
      {
        onUploadProgress: progress => {
          this.uploadProgress = Number(
            ((progress.loaded / progress.total) * 100).toFixed(2)
          );
        }
      }



## 二、文件上传-二进制信息确认文件格式0.3 ##

判断文件类型看，文件十六进制码：
Gif：头6： 47 49 46 38 39 61 or 47 49 46 38 37 61（GIF89a  or  GIF87a）


1.**后端**

无


2.**前端**

增加方法：
是否是图片isImage（front\pages\uc.vue）
是否是Gif图isGif（front\pages\uc.vue）
文件转字符串bolbToString（front\pages\uc.vue）



## 三、文件上传-png和jpg文件类型限制 ##

判断文件类型看，文件十六进制码：
JPG：头2： FF D8   尾2： FF D9
PNG：头8： 89 50 4E 47 0D 0A 1A

### 思考题：现在图片宽高，gif的宽高是头6之后的4位/png的宽高是头8之后的4位 ###

1.**后端**

无


2.**前端**

增加方法：
是否是PNG图isPng（front\pages\uc.vue）
是否是JPG图isJpg（front\pages\uc.vue）

增加方法判断：
文件上传uploadFile（front\pages\uc.vue）
      if (!(await this.isImage(this.file))) {
        this.$message.error("文件格式错误，应为gif/jpg/png其中一种。");
        return;
      }



## 四、web-worker计算md5值 ##


### 注意：{
sparkMD5.ArrayBuffer是数组缓冲区用于缓存文件
FileReader是读取文件器
FileReader内的readAsArrayBuffer和readAsBinaryString分别是以数组和二进制的形式读取
} ###

1.**后端**

无


2.**前端**

安装模块：
增量级MD5（+ spark-md5@3.0.1）
npm install spark-md5 -S

复制文件（front\node_modules\spark-md5\spark-md5.min.js）
至./static/下

增加文件：
webWorker新进程hash.js（front\static\hash.js）
### 打开 [http://localhost:3000/hash.js](http://localhost:3000/hash.js) 检查是否可以访问该文件  ###
注意：{
此处因为npm和md5的webworker没有交集，所以要在项目另外引入来访问
}

增加元素：
计算Hash的进度aside（front\pages\uc.vue）

增加数据：
文件上传hash进度hashProgress（front\pages\uc.vue）

增加方法：
将上传文件切片createFileChunk（front\pages\uc.vue）
开启新进程并监听calculateHashWorker（front\pages\uc.vue）

增加方法新内容:
webworker新进程计算md5
根据createFileChunk和calculateHashWorker获取切片chunks和hash文件标识  uploadFile（front\pages\uc.vue）
注意：{
1.此处暂时将限制文件格式和请求/uploadfile接口代码注释
}


出现问题：进度条到100%才会移动

## 四、requestIdleCallback计算文件md5 ##


1.**后端**

无


2.**前端**

增加方法：
开启新进程并监听calculateHashIdle（front\pages\uc.vue）

增加方法新内容:
时间切片空余时间计算md5
根据createFileChunk和calculateHashIdle获取切片chunks和hash文件标识  uploadFile（front\pages\uc.vue）
注意：{
1.此处暂时将限制文件格式和请求/uploadfile接口代码注释
}





# 项目阶段六 #


## 一、抽样hash计算 ##


1.**后端**

无


2.**前端**

参考模块：
布隆过滤器，舍弃部分精度换取读取文件效率

增加方法新内容:
抽样文件计算md5
2M以内的文件hash值和时间切片/webworker生产的hash是一样的
如果是大文件一般与其他两者不一样
如果是1G的文件，一般用抽样文件计算的大小为5M以内
另外：
hash值一样，文件不一定一样
文件一样，hash值一定一样
根据createFileChunk和calculateHashSample获取切片chunks和hash文件标识  uploadFile（front\pages\uc.vue）
注意：{
1.此处暂时将限制文件格式和请求/uploadfile接口代码注释
}



## 二、切片上传 ##

此处我自己将头像上传和大文件上传分开，并给头像上传做大小限制

1.**后端**

无


2.**前端**


增加方法：
限制头像文件大小isLimit（front\pages\uc.vue）

增加常量：
（5MB）UPLOADFILE_SIZE_LIMIT

修改方法：
上传大文件uploadBigFile（front\pages\uc.vue）
1.this.createFileChunk(this.file)获取chunks为局部变量；
2.将chunks通过map将每块切片的hash，name，index，file为一个对象，汇成chunks数组

新增方法：
上传全部切片uploadChunks（front\pages\uc.vue）
将chunks中每个切片转换成一个axios请求，分别上传至后端


我自己调整：
1.复制多一套文件上传input/button/el-progress元素用于大文件；
2.新增方法：uploadBigFile大文件上传方法;
3.新增方法：handleBigFileChange大文件点击添加文件;
4.头像上传和大文件上传的ref属性分别为：dragHead/dragBigFile；
5.drag从id属性改为class属性
6.bindEvent绑定dragHead和dragBigFile文件拖拽事件；
7.我增加方法新内容:
uploadFile（front\pages\uc.vue）
判断头像是否超过5MB
      if (!(await this.isLimit(this.file))) {
        this.$message.error("文件大小应限制在5M以内");
        return;
      }



## 三、网格进度条 ##


1.**后端**

无


2.**前端**


增加元素：
（front\pages\uc.vue）
总文件.cube-container
每一片文件切片.cube
切片状态： div class可能是uploading success error
切片icon i元素

增加计算属性computed：
总文件的宽度cubeWidth（front\pages\uc.vue）
总文件的上传进度要又各个切片进度累加而成uploadBigProgress（front\pages\uc.vue）

新增样式：
.cube .success .uploading .error（front\pages\uc.vue）



## 四、切片上传后端实现 ##


1.**后端**

完善大文件上传uploadBigfile方法（server\app\controller\util.js）
{
1.获取hash、name、chunk
2.获得切片存放文件夹chunkPath，若无则创建
3.切片移动
4.上传成功this.message
}


2.**前端**

增加样式：
:style="{'height':chunk.progress+'%'}"（front\pages\uc.vue）



## 五、后端文件合并 ##


1.**后端**

增加接口：
合并文件mergebigfile（server\app\router.js）

增加方法：
合并文件mergeBigFile（server\app\controller\util.js）
合并文件mergeBigFile（server\app\service\tools.js）
合并每一个切片到一个文件中mergeBigFileChunks（server\app\service\tools.js）

2.**前端**

增加方法：
请求合并文件mergeRequest（front\pages\uc.vue）
参数：文件后缀、大小(104857B，≈100kb)、hash
请求接口mergebigfile


# **问题：合并文件的时候，报错：size必须为整数。解决方法：将每个切片的大小转换为104857B** #






# 项目阶段七 #


## 一、秒传功能实现 ##


1.**后端**

增加接口：
查询文件上传进度checkfile（server\app\router.js）

增加方法：
查询文件上传进度checkFile（server\app\controller\util.js）
{
1.查询是否有文件，有则uploaded=true
2.查看是否有文件夹，有则uploadedList记录
}

2.**前端**

增加方法内容：
请求上传文件uploadBigFile（front\pages\uc.vue）
{
1.增加接口请求/checkfile
2.获取返回值{ uploaded, uploadedList }// 是否上传、上传切片数组
3.增加判断，如果uploaded==true，return this.$message.success("秒传成功！");
}



## 二、断点续传 ##


1.**后端**

无

2.**前端**

修改方法内容：
请求上传文件uploadBigFile（front\pages\uc.vue）
{
返回的每一个chunk的progress增加判断，progress: uploadedList.indexOf(name) > -1 ? 100 : 0
}

增加方法内容：
请求上传文件切片uploadChunks（front\pages\uc.vue）
{
在this.chunks.map之前过滤已经上传的文件.filter(chunk => uploadedList.include(chunk.name) === -1)
}



## 三、异步任务控制 ##


1.**后端**

无

2.**前端**

修改方法内容：
请求上传文件切片uploadChunks（front\pages\uc.vue）
{
1.在循环请求接口的时候使用的index是默认的01234，在此处之上的map返回chunk.index作为下一个map的index，解决指定方块上传success问题
}

增加元素：
<i class="el-icon-loading"></i>（front\pages\uc.vue）
{
让切片上传小方块中icon正常加载
}



## 四、并发数控制实现（头条笔试题） ##


1.**后端** 

无

2.**前端**

修改方法内容：
请求上传文件切片uploadChunks（front\pages\uc.vue）
{
1.requests只取到发送请求之前，后面的map注释
2.注释await Promise.all(requests);
3.在await mergeRequest方法前增加方法await this.sendRequest(requests);（参数：chunks，limit）
}
目的：控制切片上传，每次只能上传3个切片。



## 四、报错重试+报错次数限制实现 ##


1.**后端** 

无

2.**前端**

修改数据（computed）：
uploadBigProgress（front\pages\uc.vue）

修改方法内容：
请求上传文件切片sendRequest（front\pages\uc.vue）
{
1.增加try.catch获取错误
2.增加isStop变量，若为true则整体停止上传
3.catch里做重试和错误计数
}
上传文件切片uploadChunks（front\pages\uc.vue）
{
1.返回值增加 error: 0  错误次数统计
}
目的：控制切片上传错误重试次数，重试次数为3次。


## 思考题：TCP慢启动 ##
先上传一个小区块，比如10kb。根据区块上传成功时间决定下一个区块大小，可能20kb、30kb、50kb一次类推





# 项目阶段八 #


## 一、新建文章markdown编辑器 ##


1.**后端** 

无

2.**前端**


增加 marked 模块：
npm install loadash marked -save


增加页面并且增加文件夹：
（front\pages\editor\）
（front\pages\editor\new.vue）

增加数据：
content(MARKDOWN)（front\pages\editor\new.vue）
compiledContent(MARKDOWNS生成文本)（front\pages\editor\new.vue）

增加方法：
更新编辑器文本update和提交submit（front\pages\editor\new.vue）

增加样式：（front\pages\editor\new.vue）



## 二、粘贴和拖拽图片 ##


1.**后端** 

无

2.**前端**

修改方法：
更新contentupdate（front\pages\editor\new.vue）
增加延时


增加方法：
绑定事件bindEvent（front\pages\editor\new.vue）



## 三、mared编辑器扩展1-高亮 ##



1.**后端** 

无

2.**前端**

增加模块：
highlight.js（markdown代码高亮模块）
npm install highlight.js --save
使用：
{
    import hljs from "highlight.js";
    import javascript from "highlight.js/lib/languages/javascript";
    import "highlight.js/styles/github.css";
}



## 四、文章存储接口 ##



1.**后端** 

无

2.**前端**

完善方法：
submit（front\pages\editor\new.vue）



## 五、富文本编辑器选型 ##


1.**后端** 

无

2.**前端**

富文本编辑器：

原理：

可编辑div
<div contenteditable="true"></div>
document.execComment('')

早期选型（free）:
1.tinyMce
2.wangEditor
3.markdown

开源的定制（收费）：
1.slate.js