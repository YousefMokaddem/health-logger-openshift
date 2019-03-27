const express = require('express');
const router = express.Router();
const User = require('./models').User;
const Food = require('./models').Food;
const Day = require('./models').Day;
const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');

const authenticateUser = async (req,res,next) => {

    let message = null;

    //parse user credentials from auth header
    const credentials = auth(req);

    //if the credentials are available
    if(credentials){
        //find the user by their email address (the 'key' from the auth header)
        
        let user = await User.find({where:{email: credentials.name}});
        //if the user was retrieved...
        if(user){
            //check the password
            const authenticated = bcryptjs
                .compareSync(credentials.pass, user.password);
            //if the passwords match...
            if(authenticated){
                req.currentUser = user;
            }else{
                message = `Authentication failure for username: ${user.email}`;
            }
        }else{
            message = `User not found: ${credentials.name}`;
        }
    }else{
        message = `Authentication header not found`
    }

    //if authentication failed
    if(message){
        console.warn(message);

        //return 401 unauthorized
        res.status(401).json({message: 'Access Denied'});
    }else{
        //successful authentication passes control to the route handler
        next();
    }
}

// create new user
router.post('/users', (req,res,next) => {
    // hash the user's password
    req.body.password = bcryptjs.hashSync(req.body.password);


    // check email against database to ensure it isn't already in use
    // duplicate usernames are allowed
    User.find({where: {email: req.body.email}})
        .then((userfound) => {
            if (userfound !== null){
                //email is already in use
                err = new Error("Conflict - email in use");
                err.status = 409;
                return next(err);
            }else{
                User.create(req.body)
                .then(() => {
                    res.status(201);
                    res.end();
                })
                .catch((err) => {
                    return next(err);
                });
            }
        });
});

// view currently authenticated user
router.get('/users', authenticateUser, (req, res) => {
    const user = req.currentUser;
    res.json({
        id: user.id,
        username: user.username
    });
});

// get all foods
// don't show the foods with a day id because they are clones created for users to log foods
router.get('/foods', (req,res) => {
    Food.findAll({
        where: {dayId: null}, include:{model: User, attributes: ['id']},
        order:[['name', 'ASC']]
    })
    .then(foods => {
        let foodsWithUserId = foods.map(food => {
            return {...food.dataValues};
        });
        res.json(foodsWithUserId);
    });
});

// get food by id
router.get('/foods/:fId', (req,res) => {
    Food.findById(req.params.fId)
        .then(food => {
            res.json(food);
        });
});

// edit food
router.put('/foods/:fId', authenticateUser, (req,res,next) => {
    Food.findOne({
        where: { id:req.params.fId},
        include:{model: User, attributes: ['id']}
    })
        .then(food => {
            if(food.User){
                // ensure user owns the food
                if(req.currentUser.id === food.User.id){
                    return food.update(req.body)
                        .then(() => {
                            res.status(204);
                            res.end();
                        })
                        .catch(err => next(err));
                }else{
                    const err = new Error("Access Denied");
                    err.status = 401;
                    return next(err);
                }
            }else{//if no User, then edit was called from a day
                return food.update(req.body)
                        .then(() => {
                            res.status(204);
                            res.end();
                        })
                        .catch(err => next(err));
            }
        });
});

// add new food
router.post('/foods', authenticateUser, (req,res,next) => {
    User.findById(req.currentUser.id)
        .then(user => {
            user.createFood(req.body)
                .then(result => {
                    res.status(201);
                    res.json(result.id)
                })
                .catch(err => next(err));
        });
});

// delete food
router.delete('/foods/:fId', authenticateUser, (req,res,next) => {
    Food.findOne({
        where: { id:req.params.fId}
    })
        .then(food => {  
            if(food){
                if(food.User){
                    // ensure user owns the food
                    if(req.currentUser.id === food.User.id){
                        food.destroy();
                        res.end();
                    }else{
                        const err = new Error("Access Denied");
                        err.status = 401;
                        return next(err);
                    }
                }else{
                    if(food) {
                        food.destroy();
                        res.end();
                    } else {
                        res.send(404);
                    }
                }
            }else{
                res.send(404);
            }
            
            
        })
        .catch(error => {
            res.status(500).send(error);
        });
});

// create new day
router.post('/days', authenticateUser, (req,res,next) => {
    req.currentUser.createDay(req.body)
        .then(day => {
            res.end();
        })
        .catch(err => next(err));
});

// get user's days
router.get('/days', authenticateUser, (req,res) => {
    User.find({where:{id: req.currentUser.id},
        include: [
            {model: Day}
        ]})
        .then(user => res.json(user.Days));
});

// return a day with it's foods
router.get('/days/:dId', authenticateUser, (req,res,next) => {
    Day.find({where: {id: req.params.dId},
        include: [
            {model: Food},
            {model: User, attributes: ['id']}
        ]})
        .then(day => {
            // ensure user owns the day
            if(req.currentUser.id === day.User.id){
                res.json(day)
            }else{
                const err = new Error("Access Denied");
                err.status = 401;
                return next(err);
            }
        });
});

// add food to day
// food data will be pulled from database using fId, and day using dId
// add "amount" to req.body from client side so that the nutrition can be calculated on client side
router.post('/days/:dId-:fId', authenticateUser, (req,res,next) => {
    Day.findOne({
        where: { id:req.params.dId},
        include:{model: User, attributes: ['id']}
    })
    .then(day => {
        // ensure user owns the day
        if (req.currentUser.id === day.User.id){
            Food.findOne({where: {id: req.params.fId}})
                .then(food => {
                    food.dataValues.id = null;
                    food.dataValues.amount = req.body.amount;
                    day.createFood(food.dataValues)
                        .then(food => {
                            res.json(food.id);
                        });
                })
        }else{
            const err = new Error("Access Denied");
            err.status = 401;
            return next(err);
        }
    });
});

// to delete food from day just use the DELETE /foods/:fId route

// delete the day and it's foods
router.delete('/days/:dId', authenticateUser, (req,res,next) => {
    Day.findOne({
        where: { id:req.params.dId},
        include:{model: User, attributes: ['id']}
    })
        .then(day => {  
            // ensure user owns the day
            if(req.currentUser.id === day.User.id){
                if(day) {
                    day.destroy();
                    res.end();
                } else {
                    res.send(404);
                }
            }else{
                const err = new Error("Access Denied");
                err.status = 401;
                return next(err);
        }})
        .catch(error => {
            res.send(500, error);
        });
});

module.exports = router;