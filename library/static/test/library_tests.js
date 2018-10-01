odoo.define('library.tests', function (require) {
    "use strict";

    var test_utils = require('web.test_utils'),
        ListView = require('web.ListView'),
        KanbanView = require('web.KanbanView');

    var DashboardAction = require('library.client_action');

    var actionManager = require('web.ActionManager');

    var dashboard_data = {
        'money_in': 999,
        'nb_rentals': 12,
        'nb_lost_books': 1,
        'money_lost': 10,
        'nb_available_books': 10,
        'nb_rented_books': 8,
        'nb_lost_books_total': 1,
    }

    QUnit.module('library', {
        beforeEach: function () {
            this.data = {
                'product.product': {
                    fields: {
                        id: { string: "ID", type: "integer" },
                        name: { string: "Display Name", type: "char" },
                    },
                    records: [
                        { id: 1, name: "GOT" },
                        { id: 2, name: "GOT2" },
                    ]
                },
                'res.partner': {
                    fields: {
                        id: { string: "ID", type: "integer" },
                        name: { string: "Display Name", type: "char" },
                    },
                    records: [
                        { id: 1, name: "Partner1" },
                        { id: 7, name: "Partner7" },
                    ]
                },
                'library.rental': {
                    fields: {
                        customer_id: {
                            string: 'Customer',
                            type: 'many2one',
                            relation: 'res.partner',
                        },
                        book_id: {
                            string: 'Book',
                            type: 'many2one',
                            relation: 'product.product',
                        },
                        rental_date: {
                            string: 'Rental date',
                            type: 'date',
                        },
                        return_date: {
                            string: 'Return date',
                            type: 'date',
                        },
                        state: {
                            string: 'State',
                            type: 'selection'
                        },
                        is_late: {
                            string: 'Is late',
                            type: 'boolean',
                        }
                    },
                    records: [
                        {
                            id: 1,
                            customer_id: 7,
                            book_id: 1,
                            rental_date: "2018-09-20",
                            return_date: "2018-09-27",
                            state: 'rented',
                            is_late: true,
                        },
                        {
                            id: 2,
                            customer_id: 1,
                            book_id: 2,
                            rental_date: "2018-09-20",
                            return_date: "2018-09-27",
                            state: 'returned',
                            is_late: false,
                        },
                    ],
                },
            };
        }
    }, function () {
        QUnit.module('LateWidget');
        QUnit.test('Test is_late widget', function (assert) {
            assert.expect(2);
            var view = test_utils.createView({
                View: ListView,
                model: 'library.rental',
                data: this.data,
                arch: '<tree><field name="is_late" widget="late-widget"/></tree>'
            });
            assert.strictEqual(view.$('.o_field_late_boolean:eq(0)').css('background-color'), 'rgb(255, 0, 0)');
            assert.strictEqual(view.$('.o_field_late_boolean:eq(1)').css('background-color'), 'rgb(0, 128, 0)');
        });

        QUnit.module('KanbanView');
        QUnit.test('Test Kanban', function (assert) {
            assert.expect(6);
            var count_rpc = 0;
            var view = test_utils.createView({
                View: KanbanView,
                model: 'library.rental',
                data: this.data,
                arch:
                    '<kanban create="false" default_group_by="state" js_class="library_kanban">' +
                    '<templates>' +
                    '<t t-name="kanban-box">' +
                    '<div>' +
                    '<field name="customer_id" />' +
                    '<field name="book_id" />' +
                    '</div>' +
                    '</t>' +
                    '</templates>' +
                    '</kanban >',
                mockRPC: function (route, args) {
                    if (args.model == "res.partner") {
                        assert.step(route);
                    }
                    count_rpc += 1;
                    return this._super.apply(this, arguments);
                },
            });

            assert.strictEqual(view.$('.o_kanban_record').length, 2, 'should be instantiated and have 2 records');
            assert.verifySteps(['/web/dataset/search_read'], "Only one rpc call to res.partner");
            assert.strictEqual(view.$('.o_customer').length, 2, "Should be a list where we have 2 customers");

            count_rpc = 0;
            view.$('.o_search_input').val('a');
            assert.strictEqual(count_rpc, 0, 'Filtering should not induce RPCs');

            view.$('.o_customer').trigger("click");
            assert.strictEqual(view.$('.o_kanban_record:not(.o_kanban_ghost)').length, 1, 'should be filtered and have 1 record');

        });

        QUnit.module('Dashboard');
        QUnit.test('Test Dashboard', function (assert) {

            assert.expect(7);

            var clientAction = new DashboardAction();

            test_utils.addMockEnvironment(clientAction, {
                data: this.data,
                mockRPC: function (route, args) {
                    if (route === '/library/statistics') {
                        // should be called twice: for the first rendering, and after the target update
                        assert.ok(true, "should call /statistics");
                        return $.when(dashboard_data);
                    }
                    return this._super.apply(this, arguments);
                },
            });

            clientAction.appendTo($('#qunit-fixture'));

            test_utils.observe(clientAction);

            test_utils.intercept(clientAction, 'do_action', function (event) {
                assert.strictEqual(JSON.stringify(event.data.action),
                    "\"library.action_lost_books\"");
            });

            assert.ok(clientAction.$el.hasClass('o_library'), "should be instanced");
            assert.strictEqual(clientAction.$('.o_statistics').length, 1, "should have a 'statistics' section");
            assert.strictEqual(clientAction.$buttons.find('.o_lost_books').length, 1, "should have a lost_books button");
            assert.strictEqual(clientAction.$buttons.find('.o_bad_customers').length, 1, "should have a bad_customers button");
            assert.strictEqual(clientAction.$('.o_fancy_chart').length, 1, "should have a chartjs");

            clientAction.$buttons.find('.o_lost_books').trigger('click');

            //clientAction.destroy();

        });

    });

});