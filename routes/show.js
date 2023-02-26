const {Router} = require('express');
const express = require('express');
const showRouter = Router();
const {User, Show} = require('../models/index');

const {check, validationResult} = require('express-validator');

//Show router GET all the shows watched by a user using an endpoint
showRouter.get("/", async (req, res) => {
    try {
        const allShows = await Show.findAll({ include: [{model: User}]});
        res.json(allShows);
    } catch (err) {
        res.status(500).send({error: err.message});
    };
})

//Getting a specific show using an endpoint
showRouter.get("/:id", async (req, res) => {
    try {
        const specificShow = await Show.findAll({ include: [{model: User}], where: {id: req.params.id}});
        res.json(specificShow);
    } catch (err) {
        res.status(500).send({error: err.message});
    };
})

//Getting show for specific genre
showRouter.get("/genres/:Genre", async (req, res) => {
    try {
        const genre = req.params.Genre;
        const genreShows = await Show.findAll({  where: {genre: genre}});
        res.json(genreShows);
    } catch (err) {
        res.status(500).send({error: err.message});
    };
})
//Update a show's rating
showRouter.use(express.urlencoded({ extended: true }));
showRouter.put("/:id/watched", [check("rating", "cannot be empty or whitespaces").not().isEmpty().trim()], async (req, res) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            res.json({error: errors.array()});
        } else {
            await Show.update({rating: req.body.rating}, {where: {id: req.params.id}})
            res.json(await Show.findAll({  where: {id: req.params.id}}))
        }
    } catch(err) {
        res.status(500).send({error: err.message});
    }
})

//Update status on specific show 
showRouter.put("/:id/updates", [check("status", "cannot be empty or whitespaces").not().isEmpty().trim(), check("status", "min 5 max 25").isLength({min: 5, max: 25})], async (req, res) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            res.json({error: errors.array()});
        } else {
            await Show.update({status: req.body.status}, {where: {id: req.params.id}})
            res.json(await Show.findAll({  where: {id: req.params.id}}))
        }
    } catch (err) {
        res.status(500).send({error: err.message});
    }
})

//Delete a show
showRouter.delete("/:id", async (req, res) => { 
 

    try {
        const deltedShow = await Show.destroy({where: {id: req.params.id}});
        res.json(await Show.findAll());
    } catch (err) {
        res.status(500).send({error: err.message});
    }
})


module.exports = showRouter;