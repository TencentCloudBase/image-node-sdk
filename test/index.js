const {
    ImageClient
} = require('../index');
const path = require('path');
const fs = require('fs');

let ProxyUrl = null;
let uin = null;

if (process.env.TRAVIS) {
    uin = process.env.uin;
}
else {
    let config = require('../config');
    ProxyUrl = config.ProxyUrl;
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
        console.log(data);
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
                    uin: uin,
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