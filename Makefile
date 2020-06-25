all: install fetch-photos build

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
	./scripts/build

fetch-photos:
	./scripts/fetch-photos

serve: fetch-photos build
	deno run --allow-net --allow-read https://deno.land/std/http/file_server.ts dist

.PHONY: test fmt install
