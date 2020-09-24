// 选项卡组件


Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //数据校验
    tabArr: {
      type: Array,
      default: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    //点击选项进行样式切换，把参数反馈给父组件
    change(e){
      const index = e.target.dataset.index;

      //子传父，通过triggerEvent来进行， 后面是传递参数
      this.triggerEvent('changeStyle', index);
    }
  }
})
