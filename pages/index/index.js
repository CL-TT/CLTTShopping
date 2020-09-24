import utils from '../../utils/util';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    navigate_url: '/pages/search/search',    //搜索组件要跳转的路径
    swiper_arr: [],   //轮播图的数据
    category_arr: [], //分类数据
    floor_arr: [],   //楼层数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //获取轮播图数据
    this.getSwiperData();
    //获取导航数据
    this.getCategoryData();
    //获取楼层数据
    this.getFloorData();
  },

  /**
   * 从数据库中获取轮播图数据
   */
  getSwiperData(){
    this.getData("shop_swiper", "swiper_arr");
  },

  /**
   * 从数据库中获取分类数据
   */
  getCategoryData(){
    this.getData("shop_category", "category_arr");
  },

  /**
   * 从数据库中获取楼层数据
   */
  getFloorData(){
    this.getData("shop_floor", "floor_arr");
  },

  /**
   * 获取数据, 利用云函数，调用云数据库
   * 1. collection: 传入一个集合名称
   * 2. arr:  一个数组名称
   */
  async getData(collection, arr){
    try{
      const params = {
        dbName: collection
      }
      const res = await utils.callFunction('dbQuery', params);

      this.setData({
        [arr]: res.result.data
      })
    }catch(err){
      console.log(err);
    }
  }
})