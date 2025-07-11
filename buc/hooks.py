app_name = "buc"
app_title = "BUC"
app_publisher = "Tharathip"
app_description = "BUC"
app_email = "tharathipc@ecosoft.co.th"
app_license = "mit"

# Apps
# ------------------

# required_apps = []

# Each item in the list will be shown as an app in the apps page
# add_to_apps_screen = [
# 	{
# 		"name": "buc",
# 		"logo": "/assets/buc/logo.png",
# 		"title": "BUC",
# 		"route": "/buc",
# 		"has_permission": "buc.api.permission.has_app_permission"
# 	}
# ]

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/buc/css/buc.css"
# app_include_js = "/assets/buc/js/buc.js"

# include js, css files in header of web template
# web_include_css = "/assets/buc/css/buc.css"
# web_include_js = "/assets/buc/js/buc.js"

# include custom scss in every website theme (without file extension ".scss")
# website_theme_scss = "buc/public/scss/website"

# include js, css files in header of web form
# webform_include_js = {"doctype": "public/js/doctype.js"}
# webform_include_css = {"doctype": "public/css/doctype.css"}

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views

doctype_js = {
    "Quotation": "public/js/quotation.js",
    "Sales Order": "public/js/sales_order.js",
    "Sales Invoice": "public/js/sales_invoice.js",
    "Delivery Note": "public/js/delivery_note.js",
    "Stock Entry": "public/js/stock_entry.js",
    "Material Request": "public/js/material_request.js",
    "Purchase Order": "public/js/purchase_order.js",
    "Purchase Invoice": "public/js/purchase_invoice.js",
    "Purchase Receipt": "public/js/purchase_receipt.js",
    "Journal Entry": "public/js/journal_entry.js",
    "Expense Claim": "public/js/expense_claim.js",
    "Payment Entry": "public/js/payment_entry.js",
    "Employee": "public/js/employee.js",
}

# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Svg Icons
# ------------------
# include app icons in desk
# app_include_icons = "buc/public/icons.svg"

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
# 	"Role": "home_page"
# }

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Jinja
# ----------

# add methods and filters to jinja environment
# jinja = {
# 	"methods": "buc.utils.jinja_methods",
# 	"filters": "buc.utils.jinja_filters"
# }

# Installation
# ------------

# before_install = "buc.install.before_install"
# after_install = "buc.install.after_install"

# Uninstallation
# ------------

# before_uninstall = "buc.uninstall.before_uninstall"
# after_uninstall = "buc.uninstall.after_uninstall"

after_migrate = [
    "buc.custom.report_setting.set_report_as_disable",
]

# Integration Setup
# ------------------
# To set up dependencies/integrations with other apps
# Name of the app being installed is passed as an argument

# before_app_install = "buc.utils.before_app_install"
# after_app_install = "buc.utils.after_app_install"

# Integration Cleanup
# -------------------
# To clean up dependencies/integrations with other apps
# Name of the app being uninstalled is passed as an argument

# before_app_uninstall = "buc.utils.before_app_uninstall"
# after_app_uninstall = "buc.utils.after_app_uninstall"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "buc.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# DocType Class
# ---------------
# Override standard doctype classes

override_doctype_class = {
    "Material Request": "buc.custom.material_request.MaterialRequestBUC",
    "Quotation": "buc.custom.quotation.QuotationBUC",
    "Stock Entry": "buc.custom.stock_entry.StockEntryBUC",
}

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
# 	"*": {
# 		"on_update": "method",
# 		"on_cancel": "method",
# 		"on_trash": "method"
# 	}
# }

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"buc.tasks.all"
# 	],
# 	"daily": [
# 		"buc.tasks.daily"
# 	],
# 	"hourly": [
# 		"buc.tasks.hourly"
# 	],
# 	"weekly": [
# 		"buc.tasks.weekly"
# 	],
# 	"monthly": [
# 		"buc.tasks.monthly"
# 	],
# }

# Testing
# -------

# before_tests = "buc.install.before_tests"

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "buc.event.get_events"
# }
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps

override_doctype_dashboards = {
    "Quotation": "buc.custom.dashboard_overrides.get_dashboard_data_for_stock_entry",
}

# exempt linked doctypes from being automatically cancelled
#
# auto_cancel_exempted_doctypes = ["Auto Repeat"]

# Ignore links to specified DocTypes when deleting documents
# -----------------------------------------------------------

# ignore_links_on_delete = ["Communication", "ToDo"]

# Request Events
# ----------------
# before_request = ["buc.utils.before_request"]
# after_request = ["buc.utils.after_request"]

# Job Events
# ----------
# before_job = ["buc.utils.before_job"]
# after_job = ["buc.utils.after_job"]

# User Data Protection
# --------------------

# user_data_fields = [
# 	{
# 		"doctype": "{doctype_1}",
# 		"filter_by": "{filter_by}",
# 		"redact_fields": ["{field_1}", "{field_2}"],
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_2}",
# 		"filter_by": "{filter_by}",
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_3}",
# 		"strict": False,
# 	},
# 	{
# 		"doctype": "{doctype_4}"
# 	}
# ]

# Authentication and authorization
# --------------------------------

# auth_hooks = [
# 	"buc.auth.validate"
# ]

# Automatically update python controller files with type annotations for this app.
# export_python_type_annotations = True

# default_log_clearing_doctypes = {
# 	"Logging DocType Name": 30  # days to retain logs
# }

fixtures = [
    {
        "doctype": "Workflow",
        "filters": [
            [
                "name",
                "in",
                ("Delivery Postponement", "Delivery Confirmation")
            ]
        ],
    },
]
