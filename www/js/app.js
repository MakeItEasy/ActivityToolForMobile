// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html"
  })

  // Each tab has its own nav history stack:

  .state('tab.activities', {
    url: '/activities',
    views: {
      'tab-activities': {
        templateUrl: 'templates/tab-activities.html',
        controller: 'ActivitiesCtrl'
      }
    }
  })
  .state('tab.activity-new', {
    url: '/activity/new',
    views: {
      'tab-activities': {
        templateUrl: 'templates/activity/new.html',
        controller: 'ActivityAddCtrl'
      }
    }
  })
  .state('tab.activity-detail', {
    url: '/activity/:id',
    views: {
      'tab-activities': {
        templateUrl: 'templates/activity/show.html',
        controller: 'ActivityDetailCtrl'
      }
    }
  })
  .state('tab.activity-detail-selectPeople', {
    url: '/activity/:id/peoples',
    views: {
      'tab-activities': {
        templateUrl: 'templates/activity/peoples.html',
        controller: 'ActivityDetailSelectPeopleCtrl'
      }
    }
  })

  .state('tab.persons', {
      cache: false,
      url: '/persons',
      views: {
        'tab-persons': {
          templateUrl: 'templates/tab-persons.html',
          controller: 'PersonsCtrl',
          resolve: {
            // 异步读取db数据，直到读取成功后才注入到controller中
            persons: function(Person) {
              return Person.all();
            }
          }
        }
      }
    })
  .state('tab.person-new', {
    url: '/person/new',
    views: {
      'tab-persons': {
        templateUrl: 'templates/person/new.html',
        controller: 'PersonAddCtrl'
      }
    }
  })
  .state('tab.person-detail', {
    url: '/person/:id',
    views: {
      'tab-persons': {
        templateUrl: 'templates/person/show.html',
        controller: 'PersonDetailCtrl'
      }
    }
  })

  .state('tab.setting', {
    url: '/setting',
    views: {
      'tab-setting': {
        templateUrl: 'templates/tab-setting.html',
        controller: 'SettingCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/activities');

});
