//引入可以使用async和await的库
import regeneratorRuntime from '../../utils/runtime/runtime';

const db = wx.cloud.database({
  env: 'caolei-e87ca'
})

const shop_list = db.collection('shop_list');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    //选项卡组件的数据
    tabArr: [
      {
        id: 1,
        value: '综合',
        isActive: true
      },
      {
        id: 2,
        value: '销量',
        isActive: false
      },
      {
        id: 3,
        value: '价格',
        isActive: false
      }
    ],

    //从数据库中取出的商品列表的数据
    goodsList: [],

    skip: 0,   //跳过多少条数据
 
    limit: 8,  //取多少条数据

    count: 0,  //总数据量

    pageSize: 8,   //页面的总数据

    navigate_url: '/pages/search/search',   //搜索框跳转的页面
  },

  /**
   * 获取总的数据量
   * 本来应该传入一个cat_id
   */
  async getAllData(id){
    const arr = await shop_list.where({cat_id: id}).get();

    this.setData({
      count: arr.data.length
    })
  },

  /**
   * 获取分页数据
   * 本来这个cat_id不应该写死， 这个cat_id应该根据跳转页面传过来的参数而定，
   * 但因为数据繁琐，所以全部都用cat_id为1来解决
   */
  async getPageData(skip, limit = 8){
    const arr = await shop_list.where({cat_id: 1}).skip(skip).limit(limit).get();
    const data = [...this.data.goodsList, ...arr.data];
    this.setData({
      goodsList: data
    })
    //关闭下拉动作，  如果没有下拉，关闭也不会有影响
    wx.stopPullDownRefresh();
  },

  /**
   * 改变子组件的样式
   */
  changeStyle(data){
    //获取到传过来的索引值
    const index = data.detail;
    const arr = this.data.tabArr;
    
    arr.forEach((item, i) => {
      i == index? item.isActive = true : item.isActive = false
    })
    this.setData({
      tabArr: arr
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    //获取总的数据
    await this.getAllData(1);
    //获取分页数据
    await this.getPageData(this.data.skip, this.data.limit);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   * 数据已经请求完毕就关闭这个下拉动作
   */
  onPullDownRefresh: function () {
    //先把数据数组清空
    this.setData({
      goodsList: [],
      skip: 0,
      pageSize: 8
    })
    this.getPageData(this.data.skip);
  },

  /**
   * 页面上拉触底事件的处理函数
   * 看是否还有数据， 如果还有下一页数据那么就继续请求数据
   * 如果没有数据了，那么就做出没有数据的提示
   */
  onReachBottom: function () {
    //总的数据减去页面上的数据，看是否还剩数据， 如果还剩就可以请求
    const size = this.data.count - this.data.pageSize;
    if(size > 0){  //还有数据还可以请求
      this.setData({
        skip: this.data.pageSize
      })
      this.getPageData(this.data.skip);
      const count = size > 8? this.data.pageSize + 8 : this.data.pageSize + size; 
      this.setData({
        pageSize: count
      })
    }else{
      //已经没有数据了，就做出提示
      wx.showToast({
        title: '小可爱到底了哦！',
        icon: 'success'
      })
    }
  }
})