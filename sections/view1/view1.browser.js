/*jslint node: true, indent: 2, nomen:true */
/*global FileReader, document*/
'use strict';
var Bacon = require('baconjs').Bacon;

function someCtrl($scope, $http) {
  var scope = $scope;

  $scope.send = function () {
    $http({
      data    : $scope.ask,
      method  : 'POST',
      url     : '/view1/api'
    }).success(function () {
      return;
    });
  };

  scope.onFileSelect = function (files) {
    var listener, eventosArray, eventos, contenido = [];

    // Resetear las variables
    scope.content = [];
    scope.archivosInvalidos = [];
    scope.$apply();

    listener = function () {
      return function (x) {
        contenido = contenido.concat(x.target.result);
      };
    };

    eventosArray = files.reduce(function (eventos, archivo) {
      var reader, readerBacon;

      reader = new FileReader();
      readerBacon = Bacon.fromEventTarget(reader, 'load');
      readerBacon.onValue(listener(archivo.name));
      try {
        reader.readAsBinaryString(archivo);
        eventos.push(readerBacon);
      } catch (e) {
        scope.archivosInvalidos.push(archivo.name);
      }
      return eventos;
    }, []);


    // Objeto Bacon para los eventos. Se hara un evento `end` cuando
    // se hayan convertidos todos los archivos que si son validos.
    eventos = Bacon.mergeAll.apply(Bacon, eventosArray).take(eventosArray.length);



    // Ya se procesaron todos los archivos, ahora hay que actualizar la vista.
    eventos.onEnd(function () {
      scope.content = JSON.stringify(contenido, null, ' ');
      scope.$apply();
    });
  };
}

module.exports = function (app) {
  app.config(function ($routeProvider) {
    $routeProvider.when('/view1', { controller : someCtrl, templateUrl : '/html/view1/partial1.html' });
  });
};
