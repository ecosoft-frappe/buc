import frappe
from erpnext.selling.doctype.quotation_item.quotation_item import QuotationItem


def get_item_customer_detail(self, field):
    customer = frappe.get_value("Quotation", {"name": self.parent}, "party_name")
    return frappe.get_value(
        "Item Customer Detail",
        {"parent": self.item_code, "customer_name": customer}, field) or ""    

@property
def item_ref_code(self):
    return get_item_customer_detail(self, "ref_code")

@property
def item_ref_code_2(self):
    return get_item_customer_detail(self, "custom_ref_code_2")

@property
def item_uom(self):
    return get_item_customer_detail(self, "custom_uom")


QuotationItem.item_ref_code = item_ref_code
QuotationItem.item_ref_code_2 = item_ref_code_2
QuotationItem.item_uom = item_uom
