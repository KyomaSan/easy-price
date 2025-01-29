import axios from "axios";
import Cookies from "js-cookie";
// 根据环境变量设置请求的基础路径
const KJS_BASE_URL = process.env.NODE_ENV === "production" ? "https://kejinlianmeng.com" : "/kjs";

/** 根据POST请求 BODY参数获取易手游的详情
 * https://www.swcbg.com/api/Index/shopDetail
 */
export const getYiShouYou = (id) => {
    return axios.post("https://www.swcbg.com/api/Index/shopDetail", { id });
};

/** 根据get请求 ID获取氪金兽的详情
 *
 */
export const getKejinshou = (id) => {
    // Cookies.set(
    //     "remember_web_59ba36addc2b2f9401580f014c7f58ea4e30989d",
    //     "eyJpdiI6IlNZKzQzMjdiYTlCQ0s4WHlRN2p4alE9PSIsInZhbHVlIjoid3NBM1hUeEF1YWxoTm1ZaVNSSm54TkM4T0dsUnBVcXZJUnV3RUpHbDZHTGVJcXdkUFdEVnhWZjJcL2ZUK0JlRk1xblBCZjlYdHUzbUxTMlVzWDhaVWFwUDNJY29RcmR4U29BV3l4dlBRaDNtd0h3UjZ5d2lUWHh4ZHlZYVNqUzRyTFFMTXdxUVUrZ09FdWdFSGhBdXVJQT09IiwibWFjIjoiOWI0M2M4YzBlMTRiYWZiNTUyYzk4OTNiOTRkYzYwYTcxYjEyNzQ0ODgyNGE2NzhmNjRkYmRjODkzNDA0NjI1ZSJ9",
    //     { path: "/" }
    // );
    // return axios.get(`https://easy-price.hongbin.workers.dev/api?id=${id}`, { withCredentials: true });
    return axios.get(`https://1312047591-4jxw1qcuvn.ap-guangzhou.tencentscf.com/api?id=${id}`, { withCredentials: true });
};
