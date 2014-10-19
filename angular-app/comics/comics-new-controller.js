'use strict';

angular.module('comics')
  .constant('COMICS_NEW_ROUTE', {
    templateUrl: 'comics/templates/new-comics.html',
    controller: 'ComicsNewController',
  })
  .controller('ComicsNewController', function ($scope, $location, Scene) {
    $scope.submit = function () {
      Scene.add(new Scene({
        base64Image: canvas.toDataURL('image/png'),
      }));
      $location.path('/scenes');
    };

    var image = new Image(),
        canvas = document.querySelector('canvas'),
        context = canvas.getContext('2d');

    image.onload = function () {
      canvas.width = 640;
      canvas.height = 480;

      var s = Math.min(canvas.height, canvas.width) / Math.min(image.width, image.height);
      context.save();
      context.scale(s, s);
      context.drawImage(image, 0, 0, image.width, image.height);

      context.save();
      context.scale(2, 1);
      context.beginPath();
      context.arc(200, 200, 200, 0, 2*Math.PI);
      context.restore();

      context.fillStyle = 'white';
      context.fill();
      context.lineWidth = 4;
      context.strokeStyle = 'black';
      context.stroke();
      context.restore();
    };

    angular.element(document.querySelector('#custom')).on('change', function (event) {
      var reader = new FileReader();
      reader.onload = function (ev) {
        image.src = ev.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    });
  });
