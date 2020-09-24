// components/GoodsList/GoodsList.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    goodsList: {
      type: Array,
      default: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  onLoad(){
    console.log(this.properties.goodsList)
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
