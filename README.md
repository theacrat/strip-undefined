# strip-undefined

Remove `undefined` object properties deeply while preserving your target TypeScript shape.

Useful when you use `exactOptionalPropertyTypes` and want to build values with optional fields without carrying explicit `undefined` keys.

## Install

```bash
npm i strip-undefined
```

## Usage

### ESM / TypeScript

```ts
import stripUndefined from "strip-undefined";

type User = {
	id: string;
	profile?: {
		name?: string;
		timezone?: string;
	};
};

const user = stripUndefined<User>({
	id: "u_123",
	profile: {
		name: "Thea",
		timezone: undefined,
	},
});
// user is typed as User
// runtime value: { id: "u_123", profile: { name: "Thea" } }
```

### CommonJS

```js
const stripUndefined = require("strip-undefined");

const clean = stripUndefined({
	a: 1,
	b: undefined,
	nested: { c: undefined, d: 2 },
});

// { a: 1, nested: { d: 2 } }
```

### Remove undefined array entries too

```ts
import stripUndefined from "strip-undefined";

const value = stripUndefined(
	{
		items: [1, undefined, 2, undefined, 3],
	},
	{ removeFromArrays: true },
);

// { items: [1, 2, 3] }
```

## API

```ts
stripUndefined<TValue>(value: DeepOptional<TValue>, options?: StripUndefinedOptions): TValue
```

- Removes keys whose value is exactly `undefined` from plain objects (recursively).
- Recurses into arrays.
- By default, array items are preserved (including `undefined`).
- Set `{ removeFromArrays: true }` to remove `undefined` array entries recursively.
- Leaves non-plain objects (for example `Date`, `Map`, class instances) unchanged.
- Does not mutate the original plain objects; returns a new cleaned structure.

## Why This Exists

With `exactOptionalPropertyTypes`, `{ key?: string }` is not the same as `{ key: string | undefined }`.

At runtime, many pipelines produce objects like:

```ts
{ key: maybeValue } // maybeValue can be undefined
```

This utility removes those `undefined` keys so runtime data matches the intended optional shape.

# Licence

See [LICENSE](./LICENCE)

```
SPDX-License-Identifier: MIT
```
