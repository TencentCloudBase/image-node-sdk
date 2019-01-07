const {
    ImageClient
} = require('../index');
const path = require('path');
const fs = require('fs');
let config = require('../config');

let ProxyUrl = null;
let uin = null;

if (process.env.TRAVIS) {
    uin = process.env.uin;
}
else {
    ProxyUrl = config.ProxyUrl;
    process.env.TENCENTCLOUD_APPID = config.AppId;
    process.env.TENCENTCLOUD_SECRETID = config.SecretId;
    process.env.TENCENTCLOUD_SECRETKEY = config.SecretKey;
    uin = config.uin;
}

describe('ai service', () => {
    it('图片标签 - imgTagDetect', async () => {
        let imageUrl = 'https://ask.qcloudimg.com/draft/1011618/hmx4gls586.jpg';
        let imgClient1 = new ImageClient();
        let result = await imgClient1
            .setProtocol('http')
            .imgTagDetect({
                data: {
                    url: imageUrl
                }
            });

        let data = JSON.parse(result.body);
        // console.log(data);
        expect(data).toEqual({
            'code': 0,
            'message': 'success',
            'tags': [{ 'tag_name': '盘子', 'tag_confidence': 45 }, { 'tag_name': '碗', 'tag_confidence': 23 }, { 'tag_name': '菜品', 'tag_confidence': 62 }]
        });
    }, 30000);

    it('人脸融合 - faceFuse', async () => {
        let imgClient1 = new ImageClient();
        let imgData = fs.readFileSync(path.join(__dirname, 'ponyma.jpg')).toString('base64');

        // console.log(imgData);
        let result = await imgClient1
            .faceFuse({
                data: {
                    ProjectId: '100792',
                    ModelId: 'qc_100792_162409_1',
                    Image: imgData,
                    RspImgType: 'url'
                }
            });

        let data = JSON.parse(result);
        expect(data.Image).not.toBeNull();
        expect(data.RequestId).not.toBeNull();
    }, 20000);

    it('人脸核身·获取数字验证码 - faceLiveGetFour', async () => {
        let imgClient = new ImageClient();

        // console.log(imgData);
        let result = await imgClient
            .faceLiveGetFour({
                data: {}
            });

        console.log(result.body);
        let data = JSON.parse(result.body);
        expect(data.code).toEqual(0);
        expect(data.data.validate_data).not.toBeNull();
    }, 20000);

    it.skip('人脸核身·活体人脸核身 - faceIdCardLiveDetectFour', async () => {
        let imgClient = new ImageClient();

        let result = await imgClient
            .faceIdCardLiveDetectFour({
                headers: {
                    'content-type': 'multipart/form-data'
                },
                formData: {
                    idcard_number: config.IdCard,
                    idcard_name: config.Name,
                    video: fs.readFileSync(path.join(__dirname, '../config/faceIdCardLiveDetectFour.mp4')),
                    validate_data: '1234'
                }
            });

        let data = JSON.parse(result.body);
        expect(data.data.live_status).toEqual(0);
        expect(data.data.compare_status).toEqual(0);
    }, 20000);

});