if(process.env.NODE_ENV === 'production'){
  module.exports = {mongoURI: 'mongodb://teoalmonte:password@ds231588.mlab.com:31588/database_gen'}
} else {
  module.exports = {mongoURI: 'mongodb://localhost/dev-sample'}
}