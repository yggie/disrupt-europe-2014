'use strict';

angular.module('comics')
  .constant('COMICS_NEW_ROUTE', {
    templateUrl: 'comics/templates/new-comics.html',
    controller: 'ComicsNewController',
  })
  .controller('ComicsNewController', function ($scope, $location, Scene) {
    document.querySelector('button.file-upload').onclick = function () {
      document.querySelector('input#file-input').click();
    };
    $scope.caption = '';
    $scope.submit = function () {
      Scene.add(new Scene({
        base64Image: canvas.toDataURL('image/png'),
      }));
      $location.path('/scenes');
    };

    function convolveFilter(imageData, kernel) {
      var pixels = imageData.data,
          width = imageData.width,
          height = imageData.height,
          copy = context.getImageData(0, 0, width, height);

      for (var i = 0; i < width; i++) {
        for (var j = 0; j < height; j++) {
          var r = 0,
              g = 0,
              b = 0,
              index = (width*j + i) * 4;

          for (var k = 0; k < 3; k++) {
            for (var l = 0; l < 3; l++) {
              var ymax = j + l - 1,
                  xmax = i + k - 1,
                  offset = (xmax + ymax * width) * 4;

              if (xmax >= 0 && xmax < width && ymax >= 0 && ymax < height) {
                r += pixels[offset + 0] * kernel[k + l*3];
                g += pixels[offset + 1] * kernel[k + l*3];
                b += pixels[offset + 2] * kernel[k + l*3];
              }
            }
          }

          copy.data[index + 0] = r;
          copy.data[index + 1] = g;
          copy.data[index + 2] = b;
        }
      }

      return copy;
    }


    function quantizeImage(imageData, num) {
      var s = Math.round(255 / num),
          pixels = imageData.data;

      for (var i = 0; i < pixels.length; i += 4) {
        pixels[i + 0] = Math.round(pixels[i + 0] / s) * s;
        pixels[i + 1] = Math.round(pixels[i + 1] / s) * s;
        pixels[i + 2] = Math.round(pixels[i + 2] / s) * s;
      }

      return imageData;
    }

    var image = new Image(),
        canvas = document.querySelector('canvas.scene-preview'),
        context = canvas.getContext('2d'),
        mouseDownPoint = {},
        offset = { x: 0, y: 0 },
        bubble = { x: 150, y: 75, sx: 2, sy: 1 },
        Kernels = {
          gaussian: [
            1/16, 1/8, 1/16,
            1/8,  1/4, 1/8,
            1/16, 1/8, 1/16,
          ],
          median: [
            0.1, 0.1, 0.1,
            0.1, 0.1, 0.1,
            0.1, 0.1, 0.1,
          ],
        };

    function render(caption) {
      canvas.width = 640;
      canvas.height = 480;

      var s = Math.min(canvas.height, canvas.width) / Math.min(image.width, image.height);
      context.save();
      context.scale(s, s);
      context.drawImage(image, 0, 0, image.width, image.height);

      var imageData = context.getImageData(0, 0, canvas.width, canvas.height);

      imageData = convolveFilter(imageData,
          [ 0,  2,  0,
            2,  1, -2,
            0, -2,  0]);
      imageData = convolveFilter(imageData, Kernels.gaussian);
      // imageData = convolveFilter(imageData, [1, 1, 1, 0, 0, 0, -1, -1, -1]);
      imageData = quantizeImage(imageData, 8);
      imageData = convolveFilter(imageData, Kernels.gaussian);

      context.putImageData(imageData, 0, 0);

      context.translate(offset.x * image.width / canvas.scrollWidth, offset.y * image.height / canvas.scrollHeight);
      context.save();
      context.scale(bubble.sx, bubble.sy);
      context.beginPath();
      context.arc(bubble.x / (s * bubble.sx), bubble.y / (s * bubble.sy), 80 / s, 0, 2*Math.PI);
      context.restore();

      context.fillStyle = 'white';
      context.fill();
      context.lineWidth = 6 / s;
      context.strokeStyle = 'black';
      context.stroke();

      context.fillStyle = 'black';
      context.font = '' + (36 / s) + 'px sans-serif';
      context.fillText(caption, 50 / s, 60 / s);
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
      console.log(event);
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
