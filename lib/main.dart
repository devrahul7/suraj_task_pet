import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_stripe/flutter_stripe.dart';
import 'package:petey_adoption_system/app/app.dart';
import 'package:petey_adoption_system/core/constants/app_constants.dart';
import 'package:petey_adoption_system/core/services/hive/hive_service.dart';
import 'package:petey_adoption_system/core/services/storage/user_session_service.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // ── Stripe SDK initialisation ────────────────────────────────────────────
  Stripe.publishableKey = AppConstants.stripePublishableKey;
  await Stripe.instance.applySettings();

  // ── Hive local database ──────────────────────────────────────────────────
  await HiveService().init();

  // ── Shared Preferences ──────────────────────────────────────────────────
  final sharedPrefs = await SharedPreferences.getInstance();

  runApp(
    ProviderScope(
      overrides: [sharedPreferencesProvider.overrideWithValue(sharedPrefs)],
      child: App(),
    ),
  );
}

