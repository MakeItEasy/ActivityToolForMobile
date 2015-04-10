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
.controller('ActivityDetailCtrl', function($scope, $stateParams, $location, activity, peoples) {
  $scope.activity = activity;
  $scope.paymented = ($scope.activity.paymentFlag == 1);
  $scope.peoples = peoples;
  $scope.joinedUserNames = peoples.map(function(x) {return x.name;}).join(', ')
})
.controller('ActivityDetailSelectPeopleCtrl', function($scope, $stateParams, $q, $location, filterFilter, orderByFilter, DBHelper, Activity, allUsers) {
  // 参加的人员在最上面
  $scope.peoples = orderByFilter(allUsers, '-joined');
  $scope.activityId = $stateParams.id;

  $scope.ensurePeoples = function() {
  	var joinedUsers = filterFilter($scope.peoples, {joined: true});
  	var deferred = $q.defer();
  	DBHelper.dbInstance().transaction(function(fx) {
  		fx.executeSql("delete from activity_users where activityId=?", [$scope.activityId], function(fx, res) {
  			console.log("deleted joined users for activity: " + $scope.activityId);
  			console.log("deleted record: " + res.rowsAffected);
  			if(joinedUsers.length <= 0) {
		    	deferred.resolve("true");
  			} else {
	  			var insertCnt = 0;
	  			for (var i = 0; i < joinedUsers.length; i++) {
	  				console.log("prepare to insert: "  + joinedUsers[i].id);
				    fx.executeSql("INSERT INTO activity_users (activityId, userId) VALUES (?,?)", [$scope.activityId, joinedUsers[i].id], function(fx, res) {
				    	console.log("inserted a user for activity: " + joinedUsers[insertCnt].id);
						  insertCnt++;
						  // 注意这个地方该变量的使用，而不能用i,因为i永远是joinedUser.length，所以会越界
				    	if(insertCnt == joinedUsers.length) {
	  				    	deferred.resolve("true");
				    	}
				    }, function(e) {
			  			console.log("Error: " + JSON.stringify(e));
				    	deferred.reject(JSON.stringify(e));
				    });
		  		};
		  	}
  		}, function(e) {
		  	console.log("Error: " + JSON.stringify(e));
		  	deferred.reject(JSON.stringify(e));
  		});
  	});

  	deferred.promise.then(function(success) {
  		$location.path("/tab/activity/" + $scope.activityId);
  	}, function(error) {
  		alert("失败! 错误信息: " + error);
  	});
  }
})
.controller('ActivityPaymentCtrl', function($scope, $stateParams, $location, $q, $ionicPopup, DBHelper, Activity, peoples) {
  $scope.activity = Activity.get($stateParams.id);
  $scope.peoples = peoples;
  $scope.totalAmount = null;

  $scope.showPaymentConfirm = function(totalAmount) {
    var confirmPopup = $ionicPopup.confirm({
      scope: $scope,
      title: '结算确认',
      template: '结算后将扣除参加人员余额，不可更改。您确定要进行结算吗?'
    });
    confirmPopup.then(function(res) {
      if(res) {
        // 进行结算逻辑
        var deferred = $q.defer();
        DBHelper.dbInstance().transaction(function(fx) {
          fx.executeSql("update activities set paymentFlag=1, fee=?, userCount=? where id=?", [totalAmount, $scope.peoples.length, $scope.activity.id], function(fx, res) {
            fx.executeSql("update users set account=account-? where id in (select userId from activity_users where activityId=?)", [totalAmount/$scope.peoples.length, $scope.activity.id], function(fx, res) {
              deferred.resolve("true");
            }, function(e) {
              console.log("Error: " + JSON.stringify(e));
              deferred.reject(JSON.stringify(e));
            });
          }, function(e) {
            deferred.reject(JSON.stringify(e));
          });
        });

        deferred.promise.then(function(success) {
          $location.path("/tab/activity/" + $scope.activity.id);
        }, function(error) {
          alert("结算失败! 错误信息: " + error);
        });

      }
    });
  };
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
})

.controller('SettingCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
