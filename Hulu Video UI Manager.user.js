// ==UserScript==
// @name         Hulu Video UI Manager
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Hulu Video UI Manager
// @author       MAD - MarshAfterDark (mB)
// @match        https://www.hulu.com/*
// @homepageURL  https://github.com/mB-CodeBox/UserScripts
// @source       https://github.com/mB-CodeBox/UserScripts/raw/refs/heads/main/Hulu%20Video%20UI%20Manager.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'hulu_ui_settings';
    let settings = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
        hideContentTray: true,
        hideControlsGradient: true,
        hideTopGradient: true,
        shrinkControls: false,
        hideMetadata: false,
        hideUpNext: false
    };

    const saveSettings = () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        applySettings();
    };

    const style = document.createElement('style');
    style.id = 'hulu-native-mirror-styles';
    style.textContent = `
        html[data-hide-content="true"] [data-testid="fliptray-scroll-and-context-menu-wrapper"] {
            visibility: hidden !important; opacity: 0 !important; pointer-events: none !important;
        }
        html[data-hide-content="true"] .FliptrayWrapper { transform: translateY(0) !important; transition: none !important; }
        html[data-hide-controls-grad="true"] .FliptrayWrapper::before { display: none !important; }
        html[data-hide-top-grad="true"] .ControlScrim__gradient { visibility: hidden !important; opacity: 0 !important; }

        html[data-shrink-controls="true"] .FliptrayWrapper > div:first-child {
            width: 45% !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            margin: 0 !important;
            display: block !important;
        }

        html[data-shrink-controls="true"] .BottomUiControls, 
        html[data-shrink-controls="true"] .Timeline {
            width: 100% !important;
            left: 0 !important;
            right: 0 !important;
        }

        html[data-hide-metadata="true"] .OnNowMetadata { display: none !important; }
        html[data-hide-upnext="true"] .UpNextMetadata { display: none !important; }

        #custom-play-next { display: none !important; align-items: center; justify-content: center; margin-right: 5px; }
        html[data-hide-upnext="true"] #custom-play-next { display: flex !important; }

        .hulu-native-style-row {
            height: 44px; padding: 0 20px; display: flex; justify-content: space-between;
            align-items: center; cursor: pointer; color: #fff;
            font-family: "Hulu Sans", Arial, Helvetica, sans-serif; font-size: 14px;
        }
        .hulu-native-style-row:hover { background: rgba(255, 255, 255, 0.1); }
        .hulu-native-style-row input[type="checkbox"] {
            appearance: none; width: 18px; height: 18px; border: 2px solid #666;
            border-radius: 2px; position: relative; cursor: pointer;
        }
        .hulu-native-style-row input[type="checkbox"]:checked { background: #1ce783; border-color: #1ce783; }
        .hulu-native-style-row input[type="checkbox"]:checked::after {
            content: ''; position: absolute; left: 5px; top: 1px; width: 5px; height: 10px;
            border: solid black; border-width: 0 2px 2px 0; transform: rotate(45deg);
        }
    `;
    document.head.appendChild(style);

    function applySettings() {
        const root = document.documentElement;
        root.setAttribute('data-hide-content', settings.hideContentTray);
        root.setAttribute('data-hide-controls-grad', settings.hideControlsGradient);
        root.setAttribute('data-hide-top-grad', settings.hideTopGradient);
        root.setAttribute('data-shrink-controls', settings.shrinkControls);
        root.setAttribute('data-hide-metadata', settings.hideMetadata);
        root.setAttribute('data-hide-upnext', settings.hideUpNext);
    }

    function createRow(label, key) {
        const row = document.createElement('div');
        row.className = 'hulu-native-style-row';
        row.innerHTML = `<span>${label}</span><input type="checkbox" ${settings[key] ? 'checked' : ''}>`;
        row.onclick = (e) => {
            const cb = row.querySelector('input');
            if (e.target !== cb) cb.checked = !cb.checked;
            settings[key] = cb.checked;
            saveSettings();
        };
        return row;
    }

    const observer = new MutationObserver(() => {
        const huluMenu = document.querySelector('[role="menu"], .SettingsMenu, .SettingsMenu__container');
        if (huluMenu && !huluMenu.querySelector('#hulu-mod-section')) {
            const section = document.createElement('div');
            section.id = 'hulu-mod-section';
            section.style.borderTop = '1px solid rgba(255,255,255,0.2)';
            section.style.marginTop = '8px';

            section.appendChild(createRow('Hide Content Tray', 'hideContentTray'));
            section.appendChild(createRow('Hide Bottom Gradient', 'hideControlsGradient'));
            section.appendChild(createRow('Hide Top Gradient', 'hideTopGradient'));
            section.appendChild(createRow('Shrink Controls', 'shrinkControls'));
            section.appendChild(createRow('Hide Show Info (Left)', 'hideMetadata'));
            section.appendChild(createRow('Hide Up Next (Right)', 'hideUpNext'));

            huluMenu.appendChild(section);
        }

        const settingsGroup = document.querySelector('.PlayerSettingsGroup');
        const settingsBtn = document.querySelector('.SettingsButton');
        
        if (settingsGroup && settingsBtn && !document.querySelector('#custom-play-next')) {
            const nextBtn = document.createElement('div');
            nextBtn.id = 'custom-play-next';
            nextBtn.className = 'PlayerButton PlayerControlsButton PlayerSettingsGroup__button';
            nextBtn.title = "Play Next Episode";
            
            nextBtn.innerHTML = `
                <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" class="SvgIcon" style="width: 24px; height: 24px;">
                    <g transform="translate(0 1)" fill="#FFF" fill-rule="evenodd">
                        <path d="M.769.49l9.569 6.106a.5.5 0 01-.001.843l-9.57 6.074A.5.5 0 010 13.09V.912A.5.5 0 01.769.491z"></path>
                        <rect x="14" width="2" height="14" rx="1"></rect>
                    </g>
                </svg>
            `;
            
            nextBtn.onclick = (e) => {
                e.stopPropagation();
                const realNextBtn = document.querySelector('[data-testid="player-metadata-play-next"]');
                if (realNextBtn) {
                    realNextBtn.click();
                }
            };
            
            settingsGroup.insertBefore(nextBtn, settingsBtn);
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    applySettings();
})();
