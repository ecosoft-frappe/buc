import frappe
from frappe.model.mapper import get_mapped_doc


@frappe.whitelist()
def make_delivery_postponement(source_name, target_doc=None):
    def update_item(source_item, target_item, source_doc):
        target_item.update({
            "sales_invoice": source_doc.name,
            "sales_invoice_item": source_item.name,
            "sales_order": source_item.sales_order,
            "sales_order_item": source_item.so_detail
        })
        if source_item.so_detail:
            sales_order_item = frappe.db.get_value(
                "Sales Order Item",
                source_item.so_detail,
                ["qty", "delivered_qty"],
                as_dict=1)
            qty = sales_order_item.qty - sales_order_item.delivered_qty
            target_item.update({
                "qty": qty,
                "rate": source_item.rate,
                "amount": qty * source_item.rate,
            })

    doc = get_mapped_doc(
        "Sales Invoice",
        source_name,
        {
            "Sales Invoice": {
                "doctype": "Delivery Postponement",
            },
            "Sales Invoice Item": {
                "doctype": "Delivery Postponement Item",
                "postprocess": update_item,
            }
        },
        target_doc,
        ignore_permissions=True,
    )

    # Filter qty > 0
    doc.items = [item for item in doc.items if item.qty > 0]

    # Reset idx
    for i, item in enumerate(doc.items, start=1):
        item.idx = i

    return doc

@frappe.whitelist()
@frappe.validate_and_sanitize_search_inputs
def get_sales_invoice_based_on_customer(doctype, txt, searchfield, start, page_len, filters):
    conditions = ""
    if txt:
        conditions += "and si.name like '%%" + txt + "%%' "
    si_data = frappe.db.sql(
        f"""
        select distinct si.name, si.customer
        from `tabSales Invoice` si
        left join `tabSales Invoice Item` sii on si.name = sii.parent
        left join `tabSales Order Item` soi on sii.so_detail = soi.name
        where
            si.customer = %(customer)s
            and si.docstatus = %(docstatus)s
            and soi.delivered_qty < soi.qty
            {conditions}
        order by si.name ASC
        limit %(page_len)s offset %(start)s """,
        {
            "customer": filters.get("customer"),
            "docstatus": filters.get("docstatus"),
            "page_len": page_len,
            "start": start
        },
        as_dict=1
    )
    return si_data
