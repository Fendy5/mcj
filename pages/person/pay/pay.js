const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
 
    texe_num: 9,
    comment: '感谢你帮我找回宠物。',
    fee: '',
    odid: '',
    name: "",
    rec_openid: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    if(options.name=='mcj'){
      this.setData({
        name:'觅宠记',
        rec_openid:'mcj',
        odid: options.id,
      })
    }else{
      wx.request({
        url: app.server + '/index/getInfo',
        data: {
          id: options.id,
        },
        success: function (res) {
          console.log(res.data)
          that.setData({
            odid: options.id,
            name: res.data.nickname,
            rec_openid: res.data.rec_openid
          })
        },
        fail: function (res) { },
        complete: function (res) { },
      })
    }

  },
 

  texearea: function (e) {
    this.setData({
      texe_num: e.detail.cursor
    })
  },

  formSubmit: function (e) {
    var that = this;
    if (e.detail.value.fee == "") {
      wx.showToast({
        title: '请输入金额!',
        image: '/image/error.png',
        duration: 1500
      })
      setTimeout(function () {
        wx.hideToast()
      }, 2000)
    } else if (e.detail.value.comment == "") {
      wx.showToast({
        title: '留言还没填写哦',
        image: '/image/error.png',
        duration: 1500
      })
      setTimeout(function () {
        wx.hideToast()
      }, 2000)
    } else {
      wx.showLoading({
        title: '打赏中',
      })
      wx.request({
        url: app.server+'/pay/pay_ly',
        data: {
          openid: app.globalData.openid,
          fee: e.detail.value.fee
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
 
          var shid = res.data.shid
          wx.requestPayment({
            'timeStamp': res. data.timeStamp,
            'nonceStr': res.data.nonceStr,
            'package': res.data.package,
            'signType': 'MD5',
            'paySign': res. data.paySign,
             success: function (res) {
              wx.request({
                url: app.server + '/index/pay',
                header: {
                  "Content-Type": "application/x-www-form-urlencoded"
                },
                method: "POST",
                data: {
                  comments: e.detail.value.comment,
                  fee: e.detail.value.fee,
                  shid: shid,
                  openid: app.globalData.openid,
                  odid: that.data.odid,
                  rec_openid: that.data.rec_openid
                },
                success: function (res) {
                  if (res.errMsg == "request:ok"){
                    wx.showToast({
                      title: '答谢成功！',
                      image: '/image/success.png',
                      duration: 1500
                    })
                    setTimeout(function () {
                      wx.hideToast()
                    }, 2000)
                  }else{

                  }
 
                  that.formReset()
                }
              })
            },
            fail: function () {
              wx.hideLoading()
              wx.showToast({
                title: '打赏失败！',
                image: '/image/fail.png'
              })
              setTimeout(function () {
                wx.hideToast()
              }, 3000)
            }
          })
        }
      })
    }


  },

  formReset: function (e) {
    this.setData({
      fee: "",
      comment: "",
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