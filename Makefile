help:
	@echo 'Usage: make [target]'
	@echo
	@echo 'Targets:'
	@echo '  test      Run tests.'
	@echo '  coverage  Run test coverage.'
	@echo '  docs      Generate documentation.'
	@echo '  deps      Install development dependencies.'
	@echo '  live      Push examples to GitHub pages.'

test: FORCE
	npm test

coverage: FORCE
	npm run coverage

docs: FORCE
	rm -rf docs
	npm run docs

deps:
	npm install

site:
	# Clone packages.
	rm -rf _site/ && mkdir -p _site/examples/
	git -C _site/ clone -b v4.0.12 --depth 1 https://github.com/markedjs/marked.git
	git -C _site/ clone -b 3.2.0 --depth 1 https://github.com/mathjax/mathjax.git
	rm -rf _site/markedjs/.git/
	rm -rf _site/mathjax/.git/
	# Create examples directory.
	sed -e 's|https:.*marked.min.js|../marked/marked.min.js|' \
	    -e 's|https:.*chtml.js|../mathjax/es5/tex-mml-chtml.js|' \
	    texme.js > _site/examples/texme.js
	for f in examples/*.html; do \
	    sed 's|\.\./texme.js|texme.js|' "$$f" > _site/examples/"$${f#*/}"; done
	# Create home page.
	sed -e 's|https:.*marked.min.js|marked/marked.min.js|' \
	    -e 's|https:.*chtml.js|mathjax/es5/tex-mml-chtml.js|' \
	    texme.js > _site/texme.js
	cp _site/examples/demo.html _site/index.html

pushlive:
	pwd | grep live$$ || false
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
