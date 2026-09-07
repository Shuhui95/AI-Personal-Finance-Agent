from fastapi import FastAPI
from app.services.llm_client import ask_llm
from app.agent.finance_agent import run_finance_agent
from app.schemas.chat import ChatRequest, ChatResponse
from fastapi.middleware.cors import CORSMiddleware
import time

from app.tools.expense_tools import (
    list_expenses,
    expense_by_id,
    expenses_by_category,
    expenses_by_month,
    search_expense_records,
    expenses_by_date_range,
    monthly_total,
    category_summary,
)
from app.services.llm_client import (
    ask_llm,
    choose_tool,
)

from app.agent.finance_agent import run_finance_agent


app = FastAPI(
    title="AI Personal Finance Agent",
    description="AI service for the Personal Finance Agent project",
    version="0.1.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "ai-service"
    }


@app.get("/test-tools/expenses")
def test_list_expenses():
    return list_expenses()


@app.get("/test-tools/expenses/{expense_id}")
def test_expense_by_id(expense_id: int):
    return expense_by_id(expense_id)


@app.get("/test-tools/category/{category}")
def test_expenses_by_category(category: str):
    return expenses_by_category(category)


@app.get("/test-tools/month")
def test_expenses_by_month(year: int, month: int):
    return expenses_by_month(year, month)


@app.get("/test-tools/search")
def test_search_expenses(
    keyword: str,
    start_date: str | None = None,
    end_date: str | None = None
):
    return search_expense_records(
        keyword,
        start_date,
        end_date
    )


@app.get("/test-tools/date-range")
def test_date_range(start_date: str, end_date: str):
    return expenses_by_date_range(start_date, end_date)


@app.get("/test-tools/monthly-total")
def test_monthly_total(year: int, month: int):
    return monthly_total(year, month)


@app.get("/test-tools/category-summary")
def test_category_summary(year: int, month: int):
    return category_summary(year, month)

@app.get("/test-llm")
def test_llm(message: str):
    return {
        "response": ask_llm(message)
    }

@app.get("/test-tool-choice")
def test_tool_choice(message: str):
    result = choose_tool(message)

    if result.tool_calls:
        tool_call = result.tool_calls[0]

        return {
            "type": "tool_call",
            "tool_name": tool_call.function.name,
            "arguments": tool_call.function.arguments
        }

    return {
        "type": "text",
        "content": result.content
    }

@app.get("/test-agent")
def test_agent(message: str):
    return {
        "response": run_finance_agent(message)
    }

@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    start_time = time.perf_counter()
    result = run_finance_agent(request.message)
    end_time = time.perf_counter()

    latency_ms = (end_time - start_time) * 1000

    print(f"Agent latency: {latency_ms:.2f} ms")

    return ChatResponse(
        response=result
    )