//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    hasUserInfo: false,
    openid:'',
    imgUrls: [
      '/image/img/1.jpg',
      '/image/img/2.jpg',
      '/image/img/3.jpg',
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    list:[],
    status:0
  },
  //事件处理函数
  bindViewTap: function() {
    this.setData({
      openid: app.globalData.openid
    })
  },
  onLoad: function () {
    this.getShowData()
  },
  filter:function(e){
    wx.showLoading({
      title: 'loading...',
    })
    var that=this
    var sort=e.currentTarget.id;
    wx.request({
      url: app.server +'/index/showData_sort',
      data: {
        sort:sort
      },
      success: function(res) {
        console.log(res.data)
        that.setData({
          list:res.data
        })
        wx.hideLoading();
      },
      fail: function(res) {},
    })
  },
  getShowData:function(){
    var that = this
    wx.request({
      url: app.server + '/index/showdata',
      data: '',
      success: function (res) {
        console.log(res.data)
        that.setData({
          list: res.data,
          status:1
        })
      },
      fail: function (res) { },
    })
  },
  onReady:function(){
   
  },
  onShow:function(){
    this.getShowData()
  },
  onPullDownRefresh:function(){
    wx.showNavigationBarLoading()
    var that = this
    wx.request({
      url: app.server + '/index/showdata',
      data: '',
      success: function (res) {
        console.log(res.data)
        that.setData({
          list: res.data
        })
        wx.hideLoading()
        wx.showToast({
          title: '刷新成功',
          image: '/image/success.png'
        })
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh();
      },
      fail: function (res) { },
    })
  }
})
