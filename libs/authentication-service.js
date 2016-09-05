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

var swarmService = require("swarm-service").swarmService;
var loggedIn = false;
var authenticatedUser = {};
var loggedInObservable = swarmHub.createObservable();
var notLoggedInObservable = swarmHub.createObservable();

var authenticationService = exports.authenticationService = {

    isLoggedIn: function(){
        return loggedIn;
    },
    getUser : function(){
      return authenticatedUser;
    },
    authenticateUser: function (username, password, securityFn, successFn) {
        var self = this;

        swarmService.initConnection(ExtensionConfig.OPERANDO_SERVER_HOST, ExtensionConfig.OPERANDO_SERVER_PORT, username, password, "chromeBrowserExtension", "userLogin", securityFn);

        swarmHub.on('login.js', "success", function (swarm) {
            loggedIn = swarm.authenticated;
            Cookies.set("sessionId", swarm.meta.sessionId);
            Cookies.set("userId", swarm.userId);
            self.setUser(swarm.userId,successFn);
            swarmHub.off("login.js", "success");
        });
    },

    registerUser: function (user, errorFunction, successFunction) {

        swarmService.initConnection(ExtensionConfig.OPERANDO_SERVER_HOST, ExtensionConfig.OPERANDO_SERVER_PORT, "guest", "guest", "chromeBrowserExtension", "userLogin", errorFunction, errorFunction);

        /**
         * TODO
         * Remove this, add guest login from the first step
         *
         */
        setTimeout(function(){
            swarmHub.startSwarm("register.js", "registeNewUser", user);
            swarmHub.on('register.js', "success", function (swarm) {
                successFunction("success");
            });

            swarmHub.on('register.js', "error", function (swarm) {
                errorFunction(swarm.error);
            });
        },300);

    },

    restoreUserSession: function (successCallback, failCallback, errorCallback, reconnectCallback) {
        var username = Cookies.get("userId");
        var sessionId = Cookies.get("sessionId");
        var self = this;

        if (!username || !sessionId) {
            failCallback();
        }

        swarmService.restoreConnection(ExtensionConfig.OPERANDO_SERVER_HOST, ExtensionConfig.OPERANDO_SERVER_PORT, username, sessionId, failCallback, errorCallback, reconnectCallback);
        swarmHub.on('login.js', "restoreSucceed", function (swarm) {
            loggedIn = true;
            self.setUser(swarm.userId,successCallback);
            swarmHub.off("login.js", "restoreSucceed");
        });
    },

    setUser: function (userId, callback) {
        swarmHub.startSwarm('UserInfo.js', 'info', userId);
        swarmHub.on('UserInfo.js', 'result', function (response) {
            authenticatedUser = response.result;
            loggedInObservable.notify();
            if(callback){
                callback();
            }
            swarmHub.off("UserInfo.js", "result");
        });
    },

    getCurrentUser: function (callback) {
        loggedInObservable.observe(function () {
            callback(authenticatedUser);
        }, !loggedIn);
    },

    disconnectUser: function (callback) {
        notLoggedInObservable.observe(function () {
            callback();
        });
    },

    getStatus: function () {
        return loggedIn;
    },

    checkStatus: function (loggedInFn, notLoggedInFn) {
        this.restoreUserSession(loggedInFn, notLoggedInFn);
    },

    logoutCurrentUser: function (callback) {
        swarmHub.startSwarm("login.js", "logout");
        swarmHub.on("login.js", "logoutSucceed", function (swarm) {
            authenticatedUser = {};
            loggedIn = false;
            notLoggedInObservable.notify();
            loggedInObservable = swarmHub.createObservable();
            Cookies.remove("userId");
            Cookies.remove("sessionId");
            swarmHub.off("login.js", "logoutSucceed");
            swarmService.removeConnection();
            callback();

        });
    }
}
