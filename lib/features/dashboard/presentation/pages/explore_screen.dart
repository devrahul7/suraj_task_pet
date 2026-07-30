import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:petey_adoption_system/core/providers/adoption_request_provider.dart';
import 'package:petey_adoption_system/core/services/storage/user_session_service.dart';

class ExploreScreen extends ConsumerStatefulWidget {
  const ExploreScreen({super.key});

  @override
  ConsumerState<ExploreScreen> createState() => _ExploreScreenState();
}

class _ExploreScreenState extends ConsumerState<ExploreScreen> {
  final List<Map<String, String>> _availablePets = [
    {
      "id": "pet_001",
      "name": "Jimmy",
      "species": "Dog",
      "breed": "Golden Retriever",
      "age": "2 Years",
      "gender": "Male",
      "description": "Friendly, trained, and highly energetic Golden Retriever.",
      "image": "assets/images/pet.jpg",
    },
    {
      "id": "pet_002",
      "name": "Coco",
      "species": "Dog",
      "breed": "Beagle",
      "age": "1.5 Years",
      "gender": "Female",
      "description": "Sweet natured Beagle, perfect for families and children.",
      "image": "assets/images/pet1.jpg",
    },
    {
      "id": "pet_003",
      "name": "Billo Rani",
      "species": "Cat",
      "breed": "Persian",
      "age": "1 Year",
      "gender": "Female",
      "description": "Quiet, gentle indoor Persian cat looking for a quiet home.",
      "image": "assets/images/pet2.jpeg",
    },
  ];

  void _requestAdoption(Map<String, String> pet) {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          title: Row(
            children: [
              const Icon(Icons.pets, color: Colors.deepOrange),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  'Book ${pet["name"]} for Adoption',
                  style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
              ),
            ],
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Submit an adoption request for ${pet["name"]} (${pet["breed"]}).',
                style: const TextStyle(fontSize: 14),
              ),
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.amber.shade50,
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: Colors.amber.shade300),
                ),
                child: const Row(
                  children: [
                    Icon(Icons.info_outline, color: Colors.amber, size: 20),
                    SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        'Admin must review and approve your booking before finalizing the adoption.',
                        style: TextStyle(fontSize: 12, color: Colors.black87),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Cancel', style: TextStyle(color: Colors.grey)),
            ),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.deepOrange,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              ),
              onPressed: () {
                final session = ref.read(userSessionServiceProvider);
                final userName = session.getUserFullName() ?? 'Customer';
                final userEmail = session.getUserEmail() ?? 'user@petey.com';

                ref.read(adoptionRequestProvider.notifier).addRequest(
                      userName: userName,
                      userEmail: userEmail,
                      petName: pet["name"]!,
                      breed: pet["breed"]!,
                      species: pet["species"] ?? 'Dog',
                      petImage: pet["image"],
                    );

                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text(
                      'Adoption request for ${pet["name"]} submitted! Waiting for Admin confirmation.',
                    ),
                    backgroundColor: Colors.green,
                  ),
                );
              },
              child: const Text(
                'Submit Booking Request',
                style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
              ),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text(
          "Book a Pet",
          style: TextStyle(
            color: Colors.black,
            fontWeight: FontWeight.bold,
            fontFamily: "OutfitBold",
          ),
        ),
        centerTitle: true,
        backgroundColor: Colors.white,
        elevation: 0.5,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              "Pets Available for Adoption",
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, fontFamily: 'OutfitBold'),
            ),
            const SizedBox(height: 4),
            Text(
              "Select a pet to submit an adoption booking request to Admin",
              style: TextStyle(color: Colors.grey.shade600, fontSize: 13),
            ),
            const SizedBox(height: 16),
            Expanded(
              child: ListView.separated(
                itemCount: _availablePets.length,
                separatorBuilder: (_, _) => const SizedBox(height: 16),
                itemBuilder: (context, index) {
                  final pet = _availablePets[index];
                  return Card(
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    elevation: 2,
                    child: Padding(
                      padding: const EdgeInsets.all(12),
                      child: Column(
                        children: [
                          Row(
                            children: [
                              ClipRRect(
                                borderRadius: BorderRadius.circular(12),
                                child: Image.asset(
                                  pet["image"]!,
                                  width: 80,
                                  height: 80,
                                  fit: BoxFit.cover,
                                  errorBuilder: (context, error, stackTrace) => Container(
                                    width: 80,
                                    height: 80,
                                    color: Colors.deepOrange.shade100,
                                    child: const Icon(Icons.pets, color: Colors.deepOrange),
                                  ),
                                ),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      pet["name"]!,
                                      style: const TextStyle(
                                        fontSize: 18,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                    Text(
                                      '${pet["species"]} • ${pet["breed"]}',
                                      style: TextStyle(color: Colors.grey.shade700),
                                    ),
                                    const SizedBox(height: 4),
                                    Text(
                                      '${pet["age"]} old • ${pet["gender"]}',
                                      style: const TextStyle(fontSize: 12, color: Colors.grey),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 10),
                          Text(
                            pet["description"]!,
                            style: TextStyle(fontSize: 13, color: Colors.grey.shade800),
                          ),
                          const SizedBox(height: 12),
                          SizedBox(
                            width: double.infinity,
                            child: ElevatedButton.icon(
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.deepOrange,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(10),
                                ),
                              ),
                              onPressed: () => _requestAdoption(pet),
                              icon: const Icon(Icons.bookmark_add, color: Colors.white),
                              label: const Text(
                                "Book Pet / Request Adoption",
                                style: TextStyle(
                                  color: Colors.white,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}