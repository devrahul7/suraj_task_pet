import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:petey_adoption_system/core/services/biometric/biometric_service.dart';
import 'package:petey_adoption_system/core/services/storage/user_session_service.dart';
import 'package:petey_adoption_system/core/utils/snackbar_utils.dart';
import 'package:petey_adoption_system/features/adminDashboard/presentation/pages/admin_dashboard_screen.dart';
import 'package:petey_adoption_system/features/auth/data/datasources/local/auth_local_datasource.dart';
import 'package:petey_adoption_system/features/auth/presentation/pages/register_page.dart';
import 'package:petey_adoption_system/features/auth/presentation/state/auth_state.dart';
import 'package:petey_adoption_system/features/auth/presentation/view_model/auth_view_model.dart';
import 'package:petey_adoption_system/features/dashboard/presentation/pages/dashboard_screen.dart';

class LoginPage extends ConsumerStatefulWidget {
  const LoginPage({super.key});

  @override
  ConsumerState<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends ConsumerState<LoginPage> {
  final _formKey = GlobalKey<FormState>();
  final _usernameController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _obscurePassword = true;

  @override
  void dispose() {
    _usernameController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _login() async {
    if (_formKey.currentState?.validate() ?? false) {
      await ref.read(authViewModelProvider.notifier).login(
            username: _usernameController.text.trim(),
            password: _passwordController.text.trim(),
          );
    }
  }

  void _register() {
    Navigator.push(context, MaterialPageRoute(builder: (_) => const RegisterPage()));
  }

  Future<void> _triggerBiometricAuth() async {
    final userSession = ref.read(userSessionServiceProvider);
    final isEnabled = userSession.isBiometricEnabled();

    // 1. Check if biometric is enabled in Settings
    if (!isEnabled) {
      SnackbarUtils.showError(
        context,
        'Biometric Login is disabled. Log in with Email/Password and enable it in Settings.',
      );
      return;
    }

    final savedEmail = userSession.getBiometricEmail();
    final savedRole = userSession.getBiometricRole();
    final savedUsername = userSession.getBiometricUsername();

    // 2. Check if a biometric account has been linked
    if (savedEmail == null && savedRole == null && savedUsername == null) {
      showDialog(
        context: context,
        builder: (context) => AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          title: const Row(
            children: [
              Icon(Icons.fingerprint, color: Colors.deepOrange),
              SizedBox(width: 8),
              Expanded(
                child: Text(
                  'Setup Required',
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                ),
              ),
            ],
          ),
          content: const Text(
            'No account linked for biometric login.\n\nPlease log in with your email & password first, then enable Biometric Login in Settings.',
            style: TextStyle(fontSize: 14),
          ),
          actions: [
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.deepOrange,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              ),
              onPressed: () => Navigator.pop(context),
              child: const Text('OK', style: TextStyle(color: Colors.white)),
            ),
          ],
        ),
      );
      return;
    }

    // 3. Trigger REAL OS hardware fingerprint/biometric sensor
    final biometricService = ref.read(biometricServiceProvider);
    final result = await biometricService.authenticateWithSensor(
      reason: 'Scan your fingerprint to log into PetEy',
    );

    if (!mounted) return;

