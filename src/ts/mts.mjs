import {stripTypeScriptTypes} from "../exports.mjs"

export default function() {
	return {
		async transform(code, id) {
			if (!id.endsWith(".mts")) {
				return null
			}

			return stripTypeScriptTypes(
				code, {
					filename: id
				}
			)
		}
	}
}
