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

var fbdata = window.FACEBOOK_PARAMS;
fbdata.__req = parseInt(fbdata.__req, 36);
var privacySettings =
    [
        {
            name: "Who can see your future posts?",
            page: "https://www.facebook.com/settings?tab=privacy&section=composer&view",
            url: "https://www.facebook.com/privacy/selector/update/?privacy_fbid=0&post_param=291667064279714&render_location=22&is_saved_on_select=true&should_return_tooltip=true&prefix_tooltip_with_app_privacy=false&replace_on_select=false&ent_id=0&tag_expansion_button=friends_of_tagged&__pc=EXP1%3ADEFAULT",
            data:{

            }
        },
        {
            name:"Who can contact me?",
            page:"https://www.facebook.com/settings?tab=privacy&section=canfriend&view",
            url:"https://www.facebook.com/privacy/selector/update/?privacy_fbid=8787540733&post_param=275425949243301&render_location=11&is_saved_on_select=true&should_return_tooltip=false&prefix_tooltip_with_app_privacy=false&replace_on_select=false&ent_id=0&tag_expansion_button=friends_of_tagged&__pc=EXP1%3ADEFAULT",
            data:{

            }

        },
        {
            name:"Who can look me up by email address",
            page:"https://www.facebook.com/settings?tab=privacy&section=findemail&view",
            url:"https://www.facebook.com/privacy/selector/update/?privacy_fbid=8787820733&post_param=291667064279714&render_location=11&is_saved_on_select=true&should_return_tooltip=false&prefix_tooltip_with_app_privacy=false&replace_on_select=false&ent_id=0&tag_expansion_button=friends_of_tagged&__pc=EXP1%3ADEFAULT",
            data:{

            }
        },
        {
            name:"Who can look me up by phone",
            page:"https://www.facebook.com/settings?tab=privacy&section=findphone&view",
            url:"https://www.facebook.com/privacy/selector/update/?privacy_fbid=8787815733&post_param=291667064279714&render_location=11&is_saved_on_select=true&should_return_tooltip=false&prefix_tooltip_with_app_privacy=false&replace_on_select=false&ent_id=0&tag_expansion_button=friends_of_tagged&__pc=EXP1%3ADEFAULT",
            data:{

            }
        },
        {
            name:"Who can look me up by search engines",
            page:"https://www.facebook.com/settings?tab=privacy&section=search&view",
            url:"https://www.facebook.com/ajax/settings_page/search_filters.php?__pc=EXP1%3ADEFAULT",
            data:{
                "el":"search_filter_public",
                "public":0,
            }
        },
        {
            name:"Who can post on my timeline",
            page:"https://www.facebook.com/settings?tab=timeline&section=posting&view",
            url:"https://www.facebook.com/ajax/settings/timeline/posting.php?__pc=EXP1%3ADEFAULT",
            data:{
                audience:10,
            }
        },
        {
            name:"Who can see posts you've been tagged in on your timeline",
            page:"https://www.facebook.com/settings?tab=timeline&section=tagging&view",
            url:"https://www.facebook.com/privacy/selector/update/?privacy_fbid=8787530733&post_param=286958161406148&render_location=11&is_saved_on_select=true&should_return_tooltip=false&prefix_tooltip_with_app_privacy=false&replace_on_select=false&ent_id=0&tag_expansion_button=friends_of_tagged&__pc=EXP1%3ADEFAULT",
            data:{

            }
        },
        {   name:"Review tags people add to your own posts before the tags appear on Facebook",
            page:"https://www.facebook.com/settings?tab=timeline&section=tagreview&view",
            url:"https://www.facebook.com/ajax/settings/tagging/review.php?__pc=EXP1%3ADEFAULT",
            data:{
                tag_review_enabled:1,
            }
        },
        {   name:"Who can follow me",
            page:"https://www.facebook.com/settings?tab=followers",
            url:"https://www.facebook.com/ajax/follow/enable_follow.php?__pc=EXP1%3ADEFAULT",
            data:{
                location:44,
                hideable_ids:["#following_plugin_item","#following_editor_item"],
                should_inject:'',
                allow_subscribers:"disallow"
            }
        },
        {
            name:"Apps Others Use",
            page:"https://www.facebook.com/settings?tab=applications",
            url:"https://www.facebook.com/settings/applications/platform_friends_share/submit/?__pc=EXP1%3ADEFAULT",
            data:{
                fields:''
            }
        },
        {
            name:"Old Versions of Facebook for Mobile",
            page:"https://www.facebook.com/settings?tab=applications",
            url:"https://www.facebook.com/ajax/privacy/simple_save.php?__pc=EXP1%3ADEFAULT",
            data:{
                id:8787700733,
                audience_json:JSON.stringify({"8787700733":{"value":10}}),
                source:'privacy_settings_page'
            }
        },
        {
            name:"Interest-based ads from Facebook",
            page:"https://www.facebook.com/settings?tab=ads&section=oba&view",
            url:"https://www.facebook.com/ads/preferences/oba/?__pc=EXP1%3ADEFAULT",
            data:{
                is_opted_out:1
            }
        },
        {
            name:"Ads with my social actions",
            page:"https://www.facebook.com/settings?tab=ads&section=socialcontext&view",
            url:"https://www.facebook.com/ajax/settings/ads/socialcontext.php?__pc=EXP1%3ADEFAULT",
            data:{
                opt_out:1
            }
        }

    ];

