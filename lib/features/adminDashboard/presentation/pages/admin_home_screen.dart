import 'package:flutter/material.dart';
import 'package:petey_adoption_system/features/adminDashboard/presentation/pages/activity_tile.dart';
import 'package:petey_adoption_system/features/adminDashboard/presentation/pages/dashboard_card.dart';

class AdminHomeScreen extends StatelessWidget {
  const AdminHomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [

          const Text(
            "Welcome Back Admin!",
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
            ),
          ),

          const SizedBox(height: 5),

          Text(
            "Manage users, pets and adoption requests.",
            style: TextStyle(
              color: Colors.grey.shade600,
            ),
          ),

          const SizedBox(height: 25),

          GridView.count(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            crossAxisCount: 2,
            crossAxisSpacing: 15,
            mainAxisSpacing: 15,
            childAspectRatio: 1.2,
            children: const [
              DashboardCard(
                title: "Users",
                value: "120",
                icon: Icons.people,
              ),
              DashboardCard(
                title: "Pets",
                value: "85",
                icon: Icons.pets,
              ),
              DashboardCard(
                title: "Requests",
                value: "32",
                icon: Icons.assignment,
              ),
              DashboardCard(
                title: "Adopted",
                value: "45",
                icon: Icons.favorite,
              ),
            ],
          ),

          const SizedBox(height: 30),

          const Text(
            "Recent Activity",
            style: TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 18,
            ),
          ),

          const SizedBox(height: 15),

          const ActivityTile(
            title: "New User Registered",
            subtitle: "2 minutes ago",
          ),

          const ActivityTile(
            title: "Adoption Request Submitted",
            subtitle: "10 minutes ago",
          ),

          const ActivityTile(
            title: "Pet Added Successfully",
            subtitle: "20 minutes ago",
          ),
        ],
      ),
    );
  }
}