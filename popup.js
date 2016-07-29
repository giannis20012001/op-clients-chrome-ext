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

(function () {


    var handleClick = function () {
        var abpCtn = document.getElementById("wrapperabp");
        var expandIcon = document.getElementById("expand_abp");
        var apbExpanderBtn = document.getElementById("abp_expand");
        apbExpanderBtn.addEventListener("click", function () {
            abpCtn.classList.toggle('visible');
            expandIcon.classList.toggle('expanded');
        });

    }

    function init() {
        handleClick();

        var backgroundPage = ext.backgroundPage.getWindow();
        var require = backgroundPage.require;
        var Prefs = require("prefs").Prefs;

        function updateOperandoStats(element, i18nkey, stats) {
            i18n.setElementText(element, i18nkey, stats);
        }


        var unsecuredFollowedLinksElement = document.getElementById("blocked-links");
        var unsecuredFollowedLinks = Prefs.unsecured_links_followed;

        var unsecuredAcceptedSubmitsElement = document.getElementById("blocked-submits");
        var unsecuredAcceptedSubmits = Prefs.unsecured_submits;

        updateOperandoStats(unsecuredFollowedLinksElement, "blocked_links", [unsecuredFollowedLinks]);
        updateOperandoStats(unsecuredAcceptedSubmitsElement, "blocked_submits", [unsecuredAcceptedSubmits]);

    }

    window.addEventListener("DOMContentLoaded", init, false);

})();