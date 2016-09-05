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

angular.module('extensions', [])
    .directive('extensions', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            link: function ($scope) {

            },
            controller: function ($scope) {

                $scope.extensions = [];


                function oderExtensions(extensions) {
                    extensionsList = Array.prototype.slice.call(extensions).sort(function (a, b) {
                        return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
                    });

                    return extensionsList;
                }


                function getExtensions() {
                    chrome.management.getAll(function (results) {
                        results.forEach(function (extension) {

                            if (extension.icons && extension.icons instanceof Array) {
                                extension['icon'] = extension.icons.pop();
                                delete extension['icons'];
                            }

                            $scope.extensions.push(extension);
                            $scope.extensions = oderExtensions($scope.extensions);
                            $scope.$apply();
                        });

                    });

                    chrome.management.onUninstalled.addListener(function (extension_id) {
                        for (var i = 0; i < $scope.extensions.length; i++) {
                            if ($scope.extensions[i].id == extension_id) {
                                $scope.extensions.splice(i, 1);
                                break;
                            }
                        }
                        $scope.$apply();
                    });
                }

                getExtensions();


            },
            templateUrl: '/operando/tpl/extensions.html'
        }
    })
    .directive('extension', function (ModalService) {
        return {
            require: "^extensions",
            restrict: 'E',
            replace: true,
            scope: {extension: "="},
            link: function ($scope, element, attrs, extensionsCtrl) {

                $scope.extension.privacyPollution = computePrivacyPollution($scope.extension.permissions);
                $scope.extension.privacyPollutionColor = getPrivacyPollutionColor($scope.extension.privacyPollution);


                function checkPrivacyPollution(){

                    $scope.extension.privacyPollution = computePrivacyPollution($scope.extension.permissions);
                    $scope.extension.privacyPollutionColor = getPrivacyPollutionColor($scope.extension.privacyPollution);

                }

                function switchState(enabled) {
                    chrome.management.setEnabled($scope.extension.id, enabled, function () {
                        chrome.management.get($scope.extension.id, function (extension) {
                            if (extension.id == $scope.extension.id) {
                                if (extension.icons && extension.icons instanceof Array) {
                                    extension['icon'] = extension.icons.pop();
                                    delete extension['icons'];
                                }
                                $scope.extension = extension;
                                checkPrivacyPollution();
                                $scope.$apply();
                            }
                        });
                    });
                }

                function uninstall(reason, showConfirmDialog) {
                    if (showConfirmDialog === undefined) {
                        showConfirmDialog = false;
                    }

                    chrome.management.uninstall($scope.extension.id, {showConfirmDialog: showConfirmDialog}, function () {
                        if (chrome.runtime.lastError) {
                            console.log(chrome.runtime.lastError.message);
                        }
                    });

                }

                $scope.toggleEnabled = function () {
                    switchState(!$scope.extension.enabled);
                }

                $scope.uninstall = function () {
                    uninstall();
                }
                $scope.view_permissions = function () {
                    var permissions = $scope.extension.permissions;
                    var extensionName = $scope.extension.name;
                    var showModal = function (permissionWarnings) {
                        ModalService.showModal({
                            templateUrl: '/operando/tpl/modals/view_permissions.html',
                            controller: function ($scope, close) {
                                $scope.permissions = permissions;
                                $scope.permissionWarnings = permissionWarnings;
                                $scope.name = extensionName;
                                $scope.close = function (result) {
                                    close(result, 500);
                                };
                            }
                        }).then(function (modal) {
                            modal.element.modal();
                        });
                    }
                    chrome.management.getPermissionWarningsById($scope.extension.id, showModal);
                }

                checkPrivacyPollution();
            },
            controller: function ($scope) {

            },
            templateUrl: '/operando/tpl/extension.html'
        }
    });

