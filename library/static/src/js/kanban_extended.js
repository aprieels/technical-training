odoo.define('account.dashboard_setup_bar', function (require) {
    "use strict";

    var core = require('web.core');
    var KanbanController = require('web.KanbanController');
    var KanbanModel = require('web.KanbanModel');
    var KanbanRenderer = require('web.KanbanRenderer');
    var KanbanView = require('web.KanbanView');
    var view_registry = require('web.view_registry');

    var QWeb = core.qweb;
    var _lt = core._lt;

    var LibraryKanbanController = KanbanController.extend({
        events: {
            'click .o_customer': '_onCustomerClicked',
            'input .o_search_input': '_searchCustomers',
        },

        willStart: function () {
            var def1 = this._super.apply(this, arguments);
            var def2 = this._loadCustomers();
            return $.when(def1, def2);
        },

        reload: function (params) {
            var self = this;
            if (this.activeCustomerID) {
                params = params || {};
                params.domain = [['customer_id', '=', this.activeCustomerID]];
            }
            var def1 = this._super(params);
            var def2 = this._loadCustomers();
            return $.when(def1, def2)
                .then(function () {
                    self.$('.o_search_input').val(self.search_term);
                    self.$('.o_search_input').focus();
                });
        },

        _update: function () {
            var self = this;
            return this._super.apply(this, arguments)
                .then(function () {
                    self.$('.o_kanban_view').prepend(QWeb.render('CustomerList', {
                        activeCustomerID: self.activeCustomerID,
                        customers: self.filtered_customers,
                    }));
                });
        },

        _searchCustomers: function () {
            this.search_term = this.$('.o_search_input').val();
            this.reload();
        },

        _loadCustomers: function () {
            this.search_term = this.search_term || '';
            var self = this;
            if (!self.customers) {
                return this._rpc({
                    route: '/web/dataset/search_read',
                    model: 'res.partner',
                    fields: ['display_name'],
                    limit: 80,
                }).then(function (result) {
                    self.customers = result.records;
                    self.filtered_customers = self.customers;
                });
            }
            self.filtered_customers = self.customers.filter(function (x) { return x.display_name.toLowerCase().indexOf(self.search_term) >= 0; });
        },

        _onCustomerClicked: function (ev) {
            this.activeCustomerID = $(ev.currentTarget).data('id');
            this.reload();
        },

    });

    var LibraryKanbanView = KanbanView.extend({
        config: _.extend({}, KanbanView.prototype.config, {
            Model: KanbanModel,
            Renderer: KanbanRenderer,
            Controller: LibraryKanbanController,
        }),
        display_name: _lt('Library Kanban'),
        icon: 'fa-th-list',
    });

    view_registry.add('library_kanban', LibraryKanbanView);

});