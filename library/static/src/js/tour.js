odoo.define('example.tour', function (require) {
    "use strict";

    var core = require('web.core');
    var tour = require('web_tour.tour');

    var _t = core._t;

    tour.register('library_tour', {
        url: "/web",
    }, [
            {
                trigger: '.o_app[data-menu-xmlid="library.menu_root"]',
                content: _t('Want to <b>create rentals</b>?<br/><i>Click on Library to start.</i>'),
                position: 'bottom',
            },
            {
                trigger: 'a[data-menu-xmlid="library.menu_rental_top"]',
                position: 'bottom',
            },
            {
                trigger: 'a[data-menu-xmlid="library.menu_rental"]',
                position: 'bottom',
            },
            {
                trigger: '.o_list_button_add',
                position: 'bottom',
            },
            {
                trigger: 'div[name="customer_id"]>div>input',
                position: 'bottom',
                run: 'click'
            },
            {
                trigger: 'a:contains("Daenerys Targaryan") ',
                position: 'bottom',
                run: 'click'
            },
            {
                trigger: 'div[name="book_id"]>div>input',
                position: 'bottom',
                run: 'click'
            },
            {
                trigger: 'a:contains("Game of Thrones") ',
                position: 'bottom',
                run: 'click'
            },
            {
                trigger: 'input[name="return_date"]',
                position: 'bottom',
                run: 'text 10/08/2018'
            },
            {
                trigger: '.o_form_button_save',
                position: 'bottom',
            },
            {
                trigger: 'button:contains("Confirm") ',
                position: 'bottom',
                run: 'click'
            },
            {
                trigger: 'a[data-menu-xmlid="library.menu_customer_top"]',
                position: 'bottom',
            },
            {
                trigger: 'a[data-menu-xmlid="library.menu_customer"]',
                position: 'bottom',
            },
            {
                trigger: '.o_data_row:first > td:contains("Daenerys Targaryan")',
                position: 'bottom',
                run: 'click',
            },
            {
                trigger: 'td:contains("Game of Thrones")',
                position: 'bottom',
                run: 'click',
            },
            {
                trigger: 'button:contains("Return") ',
                position: 'bottom',
                run: 'click'
            },
            {
                trigger: '.close',
                position: 'bottom',
            },
            tour.STEPS.TOGGLE_APPSWITCHER
        ]);
});