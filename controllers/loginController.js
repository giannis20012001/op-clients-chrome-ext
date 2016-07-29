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


angular.module("op-popup").controller("loginCtrl", ["$scope", 'messengerService', function($scope, messengerService){

    $scope.user = {};
    $scope.isAuthenticated = false;

    $scope.info = {
        message: "",
        status: ""
    };

    $scope.loginAreaState = "loggedout";

    //show login form
    $scope.show_login = function () {
        $scope.loginAreaState = "login_form";
    }

    $scope.cancel = function () {
        $scope.loginAreaState = "loggedout";
    }

    clearInfoPanel = function(){
        setTimeout(function(){
            //reset to default
            //TODO this in UI
            //add fade effect
            $scope.info={
                status:"",

                message:""
            }
            $scope.$apply();
        },2000);
    }

    securityErrorFunction = function () {
        $scope.info.message = 'Invalid user or password...';
        $scope.info.status = "error";
        $scope.$apply();
    }

    errorFunction = function () {
        $scope.info.message = 'Connection lost...';
        $scope.info.status = "error";
        $scope.$apply();
    }

    successFunction = function () {
        messengerService.send("getCurrentUser",{}, function(user){
            $scope.loginAreaState = "loggedin";
            $scope.user.username = user.userName;
            $scope.isAuthenticated = true;
            $scope.$apply();
        });
    }

    reconnectFunction = function(){
        $scope.info.status = "success";
        $scope.info.message = 'Connected...';
        $scope.$apply();
        clearInfoPanel();
    }


    $scope.login = function () {

        messengerService.send("login", {
            username: $scope.user.email,
            password: $scope.user.password
        }, function (response) {
            if (response.success) {
                successFunction();
            }
            else if (response.error)
                securityErrorFunction();
        });

    }

    $scope.show_register = function(){
        $scope.loginAreaState = "register_form";
    }

    $scope.register = function(){

        var successFunction = function(){
            $scope.loginAreaState = "login_form";
            $scope.info.status = "success";
            $scope.info.message = 'Registration was successful!';
            clearInfoPanel();
            $scope.$apply();
        }

        var errorFunction = function(errorMessage){
            $scope.info.message = errorMessage;
            $scope.info.status = "error";
            $scope.$apply();
        }

        messengerService.send("registerUser",{user:$scope.user}, function(response){

            if(response.status == "success"){
                successFunction();
            }
            else if(response.status == "error"){
                errorFunction(response.message);
            }
        });

    }

    $scope.logout = function(){
        messengerService.send("logout",{},function(){
            $scope.loginAreaState = "loggedout";
            $scope.isAuthenticated = false;
            $scope.user = {};
            $scope.$apply();
        });
    }

    $scope.manage_accounts = function(){
        window.open(chrome.runtime.getURL("operando/operando.html#identity_management_tab"),"operando");
    }


    messengerService.send("restoreUserSession",{}, function(status){
        if(status.success){
            successFunction();
        }
        else if(status.fail){
            $scope.loginAreaState = "loggedout";
        }
        else if(status.error){
            errorFunction();
        }
        else if(status.reconnect){
            reconnectFunction();
        }
    });


    messengerService.on("onReconnect",reconnectFunction);
    messengerService.on("onConnectionError",errorFunction);
    messengerService.on("onConnect",reconnectFunction);


}]);

