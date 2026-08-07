import mongoose from "mongoose";

/**
 * Drop a cached Mongoose model in development so the next registration
 * recompiles it from the current schema.
 *
 * Models are cached as `mongoose.models[name] || mongoose.model(...)` so that
 * importing a module twice does not throw OverwriteModelError. In development
 * the Node process survives hot reloads, so that cache also keeps the
 * *previously compiled schema* alive - fields, enum values, methods and
 * statics added while the dev server is running are silently discarded.
 *
 * It surfaces as errors that make no sense against the source you are reading:
 *
 *   - "progress.cancel is not a function", for a method plainly defined above
 *   - "`cancelled` is not a valid enum value", for a value plainly in the enum
 *
 * and the only cure is restarting the dev server.
 *
 * Call this immediately before the cached export. Production is untouched:
 * nothing reloads there, and re-registering would be pure overhead.
 */
export function clearModelInDev(name: string): void {
  if (process.env.NODE_ENV !== "production" && mongoose.models[name]) {
    mongoose.deleteModel(name);
  }
}
