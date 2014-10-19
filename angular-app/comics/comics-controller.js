'use strict';

angular.module('comics')
  .constant('COMICS_ROUTE', {
    templateUrl: 'comics/templates/comics-index.html',
    controller: 'ComicsController',
    resolve: {
      scenes: function (Scene) {
        return Scene.all();
      },
    }
  })
  .controller('ComicsController', function ($scope, scenes) {
    $scope.scenes = scenes;
  });
