from frappe import _


def get_dashboard_data_for_stock_entry(data):
    data["transactions"].append(
        {"label": _("Stock"), "items": ["Stock Entry"]}
    )
    data["internal_links"]["Stock Entry"] = ["items", "custom_stock_entry"]
    return data
