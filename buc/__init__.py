__version__ = "0.0.1"

import frappe
from .custom import quotation_item

##### Monkey Patch #####
# Overwrite make_delivery_note function
from .custom import sales_order as buc_sales_order
from erpnext.selling.doctype.sales_order import sales_order as origin_sales_order
origin_sales_order.make_delivery_note = buc_sales_order.make_delivery_note

# Overwrite get_expense_claim function
from .custom import expense_claim as buc_expense_claim
from hrms.hr.doctype.expense_claim import expense_claim as origin_expense_claim
origin_expense_claim.get_expense_claim = buc_expense_claim.get_expense_claim

# Overwrite make_return_entry function
from .custom import employee_advance as buc_employee_advance
from hrms.hr.doctype.employee_advance import employee_advance as origin_employee_advance
origin_employee_advance.make_return_entry = buc_employee_advance.make_return_entry

# Overwrite get_gl_dict function
import erpnext.controllers.accounts_controller
original_get_gl_dict = erpnext.controllers.accounts_controller.AccountsController.get_gl_dict

def get_gl_dict(self, args, account_currency=None, item=None):
    gl_dict = original_get_gl_dict(self, args, account_currency, item)
    if item:
        meta = frappe.get_meta(item.doctype)
        fields = [df.fieldname for df in meta.fields]
        if "cost_center" in fields:
            gl_dict["cost_center"] = item.get("cost_center")
        if "department" in fields:
            gl_dict["department"] = item.get("department")
        if "division" in fields:
            gl_dict["division"] = item.get("division")
        if "business_unit" in fields:
            gl_dict["business_unit"] = item.get("business_unit")
    return gl_dict

erpnext.controllers.accounts_controller.AccountsController.get_gl_dict = get_gl_dict
