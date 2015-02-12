/*───────────────────────────────────────────────────────────────────────────*\
│  Copyright (C) 2014 eBay Software Foundation                                │
│                                                                             │
│                                                                             │
│   Licensed under the Apache License, Version 2.0 (the "License"); you may   │
│   not use this file except in compliance with the License. You may obtain   │
│   a copy of the License at http://www.apache.org/licenses/LICENSE-2.0       │
│                                                                             │
│   Unless required by applicable law or agreed to in writing, software       │
│   distributed under the License is distributed on an "AS IS" BASIS,         │
│   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  │
│   See the License for the specific language governing permissions and       │
│   limitations under the License.                                            │
\*───────────────────────────────────────────────────────────────────────────*/
/*global before:true, after:true */
'use strict';
var Nemo = require('nemo'),
	_ = require("lodash"),
	_nemo;

module.exports = function (config) {
	config = config || {};
	var context = config.context || global;

	before(function (done) {
		(new Nemo(config.plugins || null)).setup(config.setup || {}).
			then(function (result) {
				if (context === global) {
					context.nemo = result;
					_nemo = context.nemo;
				}
				else {
					_.merge(context, result);
					_nemo = context;
				}
				done();
			}, function (err) {
				done(err);
			});
	});

	after(function (done) {
		_nemo.driver.quit().then(function () {
			done();
		}, function (err) {
			done(err);
		});
	});
};