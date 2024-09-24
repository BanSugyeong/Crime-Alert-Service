document.addEventListener("DOMContentLoaded", function() {
    const writeButtonContainer = document.getElementById('write-button-container');
    const writeButton = document.getElementById('write-button');
    const writeModal = document.getElementById('write-modal');
    const closeModal = document.getElementsByClassName('close')[0];
    const submitPost = document.getElementById('submit-post');
    const postContentInput = document.getElementById('post-content');
    const boardList = document.getElementById('board-list');

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
                    renderPosts(data.posts); // 서버에서 받은 게시글 목록 렌더링
                } else {
                    console.error('Error loading posts:', data.message);
                }
            })
            .catch(error => console.error('Error fetching posts:', error));
    }

    // 게시글을 화면에 렌더링
    function renderPosts(posts) {
        boardList.innerHTML = ''; // 기존 목록 비우기
        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'post-item';
            postElement.innerHTML = `
                <h4>${post.title}</h4> <!-- 제목 추가 -->
                <p>${post.content}</p>
                <p><strong>${post.username}</strong> (${post.created_at})</p>
            `;
            boardList.appendChild(postElement);
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

    submitPost.onclick = function() {
        const postTitle = document.getElementById('post-title').value; // 제목 가져오기
        const postContent = postContentInput.value; // 내용 가져오기
    
        if (postTitle.trim() && postContent.trim()) {
            submitPostToServer(postTitle, postContent); // 제목과 내용을 서버로 제출
        } else {
            alert("제목과 내용을 모두 입력해주세요.");
        }
    }
    
   // 게시글 서버로 제출
    function submitPostToServer() {
        const postTitle = document.getElementById('post-title').value;
        const postContent = postContentInput.value;

        if (postTitle.trim() === '' || postContent.trim() === '') {
            alert("제목과 내용을 모두 입력해주세요.");
            return;
        }

        fetch('/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: postTitle, content: postContent })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(data.message);
                writeModal.style.display = "none";
                postContentInput.value = ''; // 입력 필드 초기화
                document.getElementById('post-title').value = ''; // 제목 입력 필드 초기화
                
                // 새로운 게시글을 로드하여 목록에 추가
                loadPosts(); // 게시글 목록 다시 불러오기
                
                // 새로 작성한 게시글을 목록에 추가
                renderPosts([{ // 즉시 목록에 추가
                    username: data.username || "Anonymous", // 작성자 이름 추가
                    title: postTitle, // 제목 추가
                    content: postContent,
                    created_at: new Date().toLocaleString() // 현재 시간 추가
                }, ...boardList.children]); // 기존 게시글 유지
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