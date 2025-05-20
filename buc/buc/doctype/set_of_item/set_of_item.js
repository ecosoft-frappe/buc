// Copyright (c) 2025, Tharathip and contributors
// For license information, please see license.txt

frappe.ui.form.on("Set of Item", {
    refresh: function(frm) {
        frm.set_query("serial_no", "items", function (doc, cdt, cdn) {
            let row = locals[cdt][cdn];
            return {
                filters: {
                    item_code: row.item_code ? row.item_code : "",
                },
            };
        });
        frm.set_query("batch_no", "items", function (doc, cdt, cdn) {
            let row = locals[cdt][cdn];
            return {
                filters: {
                    item: row.item_code ? row.item_code : "",
                },
            };
        });
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
