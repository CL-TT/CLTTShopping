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
 * 按条件查询集合中的数据
 * 1. 传入一个集合名称
 * 2. 传入条件值 queryBy是一个条件对象
 */
exports.main = async (event) => {
  const { dbName, queryBy } = event.params;
  const name = db.collection(dbName);
  return await name.where({
    ...queryBy
  }).get();
}