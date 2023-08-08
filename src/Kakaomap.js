import React, { useEffect } from 'react';
const { kakao } = window;

function Kakaomap() {
    // 지도 표시할 div 요소 가져오기
    useEffect(() => {
        const container = document.getElementById('map');
        const options = {
            center: new kakao.maps.LatLng(37.5665, 126.9780),
			level: 8
        };
        //지도 생성
        const map = new kakao.maps.Map(container, options);

        // 내 위치 표시 함수
        function displayMyLocation() {
            if (navigator.geolocation) {
                // 위치 정보 사용 권한 요청
                navigator.geolocation.getCurrentPosition(function(position) {
                    var latitude = position.coords.latitude;
                    var longitude = position.coords.longitude;
                    var locPosition = new kakao.maps.LatLng(latitude, longitude);
                    
                    // 지도 중심 좌표 및 마커 설정
                    map.setCenter(locPosition);
                    var marker = new kakao.maps.Marker({
                        position: locPosition,
                        map: map
                    });
                });
            } else {
                alert('위치 정보 사용이 불가능합니다.');
            }
        }

        // 내 위치 표시 실행
        displayMyLocation();
    }, [])

    return (
        <div id="map" style={{
            width: '1250px',
            height: '600px'
        }}></div>
    );
}

export default Kakaomap;