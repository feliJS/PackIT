function getCookie(name) { //hittar rätt cookie
    return document.cookie
        .split('; ')
        .find(cookie => cookie.startsWith(name + '='))
        ?.split('=')[1] || null;
}

const sessionId = getCookie('session_id');
console.log('session_id:', sessionId);
