# Copyright (c) 2025, Tharathip and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class SetofItem(Document):

	def validate(self):
		# Validate serial no / batch no
		for item in self.items:
			if item.serial_no and item.batch_no:
				frappe.throw(
					"Cannot set both serial no and batch no for an item %s." % (
						item.item_code))
			if not item.serial_no and not item.batch_no:
				frappe.throw("Either serial no or batch no must be set for an item %s." % (
					item.item_code))
			if item.serial_no and item.qty != 1:
				frappe.throw("Row %s: item code %s must have qty equal to 1." % (item.idx, item.item_code))
