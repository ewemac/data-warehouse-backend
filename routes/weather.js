const express = require('express');
const router = express.Router();
const Weather = require('../models/Weather');
const fetch = require('node-fetch');

const transformData = item => {
    return {
        city: item.name,
        lon: item.coord.lon,
        lat: item.coord.lat,
        country: item.sys.country,
        clouds: item.weather[0].description,
        temp: (item.main.temp - 273.15).toFixed(2),
        visibility: item.visibility,
        wind: item.wind.speed,
        id: item.id
    }
};

//get all weather objects
router.get('/', async (req, res) => {
    if (Object.entries(req.query).length === 0) {
        //get all data
        try {
            const weather = await Weather.find();
            res.json(weather);
        } catch (error) {
            res.json({message: error})
        }
    } else {
        if (req.query.city) {
            //get not transformed data from weather API
            const cityParam = req.query.city;
            const apiUrl = process.env.API_URL.replace('cityparam', cityParam);

            fetch(apiUrl)
                .then(res => res.json())
                .then(async data => {
                    //error
                    if (data.cod !== 200) {
                        res.json({error: true, message: data.message});
                    } else {
                        res.json(data);
                    }
                })
                .catch(err => {
                    res.json({message: err});
                });
        } else if (req.query.object) {
            //get transformed data for 1 city
            res.json(transformData(JSON.parse(req.query.object).data));
        }
    }
});

//adding weather object
router.post('/', (req, res) => {
    const cityParam = req.body.city;
    const apiUrl = process.env.API_URL.replace('cityparam', cityParam);

    fetch(apiUrl)
        .then(res => res.json())
        .then(async data => {

            //error
            if (data.cod !== 200) {
                res.json({error: true, message: data.message});
            } else {
                Weather.find({id: data.id}, async function (err,array) {

                    if (array.length) {
                        //update
                        try {
                            await Weather.updateOne(
                                {id: data.id},
                                {$set: transformData(data)}
                            );

                            res.json({message: `item (${data.name}) was updated in database`});
                        } catch (error) {
                            res.json({message: error});
                        }
                    } else {
                        //add new item
                        const weather = new Weather(transformData(data));

                        try {
                            await weather.save(weather);
                            res.json({message: `new item (${data.name}) was added to database`});
                        } catch (error) {
                            res.json({message: error});
                        }
                    }
                });
            }
        })
        .catch(err => {
            res.json({message: err});
        });
});

//reset database
router.delete('/', async (req, res) => {
    try {
        const removedWeather = await Weather.remove({});
        res.json({message: removedWeather});
    } catch (err) {
        res.json({message: err});
    }
});

module.exports = router;