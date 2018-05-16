var app = getApp();
var that =this;
var bmap = require('../../utils/bmap-wx.min.js');
var Bmob = require('../../utils/bmob.js'); 
Page({
  data: {
    shoucang:[],
    delete : 'none',
    nogoods : 'none',
    noaddr:'',
    address:'',
  },
  onLoad: function (options) {
    var that = this;
    var addr = wx.getStorageSync('selectedaddr');
    console.log(addr)
    if(addr == '')
    {
      that.setData({
        noaddr: 'none'
      })
    }else
    {
      that.setData({
        noaddr:'block'
      })
    }
    var result = addr.split(',');
    var address =[];
    for(var i= 0;i<result.length;i++)
    {
      address[i] = result[i]
    }
    that.setData({
      address: address
    })
  },
  onReady: function () {
    // Do something when page ready.
  },
  onShow: function () {
    var that = this;
    var currentUser = Bmob.User.current();
    var userid = currentUser.id;

    var Diary = Bmob.Object.extend("order_car");
    var query = new Bmob.Query(Diary);
    setInterval(function(){
      query.equalTo("userid", userid);
      query.include("parsent");
      // 查询所有数据
      query.find({
        success: function (results) {
          for (var i = 0; i < results.length; i++) {
            var id = results[i].id
            var Diary = Bmob.Object.extend("order_car");
            var query = new Bmob.Query(Diary);
            query.get(id, {
              success: function (result) {
                result.set('name', id);
                result.save();
              },
              error: function (object, error) {

              }
            });
          }
          that.setData({
            shoucang: results,
          });
          if(results =='')
          {
            that.setData({
              nogoods:'block'
            })
          }
          else{
            that.setData({
              nogoods: 'none'
            })
          }
        },
      });
      var addr = wx.getStorageSync('selectedaddr');
      var result = addr.split(',');
      var address = [];
      for (var i = 0; i < result.length; i++) {
        address[i] = result[i]
      }
      that.setData({
        address: address
      })
    },100)
  },

  showactions:function(e)
  {
    var that = this;
    var id = e.currentTarget.dataset.id;//使用event.currentTarget.dataset.XX获取内容 
    wx.showActionSheet({
      itemList: ['移除收藏'],
      success: function (res) {
        console.log(res.tapIndex);
        if(res.tapIndex == 0)
        {
          var Diary = Bmob.Object.extend("order_car");
          var query = new Bmob.Query(Diary);
          query.get(id, {
            success: function (object) {
              object.destroy({
                success: function (deleteObject) {
                  console.log('删除收藏成功');
                },
                error: function (object, error) {
                  console.log('删除日记失败');
                }
              });
            },
            error: function (object, error) {
              console.log("query object fail");
            }
          });
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },

  gotosc: function(e)
  {
    wx.switchTab({
      url: '/pages/test/test'
    })
  }
})