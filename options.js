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

var FACEBOOK_PRIVACY_URL = "https://www.facebook.com/settings?tab=privacy&section=composer&view";
var LINKEDN_PRIVACY_URL = "https://www.linkedin.com/settings/?trk=nav_account_sub_nav_settings";


var increaseFacebookPrivacy = function () {
    chrome.tabs.create({url: FACEBOOK_PRIVACY_URL, "selected": false}, function (tab) {

        /*var tabId = tab.id;
         chrome.tabs.onActivated.addListener(function(activeInfo){
         if(activeInfo.tabId == tabId){
         setTimeout(function(){
         chrome.tabs.remove([activeInfo.tabId], function(){});
         },10);
         }
         })*/

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

            chrome.tabs.executeScript(tab.id, {
                code: "window.FACEBOOK_PARAMS = " + JSON.stringify(response.template)
            }, function () {
                insertCSS(tab.id, "operando/assets/css/feedback.css");
                injectScript(tab.id, "operando/apps/facebook.js", ["FeedbackProgress","jQuery"]);
            });


            //TODO move this to background

            chrome.runtime.onMessage.addListener(
                function(request, sender, sendResponse) {
                 if(sender.tab.id == tab.id){
                     if(request.sender == "facebook"){
                         chrome.tabs.update(tab.id,{url:"https://www.facebook.com/settings?tab=privacy"});
                     }
                 }
                });

        });
    });
}

var increaseLinkedInPrivacy = function () {

    chrome.tabs.create({url: LINKEDN_PRIVACY_URL, "selected": true}, function (tab) {
        insertJavascriptFile(tab.id, "operando/DependencyManager.js", function () {
            insertCSS(tab.id, "operando/assets/css/feedback.css");
            injectScript(tab.id, "operando/apps/linkedin.js", ["FeedbackProgress","jQuery"]);
        });
    });
}



window.addEventListener("DOMContentLoaded", function () {

    $("#set_linkedin_privacy").click(increaseLinkedInPrivacy);
    $("#set_facebook_privacy").click(increaseFacebookPrivacy);
}, false);







