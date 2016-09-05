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

var webRequest = chrome.webRequest;
var HEADERS_TO_STRIP_LOWERCASE = [
    'content-security-policy',
    'x-frame-options',
];


var activeTabs = [];

webRequest.onHeadersReceived.addListener(
    function (details) {
        return {
            responseHeaders: details.responseHeaders.filter(function (header) {
                return HEADERS_TO_STRIP_LOWERCASE.indexOf(header.name.toLowerCase()) < 0;
            })
        };
    }, {
        urls: ["<all_urls>"]
    }, ["blocking", "responseHeaders"]);


chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {

    if (message.message === "getCookies") {
        if (message.url) {
            chrome.cookies.getAll({url: message.url}, function (cookies) {
                sendResponse(cookies);
            });

            return true;
        }
    }

    if (message.message === "waitForAPost") {
        if (message.template) {

            webRequest.onBeforeRequest.addListener(function waitForPost(request) {
                    if (request.method == "POST") {
                        var requestBody = request.requestBody;
                        if (requestBody.formData) {
                            var formData = requestBody.formData;
                            for (var prop in message.template) {
                                if (formData[prop]) {
                                    if(formData[prop] instanceof Array){
                                        message.template[prop] = formData[prop][0];
                                    }
                                    else{
                                        message.template[prop] = formData[prop];
                                    }
                                }
                            }

                            webRequest.onBeforeRequest.removeListener(waitForPost);
                            sendResponse ({template:message.template});
                        }
                    }

                },
                {urls: ["<all_urls>"]},
                ["blocking", "requestBody"]);
        }
        return true;
    }

});

webRequest.onBeforeSendHeaders.addListener(function(details) {

        var referer = "";
        for (var i = 0; i < details.requestHeaders.length; ++i) {
            var header = details.requestHeaders[i];
            if (header.name === "X-Alt-Referer") {
                referer = header.value;
                details.requestHeaders.splice(i, 1);
                break;
            }
        }
        if (referer !== "") {
            for (var i = 0; i < details.requestHeaders.length; ++i) {
                var header = details.requestHeaders[i];
                if (header.name === "Referer") {
                    details.requestHeaders[i].value = referer;
                    break;
                }
            }
        }

        return {requestHeaders: details.requestHeaders};

    },
    {urls: ["<all_urls>"]},
    ["blocking", "requestHeaders"]);



chrome.tabs.onCreated.addListener(function(tab) {
    console.log("onCreated");
    //tryPfB(tab.id);
});

chrome.tabs.onActivated.addListener(function(activeInfo) {
    console.log("onActivated");
    //tryPfB(activeInfo.tabId);
});

chrome.tabs.onUpdated.addListener(function(tabId,changeInfo,tab){
    tryPfB(tabId, changeInfo);
});


function tryPfB(tabId, changeInfo) {

    if ( changeInfo.status == "complete") {
        //activeTabs.push(tabId);

        chrome.tabs.get(tabId, function (tab) {
            swarmHub.startSwarm("pfb.js", "getWebsiteDeal", tab.url, tab.id);
        });
    }
}

swarmHub.on("pfb.js", "success", function (swarm) {
    chrome.tabs.get(swarm.tabId, function (tab) {
        if (tab) {
            var deal = swarm.deal;
            var tabId = tab.id;
            insertJavascriptFile(tabId, "operando/utils/jquery.min.js");
            insertJavascriptFile(tabId, "operando/utils/jquery.visible.min.js");
            insertJavascriptFile(tabId, "operando/utils/webui-popover/jquery.webui-popover.js");
            chrome.tabs.insertCSS(tabId, {file:"operando/utils/webui-popover/jquery.webui-popover.css"});
            insertJavascriptFile(tabId, "operando/modules/pfb/operando_content.js", function(){
                chrome.tabs.sendMessage(tabId, {pfbDeal:deal},{}, function(response){

                    if(response!==undefined){
                        swarmHub.startSwarm("pfb.js", "acceptDeal", deal.serviceId);
                    }

                });
            });
        }
    });
});
