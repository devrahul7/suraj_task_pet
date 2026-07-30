import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:petey_adoption_system/core/providers/adoption_request_provider.dart';
import 'package:petey_adoption_system/core/services/storage/user_session_service.dart';
import 'package:petey_adoption_system/features/adminDashboard/presentation/pages/admin_pet_screen.dart';

class ExploreScreen extends ConsumerStatefulWidget {
  const ExploreScreen({super.key});

  @override
  ConsumerState<ExploreScreen> createState() => _ExploreScreenState();
}

class _ExploreScreenState extends ConsumerState<ExploreScreen> {
  void _requestAdoption(PetModel pet) {
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
                  'Book ${pet.name} for Adoption',
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
                'Submit an adoption request for ${pet.name} (${pet.breed}).',
                style: const TextStyle(fontSize: 14),
              ),
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: Colors.deepOrange.shade50,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Row(
                  children: [
                    Icon(Icons.info_outline, color: Colors.deepOrange, size: 18),
                    SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        'Admin will review your request. Once approved, the pay fee option will unlock in "My Pets".',
                        style: TextStyle(fontSize: 12, color: Colors.deepOrange),
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
                      petName: pet.name,
                      breed: pet.breed,
                      species: pet.species,
                      petImage: pet.imagePath,
                    );

                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text(
                      'Adoption request for ${pet.name} submitted! Waiting for Admin confirmation.',
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
    final availablePets = ref.watch(adminPetsProvider);

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
              child: availablePets.isEmpty
                  ? Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.pets_outlined, size: 64, color: Colors.grey.shade300),
                          const SizedBox(height: 12),
                          Text(
                            'No pets listed in database yet.\nAdmin can add new pets in Admin Dashboard.',
                            textAlign: TextAlign.center,
                            style: TextStyle(fontSize: 14, color: Colors.grey.shade500),
                          ),
                        ],
                      ),
                    )
                  : ListView.separated(
                      itemCount: availablePets.length,
                      separatorBuilder: (_, _) => const SizedBox(height: 16),
                      itemBuilder: (context, index) {
                        final pet = availablePets[index];
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
                                      child: _buildPetImage(pet.imagePath),
                                    ),
                                    const SizedBox(width: 12),
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            pet.name,
                                            style: const TextStyle(
                                              fontSize: 18,
                                              fontWeight: FontWeight.bold,
                                            ),
                                          ),
                                          Text(
                                            '${pet.species} • ${pet.breed}',
                                            style: TextStyle(color: Colors.grey.shade700),
                                          ),
                                          const SizedBox(height: 4),
                                          Text(
                                            '${pet.age} old • ${pet.gender}',
                                            style: const TextStyle(fontSize: 12, color: Colors.grey),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ],
                                ),
                                if (pet.description.isNotEmpty) ...[
                                  const SizedBox(height: 10),
                                  Text(
                                    pet.description,
                                    style: TextStyle(fontSize: 13, color: Colors.grey.shade800),
                                  ),
                                ],
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

  Widget _buildPetImage(String? path) {
    final imagePath = path ?? 'assets/images/pet.jpg';
    if (imagePath.startsWith('assets/')) {
      return Image.asset(
        imagePath,
        width: 80,
        height: 80,
        fit: BoxFit.cover,
        errorBuilder: (context, error, stackTrace) => _placeholder(),
      );
    }
    return Image.network(
      imagePath,
      width: 80,
      height: 80,
      fit: BoxFit.cover,
      errorBuilder: (context, error, stackTrace) => _placeholder(),
    );
  }

  Widget _placeholder() {
    return Container(
      width: 80,
      height: 80,
      color: Colors.deepOrange.shade100,
      child: const Icon(Icons.pets, size: 40, color: Colors.deepOrange),
    );
  }
}