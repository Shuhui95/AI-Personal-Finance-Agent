from app.services.backend_client import (
    get_all_expenses,
    get_expense_by_id,
    get_expenses_by_category,
    get_expenses_by_month,
    search_expenses,
    get_expenses_by_date_range,
    get_monthly_total,
    get_category_summary,
)


def list_expenses():
    """
    Return all expense records.
    """
    return get_all_expenses()


def expense_by_id(expense_id: int):
    """
    Return one expense by its ID.
    """
    return get_expense_by_id(expense_id)


def expenses_by_category(category: str):
    """
    Return expenses belonging to a specific category.
    """
    return get_expenses_by_category(category)


def expenses_by_month(year: int, month: int):
    """
    Return expenses for a specific year and month.
    """
    return get_expenses_by_month(year, month)


def search_expense_records(
    keyword: str,
    start_date: str | None = None,
    end_date: str | None = None
):
    """
    Search expense records using a keyword.

    The keyword can match category, description,
    or payment method.

    start_date and end_date are optional.
    If dates are provided, both should use
    YYYY-MM-DD format.
    """

    return search_expenses(
        keyword,
        start_date,
        end_date
    )


def expenses_by_date_range(start_date: str, end_date: str):
    """
    Return expenses between two dates.

    Dates should use YYYY-MM-DD format.
    """
    return get_expenses_by_date_range(
        start_date,
        end_date
    )


def monthly_total(year: int, month: int):
    """
    Return total spending for a specific month.
    """
    return get_monthly_total(year, month)


def category_summary(year: int, month: int):
    """
    Return spending grouped by category for a specific month.
    """
    return get_category_summary(year, month)