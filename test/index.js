const {
    ImageClient
} = require('../index');
const path = require('path');
const fs = require('fs');

let ProxyUrl = null;
let IdCard = null;
let Name = null;

if (process.env.TRAVIS) {
    IdCard = process.env.IdCard;
    Name = process.env.Name;
}
else {
    let config = require('../config');
    ProxyUrl = config.ProxyUrl;
    process.env.TENCENTCLOUD_APPID = config.AppId;
    process.env.TENCENTCLOUD_SECRETID = config.SecretId;
    process.env.TENCENTCLOUD_SECRETKEY = config.SecretKey;
    IdCard = config.IdCard;
    Name = config.Name;
}

describe('人脸融合', () => {
    it('人脸融合 - faceFuse', async () => {
        let imgClient = new ImageClient();
        let imgData = fs.readFileSync(path.join(__dirname, '../config/ponyma.jpg')).toString('base64');

        let result = await imgClient
            .init({
                action: 'FaceFusion',
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
});

describe('人脸核身', () => {
    // it('实名核身鉴权', async () => {
    //     let imgClient = new ImageClient();
    //     let result = await imgClient
    //         .init({
    //             action: 'DetectAuth',
    //             data: {
    //                 RuleId: 1,
    //                 IdCard,
    //                 Name,
    //                 ImageBase64: fs.readFileSync(path.join(__dirname, '../config/face.jpg')).toString('base64'),
    //             }
    //         });

    //     let data = JSON.parse(result);
    //     console.log(data);
    // });

    it('获取动作顺序', async () => {
        let imgClient = new ImageClient();
        let result = await imgClient
            .init({
                action: 'GetActionSequence',
            });

        let data = JSON.parse(result);
        // console.log(data);
        expect(typeof data.ActionSequence).toBe('string');
    });

    it('获取数字验证码', async () => {
        let imgClient = new ImageClient();
        let result = await imgClient
            .init({
                action: 'GetLiveCode',
            });

        let data = JSON.parse(result);
        expect(typeof data.LiveCode).toBe('string');
        // console.log(data);
    });

    it.skip('照片人脸核身', async () => {
        let imgClient = new ImageClient();
        let result = await imgClient
            .init({
                action: 'ImageRecognition',
                data: {
                    IdCard,
                    Name,
                    ImageBase64: fs.readFileSync(path.join(__dirname, '../config/face.jpg')).toString('base64'),
                }
            });

        let data = JSON.parse(result);
        // console.log(data);
        expect(data.Sim > 80).toBeTruthy();
    });

    it.skip('活体人脸对比', async () => {
        let imgClient = new ImageClient();
        let result = await imgClient
            .init({
                action: 'LivenessCompare',
                data: {
                    VideoBase64: fs.readFileSync(path.join(__dirname, '../config/faceIdCardLiveDetectFour.mp4')).toString('base64'),
                    ImageBase64: fs.readFileSync(path.join(__dirname, '../config/face.jpg')).toString('base64'),
                    LivenessType: 'LIP',
                    ValidateData: '1234'
                }
            });

        let data = JSON.parse(result);
        // console.log(data);
        expect(data.Sim > 80).toBeTruthy();
    }, 200000);

    it.skip('活体人脸核身', async () => {
        let imgClient = new ImageClient();
        let result = await imgClient
            .init({
                action: 'LivenessRecognition',
                data: {
                    IdCard,
                    Name,
                    VideoBase64: fs.readFileSync(path.join(__dirname, '../config/faceIdCardLiveDetectFour.mp4')).toString('base64'),
                    LivenessType: 'LIP',
                    ValidateData: '1234'
                }
            });

        let data = JSON.parse(result);
        // console.log(data);
        expect(data.Sim > 80).toBeTruthy();
    }, 20000);
});

describe('人脸识别', () => {

    it('人脸检测与分析', async () => {
        let imgClient = new ImageClient();
        let result = await imgClient
            .init({
                action: 'DetectFace',
                data: {
                    Image: fs.readFileSync(path.join(__dirname, '../config/ponyma.jpg')).toString('base64'),
                }
            });

        let data = JSON.parse(result);
        // console.log(data);
        expect(Array.isArray(data.FaceInfos)).toBeTruthy();
    }, 5000);

    it('五官识别', async () => {
        let imgClient = new ImageClient();
        let result = await imgClient
            .init({
                action: 'AnalyzeFace',
                data: {
                    Mode: 0,
                    Image: fs.readFileSync(path.join(__dirname, '../config/ponyma.jpg')).toString('base64'),
                }
            });

        let data = JSON.parse(result);
        // console.log(data);
        expect(Array.isArray(data.FaceShapeSet)).toBeTruthy();
    }, 5000);

    it('人脸比对', async () => {
        let imgClient = new ImageClient();
        let result = await imgClient
            .init({
                action: 'CompareFace',
                data: {
                    ImageA: fs.readFileSync(path.join(__dirname, '../config/mengmeiqi-0001.jpeg')).toString('base64'),
                    ImageB: fs.readFileSync(path.join(__dirname, '../config/mengmeiqi-0002.jpeg')).toString('base64'),
                }
            });

        let data = JSON.parse(result);
        expect(data.Score > 80).toBeTruthy();
    }, 5000);

    it('创建人员库', async () => {
        try {
            let imgClient = new ImageClient();
            await imgClient
                .init({
                    action: 'CreateGroup',
                    data: {
                        GroupName: '孟美歧',
                        GroupId: 'mengmeiqi-01',
                        GroupExDescriptions: ['火箭少女', '宇宙少女']
                    }
                });
        }
        catch (e) {
            expect(e.code).toBe('InvalidParameterValue.GroupIdAlreadyExist');
        }
    });

    it('删除人员库', async () => {
        try {
            let imgClient = new ImageClient();
            await imgClient
                .init({
                    action: 'DeleteGroup',
                    data: {
                        GroupId: 'mengmeiqi-02'
                    }
                });
        }
        catch (e) {
            expect(e.code).toBe('InvalidParameterValue.GroupIdNotExist');
        }
    });

    it('获取人员库列表', async () => {
        let imgClient = new ImageClient();
        let result = await imgClient
            .init({
                action: 'GetGroupList',
                data: {
                    Offset: 0,
                    Limit: 10
                }
            });

        let data = JSON.parse(result);
        // console.log(data);
        expect(data.GroupInfos).toEqual(
            [
                {
                    GroupName: '孟美歧',
                    GroupId: 'mengmeiqi-01',
                    GroupExDescriptions: ['火箭少女', '宇宙少女'],
                    Tag: null
                }
            ]
        );
        expect(data.GroupNum).toBe(1);
    }, 5000);

    it('修改人员库', async () => {
        try {
            let imgClient = new ImageClient();
            await imgClient
                .init({
                    action: 'ModifyGroup',
                    data: {
                        GroupId: 'mengmeiqi-02'
                    }
                });
        }
        catch (e) {
            expect(e.code).toBe('InvalidParameterValue.GroupIdNotExist');
        }
    }, 5000);

    it('创建人员', async () => {
        try {
            let imgClient = new ImageClient();
            await imgClient
                .init({
                    action: 'CreatePerson',
                    data: {
                        GroupId: 'mengmeiqi-01',
                        PersonName: '孟美歧',
                        PersonId: 'mengmeiqi-0001',
                        Image: fs.readFileSync(path.join(__dirname, '../config/mengmeiqi-0001.jpeg')).toString('base64'),
                    }
                });
        }
        catch (e) {
            expect(e.code).toBe('InvalidParameterValue.PersonIdAlreadyExist');
        }
    }, 5000);

    it('删除人员', async () => {
        try {
            let imgClient = new ImageClient();
            await imgClient
                .init({
                    action: 'DeletePerson',
                    data: {
                        PersonId: 'mengmeiqi-0002',
                    }
                });
        }
        catch (e) {
            expect(e.code).toBe('InvalidParameterValue.PersonIdNotExist');
        }
    }, 5000);

    it('人员库删除人员', async () => {
        try {
            let imgClient = new ImageClient();
            await imgClient
                .init({
                    action: 'DeletePersonFromGroup',
                    data: {
                        GroupId: 'mengmeiqi-01',
                        PersonId: 'mengmeiqi-0002',
                    }
                });
        }
        catch (e) {
            expect(e.code).toBe('InvalidParameterValue.PersonIdNotExist');
        }
    }, 5000);

    it('获取人员列表', async () => {
        let imgClient = new ImageClient();
        let result = await imgClient
            .init({
                action: 'GetPersonList',
                data: {
                    GroupId: 'mengmeiqi-01',
                    Offset: 0,
                    Limit: 10
                }
            });
        
        let data = JSON.parse(result);
        // console.log(data);
        expect(data.PersonNum).toBe(1);
        expect(data.FaceNum > 0).toBeTruthy();
    }, 5000);

    it('获取人员列表长度', async () => {
        let imgClient = new ImageClient();
        let result = await imgClient
            .init({
                action: 'GetPersonListNum',
                data: {
                    GroupId: 'mengmeiqi-01',
                }
            });
        
        let data = JSON.parse(result);
        // console.log(data);
        expect(data.PersonNum).toBe(1);
        expect(data.FaceNum > 0).toBeTruthy();
    }, 5000);

    it('获取人员基础信息', async () => {
        let imgClient = new ImageClient();
        let result = await imgClient
            .init({
                action: 'GetPersonBaseInfo',
                data: {
                    PersonId: 'mengmeiqi-0001',
                }
            });
        
        let data = JSON.parse(result);
        // console.log(data);
        expect(data.PersonName).toBe('孟美歧');
        expect(data.Gender).toBe(0);
    }, 5000);

    it('获取人员归属信息', async () => {
        let imgClient = new ImageClient();
        let result = await imgClient
            .init({
                action: 'GetPersonGroupInfo',
                data: {
                    PersonId: 'mengmeiqi-0001',
                    Offset: 0,
                    Limit: 10
                }
            });
        
        let data = JSON.parse(result);
        // console.log(data);
        expect(data.PersonGroupInfos).toEqual([
            { GroupId: 'mengmeiqi-01', PersonExDescriptions: [] }
        ]);
    }, 5000);

    it('修改人员基础信息', async () => {
        try {
            let imgClient = new ImageClient();
            await imgClient
                .init({
                    action: 'ModifyPersonBaseInfo',
                    data: {
                        PersonId: 'mengmeiqi-0002',
                        PersonName: 'hahaha'
                    }
                });
        }
        catch (e) {
            expect(e.code).toBe('InvalidParameterValue.PersonIdNotExist');
        }
    }, 5000);

    it('修改人员描述信息', async () => {
        try {
            let imgClient = new ImageClient();
            await imgClient
                .init({
                    action: 'ModifyPersonGroupInfo',
                    data: {
                        GroupId: 'mengmeiqi-01',
                        PersonId: 'mengmeiqi-0002',
                        PersonExDescriptionInfos: [{
                            PersonExDescriptionIndex: 0,
                            PersonExDescription: 'haha'
                        }]
                    }
                });
        }
        catch (e) {
            expect(e.code).toBe('InvalidParameterValue.PersonIdNotExist');
        }
    }, 5000);

    it('增加人脸', async () => {
        try {
            let imgClient = new ImageClient();
            await imgClient.init({
                action: 'CreateFace',
                data: {
                    PersonId: 'mengmeiqi-0001',
                    Images: [
                        fs.readFileSync(path.join(__dirname, '../config/mengmeiqi-0002.jpeg')).toString('base64'),
                        fs.readFileSync(path.join(__dirname, '../config/mengmeiqi-0003.jpeg')).toString('base64')
                    ],
                }
            });
            // let data = JSON.parse(result);
            // console.log(data);
            // expect(data.SucFaceNum).toEqual(2);
        }
        catch (e) {
            expect(e.code).toBe('InvalidParameterValue.PersonFaceNumExceed');
        }

    }, 5000);

    it('删除人脸', async () => {
        let imgClient = new ImageClient();
        let result = await imgClient
            .init({
                action: 'DeleteFace',
                data: {
                    PersonId: 'mengmeiqi-0001',
                    FaceIds: ['2984444426221357938', '2984447426221357949']
                }
            });

        let data = JSON.parse(result);
        expect(data.SucDeletedNum).toEqual(0);
    }, 20000);

    it('复制人员', async () => {
        try {
            let imgClient = new ImageClient();
            await imgClient.init({
                action: 'CopyPerson',
                data: {
                    PersonId: 'mengmeiqi-0001',
                    GroupIds: ['mengmeiqi-02']
                }
            });
        }
        catch (e) {
            expect(e.code).toBe('InvalidParameterValue.GroupIdNotExist');
        }
    }, 20000);

    it('人脸搜索', async () => {
        let imgClient = new ImageClient();
        let result = await imgClient.init({
            action: 'SearchFaces',
            data: {
                GroupIds: ['mengmeiqi-01'],
                Image: fs.readFileSync(path.join(__dirname, '../config/mengmeiqi-0004.jpg')).toString('base64'),
            }
        });
        let data = JSON.parse(result);
        expect(data.Results[0].Candidates.length > 0).toBeTruthy();
    }, 20000);

    it('人脸验证', async () => {
        let imgClient = new ImageClient();
        let result = await imgClient.init({
            action: 'VerifyFace',
            data: {
                PersonId: 'mengmeiqi-0001',
                Image: fs.readFileSync(path.join(__dirname, '../config/mengmeiqi-0004.jpg')).toString('base64'),
            }
        });
        let data = JSON.parse(result);
        // console.log(data);
        expect(data.Score > 80).toBeTruthy();
    }, 20000);

    it.skip('人脸静态活体检测', async () => {
        let imgClient = new ImageClient();
        let result = await imgClient.init({
            action: 'DetectLiveFace',
            data: {
                Image: fs.readFileSync(path.join(__dirname, '../config/face.jpg')).toString('base64'),
            }
        });
        let data = JSON.parse(result);
        // console.log(data);
        expect(data.Score > 80).toBeTruthy();
    }, 20000);
});