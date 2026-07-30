import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:petey_adoption_system/features/adoption/presentation/pages/my_adoptions_page.dart';

void main() {
  Widget createWidgetUnderTest() {
    return const ProviderScope(
      child: MaterialApp(
        home: MyAdoptionsPage(),
      ),
    );
  }

  group('MyAdoptionsPage Widget Tests (4 Tests)', () {
    testWidgets('1. Displays My Adoption Requests header title', (tester) async {
      await tester.pumpWidget(createWidgetUnderTest());

      expect(find.text('My Adoption Requests'), findsOneWidget);
    });

    testWidgets('2. Renders status badges for submitted adoptions', (tester) async {
      await tester.pumpWidget(createWidgetUnderTest());

      expect(find.text('APPROVED'), findsOneWidget);
      expect(find.text('PENDING REVIEW'), findsOneWidget);
      expect(find.text('REJECTED'), findsOneWidget);
    });

    testWidgets('3. Renders Pay Adoption Fee button for approved application', (tester) async {
      await tester.pumpWidget(createWidgetUnderTest());

      expect(find.text('Pay Adoption Fee (\$150) via Stripe'), findsOneWidget);
    });

    testWidgets('4. Displays pet names in application cards', (tester) async {
      await tester.pumpWidget(createWidgetUnderTest());

      expect(find.text('Golden Buddy'), findsOneWidget);
      expect(find.text('Luna'), findsOneWidget);
      expect(find.text('Rocky'), findsOneWidget);
    });
  });
}
