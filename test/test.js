var assert = require( 'assert' );
var rollup = require( 'rollup' );
var yaml = require( '..' );
var npm = require( 'rollup-plugin-node-resolve' );

require( 'source-map-support' ).install();

process.chdir( __dirname );

function executeBundle ( bundle ) {
	var generated = bundle.generate();
	var code = generated.code;

	var fn = new Function( 'assert', code );
	fn( assert );
}

describe( 'rollup-plugin-yaml', function () {
	it( 'converts yaml', function () {
		return rollup.rollup({
			entry: 'samples/basic/main.js',
			plugins: [ yaml() ]
		}).then( executeBundle );
	});

	it( 'converts yml', function () {
		return rollup.rollup({
			entry: 'samples/yml/main.js',
			plugins: [ yaml() ]
		}).then( executeBundle );
	});

	it( 'generates named exports', function () {
		return rollup.rollup({
			entry: 'samples/named/main.js',
			plugins: [ yaml() ]
		}).then( executeBundle );
	});

	it( 'resolves extensionless imports in conjunction with npm plugin', function () {
		return rollup.rollup({
			entry: 'samples/extensionless/main.js',
			plugins: [ npm({ extensions: [ '.js', '.yaml' ]}), yaml() ]
		}).then( executeBundle );
	});
});
