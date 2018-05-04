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