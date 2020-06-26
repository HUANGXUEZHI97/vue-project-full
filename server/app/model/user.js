'use strict'

module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema

  const UserSchema = new Schema({
    // __id: //数据库自带id
    __v: { type: Number, select: false }, // 数据库自带
    email: { type: String, required: true },
    passwd: { type: String, required: true, select: false },
    nickname: { type: String, required: true },
    avatar: { type: String, required: false, default: '/user.png' },
  }, { timestamps: true }) // { timestamps: true } 设置起始时间和更新时间
  return mongoose.model('User', UserSchema)
}
