
all: install build

bootstrap:
	./scripts/bootstrap

install:
	deno cache --unstable build.ts

test:
	# deno test --reload --allow-env --allow-read
	deno fmt --check

fmt:
	deno fmt

build:
	rm -rf dist
	mkdir -p dist
	deno run --unstable --allow-read --allow-write build.ts > dist/index.html


.PHONY: test fmt install
