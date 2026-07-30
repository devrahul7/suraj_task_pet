import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:local_auth/local_auth.dart';

final biometricServiceProvider = Provider<BiometricService>((ref) {
  return BiometricService();
});

class BiometricService {
  final LocalAuthentication _auth = LocalAuthentication();

  /// Check if device supports biometrics and has enrolled fingerprints/biometrics
  Future<bool> isBiometricAvailable() async {
    try {
      // 1. Check device hardware support
      final isSupported = await _auth.isDeviceSupported();
      if (!isSupported) return false;

      // 2. Check hardware biometrics exist
      final canCheck = await _auth.canCheckBiometrics;
      if (!canCheck) return false;

      // 3. Confirm at least one biometric is enrolled
      final available = await _auth.getAvailableBiometrics();
      return available.isNotEmpty;
    } catch (_) {
      return false;
    }
  }

  /// Trigger the real OS-level biometric prompt (fingerprint sensor).
  /// Returns a [BiometricResult] describing the outcome.
  Future<BiometricResult> authenticateWithSensor({
    String reason = 'Scan your fingerprint to log into PetEy',
  }) async {
    try {
      final available = await isBiometricAvailable();
      if (!available) {
        return BiometricResult.notAvailable;
      }

      // biometricOnly: true → forces fingerprint/face only, no PIN fallback
      // persistAcrossBackgrounding: true → keeps prompt alive if app loses focus
      final authenticated = await _auth.authenticate(
        localizedReason: reason,
        biometricOnly: true,
        persistAcrossBackgrounding: true,
        sensitiveTransaction: false,
      );

      return authenticated ? BiometricResult.success : BiometricResult.failed;
    } on LocalAuthException catch (e) {
      switch (e.code) {
        case LocalAuthExceptionCode.noBiometricsEnrolled:
        case LocalAuthExceptionCode.noBiometricHardware:
        case LocalAuthExceptionCode.noCredentialsSet:
        case LocalAuthExceptionCode.biometricHardwareTemporarilyUnavailable:
          return BiometricResult.notAvailable;
        case LocalAuthExceptionCode.temporaryLockout:
        case LocalAuthExceptionCode.biometricLockout:
          return BiometricResult.lockedOut;
        case LocalAuthExceptionCode.userCanceled:
        case LocalAuthExceptionCode.userRequestedFallback:
        case LocalAuthExceptionCode.systemCanceled:
        case LocalAuthExceptionCode.timeout:
          return BiometricResult.cancelled;
        default:
          return BiometricResult.failed;
      }
    } catch (_) {
      return BiometricResult.failed;
    }
  }
}

enum BiometricResult {
  /// Fingerprint/face was successfully verified by the real sensor
  success,
  /// Authentication dialog shown but biometric did not match
  failed,
  /// No biometric hardware or no enrolled fingerprints on device
  notAvailable,
  /// Too many failed attempts — biometrics temporarily locked
  lockedOut,
  /// User cancelled the biometric prompt
  cancelled,
}
