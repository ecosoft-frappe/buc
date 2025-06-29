import frappe
from hrms.hr.doctype.expense_claim.expense_claim import get_expense_claim as origin_get_expense_claim

@frappe.whitelist()
def get_expense_claim(
    employee_name, company, employee_advance_name, posting_date, paid_amount, claimed_amount, return_amount
):
    doc = origin_get_expense_claim(employee_name, company, employee_advance_name, posting_date, paid_amount, claimed_amount, return_amount)
    employee_advance = frappe.get_doc("Employee Advance", employee_advance_name)
    doc.update({
        "cost_center": employee_advance.cost_center,
        "department": employee_advance.department,
        "division": employee_advance.division,
        "business_unit": employee_advance.business_unit,
    })
    return doc