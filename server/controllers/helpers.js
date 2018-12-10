import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


//  To generate hash password

function generateHashPassword(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
}

// To compare hash password and user input password

function compareHashAndTextPassword(hashPassword, password) {
  return bcrypt.compareSync(password, hashPassword);
}

//   check for valid email input

function checkValidEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}

//  To generate new token

function generateToken(id) {
  const token = jwt.sign({ userId: id }, process.env.SECRET, { expiresIn: '7d' });
  return token;
}

export {
  generateHashPassword,
  compareHashAndTextPassword,
  checkValidEmail,
  generateToken,
};
