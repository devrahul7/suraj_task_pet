import 'package:flutter_riverpod/flutter_riverpod.dart';

class AppNotification {
  final String id;
  final String title;
  final String body;
  final DateTime time;
  final String type; // 'user', 'pet', 'adoption', 'system'
  bool isRead;

  AppNotification({
    required this.id,
    required this.title,
    required this.body,
    required this.time,
    required this.type,
    this.isRead = false,
  });
}

class NotificationNotifier extends StateNotifier<List<AppNotification>> {
  NotificationNotifier() : super([]);

  void addNotification(AppNotification notification) {
    state = [notification, ...state];
  }

  void markAsRead(String id) {
    state = [
      for (final n in state)
        if (n.id == id)
          AppNotification(
            id: n.id,
            title: n.title,
            body: n.body,
            time: n.time,
            type: n.type,
            isRead: true,
          )
        else
          n,
    ];
  }

  void markAllAsRead() {
    state = [
      for (final n in state)
        AppNotification(
          id: n.id,
          title: n.title,
          body: n.body,
          time: n.time,
          type: n.type,
          isRead: true,
        ),
    ];
  }

  void deleteNotification(String id) {
    state = state.where((n) => n.id != id).toList();
  }

  int get unreadCount => state.where((n) => !n.isRead).length;
}

final notificationProvider =
    StateNotifierProvider<NotificationNotifier, List<AppNotification>>(
  (ref) => NotificationNotifier(),
);

// Admin-specific notifications
class AdminNotificationNotifier extends StateNotifier<List<AppNotification>> {
  AdminNotificationNotifier() : super([]);

  void addNotification(AppNotification notification) {
    state = [notification, ...state];
  }

  void markAsRead(String id) {
    state = [
      for (final n in state)
        if (n.id == id)
          AppNotification(
            id: n.id,
            title: n.title,
            body: n.body,
            time: n.time,
            type: n.type,
            isRead: true,
          )
        else
          n,
    ];
  }

  void markAllAsRead() {
    state = [
      for (final n in state)
        AppNotification(
          id: n.id,
          title: n.title,
          body: n.body,
          time: n.time,
          type: n.type,
          isRead: true,
        ),
    ];
  }

  void deleteNotification(String id) {
    state = state.where((n) => n.id != id).toList();
  }

  int get unreadCount => state.where((n) => !n.isRead).length;
}

final adminNotificationProvider =
    StateNotifierProvider<AdminNotificationNotifier, List<AppNotification>>(
  (ref) => AdminNotificationNotifier(),
);
