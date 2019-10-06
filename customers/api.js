'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const model = require('./model-datastore');

const router = express.Router();

// Automatically parse request body as JSON
router.use(bodyParser.json());

router.get('/getCustomers', (req, res, next) => {
  model.list(10, req.query.pageToken, (err, entities, cursor) => {
    if (err) {
      next(err);
      return;
    }
    res.json({
      items: entities,
      nextPageToken: cursor,
    });
  });
});


/**
 *
 * Retrieve a customer.
 */
 router.route('/getCustomer/:id').get((req, res, next) => {
  model.read(req.params.id, (err, entity) => {
    if (err) {
      next(err);
      return;
    }
    res.json(entity);
  });
});

router.use((err, req, res, next) => {
  err.response = {
    message: err.message,
    internalCode: err.code,
  };
  next(err);
});

module.exports = router;
