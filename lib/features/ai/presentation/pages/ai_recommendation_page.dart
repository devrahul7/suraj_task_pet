import 'dart:async';
import 'dart:convert';
import 'dart:math';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:sensors_plus/sensors_plus.dart';
import 'package:petey_adoption_system/core/constants/app_constants.dart';
import 'package:petey_adoption_system/features/adminDashboard/presentation/pages/admin_pet_screen.dart';

class AiRecommendationPage extends ConsumerStatefulWidget {
  const AiRecommendationPage({super.key});

  @override
  ConsumerState<AiRecommendationPage> createState() =>
      _AiRecommendationPageState();
}

class _AiRecommendationPageState extends ConsumerState<AiRecommendationPage> {
  String _homeType = 'Apartment';
  String _activityLevel = 'Moderate';
  bool _hasChildren = false;
  bool _hasOtherPets = false;
  String _experience = 'Beginner';
  bool _isGenerating = false;
  List<Map<String, dynamic>> _recommendations = [];

  // Sensor Shake Detection
  StreamSubscription<UserAccelerometerEvent>? _accelerometerSubscription;
  DateTime _lastShakeTime = DateTime.now();
  static const double _shakeThreshold = 15.0; // Acceleration magnitude threshold

  @override
  void initState() {
    super.initState();
    _initAccelerometer();
  }

  @override
  void dispose() {
    _accelerometerSubscription?.cancel();
    super.dispose();
  }

