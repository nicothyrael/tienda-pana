var uuid = require('uuid');
var db = require('../app').bucket;
var config = require('../config');
var N1qlQuery = require('couchbase').N1qlQuery;

function RecordModel() {}

module.exports = RecordModel;

RecordModel.save = function(data, callback) {
  var clientDoc = {
    type: "client",
    uid: uuid.v4(),
    firstname: data.firstname,
    lastname: data.lastname,
    telephone: data.telephone,
    email: data.email,
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
  var statement = "select client.* " +
    "from '" + config.couchbase.bucket + "' as usernames " +
    "join '" + config.couchbase.bucket + "' as clients ok keys (\"client::\" || usernames.uid) " +
    "where meta(usernames).id = $1";
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
  var statement = "select client.* " +
    "from '" + config.couchbase.bucket + "' as usernames ";
  var query = N1qlQuery.fromString(statement).consistency(N1qlQuery.Consistency.REQUEST_PLUS);
  db.query(query, function(error, result) {
    if (error) {
      return callback(error, null);
    }
    callback(null, result);
  });
};
