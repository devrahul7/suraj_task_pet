import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:petey_adoption_system/core/api/api_client.dart';
import 'package:petey_adoption_system/core/api/api_endpoints.dart';
import 'package:petey_adoption_system/core/services/storage/token_service.dart';
import 'package:petey_adoption_system/core/services/storage/user_session_service.dart';
import 'package:petey_adoption_system/features/auth/data/datasources/auth_datasource.dart';
import 'package:petey_adoption_system/features/auth/data/models/auth_api_model.dart';

//Provider
final authRemoteDatasourceProvider = Provider<IAuthRemoteDatasource>((ref) {
  final apiClient = ref.read(apiClientProvider);
  final userSessionService = ref.read(userSessionServiceProvider);
  final tokenService = ref.read(tokenServiceProvider);
  return AuthRemoteDatasource(
    apiClient: apiClient,
    userSessionService: userSessionService,
    tokenService: tokenService,
  );
});

class AuthRemoteDatasource implements IAuthRemoteDatasource {
  final ApiClient _apiClient;
  final UserSessionService _userSessionService;
  final TokenService _tokenService;

  AuthRemoteDatasource({
    required ApiClient apiClient,
    required UserSessionService userSessionService,
    required TokenService tokenService,
  }) : _apiClient = apiClient,
       _userSessionService = userSessionService,
       _tokenService = tokenService;

  @override
  Future<AuthApiModel?> login(String email, String password) async {
    final response = await _apiClient.post(
      ApiEndpoints.userLogin,
      data: {'email': email, 'password': password},
    );
    if (response.data['success'] == true) {
      final data = response.data['data'] as Map<String, dynamic>;
      final loggedInUser = AuthApiModel.fromJson(
        data['user'] as Map<String, dynamic>,
      );

      final token = data['accessToken'] as String;
      await _userSessionService.saveAuthToken(token);

      await _userSessionService.saveUserSession(
        userId: loggedInUser.id ?? '',
        username: loggedInUser.username,
        email: loggedInUser.email,
        phoneNumber: loggedInUser.phoneNumber,
        fullName: loggedInUser.fullName,
        profileImage: loggedInUser.profileImage,
        address: loggedInUser.address,
        location: loggedInUser.location,
        role: loggedInUser.role,
      );


      await _tokenService.saveToken(token);
      return loggedInUser;
    }
    return null;
  }

  @override
  Future<bool> logout() {
    // TODO: implement logout
    throw UnimplementedError();
  }

  @override
  Future<AuthApiModel?> register(AuthApiModel user) async {
    final response = await _apiClient.post(
      ApiEndpoints.userRegister,
      data: user.toJson(),
    );
    if (response.data['success'] == true) {
      final data = response.data['data'] as Map<String, dynamic>;
      final registeredUser = AuthApiModel.fromJson(
        data['user'] as Map<String, dynamic>,
      );
      return registeredUser;
    }
    return user;
  }

  @override
  Future<bool> deleteUser(String authId) {
    // TODO: implement deleteUser
    throw UnimplementedError();
  }

  @override
  Future<AuthApiModel?> getCurrentUser() {
    // TODO: implement getCurrentUser
    throw UnimplementedError();
  }

  @override
  Future<AuthApiModel?> getUserById(String authId) {
    // TODO: implement getUserById
    throw UnimplementedError();
  }

  @override
  Future<AuthApiModel?> getUserByEmail(String email) {
    // TODO: implement getUserByEmail
    throw UnimplementedError();
  }

  @override
  Future<bool> isEmailExists(String email) {
    // TODO: implement isEmailExists
    throw UnimplementedError();
  }

  @override
  Future<bool> updateUser(AuthApiModel model) {
    // TODO: implement updateUser
    throw UnimplementedError();
  }
}