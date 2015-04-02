angular.module('starter.controllers', [])

.controller('ActivitiesCtrl', function($scope, activities) {
  $scope.activities = activities;
})
.controller('ActivityAddCtrl', function($scope, $location, $window, Activity) {
  $scope.activity = Activity.new();

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
  	Activity.add(activity, function() {
  		$window.location.href = "#/tab/activities";
  	}, function() {
  		// 失败
  		alert('添加失败！');
  	});
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

// ====================================
// 人员管理
// ------------------------------------
.controller('PersonsCtrl', function($scope, $ionicPopup, $ionicListDelegate, Person, persons) {
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
	  	Person.charge(person, parseFloat(res), function() {
	  		$ionicListDelegate.closeOptionButtons();
	  	}, function() {
	  		// 失败
	  		alert('充值失败!');
	  	});
	  }
	});
  }

})

.controller('PersonAddCtrl', function($scope, $location, $window, Person) {
  $scope.person = Person.new();
  $scope.save = function(person) {
  	Person.add(person, function() {
  		// 添加成功
  		// 这个地方如果使用下面的$location就不会跳转，但是如果把$location代码放到外面就可以跳转（这种情况就不是需要的了）
  		$window.location.href = "#/tab/persons";
  		// $location.path('/tab/persons');
  	}, function() {
  		// 失败
  		alert('添加人员失败！');
  	});
  }
})

.controller('PersonDetailCtrl', function($scope, $stateParams, $location, $window, $ionicPopup, Person) {
  $scope.person = Person.get($stateParams.id);
  $scope.update = function(person) {
	Person.update(person, function() {
  		$window.location.href = "#/tab/persons";
  	}, function() {
  		// 失败
  		alert('更新人员失败！');
  	});
  }

  $scope.showDeleteConfirm = function(person) {
  	var confirmPopup = $ionicPopup.confirm({
		title: '删除确认',
		template: '您确定要删除该人员信息吗?'
	});
	confirmPopup.then(function(res) {
		if(res) {
			Person.remove(person, function() {
				$location.path('/tab/persons');
			}, function() {
		  		// 失败
		  		alert('删除人员失败！');
		  	});
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
