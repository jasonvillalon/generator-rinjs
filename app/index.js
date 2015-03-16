'use strict';
var util = require('util'),
  path = require('path'),
  yeoman = require('yeoman-generator'),
  chalk = require('chalk'),
  shell = require('shelljs');

var rinJSGenerator = yeoman.generators.Base.extend({
  init: function(){
    // invoke npm install on finish
    this.on('end', function() {
      if (!this.options['skip-install']) {
        this.npmInstall();
        shell.exec('bower install');
        shell.exec('sudo chmod +x script/*');
        shell.exec('script/bootstrap');
        shell.exec('script/build');
        shell.exec('script/run');
      }
    });
    // have Yeoman greet the user
    console.log(this.yeoman);

    // replace it with a short and sweet description of your generator
    console.log(chalk.magenta('You\'re using the rinJS generator.'));
  },
  askForApplicationDetails: function(){
    var done = this.async();

    var prompts = [{
      name: 'appName',
      message: 'What would you like to call your application?',
      default: 'testProj'
    },{
      name: 'appDescription',
      message: 'What would be the description of the application?',
      default: 'NODEJS React Sample Project'
    },{
      name: 'appRepository',
      message: 'What is the repository of this project?',
      default: ''
    }, {
      name: 'appAuthor',
      message: 'What is the name of the author?',
      default: ''
    }];

    this.prompt(prompts, function(props) {
      this.appName = props.appName;
      this.appDescription = props.appDescription;
      this.appRepository = props.appRepository;
      this.appAuthor = props.appAuthor;

      this.slugifiedAppName = this._.slugify(this.appName);
      this.humanizedAppName = this._.humanize(this.appName);

      done();
    }.bind(this));
  },
  copyApplicationFolder: function(){
    this.copy('index.html');

    this.mkdir('styles');
    this.mkdir('src');
    this.mkdir('assets');
    this.mkdir('scripts');

    this.directory('styles');
    this.template('styles/main.styl', 'styles/main.styl');

    this.directory('script');
    this.copy('script/bootstrap');
    this.copy('script/build');
    this.copy('script/lint');
    this.copy('script/run');
    this.copy('script/test');

    this.directory('src');
    this.copy('src/alt.jsx');
    this.copy('src/browser.jsx');

    this.directory('assets');
    this.copy('assets/humans.txt');
    this.copy('assets/robots.txt');
  },

  renderApplicationDependenciesFiles: function() {
    this.template('package.json', 'package.json');
    this.template('bower.json', 'bower.json');
    this.copy('gulpfile.js');
    this.copy('config.js');
  }
});

module.exports = rinJSGenerator;