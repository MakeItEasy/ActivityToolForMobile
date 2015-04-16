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

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {


  $ionicConfigProvider.tabs.position("bottom"); //Places them at the bottom for all OS
  $ionicConfigProvider.tabs.style("standard"); //Makes them all look the same across all OS
  $ionicConfigProvider.navBar.alignTitle("center");
  $ionicConfigProvider.backButton.previousTitleText(true);

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
    cache: false,
    url: '/activities',
    views: {
      'tab-activities': {
        templateUrl: 'templates/tab-activities.html',
        controller: 'ActivitiesCtrl',
        resolve: {
          // 异步读取db数据，直到读取成功后才注入到controller中
          activities: function(Activity) {
            return Activity.all();
          }
        }
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
    cache: false,
    url: '/activity/:id',
    views: {
      'tab-activities': {
        templateUrl: 'templates/activity/show.html',
        controller: 'ActivityDetailCtrl',
        resolve: {
          // 异步读取db数据，直到读取成功后才注入到controller中
          activity: function($stateParams, Activity) {
            return Activity.activityPromise($stateParams.id);
          },
          users: function($stateParams, Activity) {
            return Activity.usersPromise($stateParams.id);
          }        
        }
      }
    }
  })
  .state('tab.activity-payment', {
    cache: false,
    url: '/activity/:id/payment',
    views: {
      'tab-activities': {
        templateUrl: 'templates/activity/payment.html',
        controller: 'ActivityPaymentCtrl',
        resolve: {
          // 异步读取db数据，直到读取成功后才注入到controller中
          users: function($stateParams, Activity) {
            return Activity.usersPromise($stateParams.id);
          }        
        }
      }
    }
  })
  .state('tab.activity-detail-selectUser', {
    cache: false,
    url: '/activity/:id/users',
    views: {
      'tab-activities': {
        templateUrl: 'templates/activity/users.html',
        controller: 'ActivityDetailSelectUserCtrl',
        resolve: {
          // 异步读取db数据，直到读取成功后才注入到controller中
          allUsers: function($stateParams, Activity) {
            return Activity.allUsersPromise($stateParams.id);
          }        
        }
      }
    }
  })
  .state('tab.activity-notice', {
    cache: false,
    url: '/activity/:id/notice/:type',
    views: {
      'tab-activities': {
        templateUrl: 'templates/activity/notice.html',
        controller: 'ActivityNoticeCtrl',
        resolve: {
          // 异步读取db数据，直到读取成功后才注入到controller中
          activity: function($stateParams, Activity) {
            return Activity.activityPromise($stateParams.id);
          },
          users: function($stateParams, Activity) {
            return Activity.usersPromise($stateParams.id);
          }        
        }
      }
    }
  })

  .state('tab.users', {
      cache: false,
      url: '/users',
      views: {
        'tab-users': {
          templateUrl: 'templates/tab-users.html',
          controller: 'UsersCtrl',
          resolve: {
            // 异步读取db数据，直到读取成功后才注入到controller中
            users: function(User) {
              return User.all();
            }
          }
        }
      }
    })
  .state('tab.user-new', {
    url: '/user/new',
    views: {
      'tab-users': {
        templateUrl: 'templates/user/new.html',
        controller: 'UserAddCtrl'
      }
    }
  })
  .state('tab.user-detail', {
    cache: false,
    url: '/user/:id',
    views: {
      'tab-users': {
        templateUrl: 'templates/user/show.html',
        controller: 'UserDetailCtrl'
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
  })
  .state('tab.setting-notice-account', {
    url: '/setting/notice/account',
    views: {
      'tab-setting': {
        templateUrl: 'templates/setting/notice_account.html',
        controller: 'SettingNoticeAccountCtrl',
        resolve: {
          // 异步读取db数据，直到读取成功后才注入到controller中
          users: function(User) {
            return User.all();
          }
        }
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/activities');

});
