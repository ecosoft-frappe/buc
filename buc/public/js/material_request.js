frappe.ui.form.on("Material Request", {
    custom_hospital: function(frm) {
        if (frm.doc.custom_hospital) {
            frappe.call({
                method: "buc.custom.material_request.get_target_warehouse",
                args: {
                    customer: frm.doc.custom_hospital,
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
