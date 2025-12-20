import { builder } from "../builder";
import type { BucketObject } from "firebase-storage";

type NullablePartial<T> = {
  [P in keyof T]?: T[P] | null;
};

export const CorsInput =
  builder.inputRef<NullablePartial<BucketObject["cors"][0]>>("CorsInput");
CorsInput.implement({
  fields: (t) => ({
    origin: t.stringList({ required: false }),
    method: t.stringList({ required: false }),
    responseHeader: t.stringList({ required: false }),
    maxAgeSeconds: t.int({ required: false }),
  }),
});
