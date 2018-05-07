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
        dzshow: 'none'
      })
    }
  },

  joincar: function (e) {
    that = this;
    var id = e.currentTarget.dataset.id;//使用event.currentTarget.dataset.XX获取内容  
    var objectid;

    var Diary = Bmob.Object.extend("order_car");
    var query = new Bmob.Query(Diary);
      query.equalTo("parsent", id);
      query.find({
        success: function (results) {
          console.log("共查询到 " + results.length + " 条记录");
          for (var i = 0; i < results.length; i++) {
            var object = results[i];
            console.log(object.id);
          }
          if(results.length == 0)
          {
            var Post = Bmob.Object.extend("recommend");
            var Comment = Bmob.Object.extend("order_car");
            var myComment = new Comment();
            var post = new Post();
            post.id = id;
            myComment.set("parsent", post);
            //myComment.set("quality", "1");
            myComment.save();
            wx.showToast({
              title: '商品已加入购物车',
              icon: 'none',
              duration: 1500
            })
          }
         else{
            wx.showToast({
              title: '请勿重复添加该商品',
              icon:'none',
              duration: 1500,
              mask:true
            })
          }
        },
      });
  },

  //立即购买功能
  payout: function(e){
    that = this;
    that.setData({
      radioCheckVal:''
    });

    that.setData({
      payContent: ''
    });

    var id = e.currentTarget.dataset.id;//使用event.currentTarget.dataset.XX获取内容  

    var Diary = Bmob.Object.extend("recommend");
    var query = new Bmob.Query(Diary);
    query.get(id, {
      success: function (result) {
        console.log(result)
        that.setData({
          payContent:result
        })
      },
    });
      that.setData({
        display: "block"
      })
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