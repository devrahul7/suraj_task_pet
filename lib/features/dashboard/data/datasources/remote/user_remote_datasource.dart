import 'dart:io';

import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:petey_adoption_system/core/api/api_client.dart';
import 'package:petey_adoption_system/core/api/api_endpoints.dart';
import 'package:petey_adoption_system/core/services/storage/token_service.dart';
import 'package:petey_adoption_system/features/dashboard/data/datasources/user_datasource.dart';

//Provider for UserRemoteDatasource
final userRemoteDatasourceProvider = Provider<IUserRemoteDatasource>((ref) {
  final apiClient = ref.read(apiClientProvider);
  final tokenService = ref.read(tokenServiceProvider);
  return UserRemoteDatasource(apiClient: apiClient, tokenService: tokenService);
});

class UserRemoteDatasource implements IUserRemoteDatasource {
  final ApiClient _apiClient;
  final TokenService _tokenService;

  UserRemoteDatasource({
    required ApiClient apiClient,
    required TokenService tokenService,
  }) : _apiClient = apiClient,
       _tokenService = tokenService;

  @override
  Future<String> uploadProfileImage(File image) async {
    // Implement the logic to upload the profile image using the ApiClient.
    // can use the uploadFile method of ApiClient to send a multipart request.
    final fileName = image.path.split('/').last;
    final formData = FormData.fromMap({
      'profileImage': await MultipartFile.fromFile(
        image.path,
        filename: fileName,
      ),
    });
    //get token from token service
    final token = await _tokenService.getToken();
    final response = await _apiClient.uploadFile(
      ApiEndpoints.uploadImage,
      formData: formData,
      options: Options(
        headers: {
          'Authorization': 'Bearer $token'
        }
      )
    );
    return response.data['data'];
  }
}
