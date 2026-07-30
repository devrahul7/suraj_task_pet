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

//Provider
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
  }) : _authDatasource = authDatasource,
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
          return Right(entity);
        }
        return Left(ApiFailure(message: "Invalid email or password"));
      } on DioException catch (e) {
        return Left(
          ApiFailure(
            message: e.response?.data['message'] ?? "Failed to login user",
            statusCode: e.response?.statusCode,
          ),
        );
      } catch (e) {
        return Left(ApiFailure(message: e.toString()));
      }
    } else {
      try {
        final result = await _authDatasource.login(email, password);
        if (result != null) {
          //model lai entity ma convert gara
          final entity = result.toEntity();
          return Right(entity);
        }
        return Left(LocalDatabaseFailure(message: "Invalid email or password"));
      } catch (e) {
        return Left(LocalDatabaseFailure(message: e.toString()));
      }
    }
  }

  @override
  Future<Either<Failure, bool>> logout() async {
    try {
      final result = await _authDatasource.logout();
      if (result) {
        return Right(true);
      }
      return Left(LocalDatabaseFailure(message: "Failed to logout User"));
    } catch (e) {
      return Left(LocalDatabaseFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, bool>> register(AuthEntity user) async {
    if (await _networkInfo.isConnected) {
      try {
        //if internet then go to remote datasource
        final apiModel = AuthApiModel.fromEntity(user);
        await _authRemoteDatasource.register(apiModel);
        return Right(true);
      } on DioException catch (e) {
        return Left(
          ApiFailure(
            message: e.response?.data['message'] ?? "Failed to register user",
            statusCode: e.response?.statusCode,
          ),
        );
      } catch (e) {
        return Left(ApiFailure(message: e.toString()));
      }
    } else {
      try {
        //check if email already exists
        final existingUser = await _authDatasource.getUserByEmail(user.email);

        if (existingUser != null) {
          return Left(LocalDatabaseFailure(message: "Email already exists"));
        }

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
        await _authDatasource.register(authModel);
        return Right(true);
      } catch (e) {
        return Left(LocalDatabaseFailure(message: e.toString()));
      }
    }
  }
  @override
  Future<Either<Failure, AuthEntity>> getCurrentUser() async {
    try {
      final result = await _authDatasource.getCurrentUser();
      if (result != null) {
        //model lai entity ma convert gara
        final entity = result.toEntity();
        return Right(entity);
      }
      return Left(LocalDatabaseFailure(message: "No user logged in"));
    } catch (e) {
      return Left(LocalDatabaseFailure(message: e.toString()));
    }
  }
}
