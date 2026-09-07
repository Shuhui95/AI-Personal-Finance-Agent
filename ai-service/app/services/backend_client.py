import os

import httpx
from dotenv import load_dotenv


load_dotenv()


BACKEND_BASE_URL = os.getenv(
    "BACKEND_BASE_URL",
    "http://localhost:8080/api"
)


def get_all_expenses():
    response = httpx.get(
        f"{BACKEND_BASE_URL}/expenses",
        timeout=10.0
    )

    response.raise_for_status()
    return response.json()


def get_expense_by_id(expense_id: int):
    response = httpx.get(
        f"{BACKEND_BASE_URL}/expenses/{expense_id}",
        timeout=10.0
    )

    response.raise_for_status()
    return response.json()


def get_expenses_by_category(category: str):
    response = httpx.get(
        f"{BACKEND_BASE_URL}/expenses/category/{category}",
        timeout=10.0
    )

    response.raise_for_status()
    return response.json()


def get_expenses_by_month(year: int, month: int):
    response = httpx.get(
        f"{BACKEND_BASE_URL}/expenses/month",
        params={
            "year": year,
            "month": month
        },
        timeout=10.0
    )

    response.raise_for_status()
    return response.json()


def search_expenses(
    keyword: str,
    start_date: str | None = None,
    end_date: str | None = None
):
    params = {
        "keyword": keyword
    }

    if start_date is not None:
        params["startDate"] = start_date

    if end_date is not None:
        params["endDate"] = end_date

    response = httpx.get(
        f"{BACKEND_BASE_URL}/expenses/search",
        params=params,
        timeout=10.0
    )

    response.raise_for_status()
    return response.json()


def get_expenses_by_date_range(start_date: str, end_date: str):
    response = httpx.get(
        f"{BACKEND_BASE_URL}/expenses/date-range",
        params={
            "startDate": start_date,
            "endDate": end_date
        },
        timeout=10.0
    )

    response.raise_for_status()
    return response.json()


def get_monthly_total(year: int, month: int):
    response = httpx.get(
        f"{BACKEND_BASE_URL}/expenses/summary/monthly",
        params={
            "year": year,
            "month": month
        },
        timeout=10.0
    )

    response.raise_for_status()
    return response.json()


def get_category_summary(year: int, month: int):
    response = httpx.get(
        f"{BACKEND_BASE_URL}/expenses/summary/categories",
        params={
            "year": year,
            "month": month
        },
        timeout=10.0
    )

    response.raise_for_status()
    return response.json()