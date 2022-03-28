module.exports = {
  ENV: {
    PORT: process.env.PORT || 8080,
    PERS: process.env.PERS || 'mongo', //memory//filesystem//mongo//firebase//mariadb//sqlite
  }
}