import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:petey_adoption_system/app/app.dart';
import 'package:petey_adoption_system/core/services/hive/hive_service.dart';
import 'package:petey_adoption_system/core/services/storage/user_session_service.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  //We can set system Ui overlaye here

  await HiveService().init();
  //Shared preferences ko object lai initialize garne
  //shared prefs: async
  //provider: sync
  //Shared prefs
  final sharedPrefs = await SharedPreferences.getInstance();
  runApp(
    ProviderScope(
      overrides: [sharedPreferencesProvider.overrideWithValue(sharedPrefs)],
      child: App(),
    ),
  );
}
