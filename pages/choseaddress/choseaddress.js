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
    display: '' ,
    style: '',
    style1: '',
    style2: '',
    style3: '',
    showaddress:'',
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
        // 循环处理查询到的数据
          var object = results[0];
          wx.setStorageSync('object', object)
          var address = object.get('address');
          var address1 = object.get('address1');
          var address2 = object.get('address2');
          if (address ==null)
          {
            that.setData({show:'none'})
            address ='';
          } 
          if(address1==null){
            that.setData({show1:'none'})
            address1 = '';
          }
          if(address2 == null)
          {
            that.setData({show2:'none'})
            address2 = '';
          }
          if (address == '' && address1 == '' && address2 == '')
          {
            that.setData({show3:'block'})
          }
          that.setData({
            address: address,
            address1: address1,
            address2: address2
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

  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    var value1 = e.detail.value;
    wx.navigateBack({
      delta: 1
    })
    wx.setStorageSync('selectedaddr', value1)
  },

  gotourl: function(){
    wx.redirectTo({
      url: '/pages/addaddress/addaddress'
    })
  },

  remove: function(){
    var object =wx.getStorageSync('object');
    var id = object.objectId;
    var Diary = Bmob.Object.extend("address");
    var query = new Bmob.Query(Diary);
    query.get(id, {
      success: function (result) {
        result.unset('address');
        result.save();
      },
    });
    wx.showLoading({
      title: '删除中',
    })
    setTimeout(function () {
      wx.hideLoading();
      wx.redirectTo({
        url: '/pages/choseaddress/choseaddress'
      })
    }, 1000)
  },

  remove1: function () {
    var object = wx.getStorageSync('object');
    var id = object.objectId;
    var Diary = Bmob.Object.extend("address");
    var query = new Bmob.Query(Diary);
    query.get(id, {
      success: function (result) {
        result.unset('address1');
        result.save();
      },
    });
    wx.showLoading({
      title: '删除中',
    })
    setTimeout(function () {
      wx.hideLoading(),
        wx.redirectTo({
        url: '/pages/choseaddress/choseaddress'
        })
    }, 1000)
  },

  remove2: function () {
    var object = wx.getStorageSync('object');
    var id = object.objectId;
    var Diary = Bmob.Object.extend("address");
    var query = new Bmob.Query(Diary);
    query.get(id, {
      success: function (result) {
        result.unset('address2');
        result.save();
      },
    });
    wx.showLoading({
      title: '删除中',
    })
    setTimeout(function () {
      wx.hideLoading(),
        wx.redirectTo({
          url: '/pages/choseaddress/choseaddress'
        })
    }, 1000)
  },

  modify: function(){
    var object = wx.getStorageSync('object');
    wx.setStorageSync('address', 'address')
    var address = object.address;
    this.setData({
      display: 'block',
      showaddress: address,
    })
  },

  modify1: function () {
    var object = wx.getStorageSync('object');
    wx.setStorageSync('address', 'address1')
    var address = object.address1;
    this.setData({
      display: 'block',
      showaddress: address,
    })
  },

  modify2: function () {
    var object = wx.getStorageSync('object');
    wx.setStorageSync('address', 'address2')
    var address = object.address2;
    this.setData({
      display: 'block',
      showaddress: address,
    })
  },

  formSubmit: function (e) {
    var value = e.detail.value;
    var xm = value.input1;
    var dh = value.input2;
    var dq = value.input3;
    var dz = value.input4;
    var address = wx.getStorageSync('address')
    var object = wx.getStorageSync('object');
    var id = object.objectId;
    var Diary = Bmob.Object.extend("address");
    var query = new Bmob.Query(Diary);
    query.get(id, {
      success: function (result) {
        result.unset(address);
        result.addUnique(address, xm);
        result.addUnique(address, dh);
        result.addUnique(address, dq);
        result.addUnique(address, dz);
        result.save();
      },
    });
    wx.showLoading({
      title: '稍等一下',
    })
    setTimeout(function () {
      wx.hideLoading();
      wx.redirectTo({
        url: '/pages/choseaddress/choseaddress'
      })
    }, 1000)
  },

  hideview: function () {
    this.setData({
      display: "none"
    })
  },

  input: function () {
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
})