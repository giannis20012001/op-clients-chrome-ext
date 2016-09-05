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

angular.module('operando', ['extensions', 'identities', 'pfbdeals', 'singleClickPrivacy', 'notifications', 'osp',
    'angularModalService', 'operandoCore', 'schemaForm', 'abp', 'ui.router', 'oc.lazyLoad','angular-loading-bar',
    'ngAnimate'])
    .config([
        '$compileProvider',
        function ($compileProvider) {   //to accept chrome protocol
            $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome|chrome-extension):/);
            $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome|chrome-extension):/);

        }
    ])
    .config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
        cfpLoadingBarProvider.includeSpinner = false;
        cfpLoadingBarProvider.includeBar = true;
        cfpLoadingBarProvider.parentSelector = '#loading-bar-container';
        cfpLoadingBarProvider.latencyThreshold = 500;
        cfpLoadingBarProvider.autoIncrement = false;

    }])
    .run(['$rootScope', '$state', '$stateParams',
        function ($rootScope, $state, $stateParams) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
        }
    ])
    .config(function ($stateProvider, $urlRouterProvider, $ocLazyLoadProvider) {

        $ocLazyLoadProvider.config({
            debug: true,
            serie: true
        });

        // For any unmatched url, redirect to /home
        $urlRouterProvider.otherwise("/home");

        // Now set up the states
        $stateProvider
            .state('home', {
                url: "/home",
                templateUrl: "views/home.html",
            })
            .state("home.privacyQuestionnaire", {
                url: "/privacy-questionnaire",
                templateUrl: "views/home/privacy_questionnaire.html",
                resolve: {
                    loadController: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load('/operando/controllers/questionnaireController.js');
                    }]
                }
            })
            .state("home.notifications", {
                url: "/notifications",
                templateUrl: "views/home/notifications.html"
            })
            .state("home.blog", {
                url: "/blog",
                templateUrl: "views/home/blog.html"
            })

            .state('preferences', {
                url: "/preferences",
                abstract: true,
                templateUrl: "views/preferences.html",
                resolve: {
                    loadController: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load('/operando/controllers/preferencesController.js');
                    }]
                }
            })
            .state('preferences.facebook', {
                url: "/facebook",
                templateUrl: "views/preferences/facebook.html"
            })
            .state('preferences.linkedin', {
                url: "/linkedin",
                templateUrl: "views/preferences/linkedin.html"
            })
            .state('preferences.twitter', {
                url: "/twitter",
                templateUrl: "views/preferences/twitter.html"
            })
            .state('preferences.google', {
                url: "/google",
                templateUrl: "views/preferences/google.html"
            })
            .state('preferences.abp', {
                url: "/abp",
                templateUrl: "views/preferences/abp.html",
                resolve: {
                    loadScript: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load(
                            ['../ext/common.js',
                                '../ext/content.js'
                            ]);
                    }]
                }
            })
            .state('preferences.mobile', {
                url: "/mobile",
                templateUrl: "views/preferences/mobile.html"
            })
            .state('deals', {
                url: "/deals",
                templateUrl: "views/deals.html",
                abstract: true,
            })
            .state('deals.availableOffers', {
                url: "/offers",
                templateUrl: "views/deals/available_offers.html"
            })
            .state('deals.myDeals', {
                url: "/my-deals",
                templateUrl: "views/deals/my_deals.html"
            })
            .state('identityManagement', {
                url: "/identity_management",
                templateUrl: "views/identity_management.html"
            })
            .state('extensions', {
                url: "/extensions",
                templateUrl: "views/extensions.html"
            })
            .state('admin', {
                url: "/admin",
                abstract:true,
                templateUrl: "views/reading_settings.html",
                resolve: {
                    loadController: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load('/operando/controllers/readSocialNetworkPrivacySettings.js');
                    }]
                }
            })
            .state("admin.privacy_settings",{
                url:"/privacy_settings/:sn",
                params: {
                    sn: "facebook"
                },
                resolve: {
                    sn:['$stateParams', function ($stateParams) {
                        return $stateParams.sn;
                    }]
                },
                templateUrl:"views/admin/privacy_settings/social_network.html",
                controller: function($scope, $stateParams) {
                    if (!$stateParams.sn) {
                        $scope.osp = {
                            key: 'facebook',
                            title: 'facebook',
                            settings: getOSPSettings('facebook')
                        }
                    }
                    else {
                        $scope.osp = {
                            key: $stateParams.sn,
                            title: $stateParams.sn,
                            settings: getOSPSettings($stateParams.sn)
                        }
                    }

                    $scope.sn = $stateParams.sn;
                }
            })
            .state('account', {
                url: "/account",
                abstract: true,
                templateUrl: "views/user_account.html"
            })
            .state('account.personal-details', {
                url: "/personal-details",
                templateUrl: "views/account/personal_details.html",
                resolve: {
                    loadController: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load('/operando/controllers/accountController.js');
                    }]
                }
            })
            .state('account.activity', {
                url: "/activity",
                templateUrl: "views/account/activity.html"
            })
            .state('account.billing', {
                url: "/billing",
                templateUrl: "views/account/billing.html"
            });
    });


