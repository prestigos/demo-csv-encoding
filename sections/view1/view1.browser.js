/*jslint node: true, indent: 2, nomen:true */
/*global FileReader, document*/
'use strict';
var Bacon = require('baconjs').Bacon,
  csv = require('csv-string'),
  encoding = require("legacy-encoding");

function someCtrl($scope, $http) {
  var scope = $scope;

  $scope.send = function () {
    var datos = scope.content;

    scope.content = [];
    scope.exito = false;

    if (scope.timeOut !== false) {
      clearTimeout(scope.timeOut);
      scope.timeOut = false;
    }
    $http({
      data    : datos,
      method  : 'POST',
      url     : '/view1/api'
    }).success(function (res) {
      scope.datos = false;
      scope.working = false;

      if (res.done === true) {
        scope.exito = true;
      }
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
        var resultBuffer;

        resultBuffer = encoding.encode(x.target.result, 'utf-8');
        contenido = contenido.concat(csv.parse(resultBuffer.toString('utf-8')));
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
