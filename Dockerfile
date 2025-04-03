FROM python:3.9-slim

WORKDIR /app

# 依存関係ファイルをコピー
COPY requirements.txt .

# 依存関係のインストール
RUN pip install --no-cache-dir -r requirements.txt

# アプリケーションファイルをコピー
COPY app.py .
COPY templates templates/
COPY static static/

# ポートの公開
EXPOSE 8080

# ホットリロード対応の開発サーバー起動コマンド
CMD ["flask", "run", "--host=0.0.0.0", "--port=8080", "--reload", "--debug"] 