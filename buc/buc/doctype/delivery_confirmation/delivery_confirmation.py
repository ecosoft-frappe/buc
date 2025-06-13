# Copyright (c) 2025, Tharathip and contributors
# For license information, please see license.txt

import frappe
from frappe.model.workflow import apply_workflow
from frappe.model.document import Document


class DeliveryConfirmation(Document):
	def on_submit(self):
		delivery_postponement = list(
			set(filter(
				lambda x: x, [item.delivery_postponement for item in self.items])))
		for doc in delivery_postponement:
			dp = frappe.get_doc("Delivery Postponement", doc)
			if dp.workflow_state != "Delivered":
				apply_workflow(dp, "Deliver")
