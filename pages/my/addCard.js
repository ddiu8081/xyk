// pages/my/addCard.js
Page({
  data: {
    imgURL:'',
    cardType: null,
    card: null,
    name: null,
    phone: null,
    email: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('get:' + options.type)
    this.setData({
      imgURL: "../../assets/images/" + options.type + ".jpg",
      cardType: options.type
    })
    this.fetchUserData(options.type)
  },

  onShow: function () {
  
  },

  formSubmit: function (e) {
    var that = this
    console.log('表单接收：')
    console.log(e.detail)
    if (e.detail.value.card && e.detail.value.name) {

      let tableID = getApp().globalData.tableId_user
      let recordID = getApp().globalData.recordID
      let User = new wx.BaaS.TableObject(tableID)
      let user = User.getWithoutData(recordID)

      console.log(that.data.cardType)
      user.set(that.data.cardType, e.detail.value.card)
      user.set('name', e.detail.value.name)
      user.set('phone', e.detail.value.phone)
      user.set('email', e.detail.value.email)
      user.set('formid', e.detail.formId)

      user.update().then((res) => {
        wx.showModal({
          title: '信息',
          content: '绑定成功！如他人捡到该卡将通过微信、短信、邮件等方式推送给您。',
          showCancel: false,
          success: function () {
            wx.navigateBack()
          }
        })
      }, (err) => {
        // err
      })
    }
    else {
      wx.showModal({
        title: '信息',
        content: '请正确填写卡号/姓名/邮箱！',
        showCancel: false,
      })
    }

  },
  fetchUserData(cardType) {
    wx.showLoading({
      title: '载入数据',
    })
    let tableID = getApp().globalData.tableId_user
    let recordID = getApp().globalData.recordID

    let Cards = new wx.BaaS.TableObject(tableID)

    Cards.get(recordID)
      .then(res => {
        console.log("fetch data:")
        console.log(res.data)
        var card = null
        switch(cardType) {
          case 'stu':
            card = res.data.stu
            break
          case 'idcard':
            card = res.data.idcard
            break
          case 'bank':
            card = res.data.bank
            break
        }
        this.setData({
          card: card,
          name: res.data.name,
          phone: res.data.phone,
          email: res.data.email
        })
        wx.hideLoading()
      })
      .catch(err => console.dir(err))
  },
  back() {
    wx.navigateBack()
  }
})