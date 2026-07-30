import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:petey_adoption_system/features/auth/presentation/pages/login_page.dart';
import 'package:petey_adoption_system/features/auth/presentation/state/auth_state.dart';
import 'package:petey_adoption_system/features/auth/presentation/view_model/auth_view_model.dart';

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
        home: LoginPage(),
      ),
    );
  }

  group('LoginPage Widget Tests (4 Tests)', () {
    testWidgets('1. Displays Welcome to PetEy header and form input fields', (tester) async {
      await tester.pumpWidget(createWidgetUnderTest());

      expect(find.text('Welcome to PetEy'), findsOneWidget);
      expect(find.text('Email Address'), findsOneWidget);
      expect(find.text('Password'), findsOneWidget);
      expect(find.widgetWithText(ElevatedButton, 'Login'), findsOneWidget);
    });

    testWidgets('2. Shows validation error when login tapped with empty fields', (tester) async {
      await tester.pumpWidget(createWidgetUnderTest());

      final loginBtn = find.widgetWithText(ElevatedButton, 'Login');
      await tester.tap(loginBtn);
      await tester.pump();

      expect(find.text('Please enter email'), findsOneWidget);
      expect(find.text('Please enter password'), findsOneWidget);
    });

    testWidgets('3. Toggles password visibility icon on tap', (tester) async {
      await tester.pumpWidget(createWidgetUnderTest());

      final toggleIcon = find.byIcon(Icons.visibility_outlined);
      expect(toggleIcon, findsOneWidget);

      await tester.tap(toggleIcon);
      await tester.pump();

      expect(find.byIcon(Icons.visibility_off_outlined), findsOneWidget);
    });

    testWidgets('4. Displays Register Now link button', (tester) async {
      await tester.pumpWidget(createWidgetUnderTest());

      expect(find.text('Don’t have an account? '), findsOneWidget);
      expect(find.text('Register Now'), findsOneWidget);
    });
  });
}
