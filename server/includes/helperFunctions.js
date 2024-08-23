import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import validator from 'validator';

/**
 * Validates user input to the signup form
 *
 * @param {object} userInput -each the input field
 *
 * @returns {object} -errors and isValid
 */
export const validateSignUpInput = (userInput) => {
  const errors = {};
  if (!validator.isMobilePhone(userInput.phoneNumber, 'any')) {
    errors.phoneNumber = 'Phone number not valid';
  }
  if (!validator.matches(userInput.username.trim(), /^[a-zA-Z0-9_]*$/)) {
    errors.username = 'Username cannot contain special characters aside from _';
  }
  if (!validator.isLength(userInput.username.trim(), { min: 3 })) {
    errors.username = 'Username is too short';
  }
  if (!validator.isLength(userInput.password.trim(), { min: 6 })) {
    errors.password = 'Password cannot be less than 6 characters';
  }
  if (!validator.matches(userInput.fullName.trim(), /^[a-zA-Z ]*$/)) {
    errors.fullName = 'Name can only be alphabets';
  }
  if (!validator.isLength(userInput.fullName.trim(), { min: 2 })) {
    errors.fullName = 'Name is too short';
  }
  if (!validator.isEmail(userInput.email)) {
    errors.email = 'Not a valid email address';
  }
  return {
    errors,
    isValid: Object.keys(errors).length > 0 ? null : 1,
  };
};

dotenv.load();
const secret = process.env.TOKEN_SECRET;

/**
 * @description Decodes user id from token
 *
 * @param {string} token -user token
 *
 * @returns {number} -returns a number
 */
export const getId = (token) => {
  const decoded = jwt.decode(token);
  return decoded.id;
};

/**
 * @description Generates token
 *
 * @param {object} userDetails -user information
 *
 * @returns {string} -returns string
 */
export const generateToken = (userDetails) => {
  const userToken = jwt.sign(
    {
      id: userDetails.id,
      fullName: userDetails.fullName,
      email: userDetails.email,
      phoneNumber: userDetails.phoneNumber,
    },
    secret,
    { expiresIn: 60 * 60 * 24 }
  );
  return userToken;
};

/**
 *
 * @description creates an encrypted string
 *
 * @param {string} password -password string
 *
 * @returns {string} -returns hashed password
 */
export const encryptPassword = (password) => {
  let hashedPassword;
  if (typeof password === 'string') {
    const salt = bcrypt.genSaltSync(5);
    hashedPassword = bcrypt.hashSync(password, salt);
  } else {
    hashedPassword = 'Wrong input type';
  }

  return hashedPassword;
};
