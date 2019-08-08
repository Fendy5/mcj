const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    detail: {},
    files: [],
    id: '',
    status: 0,
    phone: "未知",
    qrcode:0,
    button:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.setData({
      id: options.id,
       
    })
    wx.request({
      url:app.server+ '/index/getData_id',
      data: {
        id: options.id
      },
      success: function(res) {
        console.log(res.data)
        if (res.data.openid == app.globalData.openid) {
          if (res.data.fee != 0 && res.data.send_sort=='寻找宠物') {
            that.setData({
              detail: res.data,
              qrcode: 1,
              status: 1,
            })
          }else{
            that.setData({
              detail: res.data,
              status: 1,
            })
          }

        }else{
          if (res.data.fee != 0) {
            that.setData({
              detail: res.data,
              status: 1,
              button:1,
            })
          }else{
            that.setData({
              detail: res.data,
              status: 1,
              button: 1,
            })
          }
        }
        if(res.data.fee!=0){
          if (res.data.openid == app.globalData.openid) {
     
          }else{
            that.setData({
              detail: res.data,
              status: 1
            })
          }
        }else{
          that.setData({
            detail: res.data,
            status: 1
          })
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })

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

  userInfoHandler:function(e){
    var that=this
    if (e.detail.errMsg == "getUserInfo:ok") {
      wx.showLoading({
        title: 'loading...',
        mask: true,
      })
      wx.request({
        url:app.server+ '/index/updata_userinfo',
        data:{
          openid:app.globalData.openid,
          avatarUrl: e.detail.userInfo.avatarUrl,
          nickName: e.detail.userInfo.nickName,
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        method:'POST',
        success: function(res) {
          if(res.data=="OK"){
            wx.hideLoading()
            that.contact()
          }
        },
        fail: function(res) {},
      })
    }else{
      wx.showToast({
        title: '亲，要授权登录哦！',
        image: '../../image/error.png',
        duration: 1500
      })
      setTimeout(function () {
        wx.hideToast()
      }, 2000)
    }
  },
  contact: function () {
    var that = this;
    wx.showActionSheet({
      itemList: ["复制号码" , "直接拨号" ],
      success: function (res) {
        if (res.tapIndex == 0) {
          console.log(res.tapIndex)
          wx.setClipboardData({
            data: that.data.detail.phone,
            success: function (res) {
              wx.getClipboardData({
                success: function (res) {
                  console.log(res.data) // data
                }
              })
            },
          })
        } else if (res.tapIndex == 1) {
         wx.makePhoneCall({
           phoneNumber: that.data.detail.phone,
           success: function(res) {},
         })
        }
      }
    });
  },

  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.detail.image // 需要预览的图片http链接列表
    })
  },
  previewqrcode:function(e){
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.detail.qrcode_url // 需要预览的图片http链接列表
    })
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

  }
})