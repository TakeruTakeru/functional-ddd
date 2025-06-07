import { type Result, ResultAsync, err, ok } from "neverthrow";

// データベースエラー型の定義
export class DatabaseError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
		public readonly cause?: Error,
	) {
		super(message);
		this.name = "DatabaseError";
	}
}

export class ConnectionError extends DatabaseError {
	constructor(message: string, cause?: Error) {
		super(message, "CONNECTION_ERROR", cause);
		this.name = "ConnectionError";
	}
}

export class QueryError extends DatabaseError {
	constructor(message: string, cause?: Error) {
		super(message, "QUERY_ERROR", cause);
		this.name = "QueryError";
	}
}

// データベースインターフェース
interface Database {
	connect(): Result<void, ConnectionError>;
	disconnect(): Result<void, ConnectionError>;
	query<T>(sql: string, params?: unknown[]): ResultAsync<T[], QueryError>;
	insert<T>(table: string, data: T): ResultAsync<void, DatabaseError>;
	update<T>(
		table: string,
		data: T,
		condition: string,
	): ResultAsync<void, DatabaseError>;
	delete(table: string, condition: string): ResultAsync<void, DatabaseError>;
}

class DbRepository implements Database {
	private connection: unknown = null; // 実際のデータベース接続型に置き換え
	private isConnected = false;

	connect = (): Result<void, ConnectionError> => {
		try {
			// 実際の接続ロジックを実装
			this.isConnected = true;
			return ok(undefined);
		} catch (error) {
			return err(
				new ConnectionError(
					"Failed to connect to database",
					error instanceof Error ? error : new Error(String(error)),
				),
			);
		}
	};

	disconnect = (): Result<void, ConnectionError> => {
		try {
			// 実際の切断ロジックを実装
			this.isConnected = false;
			this.connection = null;
			return ok(undefined);
		} catch (error) {
			return err(
				new ConnectionError(
					"Failed to disconnect from database",
					error instanceof Error ? error : new Error(String(error)),
				),
			);
		}
	};

	query = <T>(
		sql: string,
		params?: unknown[],
	): ResultAsync<T[], QueryError> => {
		const _query = async (): Promise<T[]> => {
			if (!this.isConnected) {
				throw new QueryError("Database not connected");
			}

			try {
				// 実際のクエリロジックを実装
				// この例では空の配列を返しますが、実際の実装では適切なクエリ結果を返します
				await new Promise((resolve) => setTimeout(resolve, 1)); // 非同期処理のシミュレーション
				return [] as T[];
			} catch (error) {
				throw new QueryError(
					`Query failed: ${sql}`,
					error instanceof Error ? error : new Error(String(error)),
				);
			}
		};

		return ResultAsync.fromPromise(_query(), (err: unknown) =>
			err instanceof QueryError ? err : new QueryError("unexpected error"),
		);
	};

	insert = <T>(table: string, data: T): ResultAsync<void, DatabaseError> => {
		const _insert = async (): Promise<void> => {
			this.connect();
			if (!this.isConnected) {
				throw new DatabaseError("Database not connected");
			}

			try {
				// 実際のインサートロジックを実装
				await new Promise((resolve) => setTimeout(resolve, 100)); // 非同期処理のシミュレーション
				console.log(`saved ${JSON.stringify(data)}`);
			} catch (error) {
				throw new DatabaseError(
					`Insert failed for table: ${table}`,
					"INSERT_ERROR",
					error instanceof Error ? error : new Error(String(error)),
				);
			}
		};

		return ResultAsync.fromPromise(_insert(), (err) => {
			if (err instanceof DatabaseError) {
				return err;
			}
			if (err instanceof Error) {
				return new DatabaseError("unexpected error", "INSERT_ERROR", err);
			}
			return new DatabaseError(
				"unexpected error",
				"INSERT_ERROR",
				new Error(String(err)),
			);
		});
	};

	update = <T>(table: string, data: T): ResultAsync<void, DatabaseError> => {
		this.connect();
		const _update = async (): Promise<void> => {
			if (!this.isConnected) {
				throw new DatabaseError("Database not connected");
			}

			try {
				// 実際のアップデートロジックを実装
				await new Promise((resolve) => setTimeout(resolve, 1)); // 非同期処理のシミュレーション
			} catch (error) {
				throw new DatabaseError(
					`Update failed for table: ${table}`,
					"UPDATE_ERROR",
					error instanceof Error ? error : new Error(String(error)),
				);
			}
		};

		return ResultAsync.fromPromise(_update(), (err: unknown) =>
			err instanceof DatabaseError
				? err
				: new DatabaseError("unexpected error"),
		);
	};

	delete = (
		table: string,
		condition: string,
	): ResultAsync<void, DatabaseError> => {
		const _delete = async (): Promise<void> => {
			if (!this.isConnected) {
				throw new DatabaseError("Database not connected");
			}

			try {
				// 実際のデリートロジックを実装
				await new Promise((resolve) => setTimeout(resolve, 1)); // 非同期処理のシミュレーション
			} catch (error) {
				throw new DatabaseError(
					`Delete failed for table: ${table}`,
					"DELETE_ERROR",
					error instanceof Error ? error : new Error(String(error)),
				);
			}
		};

		return ResultAsync.fromPromise(_delete(), (err: unknown) =>
			err instanceof DatabaseError
				? err
				: new DatabaseError("unexpected error"),
		);
	};
}

export { DbRepository, type Database };
