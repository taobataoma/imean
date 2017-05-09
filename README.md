# iMEAN.JS - Full-Stack JavaScript Using Sequelize, Express, AngularJS, and Node.js - origin of [meanjs/mean](https://github.com/meanjs/mean)

iMEAN is a full-stack JavaScript open-source solution, which provides a solid starting point for [Sequelize](https://github.com/sequelize/sequelize), [Node.js](http://www.nodejs.org/), [Express](http://expressjs.com/), and [AngularJS](http://angularjs.org/) based applications. The idea is to solve the common issues with connecting those frameworks, build a robust framework to support daily development needs, and help developers use better practices while working with popular JavaScript components.

## Before You Begin
Before you begin we recommend you read about the basic building blocks that assemble a iMEAN application:
* Mysql - Go through [Mysql Official Website](http://www.mysql.com/) and proceed to their [Official Manual](http://www.mysql.com/), which should help you understand MySQL better.
* Express - The best way to understand express is through its [Official Website](http://expressjs.com/), which has a [Getting Started](http://expressjs.com/starter/installing.html) guide, as well as an [ExpressJS](http://expressjs.com/en/guide/routing.html) guide for general express topics. You can also go through this [StackOverflow Thread](http://stackoverflow.com/questions/8144214/learning-express-for-node-js) for more resources.
* AngularJS - Angular's [Official Website](http://angularjs.org/) is a great starting point. You can also use [Thinkster Popular Guide](http://www.thinkster.io/), and [Egghead Videos](https://egghead.io/).
* Node.js - Start by going through [Node.js Official Website](http://nodejs.org/) and this [StackOverflow Thread](http://stackoverflow.com/questions/2353818/how-do-i-get-started-with-node-js), which should get you going with the Node.js platform in no time.


## Prerequisites
Make sure you have installed all of the following prerequisites on your development machine:
* Git - [Download & Install Git](https://git-scm.com/downloads). OSX and Linux machines typically have this already installed.
* Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager. If you encounter any problems, you can also use this [GitHub Gist](https://gist.github.com/isaacs/579814) to install Node.js.
* Mysql - [Download & Install Mysql](http://www.mysql.com), and make sure it's running.
* Bower - You're going to use the [Bower Package Manager](http://bower.io/) to manage your front-end packages. Make sure you've installed Node.js and npm first, then install bower globally using npm:

```bash
$ npm install -g bower
```

## Downloading iMEAN
There are several ways you can get the iMEAN boilerplate:

### Cloning The GitHub Repository
The recommended way to get iMEAN is to use git to directly clone the iMEAN repository:

```bash
$ git clone https://github.com/taobataoma/imean.git
```

This will clone the latest version of the iMEAN repository to a **imean** folder.

### Downloading The Repository Zip File
Another way to use the iMEAN boilerplate is to download a zip copy from the [master branch on GitHub](https://github.com/taobataoma/imean/archive/master.zip). You can also do this using the `wget` command:

```bash
$ wget https://github.com/taobataoma/imean/archive/master.zip -O imean.zip; unzip imean.zip; rm imean.zip
```
Don't forget to rename **imean-master** after your project name.

## Quick Install
Once you've downloaded the boilerplate and installed all the prerequisites, you're just a few steps away from starting to develop your MEAN application.

The boilerplate comes pre-bundled with a `package.json` and `bower.json` files that contain the list of modules you need to start your application.

To install the dependencies, run this in the application folder from the command-line:

```bash
$ npm install
```

This command does a few things:
* First it will install the dependencies needed for the application to run.
* If you're running in a development environment, it will then also install development dependencies needed for running your application.
* When the npm packages install process is over, npm will initiate a bower install command to install all the front-end modules needed for the application
* To update these packages later on, just run `npm update`

## Config Sequelize with MySQL
All the config items in `config/env/default.js`

```json
  db: {
    host: '123.57.142.198',
    port: 3306,
    name: 'imean',
    username: 'taobataoma',
    password: 'Welcom@123',

    option: {
      enableSequelizeLog: false,
      FORCE_DB_SYNC: false
    }
  }
```

## Running Your Application

Run your application using npm:

```bash
$ npm start
```

Your application should run on port 3000 with the *development* environment configuration, so in your browser just go to [http://localhost:3000](http://localhost:3000)

That's it! Your application should be running. To proceed with your development, check the other sections in this documentation.
If you encounter any problems, try the Troubleshooting section.

Explore `config/env/development.js` for development environment configuration options.

### Running in Production mode
To run your application with *production* environment configuration:

```bash
$ npm run start:prod
```

Explore `config/env/production.js` for production environment configuration options.

### Running with TLS (SSL)
Application will start by default with secure configuration (SSL mode) turned on and listen on port 8443.
To run your application in a secure manner you'll need to use OpenSSL and generate a set of self-signed certificates. Unix-based users can use the following command:

```bash
$ npm run generate-ssl-certs
```

Windows users can follow instructions found [here](http://www.websense.com/support/article/kbarticle/How-to-use-OpenSSL-and-Microsoft-Certification-Authority).
After you've generated the key and certificate, place them in the *config/sslcerts* folder.

Finally, execute prod task `npm run start:prod`
* enable/disable SSL mode in production environment change the `secure` option in `config/env/production.js`


## Running your application with Gulp

The iMEAN project integrates Gulp as build tools and task automation.

We have wrapped Gulp tasks with npm scripts so that regardless of the build tool running the project is transparent to you.

To use Gulp directly, you need to first install it globally:

```bash
$ npm install gulp -g
```

Then start the development environment with:

```bash
$ gulp
```

To run your application with *production* environment configuration, execute gulp as follows:

```bash
$ gulp prod
```

It is also possible to run any Gulp tasks using npm's run command and therefore use locally installed version of gulp, for example: `npm run gulp eslint`

## Getting Started With iMEAN
You have your application running, but there is a lot of stuff to understand. We recommend you go over the [Official Documentation](http://imean.io/docs.html).
In the docs we'll try to explain both general concepts of MEAN components and give you some guidelines to help you improve your development process. We tried covering as many aspects as possible, and will keep it updated by your request. You can also help us develop and improve the documentation by checking out the *gh-pages* branch of this repository.

## Contributing
We welcome pull requests from the community! Just be sure to read the [contributing](https://github.com/taobataoma/imean/blob/master/CONTRIBUTING.md) doc to get started.

## License
[The MIT License](LICENSE.md)
