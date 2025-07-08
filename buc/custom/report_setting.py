import frappe

def set_report_as_disable():
    reports = [
        "Batch Item Expiry Status",
    ]
    for report in reports:
        frappe.db.set_value("Report", report, "disabled", 1)
