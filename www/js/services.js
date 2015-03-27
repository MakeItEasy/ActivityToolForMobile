angular.module('starter.services', [])

.factory('Person', function() {
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
    all: function() {
      return persons;
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
    add: function(data) {
      data.id = currentId;
      currentId++;
      persons.push(data)
    }
  };
})

.factory('Activity', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var activities = [{
    id: 1,
    name: '羽毛球活动',
    date: Date.now()
  }, {
    id: 2,
    name: '聚餐活动',
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
