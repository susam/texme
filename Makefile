# Install test tools.
install_kcov:
	apt-get update
	apt-get install g++ pkg-config libcurl4-gnutls-dev libelf-dev libdw-dev zlib1g-dev cmake
	git clone https://github.com/SimonKagstrom/kcov.git
	mkdir kcov/build
	cd kcov/build && cmake .. && make && make install

install_shells:
	apt-get update
	apt-get install ksh zsh posh yash

# Run tests.
test: FORCE
	sh test/test
	npm test

test_all: test test_unix test_posix

test_unix:
	bash test/test
	ksh test/test
	zsh test/test

test_posix:
	dash test/test
	posh test/test
	yash test/test

# Measure code coverage. 
coverage: FORCE
	rm -rf coverage
	kcov --exclude-path=test/test coverage test/test

coveralls:
	rm -rf coverage
	kcov --coveralls-id=$$TRAVIS_JOB_ID --exclude-path=test/test coverage test/test

# Clean up.
clean:
	rm -rf node_modules package-lock.json

# Do nothing target to ensure the test and coverage targets run
# everytime despite the presence of directory with same names.
FORCE:

# vim: noet
