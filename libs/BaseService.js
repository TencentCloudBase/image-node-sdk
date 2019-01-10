const {
    rp,
    sign
} = require('./utils');
const urlUtil = require('url');
const randomInt = require('random-int');
const config = require('./config');
const ERR = require('./error');

// 部分接口陆续使用 API 3.0
const tencentcloud = require('tencentcloud-sdk-nodejs');
const Credential = tencentcloud.common.Credential;
const ClientProfile = tencentcloud.common.ClientProfile;
const HttpProfile = tencentcloud.common.HttpProfile;


class BaseService {

    constructor({ AppId, SecretId, SecretKey } = {}) {
        let {
            APPID,
            SECRETID,
            SECRETKEY,
            TENCENTCLOUD_APPID,
            TENCENTCLOUD_SECRETID,
            TENCENTCLOUD_SECRETKEY
        } = process.env;
        this.rp = rp;
        this.AppId = AppId || TENCENTCLOUD_APPID || APPID;
        this.SecretId = SecretId || TENCENTCLOUD_SECRETID || SECRETID;
        this.SecretKey = SecretKey || TENCENTCLOUD_SECRETKEY || SECRETKEY;
    }

    setProxy(proxy) {
        this.Proxy = proxy || null;
        return this;
    }

    setHost(host) {
        this.Host = host;
        return this;
    }

    setProtocol(protocol) {
        this.Protocol = protocol;
        return this;
    }

    getUrl(urlStr) {
        let url = urlStr;
        if (this.Host) {
            let urlParam = urlUtil.parse(url);
            urlParam.host = this.Host;
            urlParam.protocol = this.Protocol || urlParam.protocol;
            url = urlUtil.format(urlParam);
        }

        return url;
    }

    /**
     * 签名校验
     */
    sign() {
        let curTime = Math.ceil(Date.now() / 1000);

        let data = {
            a: this.AppId,
            k: this.SecretId,
            e: curTime + 100,
            t: curTime,
            r: randomInt(10000, 99999),
            u: 0,
            f: '' // imageUrl
        };

        let StringA = '';
        Object.keys(data).forEach(key => {
            StringA += `&${key}=${data[key]}`;
        });
        StringA = StringA.replace('&', '');
        // console.log(StringA)
        let Signature = sign(StringA, this.SecretKey);

        // console.log(Signature)
        return Signature;
    }

    /**
     * 发送请求
     * @param {String} type
     * @param {Ojbect} params
     * @param {Object} options
     */
    request(type, params, options = {}) {

        if (!config.Services.hasOwnProperty(type)) {
            throw new Error(ERR.ERR_NO_SERVICE);
        }

        let services = config.Services[type];
        let url = services.url;
        let urlParam = urlUtil.parse(url);

        let {
            data = {},
            headers = {},
            formData = {},
            rejectUnauthorized
        } = params;

        let rpParam = {
            ...options,
            url: this.getUrl(url),
            method: 'POST',
            headers: {
                'host': urlParam.host,
                'content-type': 'application/json',
                'authorization': this.sign()
            }
        };

        rpParam.rejectUnauthorized = (typeof rejectUnauthorized === 'undefined' || !rejectUnauthorized) ? false : true;
        rpParam.headers = Object.assign({}, rpParam.headers, headers);

        if (rpParam.headers['content-type'] === 'application/json') {
            rpParam.body = JSON.stringify(Object.assign({}, data, {
                appid: this.AppId
            }));
        }
        else if (rpParam.headers['content-type'] === 'multipart/form-data') {
            formData.appid = this.AppId;
            rpParam.formData = formData;
        }

        if (this.Proxy) {
            rpParam.proxy = this.Proxy;
        }

        // console.log(rpParam);
        return this.rp(rpParam);
    }

    // 人脸融合
    faceFuse(params, options) {
        const {
            ProjectId,
            ModelId,
            Image,
            RspImgType,
            region
        } = params.data;

        const FacefusionClient = tencentcloud.facefusion.v20181201.Client;
        const models = tencentcloud.facefusion.v20181201.Models;

        let cred = new Credential(this.SecretId, this.SecretKey);
        let httpProfile = new HttpProfile();
        httpProfile.endpoint = 'facefusion.tencentcloudapi.com';
        let clientProfile = new ClientProfile();
        clientProfile.httpProfile = httpProfile;
        let client = new FacefusionClient(cred, region || 'ap-shanghai', clientProfile);

        let req = new models.FaceFusionRequest();

        let reqParams = JSON.stringify({
            ProjectId,
            ModelId,
            Image,
            RspImgType
        });

        req.from_json_string(reqParams);

        return new Promise((resolve, reject) => {
            client.FaceFusion(req, function(errMsg, response) {

                if (errMsg) {
                    reject(errMsg);
                    return;
                }

                resolve(response.to_json_string());
            });
        });
        // return this.request('face-fuse', params, options);
    }

    // 身份证信息认证
    authIdCard(params, options) {
        return this.request('auth-idcard', params, options);
    }

    // 图片标签
    imgTagDetect(params, options) {
        return this.request('image-tag-detect', params, options);
    }

    // 图片鉴黄
    imgPornDetect(params, options) {
        return this.request('image-porn-detect', params, options);
    }

    // 人脸识别-人脸检测与分析
    faceDetect(params, options) {
        return this.request('face-detect', params, options);
    }

