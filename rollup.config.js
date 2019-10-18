import babel from 'rollup-plugin-babel';

export default {
	input: 'src/index.js',
	plugins: [
		babel({
			presets: [['@babel/preset-env', {
				targets: {
					node: 6
				}
			}]
			]
		})
	],
	external: Object.keys(require('./package.json').dependencies),
	output: [
		{ file: 'dist/rollup-plugin-yaml.cjs.js', format: 'cjs', sourcemap: true },
		{ file: 'dist/rollup-plugin-yaml.es.js', format: 'es', sourcemap: true }
	]
};
