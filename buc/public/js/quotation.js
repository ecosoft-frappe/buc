frappe.ui.form.on("Quotation", {
    refresh: function (frm) {
        if (frm.doc.docstatus === 0) {
            frm.add_custom_button(
                __("Loan Document"),
                function () {
                    frappe.call({
                        method: "buc.custom.quotation.get_stock_entry",
                        callback: function (r) {
                            var used_stock_entry = r.message || [];
                            setTimeout(function () {
                                $('span[title="Custom Customer Name"]').text("Customer Name");
                                $('span[title="Custom Patient Name"]').text("Patient Name");
                                $('span[title="Custom Hn"]').text("HN.");
                            }, 1000);

                            erpnext.utils.map_current_doc({
                                method: "buc.custom.stock_entry.make_quotation_from_stock_entry",
                                source_doctype: "Stock Entry",
                                target: frm,
                                setters: [
                                    {
                                        label: __("Stock Entry Type"),
                                        fieldname: "stock_entry_type",
                                        fieldtype: "Link",
                                        options: "Stock Entry Type",
                                        get_query: function () {
                                            return {
                                                filters: [["purpose", "=", "Material Transfer"]],
                                            };
                                        },
                                    },
                                    {
                                        label: __("Customer Name"),
                                        fieldname: "custom_customer_name",
                                        fieldtype: "Link",
                                        options: "Customer",
                                        default: frm.doc.quotation_to === "Customer" ? frm.doc.party_name : "",
                                    },
                                    {
                                        label: __("Patient Name"),
                                        fieldname: "custom_patient_name",
                                        fieldtype: "Data",
                                    },
                                    {
                                        label: __("HN."),
                                        fieldname: "custom_hn",
                                        fieldtype: "Data",
                                    },
                                ],
                                get_query: function () {
                                    return {
                                        filters: {
                                            docstatus: 1,
                                            purpose: "Material Transfer",
                                            company: frm.doc.company,
                                            name: ["not in", used_stock_entry]
                                        }
                                    }
                                }
                            });
                        }
                    });
                },
                __("Get Items From")
            );
        }
    }
});

frappe.ui.form.on("Quotation Item", {
    custom_stock_entry: function (frm, cdt, cdn) {
        var row = locals[cdt][cdn];
        if (row.custom_stock_entry) {
            frappe.db.get_doc("Stock Entry", row.custom_stock_entry).then((doc) => {
                frappe.model.set_value(cdt, cdn, "custom_docter", doc.custom_docter);
                frappe.model.set_value(cdt, cdn, "custom_surgery_date", doc.custom_surgery_date);
                frappe.model.set_value(cdt, cdn, "custom_instrument_set", doc.custom_instrument_set);
                frappe.model.set_value(cdt, cdn, "custom_surgical_side", doc.custom_surgical_side);
                frappe.model.set_value(cdt, cdn, "custom_patient_name", doc.custom_patient_name);
                frappe.model.set_value(cdt, cdn, "custom_hn", doc.custom_hn);
                frappe.model.set_value(cdt, cdn, "custom_loan_purpose", doc.custom_loan_purpose);              
            });
        } else {
            frappe.model.set_value(cdt, cdn, "custom_docter", "");
            frappe.model.set_value(cdt, cdn, "custom_surgery_date", "");
            frappe.model.set_value(cdt, cdn, "custom_instrument_set", "");
            frappe.model.set_value(cdt, cdn, "custom_surgical_side", "");
            frappe.model.set_value(cdt, cdn, "custom_patient_name", "");
            frappe.model.set_value(cdt, cdn, "custom_hn", "");
            frappe.model.set_value(cdt, cdn, "custom_loan_purpose", "");
        }
    }
})
