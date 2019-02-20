const config = require('./config');

const tencentcloud = require('tencentcloud-sdk-nodejs');
const Credential = tencentcloud.common.Credential;
const ClientProfile = tencentcloud.common.ClientProfile;
const HttpProfile = tencentcloud.common.HttpProfile;

class BaseService {

    constructor({ SecretID, SecretKey } = {}) {
        let {
            SECRETID,
            SECRETKEY,
            TENCENTCLOUD_SECRETID,
            TENCENTCLOUD_SECRETKEY
        } = process.env;

        this.SecretID = SecretID || TENCENTCLOUD_SECRETID || SECRETID;
        this.SecretKey = SecretKey || TENCENTCLOUD_SECRETKEY || SECRETKEY;
    }

    setProxy(proxy) {
        this.Proxy = proxy || null;
        // process.env.https_proxy = proxy;
        // process.env.http_proxy = proxy;
        return this;
    }

    init({ action = '', data = {}, options = {}}) {

        if (!action) {
            throw new Error('action should not be empty.');
        }

        if (!this[action]) {
            throw new Error('action cannot be found.');
        }

        return this[action](data, options);
    }

    request({ Service, Action, Version, data, options }) {
        const Client = tencentcloud[Service][Version].Client;
        const Models = tencentcloud[Service][Version].Models;
        let cred = new Credential(this.SecretID, this.SecretKey);
        let httpProfile = new HttpProfile();
        httpProfile.endpoint = config.Services[Action].url;
        let clientProfile = new ClientProfile();
        clientProfile.httpProfile = httpProfile;
        let client = new Client(cred, options.region || 'ap-shanghai', clientProfile);

        let req = new Models[`${Action}Request`]();

        let reqParams = JSON.stringify({
            ...data
        });

        req.from_json_string(reqParams);

        return new Promise((resolve, reject) => {
            client[Action](req, function(errMsg, response) {

                if (errMsg) {
                    reject(errMsg);
                    return;
                }

                resolve(response.to_json_string());
            });
        });
    }

    // 人脸融合
    FaceFusion(data = {}, options = {}) {
        return this.request({
            Service: 'facefusion',
            Action: 'FaceFusion',
            Version: 'v20181201',
            data,
            options,
        });
    }

    // 实名核身鉴权
    DetectAuth(data = {}, options = {}) {
        return this.request({
            Service: 'faceid',
            Action: 'DetectAuth',
            Version: 'v20180301',
            data,
            options,
        });
    }

    // 获取动作顺序
    GetActionSequence(data = {}, options = {}) {
        return this.request({
            Service: 'faceid',
            Action: 'GetActionSequence',
            Version: 'v20180301',
            data,
            options,
        });
    }

    // 获取数字验证码
    GetLiveCode(data = {}, options = {}) {
        return this.request({
            Service: 'faceid',
            Action: 'GetLiveCode',
            Version: 'v20180301',
            data,
            options,
        });
    }

    ImageRecognition(data = {}, options = {}) {
        return this.request({
            Service: 'faceid',
            Action: 'ImageRecognition',
            Version: 'v20180301',
            data,
            options,
        });
    }

    // 活体人脸比对
    LivenessCompare(data = {}, options = {}) {
        return this.request({
            Service: 'faceid',
            Action: 'LivenessCompare',
            Version: 'v20180301',
            data,
            options,
        });
    }

    // 活体人脸核身
    LivenessRecognition(data = {}, options = {}) {
        return this.request({
            Service: 'faceid',
            Action: 'LivenessRecognition',
            Version: 'v20180301',
            data,
            options,
        });
    }

    // 获取实名核身结果信息
    GetDetectInfo(data = {}, options = {}) {
        return this.request({
            Service: 'faceid',
            Action: 'GetDetectInfo',
            Version: 'v20180301',
            data,
            options,
        });
    }

    // 人脸检测与分析
    DetectFace(data = {}, options = {}) {
        console.log();
        return this.request({
            Service: 'iai',
            Action: 'DetectFace',
            Version: 'v20180301',
            data,
            options,
        });
    }

    // 五官定位
    AnalyzeFace(data = {}, options = {}) {
        return this.request({
            Service: 'iai',
            Action: 'AnalyzeFace',
            Version: 'v20180301',
            data,
            options,
        });
    }

    CompareFace(data = {}, options = {}) {
        return this.request({
            Service: 'iai',
            Action: 'CompareFace',
            Version: 'v20180301',
            data,
            options,
        });
    }

