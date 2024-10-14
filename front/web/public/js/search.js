// Kakao 지도 객체와 마커 배열 선언 (mapInit.js와 공유되어야 함)
let map; // mapInit.js에서 이미 정의한 map 객체를 가져옵니다.
let markers = []; // 기존 마커 목록

// 검색 기능 활성화 함수
function searchPlaces() {
    const keyword = document.getElementById('keyword').value.trim();

    if (!keyword) {
        alert('지역 이름을 입력해주세요!');
        return;
    }

    // 키워드를 기반으로 장소 검색
    const ps = new kakao.maps.services.Places();
    ps.keywordSearch(keyword, placesSearchCB); // 콜백 함수로 연결합니다.
}

// 장소 검색 콜백 함수
function placesSearchCB(data, status, pagination) {
    if (status === kakao.maps.services.Status.OK) {
        // 검색 결과로 첫 번째 장소를 선택하여 해당 위치로 지도를 이동하고 마커를 확대합니다.
        const place = data[0];
        const position = new kakao.maps.LatLng(place.y, place.x);

        // 지도를 해당 위치로 이동 및 확대
        map.setLevel(5); // 확대 수준 설정
        map.setCenter(position);

        // 해당 위치에 마커 추가
        clearMarkers();
        const marker = new kakao.maps.Marker({
            map: map,
            position: position
        });
        markers.push(marker);
        
        // 해당 마커에 클릭 이벤트 추가
        kakao.maps.event.addListener(marker, 'click', function () {
            showWeatherSelection({ title: place.place_name, details: '' });
        });
    } else {
        alert('검색 결과가 없습니다.');
    }
}

// 검색 버튼 클릭 시 호출될 함수
function searchLocation() {
    const query = document.getElementById('keyword').value.trim();
    if (!query) {
        alert('주소 또는 장소명을 입력하세요.');
        return;
    }

    // Geocoder 인스턴스 생성 및 검색
    const geocoder = new kakao.maps.services.Geocoder();
    geocoder.addressSearch(query, function(result, status) {
        if (status === kakao.maps.services.Status.OK) {
            const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
            map.setCenter(coords);
            map.setLevel(5); // 지도 확대 레벨 설정
        } else {
            alert('검색 결과가 없습니다.');
        }
    });
}

// 기존 마커 초기화 함수
function clearMarkers() {
    for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = [];
}

// DOMContentLoaded 이벤트 이후에 검색 기능을 초기화
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('searchForm').addEventListener('submit', function (e) {
        e.preventDefault(); // 폼 제출 기본 동작을 막음
        searchPlaces(); // 검색 기능 실행
    });
    initializeMap(); // 지도 초기화
});
