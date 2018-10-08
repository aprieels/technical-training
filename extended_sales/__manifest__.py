# -*- coding: utf-8 -*-
{
    'name': "Sales Extended",

    'summary': """
        Sales extended""",

    'description': """
        Extends the sales module....
    """,

    'author': "Odoo",
    'website': "http://www.odoo.com",

    # Categories can be used to filter modules in modules listing
    # Check https://github.com/odoo/odoo/blob/10.0/odoo/addons/base/module/module_data.xml
    # for the full list
    'category': 'Training',
    'version': '0.1',
    'application': True,

    # any module necessary for this one to work correctly
    'depends': ['sale'],

    # always loaded
    'data': [
        "views/sale.xml",
    ],
    # only loaded in demonstration mode
    'demo': [],

    # static templates
    'qweb': [],
}
