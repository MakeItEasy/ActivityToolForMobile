angular.module('starter.controllers', [])

.controller('ActivitiesCtrl', function($scope, Activity) {
  $scope.activities = Activity.all();

})
.controller('ActivityAddCtrl', function($scope, $location, Activity) {
  $scope.activity = {catagory: '羽毛球', date: new Date()};

  /* 暂时不使用datePicker插件
  var options = {
    date: new Date(),
    mode: 'datetime'
  };

  $scope.showDatePicker = function() {
	// alert("test");
	// $scope.activity.date = new Date();
	
	datePicker.show(options, function(date){
    	$scope.activity.date = date;
  	});
	
  };
  */

  $scope.save = function(activity) {
  	Activity.add(activity);
  	$location.path('/tab/activities');
  }
})
.controller('ActivityDetailCtrl', function($scope, $stateParams, $location, $ionicPopup, Activity) {
  $scope.activity = Activity.get($stateParams.id);
})
.controller('ActivityDetailSelectPeopleCtrl', function($scope, $stateParams, $location, $ionicPopup, Activity, Person) {
  $scope.activity = Activity.get($stateParams.id);
  $scope.peoples = Person.all();

  $scope.peoples.forEach(function(e) {
  	e.joined = true;
  });

  $scope.ensurePeoples = function() {
  	// $location.path("/tab/activity/{{$scope.activity.id}}");
  }
})

.controller('PersonsCtrl', function($scope, $ionicPopup, $ionicListDelegate, Person, persons) {
  console.log('=====[controllers]PersonCtrl start');
  $scope.persons = persons;

  $scope.remove = function(person) {
    Person.remove(person);
  }
  $scope.charge = function(person) {
  	$scope.data = {};
    // An elaborate, custom popup
	var myPopup = $ionicPopup.show({
		template: '<input type="number" ng-model="data.account">',
		title: '请输入充值金额',
		scope: $scope,
		buttons: [
		  { text: '取消' },
		  {
		    text: '<b>充值</b>',
		    type: 'button-positive',
		    onTap: function(e) {
		      return $scope.data.account;
		    }
		  }
		]
	});
	
	myPopup.then(function(res) {
	  if(res) {
	  	person.account += parseFloat(res);
	  }
	  $ionicListDelegate.closeOptionButtons();
	});
  }

  console.log('=====[controllers]PersonCtrl end');

})

.controller('PersonAddCtrl', function($scope, $location, Person) {
  $scope.person = Person.new();
  $scope.save = function(person) {
  	Person.add(person, function() {
  		// 添加成功
  		$location.path('/tab/persons');
  	}, function() {
  		// 失败
  		alert('添加人员失败！');
  	});
  }
})

.controller('PersonDetailCtrl', function($scope, $stateParams, $location, $ionicPopup, Person) {
  $scope.person = Person.get($stateParams.id);

  $scope.update = function(person) {
  	$location.path('/tab/persons');
  }

  $scope.showDeleteConfirm = function(person) {
  	var confirmPopup = $ionicPopup.confirm({
		title: '删除确认',
		template: '您确定要删除该人员信息吗?'
	});
	confirmPopup.then(function(res) {
		if(res) {
			Person.remove(person);
			$location.path('/tab/persons');
    	}
	});
  };

  $scope.remove = function(person) {
    Person.remove(person);
    $location.path('/tab/persons');
  }
})

.controller('SettingCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
