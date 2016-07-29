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

angular.module('operando').controller('PreferencesController', ["$scope", "$attrs", "cfpLoadingBar", function ($scope, $attrs, cfpLoadingBar) {


    var settings = [];

    if ($attrs.socialNetwork) {
        $scope.schema = generateAngularForm($attrs.socialNetwork);

        $scope.form = [];
        for (var key in $scope.schema.properties) {
            $scope.form.push({
                key: key,
                type: "radios",
                titleMap: $scope.schema.properties[key].enum
            })
        }

        $scope.form.push(
            {
                type: "submit",
                title: "Save"
            }
        );

        $scope.model = {};
        $scope.submitPreferences = function () {

            var ospWriteSettings = getOSPSettings($attrs.socialNetwork);
            settings = [];

            for (var settingKey in $scope.model) {
                console.log($scope.model[settingKey]);
                if (ospWriteSettings[settingKey].write.availableSettings) {
                    console.log(ospWriteSettings[settingKey].write.availableSettings[$scope.model[settingKey]]);
                    var name = ospWriteSettings[settingKey].write.name;
                    var urlToPost = ospWriteSettings[settingKey].write.url_template;
                    var page = ospWriteSettings[settingKey].write.page;
                    var data = ospWriteSettings[settingKey].write.data ? ospWriteSettings[settingKey].write.data : {};

                    var params = ospWriteSettings[settingKey].write.availableSettings[$scope.model[settingKey]].params;


                    for (key in params) {
                        var param = params[key];
                        urlToPost = urlToPost.replace("{" + param.placeholder + "}", param.value);
                    }

                    if (ospWriteSettings[settingKey].write.availableSettings[$scope.model[settingKey]].data) {
                        var specificData = ospWriteSettings[settingKey].write.availableSettings[$scope.model[settingKey]].data
                        for (var attrname in specificData) {
                            data[attrname] = specificData[attrname];
                        }
                    }

                    settings.push({
                        name: name,
                        url: urlToPost,
                        page: page,
                        data: data
                    });

                }
                else {
                    console.log(settingKey + " setting not found!");
                }
            }

            console.log(settings);
            increaseFacebookPrivacy(settings);

        }

    }

    var FACEBOOK_PRIVACY_URL = "https://www.facebook.com/settings?tab=privacy&section=composer&view";
    var port = null;
    var facebookTabId = null;

    var increaseFacebookPrivacy = function () {
        chrome.tabs.create({url: FACEBOOK_PRIVACY_URL, "selected": false}, function (tab) {
            cfpLoadingBar.start();
            facebookTabId = tab.id;
            chrome.runtime.sendMessage({
                message: "waitForAPost",
                template: {
                    "__req": null,
                    "__dyn": null,
                    "__a": null,
                    "fb_dtsg": null,
                    "__user": null,
                    "ttstamp": null,
                    "__rev": null
                }
            }, function (response) {
                console.log(response);

                chrome.tabs.executeScript(facebookTabId, {
                    code: "window.FACEBOOK_PARAMS = " + JSON.stringify(response.template)
                }, function () {
                    insertCSS(facebookTabId, "operando/assets/css/feedback.css");
                    injectScript(facebookTabId, "operando/modules/osp/writeFacebookSettings.js", ["FeedbackProgress", "jQuery"]);
                });
            });
        });
    }


    chrome.runtime.onConnect.addListener(function (_port) {
        if (_port.name == "applyFacebookSettings") {
            port = _port;
            port.onMessage.addListener(function (msg) {
                if (msg.status == "waitingCommand") {
                    port.postMessage({command: "applySettings", settings: settings});
                } else {
                    if (msg.status == "settings_applied") {
                        cfpLoadingBar.complete();
                        //chrome.tabs.update(facebookTabId, {url: "https://www.facebook.com/settings?tab=privacy"});
                    }
                    else {
                        if (msg.status == "progress") {
                            console.log(msg.progress);
                            cfpLoadingBar.set(msg.progress);
                        }
                    }
                }
            });
        }
    });
}]);
