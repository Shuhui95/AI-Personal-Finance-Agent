import json

from app.services.llm_client import client, DEEPSEEK_MODEL
from app.tools.tool_definitions import EXPENSE_TOOL_DEFINITIONS
from app.tools.expense_tools import (
    list_expenses,
    expense_by_id,
    expenses_by_category,
    expenses_by_month,
    search_expense_records,
    monthly_total,
    category_summary,
)


TOOL_FUNCTIONS = {
    "list_expenses": list_expenses,
    "expense_by_id": expense_by_id,
    "expenses_by_category": expenses_by_category,
    "expenses_by_month": expenses_by_month,
    "search_expense_records": search_expense_records,
    "monthly_total": monthly_total,
    "category_summary": category_summary,
}


MAX_AGENT_STEPS = 5


def run_finance_agent(user_message: str):

    messages = [
        {
            "role": "system",
            "content": (
                "You are a personal finance assistant. "
                "Use the available tools whenever the user asks about "
                "their real expense data. "
                "Never invent expense records, totals, or categories. "
                "You may call multiple tools when necessary. "
                "When you have enough information, answer the user clearly "
                "and concisely."
            )
        },
        {
            "role": "user",
            "content": user_message
        }
    ]

    for _ in range(MAX_AGENT_STEPS):

        response = client.chat.completions.create(
            model=DEEPSEEK_MODEL,
            messages=messages,
            tools=EXPENSE_TOOL_DEFINITIONS,
            tool_choice="auto"
        )

        assistant_message = response.choices[0].message

        # 如果模型不再请求 tool，
        # 说明它已经准备好给最终答案。
        if not assistant_message.tool_calls:
            return assistant_message.content

        # 把模型的 tool call 记录加入对话历史
        messages.append(assistant_message)

        # 模型可能一次请求多个 tools
        for tool_call in assistant_message.tool_calls:

            tool_name = tool_call.function.name

            try:
                arguments = json.loads(
                    tool_call.function.arguments
                )
            except json.JSONDecodeError:
                tool_result = {
                    "error": "Invalid tool arguments."
                }

                messages.append(
                    {
                        "role": "tool",
                        "tool_call_id": tool_call.id,
                        "content": json.dumps(tool_result)
                    }
                )

                continue

            if tool_name not in TOOL_FUNCTIONS:
                tool_result = {
                    "error": f"Unknown tool: {tool_name}"
                }

            else:
                tool_function = TOOL_FUNCTIONS[tool_name]

                try:
                    tool_result = tool_function(
                        **arguments
                    )

                except Exception as error:
                    tool_result = {
                        "error": str(error)
                    }

            messages.append(
                {
                    "role": "tool",
                    "tool_call_id": tool_call.id,
                    "content": json.dumps(
                        tool_result,
                        ensure_ascii=False,
                        default=str
                    )
                }
            )

    return (
        "I could not complete the request "
        "within the allowed number of steps."
    )