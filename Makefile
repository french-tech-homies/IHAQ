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
DEV_ENV_PREFIX := docker run --rm -v ${CURDIR}:${DEV_ENV_WORK_DIR} -w ${DEV_ENV_WORK_DIR}
DEV_ENV_DOCKER_MOUNT_PREFIX := ${DEV_ENV_PREFIX} -v /var/run/docker.sock:/var/run/docker.sock
DEV_ENV_CMD := ${DEV_ENV_PREFIX} ${DEV_ENV_IMAGE}

IHAQ_GOPATH = github.com/french-tech-homies/ihaq
IHAQ_VERSION ?= ${VERSION}
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

# .PHONY: test-queue
# test: generate fmt vet
# 	go test ./pkg/... ./cmd/... -coverprofile cover.out | tee uts.txt

# .PHONY: test-queue-with-container
# test-queue-with-container: generate-queue-with-container fmt-queue-with-container vet-queue-with-container
# 	$(DEV_ENV_CMD) go get github.com/onsi/ginkgo/ginkgo
# 	$(DEV_ENV_CMD) ginkgo -r -trace ./cmd ./pkg
# 	$(DEV_ENV_CMD) go test ./pkg/... ./cmd/... -coverprofile cover.out | tee uts.txt

.PHONY: build-publisher-binaries
build-publisher-binaries:
	go build $(GO_BUILD_OPTIONS) -o $(BINARY_DEST_DIR)/ihaq-publisher $(IHAQ_GOPATH)/cmd/publisher

.PHONY: build-worker-binaries
build-worker-binaries: 
	go build $(GO_BUILD_OPTIONS) -o $(BINARY_DEST_DIR)/ihaq-worker $(IHAQ_GOPATH)/cmd/worker

.PHONY: build-publisher-binaries-with-container
build-publisher-binaries-with-container: 
	$(DEV_ENV_CMD) GO111MODULE=on go mod vendor
	$(DEV_ENV_CMD) make build-publisher-binaries

# .PHONY: build-images
# build-images: 
# 	cp bin/aroinfra images/aroinfra
# 	docker build -t $(OSA_REGISTRY)/$(ORG)/aroinfra:$(AROINFRA_VERSION) images/aroinfra

# .PHONY: push-images
# push-images: 
# 	docker push $(OSA_REGISTRY)/$(ORG)/aroinfra:$(AROINFRA_VERSION)

# .PHONY: push-mutable-images
# push-mutable-images: 
# 	docker tag $(OSA_REGISTRY)/$(ORG)/aroinfra:$(AROINFRA_VERSION) $(OSA_REGISTRY)/$(ORG)/aroinfra:$(MUTABLE_VERSION)
# 	docker push $(OSA_REGISTRY)/$(ORG)/aroinfra:$(MUTABLE_VERSION)

# registry-login:
# 	@docker login ${OSA_REGISTRY} -u ${OSA_REGISTRY_USERNAME} -p ${OSA_REGISTRY_PASSWORD}

# .PHONY: publish-coverage-with-container
# publish-coverage-with-container:
# 	${DEV_ENV_PREFIX} ${DEV_ENV_IMAGE} bash -c "go get github.com/jstemmer/go-junit-report && \
#     go get github.com/axw/gocov/gocov && \
#     go get github.com/AlekSi/gocov-xml && \
#     go get -u gopkg.in/matm/v1/gocov-html && \
#     go-junit-report < uts.txt > report.xml && \
#     gocov convert cover.out > coverage.json && \
#     gocov-xml < coverage.json > coverage.xml && \
#     mkdir coverage && \
#     gocov-html < coverage.json > coverage/index.html"

# # Run go fmt against code
# .PHONY: fmt
# fmt:
# 	go fmt ./pkg/... ./cmd/...

# .PHONY: fmt-with-container
# fmt-with-container:
# 	$(DEV_ENV_CMD) go fmt ./pkg/... ./cmd/...

# # Run go vet against code
# .PHONY: vet
# vet:
# 	go vet ./pkg/... ./cmd/...

# .PHONY: vet-with-container
# vet-with-container:
# 	$(DEV_ENV_CMD) go vet ./pkg/... ./cmd/...

# # Generate code
# .PHONY: generate
# generate:
# 	go generate ./pkg/... ./cmd/...

# # Generate code
# .PHONY: generate-with-container
# generate-with-container:
# 	$(DEV_ENV_CMD) go generate ./pkg/... ./cmd/...