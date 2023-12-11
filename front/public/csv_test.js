document.addEventListener('DOMContentLoaded', function () {
    // CSV 파일 경로
    const csvFilePath = 'http://localhost:3000/crime_rate.csv';

    // CSV 파일을 불러와서 표시하는 함수
    function loadCSV() {
        fetch(csvFilePath, {
            headers: {
                'Accept-Charset': 'utf-8'
            }
        })
            .then(response => response.text())
            .then(data => {
                // CSV 데이터 파싱
                const tableHTML = parseCSV(data);

                // 표시할 요소 가져오기
                const csvTableElement = document.getElementById('csvTable');

                // 데이터 표시
                csvTableElement.innerHTML = tableHTML;
            })
            .catch(error => console.error('Error fetching CSV:', error));
    }

    // CSV 데이터를 HTML 테이블로 변환하는 함수
    function parseCSV(csv) {
        const lines = csv.split('\n');
        const headers = lines[0].split(',');

        // HTML 테이블 시작
        let tableHTML = '<tr>';
        headers.forEach(header => {
            tableHTML += `<th>${header}</th>`;
        });
        tableHTML += '</tr>';

        // 각 행 데이터 추가
        for (let i = 1; i < lines.length; i++) {
            const rowData = lines[i].split(',');
            tableHTML += '<tr>';
            rowData.forEach(cell => {
                tableHTML += `<td>${cell}</td>`;
            });
            tableHTML += '</tr>';
        }

        // HTML 테이블 종료
        return tableHTML;
    }

    // CSV 파일 불러오기 실행
    loadCSV();
});
