var http = require('http'),
    express = require('express'),
    bodyParser = require('body-parser'),
    cookieSession = require('cookie-session'),
    colors = require('colors'),
    mongoose = require('mongoose'),
    path = require('path'),
    app = express();

// Connect to DB

mongoose.connect('mongodb://localhost/todoapp', { useMongoClient: true, reconnectTries: 10, reconnectInterval: 500 })
    .then(function() {
        console.info('[SUCCESS]'.green, 'Successful connection to Database');
    }).catch(function(err) {
        console.error('[ERROR]'.red, err.message);
        process.exit(1);
    });

// Create Model's

var userSchema = new mongoose.Schema({ uid: { type: String, unique: true } }),
    taskSchema = new mongoose.Schema({ uid: String, text: String , done: Boolean }),
    User = mongoose.model('User', userSchema),
    Task = mongoose.model('Task', taskSchema);

// View Engine

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware

app.use(bodyParser.json());
app.use(bodyParser.urlencoded( { extended: false } ));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieSession({ name: 'session', keys: [ 'UI7ft5dKyG' ],  maxAge: 24 * 60 * 60 * 1000 }));

// Routes

app.get('/', (req, res) => {
    if (req.session.user) {
        Task.find(
            { uid: req.session.user.uid }, 
        function(err, tasks) {
            if (err) {
                console.error('[ERROR]'.red, err.message);
            } else {
                res.render('dashboard', { tasks: tasks });
            }
        });
    } else {
        res.render('index');
    }
});

app.post('/auth', (req, res) => {
    User.findOne(
        { uid: req.body.uid }, 
    function(err, user) {
        if (err) {
            console.error('[ERROR]'.red, err.message);
            res.send('failed');
        } else {
            if (!user) { // if this is new user
                var user = new User({ uid: req.body.uid });

                user.save().then(function() {
                    req.session.user = req.body;
                    console.info('[SUCCESS]'.green, 'New user with UID: ' + req.body.uid.bold);
                    res.send('successful');
                }).catch(function(err) {
                    console.error('[ERROR]'.red, err.message);
                    res.send('failed');
                }); 
            } else { // if user is exist
                req.session.user = req.body;
                res.send('successful');
            }
        }
    });
});

app.post('/logout', (req, res) => {
    req.session = null;
    res.end();
});

app.post('/task/add', (req, res) => {
    var task = new Task({ uid: req.session.user.uid, text: req.body.text, done: false });

    task.save().then(function() {
        res.send('successful');
    }).catch(function(err) {
        console.error('[ERROR]'.red, err.message);
        res.send('failed');
    });
});

app.post('/task/do', (req, res) => {
    Task.findOneAndUpdate(
        { uid: req.session.user.uid, text: req.body.text }, 
        { $set: { done: req.body.done } }, 
        { new: true }, 
    function(err) {
        if (!err) {
            res.send('successful');
        } else {
            console.error('[ERROR]'.red, err.message);
            res.send('failed');
        }
    });
});

app.post('/task/remove', (req, res) => {
    Task.findOneAndRemove(
        { uid: req.session.user.uid, text: req.body.text }, 
    function(err) {
        if (!err) {
            res.send('successful');
        } else {
            console.error('[ERROR]'.red, err.message);
            res.send('failed');
        }
    });
});

app.listen(3000, function() {
    console.log('[SUCCESS]'.green, 'Server started on port 3000');
});