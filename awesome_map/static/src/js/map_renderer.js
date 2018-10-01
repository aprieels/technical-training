odoo.define('awesome_map.MapRenderer', function (require) {
"use strict";

var AbstractRenderer = require('web.AbstractRenderer');

var MapRenderer = AbstractRenderer.extend({
    className: "o_map_view",

    init: function (parent, data) {
        this._super.apply(this, arguments);
        this.data = data;
    },

    start: function () {
        setTimeout(this._setupLeafletMap.bind(this));
    },

    _setupLeafletMap: function () {
        var self = this;
        var initialLat = this.data[0] ? this.data[0].latitude : 51.505;
        var initialLong = this.data[0] ? this.data[0].longitude : -0.09;
         var options = { zoomControl: false};
        this.leafletMap = L.map(this.el, options).setView([initialLat, initialLong], 13);
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.leafletMap);
        _.each(this.data, function (point) {
            var marker = L.marker([point.latitude, point.longitude]).addTo(self.leafletMap);
            marker.on('click', function () {
                self.trigger_up('record_clicked', {id: point.id});
            });
        });
    },

    zoomIn: function () {
        this.leafletMap.zoomIn();
    },
    zoomOut: function () {
        this.leafletMap.zoomOut();
    },

});

return MapRenderer;

});