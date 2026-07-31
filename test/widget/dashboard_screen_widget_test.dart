import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:petey_adoption_system/core/providers/adoption_request_provider.dart';
import 'package:petey_adoption_system/core/services/storage/user_session_service.dart';
import 'package:petey_adoption_system/features/adminDashboard/presentation/pages/admin_pet_screen.dart';
import 'package:petey_adoption_system/features/adminDashboard/presentation/pages/admin_user_screen.dart';
import 'package:petey_adoption_system/features/auth/presentation/state/auth_state.dart';
import 'package:petey_adoption_system/features/auth/presentation/view_model/auth_view_model.dart';
import 'package:petey_adoption_system/features/dashboard/presentation/pages/dashboard_screen.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:petey_adoption_system/core/providers/notification_provider.dart';

class FakeAuthViewModel extends AuthViewModel {
  @override
  AuthState build() => const AuthState(status: AuthStatus.initial);
}

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
        authViewModelProvider.overrideWith(() => FakeAuthViewModel()),
        adminPetsProvider.overrideWith((ref) => TestPetsNotifier(ref)),
        adminUsersProvider.overrideWith((ref) => TestUsersNotifier(ref)),
        adoptionRequestProvider.overrideWith((ref) => TestAdoptionNotifier(ref)),
        notificationProvider.overrideWith((ref) => TestNotificationNotifier(ref)),
        adminNotificationProvider.overrideWith((ref) => TestAdminNotificationNotifier(ref)),
      ],
      child: const MaterialApp(
        home: DashboardScreen(),
      ),
    );
  }

  group('DashboardScreen Widget Tests (4 Tests)', () {
    testWidgets('1. Displays banner title Adopt Your Best Friend', (tester) async {
      await tester.pumpWidget(createWidgetUnderTest());

      expect(find.text('Adopt Your Best Friend'), findsOneWidget);
      expect(find.text('Featured Pets'), findsOneWidget);
    });

    testWidgets('2. Displays AI Pet Matchmaker section', (tester) async {
      await tester.pumpWidget(createWidgetUnderTest());

      expect(find.text('Not sure which pet to adopt?'), findsOneWidget);
      expect(find.text('Try AI'), findsOneWidget);
    });

    testWidgets('3. Renders bottom navigation bar with items', (tester) async {
      await tester.pumpWidget(createWidgetUnderTest());

      expect(find.byType(BottomNavigationBar), findsOneWidget);
      expect(find.text('Home'), findsOneWidget);
      expect(find.text('Book a Pet'), findsOneWidget);
      expect(find.text('My Pets'), findsOneWidget);
    });

    testWidgets('4. Switches bottom nav bar tabs when tapped', (tester) async {
      await tester.pumpWidget(createWidgetUnderTest());

      final bookTab = find.text('Book a Pet');
      await tester.tap(bookTab);
      await tester.pumpAndSettle();

      expect(find.byType(BottomNavigationBar), findsOneWidget);
    });
  });
}
