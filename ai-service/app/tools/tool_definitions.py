EXPENSE_TOOL_DEFINITIONS = [
    {
        "type": "function",
        "function": {
            "name": "list_expenses",
            "description": (
                "Return individual expense records. "
                "Use this only when the user asks to view, list, inspect, "
                "or retrieve individual transactions. "
                "Do not use this tool for totals or aggregate statistics."
            ),
            "parameters": {
                "type": "object",
                "properties": {},
                "required": []
            }
        }
    },

    {
        "type": "function",
        "function": {
            "name": "expense_by_id",
            "description": (
                "Get one specific expense record by its ID."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "expense_id": {
                        "type": "integer",
                        "description": "The ID of the expense record."
                    }
                },
                "required": ["expense_id"]
            }
        }
    },

    {
        "type": "function",
        "function": {
            "name": "expenses_by_category",
            "description": (
                "Get all expense records belonging to a specific category, "
                "such as Food, Transport, Shopping, or Entertainment."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "category": {
                        "type": "string",
                        "description": "The expense category."
                    }
                },
                "required": ["category"]
            }
        }
    },

    {
        "type": "function",
        "function": {
            "name": "expenses_by_month",
            "description": (
                "Get all expense records for a specific year and month. "
                "Use this when the user wants to see individual expenses "
                "from a particular month."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "year": {
                        "type": "integer",
                        "description": "The four-digit year, for example 2026."
                    },
                    "month": {
                        "type": "integer",
                        "description": "The month number from 1 to 12."
                    }
                },
                "required": ["year", "month"]
            }
        }
    },

    {
        "type": "function",
        "function": {
            "name": "search_expense_records",
            "description": (
                "Search expense records by keyword. "
                "The keyword can match category, description, or payment method. "
                "Optionally restrict the search to a date range."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "keyword": {
                        "type": "string",
                        "description": (
                            "Keyword to search for in category, "
                            "description, or payment method."
                        )
                    },
                    "start_date": {
                        "type": "string",
                        "description": (
                            "Optional start date in YYYY-MM-DD format. "
                            "If provided, end_date should also be provided."
                        )
                    },
                    "end_date": {
                        "type": "string",
                        "description": (
                            "Optional end date in YYYY-MM-DD format. "
                            "If provided, start_date should also be provided."
                        )
                    }
                },
                "required": ["keyword"]
            }
        }
    },

    {
        "type": "function",
        "function": {
            "name": "monthly_total",
            "description": (
                "Return the total amount spent in a specific month. "
                "Use this tool directly when the user asks how much they "
                "spent in a month. Do not call list_expenses first."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "year": {
                        "type": "integer",
                        "description": "The four-digit year, for example 2026."
                    },
                    "month": {
                        "type": "integer",
                        "description": "The month number from 1 to 12."
                    }
                },
                "required": ["year", "month"]
            }
        }
    },

    {
        "type": "function",
        "function": {
            "name": "category_summary",
            "description": (
                "Get total spending grouped by category for a specific month. "
                "Use this when the user asks about spending distribution, "
                "which category cost the most, or category totals."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "year": {
                        "type": "integer",
                        "description": "The four-digit year, for example 2026."
                    },
                    "month": {
                        "type": "integer",
                        "description": "The month number from 1 to 12."
                    }
                },
                "required": ["year", "month"]
            }
        }
    }
]