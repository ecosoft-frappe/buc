import frappe
from erpnext.accounts.doctype.payment_entry.payment_entry import get_payment_entry as origin_get_payment_entry
from erpnext_thailand.custom.payment_entry import get_withholding_tax_from_type as origin_get_withholding_tax_from_type

@frappe.whitelist()
def get_payment_entry(
	dt,
	dn,
	party_amount=None,
	bank_account=None,
	bank_amount=None,
	party_type=None,
	payment_type=None,
	reference_date=None,
	ignore_permissions=False,
	created_from_payment_request=False,
):
    res = origin_get_payment_entry(
        dt,
        dn,
        party_amount=party_amount,
        bank_account=bank_account,
        bank_amount=bank_amount,
        party_type=party_type,
        payment_type=payment_type,
        reference_date=reference_date,
        ignore_permissions=ignore_permissions,
        created_from_payment_request=created_from_payment_request)
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

@frappe.whitelist()
def get_withholding_tax_from_type(filters, doc):
    res = origin_get_withholding_tax_from_type(filters, doc)
    doc = eval(doc)
    res.update({
        "cost_center": doc.get("cost_center"),
        "department": doc.get("department"),
        "division": doc.get("division"),
        "business_unit": doc.get("business_unit"),
    })
    return res