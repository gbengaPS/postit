import models from '../models';

const { groupMembers, groups, messages, users } = models;

/**
 * @description create new group
 *
 * @param {object} req -request object
 * @param {object} res -response object
 *
 * @returns {void} -returns nothing
 */
export const createGroup = (req, res) => {
  const { groupName, groupDescription } = req.body;
  groups
    .findOne({
      where: {
        groupName: groupName.toLowerCase().trim(),
      },
    })
    .then((groupExist) => {
      if (groupExist) {
        res.status(409).json({ error: 'group name already exist' });
      } else {
        const userId = req.id;
        groups
          .create({
            groupName: groupName.trim().toLowerCase(),
            groupDescription,
            createdBy: userId,
          })
          .then((group) => {
            groupMembers
              .create({
                groupId: group.id,
                userId,
                addedBy: userId,
              })
              .then(() => {
                const groupDetails = {
                  groupId: group.id,
                  groupName,
                  groupDescription,
                };
                res.status(201).json({
                  group: groupDetails,
                  message: 'Group created successfully',
                });
              })
              .catch(() => {
                res.status(500).send({ error: 'Internal server error' });
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
}; // end of Create

/**
 * @description Adds new member to group
 *
 * @param {object} req -request object
 * @param {object} res -response object
 *
 * @returns {void} -returns nothing
 */
export const addMembers = (req, res) => {
  const { userId } = req.body;
  const { groupId } = req.params;
  groupMembers
    .findOne({
      where: { userId, groupId },
    })
    .then((member) => {
      if (member) {
        res.status(409).send({
          error: 'User already a member of this group',
          member,
        });
      } else {
        groupMembers
          .create({
            groupId,
            userId,
            addedBy: req.id,
          })
          .then((groupMember) => {
            res.status(201).send({
              member: groupMember,
              user: req.user,
              message: 'User successfully added to group',
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
}; // end of addMembers

/**
 * @description Get groups a particular user belongs to
 *
 * @param {object} req -request object
 * @param {object} res -response object
 *
 * @returns {void} -returns nothing
 */
export const getGroups = (req, res) => {
  const userId = req.id;
  users
    .findAll({
      where: { id: userId },
      attributes: {
        exclude: ['password', 'createdAt', 'updatedAt'],
      },
      include: [
        {
          model: groups,
          attributes: {
            exclude: ['createdAt', 'updatedAt'],
          },
          // send group last message with it
          include: [
            {
              model: messages,
              attributes: {
                exclude: ['updatedAt'],
              },
              limit: 1,
              order: [['id', 'DESC']],
            },
          ], // end of Group include
          through: { attributes: [] },
        },
      ],
      order: [[groups, 'id', 'DESC']],
    })
    .then((userGroups) => {
      res.send({ groups: userGroups.groups });
    })
    .catch(() => {
      res.status(500).send({ error: 'Internal server error' });
    });
};

/**
 * @description Removes user from group
 *
 * @param {object} req -request object
 * @param {object} res -response object
 *
 * @returns {void} -returns nothing
 */
export const leaveGroup = (req, res) => {
  const userId = req.id;
  const { groupId } = req.params;
  groupMembers
    .destroy({
      where: { userId, groupId },
    })
    .then(() => {
      res.send({ message: 'User left group', groupId });
    })
    .catch(() => {
      res.status(500).send({ error: 'Internal server error' });
    });
};

/**
 * @description gets members of a particular group
 *
 * @param {object} req -request object
 * @param {object} res -response object
 *
 * @returns {void} -returns nothing
 */
export const getGroupMembers = (req, res) => {
  req.group
    .getUsers({
      attributes: {
        exclude: ['password', 'createdAt', 'updatedAt'],
      },
    })
    .then((members) => {
      res.send({ members, group: req.group });
    })
    .catch(() => {
      res.status(500).send({ error: 'Internal server error' });
    });
};

export const deleteGroup = (req, res) => {
  const { group, id } = req;
  const groupId = group.dataValues.id;
  if (group.createdBy !== id) {
    res.status(403).send({ error: 'You did not create this group' });
  } else {
    groups
      .destroy({
        where: { id: groupId },
      })
      .then(() => {
        res.send({
          message: 'Group deleted successfully',
          groupdId: groupId,
        });
      })
      .catch(() => {
        res.status(500).send({ error: 'Internal server error' });
      });
  }
};
