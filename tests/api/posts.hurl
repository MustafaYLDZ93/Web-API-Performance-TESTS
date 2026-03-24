# =============================================================
# Posts API Tests - JSONPlaceholder
# =============================================================

# ── GET tüm postlar ──────────────────────────────────────────
GET https://jsonplaceholder.typicode.com/posts
HTTP 200
[Asserts]
header "Content-Type" contains "application/json"
jsonpath "$[*]" count == 100
jsonpath "$[0].id" == 1
jsonpath "$[0].userId" isInteger
jsonpath "$[0].title" isString


# ── GET tekil post ───────────────────────────────────────────
GET https://jsonplaceholder.typicode.com/posts/1
HTTP 200
[Asserts]
jsonpath "$.id" == 1
jsonpath "$.userId" == 1
jsonpath "$.title" isString
jsonpath "$.body" isString


# ── POST yeni kayıt ──────────────────────────────────────────
POST https://jsonplaceholder.typicode.com/posts
Content-Type: application/json
{
  "title": "Hurl API Test",
  "body": "Bu bir test gönderisidir.",
  "userId": 1
}
HTTP 201
[Asserts]
jsonpath "$.id" isInteger
jsonpath "$.title" == "Hurl API Test"
jsonpath "$.userId" == 1


# ── PUT güncelleme ───────────────────────────────────────────
PUT https://jsonplaceholder.typicode.com/posts/1
Content-Type: application/json
{
  "id": 1,
  "title": "Güncellenmiş Başlık",
  "body": "Güncellenmiş içerik.",
  "userId": 1
}
HTTP 200
[Asserts]
jsonpath "$.title" == "Güncellenmiş Başlık"


# ── DELETE ───────────────────────────────────────────────────
DELETE https://jsonplaceholder.typicode.com/posts/1
HTTP 200
