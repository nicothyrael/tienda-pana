var uuid = require('uuid');
var db = require('../app').bucket;
var config = require('../config');
var N1qlQuery = require('couchbase').N1qlQuery;

function RecordModel() {}

module.exports = RecordModel;

RecordModel.save = function(data, callback) {
  var jsonObject = {
    firstname: data.firstname,
    lastname: data.lastname,
    telephone: data.telephone,
    email: data.email,
    operations: {
      date: operationDate,
      note: operationNote,
      amount: operationAmount
    }
  };

  var documentId = data.document_id ? data.document_id : uuid.v4();
  db.upsert(documentId, jsonObject, function(error, result) {
    if (error) {
      callback(error, null);
      return;
    }
    callback(null, {
      message: 'success',
      data: result
    });
  });
};

RecordModel.getByDocumentId = function(documentId, callback) {
  var statement = "SELECT firstname, lastname, telephone, email, operations[*] " +
    "FROM '" + config.couchbase.bucket + "' AS users " +
    "WHERE META(users).id = $1";
  var query = N1qlQuery.fromString(statement);
  db.query(query, [documentId], function(error, result) {
    if (error) {
      return callback(error, null);
    }
    callback(null, result);
  });
};

RecordModel.delete = function(documentId, callback) {
  db.remove(documentId, function(error, result) {
    if (error) {
      callback(error, null);
      return;
    }
    callback(null, {
      message: 'success',
      data: result
    });
  });
};

RecordModel.getAll = function(callback) {
  var statement = "SELECT firstname, lastname, telephone, email, operations[*] " +
    "FROM '" + config.couchbase.bucket + "' AS users ";
  var query = N1qlQuery.fromString(statement).consistency(N1qlQuery.Consistency.REQUEST_PLUS);
  db.query(query, function(error, result) {
    if (error) {
      return callback(error, null);
    }
    callback(null, result);
  });
};
