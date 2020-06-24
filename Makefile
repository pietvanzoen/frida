
all: install build

bootstrap:
	./scripts/bootstrap

install:
	deno cache build.ts

test:
	# deno test --reload --allow-env --allow-read
	deno fmt --check

fmt:
	deno fmt

build:
	rm -rf dist
	mkdir -p dist
	deno run --allow-read build.ts > dist/index.html
	cp -r photos dist/photos


.PHONY: test fmt install
