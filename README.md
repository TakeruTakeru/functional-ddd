# Functional Domain Modeling with TypeScript

このプロジェクトは、TypeScriptを使用して関数型ドメインモデリング（Functional Domain Modeling）の原則を実践するサンプル実装です。F#のスコット・ウラシンの「Domain Modeling Made Functional」の概念をTypeScriptに適用し、型安全性と関数型プログラミングの手法を活用してドメインモデルを構築しています。

## 🏗️ アーキテクチャ

プロジェクトは以下のレイヤー構造を採用しています：

```
src/
├── domain/          # ドメインモデルとビジネスロジック
├── workflow/        # ユースケース（ワークフロー）
├── api/            # APIエンドポイント
├── infrastructure/ # インフラストラクチャ層
└── external/       # 外部システムとの連携
```

## 🔧 技術スタック

- **TypeScript**: 型安全性を提供
- **Zod**: スキーマバリデーションと型推論
- **neverthrow**: Railway Oriented Programming（Result型）の実装
- **Vitest**: テストフレームワーク
- **Biome**: リンター・フォーマッター

## 🎯 主要な関数型プログラミング手法

### 1. Type-Driven Development
```typescript
// 型を先に定義し、実装を導出
export const UserIdSchema = z
  .string()
  .min(1, "UserId must not be empty")
  .brand<"UserId">();

export type UserId = z.infer<typeof UserIdSchema>;
```

### 2. Railway Oriented Programming
```typescript
// Result型を使用したエラーハンドリング
export function createTrainerBasic(
  draft: TrainerDraft,
): Result<TrainerBasic, Error> {
  const parsed = TrainerDraftSchema.safeParse(draft);
  
  if (!parsed.success) {
    return err(new Error(`Invalid TrainerId: ${parsed.error.message}`));
  }
  
  return ok({...});
}
```

### 3. Pure Functions
```typescript
// 副作用のない純粋関数として実装
export function upgradeToPremiumTrainer(
  trainer: TrainerBasic,
  currentDate: Date,
): Result<TrainerPremium, Error> {
  const expiresAt = new Date(currentDate);
  expiresAt.setFullYear(expiresAt.getFullYear() + 1);
  // ...
}
```

## 📋 ドメインモデル

### User (ユーザー)
- 基本的なユーザー情報を管理
- 性別、作成日時、更新日時を含む

### Trainer (トレーナー)
- Basic: 基本的なトレーナー
- Premium: プレミアムトレーナー（有効期限付き）
- Draft: トレーナー作成時の下書き状態

### Payment (支払い)
- ユーザーとトレーナー間の支払い情報を管理
- 支払い金額、支払い者、受取人を含む

## 🚀 セットアップ

### 前提条件
- Node.js 18以上
- npm または yarn

### インストール
```bash
npm install
```

### 開発サーバー起動
```bash
npm run dev
```

### テスト実行
```bash
npm test
```

### コード品質チェック
```bash
npm run check
```

## 💡 使用例

```typescript
// ユーザー作成
const params = new Map<string, string>();
params.set("name", "12345");
const result = await handle("authorizeTrainer", params);

// トレーナーアップグレード
const upgradeParams = new Map<string, string>();
upgradeParams.set("trainerId", "12345");
const upgradeResult = await handle("upgradeTrainer", upgradeParams);
```

## 🎓 学習ポイント

このプロジェクトでは以下の関数型ドメインモデリングの概念を学べます：

1. **型による制約表現**: Zodを使用した型レベルでのバリデーション
2. **不変性の維持**: 状態変更は新しいオブジェクトの生成で表現
3. **Railway Oriented Programming**: 成功・失敗パスの明示的な処理
4. **関数合成**: 小さな関数を組み合わせた複雑な処理の構築
5. **依存性注入**: 高階関数を使用した依存関係の注入

## 📚 参考資料

- [Domain Modeling Made Functional](https://pragprog.com/titles/swdddf/domain-modeling-made-functional/) by Scott Wlaschin
- [Railway Oriented Programming](https://fsharpforfunandprofit.com/rop/)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)

## 🤝 コントリビューション

このプロジェクトは学習目的のサンプルですが、改善提案やバグ報告は歓迎します。

## 📄 ライセンス

ISC
