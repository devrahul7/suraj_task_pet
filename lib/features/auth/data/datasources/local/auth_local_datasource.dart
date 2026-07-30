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
  Future<AuthHiveModel?> getCurrentUser() {
    throw UnimplementedError();
    // try {
    //   final user = await _hiveService.getCurrentUser();
    //   return Future.value(user);
    // } catch (e) {
    //   return Future.value(null);
    // }
  }

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
  Future<bool> deleteUser(String authId) {
    // TODO: implement deleteUser
    throw UnimplementedError();
  }
  
  @override
  Future<AuthHiveModel?> getUserById(String authId) {
    // TODO: implement getUserById
    throw UnimplementedError();
  }
  
  @override
  Future<AuthHiveModel?> getUserByEmail(String email) {
    // TODO: implement getUserByEmail
    throw UnimplementedError();
  }
  
  @override
  Future<bool> updateUser(AuthHiveModel model) {
    // TODO: implement updateUser
    throw UnimplementedError();
  }
}
