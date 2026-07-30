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
  NotificationNotifier()
      : super([
          AppNotification(
            id: 'n1',
            title: 'Adoption Request Approved',
            body: 'Your adoption request for Coco (Beagle) has been approved by Admin!',
            time: DateTime.now().subtract(const Duration(minutes: 5)),
            type: 'adoption',
          ),
          AppNotification(
            id: 'n2',
            title: 'New Pet Added',
            body: 'A new pet "Billo Rani" (Persian Cat) is now available for adoption.',
            time: DateTime.now().subtract(const Duration(hours: 1)),
            type: 'pet',
          ),
          AppNotification(
            id: 'n3',
            title: 'Welcome to PetEy!',
            body: 'Start browsing pets available for adoption in your area.',
            time: DateTime.now().subtract(const Duration(hours: 3)),
            type: 'system',
            isRead: true,
          ),
        ]);

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
  AdminNotificationNotifier()
      : super([
          AppNotification(
            id: 'an1',
            title: 'New Adoption Request',
            body: 'Rahul Suraj has submitted an adoption request for Coco (Beagle).',
            time: DateTime.now().subtract(const Duration(minutes: 10)),
            type: 'adoption',
          ),
          AppNotification(
            id: 'an2',
            title: 'New User Registered',
            body: 'A new user rahul@gmail.com just registered on PetEy.',
            time: DateTime.now().subtract(const Duration(minutes: 30)),
            type: 'user',
          ),
          AppNotification(
            id: 'an3',
            title: 'Adoption Completed',
            body: 'Jimmy (Golden Retriever) has been successfully adopted.',
            time: DateTime.now().subtract(const Duration(hours: 2)),
            type: 'adoption',
            isRead: true,
          ),
        ]);

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
