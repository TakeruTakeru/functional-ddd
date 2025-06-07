import { handle } from "~/api";

async function main() {
	// ユーザー作成
	const params = new Map<string, string>();
	params.set("name", "12345");
	const result = await handle("authorizeTrainer", params);
	console.log("Authorization Result:", result);

	// トレーナーアップグレード
	const upgradeParams = new Map<string, string>();
	upgradeParams.set("trainerId", "12345");
	const upgradeResult = await handle("upgradeTrainer", upgradeParams);
	console.log("Upgrade Result:", upgradeResult);
}

main();
