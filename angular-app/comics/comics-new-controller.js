'use strict';

angular.module('comics')
  .constant('COMICS_NEW_ROUTE', {
    templateUrl: 'comics/templates/new-comics.html',
    controller: 'ComicsNewController',
  })
  .controller('ComicsNewController', function ($scope, $location, Scene) {
    $scope.caption = '';
    $scope.submit = function () {
      Scene.add(new Scene({
        base64Image: canvas.toDataURL('image/png'),
      }));
      $location.path('/scenes');
    };

    var image = new Image(),
        canvas = document.querySelector('canvas.scene-preview'),
        context = canvas.getContext('2d'),
        mouseDownPoint = {},
        offset = { x: 0, y: 0 },
        bubble = { x: 200, y: 100, sx: 2, sy: 1 };


    function render(caption) {
      canvas.width = 640;
      canvas.height = 480;

      var s = Math.min(canvas.height, canvas.width) / Math.min(image.width, image.height);
      context.save();
      context.scale(s, s);
      context.drawImage(image, 0, 0, image.width, image.height);

      context.translate(offset.x * image.width / canvas.scrollWidth, offset.y * image.height / canvas.scrollHeight);
      context.save();
      context.scale(bubble.sx, bubble.sy);
      context.beginPath();
      context.arc(bubble.x / bubble.sx, bubble.y / bubble.sy, 100, 0, 2*Math.PI);
      context.restore();

      context.fillStyle = 'white';
      context.fill();
      context.lineWidth = 4;
      context.strokeStyle = 'black';
      context.stroke();

      context.fillStyle = 'black';
      context.font = '48px sans-serif';
      context.fillText(caption, 100, 100);
      context.restore();
    }

    image.onload = function () {
      render($scope.caption);
    };

    function onDragBubble(event) {
      offset.x = event.x - mouseDownPoint.x;
      offset.y = event.y - mouseDownPoint.y;
      render($scope.caption);
      return false;
    };

    function onMouseMove(event) {
    };

    function onTouchStart(event) {
      mouseDownPoint.x = event.x - offset.x;
      mouseDownPoint.y = event.y - offset.y;
      canvas.onmousemove = onDragBubble;
      canvas.ontouchmove = function (event) {
        onDragBubble({
          x: event.targetTouches[0].clientX,
          y: event.targetTouches[0].clientY,
        });
      };
    };

    function onTouchEnd(event) {
      canvas.onmousemove = onMouseMove;
      canvas.ontouchmove = onMouseMove;
    };

    canvas.onmousedown = onTouchStart;
    canvas.ontouchstart = function (event) {
      onTouchStart({ x: event.targetTouches[0].clientX, y: event.targetTouches[0].clientY });
    };

    canvas.onmouseup = onTouchEnd;

    angular.element(document.querySelector('#file-input')).on('change', function (event) {
      var reader = new FileReader();
      reader.onload = function (ev) {
        image.src = ev.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    });

    $scope.$watch('caption', function (caption) {
      if (image.src) {
        render(caption);
      }
    });
  });
