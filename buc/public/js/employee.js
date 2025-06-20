frappe.ui.form.on("Employee", {
	refresh(frm) {
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
	},
	department(frm) {
	    frm.set_value("division", "");
	},
	division(frm) {
	    frm.set_value("business_unit", "");
	}
})