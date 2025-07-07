import json
import frappe
from erpnext.stock.doctype.material_request.material_request import MaterialRequest
from erpnext.stock.doctype.material_request.material_request import make_purchase_order as origin_make_purchase_order
from erpnext.accounts.doctype.pricing_rule.pricing_rule import get_pricing_rule_for_item
from erpnext.stock.get_item_details import get_item_price


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

@frappe.whitelist()
def get_selling_rate(doc, item):
    if isinstance(doc, str):
        doc = frappe._dict(json.loads(doc))
    if isinstance(item, str):
        item = frappe._dict(json.loads(item))
    args = frappe._dict({
        "customer": doc.custom_customer_name,
        "company": doc.company,
        "transaction_date": doc.transaction_date,
        "price_list": doc.custom_selling_price_list,
        "item_code": item.item_code,
        "uom": item.uom,
        "doctype": "Sales Order",
        "transaction_type": "selling",
        "currency": "THB", # Fix currency
    })
    selling_rate = 0.0
    item_price_data = get_item_price(args, item.item_code)
    if item_price_data:
        selling_rate = item_price_data[0][1]
    pricing_rule_data = get_pricing_rule_for_item(args, doc=doc, for_validate=False)
    if "price_list_rate" in pricing_rule_data and pricing_rule_data["price_list_rate"]:
        selling_rate = pricing_rule_data["price_list_rate"]
    return selling_rate
