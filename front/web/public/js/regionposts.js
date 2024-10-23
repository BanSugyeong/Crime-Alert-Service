// 지역 선택 드롭박스 기능
document.getElementById('submit-button').addEventListener('click', function() {
    const regionSelect = document.getElementById('region-select');
    const selectedRegion = regionSelect.value;
    const regionInfo = document.getElementById('region-info');
    const infoBox = document.getElementById('info-box');

    const regionData = {
        seoul: '서울: 대한민국의 수도이며, 다양한 문화와 역사를 자랑합니다.',
        busan: '부산: 해양 도시로 유명하며, 해운대와 광안리가 있습니다.',
        incheon: '인천: 인천국제공항이 위치한 도시로, 다채로운 볼거리가 많습니다.',
        daegu: '대구: 대구는 텃세와 전통 시장이 유명한 도시입니다.',
        jeju: '제주도: 아름다운 자연경관과 독특한 문화가 있는 섬입니다.'
    };

    if (selectedRegion in regionData) {
        regionInfo.textContent = regionData[selectedRegion];
        infoBox.style.display = 'block';
    } else {
        regionInfo.textContent = '';
        infoBox.style.display = 'none';
    }
});
