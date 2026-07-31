import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:petey_adoption_system/core/providers/adoption_request_provider.dart';
import 'package:petey_adoption_system/core/services/storage/user_session_service.dart';
import 'package:petey_adoption_system/features/adminDashboard/presentation/pages/admin_pet_screen.dart';
import 'package:petey_adoption_system/features/adminDashboard/presentation/pages/admin_user_screen.dart';
import 'package:petey_adoption_system/features/adoption/presentation/pages/my_adoptions_page.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:petey_adoption_system/core/providers/notification_provider.dart';

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

class TestNotificationNotifier extends NotificationNotifier {
  TestNotificationNotifier(super.ref) : super(autoFetch: false);
}

class TestAdminNotificationNotifier extends AdminNotificationNotifier {
  TestAdminNotificationNotifier(super.ref) : super(autoFetch: false);
}

class TestAdoptionNotifier extends AdoptionRequestNotifier {
  TestAdoptionNotifier(super.ref) : super(autoFetch: false) {
    state = [
      AdoptionRequestModel(
        id: 'req_test1',
        userId: 'u1',
        userName: 'Test User',
        userEmail: 'user@petey.com',
        petId: 'p1',
        petName: 'Golden Buddy',
        breed: 'Golden Retriever',
        species: 'Dog',
        image: 'assets/images/pet.jpg',
        fee: 150.0,
        status: 'APPROVED',
        requestDate: '2026-07-30',
        adminNotes: 'Approved',
      ),
      AdoptionRequestModel(
        id: 'req_test2',
        userId: 'u1',
        userName: 'Test User',
        userEmail: 'user@petey.com',
        petId: 'p2',
        petName: 'Luna',
        breed: 'Siamese',
        species: 'Cat',
        image: 'assets/images/pet2.jpeg',
        fee: 120.0,
        status: 'PENDING',
        requestDate: '2026-07-30',
        adminNotes: 'Pending',
      ),
    ];
  }
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
        adoptionRequestProvider.overrideWith((ref) => TestAdoptionNotifier(ref)),
        adminPetsProvider.overrideWith((ref) => TestPetsNotifier(ref)),
        adminUsersProvider.overrideWith((ref) => TestUsersNotifier(ref)),
        notificationProvider.overrideWith((ref) => TestNotificationNotifier(ref)),
        adminNotificationProvider.overrideWith((ref) => TestAdminNotificationNotifier(ref)),
      ],
      child: const MaterialApp(
        home: MyAdoptionsPage(),
      ),
    );
  }

  group('MyAdoptionsPage Widget Tests (4 Tests)', () {
    testWidgets('1. Displays My Adoption Requests header title', (tester) async {
      await tester.pumpWidget(createWidgetUnderTest());

      expect(find.text('My Pets & Adoption Requests'), findsOneWidget);
    });

    testWidgets('2. Renders status badges for submitted adoptions', (tester) async {
      await tester.pumpWidget(createWidgetUnderTest());

      expect(find.text('APPROVED - PAY FEE TO ADOPT'), findsOneWidget);
      expect(find.text('WAITING ADMIN APPROVAL'), findsOneWidget);
    });

    testWidgets('3. Renders Pay Adoption Fee button for approved application', (tester) async {
      await tester.pumpWidget(createWidgetUnderTest());

      expect(find.text('Pay Adoption Fee (\$150) via Stripe'), findsOneWidget);
    });

    testWidgets('4. Displays pet names in application cards', (tester) async {
      await tester.pumpWidget(createWidgetUnderTest());

      expect(find.text('Golden Buddy'), findsOneWidget);
      expect(find.text('Luna'), findsOneWidget);
    });
  });
}
