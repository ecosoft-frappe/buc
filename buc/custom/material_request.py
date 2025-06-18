import frappe
from erpnext.stock.doctype.material_request.material_request import MaterialRequest


class MaterialRequestBUC(MaterialRequest):
    @property
    def manager_role(doc):
        department = frappe.db.get_value(
            "Employee",
            {"user_id": doc.owner},
            "department"
        )
        if department:
            manager_role = frappe.db.get_value(
                "Department",
                department,
                "custom_manager_role"
            )
            if manager_role:
                return manager_role
            else:
                frappe.throw("Manager Role doesn't exist in department %s." % department)
        else:
            frappe.throw("Department doesn't exist for document owner.")

    @property
    def ceo_role(doc):
        ceo_role = frappe.db.get_value(
            "Company",
            doc.company,
            "custom_ceo_role"
        )
        if ceo_role:
            return ceo_role
        else:
            frappe.throw("CEO Role doesn't exist in %s." % doc.company)


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
