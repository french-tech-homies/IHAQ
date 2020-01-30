.DEFAULT_GOAL := info

SHELL := /bin/bash

FTH_REGISTRY ?= frenchtechhomies
VERSION ?= git-$(shell git rev-parse --short=9 HEAD)

BINARY_DEST_DIR ?= bin
REPO_DIR ?= ${CURDIR}

PLATFORM ?= $(shell uname | tr A-Z a-z)

BUILD_BUILDNUMBER ?= $(shell whoami)
BUILD_NUMBER ?= ${BUILD_BUILDNUMBER}
BUILD_SOURCEBRANCHNAME ?= $(shell git rev-parse --symbolic-full-name --abbrev-ref HEAD)
BRANCH ?= ${BUILD_SOURCEBRANCHNAME}

SANITIZED_BUILD_NUMBER ?= $(shell echo ${BUILD_NUMBER} |  sed s/[.\|_]/-/g)
SANITIZED_BRANCH ?= $(shell echo ${BRANCH} |  sed s/[.\|_/]/-/g)
SANITIZED_NAME ?= ${SANITIZED_BUILD_NUMBER}

DEV_ENV_IMAGE := quay.io/deis/go-dev:latest
DEV_ENV_WORK_DIR := /go/src/github.com/french-tech-homies/ihaq
DEV_ENV_PREFIX := docker run --rm -e GO111MODULE=on -v ${CURDIR}:${DEV_ENV_WORK_DIR} -w ${DEV_ENV_WORK_DIR}
DEV_ENV_DOCKER_MOUNT_PREFIX := ${DEV_ENV_PREFIX} -v /var/run/docker.sock:/var/run/docker.sock
DEV_ENV_CMD := ${DEV_ENV_PREFIX} ${DEV_ENV_IMAGE}

IHAQ_GOPATH = github.com/french-tech-homies/ihaq
IHAQ_VERSION ?= ${VERSION}

MUTABLE_VERSION ?= production

###############################################################################
# Go build options
###############################################################################
ifeq ($(OS),Windows_NT)
	GO_BUILD_MODE = default
else
	UNAME_S := $(shell uname -s)
	ifeq ($(UNAME_S), Linux)
		GO_BUILD_MODE = pie
	endif
	ifeq ($(UNAME_S), Darwin)
		GO_BUILD_MODE = default
	endif
endif

GO_BUILD_OPTIONS = -buildmode=${GO_BUILD_MODE} -ldflags "-X ${IHAQ_GOPATH}/log.BuildVersion=${VERSION} -extldflags=-Wl,-z,now,-z,relro"

###############################################################################
# COMMON
###############################################################################

.PHONY: info-ihaq
info: info-ihaq
	@echo
	@echo "Branch:				${BRANCH}"
	@echo "Build tag:			${VERSION}"
	@echo "Registry (FTH_REGISTRY):	${FTH_REGISTRY}"
	@echo "ihaq-publisher:			$(FTH_REGISTRY)/ihaq-publisher:$(IHAQ_VERSION)"
	@echo "ihaq-worker:			$(FTH_REGISTRY)/ihaq-worker:$(IHAQ_VERSION)"
	@echo "ihaq-client:			$(FTH_REGISTRY)/ihaq-client:$(IHAQ_VERSION)"
	@echo

registry-login: registry-login
	@echo ${FTH_REGISTRY_USERNAME}
	@echo ${FTH_REGISTRY_PASSWORD}
	@docker login -u ${FTH_REGISTRY_USERNAME} -p ${FTH_REGISTRY_PASSWORD}

# Run go fmt against code
.PHONY: fmt
fmt:
	go fmt ./pkg/... ./cmd/...

.PHONY: fmt-with-container
fmt-with-container:
	$(DEV_ENV_CMD) go fmt ./pkg/... ./cmd/...

# Run go vet against code
.PHONY: vet
vet:
	go vet ./pkg/... ./cmd/...

# .PHONY: vet-with-container
vet-with-container:
	$(DEV_ENV_CMD) go vet ./pkg/... ./cmd/...

# Generate code
.PHONY: generate
generate:
	go generate ./pkg/... ./cmd/...

# Generate code
.PHONY: generate-with-container
generate-with-container:
	$(DEV_ENV_CMD) go generate ./pkg/... ./cmd/...


# .PHONY: test-queue
# test: generate fmt vet
# 	go test ./pkg/... ./cmd/... -coverprofile cover.out | tee uts.txt

# Building
build-base-ubuntu-image:
	docker build -t base-ubuntu:v0.0.1 images/common/base

build: build-publisher-binaries build-worker-binaries

build-images: build-base-ubuntu-image build-publisher-image build-worker-image build-client-image
build-images-with-container: build-base-ubuntu-image build-publisher-image-with-container build-worker-image-with-container
push-images: push-publisher-image push-worker-image push-client-image
push-mutable-images: push-mutable-publisher-image push-mutable-worker-image push-mutable-client-image

.PHONY: run-locally
run-locally: build-base-ubuntu-image build-publisher-binaries-with-container build-worker-binaries-with-container
	cp bin/ihaq-publisher images/publisher/ihaq-publisher
	cp bin/ihaq-worker images/worker/ihaq-worker
	docker-compose build && docker-compose up --force-recreate

