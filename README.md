# 腾讯云 - 智能图像服务

[![NPM Version](https://img.shields.io/npm/v/image-node-sdk.svg?style=flat)](https://www.npmjs.com/package/image-node-sdk)
[![Travis](https://img.shields.io/travis/TencentCloudBase/image-node-sdk.svg)](https://travis-ci.org/TencentCloudBase/image-node-sdk)
[![Deps](https://david-dm.org/TencentCloudBase/image-node-sdk.svg)](https://david-dm.org/TencentCloudBase/image-node-sdk)

## 安装

```javascript
npm i --save image-node-sdk
```

## 配置

可以设置以下环境变量，这样就不需要传入 `SecretID` 和 `SecretKey` 了。
```javascript
process.env.TENCENTCLOUD_SECRETID
process.env.TENCENTCLOUD_SECRETKEY

// 或
process.env.SECRETID
process.env.SECRETKEY
```

## 使用

以 创建人员 为例，一般支持外链 url 或者本地读取图片文件，两种方式。

* 外链 url

```javascript
const {
    ImageClient
} = require('image-node-sdk');

let SecretID = ''; // 腾讯云 SecretID
let SecretKey = ''; // 腾讯云 SecretKey

let Url = 'https://www.google.com.hk/url?sa=i&source=images&cd=&cad=rja&uact=8&ved=2ahUKEwjX9Pv-s8XgAhWZKqYKHY2WCOcQjRx6BAgBEAU&url=https%3A%2F%2Fkuaibao.qq.com%2Fs%2F20180506A0GUC600%3Frefer%3Dspider&psig=AOvVaw1hxiMNF_ZVQZvkVu11xNNf&ust=1550580081217063';
let imgClient = new ImageClient({ SecretID, SecretKey });
imgClient.init({
    action: 'CreatePerson',
    data: {
        GroupId: 'mengmeiqi-01',
        PersonName: '孟美歧',
        PersonId: 'mengmeiqi-0001',
        Url,
    }
}).then((result) => {
    console.log(result.body)
}).catch((e) => {
    console.log(e);
});
```
* 读取本地文件

```javascript
const fs = require('fs');
const path = require('path');
const {
    ImageClient
} = require('image-node-sdk');

let SecretID = ''; // 腾讯云 SecretID
let SecretKey = ''; // 腾讯云 SecretKey

let imgClient = new ImageClient({ SecretID, SecretKey });
imgClient.init({
    action: 'CreatePerson',
    data: {
        GroupId: 'mengmeiqi-01',
        PersonName: '孟美歧',
        PersonId: 'mengmeiqi-0001',
        Image: fs.readFileSync(path.join(__dirname, '../config/mengmeiqi-0001.jpeg')).toString('base64'),
    }
}).then((result) => {
    console.log(result.body)
}).catch((e) => {
    console.log(e);
});
```

## 支持功能及相关 API 文档

* 人脸识别
    - [x] [人脸检测与分析](https://cloud.tencent.com/document/api/867/32800) - DetectFace
    - [x] [五官定位](https://cloud.tencent.com/document/api/867/32779) - AnalyzeFace
    - [x] [人脸比对](https://cloud.tencent.com/document/api/867/32802) - CompareFace

    - [x] [人员库管理-创建人员库](https://cloud.tencent.com/document/api/867/32794) - CreateGroup
    - [x] [人员库管理-删除人员库](https://cloud.tencent.com/document/api/867/32791) - DeleteGroup
    - [x] [人员库管理-获取人员库列表](https://cloud.tencent.com/document/api/867/32788) - GetGroupList
    - [x] [人员库管理-修改人员库](https://cloud.tencent.com/document/api/867/32783) - ModifyGroup
    - [x] [人员库管理-创建人员](https://cloud.tencent.com/document/api/867/32793) - CreatePerson
    - [x] [人员库管理-删除人员](https://cloud.tencent.com/document/api/867/32790) - DeletePerson
    - [x] [人员库管理-人员库删除人员](https://cloud.tencent.com/document/api/867/32789) - DeletePersonFromGroup
    - [x] [人员库管理-获取人员列表长度](https://cloud.tencent.com/document/api/867/32784) - GetPersonListNum
    - [x] [人员库管理-获取人员基础信息](https://cloud.tencent.com/document/api/867/32787) - GetPersonBaseInfo
    - [x] [人员库管理-获取人员归属信息](https://cloud.tencent.com/document/api/867/32786) - GetPersonGroupInfo
    - [x] [人员库管理-修改人员基础信息](https://cloud.tencent.com/document/api/867/32782) - ModifyPersonBaseInfo
    - [x] [人员库管理-修改人员描述信息](https://cloud.tencent.com/document/api/867/32781) - ModifyPersonGroupInfo
    - [x] [人员库管理-获取人员库列表](https://cloud.tencent.com/document/api/867/32788) - GetGroupList
    - [x] [人员库管理-增加人脸](https://cloud.tencent.com/document/api/867/32795) - CreateFace
    - [x] [人员库管理-删除人脸](https://cloud.tencent.com/document/api/867/32792) - DeleteFace
    - [x] [人员库管理-复制人员](https://cloud.tencent.com/document/api/867/32796) - CopyPerson

    - [x] [人脸搜索](https://cloud.tencent.com/document/api/867/32798) - SearchFaces
    - [x] [人脸验证](https://cloud.tencent.com/document/api/867/32806) - VerifyFace
    - [x] [人脸静态活体检测](https://cloud.tencent.com/document/api/867/32804) - DetectLiveFace

* 人脸核身
    - [x] [实名核身鉴权](https://cloud.tencent.com/document/product/1007/31816) - DetectAuth
    - [x] [获取动作顺序](https://cloud.tencent.com/document/product/1007/31822) - GetActionSequence
    - [x] [获取数字验证码](https://cloud.tencent.com/document/product/1007/31821) - GetLiveCode
    - [x] [照片人脸核身](https://cloud.tencent.com/document/product/1007/31820) - ImageRecognition
    - [x] [活体人脸比对](https://cloud.tencent.com/document/product/1007/31819) - LivenessCompare
    - [x] [活体人脸核身](https://cloud.tencent.com/document/product/1007/31818) - LivenessRecognition
    - [x] [获取实名核身结果信息](https://cloud.tencent.com/document/product/1007/31331) - GetDetectInfo

* 人脸融合
    - [x] [人脸融合](https://cloud.tencent.com/document/product/670/31061) - FaceFusion

## 更新日志
[日志](./CHANGELOG.md)

## 声明
测试用的身份证源于[该文章](https://blog.csdn.net/kaka20080622/article/details/50563069)的实验身份证，如有侵权，请联系作者删除。
