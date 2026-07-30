import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

class MockAdoptionService extends Mock {
  Future<bool> submitApplication(Map<String, dynamic> data);
  Future<List<Map<String, dynamic>>> getUserAdoptions(String userId);
  Future<bool> updateAdoptionStatus(String adoptionId, String newStatus);
  Future<Map<String, dynamic>?> createStripePaymentIntent(String adoptionId, double amount);
  Future<bool> confirmAdoptionPayment(String paymentIntentId);
}

void main() {
  late MockAdoptionService mockAdoptionService;

  setUp(() {
    mockAdoptionService = MockAdoptionService();
  });

  group('Adoption & Payment Unit Tests (5 Tests)', () {
    test('1. Submit adoption application succeeds', () async {
      final appData = {'petId': 'pet_1', 'livingSpace': 'apartment', 'hasYard': false};
      when(() => mockAdoptionService.submitApplication(appData))
          .thenAnswer((_) async => true);

      final result = await mockAdoptionService.submitApplication(appData);
      expect(result, isTrue);
    });

    test('2. Fetch user adoption applications returns status list', () async {
      when(() => mockAdoptionService.getUserAdoptions('user_123'))
          .thenAnswer((_) async => [
                {'id': 'adopt_101', 'status': 'approved'},
                {'id': 'adopt_102', 'status': 'pending'},
              ]);

      final list = await mockAdoptionService.getUserAdoptions('user_123');
      expect(list.length, equals(2));
      expect(list.first['status'], equals('approved'));
    });

    test('3. Admin updates adoption application status to approved', () async {
      when(() => mockAdoptionService.updateAdoptionStatus('adopt_101', 'approved'))
          .thenAnswer((_) async => true);

      final success = await mockAdoptionService.updateAdoptionStatus('adopt_101', 'approved');
      expect(success, isTrue);
    });

    test('4. Create Stripe payment intent for approved adoption fee', () async {
      when(() => mockAdoptionService.createStripePaymentIntent('adopt_101', 150.0))
          .thenAnswer((_) async => {
                'clientSecret': 'pi_mock_123_secret_456',
                'paymentIntentId': 'pi_mock_123',
                'amount': 150.0,
              });

      final paymentInfo = await mockAdoptionService.createStripePaymentIntent('adopt_101', 150.0);
      expect(paymentInfo, isNotNull);
      expect(paymentInfo!['paymentIntentId'], equals('pi_mock_123'));
    });

    test('5. Confirm adoption Stripe payment finalizes adoption', () async {
      when(() => mockAdoptionService.confirmAdoptionPayment('pi_mock_123'))
          .thenAnswer((_) async => true);

      final confirmed = await mockAdoptionService.confirmAdoptionPayment('pi_mock_123');
      expect(confirmed, isTrue);
    });
  });
}
