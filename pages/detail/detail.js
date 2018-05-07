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
    details:[],
    length:6,
    display: 'none',
    mdz:'show',
    dz: 'none',
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
         console.log(result)
         var bannerImg1 = result.get("bannerImg1");
         var bannerImg2 = result.get("bannerImg2");
         var bannerImg3 = result.get("bannerImg3");

         that.setData({
           details:result,
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
           details: result,
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
         console.log("共查询到 " + results.length + " 条记录");
         var currentUser = Bmob.User.current();
         var id = currentUser.id;
         // 循环处理查询到的数据
         for (var i = 0; i < results.length; i++) {
           var object = results[i];
           console.log(object.id + ' - ' + object.get('parsent_id'));
           if (object.get('parsent_id') == id)
           {
             state1 = 'true'
           } else{ state1 ='false'}
         }
         if(state1 =='true')
         {
           that.setData({
             dz:'show',
             mdz:'none'
             })
         }
       },
       error: function (error) {
         console.log("查询失败: " + error.code + " " + error.message);
       }
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
    return {
      title: '买袜子，就找我',
      path: '/pages/test/test',
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

  //立即购买功能
  payout: function (e) {
    that = this;
    that.setData({
      radioCheckVal: ''
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