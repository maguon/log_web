/**
 * Created by ASUS on 2017/5/25.
 */

// 公共数据
baseService.factory("_config", function () {
    var _this = {};

    _this.userTypes = [
        {
            type: 10,
            name: "司机",
            subType: [],
            index: '',
            qr: []
        },

        {
            type: 11,
            name: "车管部操作员",
            subType: [],
            index: 'vehicle_home.html',
            qr: [{qrSrc: "../assets/images/qr_code/qr_tm_app.png"}]
        },

        {
            type: 19,
            name: "车管部管理员",
            subType: [{type: 11, name: "车管部操作员"}],
            index: 'vehicle_manager.html',
            qr: [{qrSrc: "../assets/images/qr_code/qr_tm_app.png"}]
        },

        {
            type: 21,
            name: "仓储部操作人员",
            subType: [],
            index: 'storage_home.html',
            qr: [{qrSrc: "../assets/images/qr_code/qr_storage_app.png"}]
        },

        {
            type: 29,
            name: "仓储部管理员",
            subType: [{type: 21, name: "仓储部操作人员"}],
            index: 'storage_manager.html',
            qr: [{qrSrc: "../assets/images/qr_code/qr_storage_app.png"}]
        },

        {
            type: 31,
            name: "调度操作员",
            subType: [],
            index: 'dispatch_home.html',
            qr: [{qrSrc: "../assets/images/qr_code/qr_dispatch_app.png"}, {qrSrc: "../assets/images/qr_code/qr_driver_app.png"}]
        },

        {
            type: 39,
            name: "调度管理员",
            subType: [{type: 31, name: "调度操作员"}],
            index: 'dispatch_manager.html',
            qr: [{qrSrc: "../assets/images/qr_code/qr_dispatch_app.png"}, {qrSrc: "../assets/images/qr_code/qr_driver_app.png"}]
        },

        {
            type: 41,
            name: "质损操作员",
            subType: [],
            index: 'damage_home.html',
            qr: [{qrSrc: "../assets/images/qr_code/qr_damage_app.png"}]
        },

        {
            type: 49,
            name: "质损管理员",
            subType: [{type: 41, name: "质损操作员"}],
            index: 'damage_manager.html',
            qr: [{qrSrc: "../assets/images/qr_code/qr_damage_app.png"}]
        },

        {
            type: 51,
            name: "财务操作员",
            subType: [],
            index: 'finance_home.html',
            qr: []
        },

        {
            type: 59,
            name: "财务管理员",
            subType: [{type: 51, name: "财务操作员"}],
            index: 'finance_manager.html',
            qr: []
        },
        {
            type: 61,
            name: "结算操作员",
            subType: [],
            index: 'settlement_home.html',
            qr: []
        },

        {
            type: 69,
            name: "结算管理员",
            subType: [{type: 61, name: "结算操作员"}],
            index: 'settlement_manager.html',
            qr: []
        }

    ];

    _this.rel_status = 1;

    // 调度任务状态
    _this.taskStatus = [
        {
            id: 1,
            taskStatusName: "待接受"
        },
        {
            id: 2,
            taskStatusName: "已接受"
        },
        {
            id: 3,
            taskStatusName: "执行"
        },
        {
            id: 4,
            taskStatusName: "在途"
        },
        {
            id: 8,
            taskStatusName: "取消安排"
        },
        {
            id: 9,
            taskStatusName: "已完成"
        },
        {
            id: 10,
            taskStatusName: "全部完成"
        }
    ];

    // 车辆状态
    _this.car_rel_status = [
        {
            s_num: 1,
            status_text: "在库"
        },
        {
            s_num: 2,
            status_text: "出库"
        }
    ];

    // 颜色
    _this.config_color = [
        {
            colorName: "白色",
            colorId: "FFFFFF"
        },
        {
            colorName: "黑色",
            colorId: "000000"
        },
        {
            colorName: "银色",
            colorId: "ECECEC"
        },
        {
            colorName: "金色",
            colorId: "EDB756"
        },
        {
            colorName: "红色",
            colorId: "D0011B"
        },
        {
            colorName: "蓝色",
            colorId: "0B7DD5"
        },
        {
            colorName: "灰色",
            colorId: "9B9B9B"
        },
        {
            colorName: "紫色",
            colorId: "7C24AB"
        },
        {
            colorName: "桔色",
            colorId: "FF6600"
        },
        {
            colorName: "黄色",
            colorId: "FFCC00"
        },
        {
            colorName: "绿色",
            colorId: "39A23F "
        },
        {
            colorName: "棕色",
            colorId: "794A21 "
        },
        {
            colorName: "粉色",
            colorId: "FF9CC3 "
        },
        {
            colorName: "其他",
            colorId: "CCCCCC "
        }
    ];

    // 质损环节类别
    _this.damageLinkType = [
        {id: 1, typeName: "短驳移库"},
        {id: 2, typeName: "公路运输"},
        {id: 3, typeName: "公司运输"},
        {id: 4, typeName: "驾驶员漏检"},
        {id: 5, typeName: "交通事故"},
        {id: 6, typeName: "前端责任"},
        {id: 7, typeName: "安盛船务责任"},
        {id: 8, typeName: "安盛判定"},
        {id: 9, typeName: "通用判定"},
        {id: 10, typeName: "驾驶员违规操作"},
        {id: 11, typeName: "长春办收发车"},
        {id: 12, typeName: "沈阳办收发车"},
        {id: 13, typeName: "天津办收发车"},
        {id: 14, typeName: "PDI漏检"},
        {id: 15, typeName: "大连现场收发车"},
        {id: 16, typeName: "运输途中遭人为破坏"}

        ];

    // 质损类型
    _this.damageType = [
        {id: 1, typeLevel: "A级"},
        {id: 2, typeLevel: "B级"},
        {id: 3, typeLevel: "C级"},
        {id: 4, typeLevel: "D级"},
        {id: 6, typeLevel: "F级"}
    ];

    // 驾驶类型
    _this.licenseType = [
        {id: "1", typeName: "A1"},
        {id: "2", typeName: "A2"},
        {id: "3", typeName: "A3"},
        {id: "4", typeName: "B1"},
        {id: "5", typeName: "B2"},
        {id: "6", typeName: "C1"},
        {id: "7", typeName: "C2"},
        {id: "8", typeName: "C3"}
    ];

    //模块
    _this.appType = [
        {app: "0", typeName: "司机"},
        {app: "1", typeName: "物联存车"},
        {app: "2", typeName: "车辆管理"},
        {app: "3", typeName: "调度"},
        {app: "4", typeName: "质量监管"}
    ];
    //经销商类型
    _this.receiveType = [
        {id: "1", typeName: "4S店"},
        {id: "2", typeName: "大客户"},
        {id: "3", typeName: "临时停放地"}
    ];

    // 重载衡量标准
    _this.heavyLoad = 6;


    // 正则验证
    // 电话号
    _this.mobileRegx = "^1(3[0-9]|4[57]|5[0-35-9]|7[01678]|8[0-9])\\d{8}$";
    // email
    _this.emailRegx = "^[a-z]([a-z0-9]*[-_]?[a-z0-9]+)*@([a-z0-9]*[-_]?[a-z0-9]+)+[\.][a-z]{2,3}([\.][a-z]{2})?$";
    // 密码
    _this.pwdRegx = "[a-zA-Z0-9]*";
    // 身份证
    _this.CarNoRegx = "/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/";
    return _this
});
