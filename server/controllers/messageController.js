import models from '../models';
import transporter from '../config/transporter';

const { messages, groups, users } = models;

/**
 * @description Create message
 *
 * @param {object} req -request object
 * @param {object} res -response object
 *
 * @returns {void} -returns nothing
 */
export const createMessage = (req, res) => {
  const { messageBody, messagePriority } = req.body;
  const userId = req.id;
  const { groupId } = req.params;
  messages
    .create({
      messageBody,
      messagePriority,
      userId,
      groupId,
    })
    .then((message) => {
      const messageData = {
        id: message.id,
        userId,
        groupId,
        messageBody,
        messagePriority,
        user: req.currentUser,
      };
      res.status(201).send({ message: messageData });
      // if priority is Urgent or Critical, send E-mail Notifications
      if (messagePriority === 'Urgent' || messagePriority === 'Critical') {
        groups
          .findOne({
            where: { id: message.groupId },
          })
          .then((group) => {
            group
              .getUsers({
                attributes: {
                  exclude: ['createdAt', 'updatedAt', 'password'],
                },
              })
              .then((groupMembers) => {
                const membersEmail = groupMembers.map((member) => member.email);
                const email = `<h3>Group: ${group.groupName}</h3>
          <p>Message: ${message.messageBody}</p>
          <p>Priority: <small>${message.messagePriority}</small><p>`;
                const mailOptions = {
                  from: 'ioyetade@gmail.com',
                  to: membersEmail,
                  subject: 'Postit Message Notification',
                  html: email,
                };
                transporter.sendMail(mailOptions, () => {});
              });
          })
          .catch(() => {
            res.status(500).send({ error: 'Internal server error' });
          });
      }
    })
    .catch(() => {
      res.status(500).send({ error: 'Internal server error' });
    });
};

/**
 * @description Gets messages from a particular group
 *
 * @param {object} req -request object
 * @param {object} res -response object
 *
 * @returns {void} -returns nothing
 */
export const getMessages = (req, res) => {
  const { groupId } = req.params;
  messages
    .findAll({
      where: { groupId },
      attributes: {
        exclude: ['password', 'updatedAt'],
      },
      include: [
        {
          model: users,
          attributes: {
            exclude: ['password', 'createdAt', 'updatedAt'],
          },
        },
      ],
    })
    .then((groupMessages) => {
      res.status(200).send({ messages: groupMessages });
    })
    .catch(() => {
      res.status(500).send({ error: 'Internal server error' });
    });
};
