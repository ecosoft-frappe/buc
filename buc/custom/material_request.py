import frappe


@frappe.whitelist()
def get_target_warehouse(customer):
    address = frappe.db.sql_list("""
        select parent
        from `tabDynamic Link`
        where parenttype = 'Address' and parentfield = 'links' and link_doctype = 'Customer' and link_name = %s
    """, (customer, )
    )
    target_warehouse = ""
    if address:
        warehouse = frappe.db.sql_list("""
            select wh.name
            from `tabDynamic Link` dl
            left join `tabWarehouse` wh on dl.link_name = wh.name
            where dl.parenttype = 'Address' and dl.parentfield = 'links' and dl.parent in %s and dl.link_doctype = 'Warehouse' and wh.custom_warehouse_purpose = 'Main'
        """, (address, )
        )
        if warehouse:
            target_warehouse = warehouse[0]
    return target_warehouse
