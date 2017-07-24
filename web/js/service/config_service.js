/**
 * Created by ASUS on 2017/5/25.
 */

// var configService=angular.module("configService",[]);
// 公共数据
baseService.factory("_config", function () {
    var _this = {};
    // userType
    _this.userTypes = [
        // {
        //     type: 11,
        //     name: "车管操作员",
        //     subType: []
        // },
        // {
        //     type: 12,
        //     name: "车管维修员",
        //     subType: []
        // },
        // {
        //     type: 19,
        //     name: "车管部管理员",
        //     subType: [{type: 11, name: "车管操作员"}, {type: 12, name: "车管维修员"}]
        // },


        {
            type: 21,
            name: "仓储部操作人员",
            subType: [],
            index: 'storage_home.html'
        },

        {
            type: 29,
            name: "仓储部管理员",
            subType: [{type: 21, name: "仓储部操作人员"}],
            index: 'storage_manager.html'
        }

    ];


    // admin : {type:99,name:"admin"},
    //     storageUser: {type: 21, name: "仓储部现场人员",subType:[]},
    //     storageManager: {
    //         type: 29,
    //         name: "仓储部管理员",
    //         subType: [{type: 21, name: "仓储部现场人员"}, {type: 22, name: "仓储部操作人员"}]
    //     },
    //     truckOp : {type:11}
    // };

    // _this.userTypes = {
    //     // admin : {type:99,name:"admin"},
    //     storageUser : {type:2,name:"仓储部"}
    // };

    _this.rel_status = 1;

    // 车辆状态
    _this.car_rel_status = [
        {
            s_num: 1,
            status_text: "在库"
        },
        {
            s_num: 2,
            status_text: "出库"
        },
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
    // 正则验证
    // 电话号
    _this.mobileRegx = "^1(3[0-9]|4[57]|5[0-35-9]|7[01678]|8[0-9])\\d{8}$";
    // email
    _this.emailRegx = "^[a-z]([a-z0-9]*[-_]?[a-z0-9]+)*@([a-z0-9]*[-_]?[a-z0-9]+)+[\.][a-z]{2,3}([\.][a-z]{2})?$";
    // 密码
    _this.pwdRegx = "[a-zA-Z0-9]*";
    // 身份证
    _this.CarNoRegx="/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/";
    return _this
});
