frappe.ui.form.on("Stock Entry", {
    custom_set_of_item: function(frm) {
        if (!frm.doc.custom_set_of_item) return;

        frm.clear_table("items");

        frappe.db.get_doc("Set of Item", frm.doc.custom_set_of_item).then(doc => {
            frm.set_value("from_warehouse", doc.warehouse);
            
            doc.items.forEach(row => {
                frm.add_child("items", {
                    s_warehouse: doc.warehouse,
                    item_code: row.item_code,
                    qty: row.qty,
                    uom: row.uom,
                    transfer_qty: row.qty,
                    stock_uom: row.uom,
                    conversion_factor: 1,
                    use_serial_batch_fields: 1,
                    serial_no: row.serial_no,
                    batch_no: row.batch_no,
                });
            });

            frm.refresh_field("items");
        });
    }
})
