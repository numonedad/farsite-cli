const path = require('path');

var planets = require( path.resolve( __dirname, './planets.js' ) );
var items = require( path.resolve( __dirname, './items.js' ) );

var argv = require('yargs/yargs')(process.argv.slice(2))
    .command('resources', 'find resources consumed vs produced', {
      userid: {
        description: 'the userid',
        alias: 'u',
        type: 'number',
      }
    }).option('token', {
      alias: 't',
      description: "authorization token Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NjYwMzE0LCJlbWFpbCI6IndlbGxzQGhleS5jb20iLCJpYXQiOjE2MzU2MTkxNTcsImV4cCI6MTYzNTYyMjc1N30.eSd8h2nOOqvhcjploGJ_xyPwUEIynzdub__7Sasdf"
    }).argv;

var resources = async(verbose) => {
  let produce = await items.produce(argv.userid, {
    headers: {
      'authorization': argv.token
    }
  });
  let consume = await items.consume(argv.userid, {
    headers: {
      'authorization': argv.token
    }
  });

  if (verbose) {
    console.log('consume', consume)
    console.log('produce', produce)
  }
  let summary = { ...consume }
  for (key in summary) {
    if (produce.deposit[key] || produce.spot[key]) {
      delete summary[key]
    }
  }

  let sectors = await planets();

  printer(summary, sectors);
}

function printer(obj, sectors) {
  for (key in obj) {
    let line = key + " " + obj[key] + " ";
    if (sectors[key]) {
      line += Object.keys(sectors[key].mix);
    }
    console.log(line);
  }
}

if (argv._.includes('resources')) {
  resources(argv.verbose)
}

if (argv._.includes('planets')) {
  planets(argv.verbose)
}
