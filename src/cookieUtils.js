import Cookies from "js-cookie";
export const getTokenFromCookie = () => {
  return Cookies.get("Authentication");
};
export const removeToken = () => {
  return Cookies.remove("Authentication");
};
