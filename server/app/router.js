'use strict'

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app
  const jwt = app.middleware.jwt({ app })
  router.get('/', controller.home.index)

  // 验证码
  router.get('/captcha', controller.util.captcha)
  router.get('/sendcode', controller.util.sendCode)
  router.post('/uploadfile', controller.util.uploadFile)
  router.post('/uploadbigfile', controller.util.uploadBigFile)
  router.post('/mergebigfile', controller.util.mergeBigFile)
  router.post('/checkfile', controller.util.checkFile)

  router.group({ name: 'user', prefix: '/user' }, router => {
    const { info, register, login, verify } = controller.user

    router.post('/register', register)
    router.post('/login', login)
    router.get('/info', jwt, info)
    router.get('/verify', verify)
  })
}
