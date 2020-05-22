const router = require('express').Router();
const bcryptjs = require('bcryptjs');

const Users = require('../users/users-model');



router.post('/register', (req, res) => {
  const credentials = req.body;
  if(isValid(credentials)){
    const rounds = process.env.BCRYPT_ROUNDS || 8; 
    const hash = bcryptjs.hashSync(credentials.password, rounds);
    credentials.password = hash;

    Users.add(credentials).then(user=>{
      req.session.loggedIn = true;
      res.status(201).json({
        data: user
      });
    }).catch(err=>{
      console.log(err);
      res.status(500).json({
        error: err.message
      });
    });
  } else {
    res.status(400).json({
      message: 'Please provide username and password and the password should be alphanumeric'
    });
  }
});



router.post('/login', (req, res) => {
  //const {username,password} = req.body;
  if (isValid(req.body)){
    Users.findBy({username: req.body.username}).then(([user])=>{
      if(user && bcryptjs.compareSync(req.body.password, user.password)) {
        req.session.loggedIn = true;
        req.session.user = user;
        res.status(200).json({
          message: 'Successfully logged in'
        })
      } else {
        res.status(401).json({
          message: 'Invalid credentials'
        })
      }
    })
  } else {
    res.status(400).json({
      message: 'Please provide username and password, the password must be alphanumeric'
    })
  }
});

router.get('/logout',(req,res)=>{
  console.log('logging out');
  if(req.session){
    req.session.destroy(err=>{
      if(err){
        res.status(500).json({
          message: 'We could not log you out, please try again later'
        })
      } else {
        res.status(204).end();
      }
    });
  } else {
    res.status(204).end();
  }
})

function isValid(user){
  return Boolean(user.username && user.password && typeof user.password ==='string');
}

module.exports = router;
