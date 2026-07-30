import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
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

          const ActivityTile(
            title: "New User Registered (rahul@petey.com)",
            subtitle: "2 minutes ago",
          ),
          const ActivityTile(
            title: "Adoption Request Submitted for Coco (Beagle)",
            subtitle: "10 minutes ago",
          ),
          const ActivityTile(
            title: "New Pet Listed: Billo Rani (Persian Cat)",
            subtitle: "20 minutes ago",
          ),
        ],
      ),
    );
  }
}