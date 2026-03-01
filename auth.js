/**
 * VSSKII 系統 - 權限驗證模組
 * 用於檢查使用者是否已登入
 */

const SESSION_KEY = 'vsskii_session';

function checkAuth() {
    const session = sessionStorage.getItem(SESSION_KEY);
    
    if (!session) {
        redirectToLogin();
        return false;
    }
    
    try {
        const data = JSON.parse(session);
        if (!data.isLoggedIn || !data.username) {
            redirectToLogin();
            return false;
        }
        
        // 檢查登入時間（可選：設定 session 過期時間）
        const loginTime = new Date(data.loginTime);
        const now = new Date();
        const hoursDiff = (now - loginTime) / (1000 * 60 * 60);
        
        // 如果超過 8 小時，要求重新登入
        if (hoursDiff > 8) {
            alert('登入已過期，請重新登入');
            redirectToLogin();
            return false;
        }
        
        return true;
    } catch (e) {
        console.error('Session 驗證錯誤', e);
        redirectToLogin();
        return false;
    }
}

function redirectToLogin() {
    sessionStorage.removeItem(SESSION_KEY);
    window.location.href = 'index.html';
}

function getCurrentUser() {
    const session = sessionStorage.getItem(SESSION_KEY);
    if (session) {
        try {
            const data = JSON.parse(session);
            return data.username || 'guest';
        } catch (e) {
            return 'guest';
        }
    }
    return 'guest';
}

function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    window.location.href = 'index.html';
}

// 頁面載入時自動檢查權限
if (window.location.pathname.indexOf('index.html') === -1 && 
    window.location.pathname !== '/' && 
    window.location.pathname !== '') {
    checkAuth();
}
