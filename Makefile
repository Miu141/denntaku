.PHONY: build run clean prune dev

# イメージ名とタグ
IMAGE_NAME = web-denntaku
IMAGE_TAG = latest

# カレントディレクトリの絶対パス取得
PWD := $(shell pwd)

# Dockerコンテナをビルド
build:
	docker build -t $(IMAGE_NAME):$(IMAGE_TAG) .

# Dockerコンテナを実行（ポート転送）
run:
	docker run -it --rm -p 8080:8080 $(IMAGE_NAME):$(IMAGE_TAG)

# ホットリロード開発モードで実行（ボリュームマウント）
dev:
	docker run -it --rm \
		-p 8080:8080 \
		-v $(PWD)/app.py:/app/app.py \
		-v $(PWD)/templates:/app/templates \
		-v $(PWD)/static:/app/static \
		-e FLASK_APP=app.py \
		-e FLASK_ENV=development \
		--name web-denntaku-dev \
		$(IMAGE_NAME):$(IMAGE_TAG)

# バックグラウンドでコンテナを実行
run-bg:
	docker run -d --rm -p 8080:8080 --name web-denntaku-container $(IMAGE_NAME):$(IMAGE_TAG)

# バックグラウンドでホットリロード開発モードで実行
dev-bg:
	docker run -d --rm \
		-p 8080:8080 \
		-v $(PWD)/app.py:/app/app.py \
		-v $(PWD)/templates:/app/templates \
		-v $(PWD)/static:/app/static \
		-e FLASK_APP=app.py \
		-e FLASK_ENV=development \
		--name web-denntaku-dev \
		$(IMAGE_NAME):$(IMAGE_TAG)

# 開発用コンテナを停止
dev-stop:
	docker stop web-denntaku-dev || true

# バックグラウンドで実行中のコンテナを停止
stop:
	docker stop web-denntaku-container || true

# 未使用のDockerイメージを削除
clean:
	docker images -f "dangling=true" -q | xargs -r docker rmi

# すべてのキャッシュとイメージを削除（注意して使用）
prune:
	docker system prune -af --volumes

# ヘルプメッセージ
help:
	@echo "使用可能なコマンド:"
	@echo "  make build    - Web電卓アプリのDockerイメージをビルド"
	@echo "  make run      - Web電卓アプリを実行（フォアグラウンド）"
	@echo "  make dev      - ホットリロード開発モードで実行（コード変更が即時反映）"
	@echo "  make run-bg   - Web電卓アプリを実行（バックグラウンド）"
	@echo "  make dev-bg   - ホットリロード開発モードでバックグラウンド実行"
	@echo "  make stop     - バックグラウンドで実行中のコンテナを停止"
	@echo "  make dev-stop - 開発用コンテナを停止"
	@echo "  make clean    - 未使用のイメージを削除"
	@echo "  make prune    - すべてのDockerリソースをクリーンアップ（キャッシュ含む）"
	@echo "  make help     - このヘルプメッセージを表示"

# デフォルトターゲット
.DEFAULT_GOAL := help 