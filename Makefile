help:
	@echo 'Usage: make [target]'
	@echo
	@echo 'Targets:'
	@echo '  test      Run tests.'
	@echo '  coverage  Run test coverage.'
	@echo '  docs      Generate documentation.'
	@echo '  deps      Install development dependencies.'
	@echo '  pushdocs  Publish documentation with GitHub Pages'

test: FORCE
	npm test

coverage: FORCE
	npm run coverage

docs: FORCE
	rm -rf docs
	npm run docs

deps:
	npm install

site: docs
	rm -rf _site
	mv docs _site
	mkdir _site/examples
	for f in examples/*.html; do \
		sed 's|\.\./texme.js|https://cdn.jsdelivr.net/npm/texme@0.9.0|' \
			"$$f" > _site/examples/"$${f#*/}"; done

pushlive:
	git init
	git config user.name live
	git config user.email live@localhost
	git remote add origin https://github.com/susam/texme.git
	git checkout -b live
	git add .
	git commit -m "Publish live ($$(date -u +"%Y-%m-%d %H:%M:%S"))"
	git log
	git push -f origin live

live: site
	rm -rf /tmp/live
	mv _site /tmp/live
	REPO_DIR="$$PWD"; cd /tmp/live && make -f "$$REPO_DIR/Makefile" pushlive

FORCE:
