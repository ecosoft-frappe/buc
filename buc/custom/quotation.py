import frappe
from erpnext.selling.doctype.quotation.quotation import Quotation


class QuotationBUC(Quotation):
    def update_balance_qty(self, fnct_type="validate"):
        for item in self.items:
            if not item.custom_stock_entry_detail:
                continue
            query = frappe.db.sql("""
                select coalesce(sum(qty), 0) as old_ordered_qty
                from `tabQuotation Item` qi, `tabQuotation` q
                where qi.parent = q.name and q.docstatus <> 2 and qi.custom_stock_entry_detail = %s and qi.name <> %s
            """, (item.custom_stock_entry_detail, item.name), as_dict=True)

            stock_entry_detail = frappe.get_value(
                "Stock Entry Detail",
                item.custom_stock_entry_detail,
                ["qty", "custom_ordered_qty", "custom_balance_ordered_qty"],
                as_dict=True)
            ordered_qty = query[0]["old_ordered_qty"]
            if fnct_type == "validate" and self.docstatus != 2:
                ordered_qty += item.qty
            balance_qty = stock_entry_detail["qty"] - ordered_qty

            if balance_qty < 0:
                frappe.throw("Item %s: Total ordered quantity (%s) exceeds allowed quantity (%s) in loan document." % (
                    item.item_code, ordered_qty, stock_entry_detail.qty))

            # Update Ordered Qty, Balance Ordered Qty in stock entry detail
            if ordered_qty != stock_entry_detail["custom_ordered_qty"]:
                frappe.db.set_value(
                    "Stock Entry Detail",
                    item.custom_stock_entry_detail,
                    "custom_ordered_qty",
                    ordered_qty)
            if balance_qty != stock_entry_detail["custom_balance_ordered_qty"]:
                frappe.db.set_value(
                    "Stock Entry Detail",
                    item.custom_stock_entry_detail,
                    "custom_balance_ordered_qty",
                    balance_qty)
        return True

    def validate(self):
        self.update_balance_qty(fnct_type="validate")
        super().validate()

    def on_cancel(self):
        self.update_balance_qty(fnct_type="on_cancel")
        super().on_cancel()

    def on_trash(self):
        self.update_balance_qty(fnct_type="on_trash")
        super().on_trash()
