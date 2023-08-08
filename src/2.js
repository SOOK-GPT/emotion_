import React, { useEffect } from 'react';
import $ from 'jquery';

const { kakao } = window;

function Page2() {
    
    //지도 표시 위한 설정
    useEffect(() => {
        var container = document.getElementById('map');
        var options = {
            center: new kakao.maps.LatLng(37.5665, 126.9780),
			level: 13
        };
        //지도 생성
        var map = new kakao.maps.Map(container, options);

        var clusterer = new kakao.maps.MarkerClusterer({
            map: map, 
            averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
            minLevel: 10, // 클러스터 할 최소 지도 레벨
            disableClickZoom: true // 클러스터 마커를 클릭했을 때 지도가 확대되지 않도록 설정한다
        });

        // 사회복지기관(노인복지기관) 데이터 불러와서 마커와 인포윈도우 표시
        $.getJSON('/data_.json', function(data) {
            var markers = $(data.markers).map(function(i, markerInfo) {
                var marker = new kakao.maps.Marker({
                    position: new kakao.maps.LatLng(markerInfo.Latitude, markerInfo.Longitude)
                });

                var infowindow = new kakao.maps.InfoWindow({
                    content: markerInfo.name
                });

                // 마우스 오버/아웃 시 인포윈도우 표시 설정
                kakao.maps.event.addListener(marker, 'mouseover', makeOverListener(map, marker, infowindow));
                kakao.maps.event.addListener(marker, 'mouseout', makeOutListener(infowindow));

                return marker;
            
            });

            // 클러스터에 데이터 기반 마커 등록
            clusterer.addMarkers(markers);
        });

        function makeOverListener(map, marker, infowindow) {
            return function() {
                infowindow.open(map, marker);
            };
        }

        function makeOutListener(infowindow) {
            return function() {
                infowindow.close();
            };
        }

        // 마커 클러스터에 이벤트 등록하기
        kakao.maps.event.addListener(clusterer, 'clusterclick', function(cluster) {

            // 클러스터 클릭 시 현재 지도 레벨에서 1레벨 확대
            var level = map.getLevel()-1;
            map.setLevel(level, {anchor: cluster.getCenter()});
        });
    }, [])

    return (
        <div id="map" style={{
            width: '1250px',
            height: '600px',
            margin: '0 auto'
        }}></div>
    );
}

export default Page2;