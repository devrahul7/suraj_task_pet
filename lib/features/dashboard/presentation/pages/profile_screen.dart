import 'package:flutter/material.dart';
import 'package:petey_adoption_system/features/setting/presentation/pages/settings_screen.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const SettingsScreen(isAdmin: false);
  }
}