  void _initAccelerometer() {
    _accelerometerSubscription = userAccelerometerEventStream().listen((event) {
      final double acceleration = sqrt(
        event.x * event.x + event.y * event.y + event.z * event.z,
      );

      final now = DateTime.now();
      if (acceleration > _shakeThreshold &&
          now.difference(_lastShakeTime) > const Duration(seconds: 2)) {
        _lastShakeTime = now;
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('📱 Accelerometer Sensor: Shake detected! Auto-recalculating AI Matches...'),
              duration: Duration(seconds: 2),
              backgroundColor: Colors.deepOrange,
            ),
          );
          _calculateAiRecommendations();
        }
      }
    });
  }

  void _calculateAiRecommendations() async {
    setState(() {
      _recommendations.clear();
      _isGenerating = true;
    });

    final availablePets = ref.read(adminPetsProvider);
    if (availablePets.isEmpty) {
      if (mounted) setState(() => _isGenerating = false);
      return;
    }

    // Try calling OpenAI API
    try {
      final petsSummary = availablePets.map((p) => {
        'id': p.id,
        'name': p.name,
        'species': p.species,
        'breed': p.breed,
        'age': p.age,
        'gender': p.gender,
      }).toList();

      final dio = Dio();
      final response = await dio.post(
        'https://api.openai.com/v1/chat/completions',
        data: {
          'model': 'gpt-4o-mini',
          'messages': [
            {
              'role': 'system',
              'content': 'You are an AI Pet Matchmaker. Evaluate each pet against the user profile and return ONLY a valid JSON array of objects with keys: "id", "matchScore" (integer 60-99), and "reason" (1 sentence explanation).',
            },
            {
              'role': 'user',
              'content': '''
User Profile:
- Home: $_homeType
- Activity Level: $_activityLevel
- Experience: $_experience
- Children at Home: $_hasChildren
- Has Other Pets: $_hasOtherPets

Available Pets:
${jsonEncode(petsSummary)}
''',
            }
          ],
          'temperature': 0.7,
        },
        options: Options(
          headers: {
            'Authorization': 'Bearer ${AppConstants.openAiApiKey}',
            'Content-Type': 'application/json',
          },
        ),
      );

      final content = response.data['choices'][0]['message']['content'] as String;
      final cleanedContent = content.replaceAll(RegExp(r'```json|```'), '').trim();
      final List<dynamic> parsedJson = jsonDecode(cleanedContent);

      final List<Map<String, dynamic>> aiScoredPets = [];
      for (final pet in availablePets) {
        final match = parsedJson.firstWhere(
          (item) => item['id'] == pet.id,
          orElse: () => null,
        );

        final int score = match != null && match['matchScore'] != null
            ? (match['matchScore'] as num).toInt()
            : 80;
        final String reason = match != null && match['reason'] != null
            ? match['reason'].toString()
            : 'AI analyzed match based on your lifestyle.';

        aiScoredPets.add({
          'id': pet.id,
          'name': pet.name,
          'species': pet.species,
          'breed': pet.breed,
          'age': pet.age,
          'gender': pet.gender,
          'matchScore': score,
          'reason': '🤖 OpenAI GPT: $reason',
          'image': pet.imagePath ?? 'assets/images/pet.jpg',
        });
      }

      aiScoredPets.sort((a, b) => (b['matchScore'] as int).compareTo(a['matchScore'] as int));

      if (mounted) {
        setState(() {
          _isGenerating = false;
          _recommendations = aiScoredPets;
        });
      }
      return;
    } catch (e) {
      // Fallback to local algorithmic calculation if offline or API error
    }

    // ── Local Fallback Algorithmic Scoring ──────────────────────────────────
    if (!mounted) return;

    final List<Map<String, dynamic>> scoredPets = [];

    for (final pet in availablePets) {
      int score = 70;
      final List<String> reasons = [];

      if (_homeType == 'Apartment') {
        if (pet.species == 'Cat' || pet.breed.toLowerCase().contains('persian') || pet.breed.toLowerCase().contains('pug')) {
          score += 15;
          reasons.add('Ideal for apartment spaces');
        } else if (pet.species == 'Dog' && (pet.breed.toLowerCase().contains('retriever') || pet.breed.toLowerCase().contains('german'))) {
          score -= 10;
          reasons.add('Requires larger outdoor space');
        }
      } else if (_homeType == 'House with Yard' || _homeType == 'Farm') {
        if (pet.species == 'Dog') {
          score += 15;
          reasons.add('Loves spacious outdoor yards');
        }
      }

      if (_activityLevel == 'Low / Calm') {
        if (pet.species == 'Cat' || pet.age.contains('Older') || pet.age.contains('Senior')) {
          score += 12;
          reasons.add('Calm demeanor matches low activity lifestyle');
        }
      } else if (_activityLevel == 'High / Energetic') {
        if (pet.species == 'Dog') {
          score += 12;
          reasons.add('Great companion for energetic activities');
        }
      }

      if (_hasChildren) {
        if (pet.breed.toLowerCase().contains('retriever') || pet.species == 'Cat' || pet.breed.toLowerCase().contains('beagle')) {
          score += 10;
          reasons.add('Gentle and safe around children');
        }
      }

      if (_hasOtherPets) {
        score += 5;
        reasons.add('Friendly and highly social with other pets');
      }

      if (_experience == 'Beginner') {
        if (pet.species == 'Cat' || pet.breed.toLowerCase().contains('retriever') || pet.breed.toLowerCase().contains('beagle')) {
          score += 8;
          reasons.add('Easy to care for and beginner-friendly');
        }
      }

      score = score.clamp(60, 98);

      final String mainReason = reasons.isNotEmpty
          ? '${reasons.join('. ')}.'
          : 'Good overall match based on your lifestyle profile.';

      scoredPets.add({
        'id': pet.id,
        'name': pet.name,
        'species': pet.species,
        'breed': pet.breed,
        'age': pet.age,
        'gender': pet.gender,
        'matchScore': score,
        'reason': mainReason,
        'image': pet.imagePath ?? 'assets/images/pet.jpg',
      });
    }

    scoredPets.sort((a, b) => (b['matchScore'] as int).compareTo(a['matchScore'] as int));

    setState(() {
      _isGenerating = false;
      _recommendations = scoredPets;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text(
          'AI Pet Recommendation',
          style: TextStyle(
            color: Colors.black,
            fontWeight: FontWeight.bold,
            fontFamily: 'OutfitBold',
          ),
        ),
        backgroundColor: Colors.white,
        elevation: 0.5,
        iconTheme: const IconThemeData(color: Colors.black),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // AI Header Banner
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [Colors.deepOrange.shade400, Colors.orange.shade300],
                ),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Row(
                children: const [
                  Icon(Icons.auto_awesome, color: Colors.white, size: 40),
                  SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      'AI Lifestyle Matchmaker Engine\nCalculates real-time compatibility scores for available pets!',
                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 14,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),

            // Accelerometer Sensor Indicator
            GestureDetector(
              onTap: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('📱 Shake Phone or Tap to trigger Accelerometer recalculation!'),
                    duration: Duration(seconds: 2),
                    backgroundColor: Colors.deepOrange,
                  ),
                );
                _calculateAiRecommendations();
              },
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                decoration: BoxDecoration(
                  color: Colors.amber.shade50,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.amber.shade300),
                ),
                child: Row(
                  children: const [
                    Icon(Icons.vibration, color: Colors.amber, size: 22),
                    SizedBox(width: 10),
                    Expanded(
                      child: Text(
                        'Hardware Sensor: Shake device physically to trigger accelerometer recalculation!',
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          color: Colors.brown,
                        ),
                      ),
                    ),
                    Icon(Icons.refresh, color: Colors.brown, size: 18),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 20),

            const Text(
              'Your Lifestyle Preferences',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),

            DropdownButtonFormField<String>(
              initialValue: _homeType,
              decoration: InputDecoration(
                labelText: 'Living Space',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
              items: ['Apartment', 'House with Yard', 'Farm']
                  .map((e) => DropdownMenuItem(value: e, child: Text(e)))
                  .toList(),
              onChanged: (val) => setState(() => _homeType = val!),
            ),
            const SizedBox(height: 14),

            DropdownButtonFormField<String>(
              initialValue: _activityLevel,
              decoration: InputDecoration(
                labelText: 'Daily Activity Level',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
              items: ['Low / Calm', 'Moderate', 'High / Energetic']
                  .map((e) => DropdownMenuItem(value: e, child: Text(e)))
                  .toList(),
              onChanged: (val) => setState(() => _activityLevel = val!),
            ),
            const SizedBox(height: 14),

            DropdownButtonFormField<String>(
              initialValue: _experience,
              decoration: InputDecoration(
                labelText: 'Pet Experience',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
              items: ['Beginner', 'Intermediate', 'Expert']
                  .map((e) => DropdownMenuItem(value: e, child: Text(e)))
                  .toList(),
              onChanged: (val) => setState(() => _experience = val!),
            ),
            const SizedBox(height: 10),

            SwitchListTile(
              title: const Text('Have Children at Home'),
              value: _hasChildren,
              activeThumbColor: Colors.deepOrange,
              onChanged: (val) => setState(() => _hasChildren = val),
            ),
            SwitchListTile(
              title: const Text('Have Other Pets'),
              value: _hasOtherPets,
              activeThumbColor: Colors.deepOrange,
              onChanged: (val) => setState(() => _hasOtherPets = val),
            ),
            const SizedBox(height: 20),

            SizedBox(
              width: double.infinity,
              height: 50,
              child: ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.deepOrange,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                onPressed: _isGenerating ? null : _calculateAiRecommendations,
                icon: const Icon(Icons.auto_awesome, color: Colors.white),
                label: _isGenerating
                    ? const SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(
                          color: Colors.white,
                          strokeWidth: 2,
                        ),
                      )
                    : const Text(
                        'Calculate AI Match',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
              ),
            ),

            if (_recommendations.isNotEmpty) ...[
              const SizedBox(height: 28),
              const Text(
                'AI Recommended Matches',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 12),
              ..._recommendations.map((item) => _buildRecommendationCard(item)),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildRecommendationCard(Map<String, dynamic> item) {
    final score = item['matchScore'] as int;

    return Card(
      margin: const EdgeInsets.only(bottom: 14),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
      elevation: 2,
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(10),
              child: _buildPetImage(item['image']),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        item['name'],
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 4,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.green.shade100,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(
                          '$score% Match',
                          style: TextStyle(
                            color: Colors.green.shade900,
                            fontWeight: FontWeight.bold,
                            fontSize: 12,
                          ),
                        ),
                      ),
                    ],
                  ),
                  Text(
                    '${item['breed']} (${item['species']})',
                    style: TextStyle(color: Colors.grey.shade700, fontSize: 13),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    item['reason'],
                    style: const TextStyle(fontSize: 12, color: Colors.black87),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPetImage(String path) {
    if (path.startsWith('assets/')) {
      return Image.asset(
        path,
        width: 75,
        height: 75,
        fit: BoxFit.cover,
        errorBuilder: (context, error, stackTrace) => _placeholder(),
      );
    }
    return Image.network(
      path,
      width: 75,
      height: 75,
      fit: BoxFit.cover,
      errorBuilder: (context, error, stackTrace) => _placeholder(),
    );
  }

  Widget _placeholder() {
    return Container(
      width: 75,
      height: 75,
      color: Colors.orange.shade100,
      child: const Icon(Icons.pets, color: Colors.deepOrange),
    );
  }
}
