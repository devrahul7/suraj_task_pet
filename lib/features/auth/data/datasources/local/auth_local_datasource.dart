import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:petey_adoption_system/core/services/hive/hive_service.dart';
import 'package:petey_adoption_system/core/services/storage/user_session_service.dart';
import 'package:petey_adoption_system/features/auth/data/datasources/auth_datasource.dart';
import 'package:petey_adoption_system/features/auth/data/models/auth_hive_model.dart';

//Provider
final authLocalDatasourceProvider = Provider<AuthLocalDatasource>((ref) {
  final hiveService = ref.read(hiveServiceProvider);
  final userSessionService = ref.read(userSessionServiceProvider);
  return AuthLocalDatasource(hiveService: hiveService, userSessionService: userSessionService);
});

class AuthLocalDatasource implements IAuthLocalDatasource {
  final HiveService _hiveService;
  final UserSessionService _userSessionService;

  AuthLocalDatasource({
    required HiveService hiveService,
    required UserSessionService userSessionService,
  }) : _hiveService = hiveService,
       _userSessionService = userSessionService;

  @override
  Future<AuthHiveModel?> login(String email, String password) async {
    try {
      final user = await _hiveService.login(email, password);
      //Users ko details lai shared pref ma save garne
      if (user != null && user.authId != null) {
        //save user session to shared preferences
        await _userSessionService.saveUserSession(
          userId: user.authId!,
          username: user.username,
          email: user.email,
          phoneNumber: user.phoneNumber,
          fullName: user.fullName,
          profileImage: user.profilePicture ?? '',
          address: user.address ?? '',
          location: user.location ?? '',
          role: (user.email.toLowerCase() == 'admin@petey.com' ||
                  user.username.toLowerCase() == 'admin')
              ? 'ADMIN'
              : 'USER',
        );
      }
      return user;
    } catch (e) {
      return null;
    }
  }

  @override
  Future<bool> logout() async {
    try {
      await _hiveService.logOut();
      return Future.value(true);
    } catch (e) {
      return Future.value(false);
    }
  }

  @override
  Future<AuthHiveModel?> register(AuthHiveModel model) async {
    try {
      await _hiveService.registerUser(model);
      final role = (model.email.toLowerCase() == 'admin@petey.com' ||
              model.username.toLowerCase() == 'admin')
          ? 'ADMIN'
          : 'USER';
      await _userSessionService.saveUserSession(
        userId: model.authId ?? model.email,
        username: model.username,
        email: model.email,
        phoneNumber: model.phoneNumber,
        fullName: model.fullName,
        profileImage: model.profilePicture ?? '',
        address: model.address ?? '',
        location: model.location ?? '',
        role: role,
      );
      return Future.value(model);
    } catch (e) {
      return Future.value(null);
    }
  }

  @override
  Future<bool> isEmailExists(String email) {
    try {
      final exists = _hiveService.isEmailExists(email);
      return Future.value(exists);
    } catch (e) {
      return Future.value(false);
    }
  }
  
  @override
  Future<AuthHiveModel?> getCurrentUser() async {
    try {
      // Use saved session userId to look up the user in Hive
      final userId = _userSessionService.getUserId();
      if (userId != null && userId.isNotEmpty) {
        final byId = _hiveService.getUserById(userId);
        if (byId != null) return byId;
      }
      // Fallback: look up by saved email
      final email = _userSessionService.getUserEmail();
      if (email != null && email.isNotEmpty) {
        return _hiveService.getUserByEmail(email);
      }
      return null;
    } catch (_) {
      return null;
    }
  }

  @override
  Future<bool> deleteUser(String authId) async {
    try {
      await _hiveService.deleteUser(authId);
      return true;
    } catch (_) {
      return false;
    }
  }

  @override
  Future<AuthHiveModel?> getUserById(String authId) async {
    try {
      return _hiveService.getUserById(authId);
    } catch (_) {
      return null;
    }
  }

  @override
  Future<AuthHiveModel?> getUserByEmail(String email) async {
    try {
      return _hiveService.getUserByEmail(email);
    } catch (_) {
      return null;
    }
  }

  @override
  Future<bool> updateUser(AuthHiveModel model) async {
    try {
      await _hiveService.updateUser(model);
      return true;
    } catch (_) {
      return false;
    }
  }
}
