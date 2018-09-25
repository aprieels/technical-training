odoo.define('library_dashboard', function (require) {
"use strict";

var ControlPanelMixin = require('web.ControlPanelMixin');
var core = require('web.core');
var Widget = require('web.Widget');
var ajax = require('web.ajax');

var Dashboard = Widget.extend(ControlPanelMixin, {
    template: 'LibraryDashboard.Main',

    init: function(){
        this.all_dashboards = ['buttons', 'stats', 'chart'];
        return this._super.apply(this, arguments);
    },

    start: function(){
        return this.load(this.all_dashboards);
    },

    load: function(dashboards){
        var self = this;
        var loading_done = new $.Deferred();

        this._rpc({route: '/library/statistics'})
            .then(function (stats) {
                var all_dashboards_defs = [];

                _.each(dashboards, function(dashboard) {
                    var dashboard_def = self['load_' + dashboard](stats);
                    if (dashboard_def) {
                        all_dashboards_defs.push(dashboard_def);
                    }
                });

                // Resolve loading_done when all dashboards defs are resolved
                $.when.apply($, all_dashboards_defs).then(function() {
                    loading_done.resolve();
                });
            });

        return loading_done;
    },

    load_buttons: function(stats){
        return  new DashboardButtons(this).replace(this.$('.o_web_library_dashboard_buttons'));
    },

    load_stats: function(stats){
        return  new DashboardStats(this, stats).replace(this.$('.o_web_library_dashboard_stats'));
    },

    load_chart: function(stats){
        return  new DashboardChart(this, stats).replace(this.$('.o_web_library_dashboard_chart'));
    },

});

var DashboardButtons = Widget.extend(ControlPanelMixin, {
    template: 'LibraryDashboard.Buttons',

    events: {
        'click .o_lost_books': '_onOpenLostBooks',
        'click .o_bad_customers': '_onOpenBadCustomers',
    },

    init: function(parent){
        this.parent = parent;
        return this._super.apply(this, arguments);
    },

    reload:function(){
        return this.parent.load(['buttons']);
    },

    //--------------------------------------------------------------------------
    // Handlers
    //--------------------------------------------------------------------------

    /**
     * @private
     */
    _onOpenBadCustomers: function () {
        this.do_action('library.action_bad_customer');
    },

    /**
     * @private
     */
    _onOpenLostBooks: function () {
        this.do_action('library.action_lost_books');
    },
});

var DashboardStats = Widget.extend(ControlPanelMixin, {
    template: 'LibraryDashboard.Stats',

    init: function(parent, stats){
        this.stats = stats;
        this.parent = parent;
        return this._super.apply(this, arguments);
    },

    reload:function(){
        return this.parent.load(['stats']);
    },

});

var DashboardChart = Widget.extend(ControlPanelMixin, {
    tagName: 'canvas',
    jsLibs: ['/library/static/lib/chart.js/Chart.js'],
    custom_events: {
        'open_books': '_onOpenBooks',
    },

    init: function(parent, stats){
        this.stats = stats;
        this.parent = parent;
        return this._super.apply(this, arguments);
    },

    willStart: function () {
        return $.when(ajax.loadLibs(this), this._super.apply(this, arguments));
    },

    start: function () {
        this._renderChart();
        return this._super.apply(this, arguments);
    },

    reload:function(){
        return this.parent.load(['chart']);
    },

    //--------------------------------------------------------------------------
    // Private
    //--------------------------------------------------------------------------

    /**
     * Renders the chart
     */
    _renderChart: function () {
        var self = this;
        new Chart(this.el, {
            type: 'pie',
            data: {
                labels: ["Available", "Rented", "Lost"],
                datasets: [{
                    label: '# of Books',
                    data: [
                        this.stats.nb_available_books,
                        this.stats.nb_rented_books,
                        this.stats.nb_lost_books,
                    ],
                    backgroundColor: [
                        'rgba(75, 192, 192, 0.5)',
                        'rgba(54, 162, 235, 0.5)',
                        'rgba(255, 99, 132, 0.5)',
                    ],
                    borderColor: [
                        'rgba(75, 192, 192, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255,99,132,1)',
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                onClick: function (event, chartElements) {
                    var types = ['available', 'rented', 'lost'];
                    if (chartElements && chartElements.length) {
                        self.trigger_up('open_books', {state: types[chartElements[0]._index]});
                    }
                },
            }
        });
    },

    _onOpenBooks: function (ev) {
        var state = ev.data.state;
        var action;
        if (state === 'available') {
            action = 'library.action_available_books';
        } else if (state === 'lost') {
            action = 'library.action_lost_books';
        } else if (state === 'rented') {
            action = 'library.action_rented_books';
        } else {
            this._do_warn('Wrong state');
        }
        this.do_action(action);
    },

});

core.action_registry.add('library.dashboard', Dashboard);

return {
    Dashboard: Dashboard,
    DashboardButtons: DashboardButtons,
    DashboardStats: DashboardStats,
    DashboardChart: DashboardChart,
};

});