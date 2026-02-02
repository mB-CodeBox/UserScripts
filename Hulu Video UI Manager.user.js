// ==UserScript==
// @name         Hulu Video UI Manager
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Hulu Video UI Manager (Alt+S for Menu.)
// @author       MAD - MarshAfterDark (mB)
// @match        https://www.hulu.com/watch/*
// @homepageURL  https://github.com/mB-CodeBox/UserScripts
// @source       https://github.com/mB-CodeBox/UserScripts/raw/refs/heads/main/Hulu%20Video%20UI%20Manager.user.js
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function() {
    'use strict';

    let settings = GM_getValue('huluSettings', {
        hideContentTray: true,
        hideControlsGradient: true,
        hideTopGradient: true,
        controlsWidth: 100
    });

    const style = document.createElement('style');
    style.id = 'hulu-cleaner-styles';
    style.textContent = `
        html[data-hide-content="true"] [data-testid="fliptray-scroll-and-context-menu-wrapper"] {
            visibility: hidden !important; opacity: 0 !important; height: 0 !important; pointer-events: none !important;
        }
        html[data-hide-controls-grad="true"] .FliptrayWrapper::before {
            display: none !important;
        }
        html[data-hide-top-grad="true"] .ControlScrim__gradient {
            visibility: hidden !important; opacity: 0 !important; pointer-events: none !important;
        }

        .BottomUiControls, .Timeline {
            width: var(--hulu-ui-width, 100%) !important;
            left: 0 !important;
            right: 0 !important;
            margin: 0 auto !important;
        }

        #hulu-menu {
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background: #111; border: 2px solid #1ce783; border-radius: 8px;
            padding: 20px; z-index: 999999; color: white; font-family: sans-serif;
            display: none; box-shadow: 0 0 30px rgba(0,0,0,0.7); width: 300px;
        }
        .menu-row { display: flex; justify-content: space-between; margin: 15px 0; align-items: center; }
        .menu-row label { font-size: 14px; }
        .menu-row input[type="checkbox"] { width: 18px; height: 18px; cursor: pointer; accent-color: #1ce783; }
        .slider-container { margin-top: 15px; border-top: 1px solid #333; padding-top: 15px; }
        .slider-container label { display: block; font-size: 13px; margin-bottom: 8px; color: #1ce783; }
        input[type="range"] { width: 100%; cursor: pointer; accent-color: #1ce783; }
        .menu-help { font-size: 10px; color: #666; text-align: center; margin-top: 15px; }
    `;
    document.head.appendChild(style);

    function applySettings() {
        const root = document.documentElement;
        root.setAttribute('data-hide-content', settings.hideContentTray);
        root.setAttribute('data-hide-controls-grad', settings.hideControlsGradient);
        root.setAttribute('data-hide-top-grad', settings.hideTopGradient);
        root.style.setProperty('--hulu-ui-width', settings.controlsWidth + '%');
    }

    const menu = document.createElement('div');
    menu.id = 'hulu-menu';
    menu.innerHTML = `
        <div style="color:#1ce783; font-weight:bold; margin-bottom:10px; text-align:center;">UI SETTINGS</div>
        <div class="menu-row"><label>Hide Content Tray</label><input type="checkbox" id="chk-content" ${settings.hideContentTray ? 'checked' : ''}></div>
        <div class="menu-row"><label>Hide Controls Gradient</label><input type="checkbox" id="chk-controls" ${settings.hideControlsGradient ? 'checked' : ''}></div>
        <div class="menu-row"><label>Hide Top Gradient</label><input type="checkbox" id="chk-top" ${settings.hideTopGradient ? 'checked' : ''}></div>
        <div class="slider-container">
            <label>Control Area Width: <span id="width-val">${settings.controlsWidth}</span>%</label>
            <input type="range" id="width-slider" min="40" max="100" step="1" value="${settings.controlsWidth}">
        </div>
        <div class="menu-help">Press <b>Alt + S</b> to toggle</div>
    `;
    document.body.appendChild(menu);

    menu.addEventListener('input', (e) => {
        if (e.target.id === 'width-slider') {
            settings.controlsWidth = e.target.value;
            document.getElementById('width-val').innerText = e.target.value;
            applySettings();
        }
    });

    menu.addEventListener('change', (e) => {
        if (e.target.id.startsWith('chk-')) {
            settings.hideContentTray = document.getElementById('chk-content').checked;
            settings.hideControlsGradient = document.getElementById('chk-controls').checked;
            settings.hideTopGradient = document.getElementById('chk-top').checked;
        }
        GM_setValue('huluSettings', settings);
        applySettings();
    });

    window.addEventListener('keydown', (e) => {
        if (e.altKey && e.key.toLowerCase() === 's') {
            e.preventDefault();
            menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
        }
    });

    applySettings();
})();
