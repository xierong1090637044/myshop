// pages/addaddress/addaddress.js
var Bmob = require('../../utils/bmob.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    style:'',
    style1:'',
    style2:'',
    style3:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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

  input: function(){
    this.setData({
      style: 'true'
    })
  },
  outinput: function () {
    this.setData({
      style: 'false'
    })
  },
  input1: function () {
    this.setData({
      style1: 'true'
    })
  },
  outinput1: function () {
    this.setData({
      style1: 'false'
    })
  },
  input2: function () {
    this.setData({
      style2: 'true'
    })
  },
  outinput2: function () {
    this.setData({
      style2: 'false'
    })
  },
  input3: function () {
    this.setData({
      style3: 'true'
    })
  },
  outinput3: function () {
    this.setData({
      style3: 'false'
    })
  },

  //sumbit
  formSubmit: function (e) {
    var value = e.detail.value;
    var xm = value.input1;
    var dh = value.input2;
    var dq = value.input3;
    var dz = value.input4;
    var address = [xm,dh,dq,dz];

    if(dh.length<11)
    {
      wx.showModal({
        content: '请输入正确的电话号码',
        showCancel: false,
        confirmColor: '#00692f',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } 
        }
      })
    }
    else if(xm.length==0 || dq.length==0 || dz.length==0)
    {
      wx.showModal({
        content: '请输入正确的用户信息',
        showCancel: false,
        confirmColor: '#00692f',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
    }
    else{
      var currentUser = Bmob.User.current();
      var userid = currentUser.id

      var Address = Bmob.Object.extend("address");
      var query = new Bmob.Query(Address);
      query.equalTo("parsent_id", userid);
      // 查询所有数据
      query.find({
        success: function (results) {
          for (var i = 0; i < results.length; i++) {
            var object = results[i];
            wx.setStorageSync('addressid', object.id)
          }
         if(results.length ==0)
         {
           var Post = Bmob.Object.extend("_User");
           var Comment = Bmob.Object.extend("address");
           var myComment = new Comment();
           var post = new Post();
           post.id = userid;
           myComment.set("parsent", post);
           myComment.set("parsent_id", userid);
           myComment.set("address", address);
           myComment.save();
           wx.redirectTo({
             url: '/pages/choseaddress/choseaddress'
           })
           wx.showToast({
             title: '成功',
             icon: 'success',
             duration: 2000
           })
         }
         else if(results.length ==1){
           var Diary = Bmob.Object.extend("address");
           var query = new Bmob.Query(Diary);
           var addressid = wx.getStorageSync('addressid')
           query.get(addressid,{
             success: function (result) {
               var address = result.get('address');
               var address1 = result.get('address1');
               var address2 = result.get('address2');
               var addressid = wx.getStorageSync("addressid");
               if (address1 == null) {
                 query.get(addressid, {
                   success: function (result) {
                     result.addUnique('address1', xm);
                     result.addUnique('address1', dh);
                     result.addUnique('address1', dq);
                     result.addUnique('address1', dz);
                     result.save();
                     wx.redirectTo({
                       url: '/pages/choseaddress/choseaddress'
                     })
                     wx.showToast({
                       title: '成功',
                       icon: 'success',
                       duration: 2000
                     })
                   },
                 })
                 }else if(address2 == null){
                 query.get(addressid, {
                   success: function (result) {
                     result.addUnique('address2', xm);
                     result.addUnique('address2', dh);
                     result.addUnique('address2', dq);
                     result.addUnique('address2', dz);
                     result.save();
                     wx.redirectTo({
                       url: '/pages/choseaddress/choseaddress'
                     })
                     wx.showToast({
                       title: '成功',
                       icon: 'success',
                       duration: 2000
                     })
                   },
                 })
                 }else if(address ==null){
                 query.get(addressid, {
                   success: function (result) {
                     result.addUnique('address', xm);
                     result.addUnique('address', dh);
                     result.addUnique('address', dq);
                     result.addUnique('address', dz);
                     result.save();
                     wx.redirectTo({
                        url: '/pages/choseaddress/choseaddress'
                    })
                     wx.showToast({
                       title: '成功',
                       icon: 'success',
                       duration: 2000
                     })
                   },
                 })
                 }
                 else{
                 wx.showModal({
                   showCancel: false,
                   content: '暂时只能添加三个地址',
                   success: function (res) {
                     if (res.confirm) {
                       wx.redirectTo({
                         url: '/pages/choseaddress/choseaddress'
                       })
                     } 
                   }
                 });
                 }
             },
           });
         }
        },
        error: function (error) {
          console.log("查询失败: " + error.code + " " + error.message);
        }
      });
    }
  },
})