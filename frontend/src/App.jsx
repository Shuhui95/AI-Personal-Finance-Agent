import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { backendApi } from "./api/axios";

import Sidebar from "./components/Sidebar";
import ChatPanel from "./components/ChatPanel";
import FinanceOverview from "./components/FinanceOverview";
import DashboardPage from "./components/DashboardPage";
import TransactionsPage from "./components/TransactionsPage";

import "./App.css";


function getCurrentMonth() {
  const date = new Date();

  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  return `${year}-${month}`;
}


function App() {
  // 当前左侧菜单页面
  const [activePage, setActivePage] =
    useState("chat");


  // 当前 Dashboard / Overview 选择的月份
  const [selectedMonth, setSelectedMonth] =
    useState(getCurrentMonth());


  // 当前选择月份的 Expense
  const [expenses, setExpenses] =
    useState([]);


  // 数据库里的全部 Expense
  // Transactions 页面使用这个
  const [allExpenses, setAllExpenses] =
    useState([]);


  // 当前月份总消费
  const [monthlyTotal, setMonthlyTotal] =
    useState(0);


  // 当前月份 Category Summary
  const [categorySummary, setCategorySummary] =
    useState({});


  // 财务数据加载状态
  const [loadingFinance, setLoadingFinance] =
    useState(false);


  // 财务数据加载错误
  const [financeError, setFinanceError] =
    useState("");


  // Chat 消息
  const [messages, setMessages] =
    useState([]);


  // 左侧 Recent Chats
  const [recentChats, setRecentChats] =
    useState([]);


  /*
   * 把：
   *
   * {
   *   Food: 30,
   *   Shopping: 20
   * }
   *
   * 转换成：
   *
   * [
   *   { name: "Food", value: 30 },
   *   { name: "Shopping", value: 20 }
   * ]
   */
  const categoryData = useMemo(() => {
    return Object.entries(
      categorySummary
    ).map(([name, value]) => ({
      name,
      value: Number(value),
    }));
  }, [categorySummary]);


  /*
   * selectedMonth 改变时：
   *
   * 重新加载当前月份数据
   */
  useEffect(() => {
    loadFinanceData();
  }, [selectedMonth]);


  /*
   * 页面第一次加载时：
   *
   * 获取数据库全部 Expenses
   */
  useEffect(() => {
    loadAllExpenses();
  }, []);


  /*
   * 加载当前月份的数据：
   *
   * 1. 月度 Expense
   * 2. Monthly Total
   * 3. Category Summary
   *
   * Dashboard 和 Chat 右侧 Overview 使用。
   */
  async function loadFinanceData() {
    const [
      yearString,
      monthString,
    ] = selectedMonth.split("-");

    const year = Number(yearString);
    const month = Number(monthString);

    setLoadingFinance(true);
    setFinanceError("");

    try {
      const [
        expensesResponse,
        totalResponse,
        categoriesResponse,
      ] = await Promise.all([
        backendApi.get(
          "/expenses/month",
          {
            params: {
              year,
              month,
            },
          }
        ),

        backendApi.get(
          "/expenses/summary/monthly",
          {
            params: {
              year,
              month,
            },
          }
        ),

        backendApi.get(
          "/expenses/summary/categories",
          {
            params: {
              year,
              month,
            },
          }
        ),
      ]);


      setExpenses(
        expensesResponse.data
      );


      setMonthlyTotal(
        totalResponse.data.total
      );


      setCategorySummary(
        categoriesResponse.data
      );

    } catch (error) {
      console.error(
        "Failed to load finance data:",
        error
      );

      setFinanceError(
        "Unable to load finance data. Please check that the backend is running."
      );

    } finally {
      setLoadingFinance(false);
    }
  }


  /*
   * 加载数据库全部 Expense。
   *
   * Transactions 页面使用。
   */
  async function loadAllExpenses() {
    try {
      const response =
        await backendApi.get(
          "/expenses"
        );

      setAllExpenses(
        response.data
      );

    } catch (error) {
      console.error(
        "Failed to load all expenses:",
        error
      );
    }
  }


  /*
   * Add / Edit / Delete 后统一刷新。
   *
   * 为什么两个都刷新：
   *
   * allExpenses
   * → Transactions
   *
   * expenses / monthlyTotal / categorySummary
   * → Dashboard + Chat Overview
   */
  async function refreshAllFinanceData() {
    await Promise.all([
      loadFinanceData(),
      loadAllExpenses(),
    ]);
  }


  /*
   * New Chat
   */
  function handleNewChat() {
    setMessages([]);
    setActivePage("chat");
  }


  /*
   * 用户发送新问题后，
   * 添加到 Recent Chats。
   */
  function handleUserMessage(message) {
    setRecentChats(
      (currentChats) => {
        const updatedChats = [
          message,

          ...currentChats.filter(
            (chat) =>
              chat !== message
          ),
        ];

        return updatedChats.slice(
          0,
          5
        );
      }
    );
  }


  return (
    <div
      className={
        activePage === "chat"
          ? "app-shell chat-layout"
          : "app-shell content-layout"
      }
    >

      {/* ================= SIDEBAR ================= */}

      <Sidebar
        activePage={
          activePage
        }
        onPageChange={
          setActivePage
        }
        onNewChat={
          handleNewChat
        }
        recentChats={
          recentChats
        }
      />


      {/* ================= MAIN ================= */}

      <main className="main-content">

        {/* ---------------- CHAT ---------------- */}

        {activePage === "chat" && (
          <ChatPanel
            messages={
              messages
            }
            setMessages={
              setMessages
            }
            onUserMessage={
              handleUserMessage
            }
          />
        )}


        {/* ---------------- DASHBOARD ---------------- */}

        {activePage === "dashboard" && (
          <DashboardPage
            selectedMonth={
              selectedMonth
            }
            onMonthChange={
              setSelectedMonth
            }
            expenses={
              expenses
            }
            monthlyTotal={
              monthlyTotal
            }
            categorySummary={
              categorySummary
            }
            loading={
              loadingFinance
            }
            error={
              financeError
            }
            onRetry={
              loadFinanceData
            }
          />
        )}


        {/* ---------------- TRANSACTIONS ---------------- */}

        {activePage === "transactions" && (
          <TransactionsPage
            expenses={
              allExpenses
            }
            onRefresh={
              refreshAllFinanceData
            }
          />
        )}


        {/* ---------------- BUDGET ---------------- */}

        {activePage === "budget" && (
          <div className="coming-soon">

            <div className="coming-soon-icon">
              $
            </div>

            <h2>
              Budget
            </h2>

            <p>
              Budget planning and AI-powered
              spending recommendations will
              be added here later.
            </p>

            <button
              onClick={() =>
                setActivePage("chat")
              }
            >
              Back to Chat
            </button>

          </div>
        )}


        {/* ---------------- REPORTS ---------------- */}

        {activePage === "reports" && (
          <div className="coming-soon">

            <div className="coming-soon-icon">
              ↗
            </div>

            <h2>
              Reports
            </h2>

            <p>
              Spending reports, trends and
              anomaly detection results will
              appear here later.
            </p>

            <button
              onClick={() =>
                setActivePage("chat")
              }
            >
              Back to Chat
            </button>

          </div>
        )}

      </main>


      {/* ================= RIGHT OVERVIEW ================= */}

      {activePage === "chat" && (
        <div className="overview-column">

          {financeError ? (
            <div className="finance-error">

              <strong>
                Finance data unavailable
              </strong>

              <p>
                {financeError}
              </p>

              <button
                onClick={
                  loadFinanceData
                }
              >
                Retry
              </button>

            </div>
          ) : (
            <FinanceOverview
              selectedMonth={
                selectedMonth
              }
              onMonthChange={
                setSelectedMonth
              }
              monthlyTotal={
                monthlyTotal
              }
              categoryData={
                categoryData
              }
              expenses={
                expenses
              }
              loading={
                loadingFinance
              }
            />
          )}

        </div>
      )}

    </div>
  );
}


export default App;