document.getElementById('admin-login-btn').addEventListener('click', function() {
    var adminId = document.getElementById('admin-id').value;
    
    // 관리자 아이디 확인 (1234가 맞으면 관리자 페이지로 이동)
    if(adminId === '1234') {
        document.getElementById('admin-login').style.display = 'none';
        document.getElementById('admin-content').style.display = 'block';
        loadAdminData(); // 관리자 데이터를 로드
    } else {
        alert('잘못된 관리자 아이디입니다.');
    }
});

function loadAdminData() {
    // 서버에서 회원 정보, 즐겨찾기, 게시글 정보를 가져와서 표시
    const users = [
        { id: 1, name: '사용자1', email: 'user1@example.com' },
        { id: 2, name: '사용자2', email: 'user2@example.com' }
    ];

    const favorites = [
        { userId: 1, favorite: '범죄 예방 사이트1' },
        { userId: 2, favorite: '범죄 예방 사이트2' }
    ];

    const posts = [
        { userId: 1, title: '첫번째 게시글', content: '내용1' },
        { userId: 2, title: '두번째 게시글', content: '내용2' }
    ];

    let userInfoHtml = '';
    users.forEach(user => {
        userInfoHtml += `<p>아이디: ${user.id}, 이름: ${user.name}, 이메일: ${user.email}</p>`;
    });
    document.getElementById('user-info').innerHTML = userInfoHtml;

    let favoritesHtml = '';
    favorites.forEach(fav => {
        favoritesHtml += `<p>사용자 아이디: ${fav.userId}, 즐겨찾기: ${fav.favorite}</p>`;
    });
    document.getElementById('favorites-info').innerHTML = favoritesHtml;

    let postsHtml = '';
    posts.forEach(post => {
        postsHtml += `<p>사용자 아이디: ${post.userId}, 제목: ${post.title}, 내용: ${post.content}</p>`;
    });
    document.getElementById('posts-info').innerHTML = postsHtml;
}
