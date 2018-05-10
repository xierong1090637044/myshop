var app = getApp();
var that;
var bmap = require('../../utils/bmap-wx.min.js');
var Bmob = require('../../utils/bmob.js'); 
Page({
  data: {
    array:[{
      mode: 'aspectFit',
    }],
    images: {},
    bannerImgaddr:[],
    recimages:[],
    recid:[],
    index:0,
    display: 'none' ,
    payContent:[],
    radioCheckVal:'',
    secaddr:[],
    dzshow:'',
    addrshow:'none',
    value:1,
    payfor:'',
  },
  onLoad: function (options) {
    that = this;
    var BannerImg = Bmob.Object.extend("goods");
    var query = new Bmob.Query(BannerImg);
    var imgurl = [];
    // 查询首页图片地址
    query.find({
      success: function (results) {
        console.log(results)
        // 循环处理查询到的数据
          that.setData({
            bannerImgaddr:results
          })},
    });

    //得到推荐商品的图片和价格
    var recImg = Bmob.Object.extend("recommend");
    var query = new Bmob.Query(recImg);
    var ids;
    query.find({
      success: function (results) {
        for (var i = 0; i < results.length; i++) {
          var object = results[i];
        }
        console.log(results),
          that.setData({
            recimages: results,
          })
      },
    });
  },
  onReady: function () {
    // Do something when page ready.
  },
  onShow: function () {
    //选中地址后显示出来
    var secAddr = wx.getStorageSync('selectedaddr');
    var result = secAddr.split(',');
    var address = [];
    for (var i = 0; i < result.length; i++) {
      address[i] = result[i]
    }
    console.log(address)

    if (secAddr != '') {
      that.setData({
        secaddr: address,
        dzshow: 'none',
        addrshow:'block',
      })
    }
  },

  joincar: function (e) {
    
  },

  //发送通知功能
  payout: function(e){
    that = this;
    that.setData({
      radioCheckVal:'',
       payContent: '',
       display: "block",
    });

    var id = e.currentTarget.dataset.id;//使用event.currentTarget.dataset.XX获取内容  

    var Diary = Bmob.Object.extend("recommend");
    var query = new Bmob.Query(Diary);
    query.get(id, {
      success: function (result) {
        console.log(result)
        var price = result.get("price")
        wx.setStorageSync('type', result)
        that.setData({
          payContent:result,
          payfor:price
        })
      },
    });
  },
  

  //选好了
  formSubmit: function (e) {
    var value = e.detail.value;
    var good_detail = wx.getStorageSync('type');
    var type1 = good_detail.type;
    console.log(type1)
    var yanse =value.yanse;
    var xm = value.xm;
    var dh = value.dh;
    var address = value.address;
    var number1 = value.number;
    var payfor = value.payfor;
    var currentUser = Bmob.User.current();
    var sessiontoken = currentUser._sessionToken;

    if (yanse=='' ||xm==''||dh==''||address=='')
    {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请选择正确的信息',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } 
        }
      })
    }
    else{
      var openid = wx.getStorageSync('openid')
      var temp = {
        "touser": 'os4Px5EwBtZB1SQrPWPwMl0OfinQ',
        "template_id": "3E9vv0vk8_56NIfpRT8vArDD-a1mBkgq-kSBswdcBHE",
        "page": "",
        "form_id": e.detail.formId,
        "url": 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=' + sessiontoken,
        "data": {
          "keyword1": {
            "value": payfor
          },
          "keyword2": {
            "value": type1 + yanse + number1
          },
          "keyword3": {
            "value": xm
          },
          "keyword4": {
            "value": dh
          },
          "keyword5": {
            "value": address
          }
        },
        "emphasis_keyword": "keyword1.DATA"
      }
      Bmob.sendMessage(temp).then(function (obj) {
        wx.showToast({
          title: '发送成功',
          icon: 'success',
          duration: 2000
        })
      },
        function (err) {
          console.log(err)
        });
    }
  },

  //加1减1
  add: function(e){
    var good_detail = wx.getStorageSync('type');
    var price = good_detail.price;
     this.setData({
       value: this.data.value+1,
       payfor: (this.data.value + 1)*price
     })
  },

  reduce: function(){
    var good_detail = wx.getStorageSync('type');
    var price = good_detail.price;
    if(this.data.value >= 2){
    this.setData({
      value: this.data.value - 1,
      payfor: (this.data.value - 1) * price
    })
    }
  },

  //mask隐藏或消失
  hideview: function () {
    this.setData({
      display: "none"
    })
  },

  //选取袜子颜色功能
  radioChange: function (e) {
    var radioCheckVal = e.detail.value
    this.setData({
      radioCheckVal: radioCheckVal
    })
  }
})