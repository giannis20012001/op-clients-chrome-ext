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

angular.module("singleClickPrivacy",[])
    .directive('singleclickprivacy',function(){

        return{
            restrict: 'E',
            replace: true,
            scope: {},
            controller : function($scope, ModalService){

                $scope.enforce = function(){
                    ModalService.showModal({

                        templateUrl: '/operando/tpl/modals/single_click_button_modal.html',
                        controller: ["$scope", "close", "messengerService", function ($scope, close, messengerService) {

                            $scope.close = function (result) {
                                close(result, 500);
                            };
                            $scope.enforcePrivacy = function(){
                                increaseFacebookPrivacy();
                            },
                            $scope.takePrivacyQuestionnaire = function(){
                                $("a[href='#privacy_wizard']").click();
                            }
                        }
                        ]
                    }).then(function (modal) {
                        modal.element.modal();
                    });
                }

            },
            templateUrl: '/operando/tpl/single_click_button.html'

        }

    });