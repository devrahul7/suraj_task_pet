# Backend Tests — PetEy

This branch (`test-backend`) contains the test suite for the PetEy backend API.

## Running the tests

```bash
npm install
npm test
```

To run in watch mode:

```bash
npm run test:watch
```

To get a coverage report:

```bash
npm run test:coverage
```

## What's covered

| File | Tests |
|------|-------|
| `tests/utils/hash.test.ts` | HashUtil — hashing and comparing passwords with bcrypt |
| `tests/utils/jwt.test.ts` | JwtUtil — generating and verifying access/refresh JWT tokens |
| `tests/utils/cookies.test.ts` | CookieUtil — setting and clearing auth cookies |
| `tests/utils/api-response.test.ts` | ApiResponseHelper — success and error response formatting |
| `tests/middlewares/role.middleware.test.ts` | Role-based access control (USER vs ADMIN) |
| `tests/middlewares/error.middleware.test.ts` | Global error handler — HttpException vs generic errors |
| `tests/exceptions/http-exception.test.ts` | HttpException class — status code and message storage |

## Tech stack

- **Jest** — test runner
- **ts-jest** — TypeScript support for Jest
- **supertest** — HTTP assertion testing (available for integration tests)

## Adding new tests

1. Create a new file in `tests/` mirroring the source path (e.g. `src/controllers/user.controller.ts` -> `tests/controllers/user.controller.test.ts`).
2. Import from `../../src/...` relative to the test file.
3. Run `npm test` to execute.
