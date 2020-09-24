import regeneratorRuntime from '../../utils/runtime/runtime';
import utils from '../../utils/util';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    queryArr: [],
    isAble: true,   //是否禁用取消按钮
    value: '',  //输入框的值
  },

  timer: 0,

  /**
   * 搜索功能
   * 1. 用户在输入框输入关键字
   * 2. 检验输入的合法性
   * 3. 然后根据关键字进行请求
   * 4. 再把数据动态渲染到页面上
   * 5. 并做防抖处理
   */
  handleInput(e){
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      //获取到关键字
      const text = e.detail.value;
      //检验是否合法
      if(!text.trim()){
        //当输入框为空的时候，开启禁用, 并清空数组
        this.setData({
          isAble: true,
          queryArr: []
        })
        return;
      }
      //当输入框有值的时候，停止禁用
      this.setData({
        isAble: false
      })
      //如果合法, 就进行关键字的模糊查询
      this.getData(text);
    }, 1000);
  },

  /**
   * 取消按钮的点击事件
   * 1. 清空查询数组
   * 2. 并且清空输入框的值
   */
  cancel(){
    this.setData({
      isAble: true,
      queryArr: [],
      value: ''
    })
  },

  /**
   * 获取数据， 模糊查询
   * @param {*} text 传入一个关键字
   */
  async getData(text){
    try{
      const res = await utils.callFunction("dbQueryBy", {dbName: "shop_query", queryBy: {
        goods_name: {
          $regex: '.*' + text,
          $options: 'i' 
        }
      }});
  
      this.setData({
        queryArr: res.result.data
      })
    }catch(err){
      console.log(err);
    }
  }
})