'use strict';

angular.module('comics')
  .factory('Story', function () {
    var stories = [];

    function Story() {
      this._id = stories.length + 1;
    }

    Story.all = function () {
      return stories;
    };

    Story.find = function (id) {
      for (var i = 0; i < stories.length; i++) {
        if (stories[i] === id) {
          return stories[i];
        }
      }
    };

    return Story;
  });
