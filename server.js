const express = require('express'); // importing a CommonJS module
const helmet = require('helmet');

const hubsRouter = require('./hubs/hubs-router.js');

const server = express();

// global middleware
function bouncer(req, res, next) {
  res.status(404).json("Blocked!");
};

function teamNamer(req, res, next) {
  req.team = 'Web 17' // middleware can modify the request!
  next(); // tells the next middleware/route handler to execute
};

function noPass(req, res, next) {
  if(Date.now() % 3 === 0) {
    res.status(403).send("YOU SHALL NOT PASS!");
  } else {
    next();
  }
};

// server.use(bouncer);
server.use(express.json());
server.use(helmet());
server.use(teamNamer);
server.use(noPass);

// routing
server.use('/api/hubs', hubsRouter);

// route handlers ARE middleware
server.get('/', restricted, (req, res, next) => { // added local middleware 'restricted' 
  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome ${req.team} to the Lambda Hubs API</p>
    `);
});

// local middleware
function restricted(req, res, next) {
  const password = req.headers.password;

  if(password === 'mellon') {
    next();
  } else {
    res.status(401).send('YOU SHALL NOT PASS!')
  }
}

module.exports = server;
