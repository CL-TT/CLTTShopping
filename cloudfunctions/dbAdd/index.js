// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'caolei-e87ca'
});

const db = cloud.database({
  env: 'caolei-e87ca'
});

// 云函数入口函数
exports.main = async (event) => {
  const { dbName } = event.params;
  const name = db.collection(dbName);

  return await name.add({
    data: {
      ...event.params.add
    }
  })
}