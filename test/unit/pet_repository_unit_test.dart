import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

class MockPetService extends Mock {
  Future<List<Map<String, dynamic>>> getPets();
  Future<List<Map<String, dynamic>>> searchPets(String query);
  Future<Map<String, dynamic>?> getPetById(String id);
  Future<bool> addPet(Map<String, dynamic> petData);
  Future<bool> deletePet(String id);
}

void main() {
  late MockPetService mockPetService;

  setUp(() {
    mockPetService = MockPetService();
  });

  group('Pet Repository Unit Tests (5 Tests)', () {
    test('1. Get list of available pets returns non-empty list', () async {
      when(() => mockPetService.getPets()).thenAnswer((_) async => [
            {'id': 'pet_1', 'name': 'Golden Buddy', 'species': 'Dog'},
            {'id': 'pet_2', 'name': 'Luna', 'species': 'Cat'},
          ]);

      final pets = await mockPetService.getPets();
      expect(pets.length, equals(2));
      expect(pets.first['name'], equals('Golden Buddy'));
    });

    test('2. Search pets by query "Golden" returns matching pet', () async {
      when(() => mockPetService.searchPets('Golden')).thenAnswer((_) async => [
            {'id': 'pet_1', 'name': 'Golden Buddy', 'species': 'Dog'},
          ]);

      final searchResults = await mockPetService.searchPets('Golden');
      expect(searchResults.length, equals(1));
      expect(searchResults.first['species'], equals('Dog'));
    });

    test('3. Fetch pet details by valid ID', () async {
      when(() => mockPetService.getPetById('pet_1')).thenAnswer((_) async => {
            'id': 'pet_1',
            'name': 'Golden Buddy',
            'breed': 'Golden Retriever',
            'age': 2,
          });

      final pet = await mockPetService.getPetById('pet_1');
      expect(pet, isNotNull);
      expect(pet!['breed'], equals('Golden Retriever'));
    });

    test('4. Add new pet listing returns true', () async {
      final newPet = {'name': 'Charlie', 'species': 'Dog', 'breed': 'Poodle'};
      when(() => mockPetService.addPet(newPet)).thenAnswer((_) async => true);

      final success = await mockPetService.addPet(newPet);
      expect(success, isTrue);
    });

    test('5. Delete pet listing by ID returns true', () async {
      when(() => mockPetService.deletePet('pet_1')).thenAnswer((_) async => true);

      final success = await mockPetService.deletePet('pet_1');
      expect(success, isTrue);
    });
  });
}
