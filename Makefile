.PHONY: build run clean prune

# イメージ名とタグ
IMAGE_NAME = web-denntaku
IMAGE_TAG = latest

# Dockerコンテナをビルド
build:
	docker build -t $(IMAGE_NAME):$(IMAGE_TAG) .

# Dockerコンテナを実行（ポート転送）
run:
	docker run -it --rm -p 8080:8080 $(IMAGE_NAME):$(IMAGE_TAG)

# バックグラウンドでコンテナを実行
run-bg:
	docker run -d --rm -p 8080:8080 --name web-denntaku-container $(IMAGE_NAME):$(IMAGE_TAG)

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
	@echo "  make run-bg   - Web電卓アプリを実行（バックグラウンド）"
	@echo "  make stop     - バックグラウンドで実行中のコンテナを停止"
	@echo "  make clean    - 未使用のイメージを削除"
	@echo "  make prune    - すべてのDockerリソースをクリーンアップ（キャッシュ含む）"
	@echo "  make help     - このヘルプメッセージを表示"

# デフォルトターゲット
.DEFAULT_GOAL := help 