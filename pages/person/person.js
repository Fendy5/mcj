// pages/person/person.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mc_num:'',
    fee:0,
    adopt:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  person_num:function(){
    var that = this
    wx.request({
      url: app.server + '/index/person_num',
      data: {
        openid: app.globalData.openid
      },
      success: function (res) {
        that.setData({
          mc_num: res.data.pet,
          fee:res.data.fee,
          adopt:res.data.adopt
        })
      },
      fail: function (res) { },

    })
  },
  sacn:function(){
    var that=this
    wx.scanCode({
      success:function(res){
        var there=that;
        wx.showLoading({
          title: 'loading...',
        })
        wx.request({
          url: app.server+'/index/process_qrcode',
          data: {
            openid: app.globalData.openid,
            qrcode:res.result
          },
          success: function(res) {
            console.log(res.data)
            if(res.data.status=='success'){
              there.person_num()
              wx.showToast({
                title: '领取成功！',
                image: '/image/success.png',
                duration: 1500
              })
              setTimeout(function () {
                wx.hideToast()
              }, 2000)
            }else{
              wx.showToast({
                title: res.data.errMsg,
                image: '/image/fail.png',
                duration: 1500
              })
              setTimeout(function () {
                wx.hideToast()
              }, 2000)
            }
         
          },
          fail: function(res) {},
        })
        console.log(res.result)
      }
    })
  },
  onLoad: function (options) {
    this.person_num()
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
    this.person_num()
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