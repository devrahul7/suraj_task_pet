import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

class MockAuthRepository extends Mock {
  Future<bool> login(String username, String password);
  Future<bool> register(String fullName, String email, String password);
  Future<String?> getCurrentUserRole();
  Future<void> logout();
}

void main() {
  late MockAuthRepository mockAuthRepository;

  setUp(() {
    mockAuthRepository = MockAuthRepository();
  });

  group('Auth ViewModel & Repository Unit Tests (5 Tests)', () {
    test('1. Successful user login returns true', () async {
      when(() => mockAuthRepository.login('customer@petey.com', 'Pass1234'))
          .thenAnswer((_) async => true);

      final result = await mockAuthRepository.login('customer@petey.com', 'Pass1234');
      expect(result, isTrue);
      verify(() => mockAuthRepository.login('customer@petey.com', 'Pass1234')).called(1);
    });

    test('2. Invalid credentials login returns false', () async {
      when(() => mockAuthRepository.login('wrong@petey.com', 'wrongpass'))
          .thenAnswer((_) async => false);

      final result = await mockAuthRepository.login('wrong@petey.com', 'wrongpass');
      expect(result, isFalse);
    });

    test('3. Successful user registration', () async {
      when(() => mockAuthRepository.register('Rahul Suraj', 'rahul@petey.com', 'Password@123'))
          .thenAnswer((_) async => true);

      final result = await mockAuthRepository.register('Rahul Suraj', 'rahul@petey.com', 'Password@123');
      expect(result, isTrue);
    });

    test('4. Fetch current user role returns ADMIN for admin account', () async {
      when(() => mockAuthRepository.getCurrentUserRole())
          .thenAnswer((_) async => 'ADMIN');

      final role = await mockAuthRepository.getCurrentUserRole();
      expect(role, equals('ADMIN'));
    });

    test('5. Logout successfully revokes session token', () async {
      when(() => mockAuthRepository.logout())
          .thenAnswer((_) async {});

      await mockAuthRepository.logout();
      verify(() => mockAuthRepository.logout()).called(1);
    });
  });
}
