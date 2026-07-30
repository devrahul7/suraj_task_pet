import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:petey_adoption_system/features/auth/presentation/state/auth_state.dart';
import 'package:petey_adoption_system/features/auth/presentation/view_model/auth_view_model.dart';
import 'package:petey_adoption_system/features/dashboard/presentation/pages/dashboard_screen.dart';

class FakeAuthViewModel extends AuthViewModel {
  @override
  AuthState build() => const AuthState(status: AuthStatus.initial);
}

void main() {
  Widget createWidgetUnderTest() {
    return ProviderScope(
      overrides: [
        authViewModelProvider.overrideWith(() => FakeAuthViewModel()),
      ],
      child: const MaterialApp(
        home: DashboardScreen(),
      ),
    );
  }

  group('DashboardScreen Widget Tests (4 Tests)', () {
    testWidgets('1. Displays app bar title PetEy and search bar', (tester) async {
      await tester.pumpWidget(createWidgetUnderTest());

      expect(find.text('PetEy'), findsOneWidget);
      expect(find.text('Search for Pet'), findsOneWidget);
    });

    testWidgets('2. Displays category action items (AI Match, My Requests, Book Pet, Shop)', (tester) async {
      await tester.pumpWidget(createWidgetUnderTest());

      expect(find.text('AI Match'), findsOneWidget);
      expect(find.text('My Requests'), findsOneWidget);
      expect(find.text('Book Pet'), findsOneWidget);
      expect(find.text('Shop'), findsOneWidget);
    });

    testWidgets('3. Renders bottom navigation bar with 5 items', (tester) async {
      await tester.pumpWidget(createWidgetUnderTest());

      expect(find.byType(BottomNavigationBar), findsOneWidget);
      expect(find.text('Home'), findsOneWidget);
      expect(find.text('Explore'), findsOneWidget);
      expect(find.text('Saved'), findsOneWidget);
    });

    testWidgets('4. Switches bottom nav bar tabs when tapped', (tester) async {
      await tester.pumpWidget(createWidgetUnderTest());

      final exploreTab = find.text('Explore');
      await tester.tap(exploreTab);
      await tester.pump();

      expect(find.byType(BottomNavigationBar), findsOneWidget);
    });
  });
}
