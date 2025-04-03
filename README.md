# Web電卓アプリ

FlaskベースのWebアプリケーションとして実装された電卓アプリです。Docker環境で実行できます。

## 機能

- 基本的な四則演算（足し算、引き算、掛け算、割り算）
- エラーハンドリング（ゼロ除算、無効な入力など）
- Webインターフェース
- レスポンシブデザイン
- モダンなUIとアニメーション効果
- ホットリロード開発モード

## 必要条件

- Docker
- Make（オプション、コマンド実行用）

## 使い方

### Makeコマンド

このプロジェクトでは、Makefileを使用してDockerコマンドを簡単に実行できます。

```bash
# ヘルプを表示
make

# Dockerイメージをビルド
make build

# アプリケーションを実行（フォアグラウンド）
make run

# ホットリロード開発モードで実行（コード変更が即時反映）
make dev

# アプリケーションをバックグラウンドで実行
make run-bg

# ホットリロード開発モードをバックグラウンドで実行
make dev-bg

# バックグラウンドで実行中のアプリケーションを停止
make stop

# 開発用コンテナを停止
make dev-stop

# 未使用のDockerイメージをクリーン
make clean

# すべてのDockerリソースをクリーンアップ
make prune
```

### 開発モードについて

開発モードでは、コードの変更が即座にアプリケーションに反映されます。これにより開発効率が向上します。

- `make dev` コマンドを使用すると、ソースコードをホストマシンとコンテナ間で共有し、変更があれば自動的に再読み込みされます。
- Pythonコード、テンプレート、静的ファイル（CSS/JSなど）の変更はすべてリアルタイムで反映されます。

### 手動での実行

Make を使わない場合は、以下のコマンドを直接実行することもできます：

```bash
# イメージをビルド
docker build -t web-denntaku:latest .

# アプリケーションを実行
docker run -it --rm -p 8080:8080 web-denntaku:latest

# 開発モードで実行（ホットリロード）
docker run -it --rm -p 8080:8080 -v $(pwd)/app.py:/app/app.py -v $(pwd)/templates:/app/templates -v $(pwd)/static:/app/static -e FLASK_APP=app.py -e FLASK_ENV=development web-denntaku:latest
```

## アプリケーションへのアクセス

アプリケーションを実行した後、Webブラウザで以下のURLにアクセスしてください：

```
http://localhost:8080
```

## アプリケーションの使い方

1. 最初の数値を入力します
2. 演算子を選択します（足し算、引き算、掛け算、割り算）
3. 2番目の数値を入力します
4. 「=」ボタンをクリックして計算します
5. 計算結果が表示されます
6. 「AC」ボタンでクリアできます 