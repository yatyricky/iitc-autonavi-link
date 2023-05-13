// ==UserScript==
// @id             iitc-plugin-gaode-link@Nefinite
// @name           IITC plugin: Gaode Map Link
// @category       Portal Info
// @version        0.0.1.20230513.1
// @namespace      https://github.com/jonatkins/ingress-intel-total-conversion
// @updateURL      https://static.iitc.me/build/release/plugins/gaode-link.meta.js
// @downloadURL    https://static.iitc.me/build/release/plugins/gaode-link.user.js
// @description    [iitc-2023-05-13-1] Link to Gaode Map
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
    plugin_info.dateTimeVersion = '20230513.1';
    plugin_info.pluginId = 'gaode-link';
    //END PLUGIN AUTHORS NOTE


    // PLUGIN START ////////////////////////////////////////////////////////

    // use own namespace for plugin
    window.plugin.gaodeLink = function () { };

    window.plugin.gaodeLink.appendGaodeLink = function () {
        var div = $('<a>')
            .attr({
                id: 'gaode-link',
            })

        $('#resodetails').after(div);

        window.plugin.gaodeLink.updateGaodeLink();
    };

    window.plugin.gaodeLink.updateGaodeLink = function () {
        if (!(selectedPortal && portals[selectedPortal])) return;
        var portal = portals[selectedPortal];

        var ll = portal.getLatLng();
        let portalName = portal.options.data.title

        let sourceApp = "IITC-Mobile"

        let link
        if (false && window.navigator.userAgent.indexOf("iPhone") >= 0) {
            link = `iosamap://viewMap?sourceApplication=${sourceApp}&poiname=${portalName}&lat=${ll.lat}&lon=${ll.lng}&dev=1`
        } else {
            link = `https://uri.amap.com/marker?position=${ll.lng},${ll.lat}&name=${portalName}&src=${sourceApp}&coordinate=wgs84&callnative=1`
        }

        $('#gaode-link').text("高德地图").attr({
            href: encodeURI(link),
            target: "_blank",
        })
    };

    window.plugin.gaodeLink.setup = function () {
        addHook('portalDetailsUpdated', window.plugin.gaodeLink.appendGaodeLink);
    };

    var setup = window.plugin.gaodeLink.setup;

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


