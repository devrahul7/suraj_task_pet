// ignore_for_file: public_member_api_docs, sort_constructors_first
import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:petey_adoption_system/core/error/failures.dart';
import 'package:petey_adoption_system/core/services/connectivity/network_info.dart';
import 'package:petey_adoption_system/features/auth/data/datasources/auth_datasource.dart';
import 'package:petey_adoption_system/features/auth/data/datasources/local/auth_local_datasource.dart';
import 'package:petey_adoption_system/features/auth/data/datasources/remote/auth_remote_datasource.dart';
import 'package:petey_adoption_system/features/auth/data/models/auth_api_model.dart';
import 'package:petey_adoption_system/features/auth/data/models/auth_hive_model.dart';
import 'package:petey_adoption_system/features/auth/domain/entities/auth_entity.dart';
import 'package:petey_adoption_system/features/auth/domain/repositories/auth_repository.dart';

// Provider
final authRepositoryProvider = Provider<IAuthRepository>((ref) {
  return AuthRepository(
    authDatasource: ref.read(authLocalDatasourceProvider),
    authRemoteDatasource: ref.read(authRemoteDatasourceProvider),
    networkInfo: ref.read(networkInfoProvider),
  );
});

class AuthRepository implements IAuthRepository {
  final IAuthLocalDatasource _authDatasource;
  final IAuthRemoteDatasource _authRemoteDatasource;
  final NetworkInfo _networkInfo;

  AuthRepository({
    required IAuthLocalDatasource authDatasource,
    required IAuthRemoteDatasource authRemoteDatasource,
    required NetworkInfo networkInfo,
  })  : _authDatasource = authDatasource,
        _authRemoteDatasource = authRemoteDatasource,
        _networkInfo = networkInfo;

  @override
  Future<Either<Failure, AuthEntity>> login(
    String email,
    String password,
  ) async {
    if (await _networkInfo.isConnected) {
      try {
        final apiModel = await _authRemoteDatasource.login(email, password);
        if (apiModel != null) {
          final entity = apiModel.toEntity();
          final authModel = AuthHiveModel(
            fullName: entity.fullName,
            email: entity.email,
            phoneNumber: entity.phoneNumber,
            username: entity.username,
            password: password,
            address: entity.address,
            profilePicture: entity.profilePicture,
            location: entity.location,
          );
          try {
            await _authDatasource.register(authModel);
          } catch (_) {}
          return Right(entity);
        }
      } on DioException catch (e) {
        if (e.response?.statusCode == 400 || e.response?.statusCode == 401) {
          return Left(ApiFailure(message: "Invalid email or password"));
        }
      } catch (_) {}
    }

    // 2. Fallback to Hive local database login
    try {
      final result = await _authDatasource.login(email, password);
      if (result != null) {
        return Right(result.toEntity());
      }
    } catch (_) {}

    return Left(ApiFailure(message: "Invalid email or password"));
  }

  @override
  Future<Either<Failure, bool>> logout() async {
    try {
      final result = await _authDatasource.logout();
      if (result) {
        return const Right(true);
      }
      return Left(LocalDatabaseFailure(message: "Failed to logout User"));
    } catch (e) {
      return Left(LocalDatabaseFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, bool>> register(AuthEntity user) async {
    final authModel = AuthHiveModel(
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      username: user.username,
      password: user.password,
      address: user.address,
      profilePicture: user.profilePicture,
      location: user.location,
    );

    // Save to Hive local database storage first
    try {
      await _authDatasource.register(authModel);
    } catch (_) {}

    // Sync with remote MongoDB server if reachable
    try {
      final apiModel = AuthApiModel.fromEntity(user);
      await _authRemoteDatasource.register(apiModel);
    } on DioException catch (e) {
      if (e.response?.data is Map && e.response?.data.containsKey('message')) {
        final msg = e.response?.data['message'].toString() ?? '';
        if (msg.toLowerCase().contains('exists')) {
          return Left(ApiFailure(message: msg));
        }
      }
    } catch (_) {}

    return const Right(true);
  }

  @override
  Future<Either<Failure, AuthEntity>> getCurrentUser() async {
    try {
      final result = await _authDatasource.getCurrentUser();
      if (result != null) {
        final entity = result.toEntity();
        return Right(entity);
      }
      return Left(LocalDatabaseFailure(message: "No user logged in"));
    } catch (e) {
      return Left(LocalDatabaseFailure(message: e.toString()));
    }
  }
}
