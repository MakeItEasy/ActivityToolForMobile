angular.module('starter.services', ['services.db'])

// ====================================
// 人员管理
// ------------------------------------
.factory('User', function(DBHelper, $q) {
  // Some fake testing data

  var users = [];

  return {
    new: function() {
      return {name: '', telephone: '', email: '', account: 0};
    },
    // 返回的是一个promise对象
    all: function() {
      var deferred = $q.defer();
      DBHelper.dbInstance().executeSql("SELECT * FROM USERS ORDER BY id ASC;", [], function(res) {
        users = DBHelper.convertResToArray(res);
        deferred.resolve(users);
      });
      return deferred.promise;
    },
    remove: function(user, successCallback, errorCallback) {
      // TODO dairg 删除人员时应该同时删除该人员相关的其它信息，比如充值记录，活动参加纪录等。
      DBHelper.dbInstance().executeSql("DELETE FROM users WHERE id = ?;", [user.id], function(res) {
        successCallback();
      }, function(e) {
        console.log("ERROR: " + e.message);
        errorCallback();
      });
    },
    get: function(userId) {
      for (var i = 0; i < users.length; i++) {
        if (users[i].id === parseInt(userId)) {
          return users[i];
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
    charge: function(user, amount, successCallback, errorCallback) {
      DBHelper.dbInstance().transaction(function(fx) {
        // 添加充值记录
        fx.executeSql("INSERT INTO charge (chargeDate, userId, amount) VALUES (?,?,?)",
          [Date.now(), user.id, amount], function(res) {
            // 更新用户余额
            fx.executeSql("UPDATE users SET account=? WHERE id=?",
              [user.account+amount, user.id], function(res) {
              user.account += amount;
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
    },
    // 验证
    validate: function(user) {
      var message = "";
      if(user.name.trim() == "") {
        message = "姓名不能为空!"
      }
      return message;
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
    remove: function(activity, successCallback, errorCallback) {
      DBHelper.dbInstance().transaction(function(fx) {
        fx.executeSql("DELETE FROM activity_users WHERE activityId = ?", [activity.id], function(fx, res) {
          fx.executeSql("DELETE FROM activities WHERE id = ?", [activity.id], function(fx, res) {
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
    },
    activityPromise: function(id) {
      var deferred = $q.defer();
      DBHelper.dbInstance().executeSql("select * from activities where id = ?", [id], function(res) {
        deferred.resolve(DBHelper.convertResToArray(res)[0]);
      });
      return deferred.promise;
    },
    usersPromise: function(id) {
      var deferred = $q.defer();
      DBHelper.dbInstance().executeSql("select users.id as id, users.name as name from activity_users left join users on users.id = activity_users.userId where activity_users.activityId = ?;", [id], function(res) {
        deferred.resolve(DBHelper.convertResToArray(res));
      });
      return deferred.promise;
    },
    allUsersPromise: function(id) {
      var deferred = $q.defer();
      var sql = "select id, name, 'true' as joined from users where users.id in (select userId from activity_users where activityId=?)" +
                " union " +
                "select id, name, 'false' as joined from users where users.id not in (select userId from activity_users where activityId=?)";

      DBHelper.dbInstance().executeSql(sql, [id, id], function(res) {
        deferred.resolve(DBHelper.convertResToArray(res));
      });
      return deferred.promise;
    }
  };
})

// 照相机
.factory('MyCamera', ['$q', function($q) {
  return {
    getPicture: function(options) {
      var q = $q.defer();

      navigator.camera.getPicture(function(result) {
        // Do any magic you need
        q.resolve(result);
      }, function(err) {
        q.reject(err);
      }, options);

      return q.promise;
    }
  }
}])

;
