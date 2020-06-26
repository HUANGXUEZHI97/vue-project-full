'use strict'

const { Service } = require('egg')
const path = require('path')
const fse = require('fs-extra')
const nodemailer = require('nodemailer')

const userEmail = 'Aa15917160951@126.com'
const transporter = nodemailer.createTransport({
  service: '126',
  secureConnection: true,
  auth: {
    user: userEmail,
    pass: 'HJONBAEJKJOEWLQI',
  },
})

class ToolService extends Service {
  async mergeBigFile(filePath, fileHash, size) {
    // 切片的文件夹
    const chunkDir = path.resolve(this.config.UPLOAD_DIR, fileHash)
    let chunks = await fse.readdir(chunkDir)
    // 文件排序
    chunks.sort((a, b) => a.split('-')[1] - b.split('-')[1])
    // chunks改为各个切片地址
    chunks = chunks.map(cp => path.resolve(chunkDir, cp))

    await this.mergeBigFileChunks(chunks, filePath, size)
  }
  async mergeBigFileChunks(files, dest, size) {
    // 文件路径filePath
    const pipStream = (filePath, writeStream) => new Promise(resolve => {
      // 读取文件
      const readStream = fse.createReadStream(filePath)
      readStream.on('end', () => {
        // 删除切片
        fse.unlinkSync(filePath)
        // TODO:删除切片文件夹
        resolve()
      })
      readStream.pipe(writeStream)
    })

    // 读取各个切片
    await Promise.all(
      files.map((file, index) => {
        return pipStream(file, fse.createReadStream(dest, {
          start: index * size,
          end: (index + 1) * size,
        }))
      })
    )
  }
  async sendMail(email, subject, text, html) {
    const mailOptions = {
      from: userEmail,
      cc: userEmail, // 抄送多一份给自己，避免被作为垃圾邮件
      to: email,
      subject,
      text,
      html,
    }
    try {
      await transporter.sendMail(mailOptions)
      return true
    } catch (error) {
      console.log('email error：' + error)
      return false
    }
  }
}

module.exports = ToolService
