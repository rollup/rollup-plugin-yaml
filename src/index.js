import YAML from 'js-yaml';
import toSource from 'tosource';
import { createFilter, makeLegalIdentifier } from 'rollup-pluginutils';

const ext = /\.ya?ml$/;

export default function yaml(options = {}) {
	const filter = createFilter(options.include, options.exclude);

	return {
		name: 'yaml',

		transform(yaml, id) {
			if (!ext.test(id)) return null;
			if (!filter(id)) return null;

			const data = YAML.load(yaml);
			const keys = Object.keys(data).map(
				key => makeLegalIdentifier(key)
			);

			let code = `var data = ${toSource(data)};\n\n`;

			const exports = ['export default data;']
				.concat(keys.map(key => `export var ${key} = data.${key};`))
				.join('\n');

			return {
				code: code + exports,
				map: { mappings: '' }
			};
		}
	};
}
