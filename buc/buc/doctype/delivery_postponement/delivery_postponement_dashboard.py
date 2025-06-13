def get_data():
    return {
        "fieldname": "delivery_postponement",
        "internal_links": {
            "Sales Order": ["items", "sales_order"],
            "Sales Invoice": ["items", "sales_invoice"],
        },
        "transactions": [
            {
                "label": "Reference",
                "items": ["Sales Order", "Sales Invoice"],
            }
        ]
    }
