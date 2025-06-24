__version__ = "0.0.1"

from .custom import quotation_item
from .custom import sales_order as buc_sales_order
from erpnext.selling.doctype.sales_order import sales_order as origin_sales_order

origin_sales_order.make_delivery_note = buc_sales_order.make_delivery_note