###############################################################################
# PUBLISHER
###############################################################################

.PHONY: build-publisher-binaries
build-publisher-binaries:
	go build $(GO_BUILD_OPTIONS) -o $(BINARY_DEST_DIR)/ihaq-publisher $(IHAQ_GOPATH)/cmd/publisher

.PHONY: build-publisher-binaries-with-container
build-publisher-binaries-with-container:
	$(DEV_ENV_CMD) make build-publisher-binaries

.PHONY: build-publisher-image
build-publisher-image: build-base-ubuntu-image build-publisher-binaries
	cp bin/ihaq-publisher images/publisher/ihaq-publisher
	docker build -t $(FTH_REGISTRY)/ihaq-publisher:$(IHAQ_VERSION) images/publisher

.PHONY: push-publisher-image
push-publisher-image: registry-login
	docker push $(FTH_REGISTRY)/ihaq-publisher:$(IHAQ_VERSION)

.PHONY: push-mutable-publisher-image
push-mutable-publisher-image: registry-login
	docker tag $(FTH_REGISTRY)/ihaq-publisher:$(IHAQ_VERSION) $(FTH_REGISTRY)/ihaq-publisher:$(MUTABLE_VERSION)
	docker push $(FTH_REGISTRY)/ihaq-publisher:$(MUTABLE_VERSION)

.PHONY: helm-upgrade-publisher
helm-upgrade-publisher:
	# Dirty hack to bypass redis auth for demo
	helm upgrade ihaq-api charts/api --set image.tag=$(IHAQ_VERSION) --set redis.usePassword=false

# Yea.... this can be combined with helm-upgrade-client ! Rush hour !
.PHONY: helm-upgrade-dev-publisher
helm-upgrade-dev-publisher:
	# Well presentation is tonight... hardcoding values but needs to be cleaned !
	helm upgrade ihaq-dev-api charts/api --set image.tag=$(IHAQ_VERSION) --set redis.usePassword=false --set params.redisSvcName=ihaq-dev-api-redis-master

###############################################################################
# WORKER
###############################################################################

.PHONY: build-worker-binaries
build-worker-binaries:
	go build $(GO_BUILD_OPTIONS) -o $(BINARY_DEST_DIR)/ihaq-worker $(IHAQ_GOPATH)/cmd/worker

.PHONY: build-worker-binaries-with-container
build-worker-binaries-with-container:
	$(DEV_ENV_CMD) make build-worker-binaries

.PHONY: build-worker-image
build-worker-image: build-base-ubuntu-image build-worker-binaries
	cp bin/ihaq-worker images/worker/ihaq-worker
	docker build -t $(FTH_REGISTRY)/ihaq-worker:$(IHAQ_VERSION) images/worker

.PHONY: push-worker-image
push-worker-image: registry-login
	docker push $(FTH_REGISTRY)/ihaq-worker:$(IHAQ_VERSION)

.PHONY: push-mutable-worker-image
push-mutable-worker-image: registry-login
	docker tag $(FTH_REGISTRY)/ihaq-worker:$(IHAQ_VERSION) $(FTH_REGISTRY)/ihaq-worker:$(MUTABLE_VERSION)
	docker push $(FTH_REGISTRY)/ihaq-worker:$(MUTABLE_VERSION)

.PHONY: helm-upgrade-worker
helm-upgrade-worker:
	helm upgrade ihaq-worker charts/worker --set image.tag=$(IHAQ_VERSION)

# Yea.... this can be combined with helm-upgrade-client ! Rush hour !
.PHONY: helm-upgrade-dev-worker
helm-upgrade-dev-worker:
	# Well presentation is tonight... hardcoding values but needs to be cleaned !
	helm upgrade ihaq-dev-worker charts/worker --set image.tag=$(IHAQ_VERSION) --set params.redisSvcName=ihaq-dev-api-redis-master

###############################################################################
# CLIENT
###############################################################################

.PHONY: build-client-binaries
build-client-binaries:
	cd cmd/web && yarn install && yarn build

.PHONY: build-client-image
build-client-image:
	docker build -f images/client/Dockerfile -t $(FTH_REGISTRY)/ihaq-client:$(IHAQ_VERSION) cmd/web

.PHONY: push-client-image
push-client-image: registry-login
	docker push $(FTH_REGISTRY)/ihaq-client:$(IHAQ_VERSION)

.PHONY: push-mutable-client-image
push-mutable-client-image: registry-login
	docker tag $(FTH_REGISTRY)/ihaq-client:$(IHAQ_VERSION) $(FTH_REGISTRY)/ihaq-client:$(MUTABLE_VERSION)
	docker push $(FTH_REGISTRY)/ihaq-client:$(MUTABLE_VERSION)

.PHONY: helm-upgrade-client
helm-upgrade-client:
	helm upgrade ihaq-client charts/client --set image.tag=$(IHAQ_VERSION)

# Yea.... this can be combined with helm-upgrade-client ! Rush hour !
.PHONY: helm-upgrade-dev-client
helm-upgrade-dev-client:
	# Well presentation is tonight... hardcoding values but needs to be cleaned !
	helm upgrade ihaq-dev-client charts/client --set image.tag=$(IHAQ_VERSION) --set params.apiUrl=dev.api.ihaq.juin.me