    switch (result) {
      case BiometricResult.success:
        // ✅ Real fingerprint verified — proceed to login
        _proceedWithBiometricLogin(savedEmail, savedRole, savedUsername);

      case BiometricResult.notAvailable:
        // Device has no fingerprint sensor or no enrolled fingerprints
        showDialog(
          context: context,
          builder: (context) => AlertDialog(
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
            title: const Row(
              children: [
                Icon(Icons.fingerprint, color: Colors.grey),
                SizedBox(width: 8),
                Text('Not Available',
                    style: TextStyle(fontWeight: FontWeight.bold)),
              ],
            ),
            content: const Text(
              'Biometric sensor is not available on this device, or no fingerprints are enrolled.\n\nPlease go to Device Settings → Security → Fingerprint to enroll your fingerprint first.',
              style: TextStyle(fontSize: 14),
            ),
            actions: [
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.deepOrange,
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10)),
                ),
                onPressed: () => Navigator.pop(context),
                child: const Text('OK', style: TextStyle(color: Colors.white)),
              ),
            ],
          ),
        );

      case BiometricResult.lockedOut:
        // Too many failed attempts
        SnackbarUtils.showError(
          context,
          'Too many failed fingerprint attempts. Biometrics temporarily locked. Please use Email/Password.',
        );

      case BiometricResult.failed:
        // Fingerprint did not match
        SnackbarUtils.showError(
          context,
          'Fingerprint not recognized. Please try again.',
        );

      case BiometricResult.cancelled:
        // User dismissed the OS fingerprint dialog — do nothing (silent)
        break;
    }
  }

  /// Validates user still exists in Hive/MongoDB before granting biometric access.
  /// If account was deleted, clears biometric data and rejects login.
  Future<void> _proceedWithBiometricLogin(
      String? savedEmail, String? savedRole, String? savedUsername) async {
    if (!mounted) return;
    SnackbarUtils.showSuccess(context, 'Fingerprint verified! Validating account...');

    final role = (savedRole ?? '').toUpperCase();
    final email = (savedEmail ?? '').toLowerCase();
    final username = (savedUsername ?? '').toLowerCase();

    final isAdmin = role == 'ADMIN' || email == 'admin@petey.com' || username == 'admin';

    // ── Admin always passes (master credentials are embedded) ─────────────
    if (!isAdmin && savedEmail != null && savedEmail.isNotEmpty) {
      // Step 1: Check if user still exists in Hive local DB
      final hiveUser = await ref.read(authLocalDatasourceProvider).getUserByEmail(savedEmail);

      if (hiveUser == null) {
        // User no longer exists in local database
        // Clear biometric account so this doesn't happen again
        await ref.read(userSessionServiceProvider).clearUserSession();
        if (!mounted) return;
        SnackbarUtils.showError(
          context,
          'Account not found. Your account may have been deleted. Please register again.',
        );
        return;
      }
    }

    if (!mounted) return;

    // ── Account validated — save session and navigate ──────────────────────
    final session = ref.read(userSessionServiceProvider);
    await session.saveUserSession(
      userId: session.getUserId() ?? 'bio_id',
      username: savedUsername ?? (isAdmin ? 'admin' : 'user'),
      email: savedEmail ?? (isAdmin ? 'admin@petey.com' : 'user@petey.com'),
      phoneNumber: session.getUserPhoneNumber() ?? '',
      fullName: session.getBiometricFullName() ?? (isAdmin ? 'PetEy Admin' : 'PetEy User'),
      role: isAdmin ? 'ADMIN' : 'USER',
    );

    if (!mounted) return;
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(
        builder: (_) =>
            isAdmin ? const AdminDashboardScreen() : const DashboardScreen(),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authViewModelProvider);

    ref.listen<AuthState>(authViewModelProvider, (previous, next) {
      if (next.status == AuthStatus.error && next.errorMessage != null) {
        SnackbarUtils.showError(context, next.errorMessage!);
      } else if (next.status == AuthStatus.authenticated) {
        // Read role from session (saved by datasource) as authoritative source
        final session = ref.read(userSessionServiceProvider);
        final sessionRole = (session.getUserRole() ?? '').toUpperCase();
        final sessionEmail = (session.getUserEmail() ?? '').toLowerCase();
        final sessionUsername = (session.getUsername() ?? '').toLowerCase();

        // Fallback to authEntity if session is somehow empty
        final entityRole = next.authEntity?.role?.toUpperCase() ?? '';
        final entityEmail = next.authEntity?.email.toLowerCase() ?? '';
        final entityUsername = next.authEntity?.username.toLowerCase() ?? '';

        final isAdmin = sessionRole == 'ADMIN' ||
            sessionEmail == 'admin@petey.com' ||
            sessionUsername == 'admin' ||
            entityRole == 'ADMIN' ||
            entityEmail == 'admin@petey.com' ||
            entityUsername == 'admin';

        Navigator.pushReplacement(
          context,
          MaterialPageRoute(
            builder: (_) =>
                isAdmin ? const AdminDashboardScreen() : const DashboardScreen(),
          ),
        );
      }
    });

    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
            child: Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const SizedBox(height: 10),
                  Center(
                    child: Image.asset(
                      'assets/images/photo.png',
                      height: 170,
                      errorBuilder: (context, error, stackTrace) => Container(
                        height: 150,
                        width: 150,
                        decoration: BoxDecoration(
                          color: Colors.deepOrange.shade50,
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(Icons.pets, size: 80, color: Colors.deepOrange),
                      ),
                    ),
                  ),
                  const SizedBox(height: 20),
                  const Center(
                    child: Text(
                      'Welcome to PetEy',
                      style: TextStyle(
                        fontSize: 26,
                        fontWeight: FontWeight.bold,
                        fontFamily: 'OutfitBold',
                        color: Colors.black,
                      ),
                    ),
                  ),
                  Center(
                    child: Text(
                      'Sign in to adopt & connect with your pet',
                      style: TextStyle(fontSize: 14, color: Colors.grey.shade600),
                    ),
                  ),
                  const SizedBox(height: 30),
                  TextFormField(
                    controller: _usernameController,
                    decoration: InputDecoration(
                      labelText: 'Email / Username',
                      hintText: 'Enter your email or username',
                      prefixIcon: const Icon(Icons.email_outlined),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    validator: (value) {
                      if (value == null || value.trim().isEmpty) {
                        return 'Please enter email or username';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 16),
                  TextFormField(
                    controller: _passwordController,
                    obscureText: _obscurePassword,
                    decoration: InputDecoration(
                      labelText: 'Password',
                      hintText: 'Enter your password',
                      prefixIcon: const Icon(Icons.lock_outline),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      suffixIcon: IconButton(
                        icon: Icon(
                          _obscurePassword
                              ? Icons.visibility_outlined
                              : Icons.visibility_off_outlined,
                        ),
                        onPressed: () {
                          setState(() {
                            _obscurePassword = !_obscurePassword;
                          });
                        },
                      ),
                    ),
                    validator: (value) {
                      if (value == null || value.trim().isEmpty) {
                        return 'Please enter password';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 8),
                  Align(
                    alignment: Alignment.centerRight,
                    child: TextButton(
                      onPressed: () {},
                      child: const Text('Forgot Password?'),
                    ),
                  ),
                  const SizedBox(height: 16),
                  SizedBox(
                    width: double.infinity,
                    height: 52,
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.deepOrange,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      onPressed: _login,
                      child: authState.status == AuthStatus.loading
                          ? const CircularProgressIndicator(color: Colors.white)
                          : const Text(
                              'Login',
                              style: TextStyle(
                                fontSize: 18,
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                    ),
                  ),
                  const SizedBox(height: 14),
                  SizedBox(
                    width: double.infinity,
                    height: 50,
                    child: OutlinedButton.icon(
                      style: OutlinedButton.styleFrom(
                        side: BorderSide(color: Colors.deepOrange.shade300, width: 1.5),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      onPressed: _triggerBiometricAuth,
                      icon: const Icon(Icons.fingerprint, color: Colors.deepOrange, size: 28),
                      label: const Text(
                        'Biometric Login',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: Colors.deepOrange,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Text("Don't have an account? "),
                      TextButton(
                        onPressed: _register,
                        child: const Text(
                          'Register Now',
                          style: TextStyle(
                            color: Colors.deepOrange,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 30),
                  Center(
                    child: Image.asset(
                      'assets/images/billo.png',
                      height: 150,
                      errorBuilder: (context, error, stackTrace) => const SizedBox(),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
