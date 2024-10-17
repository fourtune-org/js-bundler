import {ts} from "../exports.mjs"

import path from "node:path"
import fs from "node:fs/promises"

export default async function(project_root) {
	const tsconfig_path = path.join(project_root, "tsconfig.json")
	const tsconfig_data = await fs.readFile(tsconfig_path)
	const tsconfig = JSON.parse(tsconfig_data.toString())

	return ts.convertCompilerOptionsFromJson(tsconfig.compilerOptions)
}
