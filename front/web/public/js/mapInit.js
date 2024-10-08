function addClickEvent(marker, info) {
    kakao.maps.event.addListener(marker, 'click', function () {
        showWeatherSelection(info);
    });
}

function showModalAndInfo(info) {
    showModal();
    updateModalContent(info);
}

// 날씨에 대한 범죄율 시작
function showWeatherSelection(info) {
    const modalContent = document.getElementById("modalContent");
    modalContent.innerHTML = ''; // 기존 내용을 비움

    const weatherSelectionHtml = `
        <h3>오늘의 날씨</h3>
        <br>
        <br>
        <div class="weather-option" onclick="selectWeather('clear', '${info.title}', '${info.details}')">맑음</div>
        <br>
        <div class="weather-option" onclick="selectWeather('cloudy', '${info.title}', '${info.details}')">흐림</div>
        <br>
        <div class="weather-option" onclick="selectWeather('rainy', '${info.title}', '${info.details}')">비</div>
    `;
    
    modalContent.innerHTML += weatherSelectionHtml;

    // 모달 표시
    showModal();
}



function selectWeather(weather, title) {
    let newRate;
    let details;

    switch (weather) {
        case 'clear':
            newRate = "5.0%";
            details = '살인: 0.2%,<br> 강도: 0.1%,<br> 강간/강제추행: 3.5%,<br> 절도: 20.1%,<br> 폭력: 55.0%'; // 맑음에 대한 세부 정보
            break;
        case 'cloudy':
            newRate = "7.0%";
            details = '살인: 0.3%,<br> 강도: 0.2%,<br> 강간/강제추행: 4.2%,<br> 절도: 25.4%,<br> 폭력: 60.0%'; // 흐림에 대한 세부 정보
            break;
        case 'rainy':
            newRate = "10.0%";
            details = '살인: 0.5%,<br> 강도: 0.3%,<br> 강간/강제추행: 5.0%,<br> 절도: 30.8%,<br> 폭력: 65.0%'; // 비에 대한 세부 정보
            break;
    }

    const modalContent = document.getElementById("modalContent");
    modalContent.innerHTML = `
        <h1>${title} 범죄율</h1>
        <h1 id="crimeRate" style="font-size: 50px;">"${newRate}"</h1><br>
        <h3>${details}</h3>
    `;

    // 즐겨찾기 아이콘 추가
    updateModalContent({ title: title });
}
// 날씨에 대한 범죄율 끝


function updateModalContent(info) {
    console.log('updateModalContent called with:', info);
    var modalContent = document.getElementById("modalContent");
    
    // 비동기적으로 즐겨찾기 상태를 체크
    checkIfFavorited(info.title, (isFavorited) => {
        console.log('Favorite check result:', isFavorited);
        var starClass = isFavorited ? 'favorite-icon favorited' : 'favorite-icon';

        modalContent.innerHTML += `
            <div class="favorite-container">
                <div class="${starClass}" id="favoriteIcon" onclick="toggleFavorite('${info.title}', this)">★</div>
            </div>
        `;

        console.log('Modal content updated:', modalContent.innerHTML);
    });
}

// checkIfFavorited 함수도 수정 필요
function checkIfFavorited(title, callback) {
    fetch('/favorites')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                callback(data.favorites.includes(title));
            } else {
                callback(false);
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            callback(false); // 에러 발생 시 기본값으로 false 설정
        });
}

function bringModalToFront() {
    var modal = document.getElementById("modal");
    modal.style.zIndex = "9999"; // 또는 더 높은 숫자로 설정
}

// 모달을 표시하는 함수
function showModal() {
    var modal = document.getElementById("modal");
    modal.style.display = "flex";
}

// 모달을 숨기는 함수
function hideModal() {
    var modal = document.getElementById("modal");
    modal.style.display = "none";
}

// 즐겨찾기 기능
function checkIfFavorited(title, callback) {
    fetch('/favorites')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                callback(data.favorites.includes(title));
            } else {
                callback(false);
            }
        });
}

