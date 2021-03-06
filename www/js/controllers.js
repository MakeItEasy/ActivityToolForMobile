angular.module('starter.controllers', ['datePicker', 'services.fileUtil'])

.controller('ActivitiesCtrl', function($scope, activities) {
  $scope.activities = activities;
})
.controller('ActivityAddCtrl', function($scope, $location, $window, $q, Activity) {
  $scope.activity = Activity.new();
  $scope.isIOS = ionic.Platform.isIOS();
  $scope.isAndroid = ionic.Platform.isAndroid();

  // 针对ios平台，设置活动时间
  $scope.showDatePickerForIOS = function() {
    function asyncShowDatePicker() {
      var deferred = $q.defer();
      var options = {
        date: $scope.activity.date,
        // minDate: new Date(),
        mode: 'datetime'
      };
    
      datePicker.show(options, function(date){
        $scope.activity.date = date;
        deferred.resolve();
      });
      return deferred.promise;
    }
    asyncShowDatePicker().then(function() {
      // nothing to do
    });
  };
  // 针对Android平台，设置活动日期
  $scope.showDatePickerForAndroid = function() {
    function asyncShowDatePicker() {
      var deferred = $q.defer();
      var options = {
        mode: 'date',
        // minDate: new Date(),
        date: $scope.activity.date
      };
    
      datePicker.show(options, function(date){
        if(date != "Invalid Date") {
          $scope.activity.date.setFullYear(date.getFullYear());
          $scope.activity.date.setMonth(date.getMonth());
          $scope.activity.date.setDate(date.getDate());
        }
        deferred.resolve();
      });
      return deferred.promise;
    }
    asyncShowDatePicker().then(function() {
      // nothing to do
    });
  };
  
  // 针对Android平台，设置活动时间
  $scope.showTimePickerForAndroid = function() {
    function asyncShowDatePicker() {
      var deferred = $q.defer();
      var options = {
        date: $scope.activity.date,
        mode: 'time'
      };
    
      datePicker.show(options, function(date){
        if(date != "Invalid Date") {
          $scope.activity.date.setHours(date.getHours());
          $scope.activity.date.setMinutes(date.getMinutes());
          $scope.activity.date.setSeconds(date.getSeconds());
        }
        deferred.resolve();
      });
      return deferred.promise;
    }
    asyncShowDatePicker().then(function() {
      // nothing to do
    });
  };

  $scope.save = function(activity) {
  	Activity.add(activity, function() {
  		$window.location.href = "#/tab/activities";
  	}, function() {
  		// 失败
  		alert('添加失败！');
  	});
  }
})
.controller('ActivityDetailCtrl', function($scope, $stateParams, $location, $ionicPopup, Activity, activity, users) {
  $scope.activity = activity;
  $scope.paymented = ($scope.activity.paymentFlag == 1);
  $scope.users = users;
  $scope.joinedUserNames = users.map(function(x) {return x.name;}).join(', ');

  $scope.showDeleteConfirm = function(activity) {
    var confirmPopup = $ionicPopup.confirm({
      title: '删除确认',
      template: '您确定要删除该活动信息吗?'
    });
    confirmPopup.then(function(res) {
      if(res) {
        Activity.remove(activity, function() {
          $location.path('/tab/activities');
        }, function() {
          // 失败
          alert('删除活动失败！');
        });
      }
    });
  };

})
.controller('ActivityDetailSelectUserCtrl', function($scope, $stateParams, $q, $location, filterFilter, orderByFilter, DBHelper, Activity, allUsers) {
  // 参加的人员在最上面
  $scope.users = orderByFilter(allUsers, '-joined');
  $scope.activityId = $stateParams.id;
  $scope.users.forEach(function(u) { u.avatar += "?" + Date.now();});

  $scope.ensureUsers = function() {
  	var joinedUsers = filterFilter($scope.users, {joined: true});
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
.controller('ActivityPaymentCtrl', function($scope, $stateParams, $location, $q, $ionicPopup, DBHelper, Activity, users) {
  $scope.activity = Activity.get($stateParams.id);
  $scope.users = users;
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
          fx.executeSql("update activities set paymentFlag=1, fee=?, userCount=? where id=?", [totalAmount, $scope.users.length, $scope.activity.id], function(fx, res) {
            fx.executeSql("update users set account=account-? where id in (select userId from activity_users where activityId=?)", [totalAmount/$scope.users.length, $scope.activity.id], function(fx, res) {
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
.controller('ActivityNoticeCtrl', function($scope, $stateParams, activity, users) {
  $scope.activity = activity;
  $scope.users = users;
  // 1:邀请通知 2:参加人员通知 3:结算通知
  $scope.noticeType = $stateParams.type;
  $scope.currentDate = Date.now();
  $scope.joinedUserNames = users.map(function(x) {return x.name;}).join(', ');

  $scope.copy = function(noticeType) {
    var txtArea = document.getElementById("notice"+noticeType);
    cordova.plugins.clipboard.copy(txtArea.value, function(text){
      // 拷贝成功
      // alert('success:'+text);
    }, function(err){
      alert('拷贝出错:'+err);
    });
  }
})

// ====================================
// 人员管理
// ------------------------------------
.controller('UsersCtrl', function($scope, $ionicPopup, $ionicListDelegate, User, users) {
  $scope.users = users;
  users.forEach(function(u) { u.avatar += "?" + Date.now();});

  $scope.charge = function(user) {
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
  	  	User.charge(user, parseFloat(res), function() {
  	  		$ionicListDelegate.closeOptionButtons();
  	  	}, function() {
  	  		// 失败
  	  		alert('充值失败!');
  	  	});
  	  }
  	});
  }

})

.controller('UserAddCtrl', function($scope, $location, $window, $ionicPopup, User) {
  $scope.user = User.new();
  $scope.save = function(user) {
    var msg = User.validate(user);
    if(msg != "") {
      var alertPopup = $ionicPopup.alert({
        title: '验证错误',
        template: msg
      });
      alertPopup.then(function(res) {
        // nothing to do
      });
    } else {
      User.add(user, function() {
        // 添加成功
        // 这个地方如果使用下面的$location就不会跳转，但是如果把$location代码放到外面就可以跳转（这种情况就不是需要的了）
        $window.location.href = "#/tab/users";
        // $location.path('/tab/users');
      }, function() {
        // 失败
        alert('添加人员失败！');
      });
    }
  }
})

.controller('UserDetailCtrl', function($scope, $stateParams, $location, $window, $ionicPopup, User, MyCamera, FileUtil) {
  $scope.user = User.get($stateParams.id);
  $scope.user.avatar += "?" + Date.now();
  $scope.update = function(user) {
    var msg = User.validate(user);
    if(msg != "") {
      var alertPopup = $ionicPopup.alert({
        title: '验证错误',
        template: msg
      });
      alertPopup.then(function(res) {
        // nothing to do
      });
    } else {
  	  User.update(user, function() {
    		$window.location.href = "#/tab/users";
    	}, function() {
    		// 失败
    		alert('更新人员失败！');
    	});
    }
  }

  $scope.showDeleteConfirm = function(user) {
  	var confirmPopup = $ionicPopup.confirm({
  		title: '删除确认',
  		template: '您确定要删除该人员信息吗?'
  	});
	  confirmPopup.then(function(res) {
		  if(res) {
  			User.remove(user, function() {
  				$location.path('/tab/users');
  			}, function() {
		  		// 失败
		  		alert('删除人员失败！');
		  	});
    	}
	  });
  };

  $scope.getPhoto = function(user) {


    var opts = {  quality : 100,
                  destinationType : Camera.DestinationType.FILE_URL,
                  sourceType : Camera.PictureSourceType.CAMERA,
                  allowEdit : true,
                  encodingType: Camera.EncodingType.PNG,
                  targetWidth: 300,
                  targetHeight: 300,
                  // popoverOptions: CameraPopoverOptions,
                  saveToPhotoAlbum: false 
                };

    MyCamera.getPicture(opts).then(function(imageURI) {
      var strUrl = imageURI.replace(/file:\/\//, '');
      FileUtil.copyFileTo(strUrl, "data/com.makeiteasy.activityTool/avatars", user.id+".png", function(fileEntry) {
        console.log("copy success: " + fileEntry.toURL());
        user.avatar = fileEntry.toURL();
        User.updateAvatar(user);
        document.getElementById("avatar").src = fileEntry.toURL() + "?" + Date.now();
      }, function(error) {
        console.log("copy fail:" + error);
      });
    }, function(err) {
      // 取消照相 nothing to do
      console.log("camera error: " + err);
    });

  };
})

// ====================================
// 设置管理
// ------------------------------------
.controller('SettingCtrl', function($scope) {
})
.controller('SettingNoticeAccountCtrl', function($scope, $filter, users) {
  $scope.joinedUserAccountInfos = users.map(function(x) {return x.name + ":     " + $filter('currency')(x.account, "¥", 2);}).join('\r\n');
  $scope.currentDate = Date.now();

  $scope.copy = function() {
    var txtArea = document.getElementById("notice");
    cordova.plugins.clipboard.copy(txtArea.value, function(text){
      // 拷贝成功
      // alert('success:'+text);
    }, function(err){
      alert('拷贝出错:'+err);
    });
  }
});



