function addClickEvent(marker, info) {
    kakao.maps.event.addListener(marker, 'click', function () {
        showModalAndInfo(info);
    });
}

function showModalAndInfo(info) {
    showModal();
    updateModalContent(info);
}

function updateModalContent(info) {
    var modalContent = document.getElementById("modalContent");
    var isFavorited = checkIfFavorited(info.title);
    var starClass = isFavorited ? 'favorite-icon favorited' : 'favorite-icon';
    modalContent.innerHTML = `
        <div class="favorite-container">
            <div class="${starClass}" id="favoriteIcon" onclick="toggleFavorite('${info.title}', this)">★</div>
        </div>
        <h1>${info.title} 범죄율</h1>
        <h1 style="font-size: 50px;">"${info.rate}"</h1><br>
        <h3>${info.details}</h3>
    `;
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
function checkIfFavorited(title) {
    var favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    return favorites.includes(title);
}

function toggleFavorite(title, element) {
    var favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    var index = favorites.indexOf(title);
    
    if (index > -1) {
        favorites.splice(index, 1);
        element.classList.remove('favorited');
    } else {
        favorites.push(title);
        element.classList.add('favorited');
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavoritesList();
}

function updateFavoritesList() {
    var favoritesList = document.getElementById('favoritesList');
    var favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
    favoritesList.innerHTML = '';
    favorites.forEach(function (title) {
        var listItem = document.createElement('li');
        listItem.textContent = title;
        favoritesList.appendChild(listItem);
    });
}


// 페이지 로드 시 뉴스 표시
window.onload = function () {
    displayNews();
    bringModalToFront(); // 기존 로직 추가
    initializeMap(); // 지도 초기화 함수 호출
    updateFavoritesList(); //즐겨찾기
};

// 지도 초기화 함수
function initializeMap() {
    var mapContainer = document.getElementById('map');
    var mapOption = {
        center: new kakao.maps.LatLng(37.57346, 126.9790),
        level: 8,
        mapTypeId: kakao.maps.MapTypeId.ROADMAP
    };

    var map = new kakao.maps.Map(mapContainer, mapOption);

    var clusterer = new kakao.maps.MarkerClusterer({
        map: map,
        averageCenter: true,
        minLevel: 10
    });

    var 데이터 = [
        [37.51757, 127.0474, '<div style="padding: 5px">강남구</div>'],
        [37.53020, 127.1237, '<div style="padding: 5px">강동구</div>'],
        [37.63990, 127.0255, '<div style="padding: 5px">강북구</div>'],
        [37.55115, 126.8484, '<div style="padding: 5px">강서구</div>'],
        [37.47819, 126.9515, '<div style="padding: 5px">관악구</div>'],
        [37.53855, 127.0822, '<div style="padding: 5px">광진구</div>'],
        [37.49562, 126.8878, '<div style="padding: 5px">구로구</div>'],
        [37.46211, 126.9003, '<div style="padding: 5px">금천구</div>'],
        [37.65425, 127.0566, '<div style="padding: 5px">노원구</div>'],
        [37.66891, 127.0470, '<div style="padding: 5px">도봉구</div>'],
        [37.57433, 127.0398, '<div style="padding: 5px">동대문구</div>'],
        [37.51256, 126.9401, '<div style="padding: 5px">동작구</div>'],
        [37.56622, 126.9015, '<div style="padding: 5px">마포구</div>'],
        [37.57941, 126.9365, '<div style="padding: 5px">서대문구</div>'],
        [37.48368, 127.0327, '<div style="padding: 5px">서초구</div>'],
        [37.56355, 127.0369, '<div style="padding: 5px">성동구</div>'],
        [37.58937, 127.0167, '<div style="padding: 5px">성북구</div>'],
        [37.51451, 127.1059, '<div style="padding: 5px">송파구</div>'],
        [37.51699, 126.8666, '<div style="padding: 5px">양천구</div>'],
        [37.52631, 126.8963, '<div style="padding: 5px">영등포구</div>'],
        [37.53239, 126.9907, '<div style="padding: 5px">용산구</div>'],
        [37.60275, 126.9293, '<div style="padding: 5px">은평구</div>'],
        [37.57346, 126.9790, '<div style="padding: 5px">종로구</div>'],
        [37.56387, 126.9976, '<div style="padding: 5px">중구</div>'],
        [37.60632, 127.0932, '<div style="padding: 5px">중랑구</div>']
    ];

    var markers = [];

    var 구_정보들 = [
        { title: '강남구', rate: '8.6%', details: '살인: 0.1%,<br> 강도: 0.2%,<br> 강간/강제추행: 6.7%,<br> 절도: 25.9%,<br> 폭력: 51.6%' },
        { title: '강동구', rate: '3.84%', details: '살인: 0.4%,<br> 강도: 0.0%,<br> 강간/강제추행: 4.2%,<br> 절도: 43.0%,<br> 폭력: 52.3%' },
        { title: '강북구', rate: '3.42%', details: '살인: -0.2%,<br> 강도: -0.1%,<br> 강간/강제추행: 6.3%,<br> 절도: 27.1%,<br> 폭력: 54.2%' },
        { title: '강서구', rate: '4.59%', details: '살인: 0.0%,<br> 강도: -0.5%,<br> 강간/강제추행: 7.1%,<br> 절도: 48.3%,<br> 폭력: 44.7%' },
        { title: '관악구', rate: '3.37%', details: '살인: 1.0%,<br> 강도: 0.3%,<br> 강간/강제추행: 6.5%,<br> 절도: 64.5%,<br> 폭력: 28.3%' },
        { title: '광진구', rate: '4.2%', details: '살인: 0.5%,<br> 강도: 0.1%,<br> 강간/강제추행: 2.3%,<br> 절도: 53.6%,<br> 폭력: 47.6%' },
        { title: '구로구', rate: '3.38%', details: '살인: 1.2%,<br> 강도: -0.1%,<br> 강간/강제추행: 3.5%,<br> 절도: 46.2%,<br> 폭력: 45.3%' },
        { title: '금천구', rate: '2.47%', details: '살인: 0.2%,<br> 강도: 0.3%,<br> 강간/강제추행: 3.4%,<br> 절도: 55.5%,<br> 폭력: 46.8%' },
        { title: '노원구', rate: '3.55%', details: '살인: 0.2%,<br> 강도: 0.0%,<br> 강간/강제추행: 5.0%,<br> 절도: 65.5%,<br> 폭력: 29.3%' },
        { title: '도봉구', rate: '4.72%', details: '살인: 0.0%,<br> 강도: 0.6%,<br> 강간/강제추행: 5.1%,<br> 절도: 43.9%,<br> 폭력: 50.5%' },
        { title: '동대문구', rate: '1.5%', details: '살인: -0.3%,<br> 강도: -0.3%,<br> 강간/강제추행: 0.9%,<br> 절도: 47.0%,<br> 폭력: 52.2%' },
        { title: '동작구', rate: '3.18%', details: '살인: 0.1%,<br> 강도: 0.0%,<br> 강간/강제추행: 2.6%,<br> 절도: 55.4%,<br> 폭력: 41.7%' },
        { title: '마포구', rate: '3.19%', details: '살인: 0.2%,<br> 강도: 0.5%,<br> 강간/강제추행: 5.0%,<br> 절도: 54.7%,<br> 폭력: 39.7%' },
        { title: '서대문구', rate: '6.77%', details: '살인: -0.1%,<br> 강도: 0.0%,<br> 강간/강제추행: 8.9%,<br> 절도: 28.3%,<br> 폭력: 38.3%' },
        { title: '서초구', rate: '2.82%', details: '살인: 0.5%,<br> 강도: 0.1%,<br> 강간/강제추행: 4.2%,<br> 절도: 53.3%,<br> 폭력: 42.7%' },
        { title: '성동구', rate: '5.51%', details: '살인: -0.2%,<br> 강도: 0.0%,<br> 강간/강제추행: 7.8%,<br> 절도: 46.2%,<br> 폭력: 46.1%' },
        { title: '성북구', rate: '2.98%', details: '살인: 0.4%,<br> 강도: 0.3%,<br> 강간/강제추행: 5.3%,<br> 절도: 44.0%,<br> 폭력: 49.9%' },
        { title: '송파구', rate: '6.57%', details: '살인: 0.0%,<br> 강도: 0.1%,<br> 강간/강제추행: 3.7%,<br> 절도: 38.0%,<br> 폭력: 43.8%' },
        { title: '양천구', rate: '3.6%', details: '살인: -0.1%,<br> 강도: 0.0%,<br> 강간/강제추행: 4.2%,<br> 절도: 29.0%,<br> 폭력: 66.6%' },
        { title: '영등포구', rate: '4.97%', details: '살인: 0.3%,<br> 강도: 0.0%,<br> 강간/강제추행: 4.8%,<br> 절도: 41.3%,<br> 폭력: 44.5%' },
        { title: '용산구', rate: '4.7%', details: '살인: 0.0%,<br> 강도: 0.2%,<br> 강간/강제추행: 8.5%,<br> 절도: 30.3%,<br> 폭력: 55.6%' },
        { title: '은평구', rate: '3.61%', details: '살인: 0.0%,<br> 강도: 0.2%,<br> 강간/강제추행: 2.9%,<br> 절도: 51.0%,<br> 폭력: 45.9%' },
        { title: '종로구', rate: '2.28%', details: '살인: -0.5%,<br> 강도: -0.3%,<br> 강간/강제추행: -5.4%,<br> 절도: 56.7%,<br> 폭력: 49.3%' },
        { title: '중구', rate: '3.87%', details: '살인: 0.0%,<br> 강도: 0.6%,<br> 강간/강제추행: 2.6%,<br> 절도: 34.1%,<br> 폭력: 51.1%' },
        { title: '중랑구', rate: '2.29%', details: '살인: 0.1%,<br> 강도: 0.6%,<br> 강간/강제추행: 15.4%,<br> 절도: 46.7%,<br> 폭력: 36.0%' }
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