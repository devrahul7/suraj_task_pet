import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:petey_adoption_system/core/providers/notification_provider.dart';
import 'package:petey_adoption_system/features/adminDashboard/presentation/pages/activity_tile.dart';
import 'package:petey_adoption_system/features/adminDashboard/presentation/pages/admin_pet_screen.dart';
import 'package:petey_adoption_system/features/adminDashboard/presentation/pages/admin_user_screen.dart';
import 'package:petey_adoption_system/features/adminDashboard/presentation/pages/dashboard_card.dart';

class AdminHomeScreen extends ConsumerWidget {
  const AdminHomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Dynamic Real Data Metrics from State
    final users = ref.watch(adminUsersProvider);
    final pets = ref.watch(adminPetsProvider);
    final adminNotifications = ref.watch(adminNotificationProvider);

    final totalUsersCount = users.length.toString();
    final totalPetsCount = pets.length.toString();
    final availablePetsCount =
        pets.where((p) => p.status == 'AVAILABLE').length.toString();
    final adoptedPetsCount =
        pets.where((p) => p.status == 'ADOPTED').length.toString();

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            "Welcome Back Admin!",
            style: TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.bold,
              fontFamily: 'OutfitBold',
            ),
          ),
          const SizedBox(height: 4),
          Text(
            "Real-time overview of registered users, pets & adoption statistics.",
            style: TextStyle(
              color: Colors.grey.shade600,
              fontSize: 13,
            ),
          ),
          const SizedBox(height: 16),

          GridView.count(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            crossAxisCount: 2,
            crossAxisSpacing: 12,
            mainAxisSpacing: 12,
            childAspectRatio: 1.25,
            children: [
              DashboardCard(
                title: "Users",
                value: totalUsersCount,
                icon: Icons.people,
              ),
              DashboardCard(
                title: "Total Pets",
                value: totalPetsCount,
                icon: Icons.pets,
              ),
              DashboardCard(
                title: "Available",
                value: availablePetsCount,
                icon: Icons.assignment,
              ),
              DashboardCard(
                title: "Adopted",
                value: adoptedPetsCount,
                icon: Icons.favorite,
              ),
            ],
          ),

          const SizedBox(height: 20),

          const Text(
            "Recent System Activity",
            style: TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 17,
              fontFamily: 'OutfitBold',
            ),
          ),
          const SizedBox(height: 10),

          if (adminNotifications.isEmpty) ...[
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.grey.shade50,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.grey.shade200),
              ),
              child: Text(
                "No recent system activity.",
                textAlign: TextAlign.center,
                style: TextStyle(color: Colors.grey.shade600, fontSize: 13),
              ),
            ),
          ] else ...[
            ...adminNotifications.take(5).map(
                  (item) => ActivityTile(
                    title: "${item.title}: ${item.body}",
                    subtitle: _formatTimeAgo(item.time),
                  ),
                ),
          ],
        ],
      ),
    );
  }

  static String _formatTimeAgo(DateTime time) {
    final diff = DateTime.now().difference(time);
    if (diff.inMinutes < 1) return 'Just now';
    if (diff.inMinutes < 60) return '${diff.inMinutes}m ago';
    if (diff.inHours < 24) return '${diff.inHours}h ago';
    return '${diff.inDays}d ago';
  }
}