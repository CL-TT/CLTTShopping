import utils from '../../utils/util';

import regeneratorRuntime from '../../utils/runtime/runtime';
/**
 * 1. 页面加载完毕， 要看本地缓存中有没有地址
 * 2. 因为要频繁的切换页面所以把这个写在onShow的方法中
 * 3. 如果缓存中有地址的话就显示地址
 * 4. 如果没有的话就显示获取地址的按钮
 */
Page({
  /**
   * 页面的初始数据
   */
  data: {
    addressObj: {},
    carArr: [],
    allChecked: false, //全选的状态
    sumCount: 0,  //结算的商品总数量
    sumMoney: 0,  //总价钱
  },

  /**
   * 选择收货地址的方法
   */
  async chooseAddress(){
    try{
      //1. 获取权限状态
      const state = await utils.getSetting();
      //2. 判断这个权限的状态
      if(state == false){
        //state为false时，手动换起权限接口
        await utils.openSetting();
      }
      //3. 因为不管这个状态是什么，都需要调用这个访问地址的接口
      const address = await utils.chooseAddress();
      //4. 然后把这个地址保存到缓存中
      wx.setStorageSync('address', address);
    }catch(err){
      console.log(err);
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    //1. 看缓存中有没有地址信息
    let address = wx.getStorageSync('address');
    if(address){
      address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;
      this.setData({
        addressObj: address
      });
    }

    //2. 看看缓存中有没有这个购物车数组的数据， 如果有的话就动态渲染到页面上
    let carArr = wx.getStorageSync('carArr') || [];
    
    //那么就存在数据,保存到data中的数据中
    this.setData({
      carArr
    })

    //全选状态按钮
    this.checkAll(carArr);

    //结算的数量
    this.sumCount(carArr);

    //计算总价钱
    this.sumMoney();
  },

  /**
   * 全选按钮点击事件
   * 1. 点击时你要先判断这个按钮是否被选中
   * 2. 如果是选中状态那么点击过后所有的商品取消选中状态
   * 3. 如果不是选中状态那么点击过后，所有的商品都是选中状态
   */
  allCheck(e){
    let temp = this.data.carArr;
    //如果已经是选中状态,  取消所有商品的选中状态
    if(this.data.allChecked){
      temp.forEach(item => item.checked = false);
      this.setData({
        allChecked: false,
        carArr: temp
      })
    }else{  
      //如果不是选中状态， 那么所有商品都应该是选中状态
      temp.forEach(item => item.checked = true);
      this.setData({
        allChecked: true,
        carArr: temp
      })
    }
    this.sumCount(this.data.carArr);
    this.sumMoney();
  },

  /**
   * 这是点击清单中的每一个商品的CheckBox
   * 1. 如果是选中就变成非选中
   * 2. 如果是非选中就变成选中
   * @param {*} e 
   */
  oneCheck(e){
    //这是商品的索引，确认点击了哪一个商品
    const index = e.currentTarget.dataset.index;
    let temp = this.data.carArr;
    temp[index].checked = !temp[index].checked;
    this.setData({
      carArr: temp
    })
    wx.setStorageSync('carArr', temp);
    this.checkAll(this.data.carArr);
    this.sumCount(this.data.carArr);
    this.sumMoney();
  },

  /**
   * 检查是否为全选状态
   * 1. 在每一次页面加载的时候会执行一次
   * 2. 在改变清单中的商品的状态时会执行
   * 3. carArr: 传进一个购物车清单数组
   */
  checkAll(carArr){
    //看这个数组中的每一项checked属性是否都为true， 如果都为true那么全选按钮就是选中状态，如果不是就不是选中状态，并且如果数组为空也不是选中状态
    const flag = carArr.length > 0 ? carArr.every(item => item.checked) : false;

    this.setData({
      allChecked: flag
    })
  },

  /**
   * 看有多少商品被选中， 配合结算的数量来看
   */
  sumCount(carArr){
    const temp = carArr.filter(item => item.checked);
    const len = temp.length;
    this.setData({
      sumCount: len
    })
  },

  /**
   * 商品数量的增加和减少事件
   * 1. 先判断是增加还是减少事件
   * 2. 如果是增加事件，那么拿到对应的索引把对应的商品数量增加
   * 3. 如果是减少，把对应的商品数量减少
   * 4. 如果商品的数量已经是1了， 有点击了减少，那么就会弹框显示是否删除该商品
   * 5. 如果点击了确定按钮，那么就移除购物车
   * 6. 如果点击了取消按钮，那么数量还是1，不作处理
   */
  async count(e){
    const {index, count} = {...e.currentTarget.dataset};

    let temp = this.data.carArr;

    if(count === "add"){
      //如果是增加事件
      temp[index].num++;
    }else if(count === "sub"){
      if(temp[index].num === 1){
        const flag = await utils.showModal('您确定要把这件宝贝移除购物车吗？');

        if(flag){
          temp.splice(index, 1);
        }
      }else{
        temp[index].num--
      }
    }
    this.setData({
      carArr: temp
    }) 
    wx.setStorageSync('carArr', temp);
    this.sumMoney();
    this.checkAll(this.data.carArr);
    this.sumCount(this.data.carArr);
  },


  /**
   * 结算总的价钱事件
   * 1. 先过滤掉数组中没有被选中的商品
   * 2. 然后在计算每一个商品的价钱
   * 3. 每一个商品的价钱都是商品的数量*商品的单价
   */
  sumMoney(){
    let temp = this.data.carArr;

    let sumMoney = temp.filter(item => item.checked).reduce((preVal, ele) => {
      return preVal + ele.num * ele.goods_price
    }, 0);

    this.setData({
      sumMoney
    })
  },

  /**
   * 结算事件
   * 1. 如果没有地址，有商品，就提示你还没有选择收货地址
   * 2. 如果有地址，没有商品，就提示你还没有选择商品
   * 3. 如果两者都有，那么就跳转到支付页面进行支付
   * 4. 如果两个都没有， 就提示什么都没选
   */
  async payMoney(){
    //1.地址从缓存中取， 商品数据判断data中的carArr数组
    const address = wx.getStorageSync("address");
    const temp = this.data.carArr.length;
    if(address.userName && temp > 0){
      //正常支付
      wx.navigateTo({
        url: '/pages/pay/pay',
      })
    }else if(address.userName && temp == 0){  
      //没有商品
      await utils.showToast('none', '您没有选择宝贝哦！');
      return;
    }else if(!address.userName && temp > 0){
      //没有地址
      await utils.showToast('none', '您没有选择地址哦！');
      return;
    }else if(!address.userName && temp == 0){
      //都没选
      await utils.showToast('none', '您地址和宝贝都没选哦！');
      return;
    }
  }
})