/// Runtime configuration for PetEy.
///
/// Centralises environment-specific values (e.g. API base URLs, feature flags).
/// Swap to a real env-file loader (e.g. flutter_dotenv) for production.
class AppConfig {
  AppConfig._();

  // ─── Environment ───────────────────────────────────────────────────
  static const bool isProduction = false;
  static const bool enableLogging = !isProduction;

  // ─── API ───────────────────────────────────────────────────────────
  /// Base URL for the remote API. Change to your production URL when deploying.
  static const String apiBaseUrl = 'https://api.petey.example.com/v1';

  /// Request timeout duration.
  static const Duration requestTimeout = Duration(seconds: 30);

  // ─── Stripe ────────────────────────────────────────────────────────
  static const String stripePublishableKey =
      'pk_test_51TyxvKFBjDySgeKc3jKbpTVTQCMEWlJOyF20iEsyqfn9bpUooqTdlBgDKsif1kzjM44CIpGVT7PPusM0jsIo8pKX00GThaDo3i';
  static const String stripeSecretKey =
      'sk_test_51TyxvKFBjDySgeKcrfb1NOJI1W1PUSRNriCE8Lo4QzsxSrmdpAmgHIvTPshtTugTUjC2aSRwhdnS26t06TXHhcpR000jjSACrf';

  // ─── OpenAI ────────────────────────────────────────────────────────
  static const String openAiApiKey =
      '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';

  /// Stripe return URL scheme used after payment redirect.
  static const String stripeReturnUrl = 'petey://stripe-redirect';

  // ─── Feature Flags ─────────────────────────────────────────────────
  /// Whether the biometric login feature is enabled.
  static const bool biometricLoginEnabled = true;

  /// Whether adoption payment via Stripe is enabled.
  static const bool stripePaymentEnabled = true;

  /// Whether push notifications are enabled.
  static const bool notificationsEnabled = false;

  // ─── App Store / Links ─────────────────────────────────────────────
  static const String privacyPolicyUrl = 'https://petey.example.com/privacy';
  static const String termsOfServiceUrl = 'https://petey.example.com/terms';
  static const String supportEmail = 'support@petey.example.com';
}
