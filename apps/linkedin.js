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

var privacySettings =
    [
        {
            name: "news-mention",
            page: "https://www.linkedin.com/settings/",
            url: "https://www.linkedin.com/settings/news-mention-broadcasts-submit",
            isAjax: 1,
        },
        {
            name: "activity",
            page: "https://www.linkedin.com/settings/",
            url: "https://www.linkedin.com/settings/activity-broadcasts-submit",
            isAjax: 1,

        },
        {
            name: "activity-visibility",
            page: "https://www.linkedin.com/settings/",
            url: "https://www.linkedin.com/settings/activity-visibility-submit",
            isAjax: 1,

            data: {
                activityFeed: "HIDE"
            }
        },
        {
            name: "visibility",
            page: "https://www.linkedin.com/settings/",
            url: "https://www.linkedin.com/settings/wvmp-visibility-submit",
            isAjax: 1,

            data: {
                wvmpParam: "F"
            }
        },
        {
            name: "how-you-rank",
            page: "https://www.linkedin.com/settings/",
            isAjax: 1,
            url: "https://www.linkedin.com/settings/how-you-rank-submit",
            data: {
                updateHowYouRankSettings: "Save"
            }

        },
        {
            name: "connection-visibility",
            page: "https://www.linkedin.com/settings/",
            isAjax: 1,
            url: "https://www.linkedin.com/settings/connection-visibility-submit",

            data: {
                browseConnections: "ME"
            }
        },
        {
            name: "allow-follow",
            page: "https://www.linkedin.com/settings/",
            isAjax: 1,
            url: "https://www.linkedin.com/settings/allow-follow-submit",
            data: {
                allowFollowParam: "CONNECTIONS",
                updateAllowFollowSetting: "Save changes"
            }
        },
        {
            name: "browse-map",
            page: "https://www.linkedin.com/settings/",
            isAjax: 1,
            url: "https://www.linkedin.com/settings/browse-map-submit",
        },
        {
            name: "phone",
            page: "https://www.linkedin.com/psettings/visibility/phone",
            isAjax: 0,
            url: "https://www.linkedin.com/psettings/visibility/phone",
            data: {
                visibilitySetting: "FIRST_DEGREE_CONNECTIONS",
                handleType: "PHONE"
            }
        },
        {
            name: "meet-the-team",
            page: "https://www.linkedin.com/psettings/meet-the-team",
            isAjax: 1,
            url: "https://www.linkedin.com/psettings/meet-the-team",
            data: {
                isAllowShownInMeetTheTeam: false
            }
        },
        {
            name: "research-invitation",
            page: "https://www.linkedin.com/settings/research-invitations-submit",
            url: "https://www.linkedin.com/settings/research-invitations-submit",
            isAjax: 1,
        },
        {
            name: "partner-inMail",
            page: "https://www.linkedin.com/settings",
            url: "https://www.linkedin.com/settings/partner-inMail-submit",
            isAjax: 1,
        },
        {
            name: "data-sharing",
            page: "https://www.linkedin.com/settings",
            url: "https://www.linkedin.com/settings/data-sharing-submit",
            isAjax: 1,
        },
        {
            name: "enhanced-advertising",
            page: "https://www.linkedin.com/settings/",
            url: "https://www.linkedin.com/settings/enhanced-advertising-submit",
            isAjax: 1,
        }

    ];


function postToLinkedIn(settings, item, total) {


    return new Promise(function (resolve, reject) {


        if (settings.page) {
            FeedbackProgress.sendFeedback(settings.name, item, total);
            doGET(settings.page, function (response) {

                extractHeaders(response, function (response) {
                    var data = "";
                    var auxData = response;

                    chrome.runtime.sendMessage({
                        message: "getCookies",
                        url: 'https://linkedin.com'
                    }, function (response) {
                        var cookies = "";
                        for (var i = 0; i < response.length; i++) {
                            cookies += response[i].name + "=" + response[i].value + "; ";
                        }

                        if (settings.data) {
                            if (data != "") {
                                data += "&";
                            }

                            var index = 0;
                            for (var key in settings.data) {
                                if (index > 0) {
                                    data += "&";
                                }
                                data += key + "=" + encodeURIComponent(settings.data[key]);
                                index++;
                            }
                        }
                        if (data !== "") {
                            data += "&";
                        }
                        data += auxData;


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
                                console.log(data.length);
                                request.setRequestHeader("content-length", data.length);
                                request.setRequestHeader("accept", "*/*");
                                request.setRequestHeader("accept-language", "en-US,en;q=0.8");
                                request.setRequestHeader("content-type", "application/x-www-form-urlencoded; charset=UTF-8");
                                request.setRequestHeader("cookie", cookies);

                                request.setRequestHeader("origin", "https://www.linkedin.com");
                                request.setRequestHeader("X-Alt-Referer", settings.page);
                                request.setRequestHeader("user-agent", navigator.userAgent);
                                if (settings.isAjax == 1) {
                                    request.setRequestHeader("x-isajaxform", "1");
                                }
                            },
                            success: function (result) {
                                console.log(result)
                                resolve(result);
                            },
                            error: function (error) {
                                console.error(error);
                                reject(error);
                            },
                            complete: function (request, status) {
                                console.log("Request completed...");
                            }

                        });

                    });

                })
            })
        }

    });

}

function secureAccount() {
    var total = privacySettings.length;
    var sequence = Promise.resolve();
    privacySettings.forEach(function (settings, index) {
        sequence = sequence.then(function () {
            return postToLinkedIn(settings, index, total);
        }).then(function (result) {
            console.log(result);
        }).catch(function (err) {
            console.log(err)
        });
    });

    sequence = sequence.then(function (result) {
        FeedbackProgress.clearFeedback("LinkedIn is now secured!");
    });

}

secureAccount();


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
    var csrfToken = /<meta id="jet-csrfToken" name="jet-csrfToken" content\=\"(ajax:[A-Za-z0-9]*)\">/;
    var match;

    if ((match = csrfToken.exec(content)) !== null) {
        if (match.index === csrfToken.lastIndex) {
            csrfToken.lastIndex++;
        }
    }

    callback("csrfToken=" + encodeURIComponent(match[1]));

}
