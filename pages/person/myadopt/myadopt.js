var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
const app = getApp();
Page({
  data: {
    tabs: ["我领养的", "我发布的"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    myadopt_cw: '',
    myadopt_zr: '',
    remind: '加载中'
  },
  onLoad: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    this.myadopt_cw();
    this.myadopt_zr();
  },
  myadopt_cw: function () {
    var that = this
    wx.request({
      url: app.server + '/index/myadopt_cw',
      data: {
        openid: app.globalData.openid
      },
      success: function (res) {
        console.log("res:");
        console.log(res.data);
        that.setData({
          myadopt_cw: res.data
        })
      }
    }
    )
  },
  myadopt_zr: function () {
    var that = this
    wx.request({
      url: app.server + '/index/myadopt_zr',
      data: {
        openid: app.globalData.openid
      },
      success: function (res) {
        console.log("res:");
        console.log(res.data);
        that.setData({
          myadopt_zr: res.data
        })
      }
    })
  },
  onReady: function () {
    var _this = this;
    setTimeout(function () {
      _this.setData({
        remind: ''
      });
    }, 1000);
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  cancel: function (e) {
    var that = this
    var id = e.currentTarget.id
    var sort = e.currentTarget.dataset.sort
    wx.showModal({
      title: '提示',
      content: '确定要取消吗？',
      success: function (res) {
 
        if (res.confirm) {
          wx.showLoading({
            title: 'loading',
          })
          wx.request({
            url: app.server + '/index/cancel_ly',
            data: {
              id: id,
              sort:sort
            },
            success: function (res) {
              if (res.statusCode == 200) {
                if (sort == 'myadopt_cw') {
                  that.myadopt_cw()
                } else {
                  that.myadopt_zr()
                }
                wx.showToast({
                  title: '取消成功',
                  image: '/image/success.png',
                  duration: 1500
                })
                setTimeout(function () {
                  wx.hideToast()
                }, 2000)
              }
            },
            fail: function (res) { },
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  reward: function (e) {
    var that = this;
    wx.showActionSheet({
      itemList: ["答谢 Ta", "资助平台运营"],
      success: function (res) {
        console.log(that.data.tail)
        if (res.tapIndex == 0) {
          wx.navigateTo({
            url: '../pay/pay?id=' + e.currentTarget.id + '&name=123',
            success: function (res) { },
            fail: function (res) { },
          })
        } else if (res.tapIndex == 1) {
          wx.navigateTo({
            url: '../pay/pay?id=' + e.currentTarget.id + '&name=mcj',
            success: function (res) { },
            fail: function (res) { },
          })
        }
      }
    });
  },
  delete: function (e) {
    var that = this
    var id = e.currentTarget.id
    var sort = e.currentTarget.dataset.sort
    console.log("sort:" + sort)
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (res) {

        if (res.confirm) {
          wx.showLoading({
            title: 'loading',
          })
          wx.request({
            url: app.server + '/index/delete_ly',
            data: {
              id: id,
            },
            success: function (res) {
              if (res.statusCode == 200) {
                if (sort == 'myadopt_cw') {
                  that.myadopt_cw()
                } else {
                  that.myadopt_zr()
                }
                wx.showToast({
                  title: '删除成功',
                  image: '/image/success.png',
                  duration: 1500
                })
                setTimeout(function () {
                  wx.hideToast()
                }, 2000)
              }
            },
            fail: function (res) { },
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  confirm:function(e){
    var that=this
    var id = e.currentTarget.id
    wx.showModal({
      title: '温馨提示',
      content: '确认已经收到宠物了吗？',
      showCancel: true,
      cancelText: '没有啦',
      cancelColor: '',
      confirmText: '收到了呢',
      confirmColor: '',
      success: function(res) {
        wx.showLoading({
          title: 'loading',
        })
        if (res.confirm) {
           wx.request({
             url:app.server+ '/index/confirm',
             data: {
               id:id
             },
             success: function(res) {
               console.log(res.data)
               that.myadopt_cw()
               wx.showToast({
                 title: '确认成功',
                 image: '/image/success.png',
                 duration: 1500
               })
               setTimeout(function () {
                 wx.hideToast()
               }, 2000)
             },
             fail: function(res) {},
             complete: function(res) {},
           })
        }else{
          console.log("cancel")
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  }
});