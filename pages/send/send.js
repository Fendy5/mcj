const app = getApp();
Page({
  data: {
    date: "",
 
    recommend:'',
    date_start: "2018-01-01",
    time: "",
    files: [],
    textarea: "",
    address_component:{},
    remind:'',
    img: [],
    uploader: "",
    texe_num: 0, 
    avatarUrl:'',
    nickName:'',
    imageNumber:1,
    more:0,
    sendsort: [ "寻找宠物", "寻找失主","发布领养"],
 
 
    status:0,
    formData:{
      petname: "未填写",
      sendSort:'',
      petSort:'',
      data: '',
      time: '未填写',
      region: '',
      place: '未填写',
      detail: '',
      fee:'',
      shid:'',
      phone:''
    },
    sort: ['狗狗', '猫咪', '其它' ],
 
    region: ['广东省', '广州市', '海珠区'],
  },
  bindRegionChange: function (e) {
    this.setData({
      'formData.region': e.detail.value
    })
  },
  onLoad: function () {
 
  },
  onReady: function () {
  this.setData({
    status:1
  })
  },
location:function(){
  var that=this
  wx.getLocation({
    success: function (res) {
      var there = that;
      wx.request({
        url: app.server + '/index/getlocation',
        data: {
          lat: res.latitude,
          lon: res.longitude
        },
        success: function (res) {
          console.log(res)
          there.data.region[0] = res.data.result.address_component.province;
          there.data.region[1] = res.data.result.address_component.city;
          there.data.region[2] = res.data.result.address_component.district;
          there.setData({
            'formData.region': there.data.region,
            recommend: res.data.result.formatted_addresses.recommend
          })
        },
        fail: function (res) { },
        complete: function (res) { },
      })
      console.log(res)
    },
  })
  this.setData({
    date: that.getNowDate().data,
    time: that.getNowTime(),
    date_start: that.getNowDate().date_start
  })
},
  // changeMap: function () {
  //   var that = this;
  //   wx.chooseLocation({
  //     success: function (res) {
  //       console.log(res)
  //       that.setData({
  //         address_component: res
  //       })
  //     },
  //     fail: function (res) {
  //       console.log(res);
  //       wx.showToast({
  //         title: '自定义位置失败！',
  //         image: '../../image/fail.png'
  //       })
  //     }
  //   });
  // }, 
bindPickerChange: function (e) {
  console.log("send_sort")
  this.setData({
    index: e.detail.value
  })
},
  userInfoHandler:function(e){
    console.log(e)
    if (e.detail.errMsg =="getUserInfo:ok"){
      this.setData({
        avatarUrl: e.detail.userInfo.avatarUrl,
        nickName: e.detail.userInfo.nickName,
        status:2
      })
      this.location()
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
  formSubmit: function (e) {
    console.log("formSubmit:")
    console.log(e)
    var that = this;
    if (e.detail.value.sendSort == null) {
      wx.showToast({
        title: '发布类型没填写哦',
        image: '../../image/error.png',
        duration: 1500
      })
      setTimeout(function () {
        wx.hideToast()
      }, 2000)
    } else if (e.detail.value.petSort == null) {
      wx.showToast({
        title: '没选宠物类型呢',
        image: '../../image/error.png',
        duration: 1500
      })
      setTimeout(function () {
        wx.hideToast()
      }, 2000)
    } else if (e.detail.value.place == "") {
      wx.showToast({
        title: '请输入地点',
        image: '../../image/error.png',
        duration: 1500
      })
      setTimeout(function () {
        wx.hideToast()
      }, 2000)
    } else if (e.detail.value.phone == "") {
      wx.showToast({
        title: '请输入手机号码',
        image: '../../image/error.png',
        duration: 1500
      })
      setTimeout(function () {
        wx.hideToast()
      }, 2000)
    }else if (e.detail.value.detail == "") {
      wx.showToast({
        title: '描述还没填写哦',
        image: '../../image/error.png',
        duration: 1500
      })
      setTimeout(function () {
        wx.hideToast()
      }, 2000)
    }
     else {
      wx.showModal({
        title: '提示',
        content: '确定要发布吗？',
        success: function (res) {
          if (res.confirm) {
            that.data.formData.sendSort = e.detail.value.sendSort;
            that.data.formData.petSort = e.detail.value.petSort;
            that.data.formData.date = e.detail.value.date;
            that.data.formData.time = e.detail.value.time;
            that.data.formData.region = e.detail.value.region;
            that.data.formData.place = e.detail.value.place;
            that.data.formData.detail = e.detail.value.detail;
            that.data.formData.petname = e.detail.value.petname;
            that.data.formData.fee = e.detail.value.fee;
            that.data.formData.phone = e.detail.value.phone;
            that.uploadImage(that.data.files.length)
            
          } else {
            console.log('用户点击取消')
          }
        }
      })
    }
  },
 
  formReset: function (e) {
    this.setData({
      files: [],
      'formData.name': '',
      'formData.name.data': this.getNowDate(),
      'formData.name.time': this.getNowTime(),
      'formData.name.place': "",
      'formData.name.textarea': "",
      texe_num: 0,
      img:[]
    })
  },
  getNowDate: function () {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    var current = [];
    current['data'] = year + seperator1 + month + seperator1 + strDate;
    current['date_start'] = year + seperator1 + date.getMonth() + seperator1 + strDate;;
    return current;
  },
  getNowTime: function () {
    var date = new Date();
    var seperator1 = ":";
    var hour = date.getHours();
    var min = date.getMinutes();
    if (min.toString().length == 1) {
      min = '0' + min;
    }
    var currenttime = hour + seperator1 + min;
    return currenttime;
  },
  texearea: function (e) {
    this.setData({
      texe_num: e.detail.cursor
    })
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },

  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })
  },
  bindSendSortChange: function (e) {
    //通过用户选择的类型来改变表单的内容
    console.log(e)
    if (e.detail.value==0){
      this.setData({
        status:3
      })
    } else if (e.detail.value==1){
      this.setData({
        status: 4
      })
    }else{
      this.setData({
        status: 5
      })
    }
    this.setData({
      sendsortIndex: e.detail.value
    })
  },
  deleteImage: function (e) {
    console.log(e);
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (res) {
        if (res.confirm) {
          var files = that.data.files;
          var index = e.target.dataset.index;
          files.splice(index, 1);
          that.setData({
            files: files,
            uploader: ""
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  more_cw:function(e){
    console.log('switch2 发生 change 事件，携带值为', e.detail.value)
    if (e.detail.value==true){
      this.setData({
        more: 1
      })
    }else{
      this.setData({
        more: 0
      })
    }
    
  },
  more_zr: function (e) {

  },
  previewImage: function (e) {
    console.log("previewImage:")
    console.log(e)
    console.log("e.currentTarget.id:")
    console.log(e.currentTarget.id)
    console.log("this.data.files:")
    console.log(this.data.files)
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },
  chooseImage: function (e) {
    var that = this;
    var upnum = this.data.files.length;
    console.log("upnum:" + upnum);
    wx.chooseImage({
      count: 8 - upnum, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var there = that;
        console.log("res.tempFilePaths:");
        console.log(res.tempFilePaths);
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });
        if (that.data.files.length == 8) {
          that.setData({
            uploader: "display:none"
          });
        }
        console.log("success:" + that.data.files.length);
      }
    })
  },
  uploadImage:function(i){
    wx.showLoading({
      title: '正在上传第' + this.data.imageNumber +'张图片',
      mask: true,
    })
    var that=this
    wx.uploadFile({
      url: app.server + '/index/upload',
      filePath: this.data.files[i],
      name: 'image',
      header: {
        'content-type': 'multipart/form-data'
      }, // 设置请求的 header
      success: function(res) {
        that.setData({
          img: that.data.img.concat(res.data),
          imageNumber: that.data.imageNumber + 1
        });
        console.log("success:");
        console.log(res.data);
      },
      fail: function(res) {},
      complete: function(res) {
        wx.showLoading({
          title: '发布中',
        })
        if (0<i){
          that.uploadImage(i-1)
        }else{
          if (that.data.img == "") {
            that.setData({
              img: '"https://mcj.qiujikeji.com/public/uploads/images/default/1.png"'
            })
          }
          if (that.data.formData.petname == "") {
            that.setData({
              'formData.petname': '(未填写)'
            })
          }
          wx.hideLoading()
          console.log("fee:" + that.data.formData.fee)
          if (that.data.formData.fee == 0 || that.data.formData.fee == ''|| that.data.status==5 || that.data.formData.fee ==undefined ){
              that.setData({
                'formData.shid': 'noshid5'
              })
              that.uploadData()
            }else{
             wx.request({
               url: app.server+'/pay/pay',
               header: {
                 'content-type': 'application/x-www-form-urlencoded' // 默认值
               },
               data: {
                 img: that.data.img,
                 petname: that.data.formData.petname,
                 openid: app.globalData.openid,
                 sendSort: that.data.formData.sendSort,
                 fee: that.data.formData.fee,
                 nickName: that.data.nickName,
                 avatarUrl: that.data.avatarUrl,
                 petSort: that.data.formData.petSort,
                 date: that.data.formData.date,
                 time: that.data.formData.time,
                 place: that.data.formData.place,
                 detail: that.data.formData.detail,
                 region: that.data.formData.region[1],
                 phone: that.data.formData.phone,
               },
               method: 'POST',
               success: function(res) {
                 wx.requestPayment({
                   'timeStamp': res.data.timeStamp,
                   'nonceStr': res.data.nonceStr,
                   'package': res.data.package,
                   'signType': 'MD5',
                   'paySign': res.data.paySign,
                   'success': function (res) {
                     wx.redirectTo({
                       url: '../share/share',
                     })
                   },
                   'fail': function (res) {
                     that.formReset()
                   }
                 })
               },
               fail: function(res) {},
                
             }) 
            }
            
        }
      },
    })
  },
  uploadData:function(){
    wx.showLoading({
      title: '发布中',
    })
    if(this.data.status==5){
      var url = app.server + '/index/adopt'
    }else{
      var url = app.server + '/index/form'
    }
    wx.request({
      url: url,
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
           },
      data: {
        openid: app.globalData.openid,
        sendSort:this.data.formData.sendSort,
        fee: this.data.formData.fee,
        petSort: this.data.formData.petSort,
        date: this.data.formData.date,
        time: this.data.formData.time,
        region: this.data.formData.region[1],
        place: this.data.formData.place,
        detail: this.data.formData.detail,
        img:this.data.img,
        avatarUrl: this.data.avatarUrl,
        nickName: this.data.nickName,
        petname: this.data.formData.petname,
        shid: this.data.formData.shid,
        phone: this.data.formData.phone,
      },
      method: 'POST',
      success: function(res) {  
        wx.hideLoading()
        if(res.statusCode==200){
          wx.redirectTo({
            url: '../share/share',
          })
        }
      },
      fail: function(res) {},
      complete: function(res) {
      },
    })
  }
  
})