import process from "node:process"
import {
	rollup,
	dts,
	virtual,
	terser,
	nodeResolve,
	getTypeScriptCompilerOptions,
	dts_resolver,
	mts
} from "./exports.mjs"

export default async function(
	project_root,
	entry_code,
	{
		file_type = "mjs",
		additional_rollup_plugins = [],
		minify = false,
		on_rollup_log_fn = null
	} = {}
) {
	const pre_plugins = additional_rollup_plugins.filter(plugin => plugin.when === "pre").map(plugin => plugin.plugin)
	const post_plugins = additional_rollup_plugins.filter(plugin => plugin.when === "post").map(plugin => plugin.plugin)

	const saved_cwd = process.cwd()

	//
	// needed to make node resolve work properly
	//
	process.chdir(project_root)

	try {
		let virtual_entry_file_name = "virtual_entry"
		let virtual_entries = {}

		if (file_type === "dts") {
			virtual_entry_file_name += ".d.mts"
		} else if (file_type === "mjs") {
			virtual_entry_file_name += ".mjs"
		} else if (file_type === "mts") {
			virtual_entry_file_name += ".mts"
		} else {
			throw new Error(`Invalid file type '${file_type}'.`)
		}

		virtual_entries[virtual_entry_file_name] = entry_code

		const rollup_options = {
			input: virtual_entry_file_name,
			output: {
				format: "es"
			}
		}

		const rollup_plugins = [virtual(virtual_entries)]

		if (file_type === "dts") {
			const project_tsconfig = await getTypeScriptCompilerOptions(project_root)

			if (project_tsconfig.errors.length) {
				throw new Error(
					`Cannot load options from tsconfig.json.`
				)
			}

			rollup_plugins.push(dts_resolver(project_root))

			rollup_plugins.push(dts({
				respectExternal: true,
				compilerOptions: {
					...project_tsconfig.options,
					//
					// overwrite paths alias since
					// those will be resolved by "dts_resolver"
					//
					paths: {}
				}
			}))

			// mark all "node:" imports as external
			rollup_plugins.push({
				resolveId(id) {
					if (id.startsWith("node:")) {
						return {id, external: true}
					}

					return null
				}
			})
		} else if (file_type === "mjs") {
			rollup_plugins.push(nodeResolve())
		} else if (file_type === "mts") {
			rollup_plugins.push(mts())
			rollup_plugins.push(nodeResolve())
		}

		if (minify) {
			rollup_plugins.push(terser())
		}

		const bundle = await rollup({
			...rollup_options,
			plugins: [
				...pre_plugins,
				...rollup_plugins,
				...post_plugins
			],

			onLog(level, error) {
				if (on_rollup_log_fn === null) return

				on_rollup_log_fn(level, error)
			}
		})

		const {output} = await bundle.generate(
			rollup_options.output
		)

		return output[0].code
	} finally {
		process.chdir(saved_cwd)
	}
}
