import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:petey_adoption_system/core/providers/adoption_request_provider.dart';
import 'package:petey_adoption_system/core/services/storage/user_session_service.dart';
import 'package:petey_adoption_system/features/adminDashboard/presentation/pages/admin_pet_screen.dart';
import 'package:petey_adoption_system/features/adminDashboard/presentation/pages/admin_user_screen.dart';
import 'package:petey_adoption_system/core/providers/notification_provider.dart';
import 'package:petey_adoption_system/features/ai/presentation/pages/ai_recommendation_page.dart';
import 'package:shared_preferences/shared_preferences.dart';

class TestPetsNotifier extends AdminPetsNotifier {
  TestPetsNotifier(super.ref) : super(autoFetch: false) {
    state = [];
  }
}

class TestUsersNotifier extends AdminUsersNotifier {
  TestUsersNotifier(super.ref) : super(autoFetch: false) {
    state = [];
  }
}

class TestAdoptionNotifier extends AdoptionRequestNotifier {
  TestAdoptionNotifier(super.ref) : super(autoFetch: false) {
    state = [];
  }
}

class TestNotificationNotifier extends NotificationNotifier {
  TestNotificationNotifier(super.ref) : super(autoFetch: false);
}

class TestAdminNotificationNotifier extends AdminNotificationNotifier {
  TestAdminNotificationNotifier(super.ref) : super(autoFetch: false);
}

void main() {
  late SharedPreferences prefs;

  setUpAll(() async {
    SharedPreferences.setMockInitialValues({});
    prefs = await SharedPreferences.getInstance();
  });

  Widget createWidgetUnderTest() {
    return ProviderScope(
      overrides: [
        sharedPreferencesProvider.overrideWithValue(prefs),
        adminPetsProvider.overrideWith((ref) => TestPetsNotifier(ref)),
        adminUsersProvider.overrideWith((ref) => TestUsersNotifier(ref)),
        adoptionRequestProvider.overrideWith((ref) => TestAdoptionNotifier(ref)),
        notificationProvider.overrideWith((ref) => TestNotificationNotifier(ref)),
        adminNotificationProvider.overrideWith((ref) => TestAdminNotificationNotifier(ref)),
      ],
      child: const MaterialApp(
        home: AiRecommendationPage(),
      ),
    );
  }

  group('AiRecommendationPage Widget Tests (4 Tests)', () {
    testWidgets('1. Displays AI Pet Recommendation page header', (tester) async {
      await tester.pumpWidget(createWidgetUnderTest());

      expect(find.text('AI Pet Recommendation'), findsOneWidget);
    });

    testWidgets('2. Displays OpenAI matchmaker banner and preference options', (tester) async {
      await tester.pumpWidget(createWidgetUnderTest());

      expect(find.text('Your Lifestyle Preferences'), findsOneWidget);
      expect(find.text('Living Space'), findsOneWidget);
      expect(find.text('Daily Activity Level'), findsOneWidget);
      expect(find.text('Pet Experience'), findsOneWidget);
    });

    testWidgets('3. Renders switches for children and other pets', (tester) async {
      await tester.pumpWidget(createWidgetUnderTest());

      expect(find.text('Have Children at Home'), findsOneWidget);
      expect(find.text('Have Other Pets'), findsOneWidget);
    });

    testWidgets('4. Renders Calculate AI Match action button', (tester) async {
      await tester.pumpWidget(createWidgetUnderTest());

      expect(find.widgetWithText(ElevatedButton, 'Calculate AI Match'), findsOneWidget);
    });
  });
}
