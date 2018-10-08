odoo.define('library.fields', function (require) {
"use strict";

var qweb = require('web.core').qweb;

var basicFields = require('web.basic_fields');
var fieldRegistry = require('web.field_registry');

var RawFieldInteger = basicFields.FieldInteger.extend({

    _formatValue: function (value) {
        return value;
    },

});

var LateWidget = basicFields.FieldBoolean.extend({

    init: function () {
        this._super.apply(this, arguments);
        this.lateColor = this.nodeOptions.late_color || 'red';
        this.notLateColor = this.nodeOptions.not_late_color || 'green';
    },

    _render: function () {
        this.$el.html($('<div class="o_field_late_boolean">').css({
            backgroundColor: this.value ? this.lateColor : this.notLateColor
        }));
    },
});

var AmountDueWidget = basicFields.FieldFloat.extend({

    init: function () {
        this._super.apply(this, arguments);
        this.class = this.value >= 20.0 ? 'alert-danger' : 'alert-warning';
    },

    _renderReadonly: function () {
        if(this.value >= 10.0){
            this.$el.html(qweb.render('LibraryWarning', {amount: this.value}));
            this.$el.find(".alert").addClass(this.class);
        } else {
            this.$el.empty();
        }
    },

});

fieldRegistry.add('raw-field-integer', RawFieldInteger);
fieldRegistry.add('late-widget', LateWidget);
fieldRegistry.add('amount-due-widget', AmountDueWidget);

});