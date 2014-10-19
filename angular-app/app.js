'use strict';

angular.module('app', ['ngRoute', 'comics'])
  .config(function ($routeProvider, COMICS_ROUTE, COMICS_NEW_ROUTE) {
    $routeProvider
      .when('/', COMICS_NEW_ROUTE)
      .when('/scenes', COMICS_ROUTE)
      .otherwise({ redirectTo: '/' });
  });
