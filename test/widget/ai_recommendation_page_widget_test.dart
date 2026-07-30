import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:petey_adoption_system/features/ai/presentation/pages/ai_recommendation_page.dart';

void main() {
  Widget createWidgetUnderTest() {
    return const ProviderScope(
      child: MaterialApp(
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

    testWidgets('4. Renders Get AI Recommendations action button', (tester) async {
      await tester.pumpWidget(createWidgetUnderTest());

      expect(find.widgetWithText(ElevatedButton, 'Get AI Recommendations'), findsOneWidget);
    });
  });
}
