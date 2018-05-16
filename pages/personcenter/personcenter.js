var app = getApp()
var bmap = require('../../utils/bmap-wx.min.js'); 
var Bmob = require('../../utils/bmob.js'); 
Page({
  data: {
    userInfo: {},
    weatherData: '' ,
    display:'none',
  },
  onLoad: function () {
    wx.setStorageSync('userdata', '')
    var that = this
    // 新建百度地图对象 
    var BMap = new bmap.BMapWX({
      ak: 'jyr2sMczbQ4wFZVRfWjBv68EHkqpfAnE'
    });
    var fail = function (data) {
      console.log(data)
    };
    var success = function (data) {
      var weatherData = data.currentWeather[0];
      weatherData = '城市：' + weatherData.currentCity + '\n' + '日期：' + weatherData.date + '\n' + '温度：' + weatherData.temperature + '\n' + '天气：' + weatherData.weatherDesc + '\n' + '风力：' + weatherData.wind + '\n';
      that.setData({
        weatherData: weatherData,
      });
    }
    // 发起weather请求 
    BMap.weather({
      fail: fail,
      success: success
    }); 
    
    //调用应用实例的方法获取全局数据
   /* app.getUserInfo(function (userInfo) {
      //更新数据
      console.log(userInfo)
      that.setData({
        userInfo: userInfo
      })
    });    */

    setInterval(function(){
      wx.getSetting({
        success: function (res) {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称
            wx.getUserInfo({
              success: function (res) {
                  wx.setStorageSync('userdata', res.userInfo);
                  that.setData({
                    userInfo: res.userInfo,
                  })
              }
            })
          }
        }
      })
      setTimeout(function(){
        var userdata = wx.getStorageSync('userdata');
        if (userdata == '') {
          that.setData({
            display: 'block'
          })
        }
        else {
          that.setData({
            display: 'none'
          })
        }
      },1000)
    },1000)
  },

// Do something when show.
  onShow: function (options) {
    //查询lover表和_User表,进行对比
   
  },

  contact_us:function()
  {
    wx.navigateTo({
      url: '../../pages/contact_us/contact_us',
    })
  },

  about_us:function()
  {
    wx.navigateTo({
      url: '../../pages/about_us/about_us',
    })
  },

  refuse:function()
  {
    wx.setStorageSync('userdata', 'none')
    this.setData({
      display:'none'
    })
  }

})
