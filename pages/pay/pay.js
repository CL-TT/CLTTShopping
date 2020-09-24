import utils from '../../utils/util';

import regeneratorRuntime from '../../utils/runtime/runtime';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    addressObj: {},  //保存收货地址的
    carArr: [],     //商品数组, 是过滤后的数组
    sumCount: 0,  //结算的商品总数量
    sumMoney: 0,  //总价钱
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    //1. 看缓存中有没有地址信息
    let address = wx.getStorageSync('address');
    if(address){
      address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;
      this.setData({
        addressObj: address
      });
    }

    //2. 看看缓存中有没有这个购物车数组的数据， 如果有的话就动态渲染到页面上， 这里只渲染checked为true的数据
    let carArr = wx.getStorageSync('carArr') || [];
    if(carArr && carArr.length > 0){
      carArr = carArr.filter(item => item.checked);
      //那么就存在数据,保存到data中的数据中
      this.setData({
        carArr
      })
    }

    //结算的数量
    this.sumCount(carArr);

    //计算总价钱
    this.sumMoney();
  },

  /**
   * 看有多少商品被选中， 配合结算的数量来看
   */
  sumCount(carArr){
    const temp = carArr.filter(item => item.checked);
    const len = temp.length;
    this.setData({
      sumCount: len
    })
  },

  /**
   * 结算总的价钱事件
   * 1. 先过滤掉数组中没有被选中的商品
   * 2. 然后在计算每一个商品的价钱
   * 3. 每一个商品的价钱都是商品的数量*商品的单价
   */
  sumMoney(){
    let temp = this.data.carArr;

    let sumMoney = temp.filter(item => item.checked).reduce((preVal, ele) => {
      return preVal + ele.num * ele.goods_price
    }, 0);

    this.setData({
      sumMoney
    })
  },

  /**
   * 支付功能
   * 1. 先看缓存中有没有token值
   * 2. 如果没有的话跳转到授权页面, 获取到token值
   * 3. 如果有的话， 那么就进行创建订单
   */
  async payMoney(){
    const token = wx.getStorageSync('token');

    if(token){
      //如果存在, 创建订单， 需要的参数
      //请求头参数：token
      //请求体参数： order_price: 订单总价格， order_address: 收货地址， goods: 订单数组
      //goods: goods_id: 商品id,  goods_num: 购买的数量， goods_price: 商品单价

      //先从缓存中获取到token值
      const token = wx.getStorageSync('token');

      const goodsArr = [];
      const carArr = this.data.carArr;
      carArr.forEach(item => {
        goodsArr.push({
          goods_id: item.goods_id,
          goods_price: item.goods_price,
          goods_num: item.num
        })
      })

      //请求体数据
      const requestBody = {
        order_price: this.data.sumMoney,
        order_address: this.data.addressObj.all,
        goodsArr
      }

      //这里本应该发送请求，获取到订单编号
      //模拟订单编号
      const order_id = Math.ceil(Math.random() * 10000000000) + '';

      //进行预支付，同样需要进行后台请求， 请求参数是 请求头token， 请求体订单标号
      //返回值是 nonceStr, package, paySign, signType, timeStamp

      //然后进行真正的支付调用wx.requestPayment
      const isPay = await utils.showModal('您确定要支付吗？');

      if(isPay){
        //如果确定支付
        // const arr = wx.getStorageSync('orderList') || [];
        const obj = {
          order_id,
          status: 'success',
          time: utils.formatTime(new Date()),
          ...requestBody
        }
        // const temp = [obj, ...arr];
        // wx.setStorageSync('orderList', temp);
        await utils.showToast('success', '支付成功');

        //把支付过的商品移除购物车
        this.moveGoods();

        //把数据加入到云数据库中, 调用云函数dbAdd
        await utils.callFunction('dbAdd', {dbName: "shop_order",
          add: {
            ...obj
          }
        })
      }else{
        //不支付
      }
    }else{
      //如果不存在，跳转到授权页面
      wx.navigateTo({
        url: '/pages/auth/auth',
      })
    }
    
  },

  /**
   * 支付过后， 把商品移除购物车
   */
  moveGoods(){
    let car_arr = wx.getStorageSync('carArr');
    //保留checked状态为false的商品
    car_arr = car_arr.filter(item => !item.checked);
    wx.setStorageSync('carArr', car_arr);
  }
})