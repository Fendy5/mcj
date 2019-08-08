//app.js
App({
  server:'https://mcj.qiujikeji.com/index',
  onLaunch: function () {
    // 展示本地存储能力
    var that=this
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    //获取openid
    wx.login({
      success:function(res){
        var there=that
        if (res.code) {
          //发起网络请求
          wx.request({
            url: that.server + '/index/getopenid',
            data: {
              code: res.code
            },
            success: function (res) {
              if(res.data.status=="OK"){
                there.globalData.openid = res.data.openid
                console.log("openid:" + there.globalData.openid)
              }else{
                console.log("获取opneid失败！")
              }
            },
            fail: function (res) { },
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    openid:''
  }
})