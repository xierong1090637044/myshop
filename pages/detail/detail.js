// pages/detail/detail.js
var bmap = require('../../utils/bmap-wx.min.js');
var Bmob = require('../../utils/bmob.js'); 
var that = this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:'',
    bannerImgs:[],
    payContent:[],
    length:6,
    display: 'none',
    mdz:'show',
    dz: 'none',
    radioCheckVal: '',
    secaddr: [],
    dzshow: '',
    addrshow: 'none',
    value: 1,
    payfor: '',
    redu:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.title)
    that =this;
     var Diary = Bmob.Object.extend("recommend");
     var query = new Bmob.Query(Diary);
     var id = options.title;
     wx.setStorageSync('good_id', id)
     query.get(options.title, {
       success: function (result) {
         var bannerImg1 = result.get("bannerImg1");
         var bannerImg2 = result.get("bannerImg2");
         var bannerImg3 = result.get("bannerImg3");

         that.setData({
           payContent:result,
           bannerImgs: [bannerImg1.url, bannerImg2.url, bannerImg3.url]
         })
       },
     });
     var Diary1 = Bmob.Object.extend("goods");
     var query = new Bmob.Query(Diary1);
     query.get(options.title, {
       success: function (result) {
         console.log(result)
         var bannerImg1 = result.get("bannerImg1");
         var bannerImg2 = result.get("bannerImg2");
         var bannerImg3 = result.get("bannerImg3");

         that.setData({
           payContent: result,
           bannerImgs: [bannerImg1.url, bannerImg2.url, bannerImg3.url]
         })
       },
     });

     //查询点赞状态
     var Diary = Bmob.Object.extend("dianzan");
     var query = new Bmob.Query(Diary);
     var state1 = '';
     query.equalTo("good_id", id);
     // 查询所有数据
     query.find({
       success: function (results) {
         var redu = results.length;
         wx.setStorageSync('redu', redu);
         var currentUser = Bmob.User.current();
         var id = currentUser.id;
         // 循环处理查询到的数据
         for (var i = 0; i < results.length; i++) {
           var object = results[i];
           if (object.get('parsent_id') == id)
           {
             state1 = 'true'
           } else{ state1 ='false'}
         }
         if(state1 =='true')
         {
           that.setData({
             dz:'show',
             mdz:'none',
             redu: results.length
             })
         }
       },
     });

     var Diary = Bmob.Object.extend("recommend");
     var query = new Bmob.Query(Diary);
     var redu = wx.getStorageSync('redu')
     query.get(id, {
       success: function (result) {
         result.set('redu', redu);
         result.save();
       },
     });

     var Diary1 = Bmob.Object.extend("goods");
     var query = new Bmob.Query(Diary1);
     query.get(id, {
       success: function (result) {
         result.set('redu', redu);
         result.save();
       },
     });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
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
        addrshow: 'block',
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var id = wx.getStorageSync('good_id')
    return {
      title: '买袜子，就找我',
      path: '/pages/detail/detail?title=' + id,
    }
  },

  //点赞
  dianzan: function (e){
    var goodid = wx.getStorageSync('good_id');
    var currentUser = Bmob.User.current();
    console.log(currentUser)
    var id = currentUser.id;
    var state ='';

    var Dianzan = Bmob.Object.extend("dianzan");
    var query = new Bmob.Query(Dianzan);
    query.equalTo('good_id', goodid);
    query.find({
      success: function (results) {
        console.log("共查询到 " + results.length + " 条记录");
        if(results.length == 0)
        {
          that.setData({ dz: 'show', mdz: 'none' });
          var Post = Bmob.Object.extend("_User");
          var Comment = Bmob.Object.extend("dianzan");
          var myComment = new Comment();
          var post = new Post();
          post.id = id;
          myComment.set("parsent", post);
          myComment.set("parsent_id", id);
          myComment.set('good_id', goodid);
          myComment.save();
        }
        else{
          for (var i = 0; i < results.length; i++) {
            var object = results[i];
            console.log(object.id + ' - ' + object.get('parsent_id'));
            if (object.get('parsent_id') == id) {
              state = 'true'
            } else { state = 'false' }
          }
          if(state =='true'){
            console.log('你已经点赞过了');
            that.setData({dz: 'show',mdz: 'none'});
          }else{
            that.setData({ dz: 'show',mdz:'none' });
            var Post = Bmob.Object.extend("_User");
            var Comment = Bmob.Object.extend("dianzan");
            var myComment = new Comment();
            var post = new Post();
            post.id = id;
            myComment.set("parsent", post);
            myComment.set("parsent_id", id);
            myComment.set('good_id', goodid);
            myComment.save();
          }
        }
      },
      error: function (error) {
        console.log("查询失败: " + error.code + " " + error.message);
      }
    });
  },

  //发送通知功能
  payout: function (e) {
    that = this;
    that.setData({
      radioCheckVal: '',
      payContent: '',
      display: "block",
    });

    var id = wx.getStorageSync('good_id');//使用event.currentTarget.dataset.XX获取内容  

    var Diary = Bmob.Object.extend("recommend");
    var query = new Bmob.Query(Diary);
    query.get(id, {
      success: function (result) {
        console.log(result)
        var price = result.get("price")
        wx.setStorageSync('type', result)
        that.setData({
          payContent: result,
          payfor: price
        })
      },
    });
    var Diary = Bmob.Object.extend("goods");
    var query = new Bmob.Query(Diary);
    query.get(id, {
      success: function (result) {
        console.log(result)
        var price = result.get("price")
        wx.setStorageSync('type', result)
        that.setData({
          payContent: result,
          payfor: price
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
    var yanse = value.yanse;
    var xm = value.xm;
    var dh = value.dh;
    var address = value.address;
    var number1 = value.number;
    var payfor = value.payfor;
    var currentUser = Bmob.User.current();
    var sessiontoken = currentUser._sessionToken;

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
  add: function (e) {
    var good_detail = wx.getStorageSync('type');
    var price = good_detail.price;
    this.setData({
      value: this.data.value + 1,
      payfor: (this.data.value + 1) * price
    })
  },

  reduce: function () {
    var good_detail = wx.getStorageSync('type');
    var price = good_detail.price;
    if (this.data.value >= 2) {
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