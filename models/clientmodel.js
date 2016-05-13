var uuid = require('uuid');
var db = require('../app').bucket;
var config = require('../config');
var N1qlQuery = require('couchbase').N1qlQuery;

function RecordModel() {}

module.exports = RecordModel;

RecordModel.save = function(data, callback) {
  var clientDoc = {
    uid: uuid.v4(),
    firstname: data.firstname,
    lastname: data.lastname,
    email: data.email,
    telephone: data.telephone
  };

  db.upsert("client::" + clientDoc.uid, clientDoc, function(error, result) {
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
    var statement = "SELECT firstname, lastname, email " +
                    "FROM `" + config.couchbase.bucket + "` AS users " +
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
  var statement = "SELECT META(users).id, firstname, lastname, email, telephone " +
    "FROM `" + config.couchbase.bucket +"` AS users";
  var query = N1qlQuery.fromString(statement).consistency(N1qlQuery.Consistency.REQUEST_PLUS);
  db.query(query, function(error, result) {
    console.log(result);
    if (error) {
      return callback(error, null);
    }
    callback(null, result);
  });
};
