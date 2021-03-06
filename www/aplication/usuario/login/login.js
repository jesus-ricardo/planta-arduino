(function () {
  'use strict';

  angular.module('app')
    .controller('Login', controller);

  function controller($scope, usuarioSrv, $localStorage, routeSrv, toastSrv) {
    $scope.data = {
      nombre: 'juan',
      password: 'juan'
    };
    $scope.registroData = {
      nombre: '',
      apellido1: '',
      apellido2: '',
      password: '',
      email: ''
    };
    $scope.loguear = true;
    $scope.fortalezaPasswordString = 'ninguna';
    $scope.login = login;
    $scope.registrar = registrar;
    $scope.setLoguear = setLoguear;
    $scope.setRegistro = setRegistro;
    $scope.changePassword = changePassword;

    function login() {
      if ($scope.loginForm.$valid) {    
        usuarioSrv.login($scope.data).then(function (user) {
          $localStorage.user = user[0];
          console.log(user[0]);
          toastSrv.success('Conectado');
          routeSrv.go('app.mis-plantas.list');
        }).catch(function (err) {
          toastSrv.error('Login falló');
          toastSrv.error('error' + JSON.stringify(err));
        });
      } else {
        showErrors();
      }
    }

    function showErrors() {
      if ($scope.loginForm.nombre.$invalid) {
        toastSrv.error('Usuario obligatorio');
      } else if ($scope.loginForm.password.$invalid) {
        toastSrv.error('Contraseña obligatoria');
      } else {
        toastSrv.error('Formulario inválido');
      }
    }

    function registrar() {
      if ($scope.loginForm.$valid) {
        usuarioSrv.insertUsuario($scope.registroData).then(function () {
          toastSrv.success('Cuenta creada');
          $scope.loguear = true;
        }).catch(function (err) {  
          toastSrv.error(err.data.message || 'Fallo al crear la cuenta');
        })
      } else {
        showErrorsRegistro();
      }
    }

    function showErrorsRegistro() {
      if ($scope.loginForm.nombreRegistro.$invalid) {
        toastSrv.error('Usuario obligatorio');
      } else if ($scope.loginForm.apellido1Registro.$invalid) {
        toastSrv.error('Primer apellido obligatorio');
      } else if ($scope.loginForm.apellido2Registro.$invalid) {
        toastSrv.error('Segundo apellido invalido');
      } else if ($scope.loginForm.emailRegistro.$invalid) {
        toastSrv.error('Email invalido');
      } else if ($scope.loginForm.passwordRegistro.$invalid) {
        toastSrv.error('Contraseña obligatoria');
      } else {
        toastSrv.error('Formulario inválido');
      }
    }

    function setLoguear() {
      $scope.loguear = true;
    }

    function setRegistro() {
      $scope.loguear = false;
    }
    function changePassword() {
      $scope.strongPassword = scorePassword($scope.registroData.password);
      $scope.fortalezaPasswordString = getFortalezaPassowordString($scope.strongPassword);
    }
    function getFortalezaPassowordString(scorePassword) {
      if (scorePassword == 0) {
        return 'ninguna';
      }else if (scorePassword <= 30) {
        return 'debil';
      } else if (scorePassword > 30 && scorePassword <= 60) {
        return 'media';
      }  else if (scorePassword > 60 && scorePassword <= 80) {
        return 'fuerte';
      } else if (scorePassword > 80) {
        return 'muy fuerte';
      }
      return 'ninguna';
    }
    function scorePassword(pass) {
      var score = 0;
      if (!pass)
        return score;

      // award every unique letter until 5 repetitions
      var letters = {};
      for (var i=0; i<pass.length; i++) {
        letters[pass[i]] = (letters[pass[i]] || 0) + 1;
        score += 5.0 / letters[pass[i]];
      }

      // bonus points for mixing it up
      var variations = {
        digits: /\d/.test(pass),
        lower: /[a-z]/.test(pass),
        upper: /[A-Z]/.test(pass),
        nonWords: /\W/.test(pass),
      };

      var variationCount = 0;
      for (var check in variations) {
        variationCount += (variations[check] == true) ? 1 : 0;
      }
      score += (variationCount - 1) * 10;

      return parseInt(score);
    }
  }
}());
