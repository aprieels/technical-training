# -*- coding: utf-8 -*-
from odoo import models, fields, api

class Task(models.Model):
    _name = 'coopplanning.task'

    _inherit = ['mail.thread']

    name = fields.Char(track_visibility='always')
    task_template_id = fields.Many2one('coopplanning.task.template')
    task_type_id = fields.Many2one('coopplanning.task.type', string="Task Type")
    worker_id = fields.Many2one('res.partner', track_visibility='onchange')
    start_time = fields.Datetime(track_visibility='always')
    end_time = fields.Datetime(track_visibility='always')

    def message_auto_subscribe(self, updated_fields, values=None):
        self._add_follower(values)
        return super(Task, self).message_auto_subscribe(updated_fields, values=values)

    def _add_follower(self, vals):
        if vals.get('worker_id'):
            worker = self.env['res.partner'].browse(vals.get('worker_id'))
            self.message_subscribe(partner_ids=worker.ids)
