import regeneratorRuntime from '../../utils/runtime/runtime';

import utils from '../../utils/util';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    detailObj: {
    },   //页面的详情数据

    isCollected: false,    //是否被收藏
  },

  goods_detail: {

  },

  /**
   * 获取云数据库中的数据
   */
  async getData(goods_id){
    //调用云函数dbQueryBy按条件查询
    const res = await utils.callFunction('dbQueryBy', {dbName: "shop_detail", queryBy: { goods_id }})

    this.goods_detail = res.result.data[0];

    //从缓存中获取商品收藏的数组
    const collection = wx.getStorageSync('collection') || [];

    //判断这个收藏数组中有没有这个具体商品的商品id 
    const isCollected = collection.some(i => i.goods_id == this.goods_detail.goods_id);

    this.setData({
      detailObj: {
        ...res.result.data[0],
      },

      isCollected
    })
  },

  /**
   * 预览图片的方法
   */
  preimg(e){
    //取得被点击的图片索引
    const index = e.currentTarget.dataset.index;
    const arr = this.goods_detail.pics.map(i => i.pic_src);
    //图片预览， urls:所有图片的链接组成的数组  current:当前的图片
    wx.previewImage({
      urls: arr,
      current: arr[index]
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  async onShow() {
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const { goods_id } = currentPage.options;  
    await this.getData(goods_id);
  },

  /**
   * 把商品加入购物车点击事件
   * 1. 先获取缓存中的购物车数据， 数组形式的
   * 2. 看看这个商品是否被加入过了， 如果被加入过了，那么数量上加1就可以了
   * 3. 没加入过那么就把这个商品加入到数组中
   * 4. 弹出提示已经加入成功
   */
  async addGoods(){
    const carArr = wx.getStorageSync('carArr') || [];

    const index = carArr.findIndex(item => item.goods_id == this.goods_detail.goods_id);

    if(index > -1){
      //证明已经存在了， 只要把数量加1就可以了
      carArr[index].num++;
    }else{
      //如果不存在
      this.goods_detail.num = 1;
      //加一個状态选中的数据
      this.goods_detail.checked = true;
      carArr.push(this.goods_detail);
    }

    wx.setStorageSync('carArr', carArr);

    await utils.showToast('success', '加入成功');
  },


  /**
   * 点击收藏功能
   */
  async collect(e){ 
    let flag = false;
    //从缓存中获取到收藏数组
    let collectArr = wx.getStorageSync('collection') || [];
    const id = this.goods_detail.goods_id;

    //如果已经收藏了，那么index的值一定大于-1
    const index = collectArr.findIndex(i => i.goods_id === id);

    if(index > -1){
      //已经是收藏状态， 那么就要取消收藏状态
      flag = false;
      //并且把商品从数组中移除
      collectArr.splice(index, 1);
      await utils.showToast('success', '取消收藏');
    }else{
      //不是收藏状态, 那么就要变成收藏状态
      flag = true;
      //把商品再放入到收藏数组中
      collectArr = [...collectArr, this.data.detailObj];
      await utils.showToast('success', '收藏成功');
    }

    //重新把数组保存到缓存中
    wx.setStorageSync('collection', collectArr);
    //并改变状态
    this.setData({
      isCollected: flag
    })
  }
})