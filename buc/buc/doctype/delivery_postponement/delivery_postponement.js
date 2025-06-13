// Copyright (c) 2025, Tharathip and contributors
// For license information, please see license.txt

frappe.ui.form.on("Delivery Postponement", {
    refresh: function (frm) {
        if (frm.doc.docstatus === 0) {
            frm.add_custom_button(
                __("Sales Invoice"),
                function () {
					if (!frm.doc.customer) {
                        frappe.throw({ message: __("Please select a Customer"), title: __("Mandatory") });
					}
                    erpnext.utils.map_current_doc({
                        method: "buc.custom.sales_invoice.make_delivery_postponement",
                        source_doctype: "Sales Invoice",
                        target: frm,
                        setters: {
                            customer: frm.doc.customer,
                        },
                        get_query_filters: {
                            customer: frm.doc.customer,
                            docstatus: 1,
                        },
                        get_query_method:
                            "buc.custom.sales_invoice.get_sales_invoice_based_on_customer",
                    });
                },
                __("Get Items From")
            )
        }
        if (frm.doc.workflow_state === "Pending") {
            frm.add_custom_button(
                __("Delivery Confirmation"),
				    function () {
					    frappe.model.open_mapped_doc({
                            method: "buc.buc.doctype.delivery_postponement.delivery_postponement.make_delivery_confirmation",
                            frm: frm,
                        });
					},
					__("Create")
				);
        }
        setTimeout(() => {
            $("a.dropdown-item").filter((_, el) => el.textContent.trim() === "Deliver").hide();
        }, 1000);
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

frappe.ui.form.on("Delivery Postponement Item", {
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
