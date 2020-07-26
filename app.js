var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
const Handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const multer = require('multer');
let cors = require('cors')
let app = express();
app.use(cors());
let mongoose = require('./config/mongoose');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}


// view engine setup
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
app.engine('handlebars', exphbs({
        // defaultLayout: 'main',
        // ...implement newly added insecure prototype access
        handlebars: allowInsecurePrototypeAccess(Handlebars)
    })
);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars')

// app.set('view engine', 'hbs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json({type: 'application/*+json'}));
app.use(bodyParser.urlencoded({
    extended: true
}));


const upload = multer({storage: storage, fileFilter: fileFilter});
mongoose().then(init).catch(err => {
    console.error(err.message)
});

function init() {
     // USER API //
    require('./app/routes/user/users')(app, upload);
    //GROUP API
    require('./app/routes/admin/groups')(app);
    // MAIL SETTINGS
    require('./app/routes/admin/MailSettings')(app);
    // BANNERS
    require('./app/routes/admin/banners')(app, upload);

    // GALLERY API
    require('./app/routes/admin/gallery')(app, upload);

    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
        next(createError(404));
    });

// error handler
    app.use(function (err, req, res, next) {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        // render the error page
        res.status(err.status || 500);
        res.render('error');
    });

}

module.exports = app;
