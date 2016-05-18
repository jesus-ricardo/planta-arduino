(function () {
  'use strict';

  angular.module('app')
    .config(config);

  function config($stateProvider) {
    $stateProvider.state('app.mis-plantas.nueva-planta', {
      url: '/nueva-planta/',
      templateUrl: '/aplication/mis-plantas/nueva-planta/nueva-planta.html',
      controller: 'NuevaPlanta',
      resolve: {
        // planta: function (misPlantasSrv) {
        //   return misPlantasSrv.get();
        // }
      }
    });
  }
}());