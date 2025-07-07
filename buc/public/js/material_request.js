frappe.ui.form.on("Material Request", {
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
    },
    cost_center: function (frm) {
        setTimeout(() => {
            $.each(frm.doc.items, function(i, d) {
                d.cost_center = frm.doc.cost_center;
            });
        }, 1000);
    },
	department: function (frm) {
        setTimeout(() => {
            $.each(frm.doc.items, function(i, d) {
                d.department = frm.doc.department;
            });
        }, 1000);
	},
	division: function (frm) {
        setTimeout(() => {
            $.each(frm.doc.items, function(i, d) {
                d.division = frm.doc.division;
            });
        }, 1000);
	},
	business_unit: function (frm) {
        setTimeout(() => {
            $.each(frm.doc.items, function(i, d) {
                d.business_unit = frm.doc.business_unit;
            });
        }, 1000);
	},
    custom_customer_name: function(frm) {
        if (frm.doc.custom_customer_name) {
            frappe.call({
                method: "buc.custom.material_request.get_target_warehouse",
                args: {
                    customer: frm.doc.custom_customer_name,
                },
                callback: function(response) {
                    if(response.message) {
                        frm.set_value("set_warehouse", response.message);
                        frm.doc.items.forEach(function(row) {
                            row.warehouse = response.message;
                        });
                        frm.refresh_field("items");
                    }
                }
            });
        }
        for (var i = 0; i < frm.doc.items.length; i++) {
            var item = frm.doc.items[i];
            update_selling_rate(frm, item.doctype, item.name);
        }
    },
    transaction_date: function(frm) {
        for (var i = 0; i < frm.doc.items.length; i++) {
            var item = frm.doc.items[i];
            update_selling_rate(frm, item.doctype, item.name);
        }
    },
    custom_selling_price_list: function(frm) {
        for (var i = 0; i < frm.doc.items.length; i++) {
            var item = frm.doc.items[i];
            update_selling_rate(frm, item.doctype, item.name);
        }
    }
});

frappe.ui.form.on("Material Request Item", {
    items_add: function (frm, cdt, cdn) {
        setTimeout(() => {
            row = locals[cdt][cdn];
            row.cost_center = frm.doc.cost_center;
            row.department = frm.doc.department;
            row.division = frm.doc.division;
            row.business_unit = frm.doc.business_unit;
        }, 1000);
    },
    item_code: function (frm, cdt, cdn) {
        update_selling_rate(frm, cdt, cdn);
    },
    uom: function (frm, cdt, cdn) {
        update_selling_rate(frm, cdt, cdn);
    },
});

function update_selling_rate(frm, cdt, cdn) {
    frappe.call({
        method: "buc.custom.material_request.get_selling_rate",
        args: {
            doc: frm.doc,
            item: locals[cdt][cdn],
        },
        callback: function(r) {
            frappe.model.set_value(cdt, cdn, "custom_selling_rate", r.message);
        }
    });
}
