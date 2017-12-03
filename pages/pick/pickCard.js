// pages/pick/pickCard.js
Page({

  data: {
    cardType: 'stu'
  },

  onLoad: function (options) {
    
  },

  onShow: function () {
  
  },
  switchTab(event) {
    this.setData({
      cardType: event.target.id
    })
  },
  formSubmit: function (e) {
    var that = this
    console.log('表单接收：')
    console.log(e.detail.value)
    if (e.detail.value.card) {

      let tableID_pick = getApp().globalData.tableId_pick
      let tableID_user = getApp().globalData.tableId_user
      let Pick = new wx.BaaS.TableObject(tableID_pick)
      let pick = Pick.create()
      pick.set('cardtype', that.data.cardType)
      pick.set('card', e.detail.value.card)
      pick.set('location', e.detail.value.location)
      pick.set('contact', e.detail.value.contact)
      pick.set('contact_phone', e.detail.value.contact_phone)
      
      //查询是否存在相应记录
      var query = new wx.BaaS.Query()
      var card_openid = null
      var card_phone = null
      query.compare(that.data.cardType, '=', e.detail.value.card)
      var User = new wx.BaaS.TableObject(tableID_user)
      User.setQuery(query).find().then((query_res) => {
        console.log(query_res)
        if (query_res.data.meta.total_count) {
          pick.set('card_openid', query_res.data.objects[0].openid)
          pick.set('card_phone', query_res.data.objects[0].phone)
          pick.set('card_email', query_res.data.objects[0].email)
          pick.set('card_name', query_res.data.objects[0].name)

          console.log("matched.")
        }
        pick.save().then((create_res) => {
          console.log("create res.")
          console.log(create_res.data)
          //调用短信接口
          wx.request({
            url: 'https://ddiu.site/xyk/pickCard.php', //仅为示例，并非真实的接口地址
            data: create_res.data,
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {
              console.log(res.data)
            }
          })
          wx.showModal({
            title: '信息',
            content: '提交成功！',
            showCancel: false,
            success: function () {
              wx.navigateBack()
            }
          })
        }, (err) => { })
      }, (err) => {
        // err
      })

    }                                                                                                        
    else {
      wx.showModal({
        title: '信息',
        content: '请正确填写卡号和姓名！',
        showCancel: false,
      })
    }

  },
  back() {
    wx.navigateBack()
  }

})