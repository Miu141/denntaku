document.addEventListener('DOMContentLoaded', () => {
    const num1Input = document.getElementById('num1');
    const num2Input = document.getElementById('num2');
    const operationSelect = document.getElementById('operation');
    const calculateBtn = document.getElementById('calculate-btn');
    const resultElement = document.getElementById('result');
    const resultContainer = document.getElementById('result-container');
    
    // 計算ボタンのイベントリスナー
    calculateBtn.addEventListener('click', () => {
        // 入力値を取得
        const num1 = num1Input.value.trim();
        const num2 = num2Input.value.trim();
        const operator = operationSelect.value;
        
        // 入力値の検証
        if (!num1 || !num2) {
            showError('両方の数値を入力してください');
            return;
        }
        
        // サーバーに計算リクエストを送信
        fetch('/calculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ num1, num2, operator })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // 成功の場合は結果を表示
                resultElement.textContent = data.expression;
                resultContainer.classList.remove('error');
            } else {
                // エラーの場合はエラーメッセージを表示
                showError(data.message);
            }
        })
        .catch(error => {
            showError('通信エラーが発生しました');
            console.error('Error:', error);
        });
    });
    
    // Enterキーで計算を実行
    [num1Input, num2Input].forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                calculateBtn.click();
            }
        });
    });
    
    // エラーメッセージを表示する関数
    function showError(message) {
        resultElement.textContent = message;
        resultContainer.classList.add('error');
    }
}); 