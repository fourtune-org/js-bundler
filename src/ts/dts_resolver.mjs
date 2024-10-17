import path from "node:path"

function isModuleTypeScriptFile(id) {
	return id.endsWith(".mts") && !id.endsWith(".d.mts")
}

export default function(project_root) {
	return {
		id: "jsbundler-dts-resolver",

		resolveId(id) {
			if (!id.startsWith("#/")) return null

			id = id.slice(2)

			//
			// files will be located at objects/src
			//
			id = path.join(
				project_root, "objects", "src", id
			)

			// resolve .mts ---> .d.mts
			if (isModuleTypeScriptFile(id)) {
				return {
					id: `${id.slice(0, -4)}.d.mts`
				}
			}

			// leave d.mts as is
			return {id}
		}
	}
}
