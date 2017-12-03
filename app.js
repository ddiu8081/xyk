//app.js
App({
  onLaunch: function () {
    var that = this
    // require SDK
    require('./sdk-v1.1.1.js')
    // 初始化 SDK
    let clientID = '7039ef39a836fd8e288e'
    wx.BaaS.init(clientID)
  },
  globalData: {
    recordID: null,
    tableId_user: 3511,
    tableId_pick: 3702
  }
})