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

TMP_REV = /tmp/rev.txt
CAT_REV = cat $(TMP_REV)
GIT_SRC = https://github.com/susam/texme
GIT_DST = https://github.com/opendocs/texme
WEB_URL = https://opendocs.github.io/texme/
TMP_GIT = /tmp/tmpgit
README  = docs/README.md

pushdocs: docs
	#
	# Get current commit ID.
	git rev-parse --short HEAD > $(TMP_REV)
	#
	# Copy examples.
	mkdir docs/examples
	for f in examples/*.html; do \
	    sed 's/...texme.js/https:\/\/cdn.jsdelivr.net\/npm\/texme@0.3.0/' "$$f" > \
	        docs/examples/"$$(basename "$$f")"; \
	done
	#
	# Create README.
	echo TeXMe Documentation and Examples >> $(README)
	echo ================================ >> $(README)
	echo >> $(README)
	echo Automatically generated from [susam/texme][GIT_SRC] >> $(README)
	echo "([$$($(CAT_REV))][GIT_REV])". >> $(README)
	echo >> $(README)
	echo Visit $(WEB_URL) to view the documentation. >> $(README)
	echo >> $(README)
	echo [GIT_SRC]: $(GIT_SRC) >> $(README)
	echo [WEB_URL]: $(WEB_URL) >> $(README)
	echo [GIT_REV]: $(GIT_SRC)/commit/$$($(CAT_REV)) >> $(README)
	#
	# Create Git repo and push.
	rm -rf $(TMP_GIT)
	mv docs $(TMP_GIT)
	cd $(TMP_GIT) && git init
	cd $(TMP_GIT) && git config user.name Makesite
	cd $(TMP_GIT) && git config user.email makesite@example.com
	cd $(TMP_GIT) && git add .
	cd $(TMP_GIT) && git commit -m "Generated from $(GIT_SRC) - $$($(CAT_REV))"
	cd $(TMP_GIT) && git remote add origin "$(GIT_DST).git"
	cd $(TMP_GIT) && git log
	cd $(TMP_GIT) && git push -f origin master

FORCE:
