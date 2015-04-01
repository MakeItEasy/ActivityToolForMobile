angular.module('services.db', [])

.factory('DBHelper', function() {
  var db;

  // Wait for Cordova to load
  document.addEventListener("deviceready", onDeviceReady, false);

  // Cordova is ready
  function onDeviceReady() {
    db = window.sqlitePlugin.openDatabase({name: "ActivityApp.sqlite"});
    db.transaction(function(tx) {
      tx.executeSql('DROP TABLE IF EXISTS users');
      tx.executeSql('CREATE TABLE IF NOT EXISTS users (' +
          'id integer primary key AUTOINCREMENT unique,' + 
          'name text unique,' + 
          'telephone text unique,' +
          'email text unique,' +
          'account numeric default 0)');

      // demonstrate PRAGMA: here can get next insertID
      /*
      db.executeSql("pragma table_info (users);", [], function(res) {
        console.log("PRAGMA res: " + JSON.stringify(res));
      });
      */

      tx.executeSql("INSERT INTO users (name, telephone, email) VALUES (?,?,?)", ["代如刚", "18100000001", "user1@a.com"], function(tx, res) {
        console.log("Insert result res: " + JSON.stringify(res));

        db.transaction(function(tx) {
          tx.executeSql("select id, name, email from users;", [], function(tx, res) {
            console.log("select result res: " + JSON.stringify(res));
          });
        });

      }, function(e) {
        console.log("ERROR: " + e.message);
      });
    });
  }

  return {
    dbInstance: function() {
      if (db) {
        return db;
      } else {
        db = window.sqlitePlugin.openDatabase({name: "ActivityApp.sqlite"});
        return db;
      }
    },
    // 转化res结果为包含json对象的数组
    convertResToArray: function(res) {
      var result = [];
      if(res) {
        for(var i=0; i<res.rows.length; i++) {
          result.push(res.rows.item(i));
        }
      }
      return result;
    }
  }; 

});