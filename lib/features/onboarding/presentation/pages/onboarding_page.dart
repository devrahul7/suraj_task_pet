import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:petey_adoption_system/features/auth/presentation/pages/login_page.dart';
import 'package:shared_preferences/shared_preferences.dart';

class OnboardingPage extends ConsumerStatefulWidget {
  const OnboardingPage({super.key});

  @override
  ConsumerState<OnboardingPage> createState() => _OnboardingPageState();
}

class _OnboardingItem {
  final String image;
  final String title;
  final String description;

  _OnboardingItem({
    required this.image,
    required this.title,
    required this.description,
  });
}

class _OnboardingPageState extends ConsumerState<OnboardingPage> {
  final PageController _controller = PageController();
  int _currentIndex = 0;

  final List<_OnboardingItem> _pages = [
    _OnboardingItem(
      image: "assets/images/pet.jpg",
      title: "Welcome to PetEy",
      description:
          "Find your perfect furry companion that will fill your home with happiness and unconditional love.",
    ),
    _OnboardingItem(
      image: "assets/images/pet1.jpg",
      title: "Discover Your Match",
      description:
          "Browse shelters, schedule meet & greets, and adopt pets seamlessly through our platform.",
    ),
    _OnboardingItem(
      image: "assets/images/pet2.jpeg",
      title: "AI Pet Recommendation",
      description:
          "Our OpenAI algorithm evaluates your home, activity, and lifestyle to recommend your ideal pet match.",
    ),
  ];

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  Future<void> _finishOnboarding() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool("seenOnboarding", true);

    if (!mounted) return;

    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (_) => const LoginPage()),
    );
  }

  void _nextPage() {
    if (_currentIndex == _pages.length - 1) {
      _finishOnboarding();
    } else {
      _controller.nextPage(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
    }
  }

  Widget _buildDot(int index) {
    return AnimatedContainer(
      duration: const Duration(milliseconds: 300),
      margin: const EdgeInsets.symmetric(horizontal: 4),
      width: _currentIndex == index ? 24 : 8,
      height: 8,
      decoration: BoxDecoration(
        color: _currentIndex == index ? Colors.deepOrange : Colors.grey.shade300,
        borderRadius: BorderRadius.circular(10),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    bool isLast = _currentIndex == _pages.length - 1;
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Column(
          children: [
            Align(
              alignment: Alignment.centerRight,
              child: TextButton(
                onPressed: _finishOnboarding,
                child: const Text(
                  "Skip",
                  style: TextStyle(
                    color: Colors.deepOrange,
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                  ),
                ),
              ),
            ),
            Expanded(
              child: PageView.builder(
                controller: _controller,
                itemCount: _pages.length,
                onPageChanged: (index) {
                  setState(() => _currentIndex = index);
                },
                itemBuilder: (context, index) {
                  final page = _pages[index];

                  return Padding(
                    padding: const EdgeInsets.all(24),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        ClipRRect(
                          borderRadius: BorderRadius.circular(20),
                          child: Image.asset(
                            page.image,
                            height: 260,
                            width: double.infinity,
                            fit: BoxFit.cover,
                            errorBuilder: (context, error, stackTrace) => Container(
                              height: 260,
                              decoration: BoxDecoration(
                                color: Colors.deepOrange.shade50,
                                borderRadius: BorderRadius.circular(20),
                              ),
                              child: const Icon(
                                Icons.pets,
                                size: 100,
                                color: Colors.deepOrange,
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(height: 32),
                        Text(
                          page.title,
                          style: const TextStyle(
                            fontSize: 26,
                            fontWeight: FontWeight.bold,
                            fontFamily: 'OutfitBold',
                            color: Colors.black,
                          ),
                          textAlign: TextAlign.center,
                        ),
                        const SizedBox(height: 14),
                        Text(
                          page.description,
                          style: TextStyle(
                            fontSize: 15,
                            color: Colors.grey.shade700,
                            height: 1.4,
                          ),
                          textAlign: TextAlign.center,
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(
                _pages.length,
                (index) => _buildDot(index),
              ),
            ),
            const SizedBox(height: 24),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
              child: SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                  onPressed: _nextPage,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.deepOrange,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14),
                    ),
                  ),
                  child: Text(
                    isLast ? "Get Started" : "Next",
                    style: const TextStyle(
                      fontSize: 17,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}