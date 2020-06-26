'use strict'

const svgCaptcha = require('svg-captcha')
const fse = require('fs-extra')
const path = require('path')
const BaseController = require('./base')

class UtilController extends BaseController {
  // 图形验证码
  async captcha() {
    const { ctx } = this

    const captcha = svgCaptcha.create({
      size: 4,
      fontSize: 50,
      width: 100,
      height: 40,
      noise: 3,
    })
    console.log('captcha => ', captcha.text)
    ctx.session.captcha = captcha.text
    ctx.response.type = 'image/svg+xml'
    ctx.body = captcha.data
  }

  // 邮箱验证码
  async sendCode() {
    const { ctx } = this
    const email = ctx.query.email
    const code = Math.random().toString().slice(2, 6)
    console.log('邮箱' + email + ',验证码：' + code)
    ctx.session.emailcode = code

    const subject = '光头登录验证码'
    const text = ''
    const html = `<h2>小光头社区</h2>
    <a href="https://github.com/HUANGXUEZHI97/vue-project-full">
      <span>${code}</span>
    </a>`

    const hasSend = await this.service.tools.sendMail(email, subject, text, html)

    if (hasSend) {
      this.message('发送成功')
    } else {
      this.error('发送失败')
    }
  }

  // 合并文件
  async mergeBigFile() {
    const { ext, size, hash } = this.ctx.request.body
    const filePath = path.resolve(this.config.UPLOAD_DIR, `${hash}.${ext}`)
    await this.ctx.service.tools.mergeBigFile(filePath, hash, size)

    this.success({
      url: `/public/${hash}.${ext}`,
    })
  }

  // 文件上传
  async uploadBigFile() {
    // 文件放在public文件夹
    const { ctx } = this
    const file = ctx.request.files[0]
    const { hash, name } = ctx.request.body

    const chunkPath = path.resolve(this.config.UPLOAD_DIR, hash)

    if (!fse.existsSync(chunkPath)) {
      fse.mkdir(chunkPath)
    }

    await fse.move(file.filepath, `${chunkPath}/${name}`)

    this.message(`${name}切片上传成功`)
    // this.success({
    //   url: `/public/${file.filename}`,
    // })
  }

  // 文件上传
  async uploadFile() {
    // 文件放在public文件夹
    const { ctx } = this
    const file = ctx.request.files[0]
    const { name } = ctx.request.body
    console.log(name, file)

    await fse.move(file.filepath, this.config.UPLOAD_DIR + '/' + file.filename)

    this.success({
      url: `/public/${file.filename}`,
    })
  }
}

module.exports = UtilController
