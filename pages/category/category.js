import utils from '../../utils/util';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    leftArr: [],   //左边部分的数据
    rightArr: [],  //右边部分的数据
    currentIndex: 0,  //左侧导航栏的活跃样式索引
    timeout: 3600,   //缓存数据的过期时间一个小时 3600秒
    scrollTop: 0,  //右边的滚动区域距离顶部的位置
    navigate_url: "/pages/search/search"
  },

  goodsList: [],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //1. 判断缓存中有没有数据
    const goodsList = wx.getStorageSync('goodsList');

    if(!goodsList){
      //2. 如果缓存中没有的话，那么就进行数据库请求数据
      this.getData();
    }else{
      //3. 如果缓存中有数据的话， 那么还要判断时间有没有过期
      if(Date.now() - goodsList.time >= this.timeout * 1000){
        //如果过期了，还是要重新请求
        this.getData();
      }else{
        //如果没有过期
        this.goodsList = goodsList.data;
        const left = this.goodsList.map(item => item.cat_name);
        const right = this.goodsList[0].children;
        this.setData({
          leftArr: left,
          rightArr: right
        })  
      }
    }
  },

  /**
   * 获取数据
   */
  async getData(){
    const res = await utils.callFunction('dbQuery', {dbName: "shop_goods"});

    const result = res.result.data;
    
    this.goodsList = result;
    //把数据保存到缓存中去
    wx.setStorageSync('goodsList', {time: Date.now(), data: this.goodsList});
    
    const left = this.goodsList.map(item => item.cat_name);
    const right = this.goodsList[0].children;
    this.setData({
      leftArr: left,
      rightArr: right
    })  
  },

  /**
   * 点击左边导航栏部分，改变活跃样式以及右边的展示内容
   */
  change(e){   
    const index = e.target.dataset.index

    const right = this.goodsList[index].children;

    //改变当前索引值
    this.setData({
      currentIndex: index,
      rightArr: right,
      scrollTop: 0
    })
  }
})