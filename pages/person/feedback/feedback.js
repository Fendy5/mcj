const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    texe_num: 0,
    content: '',
    tittle: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
  },

  texearea: function (e) {
    this.setData({
      texe_num: e.detail.cursor
    })
  },

  formSubmit: function (e) {
    var that = this;
    console.log("formSubmit:")
    console.log(e)
    if (e.detail.value.tittle == "") {
      wx.showToast({
        title: '请输入标题!',
        image: '../../../image/error.png',
        duration: 1500
      })
      setTimeout(function () {
        wx.hideToast()
      }, 2000)
    } else if (e.detail.value.content == "") {
      wx.showToast({
        title: '内容还没填写哦',
        image: '../../../image/error.png',
        duration: 1500
      })
      setTimeout(function () {
        wx.hideToast()
      }, 2000)
    } else {
      wx.showLoading({
        title: '发布中',
      })
      wx.request({
        url: app.server+'/index/feedback',
        header: {
          'content-type': 'application/json' // 默认值
        }, 
        data: {
          openid: app.globalData.openid,
          tittle: e.detail.value.tittle,
          content: e.detail.value.content,
        },
        success: function (res) {
           if(res.data=='ok'){
             wx.hideLoading()
             wx.showToast({
               title: '提交成功！',
               image: '../../../image/success.png'
             })
             that.formReset();
           }else{
             wx.hideLoading()
             wx.showToast({
               title: '提交失败！',
               image: '../../../image/success.png'
             })
           }
        },
        fail: function (res) {

        }
      });
    }
  },

  formReset: function (e) {
    this.setData({
      tittle: "",
      content: "",
      texe_num: 0
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