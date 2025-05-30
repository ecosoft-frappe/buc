frappe.ui.form.on("Material Request", {
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
    }
});
