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


operandoCore
    .factory("messengerService", function () {

        var port = chrome.runtime.connect({name: "OPERANDO_MESSAGER"});
        var callbacks = {};
        var events = {};

        port.onMessage.addListener(function (response) {
            if (response.type == "SOLVED_REQUEST") {
                if (response.action && callbacks[response.action]) {
                    while (callbacks[response.action].length > 0) {
                        var messageCallback = callbacks[response.action].pop();
                        //console.log(response.message);
                        messageCallback(response.message);
                    }
                }
            }
            else {
                if (response.type == "BACKGROUND_DEMAND") {
                    if (response.action && events[response.action]) {
                        events[response.action].forEach(function (callback) {
                            callback(response.message);
                        });
                    }
                }
            }

        });


        var on = function (event, callback) {
            if (!events[event]) {
                events[event] = [];
            }
            events[event].push(callback);
        }

        var send = function (action, message, callback) {
            port.postMessage({action: action, message: message});

            if (!callbacks[action]) {
                callbacks[action] = [];
            }
            callbacks[action].push(callback);
        }


        return {
            send: send,
            on: on
        }

    });