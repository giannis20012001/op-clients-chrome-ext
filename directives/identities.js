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


angular.module('identities', [])
    .directive('identities', ["messengerService", function (messengerService) {
            return {
                restrict: 'E',
                replace: true,
                scope: {},

                controller: function ($scope, ModalService) {
                    $scope.identities = [];



                    messengerService.send("getCurrentUser",{}, function(user){
                        $scope.user = user;
                        $scope.$apply();
                    });


                    var refreshIdentities = function () {
                        $scope.$apply();
                    }

                    messengerService.send("listIdentities",{},function (identities) {
                        $scope.identities = identities;
                        refreshIdentities();
                    });


                    $scope.$on('refreshIdentities',function() {
                        messengerService.send("listIdentities",{},function (identities) {
                            $scope.identities = identities;
                            refreshIdentities();
                        });
                    });

                    $scope.$on('changedDefaultSID',function(defaultIdentity) {
                        $scope.identities.forEach(function(identity){

                            if(identity.name != defaultIdentity.name){
                                identity.isDefault = false;
                            }
                        });
                    });




                    $scope.add_new_sid = function () {
                        var identities = $scope.identities;
                        ModalService.showModal({
                            templateUrl: '/operando/tpl/modals/add_sid.html',
                            controller: ["$scope", "close", "messengerService", function ($scope, close, messengerService) {

                                $scope.identity = {};
                                $scope.domains = {};

                                messengerService.send("listDomains",{},function(domains){
                                    $scope.domains.availableDomains = domains;
                                    $scope.identity.domain = $scope.domains.availableDomains[0].name;
                                });

                                $scope.saveIdentity = function () {
                                    messengerService.send("addIdentity",$scope.identity, function (identity) {
                                        identities.push(identity);
                                        refreshIdentities();
                                        close(null, 500);
                                    }, function (error) {
                                        console.log(error.message);

                                        if($scope.identity.email){
                                            $scope.addSidForm.email.$setValidity("invalid", false);
                                            $scope.error = error.message;
                                            $scope.$apply();
                                        }
                                    });
                                }


                                $scope.generateIdentity = function(){
                                    messengerService.send("generateIdentity",{},function(generatedIdentity){
                                        console.log(generatedIdentity);
                                        $scope.identity.name = generatedIdentity.email;
                                        $scope.identity.email = $scope.identity.name+"@"+$scope.identity.domain;
                                        $scope.$apply();
                                    })
                                }

                                $scope.refreshSID = function(){
                                    $scope.identity.email = $scope.identity.name+"@"+$scope.identity.domain;
                                }

                                $scope.close = function (result) {
                                    close(result, 500);
                                };

                                $scope.generateIdentity();

                            }]
                        }).then(function (modal) {
                            modal.element.modal();
                        });
                    }
                },
                templateUrl: '/operando/tpl/identities.html'
            }
        }]
    )
    .directive('identityRow', function () {
            return {
                require: "^identities",
                restrict: 'A',
                replace: true,
                scope: {identity: "="},
                controller: function ($scope, ModalService) {

                    $scope.identity.isDefault = false;

                    $scope.changeDefaultIdentity = function(){
                        $scope.$parent.$emit("changedDefaultSID",$scope.identity);
                        $scope.identity.isDefault = true;
                    }

                    $scope.remove_identity = function () {
                        var identity = $scope.identity;
                        var emitToParent = function(event){
                            $scope.$emit(event);
                        }

                        ModalService.showModal({

                            templateUrl: '/operando/tpl/modals/delete_sid.html',
                            controller: ["$scope", "close", "messengerService", function ($scope, close, messengerService) {
                                $scope.identity = identity;
                                $scope.deleteIdentity = function(){
                                    messengerService.send("removeIdentity",identity, function(identity){
                                        console.log("success", identity);
                                            emitToParent("refreshIdentities");

                                    },
                                    function(identity){
                                            console.log("fail", identity);
                                   })
                                }

                                $scope.close = function (result) {
                                    close(result, 500);
                                };
                            }
                            ]
                        }).then(function (modal) {
                            modal.element.modal();
                        })
                    }
                    
                },
                templateUrl: '/operando/tpl/identityRow.html'
            }
        }
    );