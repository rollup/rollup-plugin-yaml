const assert = require('assert');
const rollup = require('rollup');
const yaml = require('..');
const npm = require('rollup-plugin-node-resolve');
const yamlParser = require('js-yaml');

require('source-map-support').install();

process.chdir(__dirname);

function executeBundle ( bundle ) {
	return bundle.generate({
		format: 'cjs'
	}).then( generated => {
		const fn = new Function ( 'module', 'exports', 'assert', 'require', generated.output[0].code );
		const module = { exports: {} };

		try {
			fn(module, module.exports, assert, require);
		} catch (error) {
			// eslint-disable-next-line no-console
			console.log(generated.output[0].code);
			throw error;
		}

		return module;
	});
}

describe('rollup-plugin-yaml', function () {
	// Tests YAML spec conformance from https://github.com/connec/yaml-spec/blob/master/spec.json
	// Just making sure the underlying YAML parser isn't crap
	const fs = require('fs');
	const path = require('path');
	const spec = JSON.parse(
		fs.readFileSync(path.join(__dirname, 'spec.json'), 'utf8')
	);
	for (const s of Object.keys(spec)) {
		it('supports spec: ' + s, function () {
			for (const t of Object.keys(spec[s])) {
				const test = spec[s][t];
				const result = yamlParser.load(test.yaml);
				assert.deepStrictEqual(result, test.result);
			}
		});
	}

	it('converts yaml', function () {
		return rollup
			.rollup({
				input: 'samples/basic/main.js',
				plugins: [yaml()]
			})
			.then(executeBundle);
	});

	it('converts yml', function () {
		return rollup
			.rollup({
				input: 'samples/yml/main.js',
				plugins: [yaml()]
			})
			.then(executeBundle);
	});

	it('generates named exports', function () {
		return rollup
			.rollup({
				input: 'samples/named/main.js',
				plugins: [yaml()]
			})
			.then(executeBundle);
	});

	it('resolves extensionless imports in conjunction with npm plugin', function () {
		return rollup
			.rollup({
				input: 'samples/extensionless/main.js',
				plugins: [npm({ extensions: ['.js', '.yaml'] }), yaml()]
			})
			.then(executeBundle);
	});

	it('applies the optional transform method to parsed YAML', function () {
		const transform = (data) => {
			if (Array.isArray(data))
				return data.filter((datum) => !datum.private );
			else
				Object.keys(data).forEach((key) => { if (data[key].private) delete data[key]; });
		};
		return rollup
			.rollup({
				input: 'samples/transform/main.js',
				plugins: [yaml({ transform })]
			})
			.then(executeBundle);
	});
});
