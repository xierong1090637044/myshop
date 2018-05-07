var Bmob = require('../../utils/bmob.js');

Page({
  data: {
    address:'',
    address1:'',
    address2:'',
    show:'',
    show1:'',
    show2:'',
    show3:'none',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var currentUser = Bmob.User.current();
    var userid = currentUser.id;
    var Diary = Bmob.Object.extend("address");
    var query = new Bmob.Query(Diary);
    query.equalTo("parsent_id", userid);
    // 查询所有数据
    query.find({
      success: function (results) {
        console.log("共查询到 " + results[0] + " 条记录");
        // 循环处理查询到的数据
          var object = results[0];
          var address = object.get('address');
          var address1 = object.get('address1');
          var address2 = object.get('address2');
          that.setData({
            address:address,
            address1:address1,
            address2:address2
          })
          if (address ==null)
          {
            that.setData({show:'none'})
          } 
          if(address1==null){
            that.setData({show1:'none'})
          }
          if(address2 == null)
          {
            that.setData({show2:'none'})
          }
          if (address == null && address1 == null && address2 == null)
          {
            that.setData({show3:'block'})
          }
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
  onShareAppMessage: function () {
  
  },

  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },

  gotourl: function(){
    wx.redirectTo({
      url: '/pages/addaddress/addaddress'
    })
  }
})