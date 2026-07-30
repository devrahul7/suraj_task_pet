import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:shared_preferences/shared_preferences.dart';

final sharedPreferencesProvider = Provider<SharedPreferences>((ref) {
  throw UnimplementedError(
    "Shared pref is initialized in main.dart",
  );
});

final userSessionServiceProvider = Provider<UserSessionService>((ref) {
  return UserSessionService(prefs: ref.read(sharedPreferencesProvider));
});

class UserSessionService {
  final SharedPreferences _prefs;
  final FlutterSecureStorage _secureStorage;

  UserSessionService({
    required SharedPreferences prefs,
    FlutterSecureStorage? secureStorage,
  })  : _prefs = prefs,
        _secureStorage = secureStorage ?? const FlutterSecureStorage();

  static const String _keyAuthToken = 'auth_token';
  static const String _keysIsLoggedIn = 'is_logged_in';
  static const String _keyUserId = 'user_id';
  static const String _keyUsername = 'user_name';
  static const String _keyUserEmail = 'user_email';
  static const String _keyUserPhoneNumber = 'user_phone_number';
  static const String _keyUserFullName = 'user_full_name';
  static const String _keyUserProfilePicture = 'user_profile_picture';
  static const String _keyUserAddress = 'user_address';
  static const String _keyUserLocation = 'user_location';
  static const String _keyUserRole = 'user_role';

  // Biometric persistence keys (preserved across logout)
  static const String _keyBiometricEnabled = 'biometric_enabled';
  static const String _keyBiometricEmail = 'biometric_email';
  static const String _keyBiometricRole = 'biometric_role';
  static const String _keyBiometricUsername = 'biometric_username';
  static const String _keyBiometricFullName = 'biometric_full_name';

  Future<void> saveAuthToken(String token) async {
    await _secureStorage.write(key: _keyAuthToken, value: token);
  }

  Future<void> saveUserSession({
    required String userId,
    required String username,
    required String email,
    required String? phoneNumber,
    required String fullName,
    String? profileImage,
    String? address,
    String? location,
    String? role,
  }) async {
    await _prefs.setBool(_keysIsLoggedIn, true);
    await _prefs.setString(_keyUserId, userId);
    await _prefs.setString(_keyUsername, username);
    await _prefs.setString(_keyUserEmail, email);
    await _prefs.setString(_keyUserFullName, fullName);
    if (phoneNumber != null) {
      await _prefs.setString(_keyUserPhoneNumber, phoneNumber);
    }
    if (profileImage != null) {
      await _prefs.setString(_keyUserProfilePicture, profileImage);
    }
    if (address != null) {
      await _prefs.setString(_keyUserAddress, address);
    }
    if (location != null) {
      await _prefs.setString(_keyUserLocation, location);
    }
    if (role != null) {
      await _prefs.setString(_keyUserRole, role);
    }

    // Auto-update biometric account info if biometric is enabled
    if (isBiometricEnabled()) {
      await saveBiometricAccount(
        email: email,
        role: role ?? 'USER',
        username: username,
        fullName: fullName,
      );
    }
  }

  Future<void> saveBiometricAccount({
    required String email,
    required String role,
    String? username,
    String? fullName,
  }) async {
    await _prefs.setString(_keyBiometricEmail, email);
    await _prefs.setString(_keyBiometricRole, role);
    if (username != null) await _prefs.setString(_keyBiometricUsername, username);
    if (fullName != null) await _prefs.setString(_keyBiometricFullName, fullName);
  }

  Future<void> setBiometricEnabled(bool enabled) async {
    await _prefs.setBool(_keyBiometricEnabled, enabled);
    if (enabled) {
      final email = getUserEmail();
      final role = getUserRole();
      final username = getUsername();
      final fullName = getUserFullName();
      if (email != null) {
        await saveBiometricAccount(
          email: email,
          role: role ?? 'USER',
          username: username,
          fullName: fullName,
        );
      }
    }
  }

  bool isBiometricEnabled() {
    return _prefs.getBool(_keyBiometricEnabled) ?? false;
  }

  String? getBiometricEmail() {
    return _prefs.getString(_keyBiometricEmail) ?? getUserEmail();
  }

  String? getBiometricRole() {
    return _prefs.getString(_keyBiometricRole) ?? getUserRole();
  }

  String? getBiometricUsername() {
    return _prefs.getString(_keyBiometricUsername) ?? getUsername();
  }

  String? getBiometricFullName() {
    return _prefs.getString(_keyBiometricFullName) ?? getUserFullName();
  }

  Future<void> clearUserSession() async {
    await _secureStorage.delete(key: _keyAuthToken);
    await _prefs.remove(_keysIsLoggedIn);
    await _prefs.remove(_keyUserId);
    await _prefs.remove(_keyUsername);
    await _prefs.remove(_keyUserEmail);
    await _prefs.remove(_keyUserFullName);
    await _prefs.remove(_keyUserPhoneNumber);
    await _prefs.remove(_keyUserProfilePicture);
    await _prefs.remove(_keyUserAddress);
    await _prefs.remove(_keyUserLocation);
    await _prefs.remove(_keyUserRole);
    // Note: We DO NOT remove biometric account keys here so fingerprint login works on Login Page
  }

  bool isLoggedIn() {
    return _prefs.getBool(_keysIsLoggedIn) ?? false;
  }

  String? getUsername() {
    return _prefs.getString(_keyUsername);
  }

  String? getUserEmail() {
    return _prefs.getString(_keyUserEmail);
  }

  String? getUserPhoneNumber() {
    return _prefs.getString(_keyUserPhoneNumber);
  }

  String? getUserFullName() {
    return _prefs.getString(_keyUserFullName);
  }

  String? getUserProfilePicture() {
    return _prefs.getString(_keyUserProfilePicture);
  }

  String? getUserAddress() {
    return _prefs.getString(_keyUserAddress);
  }

  String? getUserLocation() {
    return _prefs.getString(_keyUserLocation);
  }

  String? getUserId() {
    return _prefs.getString(_keyUserId);
  }

  String? getUserRole() {
    return _prefs.getString(_keyUserRole);
  }
}
