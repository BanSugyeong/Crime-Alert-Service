// 관리자 로그인 버튼 클릭 시
document.getElementById('admin-login-btn').addEventListener('click', function() {
    var adminId = document.getElementById('admin-id').value;
    
    if (adminId === '1234') {
        document.getElementById('admin-login').style.display = 'none';
        document.getElementById('admin-content').style.display = 'block';
        document.getElementById('search-bar').style.display = 'flex'; // 검색바 표시
        loadAdminData(); // 데이터 로드
    } else {
        alert('잘못된 관리자 아이디입니다.');
    }
});

function loadAdminData() {
    fetch('/admin-data')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const { users, favorites, posts } = data.data;
                const userData = {};

                // 사용자 정보를 기반으로 데이터 정리
                users.forEach(user => {
                    userData[user.id] = { 
                        id: user.id, 
                        username: user.username, 
                        password: user.password, 
                        favorites: [], 
                        posts: [] 
                    };
                });

                // 즐겨찾기 정보 추가
                favorites.forEach(fav => {
                    if (userData[fav.user_id]) {
                        userData[fav.user_id].favorites.push(fav.district);
                    }
                });

                // 게시글 정보 추가
                posts.forEach(post => {
                    if (userData[post.user_id]) {
                        userData[post.user_id].posts.push({ 
                            title: post.title, 
                            content: post.content, 
                            created_at: post.created_at 
                        });
                    }
                });

                let outputHtml = '';
                
                // 사용자 별로 정보를 출력
                Object.values(userData).forEach(user => {
                    outputHtml += `
                        <div class="user-box">
                            <h4>사용자: ${user.username} (아이디: ${user.id})</h4>
                            <p>비밀번호: ${user.password}</p>
                            <div>
                                <strong>즐겨찾기:</strong>
                                ${user.favorites.length > 0 ? user.favorites.join(', ') : '없음'}
                            </div>
                            <div>
                                <strong>게시글:</strong>
                                ${user.posts.length > 0 ? user.posts.map(post => `
                                    <div class="post-box">
                                        <p>제목: ${post.title}</p>
                                        <p>내용: ${post.content}</p>
                                        <p>작성일: ${post.created_at}</p>
                                    </div>
                                `).join('') : '게시글 없음'}
                            </div>
                        </div>
                    `;
                });

                document.getElementById('admin-content').innerHTML = outputHtml;
            } else {
                alert('데이터 조회 중 오류가 발생했습니다.');
            }
        })
        .catch(error => console.error('Error fetching admin data:', error));
}

// 검색 버튼 클릭 시
document.getElementById('search-btn').addEventListener('click', function() {
    var searchUsername = document.getElementById('search-input').value.trim();
    if (searchUsername) {
        loadAdminData(searchUsername); // 검색어로 데이터 로드
    } else {
        alert('아이디를 입력하세요.');
    }
});

// 검색어에 맞는 사용자 데이터 로드하는 함수
function loadAdminDataForSearch(searchUsername) {
    fetch('/admin-data')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const { users, favorites, posts } = data.data;
                const userData = {};

                // 사용자 정보를 기반으로 데이터 정리
                users.forEach(user => {
                    userData[user.id] = { 
                        id: user.id, 
                        username: user.username, 
                        password: user.password, 
                        favorites: [], 
                        posts: [] 
                    };
                });

                // 즐겨찾기 정보 추가
                favorites.forEach(fav => {
                    if (userData[fav.user_id]) {
                        userData[fav.user_id].favorites.push(fav.district);
                    }
                });

                // 게시글 정보 추가
                posts.forEach(post => {
                    if (userData[post.user_id]) {
                        userData[post.user_id].posts.push({ 
                            title: post.title, 
                            content: post.content, 
                            created_at: post.created_at 
                        });
                    }
                });

                // 검색어에 맞는 사용자 필터링
                const filteredUserData = Object.values(userData).filter(user => user.username === searchUsername);
                
                // 사용자 데이터를 화면에 표시
                displayUserData(filteredUserData.reduce((acc, user) => {
                    acc[user.id] = user;
                    return acc;
                }, {}));
            } else {
                alert('데이터 조회 중 오류가 발생했습니다.');
            }
        })
        .catch(error => console.error('Error fetching admin data for search:', error));
}