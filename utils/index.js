let getCards = (ctx, cb) => {

  let tableID = getApp().globalData.tableId_user
  let recordID = getApp().globalData.recordID

  let Cards = new wx.BaaS.TableObject(tableID)

  Cards.get(recordID)
    .then(res => cb(res))
    .catch(err => console.dir(err))
}