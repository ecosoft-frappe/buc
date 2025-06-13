def get_data():
    return {
        "fieldname": "delivery_confirmation",
        "internal_links": {
            "Sales Order": ["items", "sales_order"],
            "Sales Invoice": ["items", "sales_invoice"],
            "Delivery Postponement": ["items", "delivery_postponement"]
        },
        "transactions": [
            {
                "label": "Reference",
                "items": ["Sales Order", "Sales Invoice", "Delivery Postponement"],
            }
        ]
    }
