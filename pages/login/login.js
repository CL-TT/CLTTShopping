Page({
  /**
   * 获取用户信息
   */
  getUserInfo(e){
    const {userInfo} = e.detail;

    //把个人信息保存到缓存中
    wx.setStorageSync('userInfo', userInfo);

    //再跳转到上一层页面
    wx.navigateBack({
      delta: 1,
    })
  }
})