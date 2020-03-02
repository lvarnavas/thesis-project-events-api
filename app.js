const fs = require('fs');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const eventsRoutes = require('./routes/events-routes');
const usersRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');

const sequelize = require('./util/database');

const Events = require('./models/events');
const Users = require('./models/users');
const Cities = require('./models/cities');
const Prefectures = require('./models/prefectures');
const Categories = require('./models/categories');
const Comments = require('./models/comments');
const Reports = require('./models/reports');

const app = express();

app.use(bodyParser.json());

app.use('/uploads/images', express.static(path.join('uploads', 'images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers', 
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    next();
});

app.use('/api/events', eventsRoutes); 
app.use('/api/users', usersRoutes);

app.use((req, res, next) => {
    const error = new HttpError('Could not find this route.', 404);
    throw error;
});

app.use((error, req, res, next) => {
    if (req.file) {
        fs.unlink(req.file.path, err => {
          console.log(err);
        });
    }
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({message: error.message || 'An unknown error occured'})
});


Events.belongsTo(Cities, {constraints: true});
Cities.hasMany(Events);
Events.belongsTo(Prefectures, {constraints: true});
Prefectures.hasMany(Events);
Events.belongsTo(Categories, {constraints: true});
Categories.hasMany(Events);
Events.belongsTo(Users, {constraints: true, onDelete: 'CASCADE'});
Users.hasMany(Events);
Comments.belongsTo(Events, {constraints: true});
Events.hasMany(Comments);
Comments.belongsTo(Users, {constraints: true});
Users.hasMany(Comments);
Reports.belongsTo(Events, {onDelete: 'CASCADE'});
Events.hasMany(Reports);
Reports.belongsTo(Users, {onDelete: 'CASCADE'});
Users.hasMany(Reports);

sequelize.sync()
    .then(result => {
        app.listen(process.env.PORT);
    })
    .catch(err => {
        console.log(err);
});