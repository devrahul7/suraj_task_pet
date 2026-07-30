import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:petey_adoption_system/features/adminDashboard/presentation/pages/admin_home_screen.dart';
import 'package:petey_adoption_system/features/adminDashboard/presentation/pages/admin_pet_screen.dart';
import 'package:petey_adoption_system/features/adminDashboard/presentation/pages/admin_profile_screen.dart';
import 'package:petey_adoption_system/features/adminDashboard/presentation/pages/admin_requests_screen.dart';
import 'package:petey_adoption_system/features/adminDashboard/presentation/pages/admin_user_screen.dart';

class AdminDashboardScreen extends ConsumerStatefulWidget {
  const AdminDashboardScreen({super.key});

  @override
  ConsumerState<AdminDashboardScreen> createState() =>
      _AdminDashboardScreenState();
}

class _AdminDashboardScreenState extends ConsumerState<AdminDashboardScreen> {
  int _selectedIndex = 0;

  final List<Widget> _screens = const [
    AdminHomeScreen(),
    AdminUsersScreen(),
    AdminPetsScreen(),
    AdminRequestsScreen(),
    AdminProfileScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,

      appBar: AppBar(
        elevation: 0,
        backgroundColor: Colors.white,
        centerTitle: true,

        leading: Padding(
          padding: const EdgeInsets.only(left: 12),
          child: GestureDetector(
            onTap: () {
              setState(() {
                _selectedIndex = 4; // Opens Admin Profile Screen
              });
            },
            child: CircleAvatar(
              radius: 18,
              backgroundColor: Colors.deepOrange.shade50,

              // Future Ready for Admin Profile Image
              child: const Icon(
                Icons.admin_panel_settings,
                color: Colors.deepOrange,
                size: 22,
              ),

              // Future Implementation:

              // backgroundImage: adminImageUrl != null
              //     ? NetworkImage(adminImageUrl!)
              //     : null,

              // child: adminImageUrl == null
              //     ? const Icon(
              //         Icons.admin_panel_settings,
              //         color: Colors.deepOrange,
              //       )
              //     : null,
            ),
          ),
        ),

        title: const Text(
          "PetEy Admin",
          style: TextStyle(
            color: Colors.black,
            fontWeight: FontWeight.bold,
            fontFamily: 'OutfitBold',
            fontSize: 24,
          ),
        ),

        actions: [
          IconButton(
            onPressed: () {},
            icon: const Icon(Icons.notifications_none, color: Colors.black),
          ),
        ],
      ),

      body: IndexedStack(index: _selectedIndex, children: _screens),

      bottomNavigationBar: BottomNavigationBar(
        type: BottomNavigationBarType.fixed,
        currentIndex: _selectedIndex,
        selectedItemColor: Colors.deepOrange,
        unselectedItemColor: Colors.grey,
        onTap: (index) {
          setState(() {
            _selectedIndex = index;
          });
        },
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.dashboard_outlined),
            activeIcon: Icon(Icons.dashboard),
            label: "Dashboard",
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.people_outline),
            activeIcon: Icon(Icons.people),
            label: "Users",
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.pets_outlined),
            activeIcon: Icon(Icons.pets),
            label: "Pets",
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.assignment_outlined),
            activeIcon: Icon(Icons.assignment),
            label: "Requests",
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person_outline),
            activeIcon: Icon(Icons.person),
            label: "Profile",
          ),
        ],
      ),
    );
  }
}
