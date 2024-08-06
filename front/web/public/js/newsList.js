// 뉴스 표시 함수 수정
async function displayNews() {
    const newsListContainer = document.getElementById('news-list');

    try {
        // 백엔드 서버의 API에 요청
        const response = await fetch('http://localhost:3000/api/news');
        const newsList = await response.json();

        newsListContainer.innerHTML = '';  // 이전 내용 지우기

        if (newsList.length > 0) {
            newsList.forEach(news => {
                const newsItem = document.createElement('div');
                newsItem.className = 'news-item';
                newsItem.innerHTML = `
                    <h3>${news.title}</h3>
                    <a href="${news.link}" target="_blank">원문 보기</a>
                `;
                newsListContainer.appendChild(newsItem);
            });
        } else {
            newsListContainer.innerHTML = '<p>No news found.</p>';
        }
    } catch (error) {
        console.error('Error fetching news:', error);
        newsListContainer.innerHTML = '<p>Error fetching news.</p>';
    }
}