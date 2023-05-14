// ==UserScript==
// @id             iitc-plugin-autonavi-link@Nefinite
// @name           IITC plugin: AutoNavi Map Link
// @category       Portal Info
// @version        0.0.1.20230513.2
// @namespace      https://github.com/jonatkins/ingress-intel-total-conversion
// @updateURL      https://static.iitc.me/build/release/plugins/autonavi-link.meta.js
// @downloadURL    https://static.iitc.me/build/release/plugins/autonavi-link.user.js
// @description    [iitc-2023-05-13-1] Link to AutoNavi Map
// @include        https://*.ingress.com/intel*
// @include        http://*.ingress.com/intel*
// @match          https://*.ingress.com/intel*
// @match          http://*.ingress.com/intel*
// @include        https://*.ingress.com/mission/*
// @include        http://*.ingress.com/mission/*
// @match          https://*.ingress.com/mission/*
// @match          http://*.ingress.com/mission/*
// @grant          none
// ==/UserScript==


function wrapper(plugin_info) {
    // ensure plugin framework is there, even if iitc is not yet loaded
    if (typeof window.plugin !== 'function') window.plugin = function () { };

    //PLUGIN AUTHORS: writing a plugin outside of the IITC build environment? if so, delete these lines!!
    //(leaving them in place might break the 'About IITC' page or break update checks)
    plugin_info.buildName = 'iitc';
    plugin_info.dateTimeVersion = '20230513.2';
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

        var autoNaviLink = $('<a>').attr({ id: 'autonavi-link' }).text("[高德地图]")
        div.append(autoNaviLink)

        div.append($("<span>").text(" "))

        let primeParser = $("<a>").attr({ id: "autonavi-prime" }).text("[解析游戏内链接]").click((evt) => {
            let primeLink = prompt("Enter Prime Link")
            let url = new URL(primeLink)
            let ofl = url.searchParams.get("ofl")

            const regex = /https:\/\/intel\.ingress\.com\/intel\?pll=(?<lat>[\d\.\-]+),(?<lng>[\d\.\-]+)/g;
            let m = regex.exec(ofl);
            if (m !== null) {
                let group = m.groups
                let link = generateAutoNaviLink(group.lat, group.lng, "Prime")
                $('#autonavi-prime-link').attr({
                    href: encodeURI(link),
                    target: "_blank",
                })
                alert("按钮已更新")
            } else {
                alert("链接解析失败")
            }
            evt.stopPropagation();
        })
        let primeResult = $("<a>").attr({ id: "autonavi-prime-link" }).text("[解析结果]")
        div.append(primeParser);
        div.append($("<span>").text(" "))
        div.append(primeResult)

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
    };

    window.plugin.autoNaviLink.setup = function () {
        addHook('portalDetailsUpdated', window.plugin.autoNaviLink.appendAutoNaviLink);
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
