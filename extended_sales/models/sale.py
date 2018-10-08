# -*- coding: utf-8 -*-
from odoo import _, api, fields, models


class SaleOrderExtended(models.Model):
    _inherit = "sale.order"

    state = fields.Selection([
        ('draft', 'Quotation'),
        ('sent', 'Quotation Sent'),
        ('confirmation', 'To be Confirmed'),
        ('sale', 'Sales Order'),
        ('done', 'Locked'),
        ('cancel', 'Cancelled'),
    ], string='Status', readonly=True, copy=False, index=True, track_visibility='onchange', default='draft')

    @api.multi
    def action_confirm(self):
        for order in self:
            order.state = 'confirmation'
        return True

    @api.multi
    def action_second_confirm(self):
        return super().action_confirm()
