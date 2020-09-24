import utils from '../../utils/util';

import regeneratorRuntime from '../../utils/runtime/runtime';
Page({
  /**
   * 获取授权的功能, 获取用户信息
   * 1. 目的是能获取token值
   * 2. 这个token值的获取是需要后端接口的
   * 3. 这个接口需要的参数有 encryptedData, iv, rawData, signature,  微信登录的那个code
   * 4. 现在没办法完成
   */
  async getUserInfo(e){
    try{
      const {encryptedData, iv, rawData, signature} = e.detail;

      const code = await utils.login();

      const requestParams = {
        encryptedData,
        iv,
        rawData,
        signature,
        code
      }

      //这个地方本应进行接口请求，返回token值， 但现在没办法模拟
      const token = 'AHJ875huyAHGYIO0923njYhu2635';

      wx.setStorageSync('token', token);

      //成功之后还要跳转到支付页面
      wx.navigateBack({
        delta: 1,
      })
    }catch(err){
      console.log(err);
    }
  }
})