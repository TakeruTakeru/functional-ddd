import { type Result, err, ok } from "neverthrow";
import type { z } from "zod";

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
			.map((err: z.ZodIssue) => `${err.path.join(".")}: ${err.message}`)
			.join(", ");
		return err(new Error(`Validation failed: ${errorMessages}`));
	} catch (error) {
		return err(new Error(`Parameter parsing failed: ${error}`));
	}
}

export function getRequiredParam<T extends z.ZodType>(
	params: Map<string, string>,
	schema: T,
): Result<z.infer<T>, Error> {
	try {
		// Mapをオブジェクトに変換
		const paramsObject: Record<string, string> = {};
		for (const [key, value] of params) {
			paramsObject[key] = value;
		}

		const result = schema.safeParse(paramsObject);

		if (result.success) {
			return ok(result.data);
		}

		const errorMessage = result.error.errors
			.map((err: z.ZodIssue) => err.message)
			.join(", ");
		return err(new Error(`Invalid parameters: ${errorMessage}`));
	} catch (error) {
		return err(new Error(`Parameter parsing failed: ${error}`));
	}
}
