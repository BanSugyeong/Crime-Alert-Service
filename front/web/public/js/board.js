document.addEventListener("DOMContentLoaded", function() {
    const writeButtonContainer = document.getElementById('write-button-container');
    const writeButton = document.getElementById('write-button');
    const writeModal = document.getElementById('write-modal');
    const closeModal = document.getElementsByClassName('close')[0];
    const submitPost = document.getElementById('submit-post');
    const postContentInput = document.getElementById('post-content');
    const newsList = document.getElementById('news-list');

    // 로그인 상태 확인 함수
    function checkLoginStatus() {
        fetch('/is-authenticated')
            .then(response => response.json())
            .then(data => {
                if (data.authenticated) {
                    writeButtonContainer.style.display = 'block'; // 로그인한 경우 작성 버튼 표시
                } else {
                    writeButtonContainer.style.display = 'none'; // 로그인하지 않은 경우 버튼 숨김
                }
            })
            .catch(error => console.error('Error fetching login status:', error));
    }

    // 게시글 목록 불러오기
    function loadPosts() {
        fetch('/posts')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    renderPosts(data.posts);
                } else {
                    console.error('Error loading posts:', data.message);
                }
            })
            .catch(error => console.error('Error fetching posts:', error));
    }

    // 게시글을 화면에 표시
    function renderPosts(posts) {
        newsList.innerHTML = '';
        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'post-item';
            postElement.innerHTML = `
                <p><strong>${post.username}</strong> (${post.created_at})</p>
                <p>${post.content}</p>
            `;
            newsList.appendChild(postElement);
        });
    }

    // 게시글 작성 버튼 클릭 시 모달 표시
    writeButton.onclick = function() {
        writeModal.style.display = "block";
    }

    // 모달 닫기 버튼 클릭 시 모달 닫기
    closeModal.onclick = function() {
        writeModal.style.display = "none";
    }

    // 게시글 제출 버튼 클릭 시
    submitPost.onclick = function() {
        const postContent = postContentInput.value;
        if (postContent.trim()) {
            submitPostToServer(postContent);
        } else {
            alert("글 내용을 입력해주세요.");
        }
    }

    // 게시글 서버로 제출
    function submitPostToServer(content) {
        fetch('/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(data.message);
                writeModal.style.display = "none";
                postContentInput.value = ''; // 입력 필드 초기화
                loadPosts(); // 게시글 목록 다시 불러오기
            } else {
                alert(data.message);
            }
        })
        .catch(error => console.error('Error submitting post:', error));
    }

    // 페이지 로드 시 로그인 상태 및 게시글 목록 확인
    checkLoginStatus();
    loadPosts();
});