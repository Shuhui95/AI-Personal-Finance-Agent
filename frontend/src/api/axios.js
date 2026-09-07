import axios from "axios";


/*
 * Spring Boot Backend API
 *
 * 用于：
 * Expense CRUD
 * Monthly Summary
 * Category Summary
 * 等普通财务功能
 */
export const backendApi = axios.create({
  baseURL: "http://localhost:8080/api",
  timeout: 10000,
});


/*
 * Python AI Service
 *
 * 用于：
 * POST /chat
 * AI Agent
 */
export const aiApi = axios.create({
  baseURL: "http://localhost:8000",
  timeout: 60000,
});


/*
 * 保留 default export，
 * 兼容之前已经写好的旧组件。
 *
 * 例如：
 *
 * import api from "../api/axios";
 *
 * api.get(...)
 * api.post(...)
 *
 * 这些代码不需要修改。
 */
export default backendApi;