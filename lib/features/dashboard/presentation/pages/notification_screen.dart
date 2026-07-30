import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:petey_adoption_system/core/providers/notification_provider.dart';

class NotificationScreen extends ConsumerWidget {
  final bool isAdmin;
  const NotificationScreen({super.key, this.isAdmin = false});

  void _markAllAsRead(WidgetRef ref) {
    if (isAdmin) {
      ref.read(adminNotificationProvider.notifier).markAllAsRead();
    } else {
      ref.read(notificationProvider.notifier).markAllAsRead();
    }
  }

  void _markAsRead(WidgetRef ref, String id) {
    if (isAdmin) {
      ref.read(adminNotificationProvider.notifier).markAsRead(id);
    } else {
      ref.read(notificationProvider.notifier).markAsRead(id);
    }
  }

  void _deleteNotification(WidgetRef ref, String id) {
    if (isAdmin) {
      ref.read(adminNotificationProvider.notifier).deleteNotification(id);
    } else {
      ref.read(notificationProvider.notifier).deleteNotification(id);
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final notifications = isAdmin
        ? ref.watch(adminNotificationProvider)
        : ref.watch(notificationProvider);

    final unread = notifications.where((n) => !n.isRead).length;

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0.5,
        title: Row(
          children: [
            const Text(
              'Notifications',
              style: TextStyle(
                color: Colors.black,
                fontWeight: FontWeight.bold,
                fontFamily: 'OutfitBold',
              ),
            ),
            if (unread > 0) ...[
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                decoration: BoxDecoration(
                  color: Colors.deepOrange,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  '$unread',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 11,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ],
        ),
        iconTheme: const IconThemeData(color: Colors.black),
        actions: [
          if (unread > 0)
            TextButton(
              onPressed: () => _markAllAsRead(ref),
              child: const Text(
                'Mark all read',
                style: TextStyle(color: Colors.deepOrange, fontSize: 13),
              ),
            ),
        ],
      ),
      body: notifications.isEmpty
          ? _EmptyNotifications()
          : ListView.builder(
              padding: const EdgeInsets.symmetric(vertical: 8),
              itemCount: notifications.length,
              itemBuilder: (context, index) {
                final n = notifications[index];
                return _NotificationTile(
                  notification: n,
                  onTap: () => _markAsRead(ref, n.id),
                  onDismiss: () => _deleteNotification(ref, n.id),
                );
              },
            ),
    );
  }
}

class _EmptyNotifications extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.notifications_none_outlined,
              size: 72, color: Colors.grey.shade300),
          const SizedBox(height: 16),
          Text(
            'No Notifications',
            style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Colors.grey.shade500),
          ),
          const SizedBox(height: 6),
          Text(
            "You're all caught up!",
            style: TextStyle(color: Colors.grey.shade400),
          ),
        ],
      ),
    );
  }
}

class _NotificationTile extends StatelessWidget {
  final AppNotification notification;
  final VoidCallback onTap;
  final VoidCallback onDismiss;

  const _NotificationTile({
    required this.notification,
    required this.onTap,
    required this.onDismiss,
  });

  IconData _iconFor(String type) {
    switch (type) {
      case 'adoption':
        return Icons.pets;
      case 'pet':
        return Icons.add_circle_outline;
      case 'user':
        return Icons.person_add_outlined;
      default:
        return Icons.notifications_outlined;
    }
  }

  Color _colorFor(String type) {
    switch (type) {
      case 'adoption':
        return Colors.green;
      case 'pet':
        return Colors.deepOrange;
      case 'user':
        return Colors.blue;
      default:
        return Colors.purple;
    }
  }

  String _timeAgo(DateTime time) {
    final diff = DateTime.now().difference(time);
    if (diff.inMinutes < 60) return '${diff.inMinutes}m ago';
    if (diff.inHours < 24) return '${diff.inHours}h ago';
    return '${diff.inDays}d ago';
  }

  @override
  Widget build(BuildContext context) {
    final color = _colorFor(notification.type);
    final isUnread = !notification.isRead;

    return Dismissible(
      key: Key(notification.id),
      direction: DismissDirection.endToStart,
      onDismissed: (_) => onDismiss(),
      background: Container(
        alignment: Alignment.centerRight,
        padding: const EdgeInsets.only(right: 20),
        color: Colors.red.shade400,
        child: const Icon(Icons.delete_outline, color: Colors.white, size: 28),
      ),
      child: InkWell(
        onTap: onTap,
        child: Container(
          margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
          decoration: BoxDecoration(
            color: isUnread ? color.withAlpha(13) : Colors.white,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(
              color: isUnread ? color.withAlpha(51) : Colors.grey.shade200,
            ),
          ),
          child: Padding(
            padding: const EdgeInsets.all(14),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: color.withAlpha(26),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(_iconFor(notification.type), color: color, size: 22),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Expanded(
                            child: Text(
                              notification.title,
                              style: TextStyle(
                                fontWeight: isUnread
                                    ? FontWeight.bold
                                    : FontWeight.w500,
                                fontSize: 14,
                              ),
                            ),
                          ),
                          if (isUnread)
                            Container(
                              width: 8,
                              height: 8,
                              decoration: BoxDecoration(
                                  color: color, shape: BoxShape.circle),
                            ),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Text(
                        notification.body,
                        style: TextStyle(
                            fontSize: 12, color: Colors.grey.shade600),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 6),
                      Text(
                        _timeAgo(notification.time),
                        style: TextStyle(
                            fontSize: 11, color: Colors.grey.shade400),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}