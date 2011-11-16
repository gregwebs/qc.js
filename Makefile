# ** MODIFY THIS FILE AS REQUIRED **
# ** ADD CUSTOM BUILD- & TEST-EXECUTION-COMMANDS HERE **
#
# Building & testing for development and CI environment
# 
# Following binaries need to be installed and available in your PATH:
# 
#   * jsdoc
#   * jshint
#   * phantomjs
#   * jscoverage-server
#   * node
#
# CI-Tools (https://github.com/uxebu/ci-tools) need to be installed in:
# 
#   /opt/ci-tools
#
# The Jenkins-CI environment is executing the task `ci-run`:
# 
#   make ci-run

ifndef TEST_RUNNER
	# CHANGE HERE, IF THE DEFAULT TEST-RUNNER IS SOMEWHERE ELSE
	TEST_RUNNER=test/runner.html
endif

ifndef WORKSPACE
	WORKSPACE=${CURDIR}
endif

ifndef PROJECT_NAME
	PROJECT_NAME = $(shell basename ${WORKSPACE})
endif
CURRENT_USER = $(shell whoami)

ifndef BASE_URL:
	BASE_URL=http://localhost/${CURRENT_USER}/${PROJECT_NAME}
endif

ifdef JOB_URL
	# jenkins env URL params end with "/"
	BASE_URL=${JOB_URL}ws
endif

# You can install the CI-Tools on your machine: https://github.com/uxebu/ci-tools
ifndef CI_TOOLS_DIR
	CI_TOOLS_DIR=/opt/ci-tools
endif

ifndef TEMP_DIR
	TEMP_DIR=${WORKSPACE}/tmp
endif

default: build

jshint: mktemp
	jshint ${WORKSPACE}/src/ --config ${CI_TOOLS_DIR}/config/jshint.json > ${TEMP_DIR}/jshint-report.txt

coverage-phantom: mktemp
	${CI_TOOLS_DIR}/bin/coverage_phantom.sh ${TEST_RUNNER} ${WORKSPACE}

test-phantom: mktemp
	phantomjs --load-plugins=yes ${CI_TOOLS_DIR}/script/phantom_runner.js ${BASE_URL}/${TEST_RUNNER} ${TEMP_DIR} 1

test-webdriver: mktemp
	${CI_TOOLS_DIR}/bin/webdriver_runner.js ${BASE_URL}/${TEST_RUNNER} ${TEMP_DIR}

syntux-diff: mktemp
	${CI_TOOLS_DIR}/bin/syntux_diff.sh ${WORKSPACE}/src ${TEMP_DIR}

doc: mktemp
	jsdoc -r -d ${TEMP_DIR}/doc ${WORKSPACE}/src || true

build: clean
	# CHANGE HERE, TO ADD YOUR CUSTOM BUILD STEPS

mktemp:
	mkdir -p ${TEMP_DIR}

clean:
	rm -rf ${TEMP_DIR}

ci-run: clean jshint coverage-phantom test-phantom test-webdriver
