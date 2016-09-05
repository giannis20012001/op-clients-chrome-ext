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

angular.module('popupMenu', [])
    .directive('menuItem', function () {

        return {
            restrict: 'E',
            replace: true,
            scope: {},
            templateUrl:'/operando/tpl/menu_item.html',
            link: function(scope,element, attributes){
                scope.iconClass = attributes.iconClass;
                scope.menuLabel = attributes.menuLabel;
                scope.tabToOpen = attributes.tabToOpen;

                element.on("click", function(){
                    window.open(chrome.runtime.getURL("operando/operando.html#"+scope.tabToOpen),"operando");
                })
            },

            controller: function ($scope) {

            }
        }

    });
