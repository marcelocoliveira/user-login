test:
	@NODE_ENV=test ./node_modules/.bin/mocha

test-w:
	@NODE_ENV=test ./node_modules/.bin/mocha
		# --growl - would need to install growl file
		--watch

# test-acceptance:
# 	@NODE_ENV=test ./node_modules/.bin/mocha \
# 		--bail \
# 		test/acceptance/*.js

test-cov: app-cov
	@APP_COV=1 $(MAKE) test REPORTER=html-cov > public/coverage.html

app-cov:
	@jscoverage app app-cov

.PHONY: test test-w

# Best practice testing

# add acceptance tests to test/acceptance
# rename test to test-unit and add test: test-unit test-acceptance

# benchmark:
# 	@./support/bench

# clean:
# 	rm -f coverage.html
# 	rm -fr app-cov

# .PHONY: test test-unit test-acceptance benchmark clean