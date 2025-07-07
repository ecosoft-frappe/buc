frappe.ui.form.on("Sales Order", {
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

frappe.ui.form.on("Sales Order Item", {
    items_add: function (frm, cdt, cdn) {
        setTimeout(() => {
            row = locals[cdt][cdn];
            row.cost_center = frm.doc.cost_center;
            row.department = frm.doc.department;
            row.division = frm.doc.division;
            row.business_unit = frm.doc.business_unit;
        }, 1000);
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