function toggleFavorite(title, element) {
    checkIfFavorited(title, (isFavorited) => {
        const method = isFavorited ? 'DELETE' : 'POST';

        fetch('/favorites', {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ district: title })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                element.classList.toggle('favorited');
                updateFavoritesList();
            } else {
                alert(data.message || 'Failed to update favorite');
            }
        })
        .catch(error => {
            console.error('Error toggling favorite:', error);
        });
    });
}

function updateFavoritesList() {
    fetch('/favorites', {
        method: 'GET',
        credentials: 'include' // 세션 쿠키 전송을 위해 추가
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            var favoritesList = document.getElementById('favoritesList');
            favoritesList.innerHTML = '';
            data.favorites.forEach(function (title) {
                var listItem = document.createElement('li');
                listItem.textContent = title;
                favoritesList.appendChild(listItem);
            });
        }
    })
    .catch(error => {
        console.error('Error updating favorites list:', error);
    });
}


// 지도 초기화 함수
function initializeMap() {
    // Kakao 지도 API를 사용한 지도 초기화 코드
    var mapContainer = document.getElementById('map');
    var mapOption = {
        center: new kakao.maps.LatLng(36.4788, 128.0003),
        level:13
    };

    var map = new kakao.maps.Map(mapContainer, mapOption);

    var clusterer = new kakao.maps.MarkerClusterer({
        map: map,
        averageCenter: true,
        minLevel: 10
    });

    var 데이터 = [
        [37.5665, 126.9782, '<div style="padding: 5px">서울</div>'],
        [35.1796, 129.0747, '<div style="padding: 5px">부산</div>'],
        [35.8715, 128.6015, '<div style="padding: 5px">대구</div>'],
        [37.4562, 126.7052, '<div style="padding: 5px">인천</div>'],
        [35.1599, 126.8513, '<div style="padding: 5px">광주</div>'],
        [36.3504, 127.3848, '<div style="padding: 5px">대전</div>'],
        [35.5396, 129.3115, '<div style="padding: 5px">울산</div>'],
        [36.4799, 127.2890, '<div style="padding: 5px">세종</div>'],
        [37.2634, 127.0286, '<div style="padding: 5px">수원시</div>'],
        [37.4200, 127.1266, '<div style="padding: 5px">성남시</div>'],
        [37.7380, 127.0338, '<div style="padding: 5px">의정부시</div>'],
        [37.3943, 126.9568, '<div style="padding: 5px">안양시</div>'],
        [37.5034, 126.7659, '<div style="padding: 5px">부천시</div>'],
        [37.4785, 126.8646, '<div style="padding: 5px">광명시</div>'],
        [36.9923, 127.1126, '<div style="padding: 5px">평택시</div>'],
        [37.9035, 127.0611, '<div style="padding: 5px">동두천시</div>'],
        [37.3219, 126.8312, '<div style="padding: 5px">안산시</div>'],
        [37.6582, 126.8320, '<div style="padding: 5px">고양시</div>'],
        [37.4291, 126.9876, '<div style="padding: 5px">과천시</div>'],
        [37.5942, 127.1297, '<div style="padding: 5px">구리시</div>'],
        [37.6349, 127.2163, '<div style="padding: 5px">남양주시</div>'],
        [37.1497, 127.0770, '<div style="padding: 5px">오산시</div>'],
        [37.3801, 126.8028, '<div style="padding: 5px">시흥시</div>'],
        [37.3615, 126.9352, '<div style="padding: 5px">군포시</div>'],
        [37.3448, 126.9687, '<div style="padding: 5px">의왕시</div>'],
        [37.5391, 127.2146, '<div style="padding: 5px">하남시</div>'],
        [37.2406, 127.1772, '<div style="padding: 5px">용인시</div>'],
        [37.7594, 126.7803, '<div style="padding: 5px">파주시</div>'],
        [37.2722, 127.4350, '<div style="padding: 5px">이천시</div>'],
        [37.0078, 127.2798, '<div style="padding: 5px">안성시</div>'],
        [37.6153, 126.7154, '<div style="padding: 5px">김포시</div>'],
        [37.1994, 126.8316, '<div style="padding: 5px">화성시</div>'],
        [37.4294, 127.2551, '<div style="padding: 5px">광주시</div>'],
        [37.7852, 127.0458, '<div style="padding: 5px">양주시</div>'],
        [37.8949, 127.2003, '<div style="padding: 5px">포천시</div>'],
        [37.2982, 127.6372, '<div style="padding: 5px">여주시</div>'],
        [37.8813, 127.7301, '<div style="padding: 5px">춘천시</div>'],
        [37.3420, 127.9197, '<div style="padding: 5px">원주시</div>'],
        [37.7520, 128.8760, '<div style="padding: 5px">강릉시</div>'],
        [37.5247, 129.1143, '<div style="padding: 5px">동해시</div>'],
        [37.1641, 128.9856, '<div style="padding: 5px">태백시</div>'],
        [38.2070, 128.5918, '<div style="padding: 5px">속초시</div>'],
        [37.4499, 129.1651, '<div style="padding: 5px">삼척시</div>'],
        [36.9909, 127.9259, '<div style="padding: 5px">충주시</div>'],
        [37.1326, 128.1910, '<div style="padding: 5px">제천시</div>'],
        [36.6424, 127.4890, '<div style="padding: 5px">청주시</div>'],
        [36.8150, 127.1139, '<div style="padding: 5px">천안시</div>'],
        [36.4465, 127.1191, '<div style="padding: 5px">공주시</div>'],
        [36.3335, 126.6126, '<div style="padding: 5px">보령시</div>'],
        [36.7899, 127.0025, '<div style="padding: 5px">아산시</div>'],
        [36.7848, 126.4503, '<div style="padding: 5px">서산시</div>'],
        [36.1871, 127.0987, '<div style="padding: 5px">논산시</div>'],
        [36.2745, 127.2486, '<div style="padding: 5px">계룡시</div>'],
        [36.8896, 126.6457, '<div style="padding: 5px">당진시</div>'],
        [35.8241, 127.1480, '<div style="padding: 5px">전주시</div>'],
        [35.9675, 126.7368, '<div style="padding: 5px">군산시</div>'],
        [35.9482, 126.9578, '<div style="padding: 5px">익산시</div>'],
        [35.5699, 126.8560, '<div style="padding: 5px">정읍시</div>'],
        [35.4163, 127.3904, '<div style="padding: 5px">남원시</div>'],
        [35.8035, 126.8806, '<div style="padding: 5px">김제시</div>'],
        [34.8118, 126.3922, '<div style="padding: 5px">목포시</div>'],
        [34.7604, 127.6623, '<div style="padding: 5px">여수시</div>'],
        [34.9506, 127.4873, '<div style="padding: 5px">순천시</div>'],
        [35.0158, 126.7108, '<div style="padding: 5px">나주시</div>'],
        [34.9406, 127.6959, '<div style="padding: 5px">광양시</div>'],
        [36.0190, 129.3435, '<div style="padding: 5px">포항시</div>'],
        [35.8562, 129.2247, '<div style="padding: 5px">경주시</div>'],
        [36.1398, 128.1136, '<div style="padding: 5px">김천시</div>'],
        [36.5684, 128.7295, '<div style="padding: 5px">안동시</div>'],
        [36.1196, 128.3443, '<div style="padding: 5px">구미시</div>'],
        [36.8056, 128.6240, '<div style="padding: 5px">영주시</div>'],
        [35.9732, 128.9386, '<div style="padding: 5px">영천시</div>'],
        [36.4109, 128.1589, '<div style="padding: 5px">상주시</div>'],
        [36.5865, 128.1867, '<div style="padding: 5px">문경시</div>'],
        [35.8251, 128.7411, '<div style="padding: 5px">경산시</div>'],
        [35.1803, 128.1083, '<div style="padding: 5px">진주시</div>'],
        [34.8544, 128.4332, '<div style="padding: 5px">통영시</div>'],
        [35.0035, 128.0638, '<div style="padding: 5px">사천시</div>'],
        [35.2285, 128.8894, '<div style="padding: 5px">김해시</div>'],
        [35.5034, 128.7467, '<div style="padding: 5px">밀양시</div>'],
        [34.8809, 128.6218, '<div style="padding: 5px">거제시</div>'],
        [35.3349, 129.0370, '<div style="padding: 5px">양산시</div>'],
        [35.2278, 128.6818, '<div style="padding: 5px">창원시</div>'],
        [33.5042, 126.5198, '<div style="padding: 5px">제주시</div>'],
        [33.2538, 126.5596, '<div style="padding: 5px">서귀포시</div>']
    ];


    var markers = [];

    var 구_정보들 = [
        { title: '서울', rate: '8.6%', details: '살인: 0.1%,<br> 강도: 0.2%,<br> 강간/강제추행: 6.7%,<br> 절도: 25.9%,<br> 폭력: 51.6%' },
        { title: '부산', rate: '6.77%', details: '살인: 0.0%,<br> 강도: 0.0%,<br> 강간/강제추행: 8.9%,<br> 절도: 28.3%,<br> 폭력: 38.3%' },
        { title: '대구', rate: '3.37%', details: '살인: 1.0%,<br> 강도: 0.3%,<br> 강간/강제추행: 6.5%,<br> 절도: 64.5%,<br> 폭력: 28.3%' },
        { title: '인천', rate: '4.59%', details: '살인: 0.0%,<br> 강도: 0.0%,<br> 강간/강제추행: 7.1%,<br> 절도: 48.3%,<br> 폭력: 44.7%' },
        { title: '광주', rate: '4.2%', details: '살인: 0.5%,<br> 강도: 0.1%,<br> 강간/강제추행: 2.3%,<br> 절도: 53.6%,<br> 폭력: 47.6%' },
        { title: '대전', rate: '5.51%', details: '살인: 0.0%,<br> 강도: 0.0%,<br> 강간/강제추행: 7.8%,<br> 절도: 46.2%,<br> 폭력: 46.1%' },
        { title: '울산', rate: '8.6%', details: '살인: 0.1%,<br> 강도: 0.2%,<br> 강간/강제추행: 6.7%,<br> 절도: 25.9%,<br> 폭력: 51.6%' },
        { title: '세종', rate: '1.5%', details: '살인: 0.0%,<br> 강도: 0.0%,<br> 강간/강제추행: 0.9%,<br> 절도: 47.0%,<br> 폭력: 52.2%' },
        { title: '수원시', rate: '4.72%', details: '살인: 0.0%,<br> 강도: 0.6%,<br> 강간/강제추행: 5.1%,<br> 절도: 43.9%,<br> 폭력: 50.5%' },
        { title: '성남시', rate: '3.84%', details: '살인: 0.4%,<br> 강도: 0.0%,<br> 강간/강제추행: 4.2%,<br> 절도: 43.0%,<br> 폭력: 52.3%' },
        { title: '의정부시', rate: '3.42%', details: '살인: 0.0%,<br> 강도: 0.0%,<br> 강간/강제추행: 6.3%,<br> 절도: 27.1%,<br> 폭력: 54.2%' },
        { title: '안양시', rate: '4.59%', details: '살인: 0.0%,<br> 강도: 0.0%,<br> 강간/강제추행: 7.1%,<br> 절도: 48.3%,<br> 폭력: 44.7%' },
        { title: '부천시', rate: '3.37%', details: '살인: 1.0%,<br> 강도: 0.3%,<br> 강간/강제추행: 6.5%,<br> 절도: 64.5%,<br> 폭력: 28.3%' },
        { title: '광명시', rate: '4.2%', details: '살인: 0.5%,<br> 강도: 0.1%,<br> 강간/강제추행: 2.3%,<br> 절도: 53.6%,<br> 폭력: 47.6%' },
        { title: '평택시', rate: '4.97%', details: '살인: 0.3%,<br> 강도: 0.0%,<br> 강간/강제추행: 4.8%,<br> 절도: 41.3%,<br> 폭력: 44.5%' },
        { title: '동두천시', rate: '3.38%', details: '살인: 1.2%,<br> 강도: 0.0%,<br> 강간/강제추행: 3.5%,<br> 절도: 46.2%,<br> 폭력: 45.3%' },
        { title: '안산시', rate: '2.47%', details: '살인: 0.2%,<br> 강도: 0.3%,<br> 강간/강제추행: 3.4%,<br> 절도: 55.5%,<br> 폭력: 46.8%' },
        { title: '고양시', rate: '3.55%', details: '살인: 0.2%,<br> 강도: 0.0%,<br> 강간/강제추행: 5.0%,<br> 절도: 65.5%,<br> 폭력: 29.3%' },
        { title: '과천시', rate: '2.82%', details: '살인: 0.5%,<br> 강도: 0.1%,<br> 강간/강제추행: 4.2%,<br> 절도: 53.3%,<br> 폭력: 42.7%' },
        { title: '구리시', rate: '2.98%', details: '살인: 0.4%,<br> 강도: 0.3%,<br> 강간/강제추행: 5.3%,<br> 절도: 44.0%,<br> 폭력: 49.9%' },
        { title: '남양주시', rate: '1.5%', details: '살인: 0.0%,<br> 강도: 0.0%,<br> 강간/강제추행: 0.9%,<br> 절도: 47.0%,<br> 폭력: 52.2%' },
        { title: '오산시', rate: '3.18%', details: '살인: 0.1%,<br> 강도: 0.0%,<br> 강간/강제추행: 2.6%,<br> 절도: 55.4%,<br> 폭력: 41.7%' },
        { title: '시흥시', rate: '3.19%', details: '살인: 0.2%,<br> 강도: 0.5%,<br> 강간/강제추행: 5.0%,<br> 절도: 54.7%,<br> 폭력: 39.7%' },
        { title: '군포시', rate: '6.77%', details: '살인: 0.0%,<br> 강도: 0.0%,<br> 강간/강제추행: 8.9%,<br> 절도: 28.3%,<br> 폭력: 38.3%' },
        { title: '의왕시', rate: '2.82%', details: '살인: 0.5%,<br> 강도: 0.1%,<br> 강간/강제추행: 4.2%,<br> 절도: 53.3%,<br> 폭력: 42.7%' },
        { title: '하남시', rate: '5.51%', details: '살인: 0.0%,<br> 강도: 0.0%,<br> 강간/강제추행: 7.8%,<br> 절도: 46.2%,<br> 폭력: 46.1%' },
        { title: '용인시', rate: '2.98%', details: '살인: 0.4%,<br> 강도: 0.3%,<br> 강간/강제추행: 5.3%,<br> 절도: 44.0%,<br> 폭력: 49.9%' },
        { title: '파주시', rate: '6.57%', details: '살인: 0.0%,<br> 강도: 0.1%,<br> 강간/강제추행: 3.7%,<br> 절도: 38.0%,<br> 폭력: 43.8%' },
        { title: '이천시', rate: '3.6%', details: '살인: 0.0%,<br> 강도: 0.0%,<br> 강간/강제추행: 4.2%,<br> 절도: 29.0%,<br> 폭력: 66.6%' },
        { title: '안성시', rate: '4.97%', details: '살인: 0.3%,<br> 강도: 0.0%,<br> 강간/강제추행: 4.8%,<br> 절도: 41.3%,<br> 폭력: 44.5%' },
        { title: '김포시', rate: '4.7%', details: '살인: 0.0%,<br> 강도: 0.2%,<br> 강간/강제추행: 8.5%,<br> 절도: 30.3%,<br> 폭력: 55.6%' },
        { title: '화성시', rate: '3.19%', details: '살인: 0.2%,<br> 강도: 0.5%,<br> 강간/강제추행: 5.0%,<br> 절도: 54.7%,<br> 폭력: 39.7%' },
        { title: '광주시', rate: '3.61%', details: '살인: 0.0%,<br> 강도: 0.2%,<br> 강간/강제추행: 2.9%,<br> 절도: 51.0%,<br> 폭력: 45.9%' },
        { title: '양주시', rate: '2.28%', details: '살인: 0.0%,<br> 강도: 0.0%,<br> 강간/강제추행: 0.0%,<br> 절도: 56.7%,<br> 폭력: 49.3%' },
        { title: '포천시', rate: '4.7%', details: '살인: 0.0%,<br> 강도: 0.2%,<br> 강간/강제추행: 8.5%,<br> 절도: 30.3%,<br> 폭력: 55.6%' },
        { title: '여주시', rate: '3.87%', details: '살인: 0.0%,<br> 강도: 0.6%,<br> 강간/강제추행: 2.6%,<br> 절도: 34.1%,<br> 폭력: 51.1%' },
        { title: '춘천시', rate: '8.6%', details: '살인: 0.1%,<br> 강도: 0.2%,<br> 강간/강제추행: 6.7%,<br> 절도: 25.9%,<br> 폭력: 51.6%' },
        { title: '원주시', rate: '3.55%', details: '살인: 0.2%,<br> 강도: 0.0%,<br> 강간/강제추행: 5.0%,<br> 절도: 65.5%,<br> 폭력: 29.3%' },
        { title: '강릉시', rate: '3.84%', details: '살인: 0.4%,<br> 강도: 0.0%,<br> 강간/강제추행: 4.2%,<br> 절도: 43.0%,<br> 폭력: 52.3%' },
        { title: '동해시', rate: '3.42%', details: '살인: 0.0%,<br> 강도: 0.0%,<br> 강간/강제추행: 6.3%,<br> 절도: 27.1%,<br> 폭력: 54.2%' },
        { title: '태백시', rate: '4.59%', details: '살인: 0.0%,<br> 강도: 0.0%,<br> 강간/강제추행: 7.1%,<br> 절도: 48.3%,<br> 폭력: 44.7%' },
        { title: '속초시', rate: '3.37%', details: '살인: 1.0%,<br> 강도: 0.3%,<br> 강간/강제추행: 6.5%,<br> 절도: 64.5%,<br> 폭력: 28.3%' },
        { title: '삼척시', rate: '4.2%', details: '살인: 0.5%,<br> 강도: 0.1%,<br> 강간/강제추행: 2.3%,<br> 절도: 53.6%,<br> 폭력: 47.6%' },
        { title: '충주시', rate: '3.38%', details: '살인: 1.2%,<br> 강도: 0.0%,<br> 강간/강제추행: 3.5%,<br> 절도: 46.2%,<br> 폭력: 45.3%' },
        { title: '제천시', rate: '3.18%', details: '살인: 0.1%,<br> 강도: 0.0%,<br> 강간/강제추행: 2.6%,<br> 절도: 55.4%,<br> 폭력: 41.7%' },
        { title: '청주시', rate: '2.47%', details: '살인: 0.2%,<br> 강도: 0.3%,<br> 강간/강제추행: 3.4%,<br> 절도: 55.5%,<br> 폭력: 46.8%' },
        { title: '천안시', rate: '3.38%', details: '살인: 1.2%,<br> 강도: 0.0%,<br> 강간/강제추행: 3.5%,<br> 절도: 46.2%,<br> 폭력: 45.3%' },
        { title: '공주시', rate: '2.47%', details: '살인: 0.2%,<br> 강도: 0.3%,<br> 강간/강제추행: 3.4%,<br> 절도: 55.5%,<br> 폭력: 46.8%' },
        { title: '보령시', rate: '3.55%', details: '살인: 0.2%,<br> 강도: 0.0%,<br> 강간/강제추행: 5.0%,<br> 절도: 65.5%,<br> 폭력: 29.3%' },
        { title: '아산시', rate: '4.72%', details: '살인: 0.0%,<br> 강도: 0.6%,<br> 강간/강제추행: 5.1%,<br> 절도: 43.9%,<br> 폭력: 50.5%' },
        { title: '서산시', rate: '1.5%', details: '살인: 0.0%,<br> 강도: 0.0%,<br> 강간/강제추행: 0.9%,<br> 절도: 47.0%,<br> 폭력: 52.2%' },
        { title: '논산시', rate: '1.5%', details: '살인: 0.0%,<br> 강도: 0.0%,<br> 강간/강제추행: 0.9%,<br> 절도: 47.0%,<br> 폭력: 52.2%' },
        { title: '계룡시', rate: '3.18%', details: '살인: 0.1%,<br> 강도: 0.0%,<br> 강간/강제추행: 2.6%,<br> 절도: 55.4%,<br> 폭력: 41.7%' },
        { title: '당진시', rate: '3.42%', details: '살인: 0.0%,<br> 강도: 0.0%,<br> 강간/강제추행: 6.3%,<br> 절도: 27.1%,<br> 폭력: 54.2%' },
        { title: '전주시', rate: '3.19%', details: '살인: 0.2%,<br> 강도: 0.5%,<br> 강간/강제추행: 5.0%,<br> 절도: 54.7%,<br> 폭력: 39.7%' },
        { title: '군산시', rate: '6.77%', details: '살인: 0.0%,<br> 강도: 0.0%,<br> 강간/강제추행: 8.9%,<br> 절도: 28.3%,<br> 폭력: 38.3%' },
        { title: '익산시', rate: '2.82%', details: '살인: 0.5%,<br> 강도: 0.1%,<br> 강간/강제추행: 4.2%,<br> 절도: 53.3%,<br> 폭력: 42.7%' },
        { title: '정읍시', rate: '5.51%', details: '살인: 0.0%,<br> 강도: 0.0%,<br> 강간/강제추행: 7.8%,<br> 절도: 46.2%,<br> 폭력: 46.1%' },
        { title: '남원시', rate: '2.98%', details: '살인: 0.4%,<br> 강도: 0.3%,<br> 강간/강제추행: 5.3%,<br> 절도: 44.0%,<br> 폭력: 49.9%' },
        { title: '김제시', rate: '6.57%', details: '살인: 0.0%,<br> 강도: 0.1%,<br> 강간/강제추행: 3.7%,<br> 절도: 38.0%,<br> 폭력: 43.8%' },
        { title: '목포시', rate: '3.6%', details: '살인: 0.0%,<br> 강도: 0.0%,<br> 강간/강제추행: 4.2%,<br> 절도: 29.0%,<br> 폭력: 66.6%' },
        { title: '여수시', rate: '4.97%', details: '살인: 0.3%,<br> 강도: 0.0%,<br> 강간/강제추행: 4.8%,<br> 절도: 41.3%,<br> 폭력: 44.5%' },
        { title: '순천시', rate: '4.7%', details: '살인: 0.0%,<br> 강도: 0.2%,<br> 강간/강제추행: 8.5%,<br> 절도: 30.3%,<br> 폭력: 55.6%' },
        { title: '나주시', rate: '3.87%', details: '살인: 0.0%,<br> 강도: 0.6%,<br> 강간/강제추행: 2.6%,<br> 절도: 34.1%,<br> 폭력: 51.1%' },
        { title: '광양시', rate: '3.61%', details: '살인: 0.0%,<br> 강도: 0.2%,<br> 강간/강제추행: 2.9%,<br> 절도: 51.0%,<br> 폭력: 45.9%' },
        { title: '포항시', rate: '2.28%', details: '살인: 0.0%,<br> 강도: 0.0%,<br> 강간/강제추행: 0.0%,<br> 절도: 56.7%,<br> 폭력: 49.3%' },
        { title: '경주시', rate: '3.61%', details: '살인: 0.0%,<br> 강도: 0.2%,<br> 강간/강제추행: 2.9%,<br> 절도: 51.0%,<br> 폭력: 45.9%' },
        { title: '김천시', rate: '3.87%', details: '살인: 0.0%,<br> 강도: 0.6%,<br> 강간/강제추행: 2.6%,<br> 절도: 34.1%,<br> 폭력: 51.1%' },
        { title: '안동시', rate: '3.6%', details: '살인: 0.0%,<br> 강도: 0.0%,<br> 강간/강제추행: 4.2%,<br> 절도: 29.0%,<br> 폭력: 66.6%' },
        { title: '구미시', rate: '4.72%', details: '살인: 0.0%,<br> 강도: 0.6%,<br> 강간/강제추행: 5.1%,<br> 절도: 43.9%,<br> 폭력: 50.5%' },
        { title: '영주시', rate: '6.77%', details: '살인: 0.0%,<br> 강도: 0.0%,<br> 강간/강제추행: 8.9%,<br> 절도: 28.3%,<br> 폭력: 38.3%' },
        { title: '영천시', rate: '2.29%', details: '살인: 0.1%,<br> 강도: 0.6%,<br> 강간/강제추행: 15.4%,<br> 절도: 46.7%,<br> 폭력: 36.0%' },
        { title: '상주시', rate: '2.82%', details: '살인: 0.5%,<br> 강도: 0.1%,<br> 강간/강제추행: 4.2%,<br> 절도: 53.3%,<br> 폭력: 42.7%' },
        { title: '문경시', rate: '5.51%', details: '살인: 0.0%,<br> 강도: 0.0%,<br> 강간/강제추행: 7.8%,<br> 절도: 46.2%,<br> 폭력: 46.1%' },
        { title: '경산시', rate: '2.98%', details: '살인: 0.4%,<br> 강도: 0.3%,<br> 강간/강제추행: 5.3%,<br> 절도: 44.0%,<br> 폭력: 49.9%' },
        { title: '진주시', rate: '2.28%', details: '살인: 0.0%,<br> 강도: 0.0%,<br> 강간/강제추행: 0.0%,<br> 절도: 56.7%,<br> 폭력: 49.3%' },
        { title: '통영시', rate: '6.57%', details: '살인: 0.0%,<br> 강도: 0.1%,<br> 강간/강제추행: 3.7%,<br> 절도: 38.0%,<br> 폭력: 43.8%' },
        { title: '사천시', rate: '3.6%', details: '살인: 0.0%,<br> 강도: 0.0%,<br> 강간/강제추행: 4.2%,<br> 절도: 29.0%,<br> 폭력: 66.6%' },
        { title: '김해시', rate: '3.87%', details: '살인: 0.0%,<br> 강도: 0.6%,<br> 강간/강제추행: 2.6%,<br> 절도: 34.1%,<br> 폭력: 51.1%' },
        { title: '밀양시', rate: '4.97%', details: '살인: 0.3%,<br> 강도: 0.0%,<br> 강간/강제추행: 4.8%,<br> 절도: 41.3%,<br> 폭력: 44.5%' },
        { title: '거제시', rate: '4.7%', details: '살인: 0.0%,<br> 강도: 0.2%,<br> 강간/강제추행: 8.5%,<br> 절도: 30.3%,<br> 폭력: 55.6%' },
        { title: '양산시', rate: '3.61%', details: '살인: 0.0%,<br> 강도: 0.2%,<br> 강간/강제추행: 2.9%,<br> 절도: 51.0%,<br> 폭력: 45.9%' },
        { title: '창원시', rate: '2.28%', details: '살인: 0.0%,<br> 강도: 0.0%,<br> 강간/강제추행: 0.0%,<br> 절도: 56.7%,<br> 폭력: 49.3%' },
        { title: '제주시', rate: '6.57%', details: '살인: 0.0%,<br> 강도: 0.1%,<br> 강간/강제추행: 3.7%,<br> 절도: 38.0%,<br> 폭력: 43.8%' },
        { title: '서귀포시', rate: '3.84%', details: '살인: 0.4%,<br> 강도: 0.0%,<br> 강간/강제추행: 4.2%,<br> 절도: 43.0%,<br> 폭력: 52.3%' }
    ];

    for (var i = 0; i < 데이터.length; i++) {
        var marker = new kakao.maps.Marker({
            position: new kakao.maps.LatLng(데이터[i][0], 데이터[i][1]),
            map: map
        });

        var infowindow = new kakao.maps.InfoWindow({
            content: 데이터[i][2]
        });

        markers.push(marker);

        kakao.maps.event.addListener(marker, 'mouseover', makeOverListener(map, marker, infowindow));
        kakao.maps.event.addListener(marker, 'mouseout', makeOutListener(infowindow));

        addClickEvent(marker, 구_정보들[i]);
    }

    clusterer.addMarkers(markers);

    function makeOverListener(map, marker, infowindow) {
        return function () {
            infowindow.open(map, marker);
        };
    }

    function makeOutListener(infowindow) {
        return function () {
            infowindow.close();
        };
    }
}


// 페이지 로드 시 뉴스 표시
window.onload = function () {
    displayNews();
    bringModalToFront(); // 기존 로직 추가
    initializeMap(); // 지도 초기화 함수 호출
    updateFavoritesList(); //즐겨찾기
};




