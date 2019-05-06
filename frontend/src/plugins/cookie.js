export function getCookie (c_name) {
    if (document.cookie.length > 0) {
        let c_start = document.cookie.indexOf(c_name + "=");
        if (c_start !== -1) {
            c_start = c_start + c_name.length + 1;
            let c_end = document.cookie.indexOf(";", c_start);
            if (c_end === -1)
                c_end = document.cookie.length;
            return decodeURI(document.cookie.substring(c_start, c_end));
        }
    }
    return "";
}

export function deleteCookie (c_name) {
    console.log('DeleteCookie function');
    if (getCookie(c_name)) {
        document.cookie = c_name + "= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
        console.log('post cookie del');
    }
}
