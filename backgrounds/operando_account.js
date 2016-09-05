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


var authenticationService = require("authentication-service").authenticationService;
var swarmService = require("swarm-service").swarmService;
var identityService = require("identity-service").identityService;
var pfbService = require("pfb-service").pfbService;

var clientPort = null;
chrome.runtime.onConnect.addListener(function (_port) {
    clientPort = _port;

    if (clientPort.name == "OPERANDO_MESSAGER") {
        clientPort.onMessage.addListener(function (request) {

            if (request.action == "login" && request.message) {
                login(request.message.username, request.message.password, function () {
                    clientPort.postMessage({
                        type: "SOLVED_REQUEST",
                        action: request.action,
                        message: {error: "securityError"}
                    });
                }, function () {
                    clientPort.postMessage({type: "SOLVED_REQUEST", action: request.action, message: {success: "success"}});
                });
            }

            if (request.action == "logout") {
                logout(function () {
                    clientPort.postMessage({type: "SOLVED_REQUEST", action: request.action, message: {success: "success"}});
                });
            }

            if (request.action == "getCurrentUser") {
                getCurrentUser(function (user) {
                    clientPort.postMessage({type: "SOLVED_REQUEST", action: request.action, message: user});
                })
            }

            if (request.action == "restoreUserSession") {
                restoreUserSession(function (status) {
                    clientPort.postMessage({type: "SOLVED_REQUEST", action: request.action, message: status});
                })
            }

            if(request.action == "listIdentities"){
                identityService.listIdentities(function(identities){
                    clientPort.postMessage({type: "SOLVED_REQUEST", action: request.action, message: identities});
                });
            }

            if(request.action == "addIdentity"){
                identityService.addIdentity(request.message, function(identity){
                    clientPort.postMessage({type: "SOLVED_REQUEST", action: request.action, message: identity});
                });
            }

            if(request.action == "generateIdentity"){
                identityService.generateIdentity(function(identity){
                    clientPort.postMessage({type: "SOLVED_REQUEST", action: request.action, message: identity});
                });
            }

            if(request.action == "removeIdentity"){
                identityService.removeIdentity(request.message,function(identity){
                    clientPort.postMessage({type: "SOLVED_REQUEST", action: request.action, message: identity});
                });
            }

            if(request.action == "listDomains"){
                identityService.listDomains(function(availableDomains){
                    clientPort.postMessage({type: "SOLVED_REQUEST", action: request.action, message: availableDomains});
                });
            }

            if(request.action == "registerUser"){
                authenticationService.registerUser(request.message.user, function(error){
                    clientPort.postMessage({type: "SOLVED_REQUEST", action: request.action, message: {status:"error",message:error}});
                },  function(success){
                    clientPort.postMessage({type: "SOLVED_REQUEST", action: request.action, message: {status:"success"}});
                });
            }

            if(request.action == "listPfbDeals"){
                pfbService.getActiveDeals(function(deals){
                    clientPort.postMessage({type: "SOLVED_REQUEST", action: request.action, message: deals});
                });
            }

            if(request.action == "getMyPfbDeals"){
                pfbService.getMyDeals(function(deals){
                    clientPort.postMessage({type: "SOLVED_REQUEST", action: request.action, message: deals});
                });
            }


        });
    }

    clientPort.onDisconnect.addListener(function () {
        clientPort = null;

    });

});


function login(username, password, securityErrorFunction, successFunction) {
    authenticationService.authenticateUser(username, password, securityErrorFunction, successFunction);
}

function logout(callback) {
    authenticationService.logoutCurrentUser(function () {
        callback();
    });
}

function getCurrentUser(callback) {
    authenticationService.getCurrentUser(function (user) {
        callback(user);
    })
}

function restoreUserSession(callback) {
    var status = {};

    //TODO refactoring needed here

    if (authenticationService.isLoggedIn() == true) {
        status.success = "success";
        callback(status);
    }
}


authenticationService.restoreUserSession(function () {
    status.success = "success";

}, function () {
    status.fail = "fail";

}, function () {
    status.error = "error";

}, function () {
    status.reconnect = "reconnect";

});


swarmService.onReconnect(function () {
    if (clientPort != null) {
        clientPort.postMessage({type: "BACKGROUND_DEMAND", action: "onReconnect", message: {}});
    }

});

swarmService.onConnectionError(function () {
    if (clientPort != null) {
        clientPort.postMessage({type: "BACKGROUND_DEMAND", action: "onConnectionError", message: {}});
    }
});

swarmService.onConnect(function () {
    if (clientPort != null) {
        clientPort.postMessage({type: "BACKGROUND_DEMAND", action: "onConnect", message: {}});
    }
});
