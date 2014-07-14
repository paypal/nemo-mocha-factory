## nemo-mocha-factory

Mocha before/after functions for putting nemo into the global namespace

[![Build Status](https://travis-ci.org/paypal/nemo-mocha-factory.svg?branch=master)](https://travis-ci.org/paypal/nemo-mocha-factory)

### Usage

```javascript
/*global describe:true, it:true, before:true, after:true */
"use strict";

var assert = require('assert'),
	nemoFactory = require('nemo-mocha-factory'),//require the module
	plugins = require('../config/nemo-plugins'),
	setup = require('../data/setup').loginSpec,
	data_driven = require("data-driven");

describe('nemo-user @loginSuite@loginFactory@ci-group2@', function () {
	//call the factory method, optionally with the Object argument seen below
	nemoFactory({"plugins": plugins, "setup": setup});
	data_driven([
		{"user": "nobank"},
		{"user": "nocc"},
		{"user": "ccandbank"}
	], function () {
		it('should create two users and login with user account {user} @P3@', function (ctx, done) {
			//use nemo from the global namespace
			var currentUser = nemo.user.users[ctx.user];
			nemo.driver.get(nemo.targetBaseUrl);
			nemo.view.login.login(currentUser.emailAddress, currentUser.password);
			nemo.view.login.logout().then(function () {
				nemo.screenshot.done("loginFactorySuccess-" + ctx.user, done);
			}, function (err) {
				nemo.screenshot.doneError("loginFactoryError-" + ctx.user, err, done);
			});

		});
	});
});
```

### API

The nemo-mocha-factory module accepts a JSON argument, with the following possible top-level objects
* plugins: JSON object representing any desired plugin setup. Please see: https://github.com/paypal/nemo-docs/blob/master/plugins.md
* setup: JSON object to pass to the Nemo.setup routine. Please see: https://github.com/paypal/nemo#nemosetup
* context: a local namespace to hang the nemo properties from. If this is not included, nemo will be registered to the global namespace
