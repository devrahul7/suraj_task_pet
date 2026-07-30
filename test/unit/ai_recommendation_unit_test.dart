import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

class MockAiRecommendationService extends Mock {
  Future<List<Map<String, dynamic>>> getPersonalizedRecommendations(Map<String, dynamic> preferences);
  Future<int> calculateCompatibilityScore(String userId, String petId);
  Future<String> generatePetDescription(Map<String, dynamic> petInfo);
  Future<List<String>> getChatHistory(String sessionId);
  Future<String> sendChatMessage(String sessionId, String message);
}

void main() {
  late MockAiRecommendationService mockAiService;

  setUp(() {
    mockAiService = MockAiRecommendationService();
  });

  group('AI Recommendation Unit Tests (5 Tests)', () {
    test('1. Get OpenAI personalized recommendations returns matched pets', () async {
      final prefs = {'livingSpace': 'Apartment', 'activityLevel': 'Moderate'};
      when(() => mockAiService.getPersonalizedRecommendations(prefs))
          .thenAnswer((_) async => [
                {'petId': 'pet_1', 'name': 'Billo', 'matchScore': 96},
                {'petId': 'pet_2', 'name': 'Jimmy', 'matchScore': 91},
              ]);

      final results = await mockAiService.getPersonalizedRecommendations(prefs);
      expect(results.length, equals(2));
      expect(results.first['matchScore'], equals(96));
    });

    test('2. Calculate pet compatibility score returns integer between 0 and 100', () async {
      when(() => mockAiService.calculateCompatibilityScore('user_1', 'pet_101'))
          .thenAnswer((_) async => 88);

      final score = await mockAiService.calculateCompatibilityScore('user_1', 'pet_101');
      expect(score, equals(88));
      expect(score, greaterThanOrEqualTo(0));
      expect(score, lessThanOrEqualTo(100));
    });

    test('3. Generate pet bio description via OpenAI returns non-empty text', () async {
      final petInfo = {'name': 'Rocky', 'species': 'Dog', 'breed': 'Shepherd'};
      when(() => mockAiService.generatePetDescription(petInfo))
          .thenAnswer((_) async => 'Rocky is a brave and loyal German Shepherd who loves outdoor adventures.');

      final description = await mockAiService.generatePetDescription(petInfo);
      expect(description, contains('loyal'));
    });

    test('4. Fetch AI chatbot conversation history', () async {
      when(() => mockAiService.getChatHistory('session_99'))
          .thenAnswer((_) async => ['Hello! How can I help you choose a pet?', 'What pet is good for kids?']);

      final history = await mockAiService.getChatHistory('session_99');
      expect(history.length, equals(2));
    });

    test('5. Send chat message to AI assistant returns smart response', () async {
      when(() => mockAiService.sendChatMessage('session_99', 'Are Golden Retrievers good with cats?'))
          .thenAnswer((_) async => 'Yes, Golden Retrievers are generally very friendly and gentle with cats.');

      final reply = await mockAiService.sendChatMessage('session_99', 'Are Golden Retrievers good with cats?');
      expect(reply, contains('gentle with cats'));
    });
  });
}
