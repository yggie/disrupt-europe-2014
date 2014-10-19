'use strict';

angular.module('comics')
  .factory('Scene', function () {
    var scenes = [];

    function Scene(data) {
      this._id = scenes.length + 1;
      this._data = data;
    }

    Scene.all = function () {
      return scenes;
    };

    Scene.find = function (id) {
      for (var i = 0; i < scenes.length; i++) {
        if (scenes[i]._id === id) {
          return scenes[i];
        }
      }
    };

    Scene.add = function (scene) {
      scenes.push(scene);
    };

    Scene.prototype.base64Image = function () {
      return this._data.base64Image;
    };

    return Scene;
  });
