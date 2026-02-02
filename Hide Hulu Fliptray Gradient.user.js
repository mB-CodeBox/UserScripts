// ==UserScript==
// @name         Hide Hulu Fliptray Gradient
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hides the gradient overlay on Hulu video player
// @author       You
// @match        https://www.hulu.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.textContent = '.FliptrayWrapper::before { display: none !important; }';
    document.head.appendChild(style);
})();