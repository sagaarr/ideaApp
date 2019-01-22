if(process.env.NODE_ENV ==='production'){
  module.exports = { mongoURI: "mongodb://sagar:artist@317@ds163044.mlab.com:63044/todo"}
}else{
  module.exports = {mongoURI:'mongodb://localhost/vidjot'}
}

