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
    shoucang:'none',
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

  //发送通知功能
  payout: function(e){
    that = this;
    that.setData({
      radioCheckVal:'',
       payContent: '',
       display: "block",
       shoucang: 'none',
       value:1,
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

  payout1: function (e) {
    that = this;
    that.setData({
      radioCheckVal: '',
      payContent: '',
      display: "none",
      shoucang: 'block',
      value: 1,
    });

    var id = e.currentTarget.dataset.id;//使用event.currentTarget.dataset.XX获取内容  
    wx.setStorageSync('good_id', id)
    var Diary = Bmob.Object.extend("recommend");
    var query = new Bmob.Query(Diary);
    query.get(id, {
      success: function (result) {
        console.log(result)
        var price = result.get("price")
        var image = result.get("images")
        wx.setStorageSync('type', result)
        wx.setStorageSync('image', image.url)
        that.setData({
          payContent: result,
          payfor: price
        })
      },
    });
  },

  //
  formSubmit1: function (e) {
    var value = e.detail.value;
    var good_detail = wx.getStorageSync('type');
    var type1 = good_detail.type;
    console.log(type1)
    var yanse = value.yanse;
    var xm = value.xm;
    var dh = value.dh;
    var address = value.address;
    var number1 = value.number;
    var payfor = value.payfor;
    var currentUser = Bmob.User.current();
    var sessiontoken = currentUser._sessionToken;
    var id = wx.getStorageSync('good_id')

    if (yanse == '' || xm == '' || dh == '' || address == '') {
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
    else {
      that = this;
      var currentUser = Bmob.User.current();
      var userid = currentUser.id;
      var objectid;
      var id = wx.getStorageSync('good_id')

      var Diary = Bmob.Object.extend("order_car");
      var query = new Bmob.Query(Diary);
      query.equalTo("userid", userid);
      query.find({
        success: function (results) {
          console.log("共查询到 " + results.length + " 条记录");
          for (var i = 0; i < results.length; i++) {
            var object = results[i];
            console.log(object.id);
          }
          var Post = Bmob.Object.extend("recommend");
          var Comment = Bmob.Object.extend("order_car");
          var image = wx.getStorageSync('image')
          var myComment = new Comment();
          var post = new Post();
          post.id = id;
          myComment.set("parsent", post);
          myComment.set("parsent_id", id);
          myComment.set("userid", userid);
          myComment.set("yanse", yanse);
          myComment.set("number", number1);
          myComment.set("money", payfor);
          myComment.set("images", image);
          myComment.set("type", type1);
          myComment.save(null,{
            success: function (result) {
              console.log(result.id);
              var Diary = Bmob.Object.extend("order_car");
              var query = new Bmob.Query(Diary);
              query.get(result.id, {
                success: function (result) {
                  result.set('name', result.id);
                  result.save();
                },
              });
            },
          });
          wx.showToast({
            title: '商品已加入购物车',
            icon: 'none',
            duration: 1500
          })
        },
      });
      this.setData({
        shoucang: "none"
      })
    }
  },

  //选好了
  formSubmit: function (e) {
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;  
    var n = timestamp * 1000;
    var date = new Date(n);
    var Y = date.getFullYear();
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var h = date.getHours(); 
    var m = date.getMinutes(); 
    var s = date.getSeconds();
    var time = (Y +'-'+ M+'-' + D+' ' + h + ":" + m + ":" + s);

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
        "touser": "oUxY3w-fAaosEuc21uGeAJX66Nfs",
        "template_id": "K9-6_Ayj4MLC2yvwY60-cq18tngJHAlqDfsOvv3D7a8",
        "url": "https://www.bmob.cn/",
        "data": {
          "first": {
            "value": "您好，有人下单了！",
          },
          "tradeDateTime": {
            "value": time
          },
          "orderType": {
            "value": type1+'  '+'颜色：' +yanse+' '+number1 +'双'
          },
          "customerInfo": {
            "value": xm
          },
          "orderItemName": {
            "value": '电话和地址:'
          },
          "orderItemData": {
            "value": dh+'  '+address
          },
          "remark": {
            "value": '应付金额：' +'                      '+ payfor,
            "color": "#a2fca2"
          }
        }
      }
      console.log(temp);
      Bmob.sendMasterMessage(temp).then(function (obj) {
        wx.showToast({
          title: '发送成功',
          icon: 'success',
          duration: 2000
        })
      },
      this.setData({
          display: "none"
        }),
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

  hideview1: function () {
    this.setData({
      shoucang: "none"
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