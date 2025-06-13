# Copyright (c) 2025, Tharathip and contributors
# For license information, please see license.txt

import frappe
from frappe.model.mapper import get_mapped_doc
from frappe.model.document import Document


class DeliveryPostponement(Document):
    def before_submit(self):
        for item in self.items:
            sales_order_item = frappe.db.get_value(
                "Sales Order Item",
                item.sales_order_item,
                ["qty", "delivered_qty"],
                as_dict=1)
            if sales_order_item.delivered_qty >= sales_order_item.qty:
                frappe.throw("Delivered quantity must be less than the ordered quantity.")

    @property
    def sales_order(doc):
        sales_order = list(set(filter(lambda x: x, [item.sales_order for item in doc.items])))
        return ", ".join(sales_order)

    @property
    def sales_invoice(doc):
        sales_invoice = list(set(filter(lambda x: x, [item.sales_invoice for item in doc.items])))
        return ", ".join(sales_invoice)

@frappe.whitelist()
def make_delivery_confirmation(source_name, target_doc=None):
    def set_missing_values(source, target):
        target.update({
            "naming_series": "DC-.YYYY.-",
            "subject": "ส่งมอบเครื่องมือแพทย์",
            "date": frappe.utils.getdate(),
            "prepared_by": frappe.session.user,
        })

    def update_item(source_item, target_item, source_doc):
        target_item.update({
			"delivery_postponement": source_doc.name,
			"delivery_postponement_item": source_item.name,
        })

    doc = get_mapped_doc(
        "Delivery Postponement",
        source_name,
        {
            "Delivery Postponement": {
                "doctype": "Delivery Confirmation",
            },
            "Delivery Postponement Item": {
                "doctype": "Delivery Confirmation Item",
                "postprocess": update_item,
            }
        },
        target_doc,
        set_missing_values,
        ignore_permissions=True,
    )

    return doc
