frappe.ui.form.on("Quotation", {
    onload: function(frm) {
        if (frm.is_new() && !frm.doc.amended_from && !frm.doc.__onload) {
            frappe.db.get_value("Employee", {"user_id": frappe.session.user}, ["cost_center", "department", "division", "business_unit"], (r) => {
                frappe.db.get_value("Company", frm.doc.company, "cost_center", (k) => {
                    let cost_center = r.cost_center;
                    let department = r.department;
                    let division = r.division;
                    let business_unit = r.business_unit;
                    if (cost_center === null || cost_center === undefined || cost_center === "") {
                        cost_center = k.cost_center;
                    }

                    frm.doc.cost_center = cost_center;
                    frm.doc.department = department;
                    frm.doc.division = division;
                    frm.doc.business_unit = business_unit;

                    setTimeout(() => {
                        $.each(frm.doc.items, function(i, d) {
                            d.cost_center = cost_center;
                            d.department = department;
                            d.division = division;
                            d.business_unit = business_unit;
                        });

                        $.each(frm.doc.taxes, function(i, d) {
                            d.cost_center = cost_center;
                            d.department = department;
                            d.division = division;
                            d.business_unit = business_unit;
                        });
                    }, 5000);
                });
            });
        }
    },
    refresh: function (frm) {
        // Add Loan Document Button
        if (frm.doc.docstatus === 0) {
            frm.add_custom_button(
                __("Loan Document"),
                function () {
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
                                fieldname: "customer_name",
                                fieldtype: "Link",
                                options: "Customer",
                                default: frm.doc.quotation_to === "Customer" ? frm.doc.party_name : "",
                            },
                            {
                                label: __("Patient Name"),
                                fieldname: "patient_name",
                                fieldtype: "Data",
                            },
                            {
                                label: __("HN."),
                                fieldname: "hn",
                                fieldtype: "Data",
                            },
                        ],
                        get_query_method:
                            "buc.custom.stock_entry.get_loan_document",
                    });
                },
                __("Get Items From")
            );
        };
        // Filter Division, Business Unit
        frm.set_query("division", function() {
            return {
                filters: [
                    ["department", "=", frm.doc.department]
                ]
            };
        });
        frm.set_query("business_unit", function() {
            return {
                filters: [
                    ["division", "=", frm.doc.division]
                ]
            };
        });
        frm.fields_dict["items"].grid.get_field("division").get_query = function(doc, cdt, cdn) {
            let row = locals[cdt][cdn];
            return {
                filters: [
                    ["department", "=", row.department],
                ]
            };
        };
        frm.fields_dict["items"].grid.get_field("business_unit").get_query = function(doc, cdt, cdn) {
            let row = locals[cdt][cdn];
            return {
                filters: [
                    ["division", "=", row.division],
                ]
            };
        };
        frm.fields_dict["taxes"].grid.get_field("division").get_query = function(doc, cdt, cdn) {
            let row = locals[cdt][cdn];
            return {
                filters: [
                    ["department", "=", row.department],
                ]
            };
        };
        frm.fields_dict["taxes"].grid.get_field("business_unit").get_query = function(doc, cdt, cdn) {
            let row = locals[cdt][cdn];
            return {
                filters: [
                    ["division", "=", row.division],
                ]
            };
        };
    },
    taxes_and_charges: function(frm) {
        setTimeout(() => {
            $.each(frm.doc.taxes, function(i, d) {
                d.cost_center = frm.doc.cost_center;
                d.department = frm.doc.department;
                d.division = frm.doc.division;
                d.business_unit = frm.doc.business_unit;
            });
        }, 1000);
    },
    cost_center: function (frm) {
        setTimeout(() => {
            $.each(frm.doc.items, function(i, d) {
                d.cost_center = frm.doc.cost_center;
            });

            $.each(frm.doc.taxes, function(i, d) {
                d.cost_center = frm.doc.cost_center;
            });
        }, 1000);
    },
	department: function (frm) {
        setTimeout(() => {
            $.each(frm.doc.items, function(i, d) {
                d.department = frm.doc.department;
            });

            $.each(frm.doc.taxes, function(i, d) {
                d.department = frm.doc.department;
            });
        }, 1000);
	},
	division: function (frm) {
        setTimeout(() => {
            $.each(frm.doc.items, function(i, d) {
                d.division = frm.doc.division;
            });

            $.each(frm.doc.taxes, function(i, d) {
                d.division = frm.doc.division;
            });
        }, 1000);
	},
	business_unit: function (frm) {
        setTimeout(() => {
            $.each(frm.doc.items, function(i, d) {
                d.business_unit = frm.doc.business_unit;
            });

            $.each(frm.doc.taxes, function(i, d) {
                d.business_unit = frm.doc.business_unit;
            });
        }, 1000);
	},
});

frappe.ui.form.on("Quotation Item", {
    items_add: function (frm, cdt, cdn) {
        setTimeout(() => {
            row = locals[cdt][cdn];
            row.cost_center = frm.doc.cost_center;
            row.department = frm.doc.department;
            row.division = frm.doc.division;
            row.business_unit = frm.doc.business_unit;
        }, 1000);
    },
    custom_stock_entry: function (frm, cdt, cdn) {
        var row = locals[cdt][cdn];
        if (row.custom_stock_entry) {
            frappe.db.get_doc("Stock Entry", row.custom_stock_entry).then((doc) => {
                frappe.model.set_value(cdt, cdn, "custom_doctor", doc.custom_doctor);
                frappe.model.set_value(cdt, cdn, "custom_surgery_date", doc.custom_surgery_date);
                frappe.model.set_value(cdt, cdn, "custom_instrument_set", doc.custom_instrument_set);
                frappe.model.set_value(cdt, cdn, "custom_surgical_side", doc.custom_surgical_side);
                frappe.model.set_value(cdt, cdn, "custom_patient_name", doc.custom_patient_name);
                frappe.model.set_value(cdt, cdn, "custom_hn", doc.custom_hn);
                frappe.model.set_value(cdt, cdn, "custom_loan_purpose", doc.custom_loan_purpose);
                frappe.model.set_value(cdt, cdn, "custom_deliver_item", 1);
            });
        } else {
            frappe.model.set_value(cdt, cdn, "custom_doctor", "");
            frappe.model.set_value(cdt, cdn, "custom_surgery_date", "");
            frappe.model.set_value(cdt, cdn, "custom_instrument_set", "");
            frappe.model.set_value(cdt, cdn, "custom_surgical_side", "");
            frappe.model.set_value(cdt, cdn, "custom_patient_name", "");
            frappe.model.set_value(cdt, cdn, "custom_hn", "");
            frappe.model.set_value(cdt, cdn, "custom_loan_purpose", "");
            frappe.model.set_value(cdt, cdn, "custom_deliver_item", "");
        }
    },
});

frappe.ui.form.on("Sales Taxes and Charges", {
    taxes_add: function (frm, cdt, cdn) {
        setTimeout(() => {
            row = locals[cdt][cdn];
            row.cost_center = frm.doc.cost_center;
            row.department = frm.doc.department;
            row.division = frm.doc.division;
            row.business_unit = frm.doc.business_unit;
        }, 1000);
    },
});
