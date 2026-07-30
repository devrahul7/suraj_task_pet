# PetEy Admin Management Enhancements

This branch (`feature/admin-management-enhancements`) adds professional admin application management features to the PetEy backend **without modifying any existing code on the main branch**. All new endpoints are additive and follow the existing clean architecture (Routes → Controllers → Services → Repositories → MongoDB).

---

## New Modules

### 1. Admin Dashboard (`/api/v1/admin/dashboard`)

Provides a comprehensive admin dashboard with aggregated statistics across all modules.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/admin/dashboard` | Full dashboard (overview + monthly reports + recent activities + trends) |
| GET | `/api/v1/admin/dashboard/overview` | Overview statistics (users, pets, adoptions, blogs counts) |
| GET | `/api/v1/admin/dashboard/monthly-reports?months=6` | Monthly aggregation reports for adoptions, users, and pets |
| GET | `/api/v1/admin/dashboard/recent-activities?limit=10` | Recent activity log entries |
| GET | `/api/v1/admin/dashboard/activity-logs?page=1&limit=10&module=user&action=create` | Paginated activity logs with filters |
| GET | `/api/v1/admin/dashboard/activity-stats` | Activity stats by module, action, and daily activity (30 days) |
| GET | `/api/v1/admin/dashboard/adoption-trends` | Adoption trends by status and species |

**All endpoints require admin authentication.**

---

### 2. Notifications (`/api/v1/notifications`)

In-app notification system for users. Notifications are automatically created when adoption applications are approved, rejected, or completed.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/notifications?page=1&limit=10&unread=true` | Get paginated notifications (optional unread filter) |
| GET | `/api/v1/notifications/unread-count` | Get unread notification count |
| PATCH | `/api/v1/notifications/mark-all-read` | Mark all notifications as read |
| PATCH | `/api/v1/notifications/:id/read` | Mark a single notification as read |
| DELETE | `/api/v1/notifications/read` | Delete all read notifications |
| DELETE | `/api/v1/notifications/:id` | Delete a specific notification |

**Requires authentication.**

---

### 3. Admin User Management (`/api/v1/admin/users-management`)

Enhanced user management with search, filtering, and suspend/activate functionality.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/admin/users-management?role=USER&status=active&search=keyword&page=1&limit=10` | Get users with filters (role, status, search) |
| GET | `/api/v1/admin/users-management/stats` | Detailed user statistics (total, admins, users, suspended, active, verified, unverified) |
| PATCH | `/api/v1/admin/users-management/:id/suspend` | Suspend a user (requires reason, invalidates tokens) |
| PATCH | `/api/v1/admin/users-management/:id/activate` | Activate (unsuspend) a user |

**All endpoints require admin authentication.**

**Suspend request body:**
```json
{
  "reason": "Violation of community guidelines"
}
```

---

### 4. Admin Adoption Management (`/api/v1/admin/adoptions`)

Enhanced adoption application management with bulk operations and CSV export.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/admin/adoptions/stats` | Adoption statistics (total + status breakdown) |
| GET | `/api/v1/admin/adoptions/export?status=pending` | Export adoption data as CSV |
| GET | `/api/v1/admin/adoptions/status/:status?page=1&limit=10` | Get applications filtered by status |
| POST | `/api/v1/admin/adoptions/bulk-approve` | Bulk approve applications (auto-rejects others per pet) |
| POST | `/api/v1/admin/adoptions/bulk-reject` | Bulk reject applications |

**All endpoints require admin authentication.**

**Bulk approve/reject request body:**
```json
{
  "applicationIds": ["id1", "id2", "id3"],
  "adminNotes": "Optional notes"
}
```

---

### 5. AI Chat Sessions (`/api/v1/ai`)

Session management for the AI chat feature.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/ai/sessions` | List all chat sessions for the logged-in user |
| DELETE | `/api/v1/ai/sessions/:sessionId` | Delete a chat session and all its messages |

**Requires authentication.**

---

## New Models

### Notification Model (`src/models/notification.model.ts`)
- `userId` - Reference to User
- `type` - Notification type (adoption_submitted, adoption_approved, adoption_rejected, adoption_completed, blog_published, blog_unpublished, user_suspended, user_activated, user_role_changed, pet_created, pet_archived, system)
- `title` - Notification title
- `message` - Notification message
- `read` - Boolean read status
- `link` - Optional deep link
- `metadata` - Optional additional data
- Timestamps

### Activity Log Model (`src/models/activity-log.model.ts`)
- `actorId` - Reference to User who performed the action
- `actorName` - Name of the actor
- `actorRole` - USER or ADMIN
- `module` - Which module (user, pet, adoption, blog, ai, auth, system)
- `action` - What action was performed (create, update, delete, approve, reject, complete, cancel, suspend, activate, login, register, publish, unpublish, archive)
- `description` - Human-readable description
- `entityId` - Optional reference to the affected entity
- `entityType` - Optional entity type
- `metadata` - Optional additional data
- `ipAddress` - Optional IP address
- Timestamps

### User Model Updates (`src/models/user.model.ts`)
Added new fields for suspend/activate functionality:
- `isSuspended` - Boolean (default: false)
- `suspensionReason` - String (default: null)
- `suspendedAt` - Date (default: null)

---

## Key Improvements

### Auto-Reject on Approval
The `approveApplication` method in `AdoptionService` now automatically rejects all other pending applications for the same pet when one application is approved. This was previously a standalone method (`rejectOtherApplications`) that was never called — it is now properly wired into the approval flow.

### Notification Integration
Adoption approve, reject, and complete operations now create in-app notifications for the applicant, in addition to the existing email notifications.

### Enhanced Admin Dashboard
The admin dashboard now provides:
- **Overview**: Total counts for users (admins + regular), pets (available + adopted + pending), adoptions (total + pending), and blogs
- **Monthly Reports**: 6-month aggregation of adoptions (by status), new users, and new pets
- **Adoption Trends**: Status distribution and species-based adoption breakdown
- **Activity Logs**: Full audit trail of admin actions with filtering by module, action, and actor

### User Suspend/Activate
Admins can now suspend users with a reason. Suspending a user:
- Sets `isSuspended` to true
- Records the suspension reason and timestamp
- Increments `tokenVersion` to invalidate all active sessions
- Cannot be used on admin users (protected)

Activating a user clears all suspension fields.

---

## Architecture

All new code follows the existing clean architecture pattern:

```
Routes → Controllers → Services → Repositories → MongoDB
```

New files are organized in the existing directory structure:
- `src/models/` - New Mongoose models
- `src/repositories/` - New data access layers
- `src/services/` - New business logic layers
- `src/controllers/` - New request handlers
- `src/controllers/admin/` - New admin-specific controllers
- `src/routes/` - New route definitions
- `src/routes/admin/` - New admin route definitions
- `src/dtos/admin/` - New admin-specific DTOs

---

## Notes

- The `main` branch is completely untouched. All changes are on the `feature/admin-management-enhancements` branch.
- All new endpoints follow the existing authentication and authorization patterns (JWT + admin middleware).
- All responses use the existing `ApiResponseHelper` format for consistency.
- The User model is backward-compatible — new fields have defaults and won't affect existing documents.
