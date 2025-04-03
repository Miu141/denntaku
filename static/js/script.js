document.addEventListener('DOMContentLoaded', () => {
    // DOM要素の取得
    const display = document.getElementById('display');
    const history = document.getElementById('history');
    const buttons = document.querySelectorAll('.button');
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');
    
    // 変数初期化
    let currentInput = '0';
    let previousInput = '';
    let calculationOperator = '';
    let shouldResetDisplay = false;
    let decimalAdded = false;
    
    // ボタンクリックのイベントリスナーを追加
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            // クリックアニメーション
            button.classList.add('clicked');
            setTimeout(() => {
                button.classList.remove('clicked');
            }, 200);
            
            // ボタン音を再生
            playButtonSound();
            
            if (button.classList.contains('number')) {
                inputNumber(button.getAttribute('data-num'));
            } else if (button.classList.contains('operator')) {
                inputOperator(button.getAttribute('data-action'));
            } else if (button.classList.contains('function')) {
                executeFunctionKey(button.getAttribute('data-action'));
            } else if (button.classList.contains('equals')) {
                calculateResult();
            }
            
            updateDisplay();
        });
    });
    
    // キーボード入力イベントを追加
    document.addEventListener('keydown', handleKeyboardInput);
    
    // 数字ボタンの処理
    function inputNumber(num) {
        if (currentInput === '0' && num !== '.' || shouldResetDisplay) {
            currentInput = '';
            shouldResetDisplay = false;
        }
        
        // 小数点の重複チェック
        if (num === '.' && (decimalAdded || currentInput === '')) {
            if (currentInput === '') {
                currentInput = '0';
            }
            if (decimalAdded) {
                return;
            }
        }
        
        if (num === '.') {
            decimalAdded = true;
        }
        
        // 入力値の長さ制限（桁数制限）
        if (currentInput.length < 12) {
            currentInput += num;
        } else {
            showNotification('最大入力桁数に達しました');
        }
        
        animateDisplay();
    }
    
    // 演算子ボタンの処理
    function inputOperator(operator) {
        const operatorSymbols = {
            'add': '+',
            'subtract': '−',
            'multiply': '×',
            'divide': '÷'
        };
        
        // 直前の演算結果がある場合はそれを使用
        if (previousInput !== '') {
            calculateResult(false);
        }
        
        calculationOperator = operatorSymbols[operator];
        previousInput = currentInput;
        history.textContent = previousInput + ' ' + calculationOperator;
        shouldResetDisplay = true;
        decimalAdded = false;
    }
    
    // ファンクションキーの処理
    function executeFunctionKey(action) {
        switch(action) {
            case 'clear':
                clearCalculator();
                break;
            case 'toggle':
                toggleSign();
                break;
            case 'percent':
                calculatePercent();
                break;
        }
    }
    
    // 計算結果の取得
    function calculateResult(updateHistory = true) {
        if (previousInput === '' || calculationOperator === '') {
            return;
        }
        
        let result;
        const num1 = parseFloat(previousInput);
        const num2 = parseFloat(currentInput);
        
        // サーバーサイドで計算処理
        fetch('/calculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                num1: num1,
                num2: num2,
                operator: convertOperator(calculationOperator)
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // 成功の場合
                result = data.result;
                
                // 結果の表示
                if (updateHistory) {
                    history.textContent = `${num1} ${calculationOperator} ${num2} =`;
                } else {
                    history.textContent = '';
                }
                
                currentInput = result.toString();
                limitDisplayLength();
                decimalAdded = currentInput.includes('.');
                previousInput = '';
                calculationOperator = '';
                updateDisplay();
                animateDisplay();
            } else {
                // エラーの場合
                showCalculationError(data.message);
            }
        })
        .catch(error => {
            showCalculationError('通信エラーが発生しました');
            console.error('Error:', error);
        });
    }
    
    // 計算に使う演算子変換（UI表示用から処理用へ）
    function convertOperator(uiOperator) {
        const operatorMap = {
            '+': '+',
            '−': '-',
            '×': '*',
            '÷': '/'
        };
        return operatorMap[uiOperator] || uiOperator;
    }
    
    // クリア処理
    function clearCalculator() {
        currentInput = '0';
        previousInput = '';
        calculationOperator = '';
        history.textContent = '';
        decimalAdded = false;
    }
    
    // 符号の切り替え
    function toggleSign() {
        if (currentInput !== '0') {
            currentInput = (parseFloat(currentInput) * -1).toString();
        }
    }
    
    // パーセント計算
    function calculatePercent() {
        if (currentInput !== '0') {
            currentInput = (parseFloat(currentInput) / 100).toString();
            decimalAdded = true;
        }
    }
    
    // 表示桁数制限
    function limitDisplayLength() {
        if (currentInput.length > 12) {
            if (currentInput.includes('e')) {
                // 科学表記の場合はそのまま
                return;
            }
            
            // 小数点以下を適切に丸める
            const num = parseFloat(currentInput);
            if (Math.abs(num) < 1) {
                currentInput = num.toPrecision(6);
            } else {
                currentInput = num.toString().slice(0, 12);
            }
            
            showNotification('表示桁数を制限しました');
        }
    }
    
    // 画面の更新
    function updateDisplay() {
        display.textContent = currentInput;
    }
    
    // ボタン音を再生
    function playButtonSound() {
        // 音はオプションなので、簡略化のため省略
    }
    
    // エラー表示
    function showCalculationError(message) {
        document.querySelector('.calculator-display').classList.add('error');
        setTimeout(() => {
            document.querySelector('.calculator-display').classList.remove('error');
        }, 300);
        
        showNotification(message);
        
        // エラーをリセット
        currentInput = '0';
        updateDisplay();
    }
    
    // 通知表示
    function showNotification(message) {
        notificationMessage.textContent = message;
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
    
    // ディスプレイアニメーション
    function animateDisplay() {
        display.classList.add('updated');
        setTimeout(() => {
            display.classList.remove('updated');
        }, 300);
    }
    
    // キーボード入力の処理
    function handleKeyboardInput(e) {
        // 数字キー (0-9)
        if (/^\d$/.test(e.key)) {
            document.querySelector(`.button[data-num="${e.key}"]`).click();
        } 
        // 演算子キー
        else if (e.key === '+') {
            document.querySelector('.button[data-action="add"]').click();
        } else if (e.key === '-') {
            document.querySelector('.button[data-action="subtract"]').click();
        } else if (e.key === '*') {
            document.querySelector('.button[data-action="multiply"]').click();
        } else if (e.key === '/') {
            document.querySelector('.button[data-action="divide"]').click();
        } 
        // Enter キー (=)
        else if (e.key === 'Enter') {
            document.querySelector('.button[data-action="calculate"]').click();
        } 
        // Escape キー (AC)
        else if (e.key === 'Escape') {
            document.querySelector('.button[data-action="clear"]').click();
        } 
        // ピリオドキー (.)
        else if (e.key === '.') {
            document.querySelector('.button[data-num="."]').click();
        }
        // バックスペース
        else if (e.key === 'Backspace') {
            if (currentInput.length > 1) {
                currentInput = currentInput.slice(0, -1);
                if (!currentInput.includes('.')) {
                    decimalAdded = false;
                }
            } else {
                currentInput = '0';
            }
            updateDisplay();
        }
    }
    
    // 初期表示を更新
    updateDisplay();
}); 