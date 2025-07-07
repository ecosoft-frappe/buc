frappe.ui.form.on("Stock Entry", {
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
});

frappe.ui.form.on("Stock Entry", "custom_get_serial__batch_no_from_set_of_item", function(frm) {

    if (!frm.doc.custom_set_of_item) {
        frappe.throw(__("Please specify a Set of Item before proceeding."));
    }

    frappe.db.get_doc("Set of Item", frm.doc.custom_set_of_item).then(setDoc => {
        let serialMap = {};
        let batchMap = {};
        setDoc.items.forEach(row => {
            if (!serialMap[row.item_code]) {
                serialMap[row.item_code] = [];
            }
            if (!batchMap[row.item_code]) {
                batchMap[row.item_code] = [];
            }
            if (row.serial_no) {
                serialMap[row.item_code].push(row.serial_no);
            }
            if (row.batch_no) {
                batchMap[row.item_code].push(row.batch_no);
            }
        });

        frm.doc.items.forEach(row => {
            // Source warehouse must same
            if (row.s_warehouse && row.s_warehouse != setDoc.warehouse) {
                frappe.throw(__("Source warehouse must same with set of item."));
            }

            // Serial / Batch No. must clean
            if (row.serial_no || row.batch_no) {
                frappe.throw(__("Serial / Batch No. is assigned, please remove it before this action."));
            }
        });

        frm.doc.items.forEach(row => {
            // Assign serial no in stock entry item
            let serialList = serialMap[row.item_code];
            if (serialList && serialList.length > 0) {
                let serialNo = ""
                for (let i = 1; i <= row.qty; i++) {
                    if (serialList.length > 0) {
                        serialNo += serialList.shift();
                    } else {
                        serialNo += "-";
                    }
                    serialNo += "\n";
                }
                frappe.model.set_value(row.doctype, row.name, "serial_no", serialNo);
            } else {
                frappe.model.set_value(row.doctype, row.name, "serial_no", null);
            }
            // Assign batch no in stock entry item
            let batchList = batchMap[row.item_code];
            if (batchList && batchList.length > 0) {
                let batchNo = batchList.shift();
                frappe.model.set_value(row.doctype, row.name, "batch_no", batchNo);
            } else {
                frappe.model.set_value(row.doctype, row.name, "batch_no", null);
            }
        });

        frm.refresh_field("items");

        frappe.msgprint(__("Serial / Batch No. updated successfully."));
    })
});

frappe.ui.form.on("Stock Entry Detail", {
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
