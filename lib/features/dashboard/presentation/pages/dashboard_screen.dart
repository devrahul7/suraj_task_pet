import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:petey_adoption_system/core/providers/notification_provider.dart';
import 'package:petey_adoption_system/core/services/storage/user_session_service.dart';
import 'package:petey_adoption_system/features/adoption/presentation/pages/book_pet_page.dart';
import 'package:petey_adoption_system/features/adoption/presentation/pages/my_adoptions_page.dart';
import 'package:petey_adoption_system/features/ai/presentation/pages/ai_recommendation_page.dart';
import 'package:petey_adoption_system/features/auth/presentation/pages/login_page.dart';
import 'package:petey_adoption_system/features/auth/presentation/view_model/auth_view_model.dart';
import 'package:petey_adoption_system/features/dashboard/presentation/pages/explore_screen.dart';
import 'package:petey_adoption_system/features/dashboard/presentation/pages/notification_screen.dart';
import 'package:petey_adoption_system/features/setting/presentation/pages/settings_screen.dart';

class DashboardScreen extends ConsumerStatefulWidget {
  const DashboardScreen({super.key});

  @override
  ConsumerState<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends ConsumerState<DashboardScreen> {
  int _selectedIndex = 0;

  final List<Map<String, String>> featuredPets = [
    {
      "name": "Jimmy",
      "breed": "Golden Retriever",
      "description":
          "Friendly, energetic retriever looking for an active family.",
      "image": "assets/images/pet.jpg",
    },
    {
      "name": "Coco",
      "breed": "Beagle",
      "description": "Playful and curious puppy who loves outdoor adventures.",
      "image": "assets/images/pet1.jpg",
    },
    {
      "name": "Billo Rani",
      "breed": "Persian Cat",
      "description":
          "Calm, affectionate cat ideal for indoor apartment living.",
      "image": "assets/images/pet2.jpeg",
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: _selectedIndex == 0
          ? AppBar(
              backgroundColor: Colors.white,
              elevation: 0.5,
              leading: Builder(
                builder: (context) => IconButton(
                  icon: const Icon(Icons.menu, color: Colors.black),
                  onPressed: () {
                    Scaffold.of(context).openDrawer();
                  },
                ),
              ),
              title: const Text(
                "PetEy",
                style: TextStyle(
                  fontSize: 24,
                  fontFamily: "OutfitBold",
                  fontWeight: FontWeight.bold,
                  color: Colors.black,
                ),
              ),
              centerTitle: true,
              actions: [
                Builder(
                  builder: (context) {
                    final notifications = ref.watch(notificationProvider);
                    final unreadCount =
                        notifications.where((n) => !n.isRead).length;

                    return Stack(
                      children: [
                        IconButton(
                          icon: const Icon(Icons.notifications_none,
                              color: Colors.black),
                          onPressed: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                  builder: (_) => const NotificationScreen()),
                            );
                          },
                        ),
                        if (unreadCount > 0)
                          Positioned(
                            right: 8,
                            top: 8,
                            child: Container(
                              padding: const EdgeInsets.all(4),
                              decoration: const BoxDecoration(
                                color: Colors.deepOrange,
                                shape: BoxShape.circle,
                              ),
                              constraints: const BoxConstraints(
                                minWidth: 16,
                                minHeight: 16,
                              ),
                              child: Text(
                                '$unreadCount',
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold,
                                ),
                                textAlign: TextAlign.center,
                              ),
                            ),
                          ),
                      ],
                    );
                  },
                ),
                IconButton(
                  icon: const Icon(Icons.settings_outlined,
                      color: Colors.black),
                  onPressed: () {
                    setState(() {
                      _selectedIndex = 3; // Switch to Settings tab
                    });
                  },
                ),
              ],
            )
          : null,
      drawer: _buildDrawer(context),
      body: IndexedStack(
        index: _selectedIndex,
        children: [
          _homeBody(),
          const ExploreScreen(),
          const MyAdoptionsPage(),
          const SettingsScreen(isAdmin: false),
        ],
      ),
      bottomNavigationBar: BottomNavigationBar(
        type: BottomNavigationBarType.fixed,
        currentIndex: _selectedIndex,
        onTap: (index) {
          setState(() {
            _selectedIndex = index;
          });
        },
        selectedItemColor: Colors.deepOrange,
        unselectedItemColor: Colors.grey,
        showSelectedLabels: true,
        showUnselectedLabels: true,
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home_outlined),
            activeIcon: Icon(Icons.home),
            label: "Home",
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.pets_outlined),
            activeIcon: Icon(Icons.pets),
            label: "Book a Pet",
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.assignment_outlined),
            activeIcon: Icon(Icons.assignment),
            label: "My Pets",
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.settings_outlined),
            activeIcon: Icon(Icons.settings),
            label: "Settings",
          ),
        ],
      ),
    );
  }

  Widget _buildDrawer(BuildContext context) {
    final session = ref.watch(userSessionServiceProvider);
    final auth = ref.watch(authViewModelProvider).authEntity;
    final name = session.getUserFullName() ?? auth?.fullName ?? 'PetEy User';
    final email = session.getUserEmail() ?? auth?.email ?? 'user@petey.com';

    return Drawer(
      child: Column(
        children: [
          UserAccountsDrawerHeader(
            decoration: const BoxDecoration(
              color: Colors.deepOrange,
            ),
            accountName: Text(
              name,
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
            ),
            accountEmail: Text(email),
            currentAccountPicture: const CircleAvatar(
              backgroundColor: Colors.white,
              child: Icon(
                Icons.pets,
                color: Colors.deepOrange,
                size: 36,
              ),
            ),
          ),
          ListTile(
            leading: const Icon(Icons.pets, color: Colors.deepOrange),
            title: const Text('Book a Pet (Available Pets)'),
            onTap: () {
              Navigator.pop(context);
              setState(() => _selectedIndex = 1);
            },
          ),
          ListTile(
            leading: const Icon(Icons.assignment_outlined, color: Colors.deepOrange),
            title: const Text('My Pets & Requests'),
            onTap: () {
              Navigator.pop(context);
              setState(() => _selectedIndex = 2);
            },
          ),
          ListTile(
            leading: const Icon(Icons.settings_outlined, color: Colors.deepOrange),
            title: const Text('Settings & Biometrics'),
            onTap: () {
              Navigator.pop(context);
              setState(() => _selectedIndex = 3);
            },
          ),
          ListTile(
            leading: const Icon(Icons.auto_awesome, color: Colors.deepOrange),
            title: const Text('AI Pet Recommendation'),
            onTap: () {
              Navigator.pop(context);
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const AiRecommendationPage()),
              );
            },
          ),
          const Divider(),
          ListTile(
            leading: const Icon(Icons.logout, color: Colors.red),
            title: const Text('Logout', style: TextStyle(color: Colors.red)),
            onTap: () {
              Navigator.pop(context); // close drawer
              showDialog(
                context: context,
                builder: (ctx) => AlertDialog(
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(20)),
                  title: const Row(
                    children: [
                      Icon(Icons.logout, color: Colors.red),
                      SizedBox(width: 8),
                      Text('Logout',
                          style: TextStyle(fontWeight: FontWeight.bold)),
                    ],
                  ),
                  content: const Text(
                      'Are you sure you want to logout from your account?'),
                  actions: [
                    TextButton(
                      onPressed: () => Navigator.pop(ctx),
                      child: const Text('Cancel'),
                    ),
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.red,
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(8)),
                      ),
                      onPressed: () async {
                        Navigator.pop(ctx);
                        await ref
                            .read(userSessionServiceProvider)
                            .clearUserSession();
                        if (context.mounted) {
                          Navigator.pushReplacement(
                            context,
                            MaterialPageRoute(
                                builder: (_) => const LoginPage()),
                          );
                        }
                      },
                      child: const Text('Logout',
                          style: TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.bold)),
                    ),
                  ],
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _homeBody() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Banner
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Colors.deepOrange, Colors.orangeAccent],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        "Adopt Your Best Friend",
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                          fontFamily: "OutfitBold",
                        ),
                      ),
                      const SizedBox(height: 6),
                      const Text(
                        "Connect with hundreds of pets waiting for a loving home.",
                        style: TextStyle(color: Colors.white70, fontSize: 13),
                      ),
                      const SizedBox(height: 14),
                      ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.white,
                          foregroundColor: Colors.deepOrange,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(10),
                          ),
                        ),
                        onPressed: () {
                          setState(() {
                            _selectedIndex = 1; // Book a Pet tab
                          });
                        },
                        child: const Text(
                          "Book Pet Now",
                          style: TextStyle(fontWeight: FontWeight.bold),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 12),
                const Icon(
                  Icons.pets,
                  size: 72,
                  color: Colors.white24,
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          // Featured Pets Section Header
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                "Featured Pets",
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  fontFamily: "OutfitBold",
                ),
              ),
              TextButton(
                onPressed: () {
                  setState(() {
                    _selectedIndex = 1; // Book a Pet tab
                  });
                },
                child: const Text("See All"),
              ),
            ],
          ),
          const SizedBox(height: 12),

          // Horizontal Featured Pets List
          SizedBox(
            height: 250,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              itemCount: featuredPets.length,
              separatorBuilder: (context, index) => const SizedBox(width: 14),
              itemBuilder: (context, index) {
                final pet = featuredPets[index];
                return Container(
                  width: 170,
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.grey.shade200,
                        blurRadius: 8,
                        spreadRadius: 2,
                      ),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      ClipRRect(
                        borderRadius: const BorderRadius.vertical(
                          top: Radius.circular(16),
                        ),
                        child: Image.asset(
                          pet["image"]!,
                          height: 120,
                          width: double.infinity,
                          fit: BoxFit.cover,
                          errorBuilder: (context, error, stackTrace) =>
                              Container(
                            height: 120,
                            color: Colors.deepOrange.shade100,
                            child: const Icon(Icons.pets,
                                size: 48, color: Colors.deepOrange),
                          ),
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.all(10),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              pet["name"]!,
                              style: const TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 16,
                              ),
                            ),
                            Text(
                              pet["breed"]!,
                              style: TextStyle(
                                fontSize: 12,
                                color: Colors.grey.shade600,
                              ),
                            ),
                            const SizedBox(height: 8),
                            SizedBox(
                              width: double.infinity,
                              child: ElevatedButton(
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: Colors.deepOrange,
                                  padding:
                                      const EdgeInsets.symmetric(vertical: 6),
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                ),
                                onPressed: () {
                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                      builder: (_) => BookPetPage(
                                        petName: pet["name"]!,
                                        petBreed: pet["breed"]!,
                                      ),
                                    ),
                                  );
                                },
                                child: const Text(
                                  "Adopt",
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontSize: 12,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
          ),
          const SizedBox(height: 24),

          // AI Helper Banner
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.deepOrange.shade50,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: Colors.deepOrange.shade100),
            ),
            child: Row(
              children: [
                const Icon(Icons.auto_awesome,
                    color: Colors.deepOrange, size: 36),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        "Not sure which pet to adopt?",
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 14,
                        ),
                      ),
                      Text(
                        "Try our AI Pet Matchmaker to find your ideal companion.",
                        style: TextStyle(
                          fontSize: 12,
                          color: Colors.grey.shade700,
                        ),
                      ),
                    ],
                  ),
                ),
                TextButton(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                          builder: (_) => const AiRecommendationPage()),
                    );
                  },
                  child: const Text("Try AI"),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
