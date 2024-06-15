document.addEventListener('DOMContentLoaded', function() {
    var mapLink = document.getElementById('mapLink');
    mapLink.addEventListener('click', function(event) {
        // 로그인 상태 확인 (예: 쿠키나 로컬 스토리지 사용)
        var isLoggedIn = checkLoginStatus();

        if (!isLoggedIn) {
            event.preventDefault();
            alert("로그인 또는 회원가입을 진행해주세요.");
        } else {
            window.location.href = "index.html";
        }
    });
});

function checkLoginStatus() {
    // 로그인 상태 확인 로직을 여기에 구현 (예: 쿠키나 로컬 스토리지 확인)
    // 로그인 상태 예시 (true: 로그인됨, false: 로그인되지 않음)
    return localStorage.getItem('isLoggedIn') === 'true';
}

// 로그인 성공 시 호출
function onLoginSuccess() {
    localStorage.setItem('isLoggedIn', 'true');
    window.location.href = 'index.html';
}

// 로그아웃 시 호출
function onLogout() {
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'login.html';
}
