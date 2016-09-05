/*
 * Copyright (c) 2016 ROMSOFT.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the The MIT License (MIT).
 * which accompanies this distribution, and is available at
 * http://opensource.org/licenses/MIT
 *
 * Contributors:
 *    RAFAEL MASTALERU (ROMSOFT)
 * Initially developed in the context of OPERANDO EU project www.operando.eu
 */


angular.module("operando").
controller("accountCtrl", ["$scope","messengerService", function($scope, messengerService){

    $scope.emailIsEditMode = false;
    $scope.passwordIsEditMode = false;
    $scope.phoneIsEditMode = true;

    messengerService.send("getCurrentUser",{}, function(user){
        $scope.user = user;
        $scope.$apply();
    });


    $scope.changeEmailState = function(){
        $scope.emailIsEditMode = !$scope.emailIsEditMode;
    }

    $scope.changePassword = function () {
        $scope.passwordIsEditMode = !$scope.passwordIsEditMode;
    }

    $scope.savePassword = function () {
        $scope.passwordIsEditMode = !$scope.passwordIsEditMode;
    }
    $scope.changePhoneState = function(){
        $scope.phoneIsEditMode = !$scope.phoneIsEditMode;
    }



}]);

