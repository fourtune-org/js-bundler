type Options = {
	file_type? : string
	additional_rollup_plugins? : Array<any>
	minify? : boolean
	on_rollup_log_fn? : (...args: any[]) => any | null
}

export default async function(
	project_root : string,
	entry_code : string,
	options? : Options
) : Promise<string>
