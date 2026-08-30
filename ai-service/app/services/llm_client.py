import os

from dotenv import load_dotenv
from openai import OpenAI

from app.tools.tool_definitions import EXPENSE_TOOL_DEFINITIONS


load_dotenv()


DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")

DEEPSEEK_BASE_URL = os.getenv(
    "DEEPSEEK_BASE_URL",
    "https://api.deepseek.com"
)

DEEPSEEK_MODEL = os.getenv(
    "DEEPSEEK_MODEL",
    "deepseek-v4-flash"
)


client = OpenAI(
    api_key=DEEPSEEK_API_KEY,
    base_url=DEEPSEEK_BASE_URL
)


def ask_llm(message: str):
    response = client.chat.completions.create(
        model=DEEPSEEK_MODEL,
        messages=[
            {
                "role": "user",
                "content": message
            }
        ]
    )

    return response.choices[0].message.content


def choose_tool(message: str):
    response = client.chat.completions.create(
        model=DEEPSEEK_MODEL,

        messages=[
            {
                "role": "system",
                "content": (
                    "You are a personal finance assistant. "
                    "Use the available tools when the user asks "
                    "about their expense data."
                )
            },
            {
                "role": "user",
                "content": message
            }
        ],

        tools=EXPENSE_TOOL_DEFINITIONS,

        tool_choice="auto"
    )

    return response.choices[0].message