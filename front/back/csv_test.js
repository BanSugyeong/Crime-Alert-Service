document.addEventListener('DOMContentLoaded', function () {

    // CSV 파일 경로
    const csvFilePath = 'http://localhost:3000/gangnam_all_predict.csv';

    // CSV 파일을 불러와서 표시하는 함수
    function loadCSV() {
        fetch(csvFilePath)
            .then(response => response.text())
            .then(data => {
                // CSV 데이터 파싱
                const parsedData = parseCSV(data);

                // 표시할 요소 가져오기
                const csvDataElement = document.getElementById('csvData');

                // HTML 생성 및 표시
                const htmlContent = createHTML(parsedData);
                csvDataElement.innerHTML = htmlContent;
            })
            .catch(error => console.error('Error fetching CSV:', error));
    }

    // CSV 데이터를 HTML로 변환하는 함수
    function createHTML(data) {
        let htmlContent = '<table>';
        
        // 헤더 행 생성
        htmlContent += '<tr>';
        Object.keys(data[0]).forEach(header => {
            htmlContent += `<th>${header}</th>`;
        });
        htmlContent += '</tr>';

        // 데이터 행 생성
        data.forEach(entry => {
            htmlContent += '<tr>';
            Object.values(entry).forEach(value => {
                htmlContent += `<td>${value}</td>`;
            });
            htmlContent += '</tr>';
        });

        htmlContent += '</table>';
        return htmlContent;
    }

    // CSV 데이터를 파싱하는 함수
    function parseCSV(csv) {
        const lines = csv.split('\n');
        const headers = lines[0].split(',');

        const data = [];
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',');
            const entry = {};
            for (let j = 0; j < headers.length; j++) {
                entry[headers[j]] = values[j];
            }
            data.push(entry);
        }

        return data;
    }

    // 테이블을 생성하는 함수
    function createTable(data) {
        const table = document.createElement('table');
        const headerRow = table.insertRow(0);

        // 헤더 행 생성
        Object.keys(data[0]).forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });

        // 데이터 행 생성
        data.forEach(entry => {
            const row = table.insertRow();
            Object.values(entry).forEach(value => {
                const cell = row.insertCell();
                cell.textContent = value;
            });
        });

        return table;
    }

    // CSV 파일 불러오기 실행
    loadCSV();
});
