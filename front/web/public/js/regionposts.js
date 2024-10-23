// 지역 선택 드롭박스 기능
document.getElementById('submit-button').addEventListener('click', function() {
    const regionSelect = document.getElementById('region-select');
    const selectedRegion = regionSelect.value;
    const regionInfo = document.getElementById('region-info');
    const infoBox = document.getElementById('info-box');
    const crimeChartCanvas = document.getElementById('crime-chart'); // 차트 캔버스
    const crimeDataText = document.getElementById('crime-data-text'); // 범죄 수치를 표시할 텍스트 영역

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
                infoBox.style.display = 'flex';
            } else {
                regionInfo.textContent = '관련 뉴스가 없습니다.';
                infoBox.style.display = 'flex';
            }
        })
        .catch(error => {
            console.error('Error fetching news:', error);
            regionInfo.textContent = '뉴스를 가져오는 중 오류가 발생했습니다.';
            infoBox.style.display = 'flex';
        });

    // 범죄율 데이터 가져오기 (예시 데이터)
    const crimeRateData = {
        seoul: [0.1, 0.2, 7.2, 35.9, 56.6],  // [살인, 강도, 강간, 절도, 폭력]
        busan: [8, 12, 18, 22, 40],
        incheon: [5, 10, 15, 30, 40],
        daegu: [0.8, 0.3, 6.5, 64.1, 28.3],
        jeju: [3, 8, 12, 25, 52]
    };
    
    const crimeLabels = ['살인', '강도', '강간', '절도', '폭력']; // 범죄 유형

    if (selectedRegion in crimeRateData) {
        // 기존 차트를 제거하고 새로 생성
        if (window.crimeChart) {
            window.crimeChart.destroy();
        }

        // 범죄율 데이터를 기반으로 원형 그래프 생성
        const ctx = crimeChartCanvas.getContext('2d');
        window.crimeChart = new Chart(ctx, {
            type: 'doughnut', // 원형 차트
            data: {
                labels: crimeLabels, // 5대 범죄
                datasets: [{
                    data: crimeRateData[selectedRegion],
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'], // 색상 설정
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    position: 'right',
                }
            }
        });

        // 범죄 수치를 텍스트로 표시
        crimeDataText.innerHTML = ''; // 기존 텍스트 초기화
        crimeRateData[selectedRegion].forEach((value, index) => {
            crimeDataText.innerHTML += `
                <div class="chart-data-item">
                    <strong>${crimeLabels[index]}:</strong> ${value} %
                </div>
            `;
        });

        infoBox.style.display = 'flex';
    } else {
        console.error('No crime data available for the selected region.');
    }
});
