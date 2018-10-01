odoo.define('library.form_view', function (require) {
"use strict";

var BasicModel = require('web.BasicModel');
var FormController = require('web.FormController');
var FormRenderer = require('web.FormRenderer');
var FormView = require('web.FormView');
var viewRegistry = require('web.view_registry');

var qweb = require('web.core').qweb;

var LibraryCustomerController = FormController.extend({
    renderButtons: function ($node) {
        var self = this;
        this._super($node);
        var $libraryButtons = $(qweb.render('LibraryCustomerButtons'));
        this.$buttons.find('.o_form_buttons_view').append($libraryButtons);
        this.$buttons.on('click', '.o_geolocate', function () {
            self._onGeolocateClick();
        });
        this.$buttons.on('click', '.o_pay_amount_owed', function () {
            $(this).attr('disabled', true);
            self._onPayAmountClick();
        });
        this.update();
    },

    _update: function (state) {
        if (this.$buttons) {
            var $payButton = this.$buttons.find('.o_pay_amount_owed');
            $payButton.attr('disabled', state.data.amount_owed <= 0);
        }
        return this._super(state);
    },

    _onGeolocateClick: function () {
        var self = this;
        var res_id = this.model.get(this.handle, {raw: true}).res_id;
        this._rpc({
            model: 'res.partner',
            method: 'geo_localize',
            args: [res_id]
        }).then(function () {
            self.reload();
        });
    },

    _onPayAmountClick: function () {
        var self = this;
        var res_id = this.model.get(this.handle, {raw: true}).res_id;
        this._rpc({
            model: 'res.partner',
            method: 'pay_amount',
            args: [res_id]
        }).then(function () {
            self.reload();
        });
    },
});

var LibraryCustomerView = FormView.extend({
    config: {
        Model: BasicModel,
        Renderer: FormRenderer,
        Controller: LibraryCustomerController,
    },
});

viewRegistry.add('library_customer', LibraryCustomerView);

});