import express from 'express';
import { signUp, signIn, resetPassword, updatePassword, userSearch }
from './controllers/userController';
import routeValidation from './includes/routeValidation';
import { create, addMembers, getGroups, leaveGroup, getGroupMembers }
from './controllers/groupController';
import { createMessage, getMessages } from './controllers/messageController';
import authenticate from './middleware/authenticate';
import sendValidationErrors from './middleware/sendValidationErrors';
import groupExist from './middleware/groupExist';
import userExist from './middleware/userExist';

const router = express.Router();
const validations = routeValidation();

router.post('/user/signup',
validations.signUp, sendValidationErrors, signUp);

router.post('/user/signin',
validations.signIn, sendValidationErrors, signIn);

router.post('/user/password/reset',
validations.resetPassword, sendValidationErrors, resetPassword);

router.post('/user/password/update',
validations.updatePassword, sendValidationErrors, updatePassword);


router.use(authenticate);

router.post('/group',
validations.createGroup, sendValidationErrors, create);

router.post('/group/:groupId/user',
validations.addMembers,
 sendValidationErrors, userExist, groupExist, addMembers);

router.post('/group/:groupId/message',
validations.createMessage,
sendValidationErrors,
groupExist,
createMessage);

router.get('/group/:groupId/messages',
groupExist, sendValidationErrors, getMessages);

router.get('/group/user', getGroups);

router.get('/group/:groupId/users', groupExist, getGroupMembers);

router.get('/user/search',
validations.userSearch, sendValidationErrors, userSearch);

router.delete('/group/:groupId/leave', groupExist, leaveGroup);

export default router;
