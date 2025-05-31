import { handle } from "~/api";

function main() {
	const params = new Map<string, string>();
	params.set("trainerId", "12345");
	const result = handle("authorizeTrainer", params);
	const up = handle("upgradeTrainer", params);

	console.log("Authorization Result:", result);
	console.log("Upgrade Result:", up);
}

main();
