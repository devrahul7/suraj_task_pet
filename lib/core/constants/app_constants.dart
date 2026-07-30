/// App-wide constants for PetEy Adoption System.
/// All magic strings, numbers, and keys are centralised here.
class AppConstants {
  // Private constructor — static-only class
  AppConstants._();

  // ─── App Identity ─────────────────────────────────────────────────
  static const String appName = 'PetEy';
  static const String appTagline = 'Find your perfect companion';
  static const String appVersion = '1.0.0';

  // ─── Default Admin Credentials (seeded at first launch) ───────────
  static const String defaultAdminEmail = 'admin@petey.com';
  static const String defaultAdminUsername = 'admin';
  static const String defaultAdminPassword = 'Admin@123';
  static const String defaultAdminFullName = 'PetEy Admin';
  static const String defaultAdminPhone = '9800000000';

  // ─── User Roles ────────────────────────────────────────────────────
  static const String roleAdmin = 'ADMIN';
  static const String roleUser = 'USER';

  // ─── Adoption Status Keys ──────────────────────────────────────────
  static const String statusPending = 'PENDING';
  static const String statusApproved = 'APPROVED';
  static const String statusRejected = 'REJECTED';
  static const String statusPaid = 'PAID';
  static const String statusAdopted = 'ADOPTED';

  // ─── Pet Species ───────────────────────────────────────────────────
  static const String speciesDog = 'Dog';
  static const String speciesCat = 'Cat';
  static const String speciesRabbit = 'Rabbit';
  static const String speciesBird = 'Bird';
  static const String speciesOther = 'Other';

  // ─── SharedPreferences Keys ────────────────────────────────────────
  static const String prefUserId = 'user_id';
  static const String prefUsername = 'username';
  static const String prefEmail = 'email';
  static const String prefRole = 'role';
  static const String prefFullName = 'full_name';
  static const String prefPhoneNumber = 'phone_number';
  static const String prefIsBiometricEnabled = 'is_biometric_enabled';
  static const String prefBiometricEmail = 'biometric_email';
  static const String prefBiometricRole = 'biometric_role';
  static const String prefBiometricUsername = 'biometric_username';
  static const String prefBiometricFullName = 'biometric_full_name';

  // ─── Stripe ────────────────────────────────────────────────────────
  static const String stripePublishableKey =
      'pk_test_51TyxvKFBjDySgeKc3jKbpTVTQCMEWlJOyF20iEsyqfn9bpUooqTdlBgDKsif1kzjM44CIpGVT7PPusM0jsIo8pKX00GThaDo3i';
  static const String stripeSecretKey =
      'sk_test_51TyxvKFBjDySgeKcrfb1NOJI1W1PUSRNriCE8Lo4QzsxSrmdpAmgHIvTPshtTugTUjC2aSRwhdnS26t06TXHhcpR000jjSACrf';
  static const String stripeMerchantId = 'petey-adoption';

  // ─── OpenAI AI Recommendation ─────────────────────────────────────
  static const String openAiApiKey =
      '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';

  // ─── Pagination ────────────────────────────────────────────────────
  static const int defaultPageSize = 20;

  // ─── Visit Types ───────────────────────────────────────────────────
  static const String visitTypeInPerson = 'In-Person';
  static const String visitTypeVirtual = 'Virtual';

  // ─── Timeouts ──────────────────────────────────────────────────────
  static const Duration networkTimeout = Duration(seconds: 30);
  static const Duration biometricTimeout = Duration(seconds: 60);
}
