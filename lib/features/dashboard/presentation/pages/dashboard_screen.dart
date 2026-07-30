import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:petey_adoption_system/features/dashboard/presentation/pages/appontment_screen.dart';
import 'package:petey_adoption_system/features/dashboard/presentation/pages/explore_screen.dart';
import 'package:petey_adoption_system/features/dashboard/presentation/pages/notification_screen.dart';
import 'package:petey_adoption_system/features/dashboard/presentation/pages/profile_screen.dart';
import 'package:petey_adoption_system/features/dashboard/presentation/pages/wish_list_screen.dart';


class DashboardScreen extends ConsumerStatefulWidget {
  const DashboardScreen({super.key});

  @override
  ConsumerState<DashboardScreen> createState() =>
      _DashboardScreenState();
}

class _DashboardScreenState extends ConsumerState<DashboardScreen> {
  // Tracks which bottom nav tab is active
  int _selectedIndex = 0;

  final List<Map<String, String>> featuredPets = [
    {
      "name": "Jimmy",
      "description":
          "Yo kukur dherai ramro xha so better you get adopte it faster to enjoy more in life",
      "image": "assets/images/pet.jpg",
    },
    {
      "name": "Coco",
      "description":
          "Yo kukur dherai ramro xha so better you get adopte it faster to enjoy more in life",
      "image": "assets/images/pet1.jpg",
    },
    {
      "name": "Billo Rani",
      "description":
          "Yo kukur dherai ramro xha so better you get adopte it faster to enjoy more in life",
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
              elevation: 0,
              leading: IconButton(
                icon: Icon(Icons.menu, color: Colors.black),
                onPressed: () {},
              ),
              title: Text(
                "PetEy",
                style: TextStyle(
                  fontSize: 24,
                  fontFamily: "Outfit Bold",
                  fontStyle: FontStyle.italic,
                  fontWeight: FontWeight.bold,
                  color: Colors.black,
                ),
              ),
              centerTitle: true,
              actions: [
                IconButton(
                  icon: Icon(Icons.notifications, color: Colors.black),
                  onPressed: () {
                    Navigator.push(context, MaterialPageRoute(builder: (context)=>NotificationScreen()));
                  },
                ),
                IconButton(
                  icon: Icon(Icons.account_circle, color: Colors.black),
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (context) => ProfileScreen()),
                    );
                  },
                ),
              ],
            )
          : null,

      // IndexedStack: keeps all screens alive in memory.
      //Tapping a nav tab shows that screen instantly (no rebuild).
      body: IndexedStack(
        index: _selectedIndex,
        children: [
          _homeBody(),
          ExploreScreen(),
          WishListScreen(),
          AppointmentScreen(),
          ProfileScreen(),
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
        items: [
          BottomNavigationBarItem(
            icon: Icon(Icons.home_outlined),
            activeIcon: Icon(Icons.home),
            label: "Home",
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.explore_outlined),
            activeIcon: Icon(Icons.explore),
            label: "Explore",
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.favorite_border),
            activeIcon: Icon(Icons.favorite),
            label: "Saved",
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.calendar_month_outlined),
            activeIcon: Icon(Icons.calendar_month),
            label: "Appointments",
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

  Widget _homeBody() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            "Search for Pet",
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
          SizedBox(height: 10),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12),
            decoration: BoxDecoration(
              color: Colors.grey.shade200,
              borderRadius: BorderRadius.circular(30),
            ),
            child: Row(
              children: [
                Icon(Icons.search, color: Colors.grey),
                SizedBox(width: 8),
                Expanded(
                  child: TextField(
                    decoration: InputDecoration(
                      hintText: "Search",
                      border: InputBorder.none,
                    ),
                  ),
                ),
                Icon(Icons.format_list_bulleted, color: Colors.grey),
              ],
            ),
          ),

          SizedBox(height: 24),

          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              categoryItem(Icons.storefront, "Shop"),
              categoryItem(Icons.favorite, "Adopt"),
              categoryItem(Icons.pets, "Veterinarian"),
              categoryItem(Icons.add_circle_outline, "Treatment"),
            ],
          ),

          SizedBox(height: 24),

          Text(
            "Featured Pets",
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
          SizedBox(height: 12),

          ListView.separated(
            shrinkWrap: true,
            physics: NeverScrollableScrollPhysics(),
            itemCount: featuredPets.length,
            separatorBuilder: (_, _) => SizedBox(height: 10),
            itemBuilder: (context, index) {
              final pet = featuredPets[index];
              return petCard(
                name: pet["name"]!,
                description: pet["description"]!,
                imagePath: pet["image"]!,
                isFirst: index == 0,
              );
            },
          ),

          SizedBox(height: 16),

          Center(
            child: Text(
              "Contribute to our community!!",
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
            ),
          ),

          SizedBox(height: 10),
        ],
      ),
    );
  }

  Widget categoryItem(IconData icon, String label) {
    return Column(
      children: [
        Icon(icon, size: 32, color: Colors.black),
        SizedBox(height: 6),
        Text(
          label,
          style: TextStyle(fontSize: 12, fontWeight: FontWeight.w500),
        ),
      ],
    );
  }

  Widget petCard({
    required String name,
    required String description,
    required String imagePath,
    bool isFirst = false,
  }) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.pink.shade50,
        borderRadius: BorderRadius.circular(8),
        border: isFirst ? Border.all(color: Colors.blue, width: 2) : null,
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Text content
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  name,
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                ),
                SizedBox(height: 6),
                Text(
                  description,
                  style: TextStyle(fontSize: 13, color: Colors.black87),
                ),
                SizedBox(height: 8),
                Text(
                  "See More >",
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    color: Colors.black,
                  ),
                ),
              ],
            ),
          ),

          SizedBox(width: 10),

          // Pet image
          ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: Image.asset(
              imagePath,
              width: 100,
              height: 100,
              fit: BoxFit.cover,
            ),
          ),
        ],
      ),
    );
  }
}
