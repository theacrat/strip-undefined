type DeepOptional<TValue> = TValue extends readonly (infer TArrayValue)[]
	? readonly DeepOptional<TArrayValue>[] | undefined
	: TValue extends object
		? { [Key in keyof TValue]?: DeepOptional<TValue[Key]> | undefined } | undefined
		: TValue | undefined;

interface StripUndefinedOptions {
	removeFromArrays?: boolean;
}

const isUnknownArray = (value: unknown): value is readonly unknown[] => Array.isArray(value);

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
	if (typeof value !== "object" || value === null) {
		return false;
	}

	return Object.prototype.toString.call(value) === "[object Object]";
};

function stripUndefined<TValue>(value: DeepOptional<TValue>, options?: StripUndefinedOptions): TValue;
function stripUndefined(value: unknown, options: StripUndefinedOptions = {}): unknown {
	if (isUnknownArray(value)) {
		const mappedValues = value.map((item) => stripUndefined(item, options));
		return options.removeFromArrays === true
			? mappedValues.filter((item) => item !== undefined)
			: mappedValues;
	}

	if (!isPlainObject(value)) {
		return value;
	}

	return Object.fromEntries(
		Object.entries(value).flatMap(([key, nestedValue]: Readonly<[string, unknown]>) =>
			nestedValue === undefined ? [] : [[key, stripUndefined(nestedValue, options)]],
		),
	);
}

export default stripUndefined;
