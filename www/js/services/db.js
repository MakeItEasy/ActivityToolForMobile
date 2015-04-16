angular.module('services.db', [])

.factory('DBHelper', function() {
  var db;

  // Wait for Cordova to load
  document.addEventListener("deviceready", onDeviceReady, false);

  // Cordova is ready
  function onDeviceReady() {
    db = window.sqlitePlugin.openDatabase({name: "ActivityApp.sqlite"});
    db.transaction(function(tx) {
      // 删除表
      /*
      tx.executeSql('DROP TABLE IF EXISTS users');
      tx.executeSql('DROP TABLE IF EXISTS charge');
      tx.executeSql('DROP TABLE IF EXISTS activities');
      tx.executeSql('DROP TABLE IF EXISTS activity_users');
      */

      // 创建用户表
      tx.executeSql('CREATE TABLE IF NOT EXISTS users (' +
          'id integer primary key AUTOINCREMENT unique,' + 
          'name text unique,' + 
          'telephone text,' +
          'email text,' +
          'avatar text,' +
          'account numeric default 0)');

      // 创建充值记录表
      tx.executeSql('CREATE TABLE IF NOT EXISTS charge (' +
          'chargeDate integer,' + 
          'userId integer,' + 
          'amount numeric)');

      // 创建活动表
      tx.executeSql('CREATE TABLE IF NOT EXISTS activities (' +
          'id integer primary key AUTOINCREMENT unique,' + 
          'catagory text,' + 
          'date integer,' +
          'fee numeric default 0,' +
          'userCount integer default 0,' +
          "paymentFlag integer default 0)");          // 是否结算 0:未结算 1:已结算

      // 创建用户参加活动表
      tx.executeSql('CREATE TABLE IF NOT EXISTS activity_users (' +
          'activityId integer,' + 
          'userId integer)');
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


// =================================
// 从这开始是一些有用的代码片段
// demonstrate PRAGMA: here can get next insertID
      /*
      db.executeSql("pragma table_info (users);", [], function(res) {
        console.log("PRAGMA res: " + JSON.stringify(res));
      });
      */

      /*
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
      */