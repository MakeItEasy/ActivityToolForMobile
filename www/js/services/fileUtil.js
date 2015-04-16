angular.module('services.fileUtil', [])

.factory('FileUtil', function($q) {
  return {
    getRootPathPromise: function() {
      var deferred = $q.defer();

      window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
        function(fileSystem) {
          // 成功
          rootEntry = fileSystem.root;
          deferred.resolve(fileSystem.root);
        }, function(error) {
          // 失败
          console.log("requestFileSystem error:"+JSON.stringify(error));
          deferred.reject(error);
        });
    
      return deferred.promise;
    }
  }

});

