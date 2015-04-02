angular.module('starter.services', ['services.db'])

// ====================================
// 人员管理
// ------------------------------------
.factory('Person', function(DBHelper, $q) {
  // Some fake testing data

  var persons = [];

  return {
    new: function() {
      return {name: '', telephone: '', email: '', account: 0};
    },
    // 返回的是一个promise对象
    all: function() {
      var deferred = $q.defer();
      DBHelper.dbInstance().executeSql("SELECT * FROM USERS ORDER BY id ASC;", [], function(res) {
        persons = DBHelper.convertResToArray(res);
        deferred.resolve(persons);
      });
      return deferred.promise;
    },
    remove: function(person, successCallback, errorCallback) {
      // TODO dairg 删除人员时应该同时删除该人员相关的其它信息，比如充值记录，活动参加纪录等。
      DBHelper.dbInstance().executeSql("DELETE FROM users WHERE id = ?;", [person.id], function(res) {
        successCallback();
      }, function(e) {
        console.log("ERROR: " + e.message);
        errorCallback();
      });
    },
    get: function(personId) {
      for (var i = 0; i < persons.length; i++) {
        if (persons[i].id === parseInt(personId)) {
          return persons[i];
        }
      }
      return null;
    },
    // 添加
    add: function(data, successCallback, errorCallback) {
      DBHelper.dbInstance().executeSql("INSERT INTO users (name, telephone, email) VALUES (?,?,?)",
        [data.name, data.telephone, data.email], function(res) {
        successCallback();
      }, function(e) {
        console.log("ERROR: " + e.message);
        errorCallback();
      });
    },
    // 更新
    update: function(data, successCallback, errorCallback) {
      DBHelper.dbInstance().executeSql("UPDATE users SET name=?, telephone=?, email=? WHERE id=?",
        [data.name, data.telephone, data.email, data.id], function(res) {
        successCallback();
      }, function(e) {
        console.log("ERROR: " + e.message);
        errorCallback();
      });
    },
    // 充值
    charge: function(person, amount, successCallback, errorCallback) {
      DBHelper.dbInstance().transaction(function(fx) {
        // 添加充值记录
        fx.executeSql("INSERT INTO charge (chargeDate, userId, amount) VALUES (?,?,?)",
          [Date.now(), person.id, amount], function(res) {
            // 更新用户余额
            fx.executeSql("UPDATE users SET account=? WHERE id=?",
              [person.account+amount, person.id], function(res) {
              person.account += amount;
              successCallback();
            }, function(e) {
              console.log("ERROR: " + e.message);
              errorCallback();
            });
        }, function(e) {
          console.log("ERROR: " + e.message);
          errorCallback();
        });
      });
    }
  };
})

// ====================================
// 活动管理
// ------------------------------------
.factory('Activity', function($q, DBHelper) {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var activities = [{
    id: 1,
    catagory: '羽毛球',
    date: Date.now()
  }, {
    id: 2,
    catagory: '聚餐',
    date: Date.now()
  }];

  var currentId = 3;

  return {
    new: function() {
      return {catagory: '羽毛球', date: new Date()};
    },
    all: function() {
      var deferred = $q.defer();
      // DBHelper.dbInstance().executeSql("SELECT id, catagory, datetime(date, 'unixepoch', 'localtime') as date FROM ACTIVITIES ORDER BY date DESC", [], function(res) {
      DBHelper.dbInstance().executeSql("SELECT * FROM ACTIVITIES ORDER BY date DESC", [], function(res) {
        activities = DBHelper.convertResToArray(res);
        for(var i=0; i<activities.length; i++) {
          activities[i].date = new Date(activities[i].date);
        }
        deferred.resolve(activities);
      });
      return deferred.promise;
    },
    remove: function(activity) {
      activities.splice(activities.indexOf(activity), 1);
    },
    get: function(activityId) {
      for (var i = 0; i < activities.length; i++) {
        if (activities[i].id === parseInt(activityId)) {
          return activities[i];
        }
      }
      return null;
    },
    add: function(data, successCallback, errorCallback) {
      DBHelper.dbInstance().executeSql("INSERT INTO activities (catagory, date) VALUES (?,?)",
        [data.catagory, data.date.getTime()], function(res) {
        successCallback();
      }, function(e) {
        console.log("ERROR: " + e.message);
        errorCallback();
      });
    }
  };
});
