var uuid = require('uuid');
var db = require('../app').bucket;
var config = require('../config');
var N1qlQuery = require('couchbase').N1qlQuery;

function RecordOperation() {}

module.exports = RecordOperation;

RecordOperation.save = function(data, callback) {
  var operationDoc = {
    type: "operation",
    uid: VER,
    operationDate: data.operationDate,
    operationNote: data.operationNote,
    operationAmount: data.operationAmount,
  };

  db.upsert("operation::" + operationDoc.uid, operationDoc, function(error, result) {
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

RecordOperation.getByDocumentId = function(documentId, callback) {
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

RecordOperation.delete = function(documentId, callback) {
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

RecordOperation.getAll = function(callback) {
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
