import frappe
from frappe.model.mapper import get_mapped_doc
from erpnext.stock.doctype.stock_entry.stock_entry import StockEntry


class StockEntryBUC(StockEntry):
    def validate(self):
        for item in self.items:
            balance_ordered_qty = item.qty - (item.custom_ordered_qty or 0)
            if item.custom_balance_ordered_qty != balance_ordered_qty:
                item.custom_balance_ordered_qty = balance_ordered_qty
        super().validate()

    def on_cancel(self):
        for item in self.items:
            if item.custom_ordered_qty > 0:
                frappe.throw("Please cancel all quotations linked to this stock entry before cancelling the stock entry.")
        super().on_cancel()

@frappe.whitelist()
def make_quotation_from_stock_entry(source_name, target_doc=None):
    def set_missing_values(source, target):
        target.update({
            "quotation_to": "Customer",
            "party_name": source.custom_customer_name,
            "selling_price_list": source.custom_selling_price_list,
            "order_type": "Sales Order",
            "ignore_pricing_rule": 1,
        })

    def update_item(source_item, target_item, source_doc):
        target_item.update({
            "custom_stock_entry": source_doc.name,
            "custom_doctor": source_doc.custom_doctor,
            "custom_surgery_date": source_doc.custom_surgery_date,
            "custom_instrument_set": source_doc.custom_instrument_set,
            "custom_surgical_side": source_doc.custom_surgical_side,
            "custom_patient_name": source_doc.custom_patient_name,
            "custom_hn": source_doc.custom_hn,
            "custom_loan_purpose": source_doc.custom_loan_purpose,
            "custom_deliver_item": 1,
            "qty": source_item.custom_balance_ordered_qty,
            "rate": source_item.custom_selling_rate,
            "amount": source_item.custom_balance_ordered_qty * source_item.custom_selling_rate,
        })

    doc = get_mapped_doc(
        "Stock Entry",
        source_name,
        {
            "Stock Entry": {
                "doctype": "Quotation",
                "validation": {
                    "docstatus": ["=", 1],
                    "purpose": ["=", "Material Transfer"],
                }
            },
            "Stock Entry Detail": {
                "doctype": "Quotation Item",
                "field_map": {
                    "t_warehouse": "warehouse",
                    "name": "custom_stock_entry_detail",
                },
                "postprocess": update_item
            }
        },
        target_doc,
        set_missing_values
    )

    # Filter qty > 0
    doc.items = [item for item in doc.items if item.qty > 0]

    # Reset idx
    for i, item in enumerate(doc.items, start=1):
        item.idx = i

    return doc

@frappe.whitelist()
@frappe.validate_and_sanitize_search_inputs
def get_loan_document(doctype, txt, searchfield, start, page_len, filters):
    conditions = ""
    if txt:
        conditions += "and se.name like '%%" + txt + "%%' "
    if filters.get("stock_entry_type"):
        conditions += "and se.stock_entry_type = '" + filters["stock_entry_type"] + "' "
    if filters.get("customer_name"):
        conditions += "and se.custom_customer_name = '" + filters["customer_name"] + "' "
    if filters.get("patient_name"):
        conditions += "and se.custom_patient_name like '%%" + filters["patient_name"] + "%%' "
    if filters.get("hn"):
        conditions += "and se.custom_hn like '%%" + filters["hn"] + "%%' "
    se_data = frappe.db.sql(
        f"""
            select distinct se.name, se.stock_entry_type, se.custom_customer_name as customer_name, se.custom_patient_name as patient_name, se.custom_hn as hn
            from `tabStock Entry` se, `tabStock Entry Detail` sed
            where
                se.name = sed.parent
                and se.docstatus = 1
                and se.purpose = 'Material Transfer'
                and sed.custom_balance_ordered_qty > 0
                {conditions}
            order by se.name asc
            limit %(page_len)s offset %(start)s
        """,
        {
            "page_len": page_len,
            "start": start
        },
        as_dict=1
    )
    return se_data
