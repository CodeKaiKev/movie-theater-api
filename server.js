const express = require('express');
const app = express();
const {db} = require('./db');
const port = 3000;
const userRouter = require('./routes/user');
const showRouter = require('./routes/show');


//Using app
//app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/users", userRouter);
app.use("/shows", showRouter);

//Listening to routes

app.listen(port, () => {
    db.sync();
    console.log(`Listening on port ${port}`);
});