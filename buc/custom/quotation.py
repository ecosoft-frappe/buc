import frappe


@frappe.whitelist()
def get_stock_entry():
    query = frappe.db.sql("""
        select distinct qi.custom_stock_entry
        from `tabQuotation Item` qi
        join `tabQuotation` q on qi.parent = q.name
        where q.docstatus <> 2 and qi.custom_stock_entry <> ""
    """, as_dict=True)
    return list(map(lambda d: d["custom_stock_entry"], query))