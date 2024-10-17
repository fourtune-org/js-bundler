import jsBundler from "../../src/main.mjs"
import {fileURLToPath} from "node:url"
import path from "node:path"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

console.log(
	await jsBundler(
		__dirname, `
export * from "./index.mjs"
`, {
			file_type: "mjs"
		}
	)
)
