import { assert } from 'chai';
import supertest from 'supertest';
import app from '../server/app';
import db from '../server/models/';
// import exist from '../middleware/exist';

const data = { fullName: 'gbenga Oyetade', username: 'apptest', password: 'some password', email: 'apptest@gmail.com', phoneNumber: '+2348064140695' };
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoyLCJpYXQiOjE1MDQyODk2NzYsImV4cCI6MTUzNTgyNTY3Nn0.x3Kd6Iyc-8-RU8y5Z_-80kcXPF8IlteXqhVANJW6BQM';
db.sequelize.sync( { force: true })
    .then((value) => {
      db.users.destroy();
      console.log(value);
    })
    .catch((error) => {
      console.log(error);
    }); 
describe('Signup tests', () => {
  beforeEach(() => {
    db.users.destroy({
    cascade: true,
    truncate: true,
    restartIdentity: true
    })
    .then(() => {
      db.users.create(data)
    .then((user) => {
      console.log(user);
    })
    .catch((error) => {
      console.log(error);
    })
    })
    });
  it('signup post url should be defined', (done) => {
    supertest(app).post('/api/user/signup').send().end((err, res) => {
      assert.equal(res.statusCode, 401);
      done();
    });
  });
  it('should validate input parameters are  username,email and password', (done) => {
    supertest(app).post('/api/user/signup').send(data).end((err, res) => {
      assert.equal(res.body.parameters, 'ok');
      done();
    });
  });
  it('should detect invalid email address', (done) => {
    const wrongEmail = { fullName: 'gbenga Oyetade', username: 'apptest', password: 'some password', email: 'apptestgmail.com', phoneNumber: '+2348064140695' };
    supertest(app).post('/api/user/signup').send(wrongEmail).end((err, res) => {
      assert.equal(res.body.error, 'Invalid email address supplied');
      done();
    });
  });
  it('should make sure password parameter is at least 6 characters', (done) => {
    const user = { fullName: 'gbenga Oyetade', username: 'gbenga_ps', password: 'pass', email: 'ioyetade@gmail.com', phoneNumber: '+2348064140695' };
    supertest(app).post('/api/user/signup').send(user).end((err, res) => {
      assert.equal(res.body.error, 'Password must be at least 6 characters');
      done();
    });
  });
  it('should detect if username contains special characters', (done) => {
    const user = { fullName: 'gbenga Oyetade', username: '$gbenga_ps', password: 'password', email: 'ioyetade2@gmail.com', phoneNumber: '+2348064140695' };
    supertest(app).post('/api/user/signup').send(user).end((err, res) => {
      assert.equal(res.body.error, 'Username cannot contain special characters aside from _');
      done();
    });
  });
});

// Test for the group controller
describe('group test', () => {
  beforeEach(() => {
    db.users.destroy({ truncate: true })
    .then(() => {
      db.users.create(data)
    .then((user) => {
      console.log(user);
    })
    .catch((error) => {
      console.log(error);
    })
    })
    });
  it('Create group route should be defined ', (done) => {
    supertest(app).post('/api/group').set('x-access-token', token).send()
    .end((err, res) => {
      assert.equal(res.body.message, 'groupName field not provided');
      done();
    });
  });
  it('Leave group should detect if group exist', (done) => {
    supertest(app).delete('/api/group/10000000/user').set('x-access-token', token).send()
    .end((err, res) => {
      assert.equal(res.body.error, 'Group does not exist');
      done();
    });
  });
  it('Leave group should detect if user belongs to group', (done) => {
    supertest(app).delete('/api/group/1/user').set('x-access-token', token).send()
    .end((err, res) => {
      assert.equal(res.body.error.message, 'User not a member of the group');
      done();
    });
  });
  it('Should detect if gourpName field is not provided', (done) => {
    supertest(app).post('/api/group').set('x-access-token', token).send(data)
    .end((err, res) => {
      assert.equal(res.body.message, 'groupName field not provided');
      done();
    });
  });
  it('Should detect empty groupName', (done) => {
    const groupData = { groupName: '  ', groupDescription: '' };
    supertest(app).post('/api/group').set('x-access-token', token).send(groupData)
    .end((err, res) => {
      assert.equal(res.body.error[0].message, 'Group name cannot be empty');
      done();
    });
  });
  it('Should detect if group description field is not provided', (done) => {
    const groupData = { groupName: 'react leaders' };
    supertest(app).post('/api/group').set('x-access-token', token).send(groupData)
    .end((err, res) => {
      assert.equal(res.body.message, 'groupDescription field not provided');
      done();
    });
  });
  it('Add member function should be defined', (done) => {
    const groupData = { userId: 1 };
    supertest(app).post('/api/group/1/user').set('x-access-token', token).send(groupData).end((err, res) => {
      assert.equal(res.statusCode, 200);
      done();
    });
  });
  it('Add member should detect if user is already a member of the group', (done) => {
    const groupData = { userId: 1 };
    supertest(app).post('/api/group/1/user').set('x-access-token', token).send(groupData).end((err, res) => {
      assert.equal(res.body.error, 'User already a member of this group');
      done();
    });
  });
});

// Login tests
describe('Login', () => {
   beforeEach(() => {
    db.users.destroy({ truncate: true })
    .then(() => {
      db.users.create(data)
    .then((user) => {
      console.log(user);
    })
    .catch((error) => {
      console.log(error);
    })
    })
      });
  it('Return 401 error if user does not exist', (done) => {
    const user = {
      username: 'does not exist',
      password: 'password',
    };
    supertest(app).post('/api/user/signin').send(user).end((err, res) => {
      assert.equal(res.statusCode, 401);
      done();
    });
  });
  it('Return a token on successful login', (done) => {
  
    supertest(app).post('/api/user/signin').send(data).end((err, res) => {
      assert.isOk(res.body.token);
      done();
    });
  });
});


// General Application tests

describe('General tests', () => {
  it('Undefined GET urls should return 404 statusCode', (done) => {
    supertest(app).get('/whatever').send().end((err, res) => {
      assert.equal(res.statusCode, 404);
      done();
    });
  });
  it('Undefined POST urls should return 404 statusCode', (done) => {
    supertest(app).post('/whatever').send().end((err, res) => {
      assert.equal(res.statusCode, 404);
      done();
    });
  });
  it('Undefined POST urls should return a message', (done) => {
    supertest(app).post('/whatever').send().end((err, res) => {
      assert.isOk(res.body.message);
      done();
    });
  });
  // it('Undefined routes should return HTML', (done) => {
  //   supertest(app).get('/undefined_route').send().end((err, res) => {
  //     assert.equal(res.header('content-type'), 'HTML');
  //   });
  // });
});
describe('Authenticate', () => {
  it('should detect if token is not provided', (done) => {
    supertest(app).get('/api/group').send().end((err, res) => {
      assert.equal(res.body.message, 'No token provided');
      done();
    });
  });
  it('should detect if token is invalid', (done) => {
    supertest(app).get('/api/group').set('x-access-token', 'invalid token').send().end((err, res) => {
      assert.equal(res.body.message, 'Token authentication failure');
      done();
    });
  });
});

// require('dotenv').config();