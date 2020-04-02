const fs = require('fs');
const Tour = require('../models/Tour');

const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

module.exports = {
    // PARAM MIDDLEWARE
    checkID: (req, res, next, val) => {
        console.log(`Tour id is: ${val}`);
        const id = req.params.id * 1;
        if (id > tours.length) return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
        next();
    },

    checkBody: (req, res, next) => {
        if (!req.body.name || !req.body.price) return res.status(400).json({ status: 'fail', message: 'Missing name or price' });
        next();
    },

    // ROUTE HANDLERS
    getAllTours: (req, res) => {
        console.log(req.requestTime);
        res.status(200).json({
            status: 'success',
            requestedAt: req.requestTime,
            results: tours.length,
            data: {
                tours
            }
        });
    },

    getTour: (req, res) => {
        // console.log(req.params);
        const id = req.params.id * 1;
        const tour = tours.find(el => el.id === id);

        // if (id > tours.length) return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
        if (!tour) return res.status(404).json({ status: 'fail', message: 'Invalid ID' });

        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        });
    },

    createTour: (req, res) => {
        // console.log(req.body);
        const newId = tours[tours.length - 1].id + 1;
        const newTour = Object.assign({ id: newId }, req.body);

        tours.push(newTour);

        fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
            res.status(201).json({
                status: 'success',
                data: {
                    tour: newTour
                }
            });
        });
    },

    updateTour: (req, res) => {
        const id = req.params.id * 1;
        if (id > tours.length) return res.status(404).json({ status: 'fail', message: 'Invalid ID' });

        res.status(200).json({
            status: 'success',
            data: {
                tour: '<Updated tour here...>'
            }
        });
    },

    deleteTour: (req, res) => {
        // 204 -> No Content
        res.status(204).json({
            status: 'success',
            data: null
        });
    }
}