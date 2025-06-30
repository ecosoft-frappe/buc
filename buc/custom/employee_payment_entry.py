import frappe
from hrms.overrides.employee_payment_entry import get_payment_entry_for_employee as origin_get_payment_entry_for_employee

@frappe.whitelist()
def get_payment_entry_for_employee(dt, dn, party_amount=None, bank_account=None, bank_amount=None):
    res = origin_get_payment_entry_for_employee(dt, dn, party_amount=party_amount, bank_account=bank_account, bank_amount=bank_amount)
    doc = frappe.get_doc(dt, dn)
    meta = frappe.get_meta(dt)
    fields = [df.fieldname for df in meta.fields]
    if "cost_center" in fields:
        res.cost_center = doc.cost_center
    if "department" in fields:
        res.department = doc.department
    if "division" in fields:
        res.division = doc.division
    if "business_unit" in fields:
        res.business_unit = doc.business_unit
    for t in res.taxes:
        t.cost_center = res.cost_center
        t.department = res.department
        t.division = res.division
        t.business_unit = res.business_unit
    for d in res.deductions:
        d.cost_center = res.cost_center
        d.department = res.department
        d.division = res.division
        d.business_unit = res.business_unit
    return res
