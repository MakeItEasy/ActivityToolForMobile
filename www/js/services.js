angular.module('starter.services', ['services.db'])

.factory('Person', function(DBHelper, $q) {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var persons = [{
    id: 1,
    name: '代如刚',
    telephone: '18100000001',
    email: 'user1@test.com',
    account: 100
  }, {
    id: 2,
    name: '李凌',
    telephone: '18100000002',
    email: 'user2@test.com',
    account: 200
  }];

  var currentId = 3;

  return {
    new: function() {
      return {name: '', telephone: '', email: '', account: 0};
    },

    all: function() {
      var deferred = $q.defer();
      DBHelper.dbInstance().executeSql("select * from users order by id asc;", [], function(res) {
        deferred.resolve(DBHelper.convertResToArray(res)); 
      });
      return deferred.promise;
    },
    remove: function(person) {
      persons.splice(persons.indexOf(person), 1);
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
      alert("before");
      alert(JSON.stringify(data));
      DBHelper.dbInstance().executeSql("INSERT INTO users (name, telephone, email) VALUES (?,?,?)",
        [data.name, data.telephone, data.email], function(res) {
        console.log("Insert people success:" + JSON.stringify(res));
        data.id = res.insertId;
        successCallback();
      }, function(e) {
        console.log("ERROR: " + e.message);
        errorCallback();
      });
    }
  };
})

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
