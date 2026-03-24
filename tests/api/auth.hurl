# =============================================================
# Auth & Header Tests
# =============================================================

# ── Bearer token ile istek ───────────────────────────────────
GET https://jsonplaceholder.typicode.com/posts/1
Authorization: Bearer test-token-12345
HTTP 200
[Asserts]
jsonpath "$.id" == 1


# ── Custom headers ───────────────────────────────────────────
GET https://jsonplaceholder.typicode.com/todos/1
Accept: application/json
X-Custom-Header: test-value
HTTP 200
[Asserts]
jsonpath "$.completed" isBoolean
jsonpath "$.title" isString


# ── Query parametreleri ──────────────────────────────────────
GET https://jsonplaceholder.typicode.com/posts?userId=1&_limit=5
HTTP 200
[Asserts]
jsonpath "$[*]" count == 5
jsonpath "$[0].userId" == 1
