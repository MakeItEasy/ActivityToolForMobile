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
    },
    // 拷贝文件，url都是绝对路径，而且不要是file://打头的,应该是比如：data/dir1/dir2
    copyFileTo: function(fromUrl, toDir, fileName, successCallback, failCallback) {
      var fileSys;
      var fileSrc;

      var fail = function(error) {
        // 失败
        console.log("copyFile error:"+JSON.stringify(error));
        alert("copyFile error:"+JSON.stringify(error));
      }
      window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
        // 文件系统request成功
        console.log("文件系统request成功");
        fileSys = fileSystem;
        fileSystem.root.getFile(fromUrl, null, function(fileEntry) {
          // 取得源文件成功
          console.log("取得源文件成功");
          fileSrc = fileEntry;
          var a = new DirManager();
          a.create_r(toDir,function(dirEntry) {
            console.log("create dir success" + dirEntry.toURL());
            // 创建目录成功, 拷贝文件
            console.log("创建目录成功, 拷贝文件");
            fileSrc.moveTo(dirEntry, fileName, successCallback, failCallback);
          }, fail);
        }, fail);
      }, fail);
    }
  }

});

