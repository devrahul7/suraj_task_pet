import 'package:flutter/material.dart';
// import 'package:petey_adoption_system/app/theme/app_theme.dart';
import 'package:petey_adoption_system/features/splash/presentation/pages/splash_page.dart';

class App extends StatelessWidget {
  const App({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: "PetEy",
      debugShowCheckedModeBanner: false,
      // theme: AppTheme.darkTheme,
      // darkTheme: AppTheme.darkTheme,
      // themeMode: ThemeMode.system,
      home: SplashPage());
  }
}