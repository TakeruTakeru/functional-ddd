import type { Brand } from "~/utils";

type CreatedAt = Brand<Date, "createdAt">;
type UpdatedAt = Brand<Date, "updatedAt">;

export type { CreatedAt, UpdatedAt };
