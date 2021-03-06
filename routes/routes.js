var RecordModel = require('../models/clientmodel.js');

var appRouter = function(app) {

  app.post('/api/client', function(req, res) {
    if (!req.body.firstname) {
      return res.status(400).send({
        'status': 'error',
        'message': 'A first name is required'
      });
    } else if (!req.body.lastname) {
      return res.status(400).send({
        'status': 'error',
        'message': 'A last name is required'
      });
    }
    RecordModel.save(req.body, function(error, result) {
      if (error) {
        return res.status(400).send(error);
      }
      res.send(result);
    });
  });

  app.get('/api/get', function(req, res) {
    if (!req.query.document_id) {
      return res.status(400).send({
        'status': 'error',
        'message': 'A document id is required'
      });
    }
    RecordModel.getByDocumentId(req.query.document_id, function(error, result) {
      if (error) {
        return res.status(400).send(error);
      }
      res.send(result);
    });
  });

  app.post('/api/delete', function(req, res) {
    if (!req.body.document_id) {
      return res.status(400).send({
        'status': 'error',
        'message': 'A document id is required'
      });
    }
    RecordModel.delete(req.body.document_id, function(error, result) {
      if (error) {
        return res.status(400).send(error);
      }
      res.send(result);
    });
  });

  app.get('/api/client/getAll', function(req, res) {
    RecordModel.getAll(function(error, result) {
      if (error) {
        return res.status(400).send(error);
      }
      res.send(result);
    });
  });

};

module.exports = appRouter;
