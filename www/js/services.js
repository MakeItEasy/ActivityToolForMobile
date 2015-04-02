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
      DBHelper.dbInstance().executeSql("select * from users order by id asc;", [], function(res) {
        persons = DBHelper.convertResToArray(res);
        deferred.resolve(persons);
      });
      return deferred.promise;
    },
    remove: function(person, successCallback, errorCallback) {
      DBHelper.dbInstance().executeSql("delete from users where id = ?;", [person.id], function(res) {
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
    add: function(data, successCallback, errorCallback) {
      // 插入数据
      DBHelper.dbInstance().executeSql("INSERT INTO users (name, telephone, email) VALUES (?,?,?)",
        [data.name, data.telephone, data.email], function(res) {
        successCallback();
      }, function(e) {
        console.log("ERROR: " + e.message);
        errorCallback();
      });
    },
    update: function(data, successCallback, errorCallback) {
      DBHelper.dbInstance().executeSql("UPDATE users SET name=?, telephone=?, email=? WHERE id=?",
        [data.name, data.telephone, data.email, data.id], function(res) {
        successCallback();
      }, function(e) {
        console.log("ERROR: " + e.message);
        errorCallback();
      });
    }
  };
})

// ====================================
// 活动管理
// ------------------------------------
.factory('Activity', function(DBHelper) {
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
    all: function() {
      return activities;
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
    add: function(data) {
      data.id = currentId;
      currentId++;
      activities.push(data)
    }
  };
});
