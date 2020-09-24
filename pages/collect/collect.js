Page({
  /**
   * 页面的初始数据
   */
  data: {
    //选项卡组件的数据
    tabArr: [
      {
        id: 1,
        value: '商品收藏',
        isActive: true
      },
      {
        id: 2,
        value: '品牌收藏',
        isActive: false
      },
      {
        id: 3,
        value: '店铺收藏',
        isActive: false
      },
      {
        id: 4,
        value: '浏览足迹',
        isActive: false
      }
    ],

    titleList: ['全部', '正在热卖', '即将上线'],

    activeIndex: 0, //活跃的索引

    colArr: [],  //收藏数组
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    //从缓存中获取收藏数组
    let colArr = wx.getStorageSync('collection');

    colArr.forEach(item => item.img_src = item.pics[0].pic_src);

    this.setData({
      colArr
    })
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
   * 改变样式
   */
  changeClass(e){
    const { index } = e.currentTarget.dataset;
    
    this.setData({
      activeIndex: index
    })
  }
})