    // 人脸识别-五官定位
    faceShape(params, options) {
        return this.request('face-shape', params, options);
    }

    // 人脸识别-人脸对比
    faceCompare(params, options) {
        return this.request('face-compare', params, options);
    }

    // 个体信息管理 - 个体创建
    faceNewPerson(params, options) {
        return this.request('face-newperson', params, options);
    }

    // 个体信息管理 - 删除个体
    faceDelPerson(params, options) {
        return this.request('face-delperson', params, options);
    }

    // 个体信息管理 - 增加人脸
    faceAddFace(params, options) {
        return this.request('face-addface', params, options);
    }

    // 个体信息管理 - 删除人脸
    faceDelFace(params, options) {
        return this.request('face-delface', params, options);
    }

    // 个体信息管理 - 设置信息
    faceSetInfo(params, options) {
        return this.request('face-setinfo', params, options);
    }

    // 个体信息管理 - 获取信息
    faceGetInfo(params, options) {
        return this.request('face-getinfo', params, options);
    }

    // 个体信息管理 - 获取组列表
    faceGetGpIds(params, options) {
        return this.request('face-getgroupids', params, options);
    }

    // 个体信息管理 - 获取人列表
    faceGetPersonIds(params, options) {
        return this.request('face-getpersonids', params, options);
    }

    // 个体信息管理 - 获取人脸列表
    faceGetFaceIds(params, options) {
        return this.request('face-getfaceids', params, options);
    }

    // 个体信息管理 - 获取人脸信息
    faceGetFaceInfo(params, options) {
        return this.request('face-getfaceinfo', params, options);
    }

    // 个体信息管理 - 新增组信息
    faceAddGPIds(params, options) {
        return this.request('face-addgroupids', params, options);
    }

    // 个体信息管理 - 删除组信息
    faceDelGPIds(params, options) {
        return this.request('face-delgroupids', params, options);
    }

    // 人脸识别-多脸检索
    faceMultiple(params, options) {
        return this.request('face-multiple', params, options);
    }

    // 人脸识别-人脸验证
    faceVerify(params, options) {
        return this.request('face-verify', params, options);
    }

    // 人脸识别-人脸检索
    faceIdentify(params, options) {
        return this.request('face-identify', params, options);
    }

    // 人脸核身-人脸静态活体检测
    faceLiveDetectPic(params, options) {
        return this.request('face-livedetectpicture', params, options);
    }

    // 人脸核身-唇语活体检测视频身份信息核验
    faceIdCardLiveDetectFour(params, options) {
        return this.request('face-idcardlivedetectfour', params, options);
    }

    // 人脸核身-获取唇语验证码
    faceLiveGetFour(params, options) {
        // const {
        //     region
        // } = params.data;

        // const FaceidClient = tencentcloud.faceid.v20180301.Client;
        // const models = tencentcloud.faceid.v20180301.Models;

        // const Credential = tencentcloud.common.Credential;
        // const ClientProfile = tencentcloud.common.ClientProfile;
        // const HttpProfile = tencentcloud.common.HttpProfile;

        // let cred = new Credential(this.SecretId, this.SecretKey);
        // let httpProfile = new HttpProfile();
        // httpProfile.endpoint = 'faceid.tencentcloudapi.com';
        // let clientProfile = new ClientProfile();
        // clientProfile.httpProfile = httpProfile;
        // let client = new FaceidClient(cred, region || 'ap-shanghai', clientProfile);

        // let req = new models.GetLiveCodeRequest();

        // let reqParams = '{}';
        // req.from_json_string(reqParams);


        // return new Promise((resolve, reject) => {
        //     client.GetLiveCode(req, function(errMsg, response) {

        //         if (errMsg) {
        //             reject(errMsg);
        //             return;
        //         }
        //         resolve(response.to_json_string());
        //     });
        // });
        return this.request('face-livegetfour', params, options);
    }

    // 人脸核身-活体检测视频与用户照片的对比
    faceLiveDetectFour(params, options) {
        return this.request('face-livedetectfour', params, options);
    }

    // 人脸核身-用户上传照片身份信息核验
    faceIdCardCompare(params, options) {
        return this.request('face-idcardcompare', params, options);
    }

    // OCR-身份证识别
    ocrIdCard(params, options) {
        return this.request('ocr-idcard', params, options);
    }

    // OCR-名片识别
    ocrBizCard(params, options) {
        return this.request('ocr-businesscard', params, options);
    }

    // OCR-手写体识别
    ocrHandWriting(params, options) {
        return this.request('ocr-handwriting', params, options);
    }

    // OCR-营业执照识别
    ocrBizLicense(params, options) {
        return this.request('ocr-bizlicense', params, options);
    }

    // OCR-行驶证驾驶证
    ocrDrivingLicence(params, options) {
        return this.request('ocr-drivinglicence', params, options);
    }

    // OCR-车牌号识别
    ocrPlate(params, options) {
        return this.request('ocr-plate', params, options);
    }

    // OCR-通用印刷体识别
    ocrGeneral(params, options) {
        return this.request('ocr-general', params, options);
    }

    // OCR-银行卡识别
    ocrBankCard(params, options) {
        return this.request('ocr-bankcard', params, options);
    }

}

module.exports = BaseService;
