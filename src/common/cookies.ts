import Cookies from "universal-cookie";

export const checkLoggedIn = (req : any) => {
    const accessToken = getCookieValue(req, "accessToken");
    if(accessToken) return true;

    return false;
}

export const getCookieValue = (req : any, key : string) => {
    const cookies = new Cookies(req.headers.cookie, { path: '/' });
    return cookies.get(key);
}

export function cookieParser(): Record<string, string> {
    const cookieString: string = document.cookie;
    if (cookieString === "") {
        return {};
    }
    let pairs = cookieString.split(";");
    let splittedPairs = pairs.map(cookie => cookie.split("="));
    // Create an object with all key-value pairs
    const cookieObj = splittedPairs.reduce<Record<string, string>>((obj, cookie) => {
        obj[decodeURIComponent(cookie[0].trim())]
            = decodeURIComponent(cookie[1].trim());
        return obj;
    }, {});
    return cookieObj;
}

export const getClientCookieValue = (key : string) => {
    const cookies = cookieParser();
    return cookies[key];
}

export const clearCookies = (key : string) => {
    const cookies = new Cookies(null, { path: '/' });
    cookies.remove(key);
    return;
}