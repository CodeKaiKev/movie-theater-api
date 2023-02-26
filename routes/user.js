const {Router} = require('express');
const userRouter = Router();
const {User, Show} = require('../models/index');

const {check, validationResult} = require('express-validator');

//Get request to GET all users
userRouter.get('/', async (req, res) => { 
    try {
        const allUsers = await User.findAll({ include: [{model: Show}]});
        res.send(allUsers);
    } catch (err) {
        res.status(500).send({error: err.message});
    }
});

//Get request to GET one user

userRouter.get('/:id', async (req, res) => {
    try {
        const specifiedUser = await User.findByPk(req.params.id);
        res.send(specifiedUser);
    } catch (err) {
        res.status(500).send({error: err.message});
    }
});

//Get all shows watched by a user

userRouter.get('/:id/shows', async (req, res) => {
    try {
        //const specifiedUser = await User.findByPk(req.params.id);
        const userShow = await User.findAll({
            include:[{model: Show}] ,
            where : {id : req.params.id}
        })
        //console.log(await specifiedUser.getShows());
        //const shows = await specifiedUser.getShows();
        res.send(userShow);
    } catch (err) {
        res.status(500).send({error: err.message});
    }
})

//Put update and add a show id a user has watched it
userRouter.put("/:id/shows/:showId", async (req, res) => {
    try {
        const userId = req.params.id;
        const showId = req.params.showId;
        const showForUser = await Show.findByPk(showId);
        const specifiedUser = await User.findByPk(userId);
        specifiedUser.addShow(showForUser);
        const userShow = await User.findAll({
            include:[{model: Show}] ,
            where : {id : userId}
        })
        res.json(userShow);
    } catch (err) {
        res.status(500).send({error: err.message});
    }
})
module.exports = userRouter;