const {
    ImageClient
} = require('../index');
const path = require('path');
const fs = require('fs');

let AppId = null;
let SecretId = null;
let SecretKey = null;
let ProxyUrl = null;

if (process.env.TRAVIS) {
    AppId = process.env.AppId;
    SecretId = process.env.SecretId;
    SecretKey = process.env.SecretKey;
}
else {
    let config = require('../config');
    AppId = config.AppId;
    SecretId = config.SecretId;
    SecretKey = config.SecretKey;
    ProxyUrl = config.ProxyUrl;
}

describe.only('ai service', () => {
    it('图片标签 - imgTagDetect', async () => {
        let imageUrl = 'https://www.ocf.berkeley.edu/~sather/wp-content/uploads/2018/01/food--1200x600.jpg';
        let imgClient1 = new ImageClient({ AppId, SecretId, SecretKey });
        let result = await imgClient1
            .setProtocol('http')
            .imgTagDetect({
                data: {
                    url: imageUrl
                }
            });

        // console.log(result.body, typeof result.body);
        let data = JSON.parse(result.body);
        expect(data).toEqual({
            'code': 0,
            'message': 'success',
            'tags': [{ 'tag_name': '盘子', 'tag_confidence': 45 }, { 'tag_name': '碗', 'tag_confidence': 23 }, { 'tag_name': '菜品', 'tag_confidence': 61 }]
        });
    }, 20000);

    it('人脸融合 - faceFuse', async () => {
        let imgClient1 = new ImageClient({ AppId, SecretId, SecretKey });
        let imgData = fs.readFileSync(path.join(__dirname, 'ponyma.jpg')).toString('base64'); // .toString('base64');
        // imgData = Buffer.from(imgData, 'base64').toString();
        // console.log(imgData);
        let result = await imgClient1
            // .setProtocol('http')
            .faceFuse({
                data: {
                    uin: '249806703',
                    project_id: '100307',
                    model_id: 'qc_100307_152854_1',
                    img_data: imgData,
                    rsp_img_type: 'url'
                }
            });

        let data = JSON.parse(result.body);
        expect(data.ret).toEqual('0');
    }, 20000);
});