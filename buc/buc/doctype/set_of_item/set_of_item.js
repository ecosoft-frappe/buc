// Copyright (c) 2025, Tharathip and contributors
// For license information, please see license.txt

frappe.ui.form.on("Set of Item", {
    refresh: function(frm) {
        frm.set_query("serial_no", "items", function (doc, cdt, cdn) {
            let row = locals[cdt][cdn];
            return {
                filters: {
                    warehouse: frm.doc.warehouse,
                    item_code: row.item_code,
                    status: "Active",
                },
            };
        });
        frm.set_query("batch_no", "items", function (doc, cdt, cdn) {
            let row = locals[cdt][cdn];
            let filters = {
                item_code: row.item_code,
                include_expired_batches: 1,
                warehouse: frm.doc.warehouse,
            }
			return {
				query: "erpnext.controllers.queries.get_batch_no",
				filters: filters,
			};
        });
    },
    warehouse: function(frm) {
        frm.doc.items.forEach(function(row) {
            row.serial_no = null;
            row.batch_no = null;
        });
        frm.refresh_field("items");
    }
});

frappe.ui.form.on("Set of Item Entry", {
    item_code: function (frm, cdt, cdn) {
        let row = locals[cdt][cdn];
        frappe.model.set_value(cdt, cdn, "serial_no", null);
        frappe.model.set_value(cdt, cdn, "batch_no", null);
        frappe.model.set_value(cdt, cdn, "qty", 1);
        frappe.model.set_value(cdt, cdn, "uom", null);
        if (row.item_code) {
            frappe.db.get_value("Item", row.item_code, ["stock_uom"], function (r) {
                frappe.model.set_value(cdt, cdn, "uom", r.stock_uom);
            });
        }
    }
});
