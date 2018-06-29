const fs = require('fs');
const path = require('path');
const {
    ImageClient
} = require('../index');

// 需要在config目录，创建 index.js 并做好配置
/**
 * const ProxyUrl = '';
 * const AppId = '';
 * const SecretId = '';
 * const SecretKey = '';

 * exports.ProxyUrl = ProxyUrl;
 * exports.AppId = AppId;
 * exports.SecretId = SecretId;
 * exports.SecretKey = SecretKey;
 *
 */
const {
    ProxyUrl,
    AppId,
    SecretId,
    SecretKey
} = require('../config');


// 图片标签
let imageUrl = 'https://www.ocf.berkeley.edu/~sather/wp-content/uploads/2018/01/food--1200x600.jpg';
let imgClient1 = new ImageClient({ AppId, SecretId, SecretKey });
imgClient1
    .setProxy(ProxyUrl)
    .setHost('100.100.72.76')
    .setProtocol('http')
    .imgTagDetect({
    data: {
        url: imageUrl
    }
}).then((result) => {
    console.log(result.body)
}).catch((e) => {
    console.log(e);
});

// OCR-身份证识别
let idCardImageUrl = 'http://images.cnitblog.com/blog/454646/201306/07090518-029ff26fac014d72a7786937e8319c78.jpg';
let imgClient2 = new ImageClient({ AppId, SecretId, SecretKey });
imgClient2.setProxy(ProxyUrl);
imgClient2.ocrIdCard({
    data: {
        url_list: [idCardImageUrl]
    }
}).then((result) => {
    console.log(result.body);
}).catch((e) => {
    console.log(e);
});

imgClient2.ocrIdCard({
    formData: {
        card_type: 0,
        image: fs.createReadStream(path.join(__dirname, './idcard.jpg'))
    },
    headers: {
        'content-type': 'multipart/form-data'
    }
}).then((result) => {
    console.log(result.body)
}).catch((e) => {
    console.log(e);
});

// OCR-名片识别
let bizCardImageUrl = 'http://pic.pimg.tw/arger0204/1379898645-4015181363.jpg';
let imgClient3 = new ImageClient({ AppId, SecretId, SecretKey });
imgClient3.ocrBizCard({
    data: {
        url_list: [bizCardImageUrl]
    }
}).then((result) => {
    console.log(result.body)
}).catch((e) => {
    console.log(e);
});

// 人脸识别-人脸检测与分析
let faceDetectImageUrl = 'http://i.dailymail.co.uk/i/newpix/2018/03/19/20/4A59925C00000578-0-image-a-21_1521491098500.jpg';
let imgClient4 = new ImageClient({ AppId, SecretId, SecretKey });
// imgClient4.setProxy(ProxyUrl)
imgClient4.faceDetect({
    data: {
        mode: 1,
        url: faceDetectImageUrl
    }
}).then((result) => {
    console.log(result.body)
}).catch((e) => {
    console.log(e);
});

// 人脸识别-五官定位
let faceShapeImageUrl = 'http://i.dailymail.co.uk/i/newpix/2018/03/19/20/4A59925C00000578-0-image-a-21_1521491098500.jpg';
let imgClient5 = new ImageClient({ AppId, SecretId, SecretKey });
// imgClient5.setProxy(ProxyUrl)
imgClient5.faceShape({
    data: {
        mode: 1,
        url: faceShapeImageUrl
    }
}).then((result) => {
    console.log(result.body)
}).catch((e) => {
    console.log(e);
});

// 人脸识别-人脸对比
let faceCompareImageUrlA = 'http://img1.gtimg.com/ent/pics/hv1/15/148/2141/139256280.jpg';
let faceCompareImageUrlB = 'http://img1.gtimg.com/ent/pics/hv1/21/36/2041/132725226.jpg';
let imgClient6 = new ImageClient({ AppId, SecretId, SecretKey });
// imgClient6.setProxy(ProxyUrl)
imgClient6.faceCompare({
    data: {
        urlA: faceCompareImageUrlA,
        urlB: faceCompareImageUrlB
    }
}).then((result) => {
    console.log(result.body)
}).catch((e) => {
    console.log(e);
});

// OCR-手写体识别
let handWritingImageUrl = 'http://img5.3lian.com/font2013/5/5.jpg';
let imgClient7 = new ImageClient({ AppId, SecretId, SecretKey });
// imgClient7.setProxy(ProxyUrl)
imgClient7.ocrHandWriting({
    data: {
        url: handWritingImageUrl
    }
}).then((result) => {
    console.log(result.body)
}).catch((e) => {
    console.log(e);
});

// ORC-营业执照
let bizLicenseImageUrl = 'http://www.xdglrq.co/wp-content/uploads/%E8%90%A5%E4%B8%9A%E6%89%A7%E7%85%A7-%E6%AD%A3%E6%9C%AC.jpg';
let imgClient8 = new ImageClient({ AppId, SecretId, SecretKey });
// imgClient8.setProxy(ProxyUrl)
imgClient8.ocrBizLicense({
    data: {
        url: bizLicenseImageUrl
    }
}).then((result) => {
    console.log(result.body)
}).catch((e) => {
    console.log(e);
});

