var app = getApp();
var that;
var bmap = require('../../utils/bmap-wx.min.js');
var Bmob = require('../../utils/bmob.js'); 
Page({
  data: {
    
  },
  onLoad: function (options) {
    
  },
  onReady: function () {
    // Do something when page ready.
  },
  onShow: function () {
  
  },

  tongzhi:function(){
    var temp = {
      "touser": "oUxY3w-fAaosEuc21uGeAJX66Nfs",
      "template_id": "-ERkPwp0ntimqH39bggQc_Pj55a18CYLpj-Ert8-c8Y",
      "url": "https://www.bmob.cn/",
      "data": {
        "first": {
          "value": "您好，Restful 失效，请登录控制台查看。",
          "color": "#c00"
        },
        "keyword1": {
          "value": "Restful 失效"
        },
        "keyword2": {
          "value": "2017-07-03 16:13:01"
        },
        "keyword3": {
          "value": "高"
        },
        "remark": {
          "value": "如果您十分钟内再次收到此信息，请及时处理。"
        }
      }
    }
    console.log(temp);
    Bmob.sendMasterMessage(temp).then(function (obj) {
      console.log('发送成功');
      console.log(obj);
    }, function (err) {
      console.log(err);
    });
  }
  
})