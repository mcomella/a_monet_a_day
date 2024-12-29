#!/usr/bin/env bash

# Display npm test output only on error. This is necessary because jasmine only outputs to stdout so we can't just mute
# stdout.
echo -n "pre-push: executing unit tests…"
TEST_OUTPUT="$(npm test)"
TEST_EXIT=$?
if [ $TEST_EXIT -ne 0 ]
then
    echo -e " FAILED.\n$TEST_OUTPUT"
    exit $TEST_EXIT
fi
echo " success."

set -e
