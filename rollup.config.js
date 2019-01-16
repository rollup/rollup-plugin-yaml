import buble from 'rollup-plugin-buble';

var external = Object.keys( require( './package.json' ).dependencies );

export default {
	input: 'src/index.js',
	plugins: [ buble({ sourceMap: true }) ],
	external: external,
	output: {
    sourceMap: true
  }
};
