import 'package:petey_adoption_system/features/auth/data/models/auth_api_model.dart';
import 'package:petey_adoption_system/features/auth/data/models/auth_hive_model.dart';

abstract interface class IAuthLocalDatasource {
  Future<AuthHiveModel?> register(AuthHiveModel model);
  Future<AuthHiveModel?> login(String email, String password);
  Future<AuthHiveModel?> getCurrentUser();
  Future<bool> logout();
  Future<bool> updateUser(AuthHiveModel model);
  Future<bool> deleteUser(String authId);




  //Other Function can also be created...
  Future<bool> isEmailExists(String email);
  Future<AuthHiveModel?> getUserByEmail(String email);
  Future<AuthHiveModel?> getUserById(String authId);

}


abstract interface class IAuthRemoteDatasource {
  Future<AuthApiModel?> register(AuthApiModel model);
  Future<AuthApiModel?> login(String email, String password);
  Future<AuthApiModel?> getCurrentUser();
  Future<bool> logout();
  Future<bool> updateUser(AuthApiModel model);
  Future<bool> deleteUser(String authId);




  //Other Function can also be created...
  Future<bool> isEmailExists(String email);
  Future<AuthApiModel?> getUserByEmail(String email);
  Future<AuthApiModel?> getUserById(String authId);
  
}