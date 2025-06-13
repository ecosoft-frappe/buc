// Copyright (c) 2025, Tharathip and contributors
// For license information, please see license.txt

frappe.ui.form.on("Delivery Confirmation", {
    refresh: function (frm) {
        if (frm.doc.docstatus === 0) {
            frm.add_custom_button(
                __("Delivery Postponement"),
                function () {
					if (!frm.doc.customer) {
                        frappe.throw({ message: __("Please select a Customer"), title: __("Mandatory") });
					}
                    erpnext.utils.map_current_doc({
                        method: "buc.buc.doctype.delivery_postponement.delivery_postponement.make_delivery_confirmation",
                        source_doctype: "Delivery Postponement",
                        target: frm,
                        setters: {
                            customer: frm.doc.customer,
                        },
                        get_query_filters: {
                            customer: frm.doc.customer,
                            workflow_state: "Pending",
                        }
                    });
                },
                __("Get Items From")
            )
        }
    },
    customer: function(frm) {
        frm.set_query("customer_address", () => {
            return {
                query: "frappe.contacts.doctype.address.address.address_query",
                filters: {
                    link_doctype: "Customer",
                    link_name: frm.doc.customer
                }
            };
        });
        frm.set_value("customer_address", "");
    }
});

frappe.ui.form.on("Delivery Confirmation Item", {
    item_code: function (frm, cdt, cdn) {
        let row = locals[cdt][cdn];
        if (row.item_code) {
            frappe.db.get_doc("Item", row.item_code).then(doc => {
                frappe.model.set_value(cdt, cdn, "item_name", doc.item_name);
                frappe.model.set_value(cdt, cdn, "qty", 1);
                frappe.model.set_value(cdt, cdn, "uom", doc.stock_uom);
                frappe.model.set_value(cdt, cdn, "rate", "");
                frappe.model.set_value(cdt, cdn, "amount", "");
            });
        }
    },
    qty: function(frm, cdt, cdn) {
        let row = locals[cdt][cdn];
        frappe.model.set_value(cdt, cdn, "amount", row.qty * row.rate);
    },
    rate: function(frm, cdt, cdn) {
        let row = locals[cdt][cdn];
        frappe.model.set_value(cdt, cdn, "amount", row.qty * row.rate);
    }
});
