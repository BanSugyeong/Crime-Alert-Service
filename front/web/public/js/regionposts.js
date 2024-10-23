// 지역 선택 드롭박스 기능
document.getElementById('submit-button').addEventListener('click', function() {
    const regionSelect = document.getElementById('region-select');
    const selectedRegion = regionSelect.value;
    const regionInfo = document.getElementById('region-info');
    const infoBox = document.getElementById('info-box');

    // 지역에 대한 뉴스 가져오기
    fetch(`/api/news?region=${selectedRegion}&keyword=범죄`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const newsList = data.news;
                regionInfo.innerHTML = ''; // 기존 내용 초기화

                newsList.forEach(news => {
                    regionInfo.innerHTML += `
                        <div class="news-item">
                            <strong>${news.title}</strong><br>
                            <br><a href="${news.link}" target="_blank">원문 보러 가기</a>
                        </div>
                    `;
                });
                infoBox.style.display = 'block';
            } else {
                regionInfo.textContent = '관련 뉴스가 없습니다.';
                infoBox.style.display = 'block';
            }
        })
        .catch(error => {
            console.error('Error fetching news:', error);
            regionInfo.textContent = '뉴스를 가져오는 중 오류가 발생했습니다.';
            infoBox.style.display = 'block';
        });
});
