import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:petey_adoption_system/core/services/storage/user_session_service.dart';
import 'package:petey_adoption_system/features/auth/presentation/pages/register_page.dart';
import 'package:petey_adoption_system/features/auth/presentation/state/auth_state.dart';
import 'package:petey_adoption_system/features/auth/presentation/view_model/auth_view_model.dart';
import 'package:shared_preferences/shared_preferences.dart';

class FakeAuthViewModel extends AuthViewModel {
  @override
  AuthState build() => const AuthState(status: AuthStatus.initial);
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
      ],
      child: const MaterialApp(
        home: RegisterPage(),
      ),
    );
  }

  group('RegisterPage Widget Tests (4 Tests)', () {
    testWidgets('1. Displays Register To PetEy header and form fields', (tester) async {
      await tester.pumpWidget(createWidgetUnderTest());

      expect(find.text('Register To PetEy'), findsOneWidget);
      expect(find.text('Full Name'), findsOneWidget);
      expect(find.text('Email Address'), findsOneWidget);
    });

    testWidgets('2. Displays password and confirm password fields', (tester) async {
      await tester.pumpWidget(createWidgetUnderTest());

      expect(find.text('Password'), findsOneWidget);
      expect(find.text('Confirm Password'), findsOneWidget);
    });

    testWidgets('3. Renders Register action button', (tester) async {
      await tester.pumpWidget(createWidgetUnderTest());

      expect(find.text('Register'), findsWidgets);
    });

    testWidgets('4. Displays login link for existing users', (tester) async {
      await tester.pumpWidget(createWidgetUnderTest());

      expect(find.text('Already have a Account? '), findsOneWidget);
      expect(find.text('Login'), findsOneWidget);
    });
  });
}
