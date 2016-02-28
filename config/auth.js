// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

	'facebookAuth' : {
        'clientID'      : '597051803776009', // your App ID
        'clientSecret'  : '08d81354dbb2c2c06d15443dc5929a9c', // your App Secret
        'callbackURL'   : 'https://jiapei-todo-app.herokuapp.com/auth/facebook/callback'
    },

    'twitterAuth' : {
        'consumerKey'       : '3dxPqFr6sJbxB1PUOOLnect3i',
        'consumerSecret'    : 'G4IQkVq3GVUd1XCSkN2UzT1JKKQf1i2dCGkQiNPqw8P4Mj9G9s',
        'callbackURL'       : 'https://jiapei-login-system.herokuapp.com/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'      : '406504633631-kt32r7qmvb3hp8ckuke743aqa7mpkt2n.apps.googleusercontent.com',
        'clientSecret'  : 'yWNjeTDdruJb2INZjc1hs_Ya',
        'callbackURL'   : 'https://jiapei-login-system.herokuapp.com/auth/google/callback'
    }

};