// ==UserScript==
// @name         Hide Hulu Tray Gradient
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hide Hulu Tray Gradient
// @author       MAD - MarshAfterDark (mB)
// @match        https://www.hulu.com/watch/*
// @homepageURL  https://github.com/mB-CodeBox/UserScripts
// @source       https://github.com/mB-CodeBox/UserScripts/raw/refs/heads/main/Hide%20Hulu%20Tray%20Gradient.user.js
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.textContent = '.FliptrayWrapper::before { display: none !important; }';
    document.head.appendChild(style);
})();
