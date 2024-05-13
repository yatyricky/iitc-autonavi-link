// ==UserScript==
// @id             iitc-plugin-autonavi-link@Nefinite
// @name           IITC plugin: AutoNavi Map Link
// @category       Portal Info
// @version        0.0.2.20240513
// @namespace      https://github.com/jonatkins/ingress-intel-total-conversion
// @updateURL      https://static.iitc.me/build/release/plugins/autonavi-link.meta.js
// @downloadURL    https://static.iitc.me/build/release/plugins/autonavi-link.user.js
// @description    [iitc-2024-05-13] Link to AutoNavi Map
// @match          https://intel.ingress.com/*
// @match          https://intel-x.ingress.com/*
// @icon           https://iitc.app/extras/plugin-icons/basemap-gaode.png
// @icon64         https://iitc.app/extras/plugin-icons/basemap-gaode-64.png
// @grant          none
// ==/UserScript==


function wrapper(plugin_info) {
    // ensure plugin framework is there, even if iitc is not yet loaded
    if (typeof window.plugin !== 'function') window.plugin = function () { };

    //PLUGIN AUTHORS: writing a plugin outside of the IITC build environment? if so, delete these lines!!
    //(leaving them in place might break the 'About IITC' page or break update checks)
    plugin_info.buildName = 'iitc';
    plugin_info.dateTimeVersion = '20240513';
    plugin_info.pluginId = 'autonavi-link';
    //END PLUGIN AUTHORS NOTE


    // PLUGIN START ////////////////////////////////////////////////////////

    // use own namespace for plugin
    window.plugin.autoNaviLink = function () { };

    function generateAutoNaviLink(lat, lng, portalName) {
        return `https://uri.amap.com/marker?position=${lng},${lat}&name=${portalName}&src=IITC-Mobile&coordinate=wgs84&callnative=1`
    }

    window.plugin.autoNaviLink.appendAutoNaviLink = function () {
        let div = $("<div>")

        var autoNaviLink = $('<a>').attr({ id: 'autonavi-link' }).text("高德地图")
        div.append(autoNaviLink)
        div.append($("<span>").text("|"))

        let deepPortalLinkDOM = $("<a>").attr({ id: "deep-portal-link" }).text("跳转游戏")
        div.append(deepPortalLinkDOM)

        $('#resodetails').after(div);

        window.plugin.autoNaviLink.updateAutoNaviLink();
    };

    window.plugin.autoNaviLink.updateAutoNaviLink = function () {
        if (!(selectedPortal && portals[selectedPortal])) return;
        var portal = portals[selectedPortal];

        var ll = portal.getLatLng();
        let portalName = portal.options.data.title
        let link = generateAutoNaviLink(ll.lat, ll.lng, portalName)

        $('#autonavi-link').attr({
            href: encodeURI(link),
            target: "_blank",
        })

        let guid = portal.options.guid
        let deepPortalLink = `https://link.ingress.com/?link=https%3a%2f%2fintel.ingress.com%2fportal%2f${guid}&apn=com.nianticproject.ingress&isi=576505181&ibi=com.google.ingress&ifl=https%3a%2f%2fapps.apple.com%2fapp%2fingress%2fid576505181&ofl=https%3a%2f%2fintel.ingress.com%2fintel%3fpll%3d${ll.lat}%2c${ll.lng}`
        $("#deep-portal-link").attr({
            href: deepPortalLink,
            target: "_blank",
        })

        $(document).on("click", ".nickname", function (event) {
            let nickName = $(this).text()
            let profileDeepLink = `https://link.ingress.com/?link=https%3a%2f%2fintel.ingress.com%2fagent%2f${nickName}&apn=com.nianticproject.ingress&isi=576505181&ibi=com.google.ingress&ifl=https%3a%2f%2fapps.apple.com%2fapp%2fingress%2fid576505181&ofl=https%3a%2f%2fwww.ingress.com%2f`
            alert(profileDeepLink)
        });
    };

    window.plugin.autoNaviLink.inputPrimeLink = function () {
        let primeLink = prompt("输入游戏内链接")
        let ofl
        try {
            let url = new URL(primeLink)
            ofl = url.searchParams.get("ofl")
        } catch (error) {
        }

        if (typeof ofl === "string" && ofl.length > 0) {
            let pllLat
            let pllLng
            try {
                let pllUrl = new URL(ofl)
                let pll = pllUrl.searchParams.get("pll")
                let pllTokens = pll.split(",")
                pllLat = parseFloat(pllTokens[0])
                pllLng = parseFloat(pllTokens[1])
            } catch (error) {
            }
            if (typeof pllLng === "number") {
                window.selectPortalByLatLng(pllLat, pllLng)
            } else {
                window.open(ofl, "_self")
            }
        } else {
            alert("链接解析失败")
        }
    }

    window.plugin.autoNaviLink.setup = function () {
        addHook('portalDetailsUpdated', window.plugin.autoNaviLink.appendAutoNaviLink);
        $('#toolbox').append('<a onclick="window.plugin.autoNaviLink.inputPrimeLink();return false;">输入游戏内链接</a>');
    };

    var setup = window.plugin.autoNaviLink.setup;

    // PLUGIN END //////////////////////////////////////////////////////////


    setup.info = plugin_info; //add the script info data to the function as a property
    if (!window.bootPlugins) window.bootPlugins = [];
    window.bootPlugins.push(setup);
    // if IITC has already booted, immediately run the 'setup' function
    if (window.iitcLoaded && typeof setup === 'function') setup();
} // wrapper end
// inject code into site context
var script = document.createElement('script');
var info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) {
    info.script = {
        version: GM_info.script.version,
        name: GM_info.script.name,
        description: GM_info.script.description
    };
}
script.appendChild(document.createTextNode('(' + wrapper + ')(' + JSON.stringify(info) + ');'));
(document.body || document.head || document.documentElement).appendChild(script);
