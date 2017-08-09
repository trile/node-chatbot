/* for manualy generating API key */
/* This is quite unsecured aand stupid
 * since Chatfuel JSON API doesnt allow us to change request header

  See: https://community.chatfuel.com/t/handle-api-response/1770
  --Hi guys.

  --Our JSON API does not support authentication headers at this point.
  --Please use a secret token in the URL instead if you want to make
  --sure that the request is coming from our server.
 */
var crypto = require('crypto');

/**
 * generates random string of characters i.e salt
 * @function
 * @param {number} length - Length of the random string.
 */
function genRandomString(length) {
    return crypto.randomBytes(Math.ceil(length/2))
            .toString('hex') /** convert to hexadecimal format */
            .slice(0,length);   /** return required number of characters */
};

/**
 * hash password with sha512.
 * @function
 * @param {string} password - List of required fields.
 * @param {string} salt - Data to be validated.
 */
function sha1(password, salt) {
    var hash = crypto.createHmac('sha1', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt:salt,
        passwordHash:value
    };
};

function saltHashPassword(userpassword) {
    var salt = genRandomString(16); /** Gives us salt of length 16 */
    var passwordData = sha1(userpassword, salt);
    console.log('String to be hashed = '+ userpassword);
    console.log('hashed string = '+ passwordData.passwordHash);
    console.log('nSalt = '+ passwordData.salt);
}

saltHashPassword('ovc chatbot test environment');
saltHashPassword('ovc chat bot dev environment');
saltHashPassword('ovc chat bot prod environment');
