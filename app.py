#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from flask import Flask, render_template, request, jsonify

app = Flask(__name__)
app.config['ENV'] = 'development'  # 開発環境設定
app.config['DEBUG'] = True         # デバッグモード有効化

def calculate(num1, num2, operator):
    """
    基本的な計算を行う関数
    :param num1: 第一の数値
    :param num2: 第二の数値
    :param operator: 計算記号（'+', '-', '*', '/'）
    :return: 計算結果またはエラーメッセージ
    """
    try:
        num1 = float(num1)
        num2 = float(num2)
        
        if operator == '+':
            return num1 + num2
        elif operator == '-':
            return num1 - num2
        elif operator == '*':
            return num1 * num2
        elif operator == '/':
            if num2 == 0:
                return "エラー: ゼロで割ることはできません"
            return num1 / num2
        else:
            return "エラー: 無効な演算子です"
    except ValueError:
        return "エラー: 有効な数値を入力してください"
    except Exception as e:
        return f"エラー: {str(e)}"

@app.route('/')
def index():
    """メインページを表示"""
    return render_template('index.html')

@app.route('/calculate', methods=['POST'])
def calculate_route():
    """計算APIエンドポイント"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'success': False, 'message': 'データが受信できませんでした'})
        
        num1 = data.get('num1', '')
        num2 = data.get('num2', '')
        operator = data.get('operator', '')
        
        result = calculate(num1, num2, operator)
        
        # 結果が文字列の場合はエラーメッセージ
        if isinstance(result, str):
            return jsonify({'success': False, 'message': result})
        
        # 成功の場合
        return jsonify({
            'success': True, 
            'result': result,
            'expression': f"{num1} {operator} {num2} = {result}"
        })
    except Exception as e:
        return jsonify({'success': False, 'message': f'予期せぬエラー: {str(e)}'})

# Flaskアプリのエントリポイント
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True) 