
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

clear-cache:
	rm -rvf .cache

build:
	rm -rf dist
	mkdir -p dist
	cp -rv static/* dist
	deno run --unstable --allow-read --allow-write build.ts > dist/index.html

serve: build
	deno run --allow-net --allow-read https://deno.land/std/http/file_server.ts dist

.PHONY: test fmt install
