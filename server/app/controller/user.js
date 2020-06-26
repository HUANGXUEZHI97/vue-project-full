'use strict'

const md5 = require('md5')
const jwt = require('jsonwebtoken')
const BaseController = require('./base')

const HashSalt = ':kkbhub@good@123' // md5加密 盐字符串
const createRule = {
  email: { type: 'email' },
  nickname: { type: 'string' },
  passwd: { type: 'string' },
  captcha: { type: 'string' },
}

class UserController extends BaseController {

  // 登录
  async login() {
    // this.success('token')

    const { ctx, app } = this
    const { email, passwd, captcha, emailcode } = ctx.request.body

    if (captcha.toUpperCase() !== ctx.session.captcha.toUpperCase()) {
      return this.error('验证码错误')
    }
    if (emailcode !== ctx.session.emailcode) {
      return this.error('邮箱验证码错误')
    }

    const user = await ctx.model.User.findOne({
      email,
      passwd: md5(passwd + HashSalt),
    })
    if (!user) {
      return this.error('用户名密码错误')
    }

    // TODO:用户信息加密成token，返回
    const token = jwt.sign({
      _id: user._id,
      email,
    }, app.config.jwt.secret, {
      expiresIn: '168h',
    })
    this.success({ token, email, nickname: user.nickname })
  }

  // 注册
  async register() {
    const { ctx } = this
    try {
      // 校验传递的参数
      ctx.validate(createRule)
    } catch (e) {
      return this.error('参数校验失败', -1, e.errors)
    }

    const { email, passwd, captcha, nickname } = ctx.request.body
    console.log({ email, passwd, captcha, nickname })

    if (captcha.toUpperCase() !== ctx.session.captcha.toUpperCase()) {
      return this.error('验证码错误')
    }
    // 检测邮箱是否重复。（需要再mongodb内查询）
    if (await this.checkEmail(email)) {
      this.error('邮箱重复啦')
    } else {
      const ret = await ctx.model.User.create({
        email,
        nickname,
        passwd: md5(passwd + HashSalt),
      })
      if (ret._id) {
        this.message('注册成功')
      }
    }
  }

  // 检查邮箱
  async checkEmail(email) {
    const user = await this.ctx.model.User.findOne({ email })
    return user
  }

  // 校验用户是否存在
  async verify() {
    // 校验用户是否存在

  }

  // 用户信息页面
  async info() {
    // TODO:此处用户通过token访问当前页面，但是没有传递参数，
    // 需要从token解析出用户nickname和email。
    const { ctx } = this
    const { email } = ctx.state
    const user = await this.checkEmail(email)
    this.success(user)
  }
}

module.exports = UserController
