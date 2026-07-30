import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

// Provider for TokenService (No longer needs pre-initialized SharedPreferences!)
final tokenServiceProvider = Provider<TokenService>((ref) {
  return TokenService(secureStorage: const FlutterSecureStorage());
});

class TokenService {
  final FlutterSecureStorage _secureStorage;
  static const String _tokenKey = 'auth_token';

  TokenService({required FlutterSecureStorage secureStorage}) : _secureStorage = secureStorage;

  // Save token securely
  Future<void> saveToken(String token) async {
    await _secureStorage.write(key: _tokenKey, value: token);
  }

  // Get token securely
  Future<String?> getToken() async {
    return await _secureStorage.read(key: _tokenKey);
  }

  // Delete token securely
  Future<void> deleteToken() async {
    await _secureStorage.delete(key: _tokenKey);
  }
}