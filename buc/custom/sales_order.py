import frappe
from erpnext.selling.doctype.sales_order.sales_order import make_delivery_note as origin_make_delivery_note


@frappe.whitelist()
def make_delivery_note(source_name, target_doc=None, kwargs=None):
    doc = origin_make_delivery_note(source_name, target_doc=target_doc, kwargs=kwargs)
    for item in doc.items:
        if item.so_detail:
            cost_center = frappe.db.get_value("Sales Order Item", item.so_detail, "cost_center")
            item.cost_center = cost_center
    return doc
