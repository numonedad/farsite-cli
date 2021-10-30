const path = require('path');

var planets = require( path.resolve( __dirname, './planets.js' ) );
var items = require( path.resolve( __dirname, './items.js' ) );

var argv = require('yargs/yargs')(process.argv.slice(2))
    .command('blueprints', 'find resources for all blueprints', {
      userid: {
        description: 'the userid',
        alias: 'u',
        type: 'number',
      }
    }).option('token', {
      alias: 't',
      description: "authorization token Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NjYwMzE0LCJlbWFpbCI6IndlbGxzQGhleS5jb20iLCJpYXQiOjE2MzU2MTkxNTcsImV4cCI6MTYzNTYyMjc1N30.eSd8h2nOOqvhcjploGJ_xyPwUEIynzdub__7Sasdf"
    }).argv;

const userid = argv.userid; // || '600314';

if (argv._.includes('blueprints')) {
  items(userid);
}
