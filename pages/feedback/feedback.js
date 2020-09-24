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
        value: '体验问题',
        isActive: true
      },
      {
        id: 2,
        value: '商品商家投诉',
        isActive: false
      }
    ],

    btnArr: ['功能建议', '购买遇到问题', '性能问题', '其他'],

    imgArr: [],

    textVlaue: "",   //输入框的文本内容
  },

  tempImgArr: [],   //临时图片数组，用来接收上传至云存储返回的值

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
   * 选择图片的功能
   * 1. 调用微信的API选择图片
   */
  async chooseImg(){
    const res = await utils.chooseImage();

    this.setData({
      imgArr: [...this.data.imgArr, ...res.tempFilePaths]
    })
  },

  /**
   * 移除图片
   */
  moveImg(e){
    const { index } = e.currentTarget.dataset;

    const { imgArr } = this.data;

    imgArr.splice(index, 1);

    this.setData({
      imgArr
    })
  },

  /**
   * 文本框输入事件
   * 1. 因为小程序中没有数据的双向绑定
   * 2. 所以需要事件和数据的交互配合
   */
  handleInput(e){
    const { value } = e.detail;

    this.setData({
      textVlaue: value
    })
  },

  /**
   * 提交功能
   * 1. 先要获取到输入的值
   * 2. 检验输入的值是否合法
   * 3. 看有没有选中图片
   * 4. 如果选中了图片那么把图片保存到云存储中
   * 5. 还要把文本和图片都保存到数据库中
   */
async handleSubmit(){
    //获取到输入的值
    const { textVlaue, imgArr } = this.data;
    //进行校验
    if(!textVlaue.trim()){
      //如果不符合，进行弹框提示
      await utils.showToast('none', '您输入的格式不正确哦！');

      return;
    }

    //等待提示
    wx.showLoading({
      title: '正在提交中',
      mask: true
    })

    //如果输入的格式正确，那么看看有没有图片
    if(imgArr.length === 0){
      //那么就没有选中图片，
      const params = {
        text: textVlaue,
        imgArr: []
      }

      const result = await utils.callFunction('dbAdd', params); 

      if(result.errMsg == 'cloud.callFunction:ok'){
        wx.hideLoading();
        utils.showToast('success', '提交成功');
        this.clearData();
        setTimeout(() => {
          wx.navigateBack({
            delta: 1,
          })
        }, 1000)
      }
    }else{
      //如果选中了图片， 那么就把图片保存到云存储中
      imgArr.forEach(async (i, index) => {
        const cloudPath = Math.random() * 1000 + 1 + '.png';
        const res = await utils.uploadFile(i, cloudPath);
        this.tempImgArr.push(res)
        if(index == imgArr.length - 1){
          //在这里进行数据入库
          const params = {
            dbName: "shop_feedback",
            add: {
              text: textVlaue,
              imgArr: this.tempImgArr
            }
          }

          //调用云函数
          const result = await utils.callFunction('dbAdd', params); 

          if(result.errMsg == 'cloud.callFunction:ok'){
            //隐藏等待
            wx.hideLoading();
            //弹框提示
            utils.showToast('success', '提交成功'); 
            //清空数据
            this.clearData();
            setTimeout(() => {
              wx.navigateBack({
                delta: 1,
              })
            }, 1000)
          }
        }
      })
    }

    
  },

  /**
   * 清空数据
   */
  clearData(){
    this.setData({
      textVlaue: '',
      imgArr: []
    });

    this.tempImgArr = [];
  }
})