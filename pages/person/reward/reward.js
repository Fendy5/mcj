var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
const app = getApp();
Page({
  data: {
    tabs: ["我获得的打赏", "我发出的打赏"],
    activeIndex: 1,
    sliderOffset: 0,
    sliderLeft: 0,
    myreward: '',
    rewarded: '',
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
    wx.request({
      url: app.server+'/index/myreward',
      data:{
        openid: app.globalData.openid
      },
      success: function (res) {
        console.log("res:");
        console.log(res.data);
        that.setData({
          myreward: res.data
        })
      }
    }
    ),
      wx.request({
      url: app.server + '/index/rewarded',
      data: {
        openid: app.globalData.openid
      },
      success: function (res) {
        console.log("res:");
        console.log(res.data);
        that.setData({
          rewarded: res.data
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
});