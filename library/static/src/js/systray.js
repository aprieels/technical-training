odoo.define('customer.systray', function (require) {
"use strict";

var SystrayMenu = require('web.SystrayMenu');
var Widget = require('web.Widget');

var CustomerSystrayMenu = Widget.extend({
    template: "LibrarySystrayItem",
    sequence: 10,
    events: {
        'input .o_input': '_onInput',
    },

    _onInput: function () {
        var id = parseInt(this.$('.o_input').val());
        console.log(id)
        if (!_.isNaN(id)) {
            this.do_action('library.action_customer_form', {
                res_id: id,
            });
        }
    }
});

SystrayMenu.Items.push(CustomerSystrayMenu);

});