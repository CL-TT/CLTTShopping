// components/Btns/Btns.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    btnArr: {
      type: Array,
      default: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isActive: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 改变样式
     */
    changeIndex(e){
      //获取到索引
      const { index } = e.currentTarget.dataset;

      this.setData({
        isActive: index
      })
    }
  }
})
