document.addEventListener('DOMContentLoaded', function () {
    // CSV 파일 경로
    const csvFilePath = 'http://localhost:3000/four.csv';

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
                const targetCellData = parseCSV(data, 1, 2);

                // 표시할 요소 가져오기
                const csvDataElement = document.getElementById('csvData');

                // 데이터 표시
                csvDataElement.textContent = targetCellData;
            })
            .catch(error => console.error('Error fetching CSV:', error));
    }

    // CSV 데이터를 특정 행과 열의 데이터로 변환하는 함수
    function parseCSV(csv, targetRow, targetColumn) {
        const lines = csv.split('\n');
        const headers = lines[0].split(',');

        // 특정 행의 데이터만 가져오기
        const targetRowData = lines[targetRow].split(',');

        // 특정 열의 데이터 가져오기
        const targetCellData = targetRowData[targetColumn];

        return targetCellData;
    }

    // CSV 파일 불러오기 실행
    loadCSV();
});