    // 创建人员库
    CreateGroup(data = {}, options = {}) {
        return this.request({
            Service: 'iai',
            Action: 'CreateGroup',
            Version: 'v20180301',
            data,
            options,
        });
    }

    // 删除人员库
    DeleteGroup(data = {}, options = {}) {
        return this.request({
            Service: 'iai',
            Action: 'DeleteGroup',
            Version: 'v20180301',
            data,
            options,
        });
    }

    // 获取人员列表
    GetGroupList(data = {}, options = {}) {
        return this.request({
            Service: 'iai',
            Action: 'GetGroupList',
            Version: 'v20180301',
            data,
            options,
        });
    }

    // 修改人员库
    ModifyGroup(data = {}, options = {}) {
        return this.request({
            Service: 'iai',
            Action: 'ModifyGroup',
            Version: 'v20180301',
            data,
            options,
        });
    }

    // 创建人员
    CreatePerson(data = {}, options = {}) {
        return this.request({
            Service: 'iai',
            Action: 'CreatePerson',
            Version: 'v20180301',
            data,
            options,
        });
    }

    // 删除人员
    DeletePerson(data = {}, options = {}) {
        return this.request({
            Service: 'iai',
            Action: 'DeletePerson',
            Version: 'v20180301',
            data,
            options,
        });
    }

    // 人员库删除人员
    DeletePersonFromGroup(data = {}, options = {}) {
        return this.request({
            Service: 'iai',
            Action: 'DeletePersonFromGroup',
            Version: 'v20180301',
            data,
            options,
        });
    }

    // 获取人员列表
    GetPersonList(data = {}, options = {}) {
        return this.request({
            Service: 'iai',
            Action: 'GetPersonList',
            Version: 'v20180301',
            data,
            options,
        });
    }

    // 获取人员列表长度
    GetPersonListNum(data = {}, options = {}) {
        return this.request({
            Service: 'iai',
            Action: 'GetPersonListNum',
            Version: 'v20180301',
            data,
            options,
        });
    }

    // 获取人员基础信息
    GetPersonBaseInfo(data = {}, options = {}) {
        return this.request({
            Service: 'iai',
            Action: 'GetPersonBaseInfo',
            Version: 'v20180301',
            data,
            options,
        });
    }

    // 获取人员归属信息
    GetPersonGroupInfo(data = {}, options = {}) {
        return this.request({
            Service: 'iai',
            Action: 'GetPersonGroupInfo',
            Version: 'v20180301',
            data,
            options,
        });
    }

    // 修改人员基础信息
    ModifyPersonBaseInfo(data = {}, options = {}) {
        return this.request({
            Service: 'iai',
            Action: 'ModifyPersonBaseInfo',
            Version: 'v20180301',
            data,
            options,
        });
    }

    // 修改人员描述信息
    ModifyPersonGroupInfo(data = {}, options = {}) {
        return this.request({
            Service: 'iai',
            Action: 'ModifyPersonGroupInfo',
            Version: 'v20180301',
            data,
            options,
        });
    }

    // 增加人脸
    CreateFace(data = {}, options = {}) {
        return this.request({
            Service: 'iai',
            Action: 'CreateFace',
            Version: 'v20180301',
            data,
            options,
        });
    }

    // 删除人脸
    DeleteFace(data = {}, options = {}) {
        return this.request({
            Service: 'iai',
            Action: 'DeleteFace',
            Version: 'v20180301',
            data,
            options,
        });
    }

    // 复制人员
    CopyPerson(data = {}, options = {}) {
        return this.request({
            Service: 'iai',
            Action: 'CopyPerson',
            Version: 'v20180301',
            data,
            options,
        });
    }

    // 人脸搜索
    SearchFaces(data = {}, options = {}) {
        return this.request({
            Service: 'iai',
            Action: 'SearchFaces',
            Version: 'v20180301',
            data,
            options,
        });
    }

    // 人脸验证
    VerifyFace(data = {}, options = {}) {
        return this.request({
            Service: 'iai',
            Action: 'VerifyFace',
            Version: 'v20180301',
            data,
            options,
        });
    }

    // 人脸静态活体检测
    DetectLiveFace(data = {}, options = {}) {
        return this.request({
            Service: 'iai',
            Action: 'DetectLiveFace',
            Version: 'v20180301',
            data,
            options,
        });
    }

}

module.exports = BaseService;
