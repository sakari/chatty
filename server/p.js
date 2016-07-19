export default function p(...args) {
  const op = args[0]
  return new Promise((ok, fail)  => op(...args.slice(1), (err, r) => {
    if (err) return fail(err)
    ok(r)
  }))
}

