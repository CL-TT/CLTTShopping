import utils from '../../utils/util';

import regeneratorRuntime from '../../utils/runtime/runtime';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    //选项卡组件的数据
    tabArr: [
      {
        id: 1,
        value: '全部',
        isActive: true
      },
      {
        id: 2,
        value: '待付款',
        isActive: false
      },
      {
        id: 3,
        value: '待收货',
        isActive: false
      },
      {
        id: 4,
        value: '退款/退货',
        isActive: false
      }
    ],

    orderList: [],   //订单数组
  },

  /**
   * 生命周期函数--监听页面显示
   * 1. 页面传参只有在onLoad的options参数中才能获得
   * 2. 所以如果需要在onShow这个生命周期函数中获得页面传过来的参数
   * 3. 就需要用到页面栈的方式， 页面栈中每一个页面对象中有options这个参数
   */
  async onShow() {
    const pages = getCurrentPages();  //获取所有页面
    //获取到当前页面
    const currentPage = pages[pages.length - 1];
    //获取到传过来的参数
    const {type} = currentPage.options;
    this.changeIndex(type);

    //进行订单数据请求， 云函数dbQuery
    const res = await utils.callFunction('dbQuery', {
      dbName: "shop_order"
    })

    this.setData({
      orderList: res.result.data
    })
  },

  /**
   * 改变子组件的样式
   */
  changeStyle(data){
    //获取到传过来的索引值
    const index = data.detail;

    this.changeIndex(index);
  },

  /**
   * 改变索引
   */
  changeIndex(index){
    const arr = this.data.tabArr;
    arr.forEach((item, i) => {
      i == index? item.isActive = true : item.isActive = false
    })
    this.setData({
      tabArr: arr
    })
  }
})

