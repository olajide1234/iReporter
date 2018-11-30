import express from 'express';
import bodyParser from 'body-parser';
import es6mapimplement from 'es6-map/implement';

const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));


// Welcome
router.get('/api/v1', (req, res) => {
  const welcome = 'Welcome to Andela Bootcamp iReporter Project API';
  res.status(200).send({
    status: 200,
    data: welcome,
  });
});

router.get('/', (req, res) => {
  const welcome = 'Welcome to Andela Bootcamp iReporter Project API';
  res.status(200).send({
    status: 200,
    data: welcome,
  });
});

module.exports = router;
