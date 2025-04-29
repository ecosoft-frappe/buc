import frappe
from frappe.model.mapper import get_mapped_doc


@frappe.whitelist()
def make_quotation_from_stock_entry(source_name, target_doc=None):
    def set_missing_values(source, target):
        target.update({
            "quotation_to": "Customer",
            "party_name": source.custom_customer_name,
            "order_type": "Sales",
        })

    def update_item(source_item, target_item, source_doc):
        target_item.update({
            "custom_stock_entry": source_doc.name,
            "custom_medical_name": source_doc.custom_medical_name,
            "custom_surgery_date": source_doc.custom_surgery_date,
            "custom_instrument_set": source_doc.custom_instrument_set,
            "custom_surgical_side": source_doc.custom_surgical_side,
            "custom_patient_name": source_doc.custom_patient_name,
            "custom_hn": source_doc.custom_hn,
            "custom_loan_purpose": source_doc.custom_loan_purpose,
        })

    doc = get_mapped_doc(
        "Stock Entry",
        source_name,
        {
            "Stock Entry": {
                "doctype": "Quotation",
                "validation": {
                    "docstatus": ["=", 1]
                }
            },
            "Stock Entry Detail": {
                "doctype": "Quotation Item",
                "field_map": {
                    "basic_rate": "rate",
                    "t_warehouse": "warehouse",
                },
                "postprocess": update_item
            }
        },
        target_doc,
        set_missing_values
    )

    return doc
