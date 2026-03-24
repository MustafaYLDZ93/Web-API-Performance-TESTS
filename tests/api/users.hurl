# =============================================================
# Users API Tests - JSONPlaceholder
# =============================================================

# ── GET tüm kullanıcılar ─────────────────────────────────────
GET https://jsonplaceholder.typicode.com/users
HTTP 200
[Asserts]
header "Content-Type" contains "application/json"
jsonpath "$[*]" count == 10
jsonpath "$[0].id" == 1
jsonpath "$[0].name" isString
jsonpath "$[0].email" isString


# ── GET tekil kullanıcı ──────────────────────────────────────
GET https://jsonplaceholder.typicode.com/users/1
HTTP 200
[Asserts]
jsonpath "$.id" == 1
jsonpath "$.name" == "Leanne Graham"
jsonpath "$.email" isString
jsonpath "$.address.city" isString
jsonpath "$.company.name" isString


# ── GET kullanıcı postları ───────────────────────────────────
GET https://jsonplaceholder.typicode.com/users/1/posts
HTTP 200
[Asserts]
jsonpath "$[*]" count > 0
jsonpath "$[0].userId" == 1


# ── 404 kontrolü ────────────────────────────────────────────
GET https://jsonplaceholder.typicode.com/users/9999
HTTP 404
