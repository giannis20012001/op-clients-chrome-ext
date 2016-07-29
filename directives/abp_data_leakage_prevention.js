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


angular.module("abp", []).controller('abpController', ['$scope', function ($scope) {

    /**
     * from chromeadblockplus/firstRun.js
     **/

    $scope.featureSubscriptions = [
        {
            feature: "malware",
            homepage: "http://malwaredomains.com/",
            title: "Malware Domains",
            feature_title:"Malware Blocking",
            feature_description:"Make your browsing more secure by blocking known malware domains.",
            url: "https://easylist-downloads.adblockplus.org/malwaredomains_full.txt"

        },
        {
            feature: "social",
            homepage: "https://www.fanboy.co.nz/",
            title: "Fanboy's Social Blocking List",
            feature_title:"Remove Social Media Buttons",
            feature_description:"Automatically rid your browsing experience of social media buttons, such as the Facebook Like, which appear on web pages and track your behavior.",
            url: "https://easylist-downloads.adblockplus.org/fanboy-social.txt"
        },
        {
            feature: "tracking",
            homepage: "https://easylist.adblockplus.org/",
            title: "EasyPrivacy",
            feature_title:"Disable Tracking",
            feature_description:"Browse privately by disabling tracking - hiding your tracks from ad companies that would track your every move.",
            url: "https://easylist-downloads.adblockplus.org/easyprivacy.txt"
        }
    ];


    function updateToggleButtons()
    {
        ext.backgroundPage.sendMessage({
            type: "subscriptions.get",
            downloadable: true,
            ignoreDisabled: true
        }, function(subscriptions)
        {
            var known = Object.create(null);
            for (var i = 0; i < subscriptions.length; i++)
                known[subscriptions[i].url] = true;
            for (var i = 0; i < $scope.featureSubscriptions.length; i++)
            {
                var featureSubscription = $scope.featureSubscriptions[i];
                $scope.featureSubscriptions[i].checked = featureSubscription.url in known;

                $scope.$apply();
            }
        });
    }

    ext.onMessage.addListener(function(message)
    {
        if (message.type == "subscriptions.listen")
        {
            updateToggleButtons();
        }
    });
    ext.backgroundPage.sendMessage({
        type: "subscriptions.listen",
        filter: ["added", "removed", "updated", "disabled"]
    });



}])
angular.module("abp").directive("abpLeakagePrevention", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {"subscription": "="},
        templateUrl: "/operando/tpl/abp.html",
        link: function(scope, elem, attr){
            scope.toggleOnOffButton = function(){
                setTimeout(function(){
                    ext.backgroundPage.sendMessage({
                        type: "subscriptions.toggle",
                        url: scope.subscription.url,
                        title: scope.subscription.title,
                        homepage: scope.subscription.homepage
                    });
                },500);
            }
        },

    }
});
