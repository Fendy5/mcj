// pages/withdraw/withdraw.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fee: 0.00,
    fees: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: app.server+'/index/getwd',
      data: {
        openid: app.globalData.openid,
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          fee: res.data.fee
        })
        console.log(res.data.fee)
      }
    })
  },
  formSubmit: function (e) {
    var that = this
    console.log("e.detail.value.fees:" + e.detail.value.fees);
    console.log(" this.data.fee:" + this.data.fee);
    if (e.detail.value.fees.length == 0) {
      wx.showToast({
        title: '金额不可空!',
        image: '/image/error.png',
        duration: 1500
      })
      setTimeout(function () {
        wx.hideToast()
      }, 2000)
    }
    else if ((e.detail.value.fees) < 5) {
      wx.showToast({
        title: '金额低于5元!',
        image: '/image/fail.png',
        duration: 1500
      })
      setTimeout(function () {
        wx.hideToast()
      }, 2000)
    } else {
      wx.showToast({
        title: '提现中!',
        image: '/image/loading.gif',
        duration: 1500
      })
      wx.request({
        url: app.server + '/index/wd',
        data: {
          openid: app.globalData.openid,
          fee: e.detail.value.fees
        },
        method: "GET",
        success: function (res) {
          console.log("wd:")
          console.log(res)
          if (res.data == "insufficient") {
            wx.showToast({
              title: '余额不足!',
              image: '/image/fail.png',
              duration: 1500
            })
            setTimeout(function () {
              wx.hideToast()
            }, 2000)
          } else if (res.data.status == "OK") {
            wx.showToast({
              title: '提现成功!',
              image: '/image/success.png',
              duration: 1500
            })
            setTimeout(function () {
              wx.hideToast()
            }, 2000)
            that.setData({
              fees: '',
              fee: res.data.fee
            })
          } else {
            wx.showToast({
              title: '提现失败!',
              image: '/image/fail.png',
              duration: 1500
            })
            setTimeout(function () {
              wx.hideToast()
            }, 2000)
          }
        }
      })
    }
  },

  allwd: function () {
    this.setData({
      fees: this.data.fee
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