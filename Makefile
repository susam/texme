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

doc: FORCE
	rm -rf doc
	npm run doc

deps:
	npm install

site: doc
	# Clone external packages.
	rm -rf _site/ && mkdir -p _site/examples/
	git -C _site/ clone -b v4.0.12 --depth 1 https://github.com/markedjs/marked.git
	git -C _site/ clone -b 3.2.0 --depth 1 https://github.com/mathjax/mathjax.git
	rm -rf _site/marked/.git/
	rm -rf _site/mathjax/.git/
	# Create texme.js that loads external packages from same domain.
	sed -e 's|https:.*marked.min.js|https://susam.github.io/texme/marked/marked.min.js|' \
	    -e 's|https:.*chtml.js|https://susam.github.io/texme/mathjax/es5/tex-mml-chtml.js|' \
	    texme.js > _site/texme.js
	npx uglifyjs _site/texme.js --compress --mangle --output _site/texme.min.js
	# Copy examples and create home page.
	cp examples/*.html _site/examples/
	sed 's|\.\./texme.js|texme.js|' examples/demo.html > _site/index.html
	# Copy documentation.
	mv doc/ _site/

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
