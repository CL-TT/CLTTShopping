Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},  //个人信息,
    colNum: 0,  //收藏商品的数量
  },

  /**
   * 页面展示
   */
  onShow(){
    //从缓存中把个人信息获取出来
    const userInfo = wx.getStorageSync('userInfo');

    //从缓存中把收藏的商品的数量计算出来
    const colArr = wx.getStorageSync('collection');

    this.setData({
      userInfo,
      colNum: colArr.length
    })
  }
})