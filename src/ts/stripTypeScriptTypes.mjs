import {
	babelCore as babel,
	babelPresetTypeScript as presetTS,
	babelPluginModuleResolver as pluginModuleResolver
} from "../exports.mjs"

export default async function(code, {
	filename = "",
	aliases = {},
	rewriteImportExtensions = false
} = {}) {
	return await babel.transformAsync(
		code, {
			presets: [
				[presetTS, {
					rewriteImportExtensions
				}]
			],
			filename,
			plugins: [
				[pluginModuleResolver, {
					alias: {
						...aliases
					}
				}]
			]
		}
	)
}
