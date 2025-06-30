import frappe
from hrms.hr.doctype.employee_advance.employee_advance import make_return_entry as origin_make_return_entry

@frappe.whitelist()
def make_return_entry(
	employee,
	company,
	employee_advance_name,
	return_amount,
	advance_account,
	currency,
	exchange_rate,
	mode_of_payment=None,
):
    doc = origin_make_return_entry(
        employee, company, employee_advance_name, return_amount, advance_account, currency, exchange_rate, mode_of_payment=mode_of_payment)
    employee_advance = frappe.get_doc("Employee Advance", employee_advance_name)
    doc.update({
        "cost_center": employee_advance.cost_center,
        "department": employee_advance.department,
        "division": employee_advance.division,
        "business_unit": employee_advance.business_unit,
    })
    for item in doc.accounts:
        item.update({
            "cost_center": employee_advance.cost_center,
            "department": employee_advance.department,
            "division": employee_advance.division,
            "business_unit": employee_advance.business_unit,
        })
    return doc