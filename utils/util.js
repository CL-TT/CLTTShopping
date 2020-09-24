const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 对购物车页面的逻辑代码中的选择地址代码进行优化
 */
/**
 * 获取状态
 */
const getSetting = () => {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success: (res) => {
        //获取到状态
        resolve(res.authSetting["scope.address"]);
      },
      fail: (err) => {
        reject(err);
      }
    })
  })
}

/**
 * 收货地址的方法
 */
const chooseAddress = () => {
  return new Promise((resolve, reject) => {
    wx.chooseAddress({
      success: (result) => {
        resolve(result);
      },
      fail: (err) => {
        reject(err);
      }
    })
  })
}


/**
 * 手动换起权限
 */
const openSetting = () => {
  return new Promise((resolve, reject) => {
    wx.openSetting({
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err);
      }
    })
  })
}

/**
 * 封装一下模态框弹出
 */
const showModal = (text) => {
  return new Promise ((resolve, reject) => {
    //那么就弹框显示，是否要把这个商品移除购物车
    wx.showModal({
      title: '提示',
      content: text,
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

/**
 * 封装一下showToast
 */
const showToast = (status, text) => {
  wx.showToast({
    title: text,
    icon: status,
    mask: true
  })
}

/**
 * 封装一下微信登录的方法
 */
const login = () => {
  return new Promise((resolve, reject) => {
    wx.login({
      success: (res) => {
        resolve(res.code);
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

/**
 * 选择图片的方法
 */
const chooseImage = () => {
  return new Promise((resolve, reject) => {
    wx.chooseImage({
      //一次能选图片的数量
      count: 9,
      //图片的类型
      sizeType: ['original', 'compressed'],
      //图片的来源
      sourceType: ['album', 'camera'],
      success : (res) => {
        resolve(res)
      },
      fail: (err) => {
        reject(err);
      }
    })
  })
}

/**
 * 文件上传的方法
 */
const uploadFile = (filePath, cloudPath) => {
  return new Promise((resolve, reject) => {
    wx.cloud.uploadFile({
      cloudPath,
      filePath,
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err);
      }
    })
  })
}

/**
 * 封装云函数的使用
 */
const callFunction = (name, params = {}) => {
  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name,   //云函数的名称
      data: {
        params
      },
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err);
      }
    })
  })
}

module.exports = {
  formatTime: formatTime,
  getSetting,
  chooseAddress,
  openSetting,
  showModal,
  showToast,
  login,
  chooseImage,
  uploadFile,
  callFunction
}
