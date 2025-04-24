/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"comdinemm/zmm0002/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
