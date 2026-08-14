import { setCookie } from "./setCookie";

export async function checkAndSetCSRFToken() {
    const response = await fetch(`${__BACKEND_URL__}/csrf/`, {
        method: 'GET',
        credentials: 'include'
    });

    if (!response.ok) {
        throw new Error(
            `Failed to get CSRF token: ${response.status}`
        );
    }

    const data = await response.json();

    setCookie('csrftoken', data.csrfToken, 1);

    return data.csrfToken;
}