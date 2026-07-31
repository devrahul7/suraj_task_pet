import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:petey_adoption_system/core/api/api_client.dart';

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
  final Ref _ref;

  NotificationNotifier(this._ref, {bool autoFetch = true}) : super([]) {
    if (autoFetch) {
      _fetchFromApi();
    }
  }

  Future<void> _fetchFromApi() async {
    try {
      final apiClient = _ref.read(apiClientProvider);
      final response = await apiClient.get('/notifications');
      if (response.statusCode == 200 && response.data != null) {
        final data = response.data;
        List<dynamic> list = [];
        if (data is Map && data['data'] is List) {
          list = data['data'];
        } else if (data is List) {
          list = data;
        }

        state = list.map((json) => AppNotification(
          id: json['_id'] ?? json['id'] ?? 'n_${DateTime.now().millisecondsSinceEpoch}',
          title: json['title'] ?? 'Notification',
          body: json['body'] ?? json['message'] ?? '',
          time: DateTime.tryParse(json['createdAt'] ?? '') ?? DateTime.now(),
          type: json['type'] ?? 'system',
          isRead: json['isRead'] ?? false,
        )).toList();
      }
    } catch (_) {}
  }

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
  (ref) => NotificationNotifier(ref),
);

// Admin-specific notifications
class AdminNotificationNotifier extends StateNotifier<List<AppNotification>> {
  final Ref _ref;

  AdminNotificationNotifier(this._ref, {bool autoFetch = true}) : super([]) {
    if (autoFetch) {
      _fetchFromApi();
    }
  }

  Future<void> _fetchFromApi() async {
    try {
      final apiClient = _ref.read(apiClientProvider);
      final response = await apiClient.get('/notifications');
      if (response.statusCode == 200 && response.data != null) {
        final data = response.data;
        List<dynamic> list = [];
        if (data is Map && data['data'] is List) {
          list = data['data'];
        } else if (data is List) {
          list = data;
        }

        state = list.map((json) => AppNotification(
          id: json['_id'] ?? json['id'] ?? 'an_${DateTime.now().millisecondsSinceEpoch}',
          title: json['title'] ?? 'Notification',
          body: json['body'] ?? json['message'] ?? '',
          time: DateTime.tryParse(json['createdAt'] ?? '') ?? DateTime.now(),
          type: json['type'] ?? 'system',
          isRead: json['isRead'] ?? false,
        )).toList();
      }
    } catch (_) {}
  }

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
  (ref) => AdminNotificationNotifier(ref),
);
