# Security Specification for Teacher Grade Calculator

## Data Invariants

1.  **Ownership Isolation**: All data (`levels`, `classes`, `students`) is stored under `/users/{userId}`. A user can only read, create, update, or delete data where `{userId}` matches their own `request.auth.uid`.
2.  **ID Integrity**: All document IDs (`levelId`, `classId`, `studentId`) must be valid strings (alphanumeric, underscores, hyphens, max 128 chars).
3.  **Relational Consistency**: A `Student` document can only exist within the context of a `ClassRecord`.
4.  **Field Validation**:
    *   `Level`: Must have `name` and `subjects`.
    *   `ClassRecord`: Must have `termName`, `className`, `teacherName`, and `levelId`.
    *   `Student`: Must have `name`, `sex`, and `scores`.
5.  **No Blanket Access**: No collection allows public or broad authenticated read/write. Every access is scoped to the specific owner.

## The "Dirty Dozen" Payloads (PERMISSION_DENIED)

1.  **Identity Spoofing (Level)**: Attempt to create a level for another user.
    *   `POST /users/attacker_uid/levels/level1` with `auth.uid = victim_uid`
2.  **Identity Spoofing (Class)**: Attempt to read another user's class.
    *   `GET /users/victim_uid/classes/class1` with `auth.uid = attacker_uid`
3.  **ID Poisoning**: Attempt to create a class with a 2MB string as ID.
    *   `POST /users/uid/classes/VERY_LONG_ID...`
4.  **Shadow Field Injection**: Attempt to add `isAdmin: true` to a Level.
    *   `POST /users/uid/levels/level1` with `{ name: "L1", subjects: [], isAdmin: true }`
5.  **Type Mismatch**: Attempt to set `subjects` as a string instead of a list.
    *   `POST /users/uid/levels/level1` with `{ name: "L1", subjects: "not_a_list" }`
6.  **Boundary Violation**: Attempt to set a 1MB string as a student's name.
    *   `POST /users/uid/classes/c1/students/s1` with `{ name: "A".repeat(1024*1024), ... }`
7.  **Relational Orphan**: Attempt to create a student in a non-existent user path.
    *   `POST /users/non_existent/classes/c1/students/s1`
8.  **Malicious Update**: Attempt to change the `levelId` of a class (if we decide it's immutable).
    *   `UPDATE /users/uid/classes/c1` with `{ levelId: "new_level" }`
9.  **Unverified User Write**: Attempt to write data without `email_verified == true`.
10. **Cross-User Student Move**: Attempt to write a student to a class ID that doesn't belong to the user (implicitly handled by path).
11. **Metadata Manipulation**: Attempt to set `createdAt` to a future date from the client.
12. **Blanket Query Scraping**: Attempt to list all levels in the system.
    *   `QUERY /levels`

## Test Runner (firestore.rules.test.ts)

```typescript
// Note: This is a representation of the tests to be run.
// We will use these scenarios to verify our rules.

describe('Firestore Security Rules', () => {
  it('should deny cross-user access', async () => {
    // attacker tries to read victim's data
  });
  
  it('should deny invalid ID formats', async () => {
    // document ID with spaces or special chars
  });
  
  it('should enforce schema on create', async () => {
    // missing required fields
  });
});
```
