angular.module('starter.controllers', ['datePicker'])

.controller('ActivitiesCtrl', function($scope, Activity) {
  $scope.activities = Activity.all();

})
.controller('ActivityAddCtrl', function($scope, $location, $ionicModal, Activity) {
  $scope.activity = {name: '', catagory: '羽毛球', date: new Date()};

  $scope.myDate = '2014-5-4';
	$ionicModal.fromTemplateUrl('templates/datemodal.html', 
        function(modal) {
            $scope.datemodal = modal;
        },
        {
        // Use our scope for the scope of the modal to keep it simple
        scope: $scope, 
        // The animation we want to use for the modal entrance
        animation: 'slide-in-up'
        }
    );
    $scope.opendateModal = function() {
      $scope.datemodal.show();
    };
    $scope.closedateModal = function(modal) {
    	alert(modal);
      $scope.datemodal.hide();
      $scope.activity.date = modal;
    };



  /*
  var options = {
    date: new Date(),
    mode: 'date'
  };

  datePicker.show(options, function(date){
    alert("date result " + date);  
  });
  */


  $scope.save = function(person) {
  	Activity.add(activity);
  	$location.path('/tab/activities');
  }
})

.controller('PersonsCtrl', function($scope, $ionicPopup, $ionicListDelegate, Person) {
  $scope.persons = Person.all();
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
})

.controller('PersonAddCtrl', function($scope, $location, Person) {
  $scope.person = {name: '', telephone: '', account: 0, email: ''};
  $scope.save = function(person) {
  	Person.add(person);
  	$location.path('/tab/persons');
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
