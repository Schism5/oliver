const express = require('express');
const parser = require('body-parser');
const hbs = require('hbs');
const fs = require('fs');

const app = express();
app.use(parser.urlencoded({ extended: false }));
app.use(parser.json());

app.set('view engine', 'hbs');

//logger
app.use((req, res, next) => {
    let now = new Date().toString();
    let log = `${now}: ${req.method} ${req.url}`;
    console.log(log);
    fs.appendFile('server.log', log + '\n', err => {
        if(err) {
            console.log('Unable to reach server.log');
        }
    });
    next();
});

// app.use((req, res, next) => {
//     res.render('maintenance.hbs', {
//         title: 'Currently Unavailable',
//         message: 'Site under maintenance'
//     });
// });

//middlewares execute in order added, make static stuff 'private' by having it here
app.use(express.static(__dirname + '/public'));

app.get('/images/*', (req, res) => {
    var s = fs.createReadStream(__dirname + req.path);
    s.on('open', function () {
        //res.set('Content-Type', 'image/jpeg');
        s.pipe(res);
    });
    s.on('error', function () {
        res.set('Content-Type', 'text/plain');
        res.status(404).end('Not found');
    });
});

app.get('/', (req, res) => {
    // res.render('home.hbs', {
    //     imageNames : fs.readdirSync(__dirname + '/images')
    // });
    res.render('login.hbs');
});

app.post('/login', (req, res) => {
    if(req.body.pw === 'ok') {
        res.send(fs.readdirSync(__dirname + '/images'));
    }
    else {
        res.status(403);
        res.send();
    }
});

app.get('/about', (req, res) => {
    res.render('about.hbs', {
        title: 'About Page',
        currentYear: new Date().getFullYear()
    });
});

app.get('/bad', (req, res) => {
    res.send({
        errorMsg : 'some error dawg+'
    });
});

app.listen(3000, () => {
    console.log('Server Up');
});