import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:petey_adoption_system/core/services/storage/user_session_service.dart';
import 'package:petey_adoption_system/features/adminDashboard/presentation/pages/admin_dashboard_screen.dart';
import 'package:petey_adoption_system/features/auth/data/datasources/local/auth_local_datasource.dart';
import 'package:petey_adoption_system/features/dashboard/presentation/pages/dashboard_screen.dart';
import 'package:petey_adoption_system/features/onboarding/presentation/pages/onboarding_page.dart';

class SplashPage extends ConsumerStatefulWidget {
  const SplashPage({super.key});

  @override
  ConsumerState<SplashPage> createState() => _SplashPageState();
}

class _SplashPageState extends ConsumerState<SplashPage> {

  @override
  void initState(){
    super.initState();
    _navigateToOnboarding();
  }

  Future<void> _navigateToOnboarding() async {
    await Future.delayed(const Duration(seconds: 3)); // splash delay
    if (!mounted) return;

    final userSessionService = ref.read(userSessionServiceProvider);
    final isLoggedIn = userSessionService.isLoggedIn();

    if (isLoggedIn) {
      final role = (userSessionService.getUserRole() ?? '').toUpperCase();
      final email = (userSessionService.getUserEmail() ?? '').toLowerCase();
      final username = (userSessionService.getUsername() ?? '').toLowerCase();
      final isAdmin = role == 'ADMIN' || email == 'admin@petey.com' || username == 'admin';

      // ⚠️ Validate against Hive Database:
      // If user deleted the local database, verify if account record still exists
      if (!isAdmin) {
        final hiveUser = await ref.read(authLocalDatasourceProvider).getCurrentUser();
        if (hiveUser == null) {
          // Hive Database was deleted or user record removed -> clear session
          await userSessionService.clearUserSession();
          if (mounted) {
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(builder: (_) => OnboardingPage()),
            );
          }
          return;
        }
      }

      if (!mounted) return;
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(
          builder: (_) =>
              isAdmin ? const AdminDashboardScreen() : const DashboardScreen(),
        ),
      );
    } else {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (_) => OnboardingPage()),
      );
    }
  }
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // Icon(Icons.pets, size: 100, color: Colors.teal,),
            // SizedBox(height: 20,),

            Text("PetEy",
            style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold,),),
          ],
        ),
      ),
      
    );
  }
}