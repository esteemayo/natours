const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');

// ROUTES
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tour = require('./routes/tours');
const users = require('./routes/users');
const reviews = require('./routes/reviews');
const booking = require('./routes/booking');
const bookingController = require('./controllers/bookingController');
const view = require('./routes/view');

// START EXPRESS APP
const app = express();

app.enable('trust proxy');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// GLOBAL MIDDLEWARES
// Serving static files
// app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(`${__dirname}/public`)));

// Set security HTTP headers
app.use(helmet());

// Developmwent logging
// console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Limit request from same API
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000, // 1 hr
    message: 'Too many requests from this IP, Please try again in an hour!'
});
app.use('/api', limiter);

app.post('/webhook-checkout',
    express.raw({ type: 'application/json' }),
    bookingController.webhookCheckout
);

// Body Parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp({
    whitelist: [
        'duration',
        'ratingsQuantity',
        'ratingAverage',
        'maxGroupSize',
        'difficulty',
        'price'
    ]
}));

app.use(compression());

// Test Middleware
app.use((req, res, next) => {
    console.log('Hello from the middleware');
    next();
});

// Test Middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    // console.log(req.headers);
    // console.log(req.cookies);
    next();
});

app.use('/', view);
app.use('/api/v1/tours', tour);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);
app.use('/api/v1/bookings', booking);

app.all('*', (req, res, next) => {
    /*
    res.status(400).json({
        status: 'fail',
        message: `Can't find ${req.originalUrl} on this server`
    });
    */

    // const err = new Error(`Can't find ${req.originalUrl} on this server`);
    // err.status = 'fail';
    // err.statusCode = 404;

    // next(err);

    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
