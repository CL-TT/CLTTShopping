// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'caolei-e87ca'
});

const db = cloud.database({
  env: 'caolei-e87ca'
});

// 云函数入口函数
/**
 * 查询集合中的所有数据
 * 1. 传入一个集合名称 
 */
exports.main = async (event) => {
  const { dbName } = event.params;
  const name = db.collection(dbName);
  return await name.get();
}