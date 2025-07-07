frappe.ui.form.on("Expense Claim", {
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
        frm.fields_dict["expenses"].grid.get_field("division").get_query = function(doc, cdt, cdn) {
            let row = locals[cdt][cdn];
            return {
                filters: [
                    ["department", "=", row.department],
                ]
            };
        };
        frm.fields_dict["expenses"].grid.get_field("business_unit").get_query = function(doc, cdt, cdn) {
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
    cost_center: function (frm) {
        setTimeout(() => {
            $.each(frm.doc.expenses, function(i, d) {
                d.cost_center = frm.doc.cost_center;
            });

            $.each(frm.doc.taxes, function(i, d) {
                d.cost_center = frm.doc.cost_center;
            });
        }, 1000);
    },
	department: function (frm) {
        setTimeout(() => {
            $.each(frm.doc.expenses, function(i, d) {
                d.department = frm.doc.department;
            });

            $.each(frm.doc.taxes, function(i, d) {
                d.department = frm.doc.department;
            });
        }, 1000);
	},
	division: function (frm) {
        setTimeout(() => {
            $.each(frm.doc.expenses, function(i, d) {
                d.division = frm.doc.division;
            });

            $.each(frm.doc.taxes, function(i, d) {
                d.division = frm.doc.division;
            });
        }, 1000);
	},
	business_unit: function (frm) {
        setTimeout(() => {
            $.each(frm.doc.expenses, function(i, d) {
                d.business_unit = frm.doc.business_unit;
            });

            $.each(frm.doc.taxes, function(i, d) {
                d.business_unit = frm.doc.business_unit;
            });
        }, 1000);
	},
});

frappe.ui.form.on("Expense Claim Detail", {
    expenses_add: function (frm, cdt, cdn) {
        setTimeout(() => {
            row = locals[cdt][cdn];
            row.cost_center = frm.doc.cost_center;
            row.department = frm.doc.department;
            row.division = frm.doc.division;
            row.business_unit = frm.doc.business_unit;
        }, 1000);
    },
    expense_type: function (frm, cdt, cdn) {
        setTimeout(() => {
            row = locals[cdt][cdn];
            row.cost_center = frm.doc.cost_center;
            row.department = frm.doc.department;
            row.division = frm.doc.division;
            row.business_unit = frm.doc.business_unit;
        }, 1000);
    },
});

frappe.ui.form.on("Expense Taxes and Charges", {
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
