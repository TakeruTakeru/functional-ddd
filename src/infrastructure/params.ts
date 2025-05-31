import type { z } from "zod";
import { err, ok, type Result } from "neverthrow";

/**
 * Map<string, string>からパラメータを抽出し、Zodスキーマでバリデーションする
 */
export function parseParams<T>(
	params: Map<string, string>,
	schema: z.ZodSchema<T>,
): Result<T, Error> {
	try {
		// Mapをオブジェクトに変換 (Object.fromEntriesの代替実装)
		const paramsObject: Record<string, string> = {};
		for (const [key, value] of params) {
			paramsObject[key] = value;
		}

		// Zodでバリデーション
		const result = schema.safeParse(paramsObject);

		if (result.success) {
			return ok(result.data);
		}

		const errorMessages = result.error.errors
			.map((err) => `${err.path.join(".")}: ${err.message}`)
			.join(", ");
		return err(new Error(`Validation failed: ${errorMessages}`));
	} catch (error) {
		return err(new Error(`Parameter parsing failed: ${error}`));
	}
}

export function getRequiredParam<T extends z.ZodType>(
	params: Map<string, string>,
	key: string,
	schema: T,
): Result<z.infer<T>, Error> {
	const value = params.get(key);

	if (value === undefined) {
		return err(new Error(`Missing required parameter: ${key}`));
	}

	const result = schema.safeParse(value);

	if (result.success) {
		return ok(result.data);
	}

	const errorMessage = result.error.errors.map((err) => err.message).join(", ");
	return err(new Error(`Invalid parameter ${key}: ${errorMessage}`));
}
