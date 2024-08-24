import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const { Op } = require('sequelize');
import models from '../models';
import transporter from '../config/transporter';
import { validateSignUpInput } from '../includes/helperFunctions';
import {
  getId,
  generateToken,
  encryptPassword,
} from '../includes/helperFunctions';

const { APP_URL } = process.env;
const { groupMembers, users } = models;
const secret = process.env.TOKEN_SECRET;

/**
 * @description Signup new user
 *
 * @param {object} req -request object
 * @param {object} res -response object
 *
 * @returns {void} -returns nothing
 */
export const signUp = (req, res) => {
  const { username, password, email, fullName, phoneNumber } = req.body;
  const { errors, isValid } = validateSignUpInput(req.body);
  if (!isValid) {
    res.status(400).json({ error: errors });
  } else {
    users
      .create({
        username,
        password,
        email,
        fullName,
        phoneNumber,
      })
      .then((user) => {
        groupMembers
          .create({
            userId: user.id,
            groupId: 1,
            addedBy: 1,
          })
          .then(() => {
            const userToken = generateToken(user);
            const userDetails = {
              id: user.id,
              fullName,
              username,
              email,
              phoneNumber,
              token: userToken,
            };
            const userCreateResponse = {
              user: userDetails,
              message: `User ${req.body.username} was created successfully`,
            };
            res.status(201).send(userCreateResponse);
          })
          .catch(() => {
            res.status(500).send({ error: 'Internal server error' });
          });
      })
      .catch((error) => {
        if (error.errors[0].message === 'username must be unique') {
          res.status(409).send({ error: 'Username not available' });
        } else if (error.errors[0].message === 'email must be unique') {
          res.status(409).send({ error: 'Email address already in use' });
        } else if (error.errors[0].message === 'phoneNumber must be unique') {
          res.status(409).send({ error: 'Phone Number already in use' });
        } else {
          res.status(500).send({ error: 'Internal server error' });
        }
      });
  }
}; // end of signup

/**
 * @description Signs user in
 *
 * @param {object} req -request object
 * @param {object} res -response object
 *
 * @returns {  void } -returns nothing
 */
export const signIn = (req, res) => {
  users
    .findOne({
      where: {
        [Op.or]: [
          { username: req.body.username },
          { email: req.body.username },
        ],
      },
    })
    .then((user) => {
      if (!user) {
        res.status(401).send({ error: 'Username or password incorect' });
      } else {
        bcrypt.compare(req.body.password, user.password, (err, result) => {
          if (result) {
            const token = generateToken(user);
            const { username, id, fullName, email, phoneNumber } = user;
            const userDetails = {
              user: {
                id,
                fullName,
                username,
                email,
                phoneNumber,
                token,
              },
            };
            res.status(200).send(userDetails);
          } else {
            res.status(401).send({ error: 'Username or password incorrect' });
          }
        });
      }
    })
    .catch(() => {
      res.status(500).send({ error: 'Internal server error' });
    });
};

/**
 * @description Sends user a reset password link
 *
 * @param {object} req -request object
 * @param {object} res -response object
 *
 * @returns {void} -returns nothing
 */
export const resetPassword = (req, res) => {
  const { email } = req.body;
  users
    .findOne({
      where: { email },
    })
    .then((user) => {
      if (user) {
        // structure email
        const token = jwt.sign({ id: user.id }, secret, {
          expiresIn: 60 * 60 * 24,
        });
        const resetPasswordMail = `<p> Click the link to change your password.</p>
      <a href='${APP_URL}/password/update?token=${token}'>
      Change password</a> `;
        const mailOptions = {
          from: 'ioyetade@gmail.com',
          to: email,
          subject: 'Reset Password',
          html: resetPasswordMail,
        };
        transporter.sendMail(mailOptions, (error) => {
          if (error) {
            res.status(503).send({ error: 'Could not send mail' });
          } else {
            res.send({ message: 'Mail sent successfully' });
          }
        });
      } else {
        res.status(404).send({
          error: 'Email address does not exist on Postit',
        });
      }
    })
    .catch(() => {
      res.status(500).send({ error: 'Internal server error' });
    });
};
/**
 * @description Updates user password
 *
 * @param {object} req -request object
 * @param {object} res -response object
 *
 * @returns {void} -returns nothing
 */
export const updatePassword = (req, res) => {
  const { token } = req.query;
  let userId;
  // Verify user token
  jwt.verify(token, secret, (error) => {
    if (error) {
      res.status(400).send({
        error:
          'Request cannot be completed because the link cannot be verified',
      });
    } else {
      // Update user password if token was verified successfully
      const hash = encryptPassword(req.body.password);
      userId = getId(token);
      users
        .update({ password: hash }, { where: { id: userId } })
        .then((updateValue) => {
          if (updateValue[0]) {
            users
              .findOne({
                where: { id: userId },
                attributes: {
                  exclude: ['createdAt', 'updatedAt', 'password'],
                },
              })
              .then((user) => {
                const userToken = generateToken(user);
                res.send({
                  token: userToken,
                  message: 'Password updated successfully',
                });
              });
          } else {
            res.status(500).send({
              error: 'Password not updated. Try again',
            });
          }
        })
        .catch(() => {
          res.status(500).send({ error: 'Internal server error' });
        });
    }
  });
};

/**
 * @description search user
 *
 * @param {object} req -request object
 * @param {object} res -response object
 *
 * @returns {void} - returns nothing
 */
export const userSearch = (req, res) => {
  const { query, offset } = req.query;
  const limit = req.query.limit || 10;
  users
    .findAndCountAll({
      where: {
        [Op.or]: [
          {
            username: { [Op.iLike]: `%${query.toLowerCase()}%` },
          },
          {
            fullName: { [Op.iLike]: `%${query.toLowerCase()}%` },
          },
        ],
      },
      offset,
      limit,
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'password'],
      },
    })
    .then((result) => {
      const pagination = {
        pageCount: Math.floor(result.count / limit),
        count: result.count,
        users: result.rows,
      };
      res.send(pagination);
    })
    .catch(() => {
      res.status(500).send({ error: 'Internal server error' });
    });
};
