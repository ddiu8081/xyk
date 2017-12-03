//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    stu: null,
    idcard: null,
    bank: null
  },
  onLoad: function () {
    wx.BaaS.login(false).then((res) => {
      console.log('ok')
      console.log(res)

      //查询表中是否有该openid
      let tableID = getApp().globalData.tableId_user
      let openid = res.openid
      var query = new wx.BaaS.Query()
      query.compare('openid', '=', openid)
      var User = new wx.BaaS.TableObject(tableID)
      User.setQuery(query).find().then((check_res) => {
        // success
        console.log(check_res.data)
        if (check_res.data.meta.total_count) {
          getApp().globalData.recordID = check_res.data.objects[0].id;
          console.log("already exists.")
        }
        else {
          console.log("created new.")
          let user = User.create()
          user.set('openid', openid)
          user.save().then((create_res) => {
            getApp().globalData.recordID = create_res.data.id;
          }, (err) => { })
        }
        this.fetchCardList()
      }, (err) => {
        // err
        wx.showModal({
          title: '错误',
          content: '初始化失败！',
          showCancel: false,
        })
      })
    }, (err) => {
      console.log('error')
      wx.showModal({
        title: '错误',
        content: '初始化失败！',
        showCancel: false,
      })
    })
  },
  onShow: function () {
    this.fetchCardList()
  },
  fetchCardList() {
    wx.showLoading({
      title: '初始化',
    })
    let tableID = getApp().globalData.tableId_user
    let recordID = getApp().globalData.recordID

    let Cards = new wx.BaaS.TableObject(tableID)

    Cards.get(recordID)
      .then(res => {
        this.setData({
          stu: res.data.stu,
          idcard: res.data.idcard,
          bank: res.data.bank
        })
        wx.hideLoading()
      })
      .catch(err => console.dir(err))
  }
})