// ORC-行驶证驾驶证识别
let drivinglicenceImageUrl = 'http://pic3.58cdn.com.cn/o2o/n_v1bl2lwkpvsdrvpvtpgila.jpg';
let imgClient9 = new ImageClient({ AppId, SecretId, SecretKey });
// imgClient9.setProxy(ProxyUrl)
imgClient9.ocrDrivingLicence('ocr-drivinglicence', {
    data: {
        type: 0,
        url: drivinglicenceImageUrl
    }
}).then((result) => {
    console.log(result.body)
}).catch((e) => {
    console.log(e);
});

// ORC-车牌号识别
let plateImageUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiYPL0seBXhiffV5FyvdUQxgI7o7z9T1BMez6D9wjWJuhZeeZV';
let imgClient10 = new ImageClient({ AppId, SecretId, SecretKey });
// oCRPlate.setProxy(ProxyUrl)
imgClient10.ocrPlate({
    data: {
        url: plateImageUrl
    }
}).then((result) => {
    console.log(result.body)
}).catch((e) => {
    console.log(e);
});

// ORC-通用印刷体识别
let generalImageUrl = 'http://www.szxuexiao.com/uploadimages/keben/190938_4c5b655967652.jpg';
let imgClient11 = new ImageClient({ AppId, SecretId, SecretKey });
imgClient11.ocrGeneral({
    data: {
        url: generalImageUrl
    }
}).then((result) => {
    console.log(result.body)
}).catch((e) => {
    console.log(e);
});

// ORC-银行卡识别
let bankcardImageUrl = 'http://www.boc.cn/bcservice/bc1/201109/W020120730519896516453.jpg';
let imgClient12 = new ImageClient({ AppId, SecretId, SecretKey });
// imgClient12.setProxy(ProxyUrl)
imgClient12.ocrBankCard({
    data: {
        url: bankcardImageUrl
    }
}).then((result) => {
    console.log(result.body)
}).catch((e) => {
    console.log(e);
});

// ORC-银行卡识别
let bankcardImageUrl = 'http://www.boc.cn/bcservice/bc1/201109/W020120730519896516453.jpg';
let imgClient12 = new ImageClient({ AppId, SecretId, SecretKey });
// imgClient12.setProxy(ProxyUrl)
imgClient12.ocrBankCard({
    data: {
        url: bankcardImageUrl
    }
}).then((result) => {
    console.log(result.body)
}).catch((e) => {
    console.log(e);
});

// 个体信息管理 - 个体创建
let person1 = 'http://img1.gtimg.com/ent/pics/hv1/15/148/2141/139256280.jpg';
let person2 = 'http://img1.gtimg.com/ent/pics/hv1/21/36/2041/132725226.jpg';
let person3 = 'http://inews.gtimg.com/newsapp_match/0/2595266895/0';
let person4 = 'http://img2.utuku.china.com/592x0/news/20170628/f583966c-e3f5-4244-bd72-bbeab6a0f720.jpg';

let imgClient13 = new ImageClient({ AppId, SecretId, SecretKey });
// imgClient14.setProxy(ProxyUrl)
imgClient13.faceNewPerson({
    data: {
        group_ids: ['female-stars'],
        person_id: 'dilireba1',
        url: person4,
        person_name: '迪丽热巴'
    }
}).then((result) => {
    console.log(result.body)
}).catch((e) => {
    console.log(e);
});

// 个体信息管理 - 多脸检索
let person5 = 'http://img1.gtimg.com/ent/pics/hv1/15/148/2141/139256280.jpg';
let imgClient14 = new ImageClient({ AppId, SecretId, SecretKey });
// imgClient14.setProxy(ProxyUrl)
imgClient14.faceMultiple({
    data: {
        group_id: 'female-stars',
        // group_ids: ['female-stars'],
        url: person5,
        // person_name: '迪丽热巴'
    }
}).then((result) => {
    console.log(result.body)
}).catch((e) => {
    console.log(e);
});

// 个体信息管理 - 人脸验证
let person6 = 'http://img1.utuku.china.com/640x0/news/20170530/f8a463d7-a032-4535-8fbb-0a6bfa7b06df.jpg';
let imgClient15 = new ImageClient({ AppId, SecretId, SecretKey });
// imgClient15.setProxy(ProxyUrl)
imgClient15.faceVerify({
    data: {
        person_id: 'yangmi1',
        url: person6,
    }
}).then((result) => {
    console.log(result.body)
}).catch((e) => {
    console.log(e);
});

// 个体信息管理 - 人脸检索
let person7 = 'http://img1.utuku.china.com/640x0/news/20170530/f8a463d7-a032-4535-8fbb-0a6bfa7b06df.jpg';
let imgClient16 = new ImageClient({ AppId, SecretId, SecretKey });
// imgClient16.setProxy(ProxyUrl)
imgClient16.faceIdentify({
    data: {
        group_id: 'female-stars',
        url: person7,
    }
}).then((result) => {
    console.log(result.body)
}).catch((e) => {
    console.log(e);
});
