import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:shared_preferences/shared_preferences.dart';

//Shared Preferences Provider
final sharedPreferencesProvider = Provider<SharedPreferences>((ref) {
  //async
  //sync
  throw UnimplementedError(
    "Shared pref lai main.dart ma imoplement garinxha so tme dhukka basa ma dinxhu hai",
  );
});

//Provider for UserSessionService
final userSessionServiceProvider = Provider<UserSessionService>((ref) {
  return UserSessionService(prefs: ref.read(sharedPreferencesProvider));
});

class UserSessionService {
  //As a  private variable to hold the instance of SharedPreferences and
  //also we can make a private constructor to prevent instantiation of this class from outside and
  // also we can make a static method to get the instance of this class
  final SharedPreferences _prefs;
  final FlutterSecureStorage _secureStorage;

  UserSessionService({
    required SharedPreferences prefs,
    FlutterSecureStorage? secureStorage,
  }) : _prefs = prefs,
       _secureStorage = secureStorage ?? const FlutterSecureStorage();

  //Keys for storing user session data
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

  Future<void> saveAuthToken(String token) async {
    await _secureStorage.write(key: _keyAuthToken, value: token);
  }

  //Store user session data
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
  }

  //clear user session data
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
  }

  //Getters to retrieve user session data
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
