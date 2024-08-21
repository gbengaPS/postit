[![Build Status](https://travis-ci.org/gbengaPS/postit.svg?branch=develop)](https://travis-ci.org/gbengaPS/postit) [![Maintainability](https://coveralls.io/repos/github/gbengaPS/postit/badge.svg?branch=develop)](https://coveralls.io/github/gbengaPS/postit?branch=develop)
[![Maintainability](https://api.codeclimate.com/v1/badges/a99a88d28ad37a79dbf6/maintainability)](https://codeclimate.com/github/codeclimate/codeclimate/maintainability)

# PostIt
PostIt is a group messaging application that allows registered users communicate prioritized messages
with one another. Messages are prioritized in the following order:
* Normal
* Urgent
* Critical

## Installation
To get Postit up and running on your local machine, you'll need to have the following installed:
* [Node](https://nodejs.org/) : This powers the backend of the application
* [Postgres](https://www.postgresql.org/) : This is the database used
* [Git](https://expressjs.com/) (optional but highly recommended): Version control system <br /><br />
Once you have all of these installed, run this command
`  git clone https://github.com/gbengaPS/postit.git  ` in your terminal<br /><br />
This will create a postit folder on your local machine<br /><br />
Change directory to postit `  cd postit  `<br /><br />
And then run  `yarn install` <br /><br />
This will install all dependencies.<br /><br />
You'll need to create a .env file, follow the pattern in the .env.example file. <br /><br />
Install sequelize cli globally `  npm install -g sequlize  `  Run migrations `sequelize db:migrate   `<br /><br />
To start the project, run `  npm start  `<br /><br />
This will start the server on port: 3000 <br /><br />

## Running the tests

Three categories of test have been written for this application:
* Server side tests: ` npm run test `
* Client side tests: ` npm run client:test `
* End-to-end test: ` npm run start:selenium ` and ` npm run e2e:test `

The end-to-end test requires that you have selenium driver installed
run this command to install selenium <br />
`npm install selenium-standalone --save-dev` <br />
Afterwards, run `e2e:setup`

### Note
Running the end-to-end test will drop your tables and create a new one

## Product Limitation
Currently,
* Users cannot edit their profile after creating it.
* Users cannot delete or edit a group
* Users cannot remove other users from a group
* Users cannot add themselves to a group
* Users cannot deactivate account

## API Documentation
Details on how the API works can be found [here](https://postit-gbenga.herokuapp.com/doc)

## Built With

* [Node](https://nodejs.org/) (Server)
* [Express Js](https://expressjs.com/) (Server side javascript framework)
* [React](https://reactjs.org/) frontend framework
* [Postgres Databse](https://www.postgresql.org/) Database engine

## Want to Contribute ?
  * Fork the repository
  * Make your contributions
  * Ensure your codes follow the [AirBnB Javascript Styles Guide](https://www.gitbook.com/book/duk/airbnb-javascript-guidelines/details)
  * Create Pull request against the develop branch.
Visit the [wiki](https://github.com/gbengaPS/postit/wiki) to see pull request,
commit message and branch naming conventions

## Frequently asked questions

#### Who can contribute?
Anyone can contribute to this project! To contribute, simply raise a PR with your contribution. Only PRs that meet the standard would be considered. For more details on PR conventions, see the project [wiki](https://github.com/gbengaPS/postit/wiki)

#### What language was used to develop this application?
This project was built using Javascript, HTML and CSS

#### Am I permitted to clone this project for personal use?
See [The MIT License](./LICENSE.md) for the more details.

## Author

* **Gbenga Oyetade** (https://github.com/gbengaPS)

## Acknowledgments

* Andela Fellowship (https://andela.com/)

## License

[MIT License](./LICENSE.md)




