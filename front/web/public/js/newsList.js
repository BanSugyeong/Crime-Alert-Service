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


// // 예제 뉴스 기사 데이터
// const newsData = [
//     { title: "Crime News 1", link: "https://news1.example.com" },
//     { title: "Crime News 2", link: "https://news2.example.com" },
//     { title: "Crime News 3", link: "https://news3.example.com" },
// ];

// // 뉴스 기사를 동적으로 추가하는 함수
// function displayNews() {
//     const newsList = document.getElementById('newsList');
//     newsList.innerHTML = '';

//     newsData.forEach(news => {
//         const newsItem = document.createElement('div');
//         newsItem.className = 'news_item';

//         const newsTitle = document.createElement('h5');
//         newsTitle.className = 'news_title';
//         const newsLink = document.createElement('a');
//         newsLink.href = news.link;
//         newsLink.textContent = news.title;
//         newsTitle.appendChild(newsLink);

//         newsItem.appendChild(newsTitle);
//         newsList.appendChild(newsItem);
//     });
// }

// // 페이지 로드 시 뉴스 기사 표시
// document.addEventListener('DOMContentLoaded', displayNews);