function postToFacebook(settings, item, total) {

    return new Promise(function (resolve, reject) {

        if (settings.page) {
            FeedbackProgress.sendFeedback(settings.name, item, total);
            doGET(settings.page, function (response) {

                extractHeaders(response, function (response) {

                    var data = response;
                    console.log(data);
                    chrome.runtime.sendMessage({
                        message: "getCookies",
                        url: settings.page
                    }, function (response) {
                        var cookies = "";
                        for (var i = 0; i < response.length; i++) {
                            cookies += response[i].name + "=" + response[i].value + "; ";
                        }

                        for(var prop in settings.data){
                            data[prop] = settings.data[prop];
                        }

                        console.log(data);
                        $.ajax({
                            type: "POST",
                            url: settings.url,
                            data: data,
                            beforeSend: function (request) {

                                if (settings.headers) {
                                    for (var i = 0; i < settings.headers.length; i++) {
                                        var header = settings.headers[i];
                                        request.setRequestHeader(header.name, header.value);
                                    }
                                }
                                request.setRequestHeader("content-length", data.length);
                                request.setRequestHeader("accept", "*/*");
                                request.setRequestHeader("accept-language", "en-US,en;q=0.8");
                                request.setRequestHeader("content-type", "application/x-www-form-urlencoded; charset=UTF-8");
                                request.setRequestHeader("cookie", cookies);

                                request.setRequestHeader("origin", "https://www.facebook.com");
                                request.setRequestHeader("X-Alt-Referer", settings.page);
                                request.setRequestHeader("user-agent", navigator.userAgent);

                            },
                            success: function (result) {
                                //console.log(result)
                                resolve(result);
                            },
                            error: function (error) {
                                //console.error(error);
                                reject(error);
                            },
                            complete: function (request, status) {
                                console.log(request.status);
                                console.log("Request completed...");
                            }

                        });

                    });

                })
            })
        }

    });

}

function secureAccount(callback) {
    var total = privacySettings.length;
    var sequence = Promise.resolve();
    privacySettings.forEach(function (settings, index) {
        sequence = sequence.then(function () {
            return postToFacebook(settings, index, total);
        }).then(function (result) {
            console.log(result);
        }).catch(function (err) {
            console.log(err)
        });
    });

    sequence = sequence.then(function (result) {
        FeedbackProgress.clearFeedback("Facebook is now secured!");
    });

    sequence = sequence.then(function (result) {
       callback();
    });

}

secureAccount(function(){
    chrome.runtime.sendMessage({sender: "facebook", message:"settings_applied"}, function(response) {
        console.log(response.farewell);
    });
});


function doGET(page, callback) {

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", page, true);
    xmlHttp.send(null);
}


function extractHeaders(content, callback) {
    var csrfToken = /\[\"DTSGInitialData\",\[\],\{"token":"([a-zA-Z0-9]*)"\},[0-9]*\]/;
    var revisionReg = /\{\"revision\":([0-9]*),/;
    var userIdReg = /\{\"USER_ID\":\"([0-9]*)\"/;


    var match;
    var data = {};

    if ((match = csrfToken.exec(content)) !== null) {
        if (match.index === csrfToken.lastIndex) {
            csrfToken.lastIndex++;
        }
    }

    if(match && match[1]){
        data['fb_dtsg'] = match[1];

        /**
         * Taken from Facebook
         * @type {string}
         */

        var x = '';
        for (var y = 0; y < data['fb_dtsg'].length; y++) {
            x += data['fb_dtsg'].charCodeAt(y);
        }
        data["ttstamp"] = '2' + x;
    }
    else{
        data["fb_dtsg"] = fbdata.fb_dtsg;
        data["ttstamp"] = fbdata.ttstamp;
    }

    //__rev
    if ((match = revisionReg.exec(content)) !== null) {
        if (match.index === revisionReg.lastIndex) {
            revisionReg.lastIndex++;
        }
    }

    if(match[1]){
        data['__rev'] = match[1];
    }
    //__user
    if ((match = userIdReg.exec(content)) !== null) {
        if (match.index === userIdReg.lastIndex) {
            userIdReg.lastIndex++;
        }
    }

    if(match[1]){
        data['__user'] = match[1];
    }

    data['__a']=1;
    data['__dyn'] = fbdata.__dyn;
    data['__req'] = (++ fbdata.__req).toString(36);

    callback(data);
}