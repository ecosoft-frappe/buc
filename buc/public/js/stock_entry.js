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
                frappe.throw(__("Source warehouse must same with set of item."))
            }

            // Assign serial no in stock entry item
            let serialList = serialMap[row.item_code];
            if (serialList && serialList.length > 0) {
                frappe.model.set_value(row.doctype, row.name, "serial_no", serialList.shift());
            } else {
                frappe.model.set_value(row.doctype, row.name, "serial_no", null);
            }
            // Assign batch no in stock entry item
            let batchList = batchMap[row.item_code];
            if (batchList && batchList.length > 0) {
                frappe.model.set_value(row.doctype, row.name, "batch_no", batchList.shift());
            } else {
                frappe.model.set_value(row.doctype, row.name, "batch_no", null);
            }
        });

        frm.refresh_field("items");

        frappe.msgprint(__("Serial / Batch No. updated successfully."));
    })
});
